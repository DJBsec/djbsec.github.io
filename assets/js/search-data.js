// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "about",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-cybernews",
          title: "CyberNews",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/blog/";
          },
        },{id: "nav-cybersecurity-explained",
          title: "Cybersecurity Explained",
          description: "Breaking down complex security topics into plain language — no technical background required.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/explained/";
          },
        },{id: "nav-epss",
          title: "EPSS",
          description: "Look up EPSS scores, CISA KEV status, and CVSS severity for any CVE.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/epss/";
          },
        },{id: "nav-ai-tools-amp-prompts",
          title: "AI Tools &amp; Prompts",
          description: "Learn how to use AI effectively with curated prompt repositories and resources to get better results from tools like ChatGPT, Claude, Copilot, and more.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/ai-tools-prompts/";
          },
        },{id: "nav-repos",
          title: "repos",
          description: "GitHub repositories and projects from DJBSec.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/repositories/";
          },
        },{id: "nav-blue-team",
          title: "Blue Team",
          description: "Defensive cybersecurity tools and resources for Blue Team professionals, including vulnerability management, web security analysis, and threat intelligence.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/blue-team/";
          },
        },{id: "dropdown-books",
              title: "books",
              description: "",
              section: "Dropdown",
              handler: () => {
                window.location.href = "";
              },
            },{id: "dropdown-learning",
              title: "learning",
              description: "",
              section: "Dropdown",
              handler: () => {
                window.location.href = "";
              },
            },{id: "dropdown-podcasts",
              title: "podcasts",
              description: "",
              section: "Dropdown",
              handler: () => {
                window.location.href = "";
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
    },{id: "explained-phishing",
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
