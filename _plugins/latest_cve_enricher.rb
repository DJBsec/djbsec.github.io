# frozen_string_literal: true

require "date"
require "json"
require "net/http"
require "set"
require "timeout"
require "uri"

module LatestCveEnricher
  CVE_PATTERN = /\bCVE-\d{4}-\d{4,7}\b/i
  USER_AGENT = "DJBSec latest-CVE enricher (+https://djbsec.github.io)"
  MAX_ARTICLE_LINKS = 10
  MAX_CVES = 3
  RECENT_DAYS = 7

  class Generator < Jekyll::Generator
    safe true
    priority :low

    def generate(site)
      return if ENV["DISABLE_LATEST_CVE_ENRICHER"] == "1"

      latest_post = latest_cybernews_post(site)
      return unless latest_post
      return if latest_post.data["cves"].is_a?(Array) && latest_post.data["cves"].any?

      post_text = strip_html("#{latest_post.data["title"]}\n#{latest_post.content}")
      corpus = [post_text]
      article_links(latest_post.content).each do |url|
        fetched = fetch_text(url)
        corpus << fetched if fetched && !fetched.empty?
      end

      combined_text = corpus.join("\n")
      explicit_ids = post_text.scan(CVE_PATTERN).map { |id| id.upcase }.to_set
      cves = ranked_cves(combined_text, explicit_ids, site.time)
      latest_post.data["cves"] = cves if cves.any?
    rescue StandardError => e
      Jekyll.logger.warn "Latest CVE enricher:", "skipped (#{e.class}: #{e.message})"
    end

    private

    def latest_cybernews_post(site)
      site.posts.docs
          .select { |post| post.data["categories"].to_s.include?("News") }
          .max_by { |post| post.data["date"] || post.date }
    end

    def article_links(content)
      content.scan(/\[Read More\]\((https?:\/\/[^)]+)\)/i).flatten.uniq.first(MAX_ARTICLE_LINKS)
    end

    def fetch_text(url)
      uri = URI.parse(url)
      return "" unless uri.is_a?(URI::HTTP)

      response = Timeout.timeout(8) do
        request = Net::HTTP::Get.new(uri)
        request["User-Agent"] = USER_AGENT
        request["Accept"] = "text/html,application/xhtml+xml"

        Net::HTTP.start(uri.host, uri.port, use_ssl: uri.scheme == "https", open_timeout: 4, read_timeout: 6) do |http|
          http.request(request)
        end
      end
      return "" unless response.is_a?(Net::HTTPSuccess)

      html = response.body.to_s.dup.force_encoding("UTF-8")
      html = html.encode("UTF-8", invalid: :replace, undef: :replace, replace: " ")

      extract_story_context(html)
    rescue StandardError
      ""
    end

    def extract_story_context(html)
      snippets = []
      html.scan(/<title\b[^>]*>(.*?)<\/title>/im) { |match| snippets << match.first }
      html.scan(/<h1\b[^>]*>(.*?)<\/h1>/im) { |match| snippets << match.first }
      html.scan(/<meta\b[^>]*(?:name|property)=["'](?:description|og:title|og:description|twitter:title|twitter:description)["'][^>]*content=["']([^"']+)["'][^>]*>/im) do |match|
        snippets << match.first
      end
      html.scan(/<meta\b[^>]*content=["']([^"']+)["'][^>]*(?:name|property)=["'](?:description|og:title|og:description|twitter:title|twitter:description)["'][^>]*>/im) do |match|
        snippets << match.first
      end

      strip_html(snippets.join(" "))
    end

    def strip_html(html)
      html.gsub(/<script\b.*?<\/script>/im, " ")
          .gsub(/<style\b.*?<\/style>/im, " ")
          .gsub(/<[^>]+>/, " ")
          .gsub(/&[a-zA-Z0-9#]+;/, " ")
          .gsub(/\s+/, " ")
    end

    def ranked_cves(text, explicit_ids, site_time)
      kev_entries = fetch_kev_entries
      recent_cutoff = site_time.to_date - RECENT_DAYS

      candidates = kev_entries.filter_map do |entry|
        cve_id = entry["cveID"].to_s.upcase
        next if cve_id.empty?

        explicit_match = explicit_ids.include?(cve_id)
        score = explicit_match ? 100 : 0
        match = keyword_score(text, entry)
        score += match[:score]

        date_added = parse_date(entry["dateAdded"])
        recent_kev = date_added && date_added >= recent_cutoff
        score += 5 if recent_kev

        next if !explicit_match && !recent_kev
        next unless explicit_match || match[:product_hits].positive?
        next if !explicit_match && score < 10

        [score, date_added || Date.new(1970, 1, 1), entry]
      end

      explicit_ids.each do |cve_id|
        next if candidates.any? { |_score, _date, entry| entry["cveID"].to_s.upcase == cve_id }

        candidates << [100, Date.new(1970, 1, 1), { "cveID" => cve_id }]
      end

      candidates
        .sort_by { |score, date, _entry| [-score, -date.jd] }
        .first(MAX_CVES)
        .filter_map { |_score, _date, entry| enrich_cve(entry) }
    end

    def keyword_score(text, entry)
      searchable = text.downcase
      score = 0
      score += 3 if phrase_hit?(searchable, entry["vendorProject"])

      product_tokens = keyword_tokens(entry["product"]) - keyword_tokens(entry["vendorProject"])
      product_hits = product_tokens.count { |token| searchable.include?(token.downcase) }
      score += product_hits * 5

      if product_hits.positive?
        vuln_tokens = keyword_tokens(entry["vulnerabilityName"])
        score += vuln_tokens.count { |token| searchable.include?(token.downcase) } * 2
      end

      { score: score, product_hits: product_hits }
    end

    def phrase_hit?(text, value)
      phrase = value.to_s.downcase.gsub(/[^a-z0-9]+/, " ").strip
      !phrase.empty? && text.include?(phrase)
    end

    def keyword_tokens(value)
      stop_words = Set.new(%w[
        vulnerability vulnerabilities critical function enterprise manager mobile
        improper missing code command injection remote local authenticated
        unauthenticated access control windows product project
        active adaptive agent appliance authentication business defense firewall secure security
        cloud core endpoint event operating service small standard system technology threat
      ])

      value.to_s
           .scan(/[a-zA-Z][a-zA-Z0-9-]{3,}/)
           .map(&:downcase)
           .reject { |token| stop_words.include?(token) }
           .uniq
    end

    def fetch_kev_entries
      uri = URI.parse("https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json")
      response = Timeout.timeout(8) do
        Net::HTTP.get_response(uri)
      end
      return [] unless response.is_a?(Net::HTTPSuccess)

      JSON.parse(response.body).fetch("vulnerabilities", [])
    rescue StandardError
      []
    end

    def enrich_cve(entry)
      cve_id = entry["cveID"].to_s.upcase
      return nil if cve_id.empty?

      cve_record = fetch_json("https://cveawg.mitre.org/api/cve/#{cve_id}")
      epss_record = fetch_json("https://api.first.org/data/v1/epss?cve=#{cve_id}")

      {
        "name" => cve_name(cve_id, entry, cve_record),
        "epss" => epss_label(epss_record),
        "cvss" => cvss_score(cve_record, entry),
        "kev" => !entry["dateAdded"].to_s.empty?
      }.compact
    end

    def fetch_json(url)
      uri = URI.parse(url)
      response = Timeout.timeout(8) do
        Net::HTTP.get_response(uri)
      end
      return nil unless response.is_a?(Net::HTTPSuccess)

      JSON.parse(response.body)
    rescue StandardError
      nil
    end

    def cve_name(cve_id, entry, cve_record)
      title = entry["vulnerabilityName"].to_s
      title = cve_record.dig("containers", "cna", "title").to_s if title.empty? && cve_record
      title = entry["product"].to_s if title.empty?
      title = "Vulnerability" if title.empty?

      "#{cve_id} — #{title}"
    end

    def epss_label(epss_record)
      value = epss_record&.dig("data", 0, "epss")
      return nil unless value

      "#{(value.to_f * 100).round(3)}%"
    end

    def cvss_score(cve_record, entry)
      score = cve_record&.dig("containers", "cna", "metrics")&.filter_map do |metric|
        metric.dig("cvssV4_0", "baseScore") ||
          metric.dig("cvssV3_1", "baseScore") ||
          metric.dig("cvssV3_0", "baseScore")
      end&.max

      score || entry["cvssScore"]
    end

    def parse_date(value)
      Date.parse(value.to_s)
    rescue StandardError
      nil
    end
  end
end
