# Database Schema Documentation

This document outlines the database schema specifications for the **AI Resume Analyzer & Recruitment System**. Each schema includes an attribute specification table (Attribute Name, Type, Constraint(s), and Description) followed by an explanatory passage detailing its role, associations, and operational relevance in the system.

---

### Table 3.1 : User Description

| Attribute Name | Type | Constraint(s) | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key, Not Null, Unique | Unique identifier for each user account in the system |
| `email` | String | Not Null, Unique | Registered user email address utilized for login authentication and alerts |
| `password_hash` | String | Not Null | Salted and hashed password credential for secure access control |
| `full_name` | String | Not Null | Complete name of the registered user |
| `role` | String | Not Null | System role designation assigned to user (`student`, `hr`, or `admin`) |
| `is_active` | Boolean | Default: True | Flag specifying whether the user account is currently active |
| `is_verified` | Boolean | Default: False | Indicates whether user identity or email confirmation has been completed |
| `last_login_at` | Date | - | Timestamp recording the most recent login session |
| `created_at` | Date | Not Null | Timestamp when the user account was initially registered |
| `updated_at` | Date | - | Timestamp when user account information was last updated |

Table 3.1 represents the User Description table used in the AI Resume Analyzer & Recruitment System. This table serves as the central identity registry storing authentication credentials and account authorization details for all platform users, including students, corporate recruiters, and platform administrators. The `_id` attribute acts as the unique identifier for each user in the database, ensuring every account record can be individually managed and referenced across all relational collections. The `email` attribute is enforced with a unique constraint to prevent duplicate registrations and provide a reliable login key, while the `role` attribute drives authorization boundaries, separating student capabilities from corporate recruitment features.

---

### Table 3.2 : Student Profile Description

| Attribute Name | Type | Constraint(s) | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key, Not Null, Unique | Unique identifier for the student profile record |
| `user_id` | ObjectId | Foreign Key, Not Null, Unique | Associated user account identifier linking to the Users collection |
| `target_role` | String | - | Primary career aspiration or target job designation |
| `bio` | String | - | Professional summary, career vision, or personal biography |
| `phone` | String | - | Primary contact telephone number |
| `location` | String | - | Current residential city, state, or country of the student |
| `preferred_work_mode` | String | - | Work arrangement preference (`Remote`, `On-site`, or `Hybrid`) |
| `preferred_locations` | Array[String] | - | List of preferred geographic cities or regions for employment |
| `profile_completion` | Integer | Default: 0 | Computed percentage indicating completeness of profile attributes |
| `career_readiness_score` | Integer | Default: 0 | Algorithmic readiness score evaluating preparation for placement |
| `current_streak` | Integer | Default: 0 | Current consecutive daily activity streak in practice modules |
| `longest_streak` | Integer | Default: 0 | Historical peak daily activity streak achieved by the student |
| `resume_visibility` | String | Default: 'recruiters' | Profile visibility scope (`recruiters` or `private`) |
| `primary_resume_id` | ObjectId | Foreign Key | Identifier pointing to the student's designated primary resume |
| `secondary_resume_id` | ObjectId | Foreign Key | Identifier pointing to an optional secondary or tailored resume |
| `updated_at` | Date | - | Timestamp when the student profile was last modified |

Table 3.2 represents the Student Profile Description table used in the AI Resume Analyzer & Recruitment System. This table stores extended student career details, work preferences, engagement indicators, and resume associations that augment base user credentials. The `_id` attribute provides a unique primary key for each student profile record, and the `user_id` attribute establishes a one-to-one foreign key link with the corresponding user entry. Key attributes like `career_readiness_score` and `profile_completion` allow the platform to track student preparation progress, while pointers to primary and secondary resumes facilitate fast candidate discovery and streamlined job application workflows.

---

### Table 3.3 : Recruiter Profile Description

