# 02_Student_Portal_UI.md

# AI Resume Analyzer - Student Portal Frontend Prompt (Antigravity)

## IMPORTANT

Read this prompt completely before generating code.

This repository contains **ONLY THE FRONTEND**.

### Never Generate

-   Backend
-   APIs
-   Authentication server
-   Database
-   AI models
-   ATS algorithm
-   Resume parsing logic
-   Business logic
-   Fake analytics
-   Fake candidates
-   Fake jobs

Create only the UI and frontend architecture. Backend integration points
may be marked with TODO comments.

------------------------------------------------------------------------

# Design Language

Build a premium SaaS interface inspired by Linear, Notion, Vercel and
Stripe.

Desktop-first with full responsiveness.

Use: - React + Vite - Tailwind CSS - Framer Motion - Lucide Icons

Use a clean left sidebar and top navigation.

------------------------------------------------------------------------

# Student Navigation

Sidebar

-   Dashboard
-   Resume Builder
-   Resume Upload
-   ATS Analysis
-   Resume Enhancement
-   JD Match
-   AI Interview
-   Applications
-   Learning Resources
-   Notifications
-   Profile
-   Settings

Top Navbar

-   Global Search
-   Notifications
-   Theme Toggle
-   User Menu

------------------------------------------------------------------------

# 1 Dashboard

Sections

-   Welcome Hero
-   ATS Score Card
-   Resume Completion Progress
-   Recently Applied Jobs
-   Upcoming Interviews
-   AI Suggestions
-   Daily Goal Card
-   Activity Timeline

Include: - Skeleton loading - Empty state - Error state

------------------------------------------------------------------------

# 2 Resume Builder

Multi-step builder.

Sections

-   Personal Information
-   Education
-   Skills
-   Experience
-   Projects
-   Certifications
-   Languages
-   Achievements
-   Interests

Features

-   Stepper
-   Live Preview
-   Save Draft Button
-   Export Button
-   Progress Indicator

------------------------------------------------------------------------

# 3 Resume Upload

Drag and Drop Upload

Components

-   Upload Card
-   File Preview
-   Upload Progress
-   Validation Messages

Support placeholders for PDF and DOCX.

------------------------------------------------------------------------

# 4 ATS Analysis

Cards

-   Overall Score
-   Keyword Match
-   Missing Keywords
-   Formatting Analysis
-   Section Completeness
-   Suggestions

Charts should be placeholder components only.

------------------------------------------------------------------------

# 5 Resume Enhancement

Create UI for

-   AI Suggestions Panel
-   Before / After Comparison
-   Improve Button
-   Version History

No AI implementation.

------------------------------------------------------------------------

# 6 JD Match

Layout

Left

Job Description

Right

Resume Match

Cards

-   Match Percentage
-   Missing Skills
-   Matching Skills
-   Suggested Improvements

------------------------------------------------------------------------

# 7 AI Mock Interview

Build UI only.

Include

-   Chat Window
-   Question Area
-   Answer Box
-   Voice Button Placeholder
-   Timer
-   Feedback Panel

No chatbot implementation.

------------------------------------------------------------------------

# 8 Applications

Responsive Table

Columns

-   Company
-   Role
-   Status
-   Date
-   Action

Status badges

Applied

Interview

Rejected

Offer

------------------------------------------------------------------------

# 9 Learning Resources

Cards

-   Aptitude
-   DSA
-   Resume
-   HR Interview
-   Technical Interview

Each card has

Image Placeholder

Description

Open Button

Bookmark

------------------------------------------------------------------------

# 10 Notifications

Grouped cards

Unread

Today

This Week

Mark All Read button.

------------------------------------------------------------------------

# 11 Profile

Profile Card

Education

Skills

Projects

Achievements

Edit Profile Dialog

------------------------------------------------------------------------

# 12 Settings

Theme

Language

Notifications

Privacy

Password

Danger Zone

------------------------------------------------------------------------

# Animations

Use subtle Framer Motion.

Hover lift

Fade

Slide

Scale

Avoid excessive animations.

------------------------------------------------------------------------

# Reusable Components

Button

Input

Card

Modal

Drawer

Badge

Toast

Tooltip

Pagination

Tabs

Table

Avatar

Sidebar

Navbar

Search

Breadcrumb

Stats Card

File Upload

Empty State

Error State

Loading Skeleton

------------------------------------------------------------------------

# Accessibility

Keyboard support

Focus rings

Semantic HTML

Responsive

WCAG friendly

------------------------------------------------------------------------

# Final Output

Generate only production-ready frontend code.

Reuse components wherever possible.

Do not duplicate UI.

Leave backend integration as TODO comments.
