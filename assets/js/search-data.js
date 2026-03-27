// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-home",
    title: "home",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-news",
          title: "News",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/blog/";
          },
        },{id: "nav-calendar",
          title: "Calendar",
          description: "US cybersecurity conferences for 2026 — dates, locations, and travel cost estimates from Houston (HOU).",
          section: "Navigation",
          handler: () => {
            window.location.href = "/cybersecurity-calendar/";
          },
        },{id: "dropdown-epss-scanner",
              title: "EPSS Scanner",
              description: "",
              section: "Dropdown",
              handler: () => {
                window.location.href = "";
              },
            },{id: "dropdown-blue-team",
              title: "Blue Team",
              description: "",
              section: "Dropdown",
              handler: () => {
                window.location.href = "";
              },
            },{id: "dropdown-ai-tools-amp-prompts",
              title: "AI Tools &amp; Prompts",
              description: "",
              section: "Dropdown",
              handler: () => {
                window.location.href = "";
              },
            },{id: "dropdown-cybersecurity-explained",
              title: "Cybersecurity Explained",
              description: "",
              section: "Dropdown",
              handler: () => {
                window.location.href = "";
              },
            },{id: "dropdown-repositories",
              title: "Repositories",
              description: "",
              section: "Dropdown",
              handler: () => {
                window.location.href = "";
              },
            },{id: "dropdown-books",
              title: "Books",
              description: "",
              section: "Dropdown",
              handler: () => {
                window.location.href = "";
              },
            },{id: "dropdown-learning-platforms",
              title: "Learning Platforms",
              description: "",
              section: "Dropdown",
              handler: () => {
                window.location.href = "";
              },
            },{id: "dropdown-podcasts",
              title: "Podcasts",
              description: "",
              section: "Dropdown",
              handler: () => {
                window.location.href = "";
              },
            },{id: "post-djbsec-39-s-cybernews-2026-03-27",
      
        title: "DJBSEC&#39;s CyberNews 2026-03-27",
      
      description: "2026-03-27",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2026/cybernews0327/";
        
      },
    },{id: "post-djbsec-39-s-cybernews-2026-03-26",
      
        title: "DJBSEC&#39;s CyberNews 2026-03-26",
      
      description: "2026-03-26",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2026/cybernews0326/";
        
      },
    },{id: "post-djbsec-39-s-cybernews-2026-03-24",
      
        title: "DJBSEC&#39;s CyberNews 2026-03-24",
      
      description: "2026-03-24",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2026/cybernews0324/";
        
      },
    },{id: "post-djbsec-39-s-cybernews-2026-03-23",
      
        title: "DJBSEC&#39;s CyberNews 2026-03-23",
      
      description: "2026-03-23",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2026/cybernews0323/";
        
      },
    },{id: "post-djbsec-39-s-cybernews-2026-03-20",
      
        title: "DJBSEC&#39;s CyberNews 2026-03-20",
      
      description: "2026-03-20",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2026/cybernews0320/";
        
      },
    },{id: "post-djbsec-39-s-cybernews-2026-03-19",
      
        title: "DJBSEC&#39;s CyberNews 2026-03-19",
      
      description: "2026-03-19",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2026/cybernews0319/";
        
      },
    },{id: "post-djbsec-39-s-cybernews-2026-03-18",
      
        title: "DJBSEC&#39;s CyberNews 2026-03-18",
      
      description: "2026-03-18",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2026/cybernews0318/";
        
      },
    },{id: "post-djbsec-39-s-cybernews-2026-03-17",
      
        title: "DJBSEC&#39;s CyberNews 2026-03-17",
      
      description: "2026-03-17",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2026/cybernews0317/";
        
      },
    },{id: "post-djbsec-39-s-cybernews-2026-03-16",
      
        title: "DJBSEC&#39;s CyberNews 2026-03-16",
      
      description: "2026-03-16",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2026/cybernews0316/";
        
      },
    },{id: "post-djbsec-39-s-cybernews-2026-03-13",
      
        title: "DJBSEC&#39;s CyberNews 2026-03-13",
      
      description: "2026-03-13",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2026/cybernews0313/";
        
      },
    },{id: "post-djbsec-39-s-cybernews-2026-03-12",
      
        title: "DJBSEC&#39;s CyberNews 2026-03-12",
      
      description: "2026-03-12",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2026/cybernews0312/";
        
      },
    },{id: "post-djbsec-39-s-cybernews-2026-03-11",
      
        title: "DJBSEC&#39;s CyberNews 2026-03-11",
      
      description: "2026-03-11",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2026/cybernews0311/";
        
      },
    },{id: "post-djbsec-39-s-cybernews-2026-03-10",
      
        title: "DJBSEC&#39;s CyberNews 2026-03-10",
      
      description: "2026-03-10",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2026/cybernews0310/";
        
      },
    },{id: "post-djbsec-39-s-cybernews-2026-03-07",
      
        title: "DJBSEC&#39;s CyberNews 2026-03-07",
      
      description: "2026-03-07",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2026/cybernews0307/";
        
      },
    },{id: "post-djbsec-39-s-cybernews-2026-03-06",
      
        title: "DJBSEC&#39;s CyberNews 2026-03-06",
      
      description: "2026-03-06",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2026/cybernews0306/";
        
      },
    },{id: "post-djbsec-39-s-cybernews-2026-03-05",
      
        title: "DJBSEC&#39;s CyberNews 2026-03-05",
      
      description: "2026-03-05",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2026/cybernews0305/";
        
      },
    },{id: "post-djbsec-39-s-cybernews-2026-01-22",
      
        title: "DJBSEC&#39;s CyberNews 2026-01-22",
      
      description: "2026-01-22",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2026/cybernews0122/";
        
      },
    },{id: "post-djbsec-39-s-cybernews-2026-01-21",
      
        title: "DJBSEC&#39;s CyberNews 2026-01-21",
      
      description: "2026-01-21",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2026/cybernews0121/";
        
      },
    },{id: "conferences-appsec-usa-2026-owasp",
          title: 'AppSec USA 2026 (OWASP)',
          description: "OWASP&#39;s flagship North American application security conference.",
          section: "Conferences",handler: () => {
              window.location.href = "/cybersecurity-calendar/appsec-usa-2026/";
            },},{id: "conferences-black-hat-usa-2026",
          title: 'Black Hat USA 2026',
          description: "Premier enterprise security conference featuring cutting-edge research and training.",
          section: "Conferences",handler: () => {
              window.location.href = "/cybersecurity-calendar/black-hat-usa-2026/";
            },},{id: "conferences-bsides-las-vegas-2026",
          title: 'BSides Las Vegas 2026',
          description: "Community-driven security event running alongside Black Hat and DEF CON.",
          section: "Conferences",handler: () => {
              window.location.href = "/cybersecurity-calendar/bsides-lv-2026/";
            },},{id: "conferences-bsides-san-francisco-2026",
          title: 'BSides San Francisco 2026',
          description: "Community-organized security conference held alongside RSA.",
          section: "Conferences",handler: () => {
              window.location.href = "/cybersecurity-calendar/bsides-sf-2026/";
            },},{id: "conferences-cactuscon-14",
          title: 'CactusCon 14',
          description: "Community-focused security conference in the Phoenix metro area.",
          section: "Conferences",handler: () => {
              window.location.href = "/cybersecurity-calendar/cactuscon-14/";
            },},{id: "conferences-central-ohio-infosec-summit-2026",
          title: 'Central Ohio InfoSec Summit 2026',
          description: "Regional security summit serving the Central Ohio infosec community.",
          section: "Conferences",handler: () => {
              window.location.href = "/cybersecurity-calendar/central-ohio-infosec-2026/";
            },},{id: "conferences-circle-city-con-2026",
          title: 'Circle City Con 2026',
          description: "Hacker and security community conference in Indianapolis.",
          section: "Conferences",handler: () => {
              window.location.href = "/cybersecurity-calendar/circlecitycon-2026/";
            },},{id: "conferences-converge-detroit-2026",
          title: 'Converge Detroit 2026',
          description: "Midwest infosec conference focused on community and collaboration.",
          section: "Conferences",handler: () => {
              window.location.href = "/cybersecurity-calendar/converge-detroit-2026/";
            },},{id: "conferences-cybersecurity-summit-minneapolis-2026",
          title: 'Cybersecurity Summit Minneapolis 2026',
          description: "Regional summit connecting cybersecurity leaders in the Twin Cities.",
          section: "Conferences",handler: () => {
              window.location.href = "/cybersecurity-calendar/cybersecurity-summit-msp-2026/";
            },},{id: "conferences-def-con-34",
          title: 'DEF CON 34',
          description: "The world&#39;s largest underground hacking conference.",
          section: "Conferences",handler: () => {
              window.location.href = "/cybersecurity-calendar/defcon-34/";
            },},{id: "conferences-grrcon-2026",
          title: 'GrrCon 2026',
          description: "Midwest hacker and security community conference in Grand Rapids.",
          section: "Conferences",handler: () => {
              window.location.href = "/cybersecurity-calendar/grrcon-2026/";
            },},{id: "conferences-hacknyc-2026",
          title: 'HACKNYC 2026',
          description: "New York City security conference covering offensive and defensive topics.",
          section: "Conferences",handler: () => {
              window.location.href = "/cybersecurity-calendar/hacknyc-2026/";
            },},{id: "conferences-ics-security-summit-sans",
          title: 'ICS Security Summit (SANS)',
          description: "SANS summit focused on industrial control systems and OT/ICS security.",
          section: "Conferences",handler: () => {
              window.location.href = "/cybersecurity-calendar/ics-security-summit-2026/";
            },},{id: "conferences-infiltrate-2026",
          title: 'Infiltrate 2026',
          description: "Deeply technical offensive security conference in Miami.",
          section: "Conferences",handler: () => {
              window.location.href = "/cybersecurity-calendar/infiltrate-2026/";
            },},{id: "conferences-layerone-2026",
          title: 'LayerOne 2026',
          description: "Hacker-focused security conference in Los Angeles.",
          section: "Conferences",handler: () => {
              window.location.href = "/cybersecurity-calendar/layerone-2026/";
            },},{id: "conferences-nolacon-2026",
          title: 'NOLACon 2026',
          description: "New Orleans hacker and security community conference.",
          section: "Conferences",handler: () => {
              window.location.href = "/cybersecurity-calendar/nolacon-2026/";
            },},{id: "conferences-ringzer0-2026",
          title: 'RingZer0 2026',
          description: "Technical training and talks during pre-DEF CON week in Las Vegas.",
          section: "Conferences",handler: () => {
              window.location.href = "/cybersecurity-calendar/ringzer0-2026/";
            },},{id: "conferences-rsa-conference-2026",
          title: 'RSA Conference 2026',
          description: "The world&#39;s leading information security conference and expo.",
          section: "Conferences",handler: () => {
              window.location.href = "/cybersecurity-calendar/rsa-conference-2026/";
            },},{id: "conferences-sans-cyber-defense-forum-2026",
          title: 'SANS Cyber Defense Forum 2026',
          description: "SANS summit focused on defensive security, blue team operations, and SOC.",
          section: "Conferences",handler: () => {
              window.location.href = "/cybersecurity-calendar/sans-cyber-defense-2026/";
            },},{id: "conferences-sans-dfir-summit-2026",
          title: 'SANS DFIR Summit 2026',
          description: "SANS summit focused on digital forensics and incident response.",
          section: "Conferences",handler: () => {
              window.location.href = "/cybersecurity-calendar/sans-dfir-2026/";
            },},{id: "conferences-secureworld-atlanta-2026",
          title: 'SecureWorld Atlanta 2026',
          description: "Regional enterprise security conference with CPE-eligible sessions.",
          section: "Conferences",handler: () => {
              window.location.href = "/cybersecurity-calendar/secureworld-atlanta-2026/";
            },},{id: "conferences-secureworld-chicago-2026",
          title: 'SecureWorld Chicago 2026',
          description: "Regional enterprise security conference with CPE-eligible sessions.",
          section: "Conferences",handler: () => {
              window.location.href = "/cybersecurity-calendar/secureworld-chicago-2026/";
            },},{id: "conferences-secureworld-dallas-2026",
          title: 'SecureWorld Dallas 2026',
          description: "Regional enterprise security conference with CPE-eligible sessions.",
          section: "Conferences",handler: () => {
              window.location.href = "/cybersecurity-calendar/secureworld-dallas-2026/";
            },},{id: "conferences-secureworld-philadelphia-2026",
          title: 'SecureWorld Philadelphia 2026',
          description: "Regional enterprise security conference with CPE-eligible sessions.",
          section: "Conferences",handler: () => {
              window.location.href = "/cybersecurity-calendar/secureworld-philadelphia-2026/";
            },},{id: "conferences-shmoocon-2026",
          title: 'ShmooCon 2026',
          description: "East Coast hacker convention focused on offensive/defensive topics.",
          section: "Conferences",handler: () => {
              window.location.href = "/cybersecurity-calendar/shmoocon-2026/";
            },},{id: "conferences-toorcon-2026",
          title: 'ToorCon 2026',
          description: "San Diego hacker conference focused on technical research and community.",
          section: "Conferences",handler: () => {
              window.location.href = "/cybersecurity-calendar/toorcon-2026/";
            },},{id: "conferences-wild-west-hackin-39-fest-2026",
          title: 'Wild West Hackin&amp;#39; Fest 2026',
          description: "Unique security conference in Deadwood, South Dakota with a Western theme.",
          section: "Conferences",handler: () => {
              window.location.href = "/cybersecurity-calendar/wild-west-hackin-fest-2026/";
            },},{id: "explained-phishing",
          title: 'Phishing',
          description: "what is phishing?",
          section: "Explained",handler: () => {
              window.location.href = "/explained/1_project/";
            },},{id: "explained-antivirus-vs-edr",
          title: 'Antivirus vs EDR',
          description: "What is the difference between antivirus and EDR?",
          section: "Explained",handler: () => {
              window.location.href = "/explained/antivirus-edr/";
            },},{id: "explained-attack-surface",
          title: 'Attack Surface',
          description: "What is an attack surface?",
          section: "Explained",handler: () => {
              window.location.href = "/explained/attack-surface/";
            },},{id: "explained-backups-amp-the-3-2-1-rule",
          title: 'Backups &amp;amp; the 3-2-1 Rule',
          description: "What is the 3-2-1 backup rule?",
          section: "Explained",handler: () => {
              window.location.href = "/explained/backups/";
            },},{id: "explained-business-email-compromise",
          title: 'Business Email Compromise',
          description: "What is business email compromise?",
          section: "Explained",handler: () => {
              window.location.href = "/explained/business-email-compromise/";
            },},{id: "explained-the-cia-triad",
          title: 'The CIA Triad',
          description: "What is the CIA Triad in cybersecurity?",
          section: "Explained",handler: () => {
              window.location.href = "/explained/cia-triad/";
            },},{id: "explained-credential-stuffing",
          title: 'Credential Stuffing',
          description: "What is credential stuffing?",
          section: "Explained",handler: () => {
              window.location.href = "/explained/credential-stuffing/";
            },},{id: "explained-cve-amp-cvss-scoring",
          title: 'CVE &amp;amp; CVSS Scoring',
          description: "What are CVEs and CVSS scores?",
          section: "Explained",handler: () => {
              window.location.href = "/explained/cve-cvss/";
            },},{id: "explained-dark-web-monitoring",
          title: 'Dark Web Monitoring',
          description: "What is dark web monitoring?",
          section: "Explained",handler: () => {
              window.location.href = "/explained/dark-web-monitoring/";
            },},{id: "explained-deepfakes-amp-ai-driven-attacks",
          title: 'Deepfakes &amp;amp; AI-Driven Attacks',
          description: "What are deepfakes and AI-driven attacks?",
          section: "Explained",handler: () => {
              window.location.href = "/explained/deepfakes/";
            },},{id: "explained-email-spoofing",
          title: 'Email Spoofing',
          description: "What is email spoofing?",
          section: "Explained",handler: () => {
              window.location.href = "/explained/emailspoofing/";
            },},{id: "explained-encryption",
          title: 'Encryption',
          description: "What is encryption?",
          section: "Explained",handler: () => {
              window.location.href = "/explained/encryption/";
            },},{id: "explained-epss",
          title: 'EPSS',
          description: "What is the Exploit Prediction Scoring System?",
          section: "Explained",handler: () => {
              window.location.href = "/explained/epss/";
            },},{id: "explained-firewalls",
          title: 'Firewalls',
          description: "What is a firewall?",
          section: "Explained",handler: () => {
              window.location.href = "/explained/firewalls/";
            },},{id: "explained-incident-response",
          title: 'Incident Response',
          description: "What is incident response?",
          section: "Explained",handler: () => {
              window.location.href = "/explained/incident-response/";
            },},{id: "explained-insider-threats",
          title: 'Insider Threats',
          description: "What is an insider threat?",
          section: "Explained",handler: () => {
              window.location.href = "/explained/insider-threats/";
            },},{id: "explained-principle-of-least-privilege",
          title: 'Principle of Least Privilege',
          description: "What is the principle of least privilege?",
          section: "Explained",handler: () => {
              window.location.href = "/explained/least-privilege/";
            },},{id: "explained-malware",
          title: 'Malware',
          description: "What is malware?",
          section: "Explained",handler: () => {
              window.location.href = "/explained/malware/";
            },},{id: "explained-man-in-the-middle-attacks",
          title: 'Man-in-the-Middle Attacks',
          description: "What is a man-in-the-middle attack?",
          section: "Explained",handler: () => {
              window.location.href = "/explained/man-in-the-middle/";
            },},{id: "explained-mfa-apps",
          title: 'MFA Apps',
          description: "What are MFA authenticator apps?",
          section: "Explained",handler: () => {
              window.location.href = "/explained/mfa-apps/";
            },},{id: "explained-network-segmentation",
          title: 'Network Segmentation',
          description: "What is network segmentation?",
          section: "Explained",handler: () => {
              window.location.href = "/explained/network-segmentation/";
            },},{id: "explained-osint",
          title: 'OSINT',
          description: "What is OSINT (Open Source Intelligence)?",
          section: "Explained",handler: () => {
              window.location.href = "/explained/osint/";
            },},{id: "explained-password-managers",
          title: 'Password Managers',
          description: "What is a password manager?",
          section: "Explained",handler: () => {
              window.location.href = "/explained/password-managers/";
            },},{id: "explained-patch-management",
          title: 'Patch Management',
          description: "What is patch management?",
          section: "Explained",handler: () => {
              window.location.href = "/explained/patch-management/";
            },},{id: "explained-ransomware",
          title: 'Ransomware',
          description: "What is ransomware?",
          section: "Explained",handler: () => {
              window.location.href = "/explained/ransomware/";
            },},{id: "explained-red-team-vs-blue-team",
          title: 'Red Team vs Blue Team',
          description: "What are red teams and blue teams?",
          section: "Explained",handler: () => {
              window.location.href = "/explained/red-blue-team/";
            },},{id: "explained-social-engineering",
          title: 'Social Engineering',
          description: "What is social engineering?",
          section: "Explained",handler: () => {
              window.location.href = "/explained/social-engineering/";
            },},{id: "explained-strong-passwords",
          title: 'Strong Passwords',
          description: "What is a strong password?",
          section: "Explained",handler: () => {
              window.location.href = "/explained/strong-passwords/";
            },},{id: "explained-supply-chain-attacks",
          title: 'Supply Chain Attacks',
          description: "What is a supply chain attack?",
          section: "Explained",handler: () => {
              window.location.href = "/explained/supply-chain-attacks/";
            },},{id: "explained-two-factor-authentication",
          title: 'Two-Factor Authentication',
          description: "What is 2FA?",
          section: "Explained",handler: () => {
              window.location.href = "/explained/two-factor-authentication/";
            },},{id: "explained-vpn",
          title: 'VPN',
          description: "What is a VPN?",
          section: "Explained",handler: () => {
              window.location.href = "/explained/vpn/";
            },},{id: "explained-zero-trust",
          title: 'Zero Trust',
          description: "What is Zero Trust security?",
          section: "Explained",handler: () => {
              window.location.href = "/explained/zero-trust/";
            },},{id: "news-a-simple-inline-announcement",
          title: 'A simple inline announcement.',
          description: "",
          section: "News",},{id: "news-a-long-announcement-with-details",
          title: 'A long announcement with details',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/news/announcement_2/";
            },},{id: "news-a-simple-inline-announcement-with-markdown-emoji-sparkles-smile",
          title: 'A simple inline announcement with Markdown emoji! :sparkles: :smile:',
          description: "",
          section: "News",},{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/djbsec", "_blank");
        },
      },{
        id: 'social-linkedin',
        title: 'LinkedIn',
        section: 'Socials',
        handler: () => {
          window.open("https://www.linkedin.com/in/djbsec", "_blank");
        },
      },{
        id: 'social-youtube',
        title: 'YouTube',
        section: 'Socials',
        handler: () => {
          window.open("https://youtube.com/@dj_bsec", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