| Attribute Name | Type | Constraint(s) | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key, Not Null, Unique | Unique identifier for the recruiter profile record |
| `user_id` | ObjectId | Foreign Key, Not Null, Unique | Associated user account identifier linking to the Users collection |
| `company_id` | ObjectId | Foreign Key | Identifier of the associated corporate entity or organization |
| `company_name` | String | Not Null | Registered legal or trade name of the hiring organization |
| `job_title` | String | - | Recruiter's corporate title or designation within the organization |
| `phone` | String | - | Official contact telephone number for business correspondence |
| `website` | String | - | URL to the employer's official corporate website |
| `industry` | String | - | Sector or business industry classification (e.g., Software, Finance) |
| `company_size` | String | - | Staff size bracket or organizational scale (e.g., 51-200 employees) |
| `location` | String | Not Null | Primary office headquarters or operating city |
| `description` | String | - | Overview and summary of company mission and culture |
| `is_verified` | Boolean | Default: False | Verification indicator approved by platform administration |
| `verification_status` | String | Default: 'pending' | Current employer vetting status (`pending`, `verified`, `rejected`) |
| `updated_at` | Date | - | Timestamp when the recruiter profile was last modified |

Table 3.3 represents the Recruiter Profile Description table used in the AI Resume Analyzer & Recruitment System. This table captures organizational information and professional credentials for human resource managers and corporate recruiters. The `_id` attribute acts as the unique identifier for each recruiter record, and `user_id` securely binds the organizational profile to an authenticated user account. Fields such as `company_name`, `industry`, and `verification_status` ensure transparency and candidate safety by validating corporate authenticity before job listings can be published and candidate applications reviewed.

---

### Table 3.4 : Resume Description

| Attribute Name | Type | Constraint(s) | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key, Not Null, Unique | Unique identifier for the resume record in the database |
| `student_id` | ObjectId | Foreign Key, Not Null | Reference to the student user who owns and uploaded the resume |
| `name` | String | Not Null | User-defined label or title for the resume document |
| `original_file_name` | String | Not Null | Original filename of the document as uploaded by the user |
| `file_type` | String | Not Null | MIME file format type of the document (e.g., application/pdf) |
| `file_size` | Integer | Not Null | Physical storage file size in bytes |
| `cloudinary_url` | String | Not Null | Secure cloud-hosted asset URL for file viewing and downloads |
| `cloudinary_public_id` | String | Not Null | Cloudinary asset identifier used for storage management and access |
| `slot` | String | Default: 'primary' | Resume slot designation (`primary` or `secondary`) |
| `is_primary` | Boolean | Default: True | Flag denoting if this resume serves as the active primary document |
| `is_current` | Boolean | Default: True | Indicates whether this document is the current active version |
| `score` | Integer | - | Calculated composite resume quality score (0-100) |
| `ats_score` | Integer | - | Calculated baseline ATS compliance score (0-100) |
| `status` | String | Default: 'uploaded' | Ingestion lifecycle state (`uploaded`, `processing`, `analyzed`, `failed`) |
| `parsed_data` | Object | - | Structured JSON containing extracted text, sections, and contact details |
| `created_at` | Date | Not Null | Timestamp when the resume file was initially uploaded |
| `updated_at` | Date | - | Timestamp when resume details or analysis were last refreshed |

Table 3.4 represents the Resume Description table used in the AI Resume Analyzer & Recruitment System. This table manages digital resume documents uploaded by candidates, persisting cloud storage references, file metadata, and parsing stages. The `_id` attribute uniquely identifies each uploaded resume document, while `student_id` enforces user ownership. The `cloudinary_url` and `cloudinary_public_id` attributes securely reference the encrypted external document storage, and the `parsed_data` object stores the extracted text sections necessary for automated natural language processing and job matching.

---

### Table 3.5 : Resume Analysis Description

