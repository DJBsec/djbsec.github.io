#!/usr/bin/env python3
"""
claude-code-radar / build_html.py

Reads the latest data-YYYY-MM-DD.json and writes a self-contained, interactive
HTML report: search box, category filters, and a sortable table of repos.
Click any row to expand its plain-language summary, topics, and the heuristic
security score's contributing factors.

Usage: python build_html.py [path-to-data.json]
       (defaults to the newest data-*.json in the current directory)
"""

import glob
import html
import json
import os
import sys
import datetime as dt
from collections import Counter

# Anchor paths to this script's folder so it works regardless of the directory
# the scheduled task runs from. JSON is read from ./json, HTML written to ./html.
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
JSON_DIR = os.path.join(SCRIPT_DIR, "json")
HTML_DIR = os.path.join(SCRIPT_DIR, "html")


def newest_data():
    files = sorted(glob.glob(os.path.join(JSON_DIR, "data-*.json")))
    if not files:
        sys.exit(f"No data-*.json found in {JSON_DIR}. Run scan.py first.")
    return files[-1]


def esc(s):
    return html.escape(str(s), quote=True)


def score_class(score):
    if score >= 75:
        return "s-low"
    if score >= 55:
        return "s-mod"
    if score >= 35:
        return "s-elev"
    return "s-high"


# Maps the Cowork session's risk word to a sort weight, display label, and color
# class. The pseudo-score only drives sorting; the displayed verdict is the word.
CLAUDE_RISK = {
    "low":      (90, "Lower risk",  "s-low"),
    "moderate": (65, "Moderate",    "s-mod"),
    "elevated": (45, "Elevated",    "s-elev"),
    "high":     (20, "Higher risk", "s-high"),
}


