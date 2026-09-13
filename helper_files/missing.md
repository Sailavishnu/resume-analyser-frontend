# Resume Analyser Platform — Comprehensive Feature Upgrade & Implementation Prompt

## 0. Purpose

This document is the **single implementation prompt/specification** for upgrading the existing Resume Analyser application.

The current application already has a polished React frontend with Student, HR, and Admin portals, routing, Zustand stores, reusable UI components, animations, dashboards, resume analysis, ATS, JD matching, resume builder, interview, applications, candidate screening, jobs, analytics, notifications, profile/settings and related workflows.

For this phase:

- **Keep the existing visual identity and overall architecture.**
- **Do not redesign the application from scratch.**
- **Do not remove existing features merely because they currently use mock data.**
- **Continue using mock data and simulated processing for now.**
- Structure the implementation so the mock service layer can later be replaced by FastAPI/API calls without rewriting the UI.
- Make the application feel like a **real, connected AI career and recruitment platform**, not a collection of unrelated mock screens.
- Every new feature must actually work in the frontend: interactions, state changes, navigation, filtering, editing, saving, progress updates, modals, confirmations, empty states, loading states and success/error feedback should all behave realistically using mock data.

The goal is to evolve the current application from a visually strong prototype into a **feature-complete frontend prototype with realistic product behavior and clear backend integration boundaries**.

---

# 1. Important Scope Decisions

## 1.1 Features to implement

Implement all of the following:

1. Enhanced AI Resume Health / Resume Analyzer
2. Enhanced ATS simulator and detailed scoring
3. Advanced JD Matching and Skill Gap Analysis
4. AI Resume Improvement
5. Intelligent Resume Builder
6. AI Mock Interview with adaptive evaluation
7. Career Readiness Score
8. Personalized Career Roadmap
9. Application Tracker and recruitment pipeline
10. Notification Center improvements
11. Personalized Student Dashboard
12. AI Candidate Matching for HR
13. Advanced HR Candidate Search and Filtering
14. HR recruitment pipeline improvements
15. Personalized Job Recommendations
16. Skill Assessments
17. Career progress tracking
18. Privacy, trust and recruitment safety features
19. Student activity streak
20. Cross-feature data relationships
21. Improved Admin analytics around the above systems
22. Better loading, empty, error and success states
23. Better icon/button placement and interaction consistency
24. Mock-service architecture designed for later backend replacement

## 1.2 Explicitly DO NOT add

### Do not add an AI Job Description Generator

The current HR job creation flow is sufficient. Keep the existing job-description creation/editing workflow and ATS weighting system. It may be improved for usability, validation and matching configuration, but do not introduce a separate "Generate JD with AI" feature.

### Do not add full gamification

Do not add:

- XP
- points
- leaderboards
- badges
- levels
- achievement collections
- reward systems
- coins
- competitive rankings

Keep **only a simple activity streak** on the student dashboard/profile where appropriate.

---

# 2. Core Product Direction

The platform should feel like one connected system:

```text
Student
   |
   | Resume upload / Resume Builder
   v
Resume Intelligence
   |
   +----> Resume Health / ATS
   |
   +----> JD Match
   |
   +----> Skill Gap
   |
   +----> Resume Improvement
   |
   +----> Career Readiness
              |
              v
       Career Roadmap
              |
              v
      Skill Assessments
              |
              v
       Job Recommendations
              |
              v
           Apply
              |
              v
     Application Tracking
              |
              v
      Mock Interview
              |
              v
      Interview Evaluation
              |
              v
      Career Progress
```

HR should have the corresponding recruitment workflow:

```text
HR
 |
 +----> Create Job
 |
 +----> Configure matching criteria
 |
 +----> Receive Applications
 |
 +----> Candidate Search / Filters
 |
 +----> AI Candidate Match
 |
 +----> Screening
 |
 +----> Shortlist
 |
 +----> Interview
 |
 +----> Hiring pipeline
 |
 +----> Recruitment analytics
```

The important design principle is:

> **Do not simply add pages. Connect existing pages so that information produced in one feature becomes useful in another feature.**

---

# 3. Technical Architecture for the Mock Phase

Before implementing the features, refactor the current mock-data approach enough that backend integration will later be straightforward.

## 3.1 Keep Zustand

Continue using Zustand for frontend application state.

Do not replace Zustand with another state-management library unless there is a genuine technical reason.

Separate state into logical domains:

```text
authStore
studentStore
hrStore
adminStore
notificationStore
themeStore
communityStore
```

Continue this pattern.

## 3.2 Introduce a mock service layer

Do not make pages directly contain artificial `setTimeout()` business logic wherever possible.

Create a structure similar to:

```text
src/
  services/
    mock/
      resumeService.js
      atsService.js
      jdMatchService.js
      interviewService.js
      roadmapService.js
      assessmentService.js
      jobService.js
      applicationService.js
      candidateService.js
      notificationService.js
    index.js
```

Example:

```js
resumeService.analyzeResume(file)
atsService.getAnalysis(resumeId)
jdMatchService.matchResumeToJob(resumeId, jobId)
roadmapService.getRoadmap(targetRole)
assessmentService.startAssessment(skill)
candidateService.getCandidateMatches(jobId)
```

The pages should call services/store actions rather than knowing whether the result is mock or API-based.

Later:

```text
mock service
     ↓
FastAPI service
     ↓
database / AI / file processing
```

The UI should remain largely unchanged.

## 3.3 Simulated processing

Use realistic processing states.

For example:

```text
Uploading
   ↓
Reading document
   ↓
Extracting sections
   ↓
Analyzing skills
   ↓
Evaluating ATS compatibility
   ↓
Generating recommendations
   ↓
Complete
```

Do not always use a single generic "Loading..." spinner.

Use contextual progress where it improves the experience.

---

# 4. Global UI/UX Rules

This is extremely important.

## 4.1 Preserve the existing visual language

Continue the current:

- dark/light theme support
- glassmorphism
- subtle borders
- rounded cards
- restrained gradients
- teal/emerald/brand accents
- Framer Motion transitions
- Lucide icons
- compact typography
- dashboard-style layouts

Do not turn the application into a completely different visual system.

## 4.2 Icons must always be correctly placed

Audit every existing and newly modified screen.

Rules:

- Icons must visually belong to the action they represent.
- Do not put decorative icons inside random whitespace.
- Use consistent icon sizes.
- Use `lucide-react`.
- Do not mix multiple unrelated icon styles.
- Do not place an icon where it makes a button look like a text label.
- Primary buttons may contain an icon on the left.
- External/navigation actions can use `ArrowUpRight` or similar on the right.
- Destructive actions should use a recognizable destructive icon.
- Upload actions should use upload/file icons.
- Search should use `Search`.
- Filtering should use `SlidersHorizontal` or equivalent.
- Resume/document actions should use `FileText`.
- Jobs should use `Briefcase`.
- Interview should use `MessageSquare`, `Mic`, `Video` or an appropriate equivalent.
- Skills should use `Sparkles`, `Brain`, `Code2` or an appropriate equivalent.
- Career progress should use `TrendingUp`, `Target`, `Route` or equivalent.
- Notifications should use `Bell`.
- Settings should use `Settings`.
- Privacy/security should use `Shield`, `Lock`, `Eye`, etc.

Do not use five different icons for the same semantic action.

## 4.3 Buttons must be correctly positioned

Do not place buttons arbitrarily.

Use:

- Page-level primary action: top-right of header
- Secondary actions: next to primary action or inside contextual card
- Card action: top-right of card
- Row action: right side of row
- Modal actions: bottom-right
- Destructive confirmation: separated visually from normal actions
- Mobile actions: wrap cleanly rather than overflow
- Long text: do not push buttons off-screen

Avoid:

```text
[Huge empty space]       [button floating somewhere]
```

Prefer:

```text
Page title                         [Primary Action]
Description
```

For cards:

```text
Card title                              [Action]
Card description
--------------------------------------------
Content
```

## 4.4 Button hierarchy

Maintain clear hierarchy:

### Primary
One main action per section.

### Secondary
Supporting actions.

### Ghost
Low-emphasis navigation or utility actions.

### Destructive
Delete/remove/report actions.

Never make every button look primary.

## 4.5 Tooltips

Use tooltips for icon-only buttons.

Never use an icon-only button for an unfamiliar action without a tooltip or accessible label.

## 4.6 Responsive behavior

Every modified screen must work on:

- desktop
- laptop
- tablet
- mobile

Do not merely shrink the desktop layout.

Tables should become:

- horizontally scrollable,
- card-based,
- or selectively collapsed.

Sidebars should preserve the current responsive behavior.

---

# 5. Student — Enhanced Resume Analyzer

## Objective

Turn the existing resume analysis screen into the central intelligence layer of the platform.

The current analysis already has:

- overall score
- section scores
- matched keywords
- missing keywords
- formatting checks
- bullet improvement examples

Expand this into a complete **Resume Health Report**.

## 5.1 Main score

Show:

```text
Resume Health
84 / 100
Strong
```

Include a circular/radial progress visualization.

Under it:

```text
+6 from previous version
```

If a previous version exists, show the change.

## 5.2 Score dimensions

Use:

- ATS Compatibility
- Skills
- Experience
- Projects
- Education
- Formatting
- Keyword Optimization
- Impact / Quantification
- Section Completeness

Do not overload the first screen.

Show the most important 5–6 categories first, with "View detailed breakdown" for the rest.

## 5.3 Score explanations

Every score must have an explanation.

Bad:

```text
Skills: 72
```

Good:

```text
Skills: 72

Strong:
React, JavaScript, SQL

Needs attention:
TypeScript, Docker

Why:
Your target role frequently mentions TypeScript and containerization,
but they are absent from your resume.
```

## 5.4 Resume Health findings

Categorize findings:

### Critical

Things likely to seriously hurt ATS/recruiter visibility.

### Warning

Things worth improving.

### Good

Things already handled well.

Example:

```text
Critical
Missing target-role keywords

Warning
Several bullets do not show measurable impact

Good
Contact information is ATS-readable
```

## 5.5 Formatting analysis

Expand current formatting checks into:

- font consistency
- heading hierarchy
- spacing
- margins
- page count
- section ordering
- contact information
- link formatting
- unusual symbols
- tables/text boxes warning
- image-based content warning
- overly complex layout warning

Keep the explanations simple.

## 5.6 Actionable fixes

Every problem should have an action.

Example:

```text
Missing 4 important skills
[View missing skills]

Weak bullet impact
[Improve bullets]

Formatting issue
[Open Resume Builder]
```

These buttons must actually navigate to the relevant feature.

## 5.7 Version comparison

If two resumes exist:

```text
Compare Versions
v1 — 68
v2 — 84
```

Show:

- score improvement
- new skills
- removed issues
- improved bullets
- formatting changes
- keyword changes

This should use mock data now.

Later it can compare actual backend analysis records.

---

# 6. ATS Simulator

## Objective

Make ATS feel like a meaningful evaluation rather than just another number.

## 6.1 ATS score

Show:

```text
ATS Compatibility
89%
```

Explain that this is a simulated evaluation in the mock phase if appropriate.

## 6.2 ATS categories

Include:

- Keyword coverage
- Section recognition
- Contact information
- File readability
- Formatting simplicity
- Standard headings
- Job-title alignment
- Skill alignment
- Experience relevance
- Education recognition

## 6.3 ATS simulation view

Create a section:

```text
ATS Scan Simulation

✓ Contact information detected
✓ Experience section detected
✓ Education section detected
✓ Skills section detected
⚠ 3 target keywords missing
⚠ Complex layout detected
```

## 6.4 ATS-safe recommendation

Show:

```text
Best next action:
Simplify page 2 formatting
```

Provide:

```text
[Fix in Builder]
```

## 6.5 Target-job ATS

Allow the user to select:

```text
Evaluate against:
[General Resume]
[Senior React Developer]
[Fullstack Engineer]
...
```

The ATS result changes based on the selected target job using mock calculations.

---

# 7. Advanced JD Matching + Skill Gap Analysis

## Objective

Turn JD matching into one of the strongest features.

## 7.1 Job match overview

Show:

```text
Job Match
92%

Strong Match
```

Break down:

```text
Skills          94%
Experience      88%
Projects        91%
Education       100%
Keywords        86%
```

## 7.2 Skill comparison

Use three groups:

### Strong match

- React
- JavaScript
- Git
- REST APIs

### Partial match

- Node.js
- Testing

### Missing

- TypeScript
- Docker
- AWS

Do not only display a percentage.

## 7.3 Match explanation

Show:

```text
Why you match

You already meet most frontend requirements and have
relevant project experience.

Main gap:
TypeScript and cloud deployment experience.
```

## 7.4 Skill-gap severity

Classify missing skills:

```text
High priority
TypeScript

Medium priority
Docker

Low priority
GraphQL
```

## 7.5 Personalized learning recommendation

For every important gap:

```text
TypeScript
Priority: High
Estimated effort: 1–2 weeks

Recommended path:
1. TypeScript basics
2. Types in React
3. Generics
4. Build a small React project
5. Add TypeScript project to resume
```