| Attribute Name | Type | Constraint(s) | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key, Not Null, Unique | Unique identifier for the resume analysis record |
| `resume_id` | ObjectId | Foreign Key, Not Null | Identifier of the specific resume document evaluated |
| `overall_score` | Integer | Not Null | Composite quality evaluation rating across all criteria (0-100) |
| `ats_score` | Integer | Not Null | Compatibility score evaluating ATS parsing compliance (0-100) |
| `section_scores` | Object | Not Null | Sub-scores evaluated per section (skills, experience, education, etc.) |
| `strengths` | Array[String] | - | List of identified resume strengths and high-impact phrasing |
| `warnings` | Array[String] | - | Identified formatting warnings, weak descriptions, or passive verbs |
| `critical_issues` | Array[String] | - | Severe errors that impede ATS ingestion or readability |
| `matched_keywords` | Array[String] | - | Standard industry keywords successfully recognized in the resume |
| `missing_keywords` | Array[String] | - | Recommended technical competencies and keywords absent from text |
| `recommendations` | Array[Object] | - | Prioritized improvement suggestions containing actionable examples |
| `analysis_version` | String | Default: '1.0' | Versioning identifier of the underlying AI NLP parsing engine |
| `created_at` | Date | Not Null | Timestamp when the comprehensive analysis report was generated |

Table 3.5 represents the Resume Analysis Description table used in the AI Resume Analyzer & Recruitment System. This table maintains in-depth diagnostic feedback and quantitative evaluation scores generated by the AI parsing pipeline upon analyzing candidate resumes. The `_id` attribute provides a unique key for each analysis result, while `resume_id` links the report directly to its parent resume document. Attributes such as `overall_score`, `section_scores`, and categorized arrays (`strengths`, `warnings`, `missing_keywords`) equip students with concrete, data-backed insights to refine their resumes for corporate recruitment.

---

### Table 3.6 : Resume Improvement Description

| Attribute Name | Type | Constraint(s) | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key, Not Null, Unique | Unique identifier for the individual improvement recommendation |
| `resume_id` | ObjectId | Foreign Key, Not Null | Identifier of the resume associated with this enhancement |
| `student_id` | ObjectId | Foreign Key, Not Null | Identifier of the student receiving the enhancement suggestion |
| `section` | String | Not Null | Specific resume section targeted (e.g., Experience, Projects, Summary) |
| `original_text` | String | Not Null | Original text snippet extracted from the candidate's resume |
| `suggested_text` | String | Not Null | AI-enhanced rewrite incorporating strong action verbs and metrics |
| `reason` | String | Not Null | Explanation highlighting why the suggested revision improves impact |
| `improvement_type` | String | Not Null | Type category (`impact`, `concise`, `ats`, `technical`, `quantified`) |
| `status` | String | Default: 'pending' | User approval state (`pending`, `accepted`, `rejected`) |
| `target_role` | String | - | Specific job role toward which the enhancement is tailored |
| `created_at` | Date | Not Null | Timestamp when the improvement recommendation was created |

Table 3.6 represents the Resume Improvement Description table used in the AI Resume Analyzer & Recruitment System. This table records granular, sentence-level rewrite suggestions crafted by the AI assistant to optimize specific resume bullet points. The `_id` attribute uniquely identifies each suggested modification, while `resume_id` and `student_id` preserve document context and user authorization. By maintaining both `original_text` and `suggested_text` along with a user-controlled `status` attribute, students can selectively accept or discard enhancements within the interactive resume builder.

---

### Table 3.7 : Job Description

