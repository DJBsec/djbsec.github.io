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
          description: "Understanding Cybersecurity by DJBSEC",
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
            },},{id: "explained-email-spoofing",
          title: 'Email Spoofing',
          description: "What is email spoofing?",
          section: "Explained",handler: () => {
              window.location.href = "/explained/emailspoofing/";
            },},{id: "explained-firewalls",
          title: 'Firewalls',
          description: "What is a firewall?",
          section: "Explained",handler: () => {
              window.location.href = "/explained/firewalls/";
            },},{id: "explained-ransomware",
          title: 'Ransomware',
          description: "What is ransomware?",
          section: "Explained",handler: () => {
              window.location.href = "/explained/ransomware/";
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