Use mock learning resources.

## 7.6 Job readiness after improvement

Show:

```text
Current match: 78%

If you add:
TypeScript
Docker

Estimated match:
89%
```

This should be clearly presented as an estimate.

## 7.7 Apply flow

From the job-match page:

```text
[Apply Now]
```

Before applying, show:

```text
Recommended resume:
Priya_Frontend_v3.pdf

Match:
92%

[Apply with this resume]
[Choose another]
```

After applying:

- create mock application
- update application tracker
- create notification
- show success toast
- update dashboard metrics

---

# 8. AI Resume Improvement

## Objective

Make resume enhancement interactive rather than static.

## 8.1 Enhancement workspace

Layout:

```text
Resume Section
Experience

Original
--------------------------------
Worked on a web application.

AI Improved
--------------------------------
Developed and deployed a responsive web application
using React and Node.js, improving page performance
by 25%.

[Accept] [Edit] [Regenerate]
```

## 8.2 Improvement modes

Allow the user to choose:

- Stronger impact
- More concise
- ATS optimized
- More technical
- More professional
- Quantify results

Use mock generated alternatives.

## 8.3 Bullet-by-bullet improvement

Display multiple bullets in a list.

Each bullet should have:

- original
- improved
- reason
- confidence/quality indicator
- accept/reject

## 8.4 Accepted changes

When the user accepts an improvement:

- update the local mock resume state
- show toast
- update resume version
- optionally increase the mock score
- add the change to version history

Do not pretend the change is saved to a backend.

## 8.5 Before/after score

Show:

```text
Before
74

After applying 3 improvements
81
```

This creates a clear value loop.

---

# 9. Intelligent Resume Builder

## Objective

Turn the existing builder into a career-oriented resume workspace.

## 9.1 Keep existing builder

Do not remove the current builder.

Improve it with:

- section reordering
- section visibility
- resume versions
- templates
- live ATS status
- AI suggestions
- target job
- save state
- preview
- export mock flow

## 9.2 AI writing assistance

For fields such as:

- summary
- experience
- projects
- achievements

provide:

```text
[Improve with AI]
```

When clicked:

```text
Current:
Made an attendance system.

Suggestions:
1. Built a role-based attendance management system...
2. Developed a responsive attendance platform...
3. Engineered...
```

Allow selection.

## 9.3 Live resume health indicator

At the top:

```text
Resume Health: 82
ATS: 88
Completeness: 94%
```

These values update from the mock resume state.

## 9.4 Target role

Allow:

```text
Target Role
[Frontend Developer]
```

The builder should show:

```text
Recommended keywords:
React
TypeScript
Testing
Performance
```

## 9.5 Versioning

Add:

```text
Resume Versions

Frontend v3
Backend v2
General v1
```

Actions:

- duplicate
- rename
- edit
- compare
- delete

Use confirmation for delete.

## 9.6 Export

Provide a polished mock export flow:

```text
Preparing resume...
Formatting document...
Generating PDF...
```

Then complete with a mock success state.

The architecture should later support real PDF generation.

---

# 10. AI Mock Interview

## Objective

Transform the existing interview feature into a realistic practice environment.

## 10.1 Interview setup

Before starting:

```text
Target Role
Frontend Engineer

Interview Type
Technical + HR

Difficulty
Medium

Duration
15 minutes
```

Optional:

```text
Use my resume
✓
```

## 10.2 Interview flow

The interviewer should:

1. Ask a question
2. Accept an answer
3. Show processing state
4. Evaluate answer
5. Ask next question
6. Adapt later questions based on previous weaknesses

Use mock question banks.

## 10.3 Question categories

Use:

- introduction
- resume/project
- technical
- behavioral
- problem solving
- role-specific
- HR

## 10.4 Answer evaluation

After each answer:

```text
Relevance       82
Technical       76
Clarity         88
Completeness    71
```

Then:

```text
Quick feedback:
Good explanation, but your answer would be stronger
with a concrete example from your project.
```

## 10.5 Adaptive questions

If the student performs poorly in a category:

```text
Next question:
Explain how you would optimize a slow React application.
```

If they perform strongly:

```text
Advanced follow-up:
How would you identify whether the bottleneck is
rendering, network latency, or backend processing?
```

## 10.6 Final report

Show:

```text
Interview Score
81 / 100
```

Breakdown:

- Technical
- Communication
- Problem solving
- Confidence
- Role knowledge
- Project explanation

## 10.7 Improvement plan

Example:

```text
Your strongest area:
Technical fundamentals

Focus next:
Project explanation

Recommended:
Practice 5 project-based interview questions
```

## 10.8 Interview history

Store mock sessions with:

- date
- role
- score
- duration
- strengths
- weaknesses

Show score trend.

---

# 11. Career Readiness Score

## Objective

Create one platform-wide student metric.

## 11.1 Score

Example:

```text
Career Readiness
76 / 100
```

## 11.2 Components

Use:

```text
Resume         84
ATS            88
Skills         71
Projects       76
Assessments    79
Interview      81
Applications   68
Profile        94
```

Do not simply average blindly. Use sensible mock weights.

Example:

```text
Resume/ATS       25%
Skills           20%
Projects         10%
Assessments      10%
Interview        15%
Applications     10%
Profile          10%
```

These weights can be changed later.

## 11.3 Readiness levels

Use:

```text
0–39    Getting Started
40–59   Building
60–74   Developing
75–89   Job Ready
90–100  Highly Ready
```

## 11.4 Action recommendation

The score should answer:

> What should I do next?

Example:

```text
Your biggest opportunity:

Improve your TypeScript skill.

Doing so could raise your readiness
from 76 → approximately 81.
```

## 11.5 Dashboard placement

Make Career Readiness the hero metric on the Student Dashboard.

---

# 12. Career Roadmap

## Objective

Give students a structured path toward a target role.

## 12.1 Target role

Allow selection:

```text
Target Career
Frontend Developer
```

or:

- Backend Developer
- Full Stack Developer
- Data Analyst
- Data Scientist
- UI/UX Designer
- DevOps Engineer
- Mobile Developer
- Cybersecurity Analyst

Use mock role definitions.

## 12.2 Roadmap structure

Example:

```text
Frontend Developer

Phase 1
Web Fundamentals
✓ HTML
✓ CSS
✓ JavaScript

Phase 2
Frontend Engineering
✓ React
○ TypeScript
○ State Management

Phase 3
Professional Development
○ Testing
○ Performance
○ Accessibility

Phase 4
Projects
○ Build portfolio project

Phase 5
Interview Preparation
○ Technical interview
○ Behavioral interview
```

## 12.3 Progress