| Attribute Name | Type | Constraint(s) | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key, Not Null, Unique | Unique identifier for the job vacancy listing |
| `company_id` | ObjectId | Foreign Key, Not Null | Reference to the hiring company or employer organization |
| `created_by` | ObjectId | Foreign Key, Not Null | User identifier of the recruiter who posted the opening |
| `title` | String | Not Null | Job designation or professional title of the position |
| `department` | String | - | Department or functional division (e.g., Engineering, Marketing) |
| `description` | String | Not Null | Comprehensive job description outlining responsibilities and scope |
| `location` | String | Not Null | Geographic location or primary office branch of the job |
| `work_mode` | String | Not Null, Default: 'On-site' | Work style arrangement (`Remote`, `On-site`, or `Hybrid`) |
| `experience_min` | Integer | Not Null, Default: 0 | Minimum professional experience required in years |
| `experience_max` | Integer | Not Null, Default: 2 | Upper experience threshold required in years |
| `salary_min` | Integer | - | Minimum annual or monthly compensation figure |
| `salary_max` | Integer | - | Maximum annual or monthly compensation figure |
| `required_skills` | Array[String] | Not Null | Mandatory technical and professional competencies required |
| `preferred_skills` | Array[String] | - | Desirable secondary competencies that enhance candidate standing |
| `matching_config` | Object | Not Null | Weighted parameters for ranking (skills, experience, education, projects) |
| `status` | String | Default: 'draft' | Listing lifecycle state (`draft`, `active`, `paused`, `closed`) |
| `applicant_count` | Integer | Default: 0 | Denormalized count of applicants who have applied for the job |
| `expires_at` | Date | - | Expiration timestamp after which applications are automatically closed |
| `created_at` | Date | Not Null | Timestamp when the job posting was created |
| `updated_at` | Date | - | Timestamp when the job details were last updated |

Table 3.7 represents the Job Description table used in the AI Resume Analyzer & Recruitment System. This table serves as the primary catalogue for employment listings created and administered by corporate recruiters. The `_id` attribute provides a unique identifier for each job vacancy, and `created_by` identifies the recruiter in charge of the requisition. In addition to standard compensation and qualification parameters, the `matching_config` attribute stores customizable scoring weights that govern how the recommendation and matching algorithms rank candidate applications.

---

### Table 3.8 : Job Application Description

| Attribute Name | Type | Constraint(s) | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key, Not Null, Unique | Unique identifier for the job application record |
| `student_id` | ObjectId | Foreign Key, Not Null | Identifier of the student submitting the application |
| `job_id` | ObjectId | Foreign Key, Not Null | Identifier of the target job opening being applied for |
| `resume_id` | ObjectId | Foreign Key, Not Null | Identifier of the specific resume submitted for this application |
| `status` | String | Not Null, Default: 'applied' | Current recruitment stage (`applied`, `under_review`, `shortlisted`, `interview`, `offer`, `hired`, `rejected`, `withdrawn`) |
| `match_score` | Integer | - | Pre-computed algorithmic match score between resume and job (0-100) |
| `applied_at` | Date | Not Null | Timestamp when the candidate officially submitted the application |
| `updated_at` | Date | - | Timestamp of the most recent pipeline status transition |

Table 3.8 represents the Job Application Description table used in the AI Resume Analyzer & Recruitment System. This table models the recruitment interaction connecting applicants with published job postings. The `_id` attribute uniquely distinguishes each submitted application, while the composite foreign keys `student_id`, `job_id`, and `resume_id` track the applicant, requisition, and exact submitted resume. The `status` attribute maintains the candidate's lifecycle through recruiter screening, shortlisting, and final hiring stages, while the denormalized `match_score` facilitates fast recruiter filtering.

---

### Table 3.9 : Interview Description

| Attribute Name | Type | Constraint(s) | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key, Not Null, Unique | Unique identifier for the scheduled interview session |
| `application_id` | ObjectId | Foreign Key, Not Null | Reference to the associated candidate job application |
| `student_id` | ObjectId | Foreign Key, Not Null | Reference to the candidate student participating in the interview |
| `job_id` | ObjectId | Foreign Key, Not Null | Reference to the job requisition for which the candidate is interviewed |
| `scheduled_by` | ObjectId | Foreign Key, Not Null | Identifier of the recruiter or hiring manager hosting the session |
| `scheduled_at` | Date | Not Null | Date and time at which the interview is scheduled to take place |
| `duration_minutes` | Integer | Not Null, Default: 60 | Total allocated duration for the interview in minutes |
| `type` | String | Not Null, Default: 'technical' | Category of interview session (`technical`, `hr`, or `final`) |
| `status` | String | Default: 'scheduled' | Session state (`scheduled`, `completed`, or `cancelled`) |
| `meeting_url` | String | - | Remote video conference URL (e.g., Google Meet, MS Teams, Zoom) |
| `notes` | String | - | Recruiter evaluation notes and interview debrief feedback |
| `created_at` | Date | Not Null | Timestamp when the interview was scheduled |
| `updated_at` | Date | - | Timestamp when schedule parameters were last adjusted |

