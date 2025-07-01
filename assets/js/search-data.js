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
        },{id: "nav-repos",
          title: "repos",
          description: "",
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
            },{id: "post-djbsec-39-s-cybernews-7-1-2025",
      
        title: "DJBSEC&#39;s CyberNews 7-1-2025",
      
      description: "7-01-25",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/cybernews0701/";
        
      },
    },{id: "post-djbsec-39-s-cybernews-3-25-25",
      
        title: "DJBSEC&#39;s CyberNews 3-25-25",
      
      description: "3-25-25",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/cybernews0325/";
        
      },
    },{id: "post-djbsec-39-s-cybernews-3-24-25",
      
        title: "DJBSEC&#39;s CyberNews 3-24-25",
      
      description: "3-24-25",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/cybernews0324/";
        
      },
    },{id: "post-djbsec-39-s-cybernews-3-21-25",
      
        title: "DJBSEC&#39;s CyberNews 3-21-25",
      
      description: "3-21-25",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/cybernews0321/";
        
      },
    },{id: "post-djbsec-39-s-cybernews-3-20-25",
      
        title: "DJBSEC&#39;s CyberNews 3-20-25",
      
      description: "3-20-25",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/cybernews0320/";
        
      },
    },{id: "post-djbsec-39-s-cybernews-3-19-25",
      
        title: "DJBSEC&#39;s CyberNews 3-19-25",
      
      description: "3-19-25",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/cybernews0319/";
        
      },
    },{id: "post-djbsec-39-s-cybernews-3-18-25",
      
        title: "DJBSEC&#39;s CyberNews 3-18-25",
      
      description: "3-18-25",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/cybernews0318/";
        
      },
    },{id: "post-djbsec-39-s-cybernews-3-17-25",
      
        title: "DJBSEC&#39;s CyberNews 3-17-25",
      
      description: "3-17-25",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/cybernews0317/";
        
      },
    },{id: "post-djbsec-39-s-cybernews-3-7-25",
      
        title: "DJBSEC&#39;s CyberNews 3-7-25",
      
      description: "3-7-25",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/cybernews0307/";
        
      },
    },{id: "post-djbsec-39-s-cybernews-3-6-25",
      
        title: "DJBSEC&#39;s CyberNews 3-6-25",
      
      description: "3-6-25",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/cybernews0306/";
        
      },
    },{id: "post-djbsec-39-s-cybernews-3-5-25",
      
        title: "DJBSEC&#39;s CyberNews 3-5-25",
      
      description: "3-5-25",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/cybernews0305/";
        
      },
    },{id: "post-djbsec-39-s-cybernews-3-4-25",
      
        title: "DJBSEC&#39;s CyberNews 3-4-25",
      
      description: "3-4-25",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/cybernews0304/";
        
      },
    },{id: "post-djbsec-39-s-cybernews-2-28-25",
      
        title: "DJBSEC&#39;s CyberNews 2-28-25",
      
      description: "2-28-25",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/cybernews0228/";
        
      },
    },{id: "post-djbsec-39-s-cybernews-2-27-25",
      
        title: "DJBSEC&#39;s CyberNews 2-27-25",
      
      description: "2-27-25",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/cybernews0227/";
        
      },
    },{id: "post-djbsec-39-s-cybernews-2-26-25",
      
        title: "DJBSEC&#39;s CyberNews 2-26-25",
      
      description: "2-26-25",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/cybernews0226/";
        
      },
    },{id: "post-djbsec-39-s-cybernews-2-25-25",
      
        title: "DJBSEC&#39;s CyberNews 2-25-25",
      
      description: "2-25-25",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/cybernews0225/";
        
      },
    },{id: "post-djbsec-39-s-cybernews-2-24-25",
      
        title: "DJBSEC&#39;s CyberNews 2-24-25",
      
      description: "Feb 24, 2025",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/cybernews0224/";
        
      },
    },{id: "post-djbsec-39-s-cybernews-2-21-25",
      
        title: "DJBSEC&#39;s CyberNews 2-21-25",
      
      description: "Feb 21, 2025",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/cybernews0221/";
        
      },
    },{id: "post-cybernews-2-20-25",
      
        title: "CyberNews 2-20-25",
      
      description: "Feb 20, 2025",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/cybernews020/";
        
      },
    },{id: "post-cybernews-2-19-25",
      
        title: "CyberNews 2-19-25",
      
      description: "Feb 19, 2025",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/cybernews0219/";
        
      },
    },{id: "post-cybernews-2-18-25",
      
        title: "CyberNews 2-18-25",
      
      description: "Feb 18, 2025",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/cybernews0218/";
        
      },
    },{id: "post-cybernews-2-17-25",
      
        title: "CyberNews 2-17-25",
      
      description: "Feb 17, 2025",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/cybernews0217/";
        
      },
    },{id: "post-cybernews-2-16-25",
      
        title: "CyberNews 2-16-25",
      
      description: "Feb 16, 2025",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/cybernews0216/";
        
      },
    },{id: "post-cybernews-2-14-25",
      
        title: "CyberNews 2-14-25",
      
      description: "Feb 14, 2025",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/cybernews0214/";
        
      },
    },{id: "post-cybernews",
      
        title: "CyberNews",
      
      description: "Jan 24, 2025",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/cybernews0124/";
        
      },
    },{id: "post-a-distill-style-blog-post",
      
        title: "a distill-style blog post",
      
      description: "an example of a distill-style blog post and main elements",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2021/distill/";
        
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