def build(data):
    repos = data["repos"]
    gen = data["generated_at"]
    all_cats = sorted({c for r in repos for c in r["categories"]})

    rows = []
    bands = []
    for r in repos:
        sec = r["security"]
        factor_rows = "".join(
            f'<li class="f-{esc(sym)}"><span>{esc(txt)}</span></li>'
            for sym, txt in sec["factors"]
        )
        topics = " ".join(f'<span class="topic">{esc(t)}</span>' for t in r["topics"][:8])
        cat_tags = " ".join(f'<span class="cat">{esc(c)}</span>' for c in r["categories"])
        data_cats = esc("|".join(r["categories"]))
        pushed = (r.get("pushed_at") or "")[:10]
        new_badge = '<span class="new">NEW</span>' if r.get("is_new") else ""

        # --- choose the verdict shown in the Risk column ---
        review = r.get("claude_review") or None
        rk = (review or {}).get("risk", "").lower()
        if review and rk in CLAUDE_RISK:
            sort_score, vlabel, vclass = CLAUDE_RISK[rk]
            band = vclass.replace("s-", "")
            badge = (f'<span class="badge {vclass}" title="Security verdict by Claude '
                     f'(reading the code, not a formal audit)">&#10022; {esc(vlabel)}</span>')
        else:
            sort_score = sec["score"]
            band = score_class(sec["score"]).replace("s-", "")
            badge = (f'<span class="badge {score_class(sec["score"])}" '
                     f'title="Heuristic indicator (no Claude review yet)">'
                     f'{sec["score"]} &middot; {esc(sec["label"])}</span>')
        bands.append(band)

        # --- detail: Claude review section (if present) then heuristic signals ---
        review_html = ""
        if review:
            findings = "".join(
                f'<li class="sev-{esc(str(f.get("severity","info")).lower())}">'
                f'<b>{esc(str(f.get("severity","info")).upper())}</b> {esc(f.get("note",""))}</li>'
                for f in (review.get("findings") or [])
            ) or '<li class="sev-info">No specific findings flagged.</li>'
            review_html = f"""
          <h4>&#10022; Claude review &mdash; {esc(CLAUDE_RISK.get(rk, (0, rk.title() or 'Unrated', ''))[1])}</h4>
          <p class="summary">{esc(review.get('rationale') or '')}</p>
          <ul class="findings">{findings}</ul>"""

        summary_text = (review or {}).get("summary") or r["summary"]

        rows.append(f"""
        <tr class="row band-{band}" data-cats="{data_cats}" data-stars="{r['stars']}" data-forks="{r['forks']}"
            data-score="{sort_score}" data-new="{1 if r.get('is_new') else 0}"
            data-name="{esc(r['full_name'].lower())}">
          <td class="c-repo">
            <a href="{esc(r['url'])}" target="_blank" rel="noopener">{esc(r['full_name'])}</a>
            {new_badge}<span class="caret"></span>
            <div class="cats">{cat_tags}</div>
          </td>
          <td class="num">{r['stars']:,}</td>
          <td class="num">{r['forks']:,}</td>
          <td>{esc(r['language'])}</td>
          <td>{esc(r['license'])}</td>
          <td class="nowrap">{esc(pushed)}</td>
          <td>{badge}</td>
        </tr>
        <tr class="detail" style="display:none"><td colspan="7">
          <p class="desc">{esc(r['description']) or '<em>No description</em>'}</p>
          <p class="summary">{esc(summary_text)}</p>
          <div class="topics">{topics}</div>{review_html}
          <h4>Heuristic signals</h4>
          <ul class="factors">{factor_rows}</ul>
        </td></tr>""")

    total = len(repos)
    bc = Counter(bands)
    new_count = data.get("new_count", 0)
    cat_counts = Counter(c for r in repos for c in r["categories"])

    cat_buttons = "".join(
        f'<button class="filter" data-cat="{esc(c)}">{esc(c)} <b>{cat_counts[c]}</b></button>'
        for c in all_cats
    )

    # Summary stat cards
    BANDS = [("low", "Lower risk"), ("mod", "Moderate"), ("elev", "Elevated"), ("high", "Higher risk")]
    stat_cards = (
        f'<div class="stat"><div class="stat-num">{total}</div>'
        f'<div class="stat-label">Repositories</div></div>'
        f'<div class="stat accent"><div class="stat-num">{new_count}</div>'
        f'<div class="stat-label">New this run</div></div>'
    )
    for key, label in BANDS:
        stat_cards += (
            f'<div class="stat s-{key}"><div class="stat-num">{bc.get(key, 0)}</div>'
            f'<div class="stat-label">{label}</div></div>'
        )

    # Stacked risk-distribution bar + legend
    segs = "".join(
        f'<div class="seg s-{key}" style="width:{(bc.get(key,0)/total*100) if total else 0:.2f}%" '
        f'title="{label}: {bc.get(key,0)}"></div>'
        for key, label in BANDS if bc.get(key, 0)
    )
    legend = "".join(
        f'<span><i class="s-{key}"></i>{label} &middot; {bc.get(key,0)}</span>'
        for key, label in BANDS
    )
    risk_bar = f'<div class="riskbar">{segs}</div><div class="legend">{legend}</div>'

    return f"""<!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Claude Code Radar — {gen[:10]}</title>
<style>
  :root {{
    --bg:#fbfbfa; --panel:#ffffff; --panel2:#f7f6f3; --line:#eaeaea; --line-soft:rgba(0,0,0,.06);
    --text:#2f3437; --muted:#787774; --accent:#1f6c9f;
    --sans:-apple-system,'SF Pro Display','Helvetica Neue','Segoe UI',system-ui,sans-serif;
    --serif:'Newsreader','Iowan Old Style','Palatino Linotype',Palatino,Georgia,serif;
    --mono:'SF Mono','JetBrains Mono',ui-monospace,Menlo,monospace;
    /* washed pastels: low=green, mod=yellow, elev=orange, high=red */
    --low-bg:#edf3ec; --low-fg:#346538;
    --mod-bg:#fbf3db; --mod-fg:#956400;
    --elev-bg:#f6e9df; --elev-fg:#9a5a23;
    --high-bg:#fdebec; --high-fg:#9f2f2d;
  }}
  *{{box-sizing:border-box}}
  body{{margin:0;background:var(--bg);color:var(--text);
    font:22.5px/1.6 var(--sans);padding:0 0 80px;-webkit-font-smoothing:antialiased}}
  header.top{{padding:48px 40px 30px;border-top:5px solid var(--accent);
    background:linear-gradient(180deg,rgba(31,108,159,.06),rgba(31,108,159,0) 70%);
    border-bottom:1px solid var(--line)}}
  .eyebrow{{font:16.5px/1 var(--mono);text-transform:uppercase;letter-spacing:.22em;
    color:var(--muted);margin-bottom:14px}}
  h1{{margin:0 0 8px;font-family:var(--serif);font-weight:500;font-size:60px;
    letter-spacing:-.02em;line-height:1.05}}
  .sub{{color:var(--muted);font-size:21px}}
  .disclaimer{{margin-top:18px;padding:14px 18px;background:var(--mod-bg);
    border-radius:10px;color:#6b5a2a;font-size:19.5px;line-height:1.55;max-width:820px}}
  .disclaimer b{{color:#4a3f1c}}
  .controls{{display:flex;flex-wrap:wrap;gap:10px;align-items:center;
    padding:8px 40px 4px}}
  #search{{flex:1;min-width:240px;background:var(--panel);border:1px solid var(--line);
    color:var(--text);padding:11px 14px;border-radius:8px;font:21px var(--sans);outline:none}}
  #search:focus{{border-color:var(--muted)}}
  .filters{{display:flex;flex-wrap:wrap;gap:7px;padding:16px 40px 4px}}
  .filter{{background:transparent;border:1px solid var(--line);color:var(--muted);
    padding:5px 12px;border-radius:9999px;cursor:pointer;
    font:16.5px var(--mono);text-transform:uppercase;letter-spacing:.06em;transition:all .15s}}
  .filter:hover{{border-color:var(--muted)}}
  .filter.active{{background:var(--text);color:#fff;border-color:var(--text)}}
  .wrap{{padding:14px 40px}}
  table{{width:100%;border-collapse:collapse;font-size:21px}}
  thead th{{position:sticky;top:0;background:var(--bg);color:var(--muted);
    text-align:left;padding:12px 12px;border-bottom:1px solid var(--line);
    font:16.5px var(--mono);text-transform:uppercase;letter-spacing:.08em;white-space:nowrap;z-index:5}}
  th[data-sort]{{cursor:pointer;user-select:none}}
  th[data-sort]:hover{{color:var(--text)}}
  th.asc::after{{content:" \\2191";color:var(--text)}}
  th.desc::after{{content:" \\2193";color:var(--text)}}
  th.num,td.num{{text-align:right}}
  tr.row{{cursor:pointer;border-bottom:1px solid var(--line);
    opacity:0;transform:translateY(12px);transition:opacity .6s cubic-bezier(.16,1,.3,1),transform .6s cubic-bezier(.16,1,.3,1),background .15s}}
  tr.row.in{{opacity:1;transform:none}}
  tr.row:hover{{background:var(--panel2)}}
  td{{padding:13px 12px;vertical-align:top}}
  td.nowrap{{white-space:nowrap;color:var(--muted);font:18px var(--mono)}}
  td.num{{font:19.5px var(--mono);color:var(--text)}}
  .c-repo a{{font-family:var(--mono);color:var(--text);text-decoration:none;font-weight:600;
    font-size:19.5px;word-break:break-all}}
  .c-repo a:hover{{color:var(--accent)}}
  .caret{{color:var(--muted);font-family:var(--mono);font-size:19.5px;margin-left:8px}}
  .caret::before{{content:"+"}}
  tr.row.open .caret{{color:var(--text)}}
  tr.row.open .caret::before{{content:"\\2212"}}
  .cats{{display:flex;flex-wrap:wrap;gap:5px;margin-top:7px}}
  .cat{{background:#e1f3fe;color:#1f6c9f;font:13.5px var(--mono);text-transform:uppercase;
    letter-spacing:.06em;padding:3px 8px;border-radius:9999px}}
  .badge{{white-space:nowrap;font:15px var(--mono);text-transform:uppercase;letter-spacing:.06em;
    padding:4px 10px;border-radius:9999px;font-weight:600}}
  .s-low{{background:var(--low-bg);color:var(--low-fg)}}
  .s-mod{{background:var(--mod-bg);color:var(--mod-fg)}}
  .s-elev{{background:var(--elev-bg);color:var(--elev-fg)}}
  .s-high{{background:var(--high-bg);color:var(--high-fg)}}
  tr.detail td{{background:var(--panel2);border-bottom:1px solid var(--line);padding:10px 22px 22px}}
  .desc{{margin:8px 0;color:var(--text);font-size:21px}}
  .summary{{font-size:21px;color:var(--muted);line-height:1.6;max-width:760px}}
  .topics{{display:flex;flex-wrap:wrap;gap:5px;margin:8px 0}}
  .topic{{background:#fff;border:1px solid var(--line);color:var(--muted);
    font:13.5px var(--mono);text-transform:uppercase;letter-spacing:.05em;padding:3px 8px;border-radius:9999px}}
  h4{{margin:16px 0 6px;font:16.5px var(--mono);text-transform:uppercase;letter-spacing:.1em;color:var(--muted)}}
  .factors{{list-style:none;padding:0;margin:0;font-size:19.5px}}
  .factors li{{padding:4px 0;display:flex;gap:8px}}
  .f-\\+{{color:var(--low-fg)}} .f-\\+::before{{content:"+";font-family:var(--mono)}}
  .f-\\-{{color:var(--high-fg)}} .f-\\-::before{{content:"\\2212";font-family:var(--mono)}}
  .f-i{{color:var(--muted)}} .f-i::before{{content:"\\00B7";font-family:var(--mono)}}
  .new{{background:var(--text);color:#fff;font:12px var(--mono);font-weight:700;
    padding:2px 7px;border-radius:9999px;margin-left:10px;vertical-align:middle;
    text-transform:uppercase;letter-spacing:.12em}}
  .findings{{list-style:none;padding:0;margin:6px 0 0;font-size:19.5px}}
  .findings li{{padding:4px 0;line-height:1.5}}
  .findings b{{font:12px var(--mono);font-weight:700;padding:2px 6px;border-radius:9999px;margin-right:8px;
    text-transform:uppercase;letter-spacing:.08em;background:var(--panel2);color:var(--muted);
    border:1px solid var(--line)}}
  .sev-high b{{background:var(--high-bg);color:var(--high-fg);border-color:transparent}}
  .sev-med b,.sev-medium b{{background:var(--elev-bg);color:var(--elev-fg);border-color:transparent}}
  .sev-low b{{background:var(--mod-bg);color:var(--mod-fg);border-color:transparent}}
  .toggle{{display:flex;align-items:center;gap:7px;color:var(--muted);
    font:16.5px var(--mono);text-transform:uppercase;letter-spacing:.06em;cursor:pointer;white-space:nowrap}}
  .empty{{padding:60px 24px;color:var(--muted);text-align:center;font-size:21px}}
  /* --- production polish: stat cards, risk bar, row accents, footer --- */
  .stats{{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:16px;padding:26px 40px 4px}}
  .stat{{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:22px 24px;
    box-shadow:0 1px 2px rgba(0,0,0,.03)}}
  .stat-num{{font-family:var(--serif);font-weight:500;font-size:54px;line-height:1}}
  .stat-label{{margin-top:10px;font:15px var(--mono);text-transform:uppercase;letter-spacing:.08em;color:var(--muted)}}
  .stat.accent{{border-top:4px solid var(--accent)}} .stat.accent .stat-num{{color:var(--accent)}}
  .stat.s-low{{border-top:4px solid var(--low-fg)}}  .stat.s-low .stat-num{{color:var(--low-fg);background:none}}
  .stat.s-mod{{border-top:4px solid var(--mod-fg)}}  .stat.s-mod .stat-num{{color:var(--mod-fg);background:none}}
  .stat.s-elev{{border-top:4px solid var(--elev-fg)}} .stat.s-elev .stat-num{{color:var(--elev-fg);background:none}}
  .stat.s-high{{border-top:4px solid var(--high-fg)}} .stat.s-high .stat-num{{color:var(--high-fg);background:none}}
  .riskbar{{display:flex;height:16px;border-radius:9999px;overflow:hidden;margin:20px 40px 0;
    border:1px solid var(--line);background:var(--panel2)}}
  .riskbar .seg{{height:100%}}
  .seg.s-low{{background:var(--low-fg)}} .seg.s-mod{{background:var(--mod-fg)}}
  .seg.s-elev{{background:var(--elev-fg)}} .seg.s-high{{background:var(--high-fg)}}
  .legend{{display:flex;flex-wrap:wrap;gap:20px;padding:12px 40px 0;
    font:15px var(--mono);color:var(--muted)}}
  .legend span{{display:inline-flex;align-items:center;gap:8px}}
  .legend i{{width:13px;height:13px;border-radius:4px;display:inline-block}}
  .legend i.s-low{{background:var(--low-fg)}} .legend i.s-mod{{background:var(--mod-fg)}}
  .legend i.s-elev{{background:var(--elev-fg)}} .legend i.s-high{{background:var(--high-fg)}}
  .filter b{{font-weight:700;opacity:.6;margin-left:3px}}
  .filter.active b{{opacity:.85}}
  /* colored left edge on each row by risk band */
  tr.row td:first-child{{box-shadow:inset 4px 0 0 transparent}}
  tr.row.band-low  td:first-child{{box-shadow:inset 4px 0 0 var(--low-fg)}}
  tr.row.band-mod  td:first-child{{box-shadow:inset 4px 0 0 var(--mod-fg)}}
  tr.row.band-elev td:first-child{{box-shadow:inset 4px 0 0 var(--elev-fg)}}
  tr.row.band-high td:first-child{{box-shadow:inset 4px 0 0 var(--high-fg)}}
  .foot{{margin-top:40px;padding:26px 40px;border-top:1px solid var(--line);
    background:var(--panel2);color:var(--muted);font:16.5px var(--sans);line-height:1.6}}
  .foot-mark{{color:var(--accent)}} .foot b{{color:var(--text)}}
</style></head>
<body>
<header class="top">
  <div class="eyebrow">Claude Code Ecosystem &middot; Daily Scan</div>
  <h1>Claude Code Radar</h1>
  <div class="sub">{data['repo_count']} repos &middot; {data.get('new_count', 0)} new this run &middot; generated {esc(gen[:16].replace('T',' '))} UTC &middot; click a row for details</div>
  <div class="disclaimer">The risk verdict marked &#10022; is <b>Claude reading the README and key files</b>
  (skills, MCP configs, hooks, install scripts) and flagging concerns. Repos not yet reviewed fall back to a
  <b>heuristic indicator</b>. Neither is a formal security audit and either can be wrong &mdash;
  always review code yourself before installing or running anything.</div>
</header>
<section class="stats">{stat_cards}</section>
{risk_bar}
<div class="controls">
  <input id="search" placeholder="Search repos by name or description…">
  <label class="toggle"><input type="checkbox" id="newonly"> New only</label>
</div>
<div class="filters"><button class="filter active" data-cat="ALL">All <b>{total}</b></button>{cat_buttons}</div>
<div class="wrap">
<table>
  <thead><tr>
    <th data-sort="name">Repository</th>
    <th data-sort="stars" class="num desc">Stars</th>
    <th data-sort="forks" class="num">Forks</th>
    <th>Language</th>
    <th>License</th>
    <th>Updated</th>
    <th data-sort="score">Risk</th>
  </tr></thead>
  <tbody id="tbody">{''.join(rows)}</tbody>
</table>
</div>
<div class="empty" id="empty" style="display:none">No repos match your filters.</div>
<script>
  const tbody=document.getElementById('tbody');
  const rows=[...tbody.querySelectorAll('tr.row')];
  let activeCat='ALL', sortKey='stars', sortDir=-1;
  const detailOf=r=>r.nextElementSibling;
  function apply(){{
    const q=document.getElementById('search').value.toLowerCase();
    const newOnly=document.getElementById('newonly').checked;
    let visible=0;
    rows.forEach(r=>{{
      const cats=r.dataset.cats.split('|');
      const okCat=activeCat==='ALL'||cats.includes(activeCat);
      const okNew=!newOnly||r.dataset.new==='1';
      const d=detailOf(r);
      const text=(r.textContent+' '+(d?d.textContent:'')).toLowerCase();
      const okSearch=!q||text.includes(q);
      const show=okCat&&okSearch&&okNew;
      r.style.display=show?'':'none';
      if(d&&!show){{d.style.display='none';r.classList.remove('open');}}
      if(show)visible++;
    }});
    document.getElementById('empty').style.display=visible?'none':'block';
  }}
  function sortRows(){{
    const pairs=rows.map(r=>[r,detailOf(r)]);
    pairs.sort((a,b)=>{{
      let cmp;
      if(sortKey==='name')cmp=a[0].dataset.name.localeCompare(b[0].dataset.name);
      else cmp=(+a[0].dataset[sortKey])-(+b[0].dataset[sortKey]);
      return cmp*sortDir;
    }});
    pairs.forEach(([r,d])=>{{tbody.appendChild(r);if(d)tbody.appendChild(d);}});
  }}
  document.getElementById('search').addEventListener('input',apply);
  document.querySelectorAll('th[data-sort]').forEach(th=>th.addEventListener('click',()=>{{
    const k=th.dataset.sort;
    if(sortKey===k)sortDir*=-1; else {{sortKey=k;sortDir=(k==='name')?1:-1;}}
    document.querySelectorAll('th[data-sort]').forEach(x=>x.classList.remove('asc','desc'));
    th.classList.add(sortDir>0?'asc':'desc');
    sortRows();
  }}));
  document.querySelectorAll('.filter').forEach(b=>b.addEventListener('click',()=>{{
    document.querySelectorAll('.filter').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');activeCat=b.dataset.cat;apply();
  }}));
  document.getElementById('newonly').addEventListener('change',apply);
  rows.forEach(r=>r.addEventListener('click',e=>{{
    if(e.target.closest('a'))return;
    const d=detailOf(r);
    if(d){{const open=d.style.display==='none';d.style.display=open?'table-row':'none';r.classList.toggle('open',open);}}
  }}));
  // Quiet scroll-entry reveal (staggered) per the minimalist-ui motion rules.
  if('IntersectionObserver' in window){{
    const io=new IntersectionObserver((entries,obs)=>{{
      entries.forEach(en=>{{
        if(en.isIntersecting){{
          const r=en.target, i=rows.indexOf(r);
          r.style.transitionDelay=(Math.min(i,12)*40)+'ms';
          r.classList.add('in');
          obs.unobserve(r);
        }}
      }});
    }},{{rootMargin:'0px 0px -8% 0px'}});
    rows.forEach(r=>io.observe(r));
  }} else {{ rows.forEach(r=>r.classList.add('in')); }}
</script>
<footer class="foot">
  <span class="foot-mark">&#10022;</span> Claude Code Radar &middot; {total} repositories scanned &middot;
  Claude review + heuristic signals &middot; generated {esc(gen[:10])} &middot;
  <b>not a security audit</b> &mdash; always review code before installing.
</footer>
</body></html>"""