Table 3.9 represents the Interview Description table used in the AI Resume Analyzer & Recruitment System. This table records formal corporate interview rounds scheduled by hiring managers for shortlisted job candidates. The `_id` attribute acts as the unique identifier for each scheduled interview record, while `application_id` connects the interview to the overarching application workflow. Logistics such as `scheduled_at`, `duration_minutes`, `type`, and `meeting_url` coordinate online discussions, and the `notes` attribute allows interviewers to document candidate impressions and hiring recommendations.

---

### Table 3.10 : Mock Interview Description

| Attribute Name | Type | Constraint(s) | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key, Not Null, Unique | Unique identifier for the mock interview practice session |
| `student_id` | ObjectId | Foreign Key, Not Null | Reference to the student completing the practice simulation |
| `target_role` | String | Not Null | Targeted job role for simulated questions (e.g., Full Stack Developer) |
| `type` | String | Not Null, Default: 'general' | Simulation focus classification (`general`, `technical`, `behavioral`) |
| `difficulty` | String | Not Null, Default: 'medium' | Challenge difficulty level (`easy`, `medium`, `hard`) |
| `status` | String | Default: 'in_progress' | Simulation progress state (`in_progress` or `completed`) |
| `overall_score` | Integer | - | Composite evaluation score assessed by AI upon completion (0-100) |
| `communication_score` | Integer | - | Rating measuring articulation, structure, and verbal clarity |
| `technical_depth` | Integer | - | Rating measuring technical accuracy and depth of explanations |
| `confidence_level` | Integer | - | Evaluated rating of candidate confidence and certainty |
| `general_feedback` | String | - | High-level diagnostic summary and performance critique |
| `questions` | Array[Object] | - | Embedded list of posed questions, submitted answers, and sub-scores |
| `created_at` | Date | Not Null | Timestamp when the practice interview session was initiated |
| `completed_at` | Date | - | Timestamp when student finished and submitted all responses |

Table 3.10 represents the Mock Interview Description table used in the AI Resume Analyzer & Recruitment System. This table facilitates the AI-powered mock interview practice portal, where students can rehearse answers to customized interview questions without high-stakes pressure. The `_id` attribute uniquely identifies each simulation record, and `student_id` associates the practice history with a specific learner. Storing simulated question prompts alongside candidate responses and multi-dimensional scores (`communication_score`, `technical_depth`) allows students to systematically pinpoint weaknesses and build confidence.

---

### Table 3.11 : Notification Description

| Attribute Name | Type | Constraint(s) | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key, Not Null, Unique | Unique identifier for the notification entry |
| `user_id` | ObjectId | Foreign Key, Not Null | User identifier associated with the notification message |
| `type` | String | Not Null | Classification type of notification (e.g., application_update, interview_invite) |
| `title` | String | Not Null | Brief subject heading or title of the notification |
| `message` | String | Not Null | Detailed explanatory message content for the user |
| `icon` | String | Default: 'info' | Visual icon indicator (`success`, `warning`, `info`, `alert`) |
| `action_url` | String | - | Optional in-app routing URL for quick navigation |
| `related_entity_type` | String | - | Entity type linked to the trigger event (`job`, `application`, `resume`) |
| `related_entity_id` | ObjectId | - | Associated entity ID providing context to the notification |
| `priority` | String | Default: 'medium' | Urgency level of the notification (`high`, `medium`, `low`) |
| `is_read` | Boolean | Default: False | Indicates whether the notification has been viewed by the recipient |
| `created_at` | Date | Not Null | Timestamp when the notification was generated |