Each skill can be:

- Not started
- In progress
- Completed

Allow clicking to update progress.

## 12.4 Link roadmap to skill gaps

If JD matching identifies:

```text
Missing TypeScript
```

the roadmap should highlight:

```text
TypeScript
Recommended next step
```

## 12.5 Link roadmap to assessments

After completing an assessment:

```text
JavaScript assessment: 84%
```

update that skill's status.

## 12.6 Link roadmap to readiness

Completing meaningful roadmap items should update the mock Career Readiness Score.

---

# 13. Skill Assessments

## Objective

Give students measurable proof of knowledge.

## 13.1 Assessment library

Create:

```text
Technical

JavaScript
Python
Java
SQL
React
Node.js
DSA
DBMS
Operating Systems
Computer Networks
```

Keep the list manageable.

## 13.2 Assessment card

Each card:

```text
JavaScript
20 questions
15 minutes
Intermediate

Best Score: 82%

[Start Assessment]
```

## 13.3 Assessment flow

Use:

- question number
- progress
- question
- options
- previous/next
- submit

Do not make the interface visually cluttered.

## 13.4 Results

Show:

```text
82 / 100

Correct: 16
Incorrect: 4

Strong:
Arrays
Functions
Promises

Needs work:
Closures
Event loop
```

## 13.5 Improvement recommendations

After assessment:

```text
Recommended next:
Review closures and event loop.
Then retake the assessment.
```

## 13.6 Skill profile

Update the student's skill profile using mock results.

Example:

```text
JavaScript
Intermediate
84%

React
Advanced
91%

SQL
Intermediate
76%
```

---

# 14. Student Job Recommendations

## Objective

Connect the resume, skill profile and target role to job discovery.

## 14.1 Recommendation ranking

Each job should show:

```text
92% Match
```

But also explain:

```text
Why this job?

✓ React
✓ JavaScript
✓ REST APIs
✓ Relevant projects

Missing:
TypeScript
Docker
```

## 14.2 Recommendation filters

Add:

- role
- location
- remote
- salary
- experience
- match percentage
- skills

## 14.3 Recommendation sections

Student dashboard:

```text
Recommended for You
```

Job page:

```text
Because of your profile
```

## 14.4 Feedback

Allow:

```text
Not interested
```

This should remove the job from the current recommendation list in mock state.

Do not permanently destroy the job data.

---

# 15. Application Tracker

## Objective

Make applications a complete personal recruitment workspace.

## 15.1 Pipeline

Use:

```text
Saved
Applied
Under Review
Shortlisted
Interview
Offer
Rejected
Withdrawn
```

## 15.2 Application card

Show:

- company
- role
- applied date
- status
- match score
- resume used
- next action
- interview date if applicable

## 15.3 Application detail

Clicking an application opens a detailed view.

Include:

```text
Job
Resume
Match Analysis
Timeline
Notes
Interview
Status
```

## 15.4 Timeline

Example:

```text
Sep 10
Applied

Sep 12
Application viewed

Sep 15
Shortlisted

Sep 18
Interview scheduled
```

## 15.5 Notes

Allow the student to add private notes.

Example:

```text
Prepare React performance questions.
```

Persist in mock state.

## 15.6 Application reminders

Create notification entries for upcoming interviews and follow-ups.

---

# 16. Student Activity Streak

Only add a simple streak.

Example:

```text
🔥 7 day streak
```

Activities can include:

- resume analysis
- resume improvement
- assessment
- interview practice
- roadmap progress
- application activity

Do not turn this into a gamification system.

It is simply a consistency indicator.

---

# 17. Student Dashboard Redesign

The dashboard should become the student's **career command center**.

## Recommended structure

### Header

```text
Good morning, Priya

Frontend Developer
Career Readiness: 76
🔥 7 day streak
```

### Hero card

```text
Career Readiness
76 / 100

You're Job Ready

[View Career Plan]
```

### Immediate actions

```text
Improve Resume
Practice Interview
Take Assessment
Explore Jobs
```

Keep exactly the most useful actions here.

### Resume section

```text
Current Resume
Frontend_v3.pdf

ATS: 88
Resume Health: 84

[Analyze]
[Improve]
[Edit]
```

### Recommended jobs

Top 3–4 jobs with match percentages.

### Roadmap progress

```text
Frontend Developer
62% complete
```

### Upcoming actions

```text
Interview tomorrow
Complete TypeScript module
Follow up on application
```

### Recent activity

Use a compact timeline.

---

# 18. HR — AI Candidate Matching

## Objective

Make HR candidate management meaningfully intelligent.

## 18.1 Job-specific matching

For each job, calculate mock candidate match.

Example:

```text
Candidate A
91% Match

Candidate B
86% Match

Candidate C
78% Match
```

## 18.2 Explain the score

Candidate:

```text
91% Match

Skills
9/10 required

Experience
Strong

Projects
Highly relevant

Education
Meets requirement

Missing
Docker
```

Never display only the score.

## 18.3 Candidate comparison

Allow HR to select up to 3 candidates.

Compare:

| Category | Candidate A | Candidate B | Candidate C |
|---|---:|---:|---:|
| Skills | 94 | 87 | 82 |
| Experience | 90 | 92 | 75 |
| Projects | 93 | 84 | 81 |
| Education | 100 | 90 | 90 |
| Overall | 91 | 86 | 78 |

Use clear visual indicators.

## 18.4 AI screening summary

Provide a concise summary:

```text
Strong candidate for frontend-heavy roles.
Strong React experience and relevant projects.
Main gap: production cloud deployment.
```

This is **decision support only**.

The HR user must remain responsible for hiring decisions.

---

# 19. HR — Advanced Candidate Search

## Objective

Allow HR to actually find the right candidate quickly.

## 19.1 Search

Search:

- name
- email
- skill
- job
- application status

## 19.2 Filters

Add:

- match score
- skills
- experience
- education
- location
- application status
- screening status
- interview status

## 19.3 Skill filter

Example:

```text
Required:
React
Python
SQL
```

Then show candidates satisfying those requirements.

## 19.4 Saved filters

Allow HR to save a filter:

```text
Strong Frontend Candidates
```

Use mock persistence.

---

# 20. HR — Candidate Profile

Improve the candidate detail screen.

Include:

### Candidate overview

- name
- target role
- match score
- application status

### Resume

Mock preview/download action.

### Skill analysis

```text
React       Advanced
JavaScript  Advanced
SQL         Intermediate
Docker      Beginner
```

### Job match

Detailed match breakdown.

### AI screening summary

Concise, explainable summary.

### Interview history

Past/current interviews.

### Recruiter notes

Allow HR to add notes.