def reviews_path_for(data_path):
    """The reviews file sits beside the data file: data-X.json -> reviews-X.json."""
    d = os.path.dirname(data_path)
    b = os.path.basename(data_path)
    return os.path.join(d, b.replace("data-", "reviews-", 1))


def merge_reviews(data, data_path):
    """Fold the Cowork session's reviews-<date>.json into each repo record."""
    rp = reviews_path_for(data_path)
    if not os.path.exists(rp):
        print(f"(no reviews file at {rp} — showing heuristic only)")
        return 0
    with open(rp) as f:
        reviews = json.load(f)
    n = 0
    for r in data["repos"]:
        cr = reviews.get(r["full_name"])
        if cr:
            r["claude_review"] = cr
            n += 1
    print(f"Merged {n} Claude reviews from {os.path.basename(rp)}")
    return n


def main():
    path = sys.argv[1] if len(sys.argv) > 1 else newest_data()
    with open(path) as f:
        data = json.load(f)
    merge_reviews(data, path)
    out_html = build(data)
    date = data["generated_at"][:10]
    os.makedirs(HTML_DIR, exist_ok=True)
    fname = os.path.join(HTML_DIR, f"claude-code-radar-{date}.html")
    with open(fname, "w") as f:
        f.write(out_html)
    print(f"Wrote {fname}")


if __name__ == "__main__":
    main()