Table 3.11 represents the Notification Description table used in the AI Resume Analyzer & Recruitment System. This table stores information related to real-time notifications and alerts generated within the system. Notifications inform users about critical recruitment events, such as application reviews, newly posted job matches, and scheduled interviews. The `_id` attribute acts as the unique identifier for each notification record in the database, while the `user_id` field routes the alert to the appropriate recipient. Contextual attributes such as `related_entity_type` and `action_url` enable users to jump directly to the relevant record with a single click.

---

### Table 3.12 : ATS Analysis Description

| Attribute Name | Type | Constraint(s) | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key, Not Null, Unique | Unique identifier for the ATS scan report |
| `resume_id` | ObjectId | Foreign Key, Not Null | Identifier of the specific resume document evaluated |
| `overall_score` | Integer | Not Null | Aggregate ATS compatibility rating (0-100) |
| `section_detection_score` | Integer | Not Null | Score measuring standard section heading recognition (0-100) |
| `keyword_coverage_score` | Integer | Not Null | Score measuring coverage of recognized technical and role keywords (0-100) |
| `formatting_score` | Integer | Not Null | Score measuring layout cleanliness, margins, and parsable structures (0-100) |
| `readability_score` | Integer | Not Null | Score measuring text flow, typography parseability, and clarity (0-100) |
| `contact_info_score` | Integer | Not Null | Score confirming presence of email, phone, location, and web links (0-100) |
| `checks` | Array[Object] | - | Detailed collection of pass/fail validation rules executed by parser |
| `matched_keywords` | Array[String] | - | Recognized technical and industry keywords detected in resume |
| `missing_keywords` | Array[String] | - | Important role-specific keywords absent from the document |
| `formatting_warnings` | Array[String] | - | Identified formatting pitfalls (e.g., complex tables, multi-column blocks) |
| `recommendations` | Array[String] | - | Actionable guidance items for elevating overall parse rates |
| `created_at` | Date | Not Null | Timestamp when the ATS evaluation was performed |

Table 3.12 represents the ATS Analysis Description table used in the AI Resume Analyzer & Recruitment System. This table stores the granular diagnostic outputs generated by simulating modern Applicant Tracking System parsers against candidate resumes. The `_id` attribute provides a unique identifier for each ATS assessment run, linked to a specific resume via `resume_id`. By isolating metrics across section detection, keyword coverage, and formatting integrity, this table helps candidates detect structural flaws and hidden parsing barriers that could cause premature automated filtering by corporate HR systems.

---

### Table 3.13 : Job Description Match Description

| Attribute Name | Type | Constraint(s) | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key, Not Null, Unique | Unique identifier for the match computation record |
| `student_id` | ObjectId | Foreign Key, Not Null | Reference to the candidate student being evaluated |
| `resume_id` | ObjectId | Foreign Key, Not Null | Reference to the specific resume document compared |
| `job_id` | ObjectId | Foreign Key, Not Null | Reference to the targeted job requisition |
| `model_version` | String | Not Null | Version tag of the TF-IDF and semantic matching algorithms |
| `overall_score` | Float | Not Null | Continuous mathematical similarity score between resume and job (0.0 - 1.0) |
| `display_score` | Integer | Not Null | Normalized percentage alignment score for UI presentation (0-100) |
| `features` | Object | Not Null | Granular feature vector scores (skills, experience, education, projects) |
| `matched_skills` | Array[String] | - | Mandatory required skills present in both the resume and job listing |
| `partial_skills` | Array[String] | - | Semantically related or transferable skills detected by vector analysis |
| `missing_skills` | Array[String] | - | Job requirements not currently present in the candidate resume |
| `recommendations` | Array[String] | - | Actionable advice on tailoring resume content to match the target job |
| `created_at` | Date | Not Null | Timestamp when the match calculation was executed |