### Timeline

```text
Applied
Screened
Shortlisted
Interview scheduled
```

---

# 21. HR — Recruitment Pipeline

Make the existing pipeline more useful.

Use stages:

```text
Applied
   ↓
Screening
   ↓
Shortlisted
   ↓
Interview
   ↓
Offer
   ↓
Hired
```

Allow moving candidates between stages in mock state.

When moved:

- update candidate state
- update job counts
- add timeline event
- create relevant notification

---

# 22. HR — Job Campaign Improvements

Keep the existing job creation flow.

Improve:

## 22.1 Weight validation

The current ATS weights should always total exactly 100%.

Instead of allowing arbitrary totals, make sliders coordinated.

Example:

```text
Skills        40%
Experience    35%
Education     15%
Formatting    10%

Total         100%
```

When one value changes, redistribute or constrain the others.

Never allow:

```text
Total: 147%
```

## 22.2 Job status

Support:

- Draft
- Active
- Paused
- Closed

## 22.3 Job statistics

Each job card:

```text
Applicants 42
Matched 31
Shortlisted 8
Interviews 4
```

## 22.4 Pipeline View

The existing Pipeline View button must actually navigate to the selected job's candidate pipeline.

Do not leave dead buttons.

---

# 23. HR — Screening Improvements

The screening screen should combine:

```text
Candidate
Match score
Skills
Experience
ATS score
Screening result
```

Provide:

```text
[Shortlist]
[Reject]
[Review]
```

Use confirmation for rejection.

After shortlisting:

- update state
- update job statistics
- create notification
- add timeline entry

---

# 24. HR — Interview Management

Improve interviews with:

- scheduled date
- candidate
- job
- interviewer
- interview type
- status
- notes
- result

Statuses:

```text
Scheduled
Completed
Rescheduled
Cancelled
No-show
```

Provide upcoming and completed sections.

Add calendar-like visual organization without requiring a full calendar library.

---

# 25. Personalized Job Recommendation Engine

This feature should exist mainly on the Student side.

Use mock inputs:

```text
Resume skills
Target role
Assessment results
Career roadmap
Previous applications
Job preferences
```

Then calculate mock recommendation scores.

Example:

```text
Frontend Engineer
94% match

Full Stack Engineer
88% match

Backend Engineer
72% match
```

The score must be explainable.

---

# 26. Notifications

Improve the existing notification center.

Categories:

- Application
- Interview
- Resume
- Career
- Job recommendation
- Assessment
- System

Each notification should have:

- icon
- title
- message
- timestamp
- read/unread
- related route

Clicking a notification should navigate to the correct page.

Examples:

```text
Your application was shortlisted
→ Applications / application-id
```

```text
Your resume score increased to 84
→ Resume Analysis
```

```text
Interview tomorrow
→ Interview details
```

Add:

```text
Mark as read
Mark all as read
```

---

# 27. Privacy & Trust Features

Because this is a recruitment platform, add realistic controls.

## Student privacy

Settings:

```text
Resume visibility
[Private]
[Recruiters only]
[Public profile]
```

Mock this state.

## Data controls

Provide:

```text
Download my data
Delete account
```

For the prototype, these can open confirmation/simulation flows.

## Job reporting

On job details:

```text
Report this job
```

Reasons:

- suspicious
- misleading
- inappropriate
- duplicate
- other

## Recruiter verification

HR company profile can display:

```text
Verified Recruiter
```

where appropriate in mock data.

## Important safety rule

Do not present AI matching as a final hiring decision.

Use language such as:

```text
AI-assisted match
Recruiter review required
```

---

# 28. Admin Enhancements

The Admin portal should reflect the newly expanded system.

## 28.1 Platform analytics

Add metrics:

```text
Total Students
Total Recruiters
Active Jobs
Applications
Interviews
Resume Analyses
Average ATS Score
Average Career Readiness
Assessment Attempts
```

## 28.2 AI usage analytics

Show mock metrics:

```text
Resume analyses today
JD matches today
Interview sessions
AI improvements generated
```

## 28.3 Feature usage

Show:

```text
Most used features

Resume Analyzer
42%

Job Matching
24%

Resume Builder
18%

Interview
10%

Assessments
6%
```

## 28.4 Content audit

Use existing Content Audit page.

Add:

- suspicious job reports
- reported recruiter profiles
- flagged content
- audit status

## 28.5 User activity

Show:

- active users
- recent signups
- recent HR activity
- recent student activity

---

# 29. Mock Data Model

Do not scatter random mock objects throughout components.

Create coherent relationships.

## Student

```js
{
  id,
  name,
  email,
  targetRole,
  profileCompletion,
  streak,
  careerReadiness,
  skills,
  resumes,
  assessments,
  applications,
  interviews,
  roadmap
}
```

## Resume

```js
{
  id,
  name,
  version,
  targetRole,
  createdAt,
  updatedAt,
  overallScore,
  atsScore,
  sectionScores,
  keywords,
  formattingChecks,
  bulletSuggestions,
  improvements
}
```

## Job

```js
{
  id,
  title,
  company,
  location,
  salary,
  status,
  skillsRequired,
  experienceRequired,
  matchRate,
  applicantsCount
}
```

## Job Match

```js
{
  jobId,
  resumeId,
  overall,
  skills,
  experience,
  projects,
  education,
  keywords,
  matchedSkills,
  partialSkills,
  missingSkills,
  recommendations
}
```

## Application

```js
{
  id,
  studentId,
  jobId,
  resumeId,
  status,
  appliedAt,
  timeline,
  notes,
  interviewId
}
```

## Interview

```js
{
  id,
  studentId,
  jobId,
  role,
  type,
  difficulty,
  status,
  score,
  categoryScores,
  strengths,
  weaknesses,
  questions
}
```

## Assessment

```js
{
  id,
  skill,
  difficulty,
  questions,
  score,
  completedAt,
  strengths,
  weaknesses
}
```

## Roadmap

```js
{
  targetRole,
  phases: [
    {
      id,
      title,
      progress,
      skills: []
    }
  ]
}
```

## Candidate

```js
{
  id,
  name,
  skills,
  experience,
  education,
  resumeId,
  appliedJobId,
  matchScore,
  atsScore,
  screeningStatus,
  pipelineStage,
  notes,
  interviewHistory
}
```

---

# 30. Cross-Feature State Synchronization

This is one of the most important implementation requirements.

A feature must not behave like an isolated demo.

## Example: Upload Resume

When a user uploads a resume:

1. Add resume to resumes list.
2. Set it as current resume.
3. Run mock analysis.
4. Generate ATS score.
5. Update dashboard resume information.
6. Update Career Readiness.
7. Make it available in JD Match.
8. Make it available in Resume Improvement.
9. Make it available in Builder.
10. Add notification:
   ```text
   Resume analysis completed.
   ```
11. Update recent activity.
12. Update streak.

## Example: Improve Resume

When a bullet is improved:

1. Update resume state.
2. Create new version.
3. Update score.
4. Update ATS score.
5. Update dashboard.
6. Add version-history entry.
7. Add activity event.

## Example: Apply to Job

1. Create application.
2. Link selected resume.
3. Update job/application counts.
4. Update application tracker.
5. Add timeline entry.
6. Add notification.
7. Update dashboard.
8. Update Career Readiness if the application component uses activity.
9. Update recommendation history.

## Example: Complete Assessment

1. Save result.
2. Update skill profile.
3. Update roadmap skill progress.
4. Update Career Readiness.
5. Add recent activity.
6. Update streak.
7. Add notification if appropriate.

## Example: Complete Mock Interview

1. Save interview result.
2. Update interview history.
3. Update Career Readiness.
4. Update dashboard.
5. Update recommendations for interview practice.
6. Add activity/streak.

---

# 31. Navigation Requirements

Every major CTA must lead somewhere meaningful.

Audit all existing buttons.

Examples:

```text
Analyze Resume
→ /student/analysis

Improve Resume
→ /student/enhancement

Edit Resume
→ /student/builder

Match with Job
→ /student/jd-match

Practice Interview
→ /student/interview

Take Assessment
→ /student/assessments

View Roadmap
→ /student/roadmap

View Applications
→ /student/applications
```

If a route does not currently exist, create it.

Do not leave placeholder buttons with no action.

---

# 32. Suggested Student Navigation

Keep the current navigation style but reorganize if necessary for clarity.

Recommended logical groups:

## Career

- Dashboard
- Career Roadmap
- Career Readiness

## Resume

- My Resumes
- Resume Analyzer
- ATS Check
- Resume Builder
- Improve Resume
- JD Match

## Jobs

- Recommended Jobs
- Applications

## Preparation

- Mock Interview
- Skill Assessments
- Resources

## Account

- Notifications
- Profile
- Settings

Avoid excessive navigation items.

If the sidebar becomes too long, use collapsible groups.

---

# 33. Suggested HR Navigation

## Recruitment

- Dashboard
- Jobs
- Candidates
- Screening
- Interviews

## Insights

- Analytics
- Reports

## Company

- Company Profile
- Settings

Keep Messages accessible globally if it already exists.

---

# 34. Loading States

Every async-looking operation should have a realistic loading state.

Examples:

### Resume analysis

Use step progress.

### JD match

```text
Reading job requirements...
Comparing skills...
Checking experience...
Generating match report...
```

### Interview evaluation

```text
Analyzing your answer...
```

### Assessment submission

```text
Evaluating responses...
```

### Candidate matching

```text
Evaluating candidate profiles...
```

Do not use the same spinner for every operation.

---

# 35. Empty States

Every list should have a useful empty state.

Example:

```text
No applications yet

Start exploring recommended jobs and apply
to your first opportunity.

[Explore Jobs]
```

Not:

```text
No data.
```

---

# 36. Error States

Create clear recoverable errors.

Example:

```text
We couldn't analyze this resume.

The mock parser could not process the selected file.

[Try Again]
[Choose Another Resume]
```

Use `ErrorState` where appropriate.

---

# 37. Confirmation Modals

Use the existing `Modal` component.

Confirm destructive actions:

- delete resume
- delete resume version
- withdraw application
- reject candidate
- delete job
- remove notification if supported
- delete assessment history if supported

Do not confirm harmless actions such as opening pages.

---

# 38. Toast Strategy

Use toasts for short-lived feedback:

### Success

```text
Resume updated successfully.
```

### Error

```text
Unable to save changes.
```

### Informational

```text
Resume analysis started.
```

Do not use toasts for long explanations.

---

# 39. Accessibility

All new components should include:

- accessible button labels
- keyboard navigation
- visible focus states
- semantic headings
- appropriate form labels
- tooltip/aria-label for icon-only buttons
- sufficient text contrast
- no interaction dependent only on color

Charts should have text summaries where appropriate.

---

# 40. Data Visualization

Use the existing Recharts dependency where appropriate.

Do not turn every metric into a chart.

Good charts:

### Student

- Career Readiness trend
- Resume score trend
- Assessment skill scores
- Application pipeline

### HR

- Applicant funnel
- Candidate match distribution
- Hiring pipeline
- Job performance

### Admin

- user growth
- feature usage
- application activity
- platform health

Keep charts compact and readable.

---

# 41. Avoid Fake Complexity

Do not create unnecessary:

- complicated AI jargon
- meaningless dashboards
- dozens of KPIs
- random graphs
- fake system logs
- excessive animations
- decorative widgets

Every element should answer:

> What does this help the user understand or do?

---

# 42. Mock AI Behavior

Because the backend is not yet connected, create deterministic mock functions.

Avoid completely random results every time.

For the same resume + job:

```text
same resume + same job
→ same match score
```

This makes the prototype feel realistic.

Use seeded mock logic or deterministic calculations.

Example concept:

```text
skill overlap
+ keyword overlap
+ role relevance
+ experience relevance
+ project relevance
= match score
```

The exact algorithm does not need to be production-grade.

But it must be internally consistent.

---

# 43. Mock AI Explanation Rules

Generated recommendations must be tied to the mock data.

If a candidate is missing Docker, the explanation should mention Docker.

Do not display:

```text
You should improve Kubernetes
```

if Kubernetes is not relevant to the selected job.

Likewise:

- Resume issues must correspond to resume data.
- Skill gaps must correspond to JD requirements.
- Roadmap recommendations must correspond to target role.
- Interview feedback must correspond to the answer category.
- Candidate match explanations must correspond to candidate/job data.

---

# 44. Resume Builder ↔ Analyzer Relationship

This relationship should be visible.

Inside Builder:

```text
Live Resume Health
84

ATS
88
```

Button:

```text
[View Full Analysis]
```

After editing:

```text
Score changed:
84 → 89
```

This is one of the strongest demonstrations of connected product behavior.

---

# 45. JD Match ↔ Roadmap Relationship

On missing skills:

```text
TypeScript
High Priority

[Add to Career Roadmap]
```

Clicking it adds the skill to the student's roadmap mock state.

This should then appear on:

```text
Career Roadmap
```

---

# 46. Job Recommendation ↔ Application Relationship

When a student applies:

```text
Applied
```

The recommendation should update.

Example:

```text
Application submitted.

Your Applications
→ 6 total
```

