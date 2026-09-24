# Complete Backend + MongoDB + Cloudinary + Custom ML Integration Prompt
## Resume AI & Placement Platform

---

# 1. PROJECT CONTEXT

The frontend of this project is **already fully complete**.

It contains a polished Student, HR/Recruiter and Admin platform with the following existing features:

## Student

- Dashboard
- Resume upload
- Resume Analyzer / Resume Health
- ATS analysis
- Resume improvement
- Resume Builder
- Resume versions
- Job Description matching
- Skill-gap analysis
- Career Readiness Score
- Career Roadmap
- Skill Assessments
- Recommended Jobs
- Applications / Application Tracker
- Mock Interviews
- Interview history and evaluation
- Notifications
- Profile
- Privacy controls
- Activity streak
- Resources

## HR / Recruiter

- Dashboard
- Job creation
- Job editing
- Job management
- ATS/matching criteria
- Candidate search
- Candidate filtering
- AI-assisted candidate matching
- Candidate details
- Screening
- Recruitment pipeline
- Interview management
- Company profile
- Analytics
- Reports
- Settings

## Admin

- Dashboard
- User management
- Platform analytics
- Content Audit
- Feature usage analytics
- Recruiter verification
- Reports
- Settings

The frontend currently uses mock data.

The backend is currently only a FastAPI scaffold with basic service/status endpoints.

The objective is now to build the **real backend, MongoDB database, Cloudinary file storage, authentication/authorization, resume processing, application persistence, and one small custom ML model built by the developer**.

---

# 2. VERY IMPORTANT ARCHITECTURAL DECISIONS

Use:

```text
Frontend
React + existing UI
        ↓
FastAPI
        ↓
MongoDB
        ↓
Cloudinary
```

For machine learning:

```text
Resume
   ↓
Text extraction
   ↓
Feature extraction
   ↓
Custom trained ML model
   ↓
Resume ↔ Job Match Score
```

## Do NOT use raw OpenAI/Grok API keys as the project's ML implementation.

The project must contain **one actual ML model trained and integrated by the developer**.

That model should be used for:

> **Resume-to-Job Match Prediction**

This is the recommended ML component because it naturally belongs to the existing JD Matching feature and can be clearly demonstrated academically.

Other features such as resume improvement, ATS checks, explanations and recommendations can initially use:

- deterministic/rule-based algorithms
- structured backend logic
- templates
- the output of the custom ML model

Do not make the whole platform dependent on an external LLM API.

---

# 3. TECHNOLOGY STACK

Use:

### Frontend

Existing React application.

Do not redesign it.

### Backend

```text
Python
FastAPI
Pydantic v2
PyMongo or Motor
```

Prefer the official MongoDB Python driver compatible with the project's Python version.

If asynchronous database access is required, use the currently supported async MongoDB driver approach.

Do not introduce SQLAlchemy.

### Database

```text
MongoDB
```

Use MongoDB collections and appropriate indexes.

### File Storage

```text
Cloudinary
```

Store uploaded resume PDFs/DOCX files in Cloudinary.

MongoDB stores:

- Cloudinary public ID
- secure URL/reference
- file metadata
- ownership
- upload timestamps
- analysis status

Do not store PDF binary content directly in MongoDB.

### ML

Use:

```text
scikit-learn
pandas
numpy
joblib
```

A small:

```text
Random Forest
```

or:

```text
Logistic Regression
```

model is sufficient.

Recommended:

> **Random Forest classifier/regressor for Resume–Job Match Prediction**

The model should be small, explainable and easy to demonstrate.

---

# 4. PROJECT STRUCTURE

Refactor the backend approximately like this:

```text
backend/
│
├── app/
│   ├── main.py
│   │
│   ├── core/
│   │   ├── config.py
│   │   ├── security.py
│   │   ├── dependencies.py
│   │   └── exceptions.py
│   │
│   ├── db/
│   │   ├── mongodb.py
│   │   ├── indexes.py
│   │   └── collections.py
│   │
│   ├── models/
│   │   └── document_models.py
│   │
│   ├── schemas/
│   │   ├── auth.py
│   │   ├── users.py
│   │   ├── resumes.py
│   │   ├── ats.py
│   │   ├── jobs.py
│   │   ├── matching.py
│   │   ├── applications.py
│   │   ├── candidates.py
│   │   ├── interviews.py
│   │   ├── assessments.py
│   │   ├── roadmap.py
│   │   ├── notifications.py
│   │   └── analytics.py
│   │
│   ├── api/
│   │   ├── auth.py
│   │   ├── users.py
│   │   ├── resumes.py
│   │   ├── ats.py
│   │   ├── jd_match.py
│   │   ├── jobs.py
│   │   ├── recommendations.py
│   │   ├── applications.py
│   │   ├── candidates.py
│   │   ├── screening.py
│   │   ├── interviews.py
│   │   ├── assessments.py
│   │   ├── roadmap.py
│   │   ├── notifications.py
│   │   ├── analytics.py
│   │   └── admin.py
│   │
│   ├── services/
│   │   ├── auth_service.py
│   │   ├── resume_service.py
│   │   ├── document_service.py
│   │   ├── cloudinary_service.py
│   │   ├── ats_service.py
│   │   ├── jd_match_service.py
│   │   ├── resume_improvement_service.py
│   │   ├── career_service.py
│   │   ├── roadmap_service.py
│   │   ├── assessment_service.py
│   │   ├── recommendation_service.py
│   │   ├── application_service.py
│   │   ├── candidate_service.py
│   │   ├── screening_service.py
│   │   ├── interview_service.py
│   │   ├── notification_service.py
│   │   └── analytics_service.py
│   │
│   ├── ml/
│   │   ├── model.py
│   │   ├── predictor.py
│   │   ├── feature_extractor.py
│   │   ├── preprocessing.py
│   │   └── model_metadata.json
│   │
│   └── utils/
│       ├── pagination.py
│       ├── scoring.py
│       ├── files.py
│       └── dates.py
│
├── ml/
│   ├── dataset/
│   │   └── resume_job_matches.csv
│   ├── train_model.py
│   ├── evaluate_model.py
│   └── artifacts/
│       └── resume_job_match_model.joblib
│
├── scripts/
│   ├── seed.py
│   └── create_indexes.py
│
├── tests/
│
├── uploads/
│
├── .env.example
├── requirements.txt
├── README.md
└── Dockerfile
```

The exact structure can vary slightly, but maintain the separation of:

```text
API
Business logic
Database
Storage
ML
```

---

# 5. MONGODB DATABASE DESIGN

Use MongoDB collections rather than relational tables.

Recommended database:

```text
resume_ai_platform
```

Collections:

```text
users
student_profiles
recruiter_profiles
companies
resumes
resume_versions
resume_analyses
resume_improvements
skills
student_skills
jobs
job_matches
applications
application_events
application_notes
screenings
interviews
mock_interviews
mock_interview_questions
mock_interview_answers
mock_interview_evaluations
assessments
assessment_questions
assessment_attempts
roadmaps
notifications
activities
career_readiness_history
job_reports
audit_logs
```

