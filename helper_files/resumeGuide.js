// Resume Guide — Complete Edition
// Sections → what each part of the resume should contain
// formatting → layout rules
// ats → ATS compatibility checklist
// onlinePresence → LinkedIn + GitHub optimization
// actionVerbs → grouped by category
// quantifyTips → weak → strong transformations
// commonMistakes → mistake + fix pairs
// summaryVsObjective → decision guide with examples

export const RESUME_GUIDE = {

  // ══════════════════════════════════════════════════════════
  // SECTIONS
  // ══════════════════════════════════════════════════════════

  sections: [
    {
      id: 'contact',
      name: 'Contact Information',
      icon: '📇',
      required: true,
      order: 1,
      what: 'Your name, phone, email, LinkedIn, GitHub, and city. Nothing more.',
      dos: [
        'Use a professional email — firstname.lastname@gmail.com is the standard.',
        'Link your LinkedIn and GitHub — recruiters check these immediately after your resume.',
        'City and state only — full postal address wastes space and is unnecessary.',
        'Make your name the largest text on the page (16–20pt).',
        'Customize your LinkedIn URL to linkedin.com/in/yourname before putting it on the resume.',
        'Your GitHub link should go directly to your profile — not to one repo.',
      ],
      donts: [
        'No date of birth, photo, gender, religion, marital status — irrelevant and bias-inviting.',
        'No college email that expires after graduation.',
        'No phone number you miss calls on.',
        'No "Objective" statement as a section — outdated, wastes prime space.',
        'No raw auto-generated LinkedIn URL (linkedin.com/in/vishnu-k-123456abc is ugly).',
      ],
      example: {
        good: 'Vishnu Kumar  |  +91 98765 43210  |  vishnu.k@gmail.com  |  linkedin.com/in/vishnu-k  |  github.com/vishnu-k  |  Chennai, TN',
        bad: 'Name: Vishnu Kumar\nD.O.B: 12/04/2002\nGender: Male\nAddress: 12, Anna Nagar, Chennai - 600040\nObjective: To seek a challenging role in a reputed organization where I can apply my skills and grow…',
      },
    },

    {
      id: 'summary',
      name: 'Professional Summary',
      icon: '✍️',
      required: false,
      order: 2,
      what: 'A 2–3 line snapshot of who you are, your strongest skill cluster, and what you bring. Replaces the outdated Objective statement.',
      why: 'Recruiters spend 6–8 seconds on first pass. Your summary is the headline. A strong one makes them read further; a weak one (or an objective) signals a generic candidate. Resumes with a professional summary receive significantly more callbacks than those with objectives.',
      summaryVsObjective: {
        useObjective: 'Only if you have zero relevant experience — not even a side project or internship. Even then, make it specific: name the role and mention one skill.',
        useSummary: 'If you have at least one project, internship, certification, or relevant skill cluster. Use a summary. It performs better on ATS and with humans.',
        hybridTip: 'For freshers with projects but no experience: Open with your strongest skill/profile claim, mention one proof point (project or metric), close with what you\'re targeting. This gives you the ATS keyword density of a summary with the direction-clarity of an objective.',
      },
      dos: [
        'Start with your profile type: "Final-year CSE graduate", "Full-stack developer", "Data engineering fresher".',
        'Name your strongest 2–3 skills explicitly — these are ATS keywords.',
        'Include one specific proof: "built X used by Y people", "interned at Z", "certified in W".',
        'Close with what you\'re targeting — keeps it relevant to this specific role.',
        'Keep it to 2–3 sentences, 40–80 words. No more.',
        'Tailor it per application — change 2–3 keywords to match each JD.',
      ],
      donts: [
        'Never start with "I am a hardworking and dedicated fresher seeking…" — instant rejection signal.',
        'Don\'t list skills you\'ll repeat in the skills section anyway — give proof instead.',
        'No first-person pronouns (I, me, my) — industry convention is to drop them.',
        'Don\'t write a paragraph — 3 sentences is the ceiling.',
        'Never use generic filler: "passionate about technology", "quick learner", "team player" without proof.',
      ],
      example: {
        good: 'Final-year CSE student (VIT Chennai) with hands-on experience in full-stack development using React, Node.js, and MongoDB. Built and deployed a placement prep platform serving 200+ active users, handling authentication, test logic, and real-time dashboards. Seeking a backend or full-stack engineering role where I can ship production-quality features from day one.',
        bad: 'Objective: To obtain a challenging and rewarding position in a reputed IT organization where I can utilize my skills in Computer Science and contribute to the growth of the organization while enhancing my personal and professional development.',
      },
    },

    {
      id: 'education',
      name: 'Education',
      icon: '🎓',
      required: true,
      order: 3,
      what: 'Your UG degree, college, CGPA, and graduation year. Add 10th and 12th scores if above 75%.',
      dos: [
        'Reverse chronological — UG first, then 12th, then 10th.',
        'Put CGPA/percentage — recruiters need a number. Don\'t leave it out.',
        'Add any scholarship, department rank, or gold medal if applicable.',
        'If CGPA is below 6.5 but you have strong projects — push Skills and Projects before Education.',
        'Relevant coursework only if you\'re a fresher with no projects at all — otherwise skip it.',
      ],
      donts: [
        'Don\'t hide CGPA if it\'s below 6.0 — gaps are more noticeable than low scores.',
        'Don\'t write the full college address or abbreviate the university name without spelling it once.',
        'Don\'t add school achievements unless exceptional (national level, Olympiad medals, etc.).',
        'Don\'t write "pursuing" if you\'re in your final year — write the expected graduation year.',
      ],
      example: {
        good: 'B.E. Computer Science & Engineering\nXYZ College of Engineering, Anna University | 2021–2025\nCGPA: 8.4 / 10.0',
        bad: 'B.E. CSE from XYZ College affiliated to AU, Chennai Tamil Nadu India 2021 to 2025 with aggregate marks of 8.4 CGPA out of 10.0 pursuing final semester',
      },
    },

    {
      id: 'skills',
      name: 'Technical Skills',
      icon: '⚙️',
      required: true,
      order: 4,
      what: 'Languages, frameworks, databases, tools, and platforms you can actually answer interview questions about.',
      dos: [
        'Group by category: Languages | Frameworks | Databases | Tools | Cloud/DevOps.',
        'Only list what you can defend in an interview — assume every skill invites questions.',
        'Put your strongest and most relevant skills first within each category.',
        'Mirror exact keywords from the JD — "REST APIs" not "RESTful architecture" if that\'s what they wrote.',
        'Include version numbers only for niche tools where version matters (e.g., TensorFlow 2.x, Java 17).',
      ],
      donts: [
        'No MS Word, PowerPoint, or "Internet browsing" — assumed for everyone.',
        'Don\'t add skills you Googled before writing your resume — interviewers will expose these in 2 questions.',
        'No skill bars, percentages, or star ratings (80% Python) — they are meaningless to recruiters and confuse ATS.',
        'Don\'t stuff 30 skills — 12–18 solid ones beats a wall of buzzwords every time.',
        'Don\'t list soft skills (leadership, communication) in the technical skills section — put evidence of these in project/experience bullets instead.',
      ],
      example: {
        good: 'Languages: Python, Java, C, JavaScript\nFrameworks: React, Node.js, Express\nDatabases: MySQL, MongoDB\nTools: Git, VS Code, Postman, Linux\nCloud: AWS (EC2, S3 basics)',
        bad: 'Skills: C, C++, Java, Python, HTML, CSS, JavaScript, React, Node, Express, MongoDB, MySQL, Git, GitHub, Figma, MS Office, PowerPoint, Leadership, Communication, Teamwork, Problem Solving',
      },
    },

    {
      id: 'projects',
      name: 'Projects',
      icon: '🏗️',
      required: true,
      order: 5,
      what: '2–3 substantial projects. For each: what it does, tech stack, your specific role, and measurable impact.',
      dos: [
        'Lead every bullet with a strong action verb — Built, Developed, Designed, Implemented, Optimized, Deployed.',
        'Add the tech stack in parentheses in the project title line.',
        'Quantify wherever possible — number of users, % improvement, requests/day, ms latency saved.',
        'Include GitHub or live link if the project is clean and presentable — recruiters click these.',
        '2–3 bullets per project is ideal. 4 max. Never a paragraph.',
        'If it\'s a team project, state YOUR specific contribution explicitly.',
      ],
      donts: [
        'Don\'t write "A project to…" — start describing directly.',
        'Don\'t list lab assignments — only self-built or substantially self-contributed work.',
        'Don\'t describe copy-pasted tutorial code you can\'t fully explain.',
        'No vague bullets like "Worked on backend" — say what part, in what tech, with what outcome.',
        'Don\'t list a project if you can\'t answer: "Why did you make that tech choice?"',
      ],
      example: {
        good: 'PrepPilot — Full-Stack Study Tracker (React, Node.js, MongoDB)\n• Built topic-wise progress dashboard with streak tracking, serving 500+ active students\n• Implemented JWT authentication and refresh token rotation, reducing unauthorized access to zero\n• Optimized MongoDB queries with compound indexes, cutting average API response time from 820ms to 140ms\n• Deployed on Render with CI/CD pipeline via GitHub Actions\n• github.com/vishnu/preppilot',
        bad: 'PrepPilot\n• Made a website using React and Node.js for studying purposes\n• Used MongoDB as database\n• Added login and signup features\n• This project was made as part of my final year mini project',
      },
    },

    {
      id: 'experience',
      name: 'Internships / Experience',
      icon: '💼',
      required: false,
      order: 6,
      what: 'Any internship, freelance work, or part-time role. Even a 1-month internship is worth including if you shipped something real.',
      dos: [
        'Format: Role | Company | Month Year – Month Year.',
        'Focus on what you shipped and what improved, not what tasks you were assigned.',
        'Mention team size and tech stack for context.',
        'Use the same action verb + metric + context formula as project bullets.',
        'If you freelanced, treat each client as a separate entry with scope and tech stack.',
      ],
      donts: [
        'Don\'t describe daily tasks — "attended standups, reviewed PRs" tells a recruiter nothing.',
        'Don\'t stretch a 2-week certificate course into an "internship".',
        'Eliminate passive voice entirely — "was responsible for" → "built"; "helped in development" → "developed".',
        'Don\'t omit the tech stack — recruiters screen by technology even in experience bullets.',
      ],
      example: {
        good: 'Software Engineering Intern | TechCorp Pvt. Ltd. | June 2024 – Aug 2024\n• Built 14 REST API endpoints for an inventory module (Node.js + Express) handling 10K requests/day\n• Reduced average DB query time by 40% by adding composite indexes and optimizing 3 slow SQL joins\n• Wrote unit and integration tests (Jest) achieving 78% code coverage on the module\n• Worked in a 5-member Agile team using Jira, 2-week sprints, and daily standups',
        bad: 'Intern at TechCorp from June to August 2024\n• Was responsible for backend development tasks\n• Attended daily meetings and contributed to the project\n• Learned new technologies and improved my communication skills',
      },
    },

    {
      id: 'achievements',
      name: 'Achievements & Certifications',
      icon: '🏆',
      required: false,
      order: 7,
      what: 'Competitive coding ranks, hackathon placements, relevant certifications, paper publications. Quality over quantity.',
      dos: [
        'Coding ratings: include if LeetCode 1500+, CodeChef/Codeforces 1400+ (Specialist) or better.',
        'Always state rank out of total participants for competitions: "Top 5% of 3,200 teams."',
        'Only add certifications from recognized platforms: AWS, Google, Microsoft, Coursera (accredited courses), NPTEL.',
        'For publications: title + conference/journal name + year. No need for full citation.',
        'Order by impact: hackathon wins > competitive coding ranks > certifications.',
      ],
      donts: [
        'No participation certificates — only placements or wins.',
        'Don\'t list courses you enrolled in but didn\'t finish.',
        'No "Microsoft Office Specialist" or similar — not relevant for tech roles.',
        'Keep the entire section to 4–5 lines maximum.',
        'Don\'t add a certification just to pad the section — recruiters can tell.',
      ],
      example: {
        good: '• LeetCode: 1,650 rating | 350+ problems solved (Top 10% globally)\n• Smart India Hackathon 2024 — National Finalist (Top 10 / 4,500+ teams)\n• AWS Certified Cloud Practitioner — Amazon Web Services, 2024\n• NPTEL: Data Structures & Algorithms — Elite + Gold (Score: 91/100)',
        bad: '• Participated in college techfest 2022\n• Completed Python for Beginners on Udemy\n• Certificate of Participation — TCS CodeVita 2023\n• Microsoft Office Specialist — Excel 2019',
      },
    },

    {
      id: 'extracurricular',
      name: 'Extracurricular / Leadership',
      icon: '🌟',
      required: false,
      order: 8,
      what: 'Leadership roles in clubs, event coordination, or volunteer work that shows initiative or scale. Keep it tight.',
      dos: [
        'Only include if you held an actual leadership position or organized something with real scope.',
        'Quantify: "organized event for 400 participants", "managed 12-member committee", "₹2L budget".',
        'Max 2–3 lines — this is a supporting section, not a main one.',
        'Use it to show qualities that don\'t appear elsewhere: team leadership, event execution, mentoring.',
      ],
      donts: [
        'Don\'t list clubs you were a general member of — membership alone means nothing.',
        'Don\'t write "Good at teamwork, communication, and leadership" — this adds no information.',
        'Remove this section entirely if you\'re running out of page space — Projects and Skills take priority.',
      ],
      example: {
        good: '• Technical Head — IEEE Student Branch, XYZ College (2023–24): Organized 3 workshops for 200+ students, managed sponsorship from 4 companies\n• Event Coordinator — APEX Symposium 2024: Managed ₹2L budget and logistics for 400-participant two-day technical fest',
        bad: '• Member of NSS\n• Participated in blood donation camp\n• Good communication and leadership skills\n• Quick learner, hardworking and dedicated team player',
      },
    },
  ],

  // ══════════════════════════════════════════════════════════
  // FORMATTING RULES
  // ══════════════════════════════════════════════════════════

  formatting: [
    {
      rule: 'One Page Only',
      icon: '📄',
      detail: 'As a fresher or anyone with under 3 years of experience, one page is mandatory — not a guideline. Recruiters spend 6–8 seconds on first pass. Two pages signals poor prioritization. One page forces you to keep only what matters.',
    },
    {
      rule: 'Font: 10–11pt body, 16–20pt name',
      icon: '🔤',
      detail: 'Use Calibri, Garamond, or Georgia. Avoid Times New Roman (looks dated) and any decorative font. Body: 10–11pt. Section headers: 12–13pt bold. Your name: 16–20pt. Nothing else varies. Never mix more than 2 fonts.',
    },
    {
      rule: 'Margins: 0.5–0.75 inch',
      icon: '📐',
      detail: 'Standard 1-inch margins waste space freshers can\'t afford. Drop to 0.5–0.75 inch. Never below 0.5 — text near the edge reads as unprofessional on screen.',
    },
    {
      rule: 'Single column only',
      icon: '📋',
      detail: 'ATS systems parse left-to-right, top-to-bottom. Multi-column resumes confuse parsers and your content gets garbled or skipped. Use a single column even if it looks plain — ATS score matters more than visual design when applying online.',
    },
    {
      rule: 'No colors, photos, icons, or graphics',
      icon: '🚫',
      detail: 'For Indian IT and product companies, clean black-and-white resumes beat colorful ones for ATS and human parsing. Photos introduce bias and aren\'t required by law in India or most countries. Skill bars, pie charts, and icons are invisible to or garble ATS parsers. If applying to design or creative roles, a separate portfolio link is the right way to show visual skill.',
    },
    {
      rule: 'Save as PDF, name the file correctly',
      icon: '💾',
      detail: 'Always export as PDF — Word docs change formatting across machines and Word versions. File name: FirstName_LastName_Resume.pdf. Never "resume_final_v4_FINAL.pdf". The filename is the first thing a recruiter sees in their downloads folder.',
    },
    {
      rule: 'Consistent date format everywhere',
      icon: '📅',
      detail: 'Pick one and use it in every date across the entire document: "June 2024" or "Jun 2024" or "06/2024". Mixing formats signals carelessness. Reverse chronological everywhere — most recent first.',
    },
    {
      rule: 'Line spacing: 1.0–1.15',
      icon: '↕️',
      detail: 'Single spacing (1.0) with a small visual gap between sections is the right balance. Double spacing wastes half your page. Spacing below 0.9 makes the resume hard to scan on screen.',
    },
    {
      rule: 'Section order for freshers with strong projects',
      icon: '📑',
      detail: 'Recommended order: Contact → Summary → Skills → Projects → Education → Experience (if any) → Achievements → Extracurricular. Skills before Education puts your technical depth front-and-center instead of your CGPA.',
    },
    {
      rule: 'Section order for freshers with internship experience',
      icon: '📑',
      detail: 'Recommended order: Contact → Summary → Experience → Projects → Skills → Education → Achievements. Leading with real work experience is stronger than leading with skills if you have something to show.',
    },
  ],

  // ══════════════════════════════════════════════════════════
  // ATS CHECKLIST
  // ══════════════════════════════════════════════════════════

  ats: [
    {
      check: 'Use standard section headings',
      detail: '"Education", "Experience", "Skills", "Projects" — not "My Journey", "What I Know", or "About Me". ATS parsers are trained on standard headings and will miss or miscategorize non-standard ones.',
    },
    {
      check: 'No tables or text boxes',
      detail: 'ATS parsers often skip text inside tables or floating text boxes entirely. Everything must be in the normal document body — no exceptions.',
    },
    {
      check: 'Spell out acronyms once',
      detail: 'Write "Machine Learning (ML)" the first time, then use "ML" freely. Some parsers miss acronym-only mentions.',
    },
    {
      check: 'Mirror keywords from the JD exactly',
      detail: 'If the JD says "REST APIs", use "REST APIs" — not "RESTful services" or "API development". ATS keyword matching is often literal. Read the JD, list the technical nouns, check yours match.',
    },
    {
      check: 'No headers/footers for contact or key info',
      detail: 'Many ATS parsers ignore the header and footer regions of Word/PDF documents. Put your name, email, and phone in the main body — not in a header band.',
    },
    {
      check: 'Bullet points, not paragraphs',
      detail: 'Bullet points are parsed reliably. Paragraphs of running text often get truncated, merged, or mis-attributed to the wrong job entry by parsers.',
    },
    {
      check: 'Standard bullets only (• or -)',
      detail: 'Simple bullet characters (•, -, or *) parse cleanly. Fancy Unicode bullets (▸, ➤, ✦, ❖) render as garbled characters or empty boxes in many parsers.',
    },
    {
      check: 'No inline images, logos, or icons',
      detail: 'College logos, company logos, skill icons, and profile photos embedded in the document are invisible to ATS parsers and waste rendering space.',
    },
    {
      check: 'Avoid creative PDF exports from design tools',
      detail: 'Resumes made in Canva, Figma, or Adobe InDesign and exported as PDF often produce non-selectable text that ATS parsers read as blank. Use Google Docs or Word to create, then export to PDF.',
    },
    {
      check: 'Test your resume in a text parser',
      detail: 'Paste your resume into Notepad or a plain text editor. Whatever comes out garbled or missing is what ATS sees. Fix anything that loses its structure or disappears.',
    },
  ],

  // ══════════════════════════════════════════════════════════
  // ONLINE PRESENCE — LinkedIn & GitHub
  // ══════════════════════════════════════════════════════════

  onlinePresence: {

    why: '95% of recruiters check LinkedIn before calling. 70% check GitHub for tech roles. Your resume gets you noticed — your online presence decides if you get called. A weak LinkedIn profile after a strong resume is a trust breakdown at the worst possible moment.',

    linkedin: {
      title: 'LinkedIn Profile Optimization',
      icon: '💼',
      sections: [
        {
          name: 'Profile Photo',
          priority: 'Critical',
          rule: 'Profiles with photos get 21x more views. Use a clean headshot — plain background, professional but not stiff. No selfies, group photos, or holiday pictures.',
        },
        {
          name: 'Custom URL',
          priority: 'High',
          rule: 'Change from the auto-generated mess (linkedin.com/in/vishnu-k-123456abc) to linkedin.com/in/vishnu-k. This goes on your resume. Settings → Edit public profile & URL.',
        },
        {
          name: 'Headline',
          priority: 'Critical',
          rule: 'This is the most-searched field. Don\'t just write "Fresher | B.Tech CSE". Write what you do and what you target: "Full-Stack Developer (React + Node.js) | Final Year CSE | Open to SDE Roles". Keywords here directly affect your appearance in recruiter searches.',
          badExample: 'Final Year B.Tech Student | Looking for Opportunities',
          goodExample: 'Full-Stack Developer | React · Node.js · MongoDB | Final Year CSE @ VIT | Seeking SDE Roles 2025',
        },
        {
          name: 'About Section',
          priority: 'High',
          rule: 'This is your extended summary — 3–5 sentences. Who you are, what you build, one achievement with proof, and what you\'re looking for. Write in first person here (unlike the resume). End with a call to action: "Open to SDE roles — feel free to reach out."',
          badExample: 'I am a passionate and hardworking fresher who loves to learn new technologies and contribute to organizational growth.',
          goodExample: 'I\'m a final-year CSE student building full-stack web apps. I built PrepPilot — a placement prep platform now used by 200+ students at my college — solo, from auth to deployment. I work primarily with React, Node.js, and MongoDB. Currently seeking SDE roles where I can contribute to a real product from day one. DMs open.',
        },
        {
          name: 'Experience / Projects Section',
          priority: 'High',
          rule: 'Add your projects as "Experience" entries with company name as your name or "Personal Project". For each, write 2–3 bullets using the same action verb + metric formula as your resume. GitHub links can go in the description.',
        },
        {
          name: 'Skills Section',
          priority: 'Medium',
          rule: 'Add 10–15 skills. Prioritize skills that appear in job descriptions you\'re targeting. Skills with endorsements rank higher in search. Ask batchmates or professors to endorse your top 3 skills.',
        },
        {
          name: 'Open to Work',
          priority: 'High',
          rule: 'Turn this on. You can show it only to recruiters (not your network) if you don\'t want it public. LinkedIn says candidates with Open to Work receive 2x more recruiter messages. There is no downside to enabling it.',
        },
        {
          name: 'Activity and Posts',
          priority: 'Medium',
          rule: 'You don\'t need to post daily. 1–2 posts per week is enough. Post about projects you\'re building, problems you solved, or things you learned. A technical post with a screenshot or code snippet signals active learning. Recruiters check activity recency.',
        },
        {
          name: 'Recommendations',
          priority: 'Medium',
          rule: 'Ask 2–3 people for written recommendations — a professor, internship manager, or senior batchmate who worked with you. Even one strong recommendation increases credibility significantly.',
        },
      ],
      mistakes: [
        'Leaving the headline as "Fresher" — it appears in search results and signals nothing.',
        'Not customizing the URL before putting it on the resume.',
        'Empty About section or generic text copied from resume.',
        'Skills section empty — reduces search ranking significantly.',
        'Not enabling Open to Work.',
        'Inconsistency between resume and LinkedIn — dates, company names, project details must match exactly. Recruiters cross-check.',
      ],
    },

    github: {
      title: 'GitHub Profile Optimization',
      icon: '💻',
      sections: [
        {
          name: 'Profile README',
          priority: 'High',
          rule: 'Create a special repository with your username (e.g., vishnu-k/vishnu-k) and add a README.md. This shows on your profile page. Include: 2–3 lines about yourself, your tech stack, and your current focus. Recruiters often land here first.',
        },
        {
          name: 'Pinned Repositories',
          priority: 'Critical',
          rule: 'Pin your 4–6 best projects. Unpinned profiles show repositories in random order — a recruiter might see a half-finished experiment first. Go to your profile → Customize your pins → Select your best work.',
        },
        {
          name: 'Repository READMEs',
          priority: 'Critical',
          rule: 'Every pinned project must have a clear README: what it does, tech stack, how to run it locally, screenshots or demo link. A project with no README looks abandoned. Recruiters judge code quality partly by README quality.',
        },
        {
          name: 'Commit History',
          priority: 'Medium',
          rule: 'Consistent commits over time look better than one giant push the day before an interview. If you built something over 3 months, your commit history should show that. Don\'t fake activity but do commit small changes as you work rather than dumping everything at once.',
        },
        {
          name: 'Repository Names',
          priority: 'Medium',
          rule: 'Name repos professionally: "placement-prep-platform" not "my-project-123" or "test-repo-v4". Repository names appear in recruiter search results.',
        },
        {
          name: 'Clean Up Before Linking',
          priority: 'Critical',
          rule: 'Before putting your GitHub link anywhere, audit your profile. Delete or make private: incomplete experiments, "learning" repos with no commits, forked-but-untouched repos, repos with "test", "temp", "demo" in the name that aren\'t presentable. If a recruiter clicks your link and sees 20 empty repos, it works against you.',
        },
        {
          name: 'Contribution Graph',
          priority: 'Low',
          rule: 'A healthy-looking contribution graph signals ongoing activity. Don\'t chase the green squares as a goal, but understand that active builders naturally have consistent contribution patterns. If you haven\'t pushed anything in 6 months, clean up and make a few meaningful commits before sending your profile out.',
        },
      ],
      mistakes: [
        'Linking a GitHub that has only forked repos and no original work.',
        'Projects with no README — looks like you abandoned them.',
        'All commits pushed in one day (obvious bulk-upload, not real development).',
        'Repository names like "project1", "untitled2", "test_final" — unprofessional.',
        'Profile with no pinned repos — recruiter sees the oldest or most random ones first.',
        'Private profile — defeats the purpose of linking it.',
      ],
    },

    portfolio: {
      title: 'Personal Portfolio Website (Optional but Powerful)',
      icon: '🌐',
      when: 'For frontend, full-stack, UI/UX, or creative tech roles — a portfolio website is worth the 1–2 days to build. For backend or data roles, GitHub + LinkedIn is sufficient.',
      what: 'A single-page site: name, 2-line bio, 3–4 projects with screenshots and links, skills, contact. Does not need to be elaborate — clean and fast is better than impressive and slow.',
      tip: 'Host free on Vercel, Netlify, or GitHub Pages. Use your name as the domain if possible (vishnu-kumar.dev). Put the link in your resume contact header alongside LinkedIn and GitHub.',
    },
  },

  // ══════════════════════════════════════════════════════════
  // ACTION VERBS
  // ══════════════════════════════════════════════════════════

  actionVerbs: {
    built:    ['Built', 'Developed', 'Engineered', 'Implemented', 'Architected', 'Shipped', 'Deployed', 'Coded', 'Programmed', 'Constructed'],
    improved: ['Optimized', 'Reduced', 'Improved', 'Refactored', 'Accelerated', 'Streamlined', 'Automated', 'Migrated', 'Scaled', 'Enhanced'],
    led:      ['Led', 'Coordinated', 'Managed', 'Mentored', 'Collaborated', 'Organized', 'Facilitated', 'Directed', 'Spearheaded', 'Championed'],
    designed: ['Designed', 'Prototyped', 'Modeled', 'Planned', 'Researched', 'Analyzed', 'Evaluated', 'Proposed', 'Architected', 'Conceived'],
    tested:   ['Tested', 'Validated', 'Debugged', 'Diagnosed', 'Resolved', 'Troubleshot', 'Verified', 'Monitored', 'Audited', 'Benchmarked'],
    created:  ['Created', 'Launched', 'Initiated', 'Established', 'Introduced', 'Pioneered', 'Founded', 'Generated', 'Published', 'Produced'],
  },

  // ══════════════════════════════════════════════════════════
  // QUANTIFY TIPS
  // ══════════════════════════════════════════════════════════

  quantifyTips: [
    {
      weak: 'Improved app performance',
      strong: 'Reduced page load time by 40% using lazy loading and code splitting, improving Lighthouse score from 54 to 91',
    },
    {
      weak: 'Built an authentication system',
      strong: 'Implemented JWT-based auth with refresh token rotation, securing 1,200+ user accounts and reducing session hijacking risk',
    },
    {
      weak: 'Worked on database queries',
      strong: 'Optimized 12 slow SQL queries, reducing average response time from 2.3s to 180ms by adding composite indexes and rewriting subqueries',
    },
    {
      weak: 'Developed a REST API',
      strong: 'Designed and deployed 18 REST API endpoints handling 50K requests/day with 99.9% uptime and sub-200ms average response',
    },
    {
      weak: 'Participated in hackathon',
      strong: 'Placed 3rd out of 850 teams at HackIndia 2024, building an AI-powered resume parser in 24 hours (React + Python + GPT-3.5)',
    },
    {
      weak: 'Managed a team project',
      strong: 'Led a 4-person team to deliver a full-stack e-commerce app in 6 weeks — on time, with zero critical bugs at demo',
    },
    {
      weak: 'Used Git for the project',
      strong: 'Maintained a Git workflow with feature branches, PR reviews, and semantic commit messages across a 3-person team over 4 months',
    },
    {
      weak: 'Added tests to the codebase',
      strong: 'Wrote 47 unit and integration tests (Jest + Supertest), achieving 82% code coverage on the API layer',
    },
    {
      weak: 'Fixed bugs in the application',
      strong: 'Resolved 23 bugs reported during beta testing, reducing crash rate from 12% to 0.3% over 2 weeks',
    },
    {
      weak: 'Deployed the project online',
      strong: 'Deployed full-stack app on Render with GitHub Actions CI/CD pipeline — new code ships to production in under 3 minutes',
    },
  ],

  // ══════════════════════════════════════════════════════════
  // COMMON MISTAKES
  // ══════════════════════════════════════════════════════════

  commonMistakes: [
    {
      mistake: 'Objective Statement (the old-school one)',
      fix: 'Replace with a 2–3 line Professional Summary that leads with your profile type, names your skills, and includes one proof point. Or remove it entirely and use that space for an extra project bullet.',
    },
    {
      mistake: '"References available on request"',
      fix: 'Remove it. Everyone knows you\'ll provide references if asked. This wastes a full line that could be used for something that helps you.',
    },
    {
      mistake: 'Hobbies & Interests section',
      fix: 'Remove unless directly relevant — competitive programming, open source contributions, or a tech blog count. "Listening to music" and "watching movies" add zero information.',
    },
    {
      mistake: 'Passive voice throughout bullets',
      fix: 'Change every instance: "Was responsible for X" → "Built X". "Helped in development" → "Developed". "Was involved in testing" → "Tested 14 modules". Every bullet must start with an active verb.',
    },
    {
      mistake: 'Same resume sent to every company',
      fix: 'Tailor the summary and top skills to match each JD\'s keywords. Takes 10–15 minutes and significantly improves ATS match rate. Keep a master resume and create targeted versions from it.',
    },
    {
      mistake: 'Lying or inflating numbers',
      fix: 'Interviewers ask deep technical questions about everything on your resume. If you list Kubernetes, expect to explain pod autoscaling. If you write "500 users", know how you measured it. Getting caught is an immediate disqualification.',
    },
    {
      mistake: 'Low CGPA without compensating strengths upfront',
      fix: 'If CGPA is below 6.5 but you have strong projects: reorder sections — Skills and Projects before Education. Lead with what makes you competitive, not what doesn\'t.',
    },
    {
      mistake: 'No GitHub or LinkedIn',
      fix: 'These are the first things a recruiter verifies after your resume. A GitHub with 4–6 clean, documented projects is worth more than 5 certifications. Create both, optimize both, then put both on the resume.',
    },
    {
      mistake: 'Linking a bad GitHub or empty LinkedIn',
      fix: 'Worse than having no link is having a bad one. Audit both profiles before linking. Delete empty repos, add READMEs, fill the LinkedIn About section. A broken link creates suspicion; no link creates a question. A clean profile creates trust.',
    },
    {
      mistake: 'Inconsistency between resume and LinkedIn',
      fix: 'Recruiters cross-check. Company names, dates, project names, and role descriptions must match between your resume and LinkedIn. Discrepancies look dishonest even if accidental.',
    },
    {
      mistake: 'PDF generated from Canva or Figma',
      fix: 'Design-tool PDFs often produce non-selectable text that ATS reads as blank. Build your resume in Google Docs or Microsoft Word, then export as PDF. Test by selecting all text — if you can\'t select it, neither can the ATS.',
    },
    {
      mistake: 'Using a college email address',
      fix: 'College emails expire. Recruiters who try to reach you 3 months after graduation get a bounce. Use a permanent Gmail.',
    },
  ],

  // ══════════════════════════════════════════════════════════
  // SUMMARY VS OBJECTIVE — DECISION GUIDE
  // ══════════════════════════════════════════════════════════

  summaryVsObjective: {
    title: 'Professional Summary vs Career Objective',
    verdict2026: 'Use a Professional Summary in almost all cases. The traditional objective ("seeking a challenging position...") is a trust-killer. Resumes with summaries receive 340% more callbacks than those with traditional objectives.',
    whenSummary: [
      'You have at least one project, internship, certification, or skill cluster worth naming.',
      'You\'re applying to a role in your field of study or adjacent area.',
      'You want maximum ATS keyword density in the first visible block of text.',
    ],
    whenObjective: [
      'You have literally zero relevant experience — no projects, no internships, no certifications.',
      'You\'re changing careers and your past experience doesn\'t connect to the new field.',
      'Even then: make it specific. "Seeking opportunities to grow" is the objective version of "I am a hardworking person."',
    ],
    summaryTemplateForFreshers: '[Profile type] with [skill or project proof]. [One specific achievement or metric]. [What you\'re targeting and why].',
    examples: {
      strong: [
        'Final-year CSE student with hands-on full-stack experience (React, Node.js, MongoDB). Built and shipped a placement prep platform serving 200+ active users. Seeking an SDE role where I can contribute to production systems from day one.',
        'Data engineering fresher with Python, SQL, and Spark skills developed through a 3-month internship at a fintech startup. Reduced ETL pipeline runtime by 35% through partition optimization. Targeting a data engineering or analytics engineering role.',
        'Computer Science graduate with a 91% accuracy ML classifier (BERT fine-tuning) as a final year project and 1,650 LeetCode rating. Strong in algorithms, Python, and NLP. Seeking a backend or ML engineering role at a product-focused team.',
      ],
      weak: [
        'Objective: To work in a reputed organization where I can use my skills and contribute to team success while learning and growing as a professional.',
        'I am a passionate software developer who loves to solve complex problems and collaborate with teams.',
        'Seeking a challenging position that aligns with my educational background and helps me grow.',
      ],
    },
  },

};