Table 3.13 represents the Job Description Match Description table used in the AI Resume Analyzer & Recruitment System. This table captures vector and keyword similarity comparisons between candidate resumes and specific job requirements produced by the platform's machine learning engine. The `_id` attribute uniquely identifies each matching computation record, while `resume_id` and `job_id` establish the comparison relationship. Attributes like `features`, `matched_skills`, and `missing_skills` give candidates a clear picture of their role fit while enabling recruiters to rank applicant pools based on objective qualification metrics.

---

### Table 3.14 : Skill Assessment Description

| Attribute Name | Type | Constraint(s) | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key, Not Null, Unique | Unique identifier for the assessment attempt record |
| `student_id` | ObjectId | Foreign Key, Not Null | Reference to the student undertaking the skill challenge |
| `assessment_id` | ObjectId | Foreign Key, Not Null | Identifier of the underlying standardized assessment test |
| `skill_name` | String | Not Null | Name of the verified technical skill (e.g., Python, React, SQL) |
| `category` | String | Not Null | Technical domain classification (e.g., Frontend, Backend, Database) |
| `difficulty` | String | Not Null, Default: 'medium' | Challenge difficulty level (`easy`, `medium`, `hard`) |
| `total_questions` | Integer | Not Null | Total number of questions presented during the test attempt |
| `correct_answers` | Integer | - | Total count of correctly answered questions |
| `score` | Integer | - | Final percentage score achieved by the candidate (0-100) |
| `passing_score` | Integer | Not Null, Default: 60 | Minimum passing score required to earn verified skill status |
| `passed` | Boolean | - | Boolean outcome indicating whether the student met the passing criteria |
| `time_taken_seconds` | Integer | - | Time consumed by the student to complete the test in seconds |
| `status` | String | Default: 'in_progress' | Attempt progress state (`in_progress`, `submitted`, `evaluated`) |
| `created_at` | Date | Not Null | Timestamp when the assessment attempt commenced |
| `submitted_at` | Date | - | Timestamp when the assessment was finalized and submitted |

Table 3.14 represents the Skill Assessment Description table used in the AI Resume Analyzer & Recruitment System. This table records candidate performance on standardized technical and situational skill quizzes, offering an objective benchmark for student competencies. The `_id` attribute provides a unique primary key for each test attempt, and `student_id` associates the evaluation with the learner. Fields such as `score`, `passing_score`, and `passed` validate whether a candidate has demonstrated the baseline proficiency needed to showcase verified skill badges on their student profile and job applications.

---

### Table 3.15 : Career Roadmap Description

| Attribute Name | Type | Constraint(s) | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key, Not Null, Unique | Unique identifier for the career roadmap record |
| `student_id` | ObjectId | Foreign Key, Not Null | Reference to the student user owner of the roadmap |
| `target_role` | String | Not Null | Career role aspiration guiding the learning path (e.g., Cloud Architect) |
| `progress` | Integer | Default: 0 | Overall percentage of roadmap milestone completion (0-100) |
| `timeframe_weeks` | Integer | - | Estimated duration in weeks required to complete all learning phases |
| `hours_per_week` | Integer | - | Dedicated weekly hours allocated by the student for roadmap study |
| `experience_level` | String | Default: 'beginner' | Baseline student proficiency level (`beginner`, `intermediate`, `advanced`) |
| `phases` | Array[Object] | Not Null | Hierarchical list of milestone phases, topic items, and completion statuses |
| `soft_skills` | Object | - | Soft skill ratings and development goals targeted alongside technical tasks |
| `created_at` | Date | Not Null | Timestamp when the personalized roadmap was generated |
| `updated_at` | Date | - | Timestamp when roadmap progress or phase completion was last updated |

Table 3.15 represents the Career Roadmap Description table used in the AI Resume Analyzer & Recruitment System. This table stores structured, AI-synthesized career roadmaps designed to help students bridge skill gaps between their current background and target job roles. The `_id` attribute uniquely identifies each roadmap entry, while `student_id` maps the plan to an individual student. The `phases` object breaks down the curriculum into chronological, trackable milestones, and the `progress` attribute tracks real-time progress, enabling candidates to stay focused on systematic placement preparation.
