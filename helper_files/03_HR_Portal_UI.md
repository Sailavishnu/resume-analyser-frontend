# 03_HR_Portal_UI.md

# AI Resume Analyzer -- HR Portal Frontend Prompt (Antigravity)

## IMPORTANT

Read this prompt completely before generating code.

This repository contains **ONLY THE FRONTEND**.

### STRICT RULES

Do NOT generate: - Backend code - APIs - Database schemas -
Authentication services - AI logic - Resume parsing - ATS algorithms -
Business logic - Fake candidates, jobs or analytics unless requested

Create only production-ready React frontend with backend integration
marked as TODO.

------------------------------------------------------------------------

# Tech Stack

-   React + Vite
-   Tailwind CSS
-   Framer Motion
-   React Router
-   Zustand (empty/frontend state only)
-   Lucide Icons

------------------------------------------------------------------------

# Design Language

Create an enterprise recruiter dashboard inspired by:

-   Greenhouse
-   Lever
-   Workday
-   LinkedIn Recruiter
-   Linear

Desktop-first with responsive support.

Use: - Permanent left sidebar - Sticky top navigation - Clean cards -
Spacious tables - Soft shadows - Rounded corners - Consistent spacing

------------------------------------------------------------------------

# Navigation

Sidebar

-   Dashboard
-   Job Management
-   Candidates
-   Resume Screening
-   Interviews
-   Analytics
-   Reports
-   Company Profile
-   Notifications
-   Settings

Top Navbar

-   Search
-   Notifications
-   Quick Actions
-   User Menu

------------------------------------------------------------------------

# 1 Dashboard

Sections

-   Welcome Banner
-   Hiring Summary Cards
-   Open Positions
-   Candidate Pipeline
-   Interview Schedule
-   Recent Activity
-   Quick Actions
-   Recruitment Performance

Include loading, empty and error states.

------------------------------------------------------------------------

# 2 Job Management

Features

-   Job Listing Table
-   Create Job Drawer
-   Edit Job Modal
-   Delete Confirmation
-   Filter by Status
-   Search Jobs
-   Pagination

Job Card fields

-   Title
-   Department
-   Location
-   Employment Type
-   Status
-   Applicants

------------------------------------------------------------------------

# 3 Candidate Management

Responsive data table

Columns

-   Candidate
-   Applied Role
-   Experience
-   Skills
-   Status
-   Score
-   Actions

Filters

-   Skills
-   Experience
-   Status
-   Date

------------------------------------------------------------------------

# 4 Resume Screening

Cards

-   Resume Preview
-   Candidate Summary
-   ATS Score Placeholder
-   Match Percentage Placeholder
-   Skills
-   Notes
-   Shortlist Button
-   Reject Button

No AI implementation.

------------------------------------------------------------------------

# 5 Candidate Profile

Sections

-   Personal Details
-   Resume Viewer
-   Skills
-   Education
-   Experience
-   Projects
-   Notes
-   Interview History

Action Buttons

-   Shortlist
-   Reject
-   Schedule Interview

------------------------------------------------------------------------

# 6 Interview Scheduling

Calendar placeholder

Interview list

Interview cards

Dialogs

-   Schedule
-   Reschedule
-   Cancel

Timeline layout.

------------------------------------------------------------------------

# 7 Analytics

UI only.

Cards

-   Total Jobs
-   Total Candidates
-   Shortlisted
-   Hired

Placeholder charts

-   Hiring Trend
-   Candidate Sources
-   Department Hiring
-   Funnel

------------------------------------------------------------------------

# 8 Reports

Report cards

Export dialog placeholder

History table

Filters

Date range

Department

Status

------------------------------------------------------------------------

# 9 Company Profile

Sections

-   Company Information
-   Branding
-   Careers Page Settings
-   Recruiter Team
-   Contact Information

------------------------------------------------------------------------

# 10 Notifications

Grouped notification cards

Unread

Today

Earlier

Mark all read button.

------------------------------------------------------------------------

# 11 Settings

Theme

Notifications

Security

Recruiter Preferences

Privacy

Account

Danger Zone

------------------------------------------------------------------------

# Shared Components

Use reusable components only.

-   Sidebar
-   Navbar
-   Card
-   Button
-   Table
-   Modal
-   Drawer
-   Tabs
-   Badge
-   Avatar
-   Pagination
-   Search Bar
-   Filters
-   Dialog
-   Toast
-   Tooltip
-   Skeleton
-   Empty State
-   Error State
-   Stats Card
-   Chart Card

------------------------------------------------------------------------

# Animations

Use subtle Framer Motion.

-   Fade
-   Slide
-   Hover Lift
-   Card Reveal
-   Dialog Animation

Avoid excessive motion.

------------------------------------------------------------------------

# Accessibility

Semantic HTML

Keyboard navigation

Visible focus

ARIA where required

Responsive layouts

------------------------------------------------------------------------

# Performance

Lazy loading

Route splitting

Reusable layouts

Avoid duplicate components

------------------------------------------------------------------------

# Final Goal

Build only a production-ready HR frontend.

Do not implement backend or business logic.

Leave backend integration points as TODO comments.
