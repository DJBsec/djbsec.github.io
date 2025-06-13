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
  },{id: "nav-cybernews-blog",
          title: "CyberNews Blog",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/blog/";
          },
        },{id: "nav-cs-explained",
          title: "CS Explained",
          description: "Understanding Cybersecurity by DJBSEC",
          section: "Navigation",
          handler: () => {
            window.location.href = "/projects/";
          },
        },{id: "nav-epss-score",
          title: "EPSS Score",
          description: "Find the EPSS Score of any CVE with this quick lookup.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/epss/";
          },
        },{id: "nav-repositories",
          title: "repositories",
          description: "Edit the `_data/repositories.yml` and change the `github_users` and `github_repos` lists to include your own GitHub profile and repositories.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/repositories/";
          },
        },{id: "dropdown-blue-team",
              title: "Blue Team",
              description: "",
              section: "Dropdown",
              handler: () => {
                window.location.href = "";
              },
            },{id: "dropdown-red-team",
              title: "Red Team",
              description: "",
              section: "Dropdown",
              handler: () => {
                window.location.href = "";
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
    },{id: "news-a-simple-inline-announcement",
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
          section: "News",},{id: "projects-phishing",
          title: 'Phishing',
          description: "what is phishing?",
          section: "Projects",handler: () => {
              window.location.href = "/projects/1_project/";
            },},{
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