Do not create every possible entity as a separate collection if a small nested document is more appropriate.

Use embedded documents for tightly coupled information.

---

# 6. USERS COLLECTION

Example document:

```json
{
  "_id": "ObjectId",
  "email": "student@example.com",
  "password_hash": "...",
  "full_name": "Demo Student",
  "role": "student",
  "is_active": true,
  "is_verified": true,
  "created_at": "datetime",
  "updated_at": "datetime",
  "last_login_at": "datetime"
}
```

Roles:

```text
student
hr
admin
```

Create a unique index on:

```text
email
```

Never store plaintext passwords.

---

# 7. STUDENT PROFILE

Collection:

```text
student_profiles
```

Document:

```json
{
  "_id": "ObjectId",
  "user_id": "ObjectId",
  "target_role": "Frontend Developer",
  "bio": "...",
  "phone": "...",
  "location": "...",
  "preferred_work_mode": "remote",
  "preferred_locations": ["Chennai", "Bangalore"],
  "profile_completion": 92,
  "career_readiness_score": 78,
  "current_streak": 7,
  "longest_streak": 12,
  "resume_visibility": "recruiters",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

---

# 8. RECRUITER PROFILE

Collection:

```text
recruiter_profiles
```

Document:

```json
{
  "_id": "ObjectId",
  "user_id": "ObjectId",
  "company_id": "ObjectId",
  "job_title": "Talent Acquisition Specialist",
  "phone": "...",
  "is_verified": true,
  "verification_status": "verified",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

---

# 9. COMPANY

Collection:

```text
companies
```

Fields:

```text
_id
name
logo_url
website
description
industry
location
is_verified
verification_status
created_at
updated_at
```

A company can have multiple recruiters.

---

# 10. RESUME STORAGE WITH CLOUDINARY

This is a critical requirement.

When the student uploads:

```text
resume.pdf
```

the backend must:

```text
Frontend
   ↓
FastAPI multipart upload
   ↓
Validate file
   ↓
Upload to Cloudinary
   ↓
Get Cloudinary metadata
   ↓
Create MongoDB resume document
   ↓
Extract text
   ↓
Analyze
```

MongoDB resume document should contain:

```json
{
  "_id": "ObjectId",
  "student_id": "ObjectId",
  "name": "Frontend Resume",
  "file_name": "resume.pdf",
  "file_type": "application/pdf",
  "file_size": 245000,
  "cloudinary_public_id": "resume_ai/resumes/abc123",
  "cloudinary_secure_url": "https://...",
  "version": 1,
  "is_current": true,
  "status": "analyzed",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

Never expose Cloudinary credentials to the frontend.

---

# 11. CLOUDINARY CONFIGURATION

Environment variables:

```text
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

The frontend must never receive:

```text
CLOUDINARY_API_SECRET
```

Use backend-only Cloudinary operations.

Use a folder structure such as:

```text
resume_ai/
    resumes/
    generated/
```

Generate unique public IDs.

Do not use raw user filenames as Cloudinary identifiers.

---

# 12. CLOUDINARY DELETE

When a resume is deleted:

```text
authorize user
 ↓
delete/soft-delete MongoDB document
 ↓
delete Cloudinary asset where appropriate
```

Do not allow a student to delete another student's Cloudinary file by manipulating an ID.

---

# 13. RESUME EXTRACTION

Support:

```text
PDF
DOCX
```

The backend should extract text from the actual uploaded document.

Recommended Python libraries:

```text
PyMuPDF
python-docx
```

Create:

```text
document_service.py
```

Return a common structure:

```json
{
  "text": "...",
  "sections": {
    "summary": "...",
    "experience": [],
    "projects": [],
    "education": [],
    "skills": []
  }
}
```

This parsed representation should feed:

```text
ATS
skill extraction
JD matching
resume improvement
Career Readiness
```

---

# 14. RESUME ANALYSIS COLLECTION

Collection:

```text
resume_analyses
```

Store:

```text
resume_id
overall_score
ats_score
skills_score
experience_score
projects_score
education_score
formatting_score
keyword_score
impact_score
section_completeness_score
strengths
warnings
critical_issues
matched_keywords
missing_keywords
formatting_checks
recommendations
analysis_version
created_at
```

Use nested documents/arrays where appropriate.

---

# 15. ATS SERVICE

Endpoint:

```text
POST /api/v1/ats/{resume_id}/analyze
```

Evaluate:

- section detection
- contact information
- keyword coverage
- formatting simplicity
- page count
- standard headings
- skill coverage
- job-title alignment
- experience relevance
- readability
- tables/text-box warnings
- image-based content warnings

The initial ATS implementation can be deterministic.

Do not require an LLM API.

---

# 16. RESUME HEALTH SCORE

The backend calculates Resume Health.

Example:

```text
Skills             82
Experience         78
Projects           86
Education          95
Formatting         90
Keywords           74
Impact             70
Completeness       92
```

Combine them into:

```text
Resume Health = 81
```

The calculation must be performed on the backend.

The frontend only displays the returned value.

---

# 17. RESUME IMPROVEMENT

Create:

```text
resume_improvements
```

Fields:

```text
resume_id
student_id
section
original_text
suggested_text
reason
improvement_type
status
created_at
```

Improvement types:

```text
impact
concise
ats
technical
professional
quantified
```

Initially use deterministic/template-based improvement logic.

The architecture must allow an optional future LLM provider.

Do not make an OpenAI/Grok API key mandatory.

---

# 18. RESUME VERSIONING

Collection:

```text
resume_versions
```

Store:

```text
resume_id
version_number
content
target_role
ats_score
resume_health_score
created_at
```

The `content` can be structured JSON for Resume Builder data.

Example:

```json
{
  "summary": "...",
  "experience": [],
  "projects": [],
  "education": [],
  "skills": []
}
```

When a student accepts an improvement:

```text
update content
 ↓
create next version
 ↓
reanalyze
 ↓
update scores
```

---

# 19. SKILLS COLLECTION

Create:

```text
skills
```

Fields:

```text
name
category
description
aliases
```

Examples:

```text
React
JavaScript
Python
SQL
Docker
AWS
TypeScript
```

Create indexes for skill names.

---

# 20. STUDENT SKILLS

Collection:

```text
student_skills
```

Fields:

```text
student_id
skill_id
level
score
source
verified
updated_at
```

Source examples:

```text
resume
assessment
manual
```

---

# 21. JOBS

Collection:

```text
jobs
```

Fields:

```text
_id
company_id
created_by
title
description
location
work_mode
experience_min
experience_max
salary_min
salary_max
status
required_skills
preferred_skills
matching_config
created_at
updated_at
expires_at
```

Status:

```text
draft
active
paused
closed
```

---

# 22. JOB MATCHING CONFIGURATION

Store the existing frontend's matching/ATS configuration.

Example:

```json
{
  "skills": 40,
  "experience": 30,
  "education": 15,
  "projects": 15
}
```

Backend must validate:

```text
total = 100
```

Never allow invalid configurations.

---

# 23. THE ONE CUSTOM ML MODEL

## Purpose

Implement exactly one small custom ML model:

> **Resume–Job Match Prediction Model**

This is the project's demonstrable machine-learning component.

Do not create five shallow ML models.

One meaningful model is enough.

---

# 24. ML MODEL DESIGN

Use:

```text
RandomForestClassifier
```

or:

```text
RandomForestRegressor
```

Recommended for the project:

```text
RandomForestRegressor
```

to predict a match score from 0–100.

The model can use features such as:

```text
skill_overlap
required_skill_coverage
keyword_overlap
experience_similarity
education_match
project_relevance
```

Example input:

```text
skill_overlap = 0.80
required_skill_coverage = 0.75
keyword_overlap = 0.68
experience_similarity = 0.90
education_match = 1.0
project_relevance = 0.82
```

Output:

```text
87.3
```

Round for display:

```text
87%
```

---

# 25. ML DATASET

Create a small but meaningful dataset.

File:

```text
ml/dataset/resume_job_matches.csv
```

Example columns:

```text
skill_overlap
required_skill_coverage
keyword_overlap
experience_similarity
education_match
project_relevance
match_score
```

The dataset should contain enough examples for demonstration and evaluation.

Do not fabricate a claim that it represents industry-wide data.

Document that it is a project dataset created/curated for the prototype.

---

# 26. TRAINING SCRIPT

Create:

```text
ml/train_model.py
```

It should:

1. load dataset
2. validate columns
3. clean data
4. split train/test
5. train model
6. evaluate model
7. save model
8. save metadata

Output:

```text
ml/artifacts/resume_job_match_model.joblib
```

Metadata:

```text
model type
features
training date
dataset size
evaluation metrics
```

---

# 27. MODEL EVALUATION

Create:

```text
ml/evaluate_model.py
```

For regression, calculate:

```text
MAE
RMSE
R²
```

Show these in the console.

Example:

```text
Model: Random Forest Regressor
Training samples: 400
Test samples: 100
MAE: 5.8
RMSE: 7.2
R²: 0.84
```

Do not invent the values.

The actual script should print the real values.

---

# 28. FEATURE EXTRACTION FOR ML

Create:

```text
app/ml/feature_extractor.py
```

It should convert:

```text
resume
+
job
```

into the exact feature vector used during training.

This is extremely important.

Training and prediction must use the same feature order and preprocessing.

Do not manually construct different features during inference.

---

# 29. ML PREDICTION SERVICE

Create:

```text
app/ml/predictor.py
```

Load:

```text
resume_job_match_model.joblib
```

at application startup or lazily on first use.

Expose something conceptually like:

```python
predict_match(features) -> float
```

Clamp output to:

```text
0–100
```

only as a final safety boundary.

---

# 30. JD MATCH PIPELINE

The real flow should be:

```text
Student selects Job
       ↓
Backend retrieves Resume
       ↓
Retrieve parsed resume text
       ↓
Retrieve Job requirements
       ↓
Extract skills/keywords
       ↓
Calculate model features
       ↓
Custom ML model
       ↓
Match score
       ↓
Generate matched/partial/missing skills
       ↓
Store result in MongoDB
       ↓
Return response
```

---

# 31. JOB MATCH DOCUMENT

Collection:

```text
job_matches
```

Example:

```json
{
  "_id": "ObjectId",
  "student_id": "ObjectId",
  "resume_id": "ObjectId",
  "job_id": "ObjectId",
  "model_version": "1.0",
  "overall_score": 87.3,
  "display_score": 87,
  "features": {
    "skill_overlap": 0.82,
    "required_skill_coverage": 0.78,
    "keyword_overlap": 0.70,
    "experience_similarity": 0.90,
    "education_match": 1.0,
    "project_relevance": 0.84
  },
  "matched_skills": [],
  "partial_skills": [],
  "missing_skills": [],
  "recommendations": [],
  "created_at": "datetime"
}
```

The stored feature values make the ML result explainable and useful for academic demonstration.

---

# 32. IMPORTANT ML EXPLANATION

Do not claim:

```text
AI says you're 87% suitable.
```

Prefer:

```text
ML Match Score: 87%

Based on:
- required skill coverage
- keyword overlap
- experience similarity
- project relevance
- education match
```

This makes it clear that the model is predicting a match score from defined features.

---

# 33. JD MATCH SKILL GAP

The ML model provides the overall prediction.

Use deterministic logic for the detailed skill breakdown:

```text
Matched
Partial
Missing
```

This is intentionally separate.

Do not force the ML model to produce every explanation.

---

# 34. CAREER READINESS

Create a backend service.

Inputs:

```text
Resume Health
ATS
Skills
Assessments
Interview history
Applications
Profile completion
```

Calculate:

```text
Career Readiness Score
```

Store current score in:

```text
student_profiles
```

Store history in:

```text
career_readiness_history
```

---

# 35. CAREER ROADMAP

Use MongoDB documents.

Example:

```json
{
  "_id": "ObjectId",
  "student_id": "ObjectId",
  "target_role": "Frontend Developer",
  "progress": 62,
  "phases": [
    {
      "title": "Frontend Engineering",
      "order": 2,
      "progress": 50,
      "items": [
        {
          "title": "TypeScript",
          "skill_id": "ObjectId",
          "status": "in_progress"
        }
      ]
    }
  ]
}
```

When JD matching identifies an important missing skill:

```text
Add to Roadmap
```

must create/update the roadmap item in MongoDB.

---

# 36. ASSESSMENTS

Create collections:

```text
assessments
assessment_questions
assessment_attempts
```

Questions can be embedded if appropriate.

Never send correct answers before submission.

After submission:

```text
calculate score
 ↓
save attempt
 ↓
update student skill
 ↓
update roadmap
 ↓
update Career Readiness
 ↓
create activity
```

---

# 37. JOB RECOMMENDATIONS

Backend should recommend jobs using:

```text
target role
student skills
resume match
assessment results
preferences
job status
```

The custom ML model may be reused to calculate job match scores.

Do not train another model.

Example:

```text
Frontend Developer — 92%
Full Stack Developer — 87%
Backend Developer — 73%
```

---

# 38. APPLICATIONS

Collection:

```text
applications
```

Document:

```json
{
  "_id": "ObjectId",
  "student_id": "ObjectId",
  "job_id": "ObjectId",
  "resume_id": "ObjectId",
  "status": "applied",
  "applied_at": "datetime",
  "updated_at": "datetime"
}
```

Prevent duplicate applications:

```text
same student + same job
```

unless an explicitly supported re-application workflow exists.

---

# 39. APPLICATION TIMELINE

Collection:

```text
application_events
```

Example:

```json
{
  "application_id": "ObjectId",
  "event_type": "shortlisted",
  "message": "Candidate shortlisted by recruiter.",
  "created_by": "ObjectId",
  "created_at": "datetime"
}
```

The frontend timeline must be populated from this collection.

---

# 40. APPLICATION NOTES

Allow:

```text
student private notes
```

Store in:

```text
application_notes
```

Ensure only the owning student can access private notes.

---

# 41. HR CANDIDATE MODEL

Do not duplicate students into a separate candidate account.

A candidate is:

```text
student
+
application
+
resume
```

When HR requests candidates:

```text
jobs
 ↓
applications
 ↓
students
 ↓
resume
 ↓
match
```

Return a frontend-friendly candidate object.

---

# 42. HR CANDIDATE SEARCH

Endpoint:

```text
GET /api/v1/hr/candidates
```

Support:

```text
search
job_id
skills
min_match
max_match
experience
location
status
stage
page
page_size
sort
```

Filtering should happen on the backend/database.

Do not load every candidate into the frontend and filter everything client-side.

---

# 43. HR CANDIDATE MATCHING

For each candidate/job combination:

```text
retrieve application
retrieve resume
retrieve job
retrieve/latest match
```

If no current match exists:

```text
calculate using ML model
```

Return:

```text
overall match
ATS
skills
experience
projects
education
matched skills
missing skills
```

---

# 44. HR SCREENING

Collection:

```text
screenings
```

Fields:

```text
application_id
reviewer_id
status
score
notes
created_at
updated_at
```

Actions:

```text
shortlist
reject
review
```

All changes must be persisted.

---

# 45. AI-ASSISTED RECRUITMENT

The custom ML score is an **assistive ranking signal**.

Never implement:

```text
ML score < 70 → automatically reject
```

Instead:

```text
ML Match: 86%
Recruiter Review Required
```

Store separately:

```text
ML recommendation
human decision
```

The recruiter remains the decision maker.

---

# 46. RECRUITMENT FAIRNESS

The model must not use:

- religion
- race
- political affiliation
- sexual orientation
- health information
- other sensitive/protected characteristics

Only use job-relevant features such as:

- skills
- experience
- education where relevant
- project relevance
- job-related keywords

Do not extract or store unnecessary sensitive attributes from resumes.

---

# 47. RECRUITMENT PIPELINE

Application status should represent:

```text
applied
under_review
shortlisted
interview
offer
hired
rejected
withdrawn
```

When HR changes a stage:

```text
authorize
 ↓
validate transition
 ↓
update application
 ↓
create timeline event
 ↓
create notification
 ↓
update analytics
```

---

# 48. INTERVIEWS

Collection:

```text
interviews
```

Fields:

```text
application_id
student_id
job_id
scheduled_by
scheduled_at
duration_minutes
type
status
meeting_url
notes
created_at
updated_at
```

Store timestamps in UTC.

---

# 49. MOCK INTERVIEWS

Student mock interviews should be separate from recruiter interviews.

Collections:

```text
mock_interviews
mock_interview_answers
mock_interview_evaluations
```

Store:

```text
student
role
type
difficulty
questions
answers
scores
feedback
final_report
```

Initially use deterministic evaluation/rubrics.

Do not require an external LLM API.

---

# 50. NOTIFICATIONS

Collection:

```text
notifications
```

Fields:

```text
user_id
type
title
message
related_entity_type
related_entity_id
is_read
created_at
```

Create notifications server-side for:

- resume analysis completed
- application submitted
- application shortlisted
- interview scheduled
- assessment completed
- roadmap milestone
- job recommendation
- HR new application

---

# 51. ACTIVITY + STREAK

Collection:

```text
activities
```

Track:

```text
resume_analysis
resume_improvement
assessment
mock_interview
roadmap_progress
application
```

Calculate streak from meaningful activity dates.

Keep only the simple streak.

Do not add XP, badges, leaderboards or other gamification.

---

# 52. PRIVACY

Student resume visibility:

```text
private
recruiters
public
```

Backend must enforce it.

Do not assume the frontend's visibility setting is sufficient.

---

# 53. JOB REPORTING

Collection:

```text
job_reports
```

Fields:

```text
job_id
reported_by
reason
description
status
created_at
resolved_at
resolved_by
```

Admin can:

```text
review
resolve
dismiss
```

---

# 54. RECRUITER VERIFICATION

Only admin can verify recruiters.

Fields:

```text
verification_status
verified_at
verified_by
```

Do not allow HR frontend requests to arbitrarily set:

```text
is_verified = true
```

---

# 55. ADMIN AUDIT LOG

Collection:

```text
audit_logs
```

Record:

```text
actor
action
entity_type
entity_id
metadata
created_at
```

Examples:

```text
recruiter_verified
job_removed
report_resolved
user_disabled
```

Do not store passwords, tokens or secrets.

---

# 56. AUTHENTICATION

Implement:

```text
POST /api/v1/auth/signup
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
GET  /api/v1/auth/me
```

Use:

```text
JWT
password hashing
```

Never store plaintext passwords.

Never expose password hashes.

---

# 57. ADMIN CREDENTIALS

Remove any insecure hard-coded:

```text
admin/admin
```

Create admin through a secure seed script or controlled environment setup.

Never put admin credentials in React source.

---

# 58. ROLE-BASED ACCESS CONTROL

Create backend dependencies:

```text
get_current_user
require_student
require_hr
require_admin
```

Also implement resource ownership.

Examples:

Student can only access:

```text
own resumes
own analyses
own applications
own assessments
own roadmap
own interviews
own notifications
```

HR can only access:

```text
own company
own jobs
applicants to own jobs
```

Admin can access administrative resources.

---

# 59. API CLIENT INTEGRATION

The completed frontend should be connected through one central API client.

Create:

```text
src/services/api/client.js
```

Use:

```text
VITE_API_BASE_URL
```

Example:

```text
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

Do not hard-code API URLs in pages.

---

# 60. FRONTEND API SERVICES

Create:

```text
authApi.js
resumeApi.js
atsApi.js
jdMatchApi.js
jobApi.js
applicationApi.js
candidateApi.js
screeningApi.js
interviewApi.js
mockInterviewApi.js
assessmentApi.js
roadmapApi.js
recommendationApi.js
notificationApi.js
analyticsApi.js
adminApi.js
```

Zustand stores should call these services.

---

# 61. REPLACE MOCK STORES

Current mock actions such as:

```text
setTimeout
Math.random
hardcoded candidate arrays
hardcoded application arrays
simulated analysis
```

must be progressively replaced.

The final architecture:

```text
Page
 ↓
Zustand action
 ↓
API service
 ↓
FastAPI
 ↓
MongoDB / Cloudinary / ML
```

---

# 62. KEEP ZUSTAND AS CLIENT STATE

Zustand can retain:

- authenticated user
- cached current resume
- UI state
- filters
- selected items
- temporary form state

But authoritative data must come from backend.

---

# 63. API RESPONSE DESIGN

Use consistent responses.

Single:

```json
{
  "data": {}
}
```

List:

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "page_size": 20,
    "total": 100,
    "total_pages": 5
  }
}
```

If the existing frontend expects another format, use an adapter rather than unnecessarily rewriting the UI.

---

# 64. ERROR RESPONSE

Use:

```json
{
  "error": {
    "code": "RESUME_NOT_FOUND",
    "message": "Resume could not be found.",
    "details": null
  }
}
```

Examples:

```text
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Validation Error
500 Internal Server Error
```

Never expose stack traces.

---

# 65. PAGINATION

Paginate:

- jobs
- candidates
- applications
- notifications
- users
- resumes
- interviews
- audit logs
- reports

Limit maximum `page_size`.

---

# 66. MONGODB INDEXES

Create useful indexes.

At minimum:

```text
users.email unique

student_profiles.user_id unique

recruiter_profiles.user_id unique

resumes.student_id
resumes.created_at

jobs.company_id
jobs.status
jobs.title

applications.student_id
applications.job_id
applications.status

notifications.user_id
notifications.is_read

job_matches.student_id
job_matches.job_id

activities.user_id
activities.created_at
```

Create compound indexes for common queries where appropriate.

---

# 67. MONGODB ATOMIC OPERATIONS

Use MongoDB atomic updates for operations such as:

```text
mark notification read
update roadmap item
change application status
update profile
```

Use transactions where multiple collections must change atomically and MongoDB deployment supports them.

---

# 68. APPLICATION SUBMISSION

When a student applies:

```text
validate authentication
 ↓
validate job is active
 ↓
validate resume belongs to student
 ↓
prevent duplicate application
 ↓
create application
 ↓
create application event
 ↓
create notification
 ↓
update activity/streak
```

Return the created application.

---

# 69. RESUME ANALYSIS PROCESSING

Preferred architecture:

```text
POST /resumes/{id}/analyze
        ↓
status = processing
        ↓
extract text
        ↓
parse sections
        ↓
ATS
        ↓
skill extraction
        ↓
Resume Health
        ↓
save analysis
        ↓
update Career Readiness
        ↓
notification
        ↓
status = completed
```

If processing is slow, use FastAPI background tasks initially.

Design the service so it can later move to:

```text
Celery
RQ
Redis queue
```

without changing the frontend API contract.

---

# 70. ANALYSIS STATUS

Resume document should have:

```text
status
analysis_status
analysis_progress
analysis_stage
```

Example:

```json
{
  "status": "processing",
  "analysis_progress": 65,
  "analysis_stage": "Analyzing skills"
}
```

Frontend should poll:

```text
GET /api/v1/resumes/{id}/analysis-status
```

---

# 71. AI / ML SEPARATION

Do not call the ML model directly inside the FastAPI route.

Use:

```text
route
 ↓
jd_match_service
 ↓
feature_extractor
 ↓
predictor
 ↓
model
```

This keeps the model replaceable.

---

# 72. MODEL VERSIONING

Store:

```text
model_version = "1.0"
```

with every match result.

When retraining:

```text
1.1
```

can be used.

This allows comparison of model outputs over time.

---

# 73. MODEL FILE MANAGEMENT

Do not regenerate/train the model every time FastAPI starts.

Training should be an explicit command:

```text
python ml/train_model.py
```

The server loads the trained artifact.

If the artifact is missing, fail with a clear startup/configuration message or provide a controlled development fallback.

Do not silently create a fake model.

---

# 74. MODEL EXPLANATION FOR PROJECT DEMO

Provide a small endpoint:

```text
GET /api/v1/ml/info
```

Admin-only or development-only.

Return:

```json
{
  "model": "Random Forest Regressor",
  "version": "1.0",
  "features": [
    "skill_overlap",
    "required_skill_coverage",
    "keyword_overlap",
    "experience_similarity",
    "education_match",
    "project_relevance"
  ],
  "trained_at": "...",
  "metrics": {
    "mae": 0,
    "rmse": 0,
    "r2": 0
  }
}
```

Populate metrics from actual training output.

This is useful for explaining your own ML implementation during a project review/viva.

---

# 75. ML MODEL LIMITATION

Clearly document:

> The custom model is a project-level Resume–Job Match prediction model trained on a curated project dataset. Its score is an assistive estimate, not a professional hiring decision or a universally calibrated probability.

Do not claim industry-grade accuracy without evidence.

---

# 76. SECURITY — FILE UPLOADS

Validate:

- file size
- MIME type
- extension
- actual document readability

Maximum default:

```text
10 MB
```

Use environment configuration.

Only accept:

```text
PDF
DOCX
```

for resume uploads.

---

# 77. SECURITY — CLOUDINARY

Cloudinary secrets must exist only on backend.

Never:

```text
VITE_CLOUDINARY_API_SECRET
```

Never expose the Cloudinary API secret through React.

---

# 78. SECURITY — FILE ACCESS

Do not make private resume assets publicly discoverable merely because they have a Cloudinary URL.

Where privacy is required, use authenticated backend access and/or appropriately protected Cloudinary delivery.

The backend must verify:

```text
owner
or authorized recruiter
or admin
```

before returning a private resume.

---

# 79. SECURITY — IDOR

Every endpoint accepting an ID must verify ownership/access.

Bad:

```text
GET /resumes/{id}
→ directly return by ID
```

Good:

```text
GET /resumes/{id}
→ authenticate
→ check ownership/authorization
→ return
```

Apply this to:

- resumes
- applications
- interviews
- assessments
- roadmaps
- notifications
- candidates
- jobs
- reports

---

# 80. CORS

Configure CORS through environment variables.

Development:

```text
http://localhost:5173
```

Do not use unrestricted production CORS.

---

# 81. ENVIRONMENT VARIABLES

Create:

```text
.env.example
```

with:

```text
APP_ENV=development

MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=resume_ai_platform

JWT_SECRET=
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

CORS_ORIGINS=http://localhost:5173

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

MAX_UPLOAD_SIZE_MB=10

ML_MODEL_PATH=ml/artifacts/resume_job_match_model.joblib
ML_MODEL_VERSION=1.0
```

If an optional external AI provider is ever introduced later, keep its key backend-only and optional.

---

# 82. NEVER COMMIT SECRETS

`.gitignore` must include:

```text
.env
*.env
```

Do not commit:

```text
MongoDB credentials
Cloudinary secret
JWT secret
AI keys
```

---

# 83. SEED DATA

Create:

```text
scripts/seed.py
```

Seed the actual MongoDB database.

Include:

### Users

5–10 students

2–3 HR users

1 admin

### Companies

3+

### Jobs

10+

### Resumes

Multiple resumes per selected students.

### Resume analyses

Realistic scores.

### Applications

Different pipeline stages.

### Candidates

Derived from actual applications.

### Assessments

Multiple skills.

### Roadmaps

Multiple target roles.

### Interviews

Upcoming + completed.

### Notifications

Read + unread.

### Reports

Pending + resolved.

All relationships must reference actual MongoDB ObjectIds.

---

# 84. SEED ML-RELEVANT DATA

Seed jobs and resumes with meaningful differences.

Example:

Student:

```text
React
JavaScript
SQL
Git
```

Job:

```text
React
JavaScript
TypeScript
Docker
```

The matching pipeline should identify:

```text
Matched:
React
JavaScript

Missing:
TypeScript
Docker
```

The model feature vector should reflect that.

---

# 85. DEMO ACCOUNTS

Document seeded demo credentials in README.

Do not put them into frontend code.

Production deployment must disable/remove demo credentials.

---

# 86. ADMIN ANALYTICS

Create endpoints:

```text
GET /api/v1/admin/analytics/overview
GET /api/v1/admin/analytics/users
GET /api/v1/admin/analytics/jobs
GET /api/v1/admin/analytics/applications
GET /api/v1/admin/analytics/features
GET /api/v1/admin/analytics/ml
```

Metrics should be derived from MongoDB.

---

# 87. HR ANALYTICS

Endpoints:

```text
GET /api/v1/hr/analytics/overview
GET /api/v1/hr/analytics/jobs/{id}
GET /api/v1/hr/analytics/pipeline
```

Calculate:

- applicants
- shortlisted
- interviews
- offers
- hires
- average match score
- pipeline conversion
- top skills

Always scope results to the HR user's company.

---

# 88. STUDENT ANALYTICS

Endpoint:

```text
GET /api/v1/student/analytics
```

Return:

- resume score history
- ATS history
- career readiness history
- assessment scores
- application pipeline
- interview scores
- roadmap progress

---

# 89. FRONTEND DASHBOARD DATA

The existing Student Dashboard should now load from:

```text
GET /student/dashboard
```

or several API endpoints.

Do not maintain duplicate hardcoded dashboard numbers.

Example:

```text
Career Readiness = backend value
Resume Health = backend value
ATS = backend value
Applications = backend count
Interviews = backend count
Roadmap = backend progress
```

---

# 90. HR DASHBOARD DATA

Load:

```text
active jobs
applicants
shortlisted
interviews
pipeline
analytics
```

from backend.

No hardcoded candidate counts.

---

# 91. ADMIN DASHBOARD DATA

Load:

```text
users
jobs
applications
analyses
feature usage
reports
ML usage
```

from backend.

---

# 92. NOTIFICATION NAVIGATION

Each notification should store:

```text
related_entity_type
related_entity_id
```

Frontend uses this to navigate.

Examples:

```text
application
→ application page

resume
→ resume analysis

interview
→ interview details

job
→ job details
```

---

# 93. ERROR HANDLING

Frontend must correctly display:

```text
401
403
404
409
422
500
```

Examples:

```text
Already applied to this job.
```

```text
You do not have permission to view this resume.
```

```text
Resume could not be processed.
```

Do not show raw backend exception text to users.

---

# 94. API LOADING STATES

Preserve the existing frontend loading components.

Use:

```text
skeleton
progress
spinner
empty state
error state
```

appropriately.

For resume processing, show the analysis stage.

---

# 95. NO UI REDESIGN

Do not modify the completed frontend unless needed for integration.

Do not:

- change the theme
- redesign the sidebar
- redesign cards
- replace icons
- move buttons unnecessarily
- remove animations
- remove completed features

The goal is:

```text
same frontend
+
real backend
+
real database
+
real Cloudinary storage
+
custom ML model
```

---

# 96. ICON AND BUTTON REGRESSION CHECK

Backend integration must not cause UI regression.

Audit:

- icon alignment
- icon size
- button positioning
- loading indicators
- error icons
- upload icons
- navigation buttons
- modal actions

Every button must remain correctly positioned and functional.

---

# 97. API DOCUMENTATION

FastAPI Swagger should clearly document all routes.

Use tags:

```text
Auth
Users
Resumes
ATS
JD Matching
Jobs
Applications
Candidates
Screening
Interviews
Assessments
Roadmap
Notifications
Analytics
Admin
ML
```

Provide request/response schemas.

---

# 98. HEALTH ENDPOINT

Create:

```text
GET /health
```

Return status for:

```text
API
MongoDB
Cloudinary configuration
ML model
```

Example:

```json
{
  "status": "healthy",
  "database": "healthy",
  "storage": "configured",
  "ml_model": "loaded"
}
```

Do not expose secrets.

---

# 99. TESTING

Create tests for:

## Auth

- signup
- login
- invalid credentials
- token validation
- roles

## MongoDB

- create/read/update/delete
- indexes
- relationships

## Resume

- upload
- invalid file
- ownership
- Cloudinary metadata
- parsing
- analysis

## ATS

- score generation
- missing skills
- formatting checks

## ML

- feature extraction
- prediction
- score range
- model loading

## Jobs

- create
- edit
- publish
- close

## JD Matching

- feature generation
- prediction
- skill gap
- persistence

## Applications

- apply
- duplicate prevention
- status transitions

## HR

- candidate access
- company isolation
- screening

## Interviews

- schedule
- update
- cancel

## Assessments

- attempt
- submit
- score

## Notifications

- creation
- read
- read all

## Admin

- role restriction
- report handling
- recruiter verification

---

# 100. FULL END-TO-END TEST

Test the complete Student flow:

```text
Signup
 ↓
Login
 ↓
Profile
 ↓
Upload Resume
 ↓
Cloudinary storage
 ↓
MongoDB resume record
 ↓
Text extraction
 ↓
ATS
 ↓
Resume Health
 ↓
Resume improvement
 ↓
Resume version
 ↓
Select Job
 ↓
Custom ML Match
 ↓
Skill Gap
 ↓
Career Roadmap
 ↓
Assessment
 ↓
Career Readiness
 ↓
Job Recommendation
 ↓
Apply
 ↓
Application Tracker
 ↓
Notification
 ↓
Interview
 ↓
Mock Interview
 ↓
Interview Result
 ↓
Updated Career Readiness
```

---

# 101. FULL HR TEST

```text
HR Login
 ↓
Company
 ↓
Create Job
 ↓
Configure matching weights
 ↓
Publish
 ↓
Applications
 ↓
Candidate Search
 ↓
Filters
 ↓
Candidate Match
 ↓
Custom ML Score
 ↓
Candidate Details
 ↓
Screen
 ↓
Shortlist
 ↓
Schedule Interview
 ↓
Pipeline Update
 ↓
Notification
 ↓
Analytics
```

---

# 102. FULL ADMIN TEST

```text
Admin Login
 ↓
Dashboard
 ↓
Users
 ↓
Recruiter Verification
 ↓
Reports
 ↓
Resolve Report
 ↓
Audit Log
 ↓
Platform Analytics
 ↓
ML Analytics
```

---

# 103. REMOVE FRONTEND MOCK DATA

After integration, search the frontend for:

```text
Math.random
setTimeout
mockCandidates
mockJobs
mockApplications
mockResumeAnalysis
fakeScore
simulated
```

Review each occurrence.

Remove authoritative mock implementations.

Do not blindly remove harmless UI placeholders/constants.

---

# 104. KEEP DEMO DATA IN MONGODB

Do not delete the rich mock dataset.

Move it into:

```text
scripts/seed.py
```

so the application can still look populated.

The difference is:

```text
Before:
Frontend mock data

After:
MongoDB seed data
```

---

# 105. MONGODB DOCUMENT CONSISTENCY

Do not duplicate conflicting data.

For example, do not have:

```text
Student profile:
applications = 4
```

while the applications collection contains 7.

Prefer calculating counts from actual data or carefully updating denormalized values.

---

# 106. DENORMALIZATION

MongoDB allows denormalization.

Use it only where useful.

For example, a job may cache:

```text
applicant_count
```

for dashboard performance.

But ensure it is updated consistently.

Do not duplicate the entire candidate/application structure in multiple places.

---

# 107. OBJECT ID HANDLING

Frontend should never assume MongoDB ObjectIds are numbers.

API should serialize them safely as strings:

```json
{
  "id": "65abc123..."
}
```

Do not leak raw BSON objects into JSON.

---

# 108. DATETIME HANDLING

Store timestamps consistently in UTC.

Return ISO 8601 strings.

Frontend converts to local display time.

---

# 109. MODEL + MONGODB RELATION

When storing ML match results:

```text
student_id
resume_id
job_id
model_version
features
score
```

This allows later analysis of:

```text
which model version produced the score
```

and prevents confusion when the model is retrained.

---

# 110. MODEL RETRAINING

Provide:

```text
python ml/train_model.py
```

The workflow:

```text
update dataset
 ↓
train
 ↓
evaluate
 ↓
save artifact
 ↓
update model metadata
```

Do not retrain automatically during normal API requests.

---

# 111. OPTIONAL FUTURE LLM SUPPORT

Do not implement this as a project dependency now.

If later desired, create an abstraction:

```text
AIProvider
```

with possible implementations:

```text
RuleBasedProvider
LLMProvider
```

But the application must work completely without an OpenAI/Grok API key.

The custom ML model remains the project's actual ML implementation.

---

# 112. WHY THE CUSTOM ML MODEL EXISTS

Document clearly in the project:

> The platform uses a custom machine-learning model to estimate Resume–Job compatibility from structured resume/job features. This demonstrates an internally trained ML component while keeping the remaining platform logic deterministic and explainable.

This should be visible in technical documentation, not necessarily as a prominent end-user UI label.

---

# 113. PROJECT VIVA / DEMO SUPPORT

Include a document:

```text
docs/ML_MODEL.md
```

Explain:

1. Problem
2. Dataset
3. Features
4. Preprocessing
5. Algorithm
6. Training
7. Evaluation
8. Prediction
9. Integration
10. Limitations
11. Future improvements

Example:

```text
Problem:
Predict how well a resume fits a job.

Input:
Six structured compatibility features.

Model:
Random Forest Regressor.

Output:
0–100 predicted match score.

Integration:
FastAPI loads trained model and uses it during JD matching.
```

This makes the custom ML component easy to defend during evaluation.

---

# 114. DO NOT OVERENGINEER THE ML

The model does not need:

- deep learning
- transformers
- LLM fine-tuning
- huge datasets
- GPU infrastructure
- complex MLOps

A small, well-explained, properly trained model is better for this project.

The important thing is that:

```text
you built it
you trained it
you evaluated it
you integrated it
```

---

# 115. DO NOT CALL EXTERNAL AI FOR THE ML SCORE

The following must NOT happen:

```text
Resume + JD
 ↓
OpenAI API
 ↓
"87%"
```

The actual match score must come from:

```text
Resume + JD
 ↓
Feature extraction
 ↓
Your trained ML model
 ↓
87%
```

---

# 116. DEPLOYMENT

Prepare:

```text
Dockerfile
docker-compose.yml
```

where useful.

Local architecture:

```text
Frontend
FastAPI
MongoDB
```

Cloudinary remains external storage.

Do not put MongoDB data in the backend container filesystem.

---

# 117. MONGODB CONNECTION

Use environment configuration.

Create:

```text
MongoDB client
```

once at application level where appropriate.

Use proper lifecycle handling.

Close the client during application shutdown.

Do not create a new database connection for every request.

---

# 118. CLOUDINARY CONNECTION

Configure Cloudinary during backend startup/configuration.

Do not initialize it separately inside every upload request unnecessarily.

---

# 119. DATABASE INITIALIZATION

Create:

```text
scripts/create_indexes.py
scripts/seed.py
```

Commands:

```text
python scripts/create_indexes.py
python scripts/seed.py
```

Make them safe to run repeatedly where possible.

Do not blindly duplicate seed records.

---

# 120. REQUIREMENTS

Update:

```text
requirements.txt
```

to include the actual backend dependencies.

At minimum consider:

```text
fastapi
uvicorn
pydantic
pydantic-settings
pymongo
python-multipart
PyMuPDF
python-docx
cloudinary
python-jose
passlib/bcrypt-compatible password hashing package
scikit-learn
pandas
numpy
joblib
pytest
httpx
```

Use versions compatible with the current Python environment.

Do not blindly copy outdated package versions.

---

# 121. README

Rewrite backend README to explain:

## Setup

```text
create virtual environment
install requirements
configure .env
start MongoDB
create indexes
seed database
train ML model
run FastAPI
```

## Commands

Example:

```text
python -m venv .venv
pip install -r requirements.txt

python scripts/create_indexes.py
python scripts/seed.py

python ml/train_model.py

uvicorn app.main:app --reload
```

Adapt commands if project structure differs.

---

# 122. FRONTEND README

Document:

```text
VITE_API_BASE_URL
```

and:

```text
Backend must be running
```

before starting the frontend.

---

# 123. API ROUTE LIST

Implement at least:

## Auth

```text
POST   /api/v1/auth/signup
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh
POST   /api/v1/auth/logout
GET    /api/v1/auth/me
```

## Profile

```text
GET    /api/v1/users/me
PATCH  /api/v1/users/me
GET    /api/v1/student/profile
PATCH  /api/v1/student/profile
```

## Resume

```text
POST   /api/v1/resumes/upload
GET    /api/v1/resumes
GET    /api/v1/resumes/{id}
PATCH  /api/v1/resumes/{id}
DELETE /api/v1/resumes/{id}
GET    /api/v1/resumes/{id}/download
POST   /api/v1/resumes/{id}/analyze
GET    /api/v1/resumes/{id}/analysis-status
GET    /api/v1/resumes/{id}/analyses
GET    /api/v1/resumes/{id}/versions
POST   /api/v1/resumes/{id}/improvements
PATCH  /api/v1/resume-improvements/{id}
```

## ATS

```text
GET    /api/v1/ats/{resume_id}
POST   /api/v1/ats/{resume_id}/analyze
```

## JD Match

```text
POST   /api/v1/jd-match
GET    /api/v1/jd-match/{id}
```

## Jobs

```text
GET    /api/v1/jobs
GET    /api/v1/jobs/{id}
POST   /api/v1/hr/jobs
GET    /api/v1/hr/jobs
GET    /api/v1/hr/jobs/{id}
PATCH  /api/v1/hr/jobs/{id}
DELETE /api/v1/hr/jobs/{id}
```

## Recommendations

```text
GET /api/v1/recommendations/jobs
```

## Applications

```text
GET    /api/v1/applications
GET    /api/v1/applications/{id}
POST   /api/v1/applications
PATCH  /api/v1/applications/{id}
POST   /api/v1/applications/{id}/withdraw
GET    /api/v1/applications/{id}/timeline
POST   /api/v1/applications/{id}/notes
```

## Candidates

```text
GET    /api/v1/hr/candidates
GET    /api/v1/hr/candidates/{id}
GET    /api/v1/hr/candidates/{id}/match
PATCH  /api/v1/hr/candidates/{id}/stage
```

## Screening

```text
GET    /api/v1/hr/screening
POST   /api/v1/hr/applications/{id}/screen
PATCH  /api/v1/hr/applications/{id}/screen
```

## Interviews

```text
GET    /api/v1/interviews
GET    /api/v1/interviews/{id}
POST   /api/v1/interviews
PATCH  /api/v1/interviews/{id}
POST   /api/v1/interviews/{id}/cancel
```

## Mock Interview

```text
POST   /api/v1/mock-interviews
GET    /api/v1/mock-interviews
GET    /api/v1/mock-interviews/{id}
POST   /api/v1/mock-interviews/{id}/answers
POST   /api/v1/mock-interviews/{id}/complete
GET    /api/v1/mock-interviews/{id}/report
```

## Assessments

```text
GET    /api/v1/assessments
GET    /api/v1/assessments/{id}
POST   /api/v1/assessments/{id}/attempts
POST   /api/v1/assessment-attempts/{id}/submit
GET    /api/v1/assessment-attempts
```

## Roadmap

```text
GET    /api/v1/roadmap
POST   /api/v1/roadmap
PATCH  /api/v1/roadmap/items/{id}
POST   /api/v1/roadmap/items
```

## Notifications

```text
GET    /api/v1/notifications
PATCH  /api/v1/notifications/{id}/read
POST   /api/v1/notifications/read-all
```

## Analytics

```text
GET /api/v1/student/analytics
GET /api/v1/hr/analytics/overview
GET /api/v1/hr/analytics/jobs/{id}
GET /api/v1/admin/analytics/overview
GET /api/v1/admin/analytics/features
GET /api/v1/admin/analytics/ml
```

## ML

```text
GET /api/v1/ml/info
```

Restrict this endpoint appropriately.

---

# 124. FINAL FRONTEND INTEGRATION CHECK

After backend implementation:

```text
Search the frontend for mock data.
```

Replace:

```text
mock resume
mock score
mock jobs
mock applications
mock candidates
mock notifications
mock interviews
```

with API data.

The frontend should still look the same.

---

# 125. IMPORTANT FRONTEND STATE RULE

Do not fetch everything on every page mount unnecessarily.

Use sensible loading/caching behavior.

For example:

```text
Dashboard
→ load dashboard summary

Resume page
→ load resumes

Resume analysis
→ load selected analysis
```

Do not make dozens of duplicate API requests.

---

# 126. FINAL DATA FLOW

## Resume

```text
React
 ↓
FastAPI
 ↓
Cloudinary
 ↓
MongoDB metadata
 ↓
Document Parser
 ↓
ATS
 ↓
Resume Health
 ↓
MongoDB
 ↓
React
```

## JD Match

```text
React
 ↓
FastAPI
 ↓
MongoDB resume + job
 ↓
Feature Extraction
 ↓
Custom ML Model
 ↓
Skill Gap Logic
 ↓
MongoDB
 ↓
React
```

## Application

```text
React
 ↓
FastAPI
 ↓
Authorization
 ↓
MongoDB
 ↓
Application Event
 ↓
Notification
 ↓
React
```

## HR Candidate

```text
React
 ↓
FastAPI
 ↓
Company authorization
 ↓
MongoDB
 ↓
Application + Resume + Job
 ↓
Custom ML Match
 ↓
Candidate result
 ↓
React
```

---

# 127. FINAL DEFINITION OF DONE

The project is complete only when:

```text
React
 ↓
FastAPI
 ↓
MongoDB
```

is the actual application data flow.

Resume files are stored through:

```text
Cloudinary
```

and referenced from MongoDB.

The custom ML component is:

```text
Resume–Job Match Prediction
```

and is:

```text
trained by the developer
evaluated by the developer
saved as a model artifact
loaded by FastAPI
used in actual JD matching
```

No OpenAI/Grok raw API key is required for the core ML functionality.

The existing frontend remains visually intact.

The mock data becomes database seed data.

The application must support:

```text
Authentication
Authorization
Resume persistence
Cloudinary storage
Resume parsing
ATS
Resume Health
Resume Improvement
Resume versions
JD Matching
Custom ML Match Prediction
Skill Gap Analysis
Career Readiness
Career Roadmap
Skill Assessments
Job Recommendations
Applications
Candidate Management
Screening
Recruitment Pipeline
Interviews
Mock Interviews
Notifications
Privacy
Recruiter Verification
Reports
Analytics
Audit Logs
```

---

# 128. FINAL IMPLEMENTATION INSTRUCTION

**Do not rebuild the frontend.**

Treat the existing frontend as the finished product interface.

Your job is to make the existing application genuinely work behind that interface.

First inspect:

- current React routes
- Zustand stores
- existing frontend data models
- existing backend scaffold
- current API/status endpoints
- existing components
- current resume/JD/ATS flows

Then integrate incrementally.

Use:

```text
MongoDB
+
Cloudinary
+
FastAPI
+
one custom Random Forest ML model
```

The backend must become the source of truth.

The database must contain real persisted application data.

Cloudinary must contain uploaded resume files.

The custom ML model must produce the actual Resume–Job Match prediction.

Do not replace the ML model with OpenAI, Grok or another external API.

Do not create unnecessary additional ML models.

Do not add an AI Job Description Generator.

Do not add gamification beyond the existing activity streak.

Do not redesign the completed UI.

Do not leave core functionality powered by frontend mock data after its backend endpoint has been implemented.

Do not leave dead buttons or disconnected flows.

Do not use random numbers for authoritative scores.

Do not hard-code admin credentials.

Do not expose secrets.

Do not expose private resumes without authorization.

Do not use sensitive/protected characteristics for recruitment matching.

Do not let AI/ML automatically make final hiring decisions.

Build clean service boundaries so the platform can later evolve from:

```text
local development
→ production MongoDB
→ production Cloudinary
→ improved ML model
→ optional advanced AI services
→ background processing
```

without requiring a major rewrite.

The final result should be a **real, authenticated, MongoDB-backed, Cloudinary-powered FastAPI backend with one genuinely custom trained ML component powering the Resume–Job Matching feature, fully integrated with the already-completed React frontend.**