The job should no longer appear as a fresh "Apply" recommendation.

Instead:

```text
Applied 2 days ago
```

---

# 47. Interview ↔ Application Relationship

If the application status becomes:

```text
Interview
```

the student should see the scheduled interview.

On completion:

```text
Interview score: 81
```

This should be attached to the application history.

---

# 48. Assessment ↔ Career Readiness Relationship

If:

```text
React = 91%
```

Career Readiness should reflect stronger technical readiness.

If:

```text
DSA = 48%
```

show DSA as an improvement area.

---

# 49. Student Profile

Expand profile with:

- target role
- preferred locations
- preferred work mode
- skills
- education
- experience
- projects
- career readiness
- profile completion
- resume visibility

Do not turn profile into a second resume builder.

---

# 50. Search and Filtering UX

For any page with lists:

Use a consistent toolbar:

```text
[Search................] [Filter] [Sort]
```

On mobile:

```text
[Search]
[Filter] [Sort]
```

Filter panels should use the same visual style across the application.

---

# 51. Sorting

Useful sorts:

### Jobs

- Match
- Newest
- Salary
- Relevance

### Candidates

- Match score
- Experience
- Recent application
- Screening status

### Applications

- Recent
- Status
- Match

### Assessments

- Recent
- Score

---

# 52. Mobile Rules

On mobile:

- avoid 4-column metric grids
- stack cards
- keep primary actions accessible
- allow horizontal scrolling for comparison tables
- collapse filters into a modal/drawer
- use bottom-aligned modal actions where appropriate
- preserve readable charts
- avoid text truncation where information is important

---

# 53. Animation Rules

Keep the current Framer Motion usage.

Use animation for:

- page transitions
- card entrance
- score changes
- progress updates
- modal appearance
- pipeline movement

Avoid animation for:

- every text element
- every icon
- every hover
- repeated dashboard numbers

Animation should communicate state, not distract.

---

# 54. Component Reuse

Extend the current shared components instead of creating duplicate components.

Reuse:

```text
Button
Card
Badge
Input
Modal
Skeleton
ErrorState
EmptyState
AnimatedProgress
Tooltip
PageTransition
ScrollReveal
```

If a new reusable component is needed, place it under:

```text
src/components/
```

Examples:

```text
ScoreRing
SkillChip
MatchBreakdown
Timeline
MetricCard
StatusBadge
ProgressTimeline
```

Do not duplicate identical UI structures across pages.

---

# 55. New Suggested Reusable Components

Create reusable components where appropriate.

## ScoreRing

Props:

```text
score
label
status
size
```

## SkillMatchList

Displays:

- matched
- partial
- missing

## MatchBreakdown

Displays category scores.

## Timeline

Generic event timeline.

## SkillProgress

Skill + level + progress.

## CareerReadinessCard

Shared between dashboard and profile.

## JobMatchCard

Reusable job recommendation card.

## CandidateMatchCard

Reusable HR candidate card.

## ImprovementCard

Before/after resume content.

## ActionCard

Contextual next-step recommendation.

---

# 56. Data Persistence During Mock Phase

Use Zustand persistence where useful.

Persist:

- selected resume
- modified resume content
- applications
- roadmap progress
- assessment results
- interview history
- notifications read state
- preferences
- streak

Do not persist sensitive information unnecessarily.

Use mock/local state only for prototype purposes.

---

# 57. Backend-Ready Boundaries

Even though the backend is currently mostly a scaffold, design the frontend as if API integration will happen later.

Do not put backend-specific logic inside UI components.

Instead:

```text
Page
 ↓
Store Action
 ↓
Service
 ↓
Mock implementation
```

Later:

```text
Page
 ↓
Store Action
 ↓
Service
 ↓
Axios/API
 ↓
FastAPI
```

This allows backend development to happen independently.

---

# 58. Future API Contracts

Prepare conceptual API boundaries for:

```text
POST   /resumes/upload
GET    /resumes
GET    /resumes/{id}
POST   /resumes/{id}/analyze

GET    /ats/{resume_id}
POST   /ats/{resume_id}/evaluate

POST   /jobs/{job_id}/match
GET    /jobs/recommended

GET    /applications
POST   /applications
PATCH  /applications/{id}

GET    /roadmap
PATCH  /roadmap/{skill}

GET    /assessments
POST   /assessments/{id}/submit

POST   /interviews
POST   /interviews/{id}/evaluate

GET    /hr/jobs
POST   /hr/jobs
GET    /hr/jobs/{id}/candidates
GET    /hr/candidates/{id}
PATCH  /hr/candidates/{id}/stage
```

These are architectural targets, not requirements to implement the backend now.

---

# 59. File Upload UX

Improve resume upload.

Supported mock types:

- PDF
- DOCX

Show:

```text
Supported formats: PDF, DOCX
Maximum size: 10 MB
```

When uploaded:

```text
resume.pdf
2.4 MB
```

Then:

```text
[Analyze Resume]
```

Do not immediately navigate away without feedback.

---

# 60. Resume Analysis Result Entry Point

After upload:

```text
Analysis complete

Resume Health     84
ATS Compatibility 88
Job Match         Select a job

[View Full Report]
```

This gives the user immediate value.

---

# 61. Dashboard "Next Best Action"

This should be dynamic based on mock data.

Examples:

If resume score low:

```text
Improve your resume
Your current score is 68.
[Improve Resume]
```

If resume strong but skill gap exists:

```text
Close your TypeScript gap
[View Roadmap]
```

If applications exist but no interviews:

```text
Prepare for interviews
[Practice Interview]
```

If profile incomplete:

```text
Complete your profile
[Complete Profile]
```

Only show the most useful next action.

---

# 62. Career Readiness Improvement Simulation

Show users how actions can help.

Example:

```text
Current
76

Next target
80

Recommended actions

Improve 2 resume bullets     +2
Complete TypeScript module   +1
Take React assessment        +1
```

This is an estimate and must be labelled as such.

---

# 63. Resume Comparison

Add a comparison page/modal.

Compare:

```text
Frontend Resume
vs
General Resume
```

Show:

- health
- ATS
- keywords
- formatting
- target role
- strengths
- weaknesses

Allow:

```text
[Use This Resume]
```

---

# 64. Student Resources Integration

Keep existing Resources/Resume Guide pages.

Where useful, connect recommendations:

```text
Formatting issue detected
→ Resume Guide: ATS-friendly formatting
```

```text
Interview weakness detected
→ Resources: Behavioral Interview Guide
```

Do not duplicate content unnecessarily.

---

# 65. HR Analytics

Enhance existing HR analytics with:

- applications per job
- average match score
- shortlist rate
- interview rate
- hiring funnel
- time in pipeline
- top skills among applicants
- candidate source if mock data exists

Keep visual hierarchy clear.

---

# 66. Admin Feature Monitoring

Admin should be able to see whether the platform features are being used.

Example:

```text
Feature
Users
Usage
Trend

Resume Analyzer
1,248
↑ 14%

JD Match
823
↑ 9%

Interview
431
↑ 21%

Assessments
302
↑ 18%
```

Mock values should remain internally consistent.

---

# 67. Design QA Checklist

Before considering the upgrade complete, inspect every screen.

## Layout

- no overflowing cards
- no clipped text
- no broken grids
- no awkward whitespace
- no overlapping buttons
- no floating icons without purpose

## Icons

- consistent library
- correct semantic icon
- aligned vertically
- correct size
- correct placement

## Buttons

- correct hierarchy
- correct location
- correct label
- correct icon
- functional click behavior

## Forms

- labels
- validation
- loading
- success
- error
- cancel

## Navigation

- every CTA works
- back navigation works
- selected sidebar item is correct
- no dead-end pages

## Data

- no contradictory counts
- no impossible statuses
- no duplicate applications
- no mismatched candidate/job data

---

# 68. Specific Existing Codebase Cleanup

The existing project contains older material under `helper_files/`.

Do not let legacy files confuse the active implementation.

Review and either:

- remove unused legacy files,
- clearly isolate them,
- or migrate useful logic into the active `src` architecture.

Do not import old implementations simply because they exist.

The active application should have one clear source of truth.

---

# 69. Avoid Breaking Existing Features

Before modifying an existing page:

1. Understand its current state/store.
2. Preserve working behavior.
3. Add the new behavior around it.
4. Keep existing routes unless there is a compelling UX reason to change them.
5. If a route changes, update every navigation reference.
6. Ensure Student/HR/Admin role separation remains intact.

Do not casually rename existing state fields if many screens depend on them.

---

# 70. Final User Experience

After all modifications, the student should be able to demonstrate this complete mock journey:

```text
Sign in
 ↓
Student Dashboard
 ↓
Upload Resume
 ↓
Resume Analysis
 ↓
ATS Report
 ↓
Improve Weak Bullets
 ↓
Resume Score Improves
 ↓
Choose Target Role
 ↓
Career Readiness Score
 ↓
Career Roadmap
 ↓
Take Skill Assessment
 ↓
Skill Profile Updates
 ↓
Recommended Jobs
 ↓
Open Job
 ↓
JD Match
 ↓
See Missing Skills
 ↓
Add Skill to Roadmap
 ↓
Apply with Optimized Resume
 ↓
Application Tracker
 ↓
Interview Invitation
 ↓
Mock Interview
 ↓
Interview Evaluation
 ↓
Career Readiness Updates
```

HR should be able to demonstrate:

```text
HR Dashboard
 ↓
Create Job
 ↓
Configure ATS weights
 ↓
View Job
 ↓
View Applicants
 ↓
Filter Candidates
 ↓
AI-Assisted Candidate Match
 ↓
Open Candidate
 ↓
Compare Candidates
 ↓
Shortlist
 ↓
Schedule Interview
 ↓
Move through Pipeline
 ↓
View Recruitment Analytics
```

Admin should be able to demonstrate:

```text
Admin Dashboard
 ↓
Users
 ↓
Jobs / Platform Activity
 ↓
Content Audit
 ↓
Reports / Analytics
 ↓
Feature Usage
 ↓
System Settings
```

---

# 71. Priority Order for Implementation

Do not attempt everything randomly.

Implement in this order.

## Phase 1 — Foundation

1. Mock service layer
2. Coherent mock data relationships
3. Shared components
4. navigation audit
5. icon/button placement audit
6. loading/error/empty state consistency

## Phase 2 — Core Student Intelligence

7. Resume Health
8. ATS Simulator
9. Resume Improvement
10. Resume Builder integration
11. JD Match
12. Skill Gap Analysis

## Phase 3 — Career Intelligence

13. Career Readiness
14. Career Roadmap
15. Skill Assessments
16. Job Recommendations

## Phase 4 — Recruitment

17. Application Tracker
18. HR Candidate Matching
19. Candidate Search/Filters
20. Candidate Profile
21. Screening
22. Recruitment Pipeline
23. Interview Management

## Phase 5 — Engagement & Trust

24. Notifications
25. Student streak
26. Privacy
27. Job reporting
28. Recruiter verification

## Phase 6 — Analytics

29. Student analytics
30. HR analytics
31. Admin analytics
32. Feature usage analytics

## Phase 7 — QA

33. responsive QA
34. accessibility QA
35. navigation QA
36. state synchronization QA
37. mock-data consistency QA
38. dead-button/dead-route audit

---

# 72. What "Complete" Means

A feature is **not complete** merely because a card or page exists.

For this project, a feature is complete when:

- it has a clear purpose
- it has a polished UI
- it has realistic mock data
- it has loading state
- it has success state
- it has error/empty state where relevant
- user actions change the mock state
- navigation works
- related features reflect the change
- buttons are correctly positioned
- icons are correctly positioned
- it works responsively
- it does not contradict other application data
- it is architecturally ready for future API replacement

---

# 73. Final Instruction to the Implementing AI/Developer

Work directly on the existing Resume Analyser frontend.

**Do not create a superficial showcase.**

Do not simply add static cards saying:

> "AI Resume Analyzer"

or:

> "Career Roadmap"

and stop there.

Every feature must have an actual frontend interaction flow using mock data.

When backend functionality is unavailable, simulate the operation realistically and isolate the simulation behind a service/store layer.

Preserve the current design language and improve it rather than replacing it.

Pay special attention to:

- correct icon placement
- correct button placement
- spacing
- alignment
- typography
- responsive behavior
- consistent component usage
- navigation
- meaningful state transitions
- cross-feature synchronization
- realistic mock data relationships
- no dead buttons
- no dead routes
- no contradictory numbers
- no unnecessary gamification
- no AI Job Description Generator

The finished frontend should look and behave as though it is already a real production product, while remaining fully powered by mock data for this phase.

The eventual FastAPI backend should be able to replace the mock service implementations without requiring a major UI rewrite.

The final product identity should be:

> **An AI-powered career and recruitment platform that helps students analyze and improve resumes, understand job fit, close skill gaps, build career readiness, prepare for interviews, assess skills, discover relevant jobs and track applications — while helping recruiters find, evaluate and manage candidates through an explainable AI-assisted recruitment workflow.**

Most importantly:

> **Build depth and connections, not just more pages.**
