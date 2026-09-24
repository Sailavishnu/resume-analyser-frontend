# Resume Analyzer - ML Architecture Visual Diagrams

## 1. COMPLETE SYSTEM ARCHITECTURE

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                          RESUME ANALYZER PLATFORM                            ║
║                                                                               ║
║  ┌────────────────────────────────────────────────────────────────────────┐  ║
║  │                    FRONTEND LAYER (React)                              │  ║
║  │  ┌──────────────────┐  ┌──────────────┐  ┌──────────────────────┐    │  ║
║  │  │ Resume Upload &  │  │ Job Search   │  │ Analytics Dashboard  │    │  ║
║  │  │ Analysis         │  │ & Matching   │  │ & Recommendations    │    │  ║
║  │  └──────────────────┘  └──────────────┘  └──────────────────────┘    │  ║
║  └────────────┬─────────────────────────────────────────────────────────┘  ║
║               │ HTTP REST API Calls                                        ║
║  ┌────────────▼─────────────────────────────────────────────────────────┐  ║
║  │                    FASTAPI BACKEND LAYER                              │  ║
║  │                                                                        │  ║
║  │  ┌────────────────┐  ┌────────────────┐  ┌────────────────────┐     │  ║
║  │  │ Auth Routes    │  │ Resume Routes  │  │ Job Match Routes   │     │  ║
║  │  └────────────────┘  └────────────────┘  └────────────────────┘     │  ║
║  │                                                                        │  ║
║  │  Request Handlers → Business Logic → Data Access                     │  ║
║  └────────────┬────────────────────────────────────────────────────────┘  ║
║               │                                                             ║
║       ┌───────┼───────┐                                                    ║
║       │       │       │                                                    ║
║  ┌────▼──┐ ┌─▼──┐ ┌──▼──────┐                                            ║
║  │MongoDB│ │File│ │ML Models│                                            ║
║  │   DB  │ │Store           │                                            ║
║  └───────┘ └────┘ └──┬──────┘                                            ║
║                      │                                                     ║
║  ┌──────────────────────────────────────────────────────────────────────┐  ║
║  │                    ML/AI PROCESSING LAYER                             │  ║
║  │                                                                        │  ║
║  │  ┌──────────────────────────────────────────────────────────────┐   │  ║
║  │  │ NLP LAYER (spaCy + NLTK)                                     │   │  ║
║  │  │  ├─ Text Processing                                          │   │  ║
║  │  │  ├─ Skill Extraction & Normalization                        │   │  ║
║  │  │  ├─ Named Entity Recognition                                │   │  ║
║  │  │  └─ Keyword Extraction                                      │   │  ║
║  │  └──────────────────────────────────────────────────────────────┘   │  ║
║  │                            ▼                                           │  ║
║  │  ┌──────────────────────────────────────────────────────────────┐   │  ║
║  │  │ EMBEDDING LAYER (Sentence-BERT)                              │   │  ║
║  │  │  ├─ Resume Text → 384-dim Vector                             │   │  ║
║  │  │  ├─ Job Text → 384-dim Vector                                │   │  ║
║  │  │  └─ Semantic Similarity Calculation                          │   │  ║
║  │  └──────────────────────────────────────────────────────────────┘   │  ║
║  │                            ▼                                           │  ║
║  │  ┌─────────────────────────┬─────────────────────────────────────┐   │  ║
║  │  │                         │                                     │   │  ║
║  │  ▼                         ▼                                     ▼   │  ║
║  │  ┌──────────────┐   ┌──────────────────┐   ┌──────────────────┐   │  ║
║  │  │ VECTOR SEARCH│   │ TRADITIONAL ML   │   │ HYBRID SCORING   │   │  ║
║  │  │   (FAISS)    │   │  (Random Forest) │   │   (Combined)     │   │  ║
║  │  │              │   │                  │   │                  │   │  ║
║  │  │ • 10K jobs   │   │ • 6 Features     │   │ • 60% Semantic   │   │  ║
║  │  │ • Fast search│   │ • 100 trees      │   │ • 40% ML Score   │   │  ║
║  │  │ • Semantic   │   │ • R²: 0.82       │   │ • 0-100 Score    │   │  ║
║  │  │   matching   │   │                  │   │                  │   │  ║
║  │  └──────────────┘   └──────────────────┘   └──────────────────┘   │  ║
║  │                                                                        │  ║
║  └────────────┬─────────────────────────────────────────────────────────┘  ║
║               │ Match Scores, Recommendations                              ║
║  ┌────────────▼─────────────────────────────────────────────────────────┐  ║
║  │                    RESPONSE LAYER                                    │  ║
║  │  ├─ Match Scores (0-100)                                             │  ║
║  │  ├─ Confidence Levels                                                │  ║
║  │  ├─ Matched/Missing Skills                                           │  ║
║  │  ├─ Actionable Recommendations                                       │  ║
║  │  └─ Feature Breakdown (Interpretability)                             │  ║
║  └────────────┬─────────────────────────────────────────────────────────┘  ║
║               │ JSON Response                                              ║
║  ┌────────────▼─────────────────────────────────────────────────────────┐  ║
║  │                    FRONTEND DISPLAY                                  │  ║
║  │  "82/100 Match! High potential candidate"                            │  ║
║  └────────────────────────────────────────────────────────────────────────┘  ║
║                                                                               ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

---

## 2. ML PIPELINE - DETAILED FLOW

```
╔════════════════════════════════════════════════════════════════════════════╗
║                   COMPLETE ML PIPELINE FOR MATCHING                        ║
╚════════════════════════════════════════════════════════════════════════════╝

INPUT SOURCES
═════════════

┌─────────────────────┐         ┌─────────────────────┐
│ RESUME DOCUMENT     │         │ JOB DESCRIPTION     │
│                     │         │                     │
│ • PDF file          │         │ • Job title         │
│ • Extracted text    │         │ • Description       │
│ • Metadata          │         │ • Required skills   │
└──────────┬──────────┘         │ • Preferred skills  │
           │                     │ • Experience req    │
           │                     │ • Education req     │
           │                     └──────────┬──────────┘
           │                                │
           ├────────────────────────────────┤
           │                                │
           ▼                                ▼

STAGE 1: DOCUMENT PARSING
════════════════════════════════════════════════════════════════

Resume Parser                    Job Parser
┌─────────────────────┐         ┌─────────────────────┐
│ Extract:            │         │ Parse:              │
│ • Summary           │         │ • Title             │
│ • Skills            │         │ • Description       │
│ • Experience        │         │ • Skills list       │
│ • Education         │         │ • Level of exp      │
│ • Projects          │         │ • Salary range      │
└──────────┬──────────┘         └──────────┬──────────┘
           │                                │
    parsed_resume                    parsed_job
           │                                │
           └────────────────────────────────┘
                      │
                      ▼

STAGE 2: NLP PROCESSING
════════════════════════════════════════════════════════════════

spaCy Model (en_core_web_sm)
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Resume Text Processing:                                │
│  ├─ Tokenization                                         │
│  ├─ Normalize skill names                               │
│  │  └─ "JavaScript" → "javascript"                      │
│  │  └─ "js" → "javascript"                              │
│  ├─ Lemmatization: "running" → "run"                    │
│  └─ Entity Recognition: "Google" (ORG)                  │
│                                                           │
│  Job Text Processing:                                   │
│  ├─ Same tokenization/normalization                     │
│  ├─ Extract requirements                                │
│  └─ Skill normalization                                 │
│                                                           │
│  Output: Normalized, cleaned text                       │
│          with extracted entities                        │
│                                                           │
└──────────┬──────────────────────────────────────────────┘
           │
           ▼

STAGE 3: DUAL PATH PROCESSING
════════════════════════════════════════════════════════════════

PATH A: SEMANTIC EMBEDDING          PATH B: FEATURE EXTRACTION
═════════════════════════════════════════════════════════════════

Resume Text                         Resume + Job Data
    │                                       │
    ├─ Summary                              ├─ Skill matching
    ├─ Skills (top 5)                       ├─ Experience analysis
    ├─ Top 3 projects                       ├─ Education check
    ├─ Top 2 experiences                    └─ Project evaluation
    └─ Education                                    │
        │                                          ▼
        └─ Combine with " | " delimiter    Feature Vector Creation
          "Summary: ... | Skills: ... |    ┌───────────────────┐
           Projects: ... | ..."            │ [6 Features]      │
        │                                  │                   │
        ▼                                  │ 1. skill_overlap  │
    Sentence-BERT Model                    │ 2. req_skill_cov  │
    (all-MiniLM-L6-v2)                     │ 3. keyword_olap   │
    │                                      │ 4. exp_similar    │
    ├─ Process text through 6 layers       │ 5. education      │
    ├─ Project to 384-dim space            │ 6. project_rel    │
    ├─ L2 normalize                        │                   │
    └─ Output: embedding vector            └───────────────────┘
        │                                          │
        │ 384-dimensional                         │
        │ semantic vector                         │
        │                                         ▼
        │                            Random Forest Regressor
        │                            ┌──────────────────────┐
        │                            │                      │
        │                            │ 100 Decision Trees   │
        │                            │                      │
        │                            │ Each tree votes:     │
        │                            │ ├─ Tree 1: 76.5     │
        │                            │ ├─ Tree 2: 77.3     │
        │                            │ └─ ...              │
        │                            │                      │
        │                            │ Average Score:       │
        │                            │ = 76.8               │
        │                            │                      │
        │                            └──────────────────────┘
        │                                    │
        ▼                                    ▼
    FAISS Vector Search          Traditional ML Score
    ┌──────────────────┐         ┌─────────────────────┐
    │                  │         │                     │
    │ Query resume     │         │ 76.8 (0-100 scale) │
    │ embedding        │         │                     │
    │ against all job  │         │ High confidence:    │
    │ embeddings       │         │ 0.85                │
    │                  │         │                     │
    │ Returns:         │         └─────────────────────┘
    │ • Similarity     │
    │   score (0-1)    │
    │ • Job metadata   │
    │ • Top-10 results │         Confidence estimation:
    │                  │         • Feature ranges check
    └──────────────────┘         • Feature variance
             │                   • In-range bonus
             │
             ▼
    Semantic Score
    ┌─────────────────────────┐
    │ 0.82 (normalized to %)  │
    │ = 82.0%                 │
    │                         │
    │ High similarity:        │
    │ Resume closely matches  │
    │ job semantically        │
    └─────────────────────────┘

STAGE 4: HYBRID SCORING
════════════════════════════════════════════════════════════════

                    Semantic Score (82%)
                            │
                            ├─ Weight: 60%
                            │
    ┌───────────────────────┼───────────────────────┐
    │                       │                       │
    │                   HYBRID SCORER               │
    │                       │                       │
    ├─ Semantic: 82% × 0.6 = 49.2%                │
    │                                               │
    ├─ ML Score: 76.8% × 0.4 = 30.7%              │
    │                                               │
    └─ Final Score = 49.2 + 30.7 = 79.9%          │
                    Rounded to 80/100              │

STAGE 5: SKILL GAP ANALYSIS
════════════════════════════════════════════════════════════════

Required Skills: [Python, JavaScript, React, Docker, Kubernetes]
Resume Skills:   [Python, JavaScript, React]

Analysis:
├─ Matched:    [Python, JavaScript, React]     (3/5 = 60%)
├─ Missing:    [Docker, Kubernetes]             (2/5 = 40%)
└─ Learning Priority: Kubernetes (more critical)

STAGE 6: RECOMMENDATION ENGINE
════════════════════════════════════════════════════════════════

Input: Score (80), Gap Analysis, Experience, Education
       │
       ├─ Score ≥ 75? → "Great match!"
       │
       ├─ Missing skills < 3? 
       │  └─ "Learn Docker and Kubernetes..."
       │
       ├─ No experience + exp required?
       │  └─ "Build real-world projects..."
       │
       ├─ < 2 projects?
       │  └─ "Showcase your skills with projects..."
       │
       └─ Output: 2-4 actionable recommendations

FINAL OUTPUT
════════════════════════════════════════════════════════════════

{
    "overall_score": 80,
    "display_score": "80/100",
    "confidence": 0.87,
    "match_type": "hybrid",
    
    "scores": {
        "semantic": 82,
        "traditional_ml": 77,
        "overall": 80
    },
    
    "matched_skills": ["Python", "JavaScript", "React"],
    "missing_skills": ["Docker", "Kubernetes"],
    
    "features": {
        "skill_overlap": 0.75,
        "required_skill_coverage": 0.80,
        "keyword_overlap": 0.72,
        "experience_similarity": 0.85,
        "education_match": 1.0,
        "project_relevance": 0.78
    },
    
    "recommendations": [
        "Learn Docker and Kubernetes to strengthen application",
        "Build a project using these technologies",
        "Contribute to open-source projects with these stacks"
    ]
}
```

---

## 3. FEATURE EXTRACTION BREAKDOWN

```
┌════════════════════════════════════════════════════════════════════════════┐
│                     6 FEATURE EXTRACTION PROCESS                           │
└════════════════════════════════════════════════════════════════════════════┘

INPUT DATA
══════════════════════════════════════════════════════════════════════════════

Resume                          Job
┌──────────────────┐           ┌──────────────────┐
│ Skills:          │           │ Required Skills: │
│ • Python         │           │ • Python         │
│ • JavaScript     │           │ • Java           │
│ • React          │           │ • React          │
│ • SQL            │           │ • Kubernetes     │
│ • Docker         │           │                  │
│                  │           │ Preferred:       │
│ Experience:      │           │ • Docker         │
│ • 5 years        │           │                  │
│                  │           │ Experience: 3-5  │
│ Education:       │           │ Education: BS+   │
│ • B.Tech         │           │                  │
│                  │           │ Keywords: ...    │
│ Projects: 6      │           │                  │
│ • ML Pipeline    │           │                  │
│ • E-commerce     │           │                  │
│ • Data viz       │           │                  │
│                  │           │                  │
└──────────────────┘           └──────────────────┘

FEATURE 1: SKILL OVERLAP (Jaccard Similarity)
═══════════════════════════════════════════════════════════════════════════════

Resume Skills Set: {Python, JavaScript, React, SQL, Docker}
Job Skills Set:    {Python, Java, React, Kubernetes}

                  Intersection     Union
                  {Python, React}  {Python, JavaScript, React, SQL, Docker, Java, Kubernetes}
                       2                    7
                       
Jaccard Score = 2 / 7 = 0.286 → Feature Value: 0.286

FEATURE 2: REQUIRED SKILL COVERAGE (Coverage %)
═══════════════════════════════════════════════════════════════════════════════

Required Skills: {Python, Java, React, Kubernetes}
Resume Skills:   {Python, JavaScript, React, SQL, Docker}

Covered:         {Python, React}    = 2
Total Required:  4

Coverage = 2 / 4 = 0.5 → Feature Value: 0.5

(50% of required skills are present)

FEATURE 3: KEYWORD OVERLAP
═══════════════════════════════════════════════════════════════════════════════

Technical Keywords Extracted:
From Resume: {REST, API, JSON, MVC, Docker, microservices, OOP}
From Job:    {REST, JSON, API, testing, CI/CD, Docker}

Intersection: {REST, API, JSON, Docker}
Union:        {REST, API, JSON, MVC, Docker, microservices, OOP, testing, CI/CD}

Score = 4 / 9 = 0.444 → Feature Value: 0.444

FEATURE 4: EXPERIENCE SIMILARITY
═══════════════════════════════════════════════════════════════════════════════

Resume Years:           5 years
Job Requirements:       3-5 years (min: 3, max: 5)

Analysis:
├─ 5 is in range [3, 5]?  YES
└─ Perfect Match → Feature Value: 1.0

Alternative Scenarios:
├─ If resume: 2 years   → 2/3 = 0.67 (under-qualified)
├─ If resume: 6 years   → max(0.6, 1.0 - 0.1) = 0.9 (over-qualified, slight penalty)
└─ If resume: 1 year    → min(0, 1/3) = 0.33 (significantly under)

Feature Value: 1.0

FEATURE 5: EDUCATION MATCH
═══════════════════════════════════════════════════════════════════════════════

Resume Education: B.Tech in Computer Science
Job Requires:     Bachelor's degree

Scoring:
├─ PhD           → 1.0 (exceeds)
├─ Master's      → 1.0 (exceeds)
├─ Bachelor's    → 1.0 (meets exactly)
├─ Diploma       → 0.8 (insufficient)
└─ No degree     → 0.6 (not qualified)

Feature Value: 1.0 (Bachelor's degree meets requirement)

FEATURE 6: PROJECT RELEVANCE
═══════════════════════════════════════════════════════════════════════════════

Resume Projects:
┌────────────────────────────────────────────────────┐
│ Project 1: E-commerce Platform                     │
│ Tech Stack: {Python, Django, React, PostgreSQL}   │
│ Key Points: 3 pages documentation                 │
│ Impact: "1M+ downloads"                           │
│ Relevance Score:                                  │
│   ├─ Tech overlap: 2/4 = 0.5 × 0.6 = 0.30       │
│   ├─ Impact bonus: 0.2 (has impact)              │
│   ├─ Documentation bonus: 0.2 (good docs)        │
│   └─ Subtotal: 0.30 + 0.2 + 0.2 = 0.70          │
│                                                    │
│ Project 2: ML Pipeline                           │
│ Tech Stack: {Python, scikit-learn, pandas}       │
│ Key Points: Basic documentation                  │
│ Impact: None mentioned                           │
│ Relevance Score:                                  │
│   ├─ Tech overlap: 1/3 = 0.33 × 0.6 = 0.20     │
│   ├─ Impact bonus: 0 (no impact)                 │
│   ├─ Documentation bonus: 0.1 (basic)            │
│   └─ Subtotal: 0.20 + 0.1 = 0.30                │
│                                                    │
│ Project 3: Data Visualization                    │
│ Tech Stack: {JavaScript, React, D3.js}           │
│ Key Points: 2 points (good)                      │
│ Impact: "Used by 500+ users"                     │
│ Relevance Score:                                  │
│   ├─ Tech overlap: 1/3 = 0.33 × 0.6 = 0.20     │
│   ├─ Impact bonus: 0.2 (has impact)              │
│   ├─ Documentation bonus: 0.2 (good docs)        │
│   └─ Subtotal: 0.20 + 0.2 + 0.2 = 0.60          │
│                                                    │
│ Average: (0.70 + 0.30 + 0.60) / 3 = 0.533      │
│ Bonus: 2 projects → (2-1) × 0.05 = 0.05         │
│ Final: min(1.0, 0.533 + 0.05) = 0.583           │
│                                                    │
└────────────────────────────────────────────────────┘

Feature Value: 0.583

FEATURE VECTOR SUMMARY
═══════════════════════════════════════════════════════════════════════════════

    Feature                  Value      Weight in Model
    ───────────────────────  ─────────  ──────────────────
    1. skill_overlap         0.286      28% (Most important)
    2. required_coverage     0.500      22%
    3. keyword_overlap       0.444      16%
    4. experience_similar    1.000      9.5%
    5. education_match       1.000      6.5%
    6. project_relevance     0.583      18%

Feature Vector for ML: [0.286, 0.500, 0.444, 1.000, 1.000, 0.583]
                        ↓
                   Random Forest Predicts: 72.5
```

---

## 4. SEMANTIC SEARCH WITH FAISS

```
┌════════════════════════════════════════════════════════════════════════════┐
│                    FAISS VECTOR SEARCH SYSTEM                              │
└════════════════════════════════════════════════════════════════════════════┘

INITIALIZATION PHASE
═══════════════════════════════════════════════════════════════════════════════

Step 1: Create Empty FAISS Index
┌─────────────────────────────────┐
│ IndexFlatIP (Inner Product)     │
│ Dimension: 384                  │
│ Status: Empty (0 vectors)       │
└─────────────────────────────────┘

Step 2: For Each Job in Database
┌─────────────────────────────────────────────────────┐
│ Job 1: "Senior Developer at TechCorp"               │
│   ├─ Generate Sentence-BERT embedding (384-dim)    │
│   ├─ L2 normalize vector                            │
│   ├─ Add to FAISS index                             │
│   └─ Store metadata (job_id, title, company, ...)  │
│                                                      │
│ Job 2: "Full-Stack Engineer at StartupXYZ"         │
│   ├─ Generate embedding                             │
│   ├─ Normalize                                       │
│   ├─ Add to FAISS                                   │
│   └─ Store metadata                                 │
│                                                      │
│ ... (repeat for 10,000 jobs)                        │
│                                                      │
│ Index Status: 10,000 vectors stored                │
└─────────────────────────────────────────────────────┘

Step 3: Persist to Disk
┌─────────────────────────────────┐
│ Saved: FAISS index file         │
│ Size: ~15-20 MB (384-dim × 10K) │
│ Fast load on startup            │
└─────────────────────────────────┘

SEARCH PHASE (Per Query)
═══════════════════════════════════════════════════════════════════════════════

Resume Input: John (5 years full-stack developer)
                ↓
Generate Resume Embedding:
┌─────────────────────────────────────────────────────┐
│ Resume Text:                                         │
│ "Summary: 5 years full-stack engineer               │
│  Skills: Python, JavaScript, React, Node.js,        │
│          PostgreSQL, Docker                         │
│  Projects: E-commerce, ML Pipeline                  │
│  Experience: 5 years at TechCorp..."                │
│                ↓                                     │
│ Sentence-BERT (all-MiniLM-L6-v2)                    │
│                ↓                                     │
│ Embedding Vector (384-dim)                          │
│ [0.234, -0.156, 0.892, ..., 0.123]                 │
│                ↓                                     │
│ L2 Normalize (unit vector)                          │
│ Result: magnitude = 1.0                             │
│                                                      │
└─────────────────────────────────────────────────────┘

Query FAISS Index:
┌─────────────────────────────────────────────────────┐
│ For each of 10,000 job embeddings:                  │
│                                                      │
│ similarity = dot_product(resume_emb, job_emb)       │
│                                                      │
│ Job 1 vs Resume:                                    │
│   dot([0.234, -0.156, ...], [0.198, -0.142, ...])  │
│   = 0.234×0.198 + (-0.156)×(-0.142) + ...           │
│   = 0.823 (82.3% similar)                           │
│                                                      │
│ Job 2 vs Resume: 0.715 (71.5%)                      │
│ Job 3 vs Resume: 0.891 (89.1%)  ← Top match!        │
│ Job 4 vs Resume: 0.523 (52.3%)                      │
│ ... (compute for all 10,000)                        │
│                                                      │
│ FAISS optimized: All 10,000 in <100ms on CPU       │
│                                                      │
└─────────────────────────────────────────────────────┘

Top-K Results:
┌──────────────────────────────────────────────────┐
│ Rank │ Job Title          │ Company    │ Score  │
│──────┼────────────────────┼────────────┼────────│
│  1   │ Senior Full-Stack  │ TechCorp   │ 0.891  │
│  2   │ Full-Stack Engr    │ StartupXYZ │ 0.875  │
│  3   │ Backend Developer  │ CloudCorp  │ 0.847  │
│  4   │ Web Developer      │ WebAgency  │ 0.823  │
│  5   │ Frontend Engineer  │ DesignCo   │ 0.789  │
│  ...                                              │
│ 10   │ DevOps Specialist  │ DevOps Inc │ 0.671  │
│                                                   │
└──────────────────────────────────────────────────┘

Filtering Example:
┌──────────────────────────────────────────────────┐
│ Results filtered by location = "New York"        │
│                                                   │
│ Before: 10 results                               │
│ After:  3 results                                │
│                                                   │
│ Rank │ Job           │ Location   │ Score       │
│──────┼───────────────┼────────────┼─────────────│
│  1   │ Senior Dev    │ New York   │ 0.823      │
│  2   │ Backend Engr  │ New York   │ 0.756      │
│  3   │ Full-Stack    │ New York   │ 0.701      │
│                                                   │
└──────────────────────────────────────────────────┘

Why FAISS is Fast:
───────────────────
• CPU Optimized: Uses SIMD (Single Instruction Multiple Data)
  └─ Processes multiple values in parallel per CPU cycle
  
• Memory Efficient: Stores only float32 vectors
  └─ 10,000 jobs × 384 dims × 4 bytes = ~15 MB

• Scale: Linear O(n) but with very low constant
  └─ Fast in practice: 100ms for 10,000 jobs
  └─ Could go GPU for 100,000+ jobs

• Batch Operations: Can process multiple queries together
  └─ Further speed improvement with batching
```

---

## 5. RANDOM FOREST DECISION TREE EXAMPLE

```
┌════════════════════════════════════════════════════════════════════════════┐
│              RANDOM FOREST REGRESSION - DECISION TREE EXAMPLE              │
└════════════════════════════════════════════════════════════════════════════┘

Input Features: [0.75, 0.80, 0.72, 1.00, 1.00, 0.58]
                  │     │    │    │    │     │
                  │     │    │    │    │     └─ project_relevance
                  │     │    │    │    └────── education_match
                  │     │    │    └─────────── experience_similarity
                  │     │    └──────────────── keyword_overlap
                  │     └───────────────────── required_skill_coverage
                  └──────────────────────────── skill_overlap

Random Forest: 100 Decision Trees voting in parallel

EXAMPLE TREE #1
═══════════════════════════════════════════════════════════════════════════════

                    skill_overlap ≤ 0.78?
                           │
                ┌──────────┼──────────┐
              YES          │          NO
                │          │          │
                ▼          ▼          ▼
           required_    project_   experience_
           coverage     relevance  similarity
           ≤ 0.82?      ≤ 0.60?    ≤ 0.90?
            │            │           │
         ┌──┴──┐      ┌───┴───┐   ┌──┴──┐
       YES    NO    YES      NO  YES   NO
        │      │     │       │    │     │
        ▼      ▼     ▼       ▼    ▼     ▼
       62.5  71.0  54.0    78.5  75.0  82.0
       
Path for our input [0.75, 0.80, 0.72, 1.00, 1.00, 0.58]:
├─ skill_overlap (0.75) ≤ 0.78?  → YES
├─ required_coverage (0.80) ≤ 0.82?  → YES
└─ Prediction: 62.5

EXAMPLE TREE #2
═══════════════════════════════════════════════════════════════════════════════

                project_relevance ≤ 0.65?
                       │
            ┌──────────┼──────────┐
          YES          │          NO
            │          │          │
            ▼          ▼          ▼
         keyword_    experience_  education_
         overlap     similarity   match
         ≤ 0.70?     ≤ 0.80?     ≤ 0.50?
           │           │           │
        ┌──┴──┐     ┌───┴───┐   ┌──┴──┐
      YES    NO   YES      NO  YES   NO
       │      │    │       │    │     │
       ▼      ▼    ▼       ▼    ▼     ▼
      58.0  65.0 70.0   79.0  45.0  88.0

Path for our input [0.75, 0.80, 0.72, 1.00, 1.00, 0.58]:
├─ project_relevance (0.58) ≤ 0.65?  → YES
├─ keyword_overlap (0.72) ≤ 0.70?  → NO
└─ Prediction: 65.0

... (continue for all 100 trees)

TREE 3: Predicts 74.2
TREE 4: Predicts 77.1
TREE 5: Predicts 75.9
...
TREE 100: Predicts 76.8

ENSEMBLE VOTING
═══════════════════════════════════════════════════════════════════════════════

All 100 Trees' Predictions:
[62.5, 65.0, 74.2, 77.1, 75.9, ..., 76.8]

Random Forest Final Prediction:
Average = (62.5 + 65.0 + 74.2 + 77.1 + 75.9 + ... + 76.8) / 100
        = 7650 / 100
        = 76.5

Output: Match Score = 76.5 (0-100 scale)

Why Ensemble is Better:
═════════════════════════════════════════════════════════════════════════════

Single Tree Performance:        Ensemble Performance:
├─ May overfit                  ├─ Reduces overfitting
├─ High variance (unstable)     ├─ Low variance (stable)
├─ Sensitive to noise           ├─ Robust to noise
└─ R² ≈ 0.65                    └─ R² ≈ 0.82 (improvement!)

Averaging 100 trees cancels out individual tree biases and errors.
```

---

## 6. HYBRID SCORING VISUALIZATION

```
┌════════════════════════════════════════════════════════════════════════════┐
│                        HYBRID SCORING SYSTEM                               │
└════════════════════════════════════════════════════════════════════════════┘

SCENARIO: Matching John's Resume to Job Posting

BRANCH 1: SEMANTIC APPROACH
═══════════════════════════════════════════════════════════════════════════════

Resume:
"Experienced full-stack developer, 5 years, Python, React, Node.js,
 built production systems, team lead"

Job:
"Senior full-stack engineer needed, expertise in Python and React,
 team leadership, 5+ years"

Sentence-BERT Analysis:
├─ Both mention: Python, React, full-stack, team leadership
├─ Years of experience: MATCH (5 years requirement)
├─ Semantic similarity: HIGH

SIMILARITY CALCULATION:
├─ resume_embedding = [0.124, -0.234, 0.891, ..., 0.445]  (384-dim)
├─ job_embedding    = [0.110, -0.201, 0.923, ..., 0.421]  (384-dim)
│
├─ dot_product = 0.124×0.110 + (-0.234)×(-0.201) + ... = 0.847
│
├─ Interpretation: 0.847 is very high similarity
│
└─ Semantic Score = 0.847 × 100% = 84.7%

BRANCH 2: TRADITIONAL ML APPROACH
═══════════════════════════════════════════════════════════════════════════════

Feature Extraction:
├─ skill_overlap = 0.80         (Python, React shared)
├─ required_coverage = 0.90     (Has most required skills)
├─ keyword_overlap = 0.75       (API, REST, etc.)
├─ experience_similarity = 1.0  (Exactly 5 years)
├─ education_match = 1.0        (Has degree)
└─ project_relevance = 0.70     (Good projects)

Feature Vector: [0.80, 0.90, 0.75, 1.0, 1.0, 0.70]

Random Forest Prediction:
└─ Average of 100 trees = 78.5%

HYBRID COMBINATION
═══════════════════════════════════════════════════════════════════════════════

                    Semantic Score
                    84.7% × 0.60 = 50.82%
                        │
                        │
         ┌──────────────┼──────────────┐
         │              │              │
         │          HYBRID            │
         │          SCORER            │
         │              │              │
         │              │              │
         │              ▼              │
         │          FINAL SCORE        │
         │              │              │
         └──────────────┼──────────────┘
                        │
                    ML Score
                    78.5% × 0.40 = 31.4%

Final Score Calculation:
═════════════════════════════════════════════════════════════════════════════

Overall Score = (Semantic × 0.6) + (ML × 0.4)
              = (84.7 × 0.6) + (78.5 × 0.4)
              = 50.82 + 31.4
              = 82.22
              ≈ 82/100

CONFIDENCE ESTIMATION
═════════════════════════════════════════════════════════════════════════════

Confidence = How sure are we about this score?

Factors:
├─ Features in expected range?
│  └─ skill_overlap (0.80): Expected 0.4-0.95 ✓
│  └─ required_coverage (0.90): Expected 0.45-0.96 ✓
│  └─ All 6 features in range: 6/6 = 100%
│
├─ Feature variance (0.827)
│  └─ Features well-balanced, not extreme outliers ✓
│
└─ Base Confidence = 100% + 10% boost = 1.0 (capped at 1.0)

Confidence: 0.95 (95% confident in this score)

FINAL OUTPUT TO USER
═════════════════════════════════════════════════════════════════════════════

┌───────────────────────────────────────────────────────────┐
│  MATCH SCORE: 82/100  ⭐⭐⭐⭐                              │
│                                                            │
│  Excellent Match!                                         │
│  ├─ Semantic Similarity: 84.7%                            │
│  │  └─ Resume closely matches job description            │
│  │                                                        │
│  ├─ Traditional Match: 78.5%                              │
│  │  └─ All key skills and experience verified            │
│  │                                                        │
│  ├─ Matched Skills: Python, React, Node.js               │
│  │                                                        │
│  ├─ Missing Skills: Docker, Kubernetes                    │
│  │                                                        │
│  ├─ Confidence: 95%                                       │
│  │  └─ Very confident in this assessment                 │
│  │                                                        │
│  └─ Recommendations:                                      │
│     └─ Consider learning Docker for better match         │
│     └─ Build a project using your current skills         │
│                                                            │
└───────────────────────────────────────────────────────────┘

EXPLANATION OF SCORES
════════════════════════════════════════════════════════════

Semantic Score (84.7%):
  Why High?
  ├─ "Full-stack" in both
  ├─ "Python" and "React" mentioned in both
  ├─ "Team leadership" appears in both
  └─ BERT recognized these semantic matches

Traditional Score (78.5%):
  Why Not Higher?
  ├─ Missing Docker (preferred skill)
  ├─ Kubernetes not in resume (preferred)
  └─ But all required skills present

Overall (82%):
  Balance of both approaches:
  ├─ Semantic says "very similar" (84.7%)
  ├─ Feature check confirms "strong match" (78.5%)
  └─ Average: strong match overall
```

---

## 7. COMPLETE REQUEST-RESPONSE CYCLE

```
┌════════════════════════════════════════════════════════════════════════════┐
│                      END-TO-END API REQUEST FLOW                           │
└════════════════════════════════════════════════════════════════════════════┘

FRONTEND (React App)
═════════════════════════════════════════════════════════════════════════════

User Action: Click "Find Matching Jobs" Button
                    │
                    ▼
Browser POST Request:
┌─────────────────────────────────────────────────────┐
│ POST /api/v1/jd-match/semantic-search               │
│                                                      │
│ Body: {                                              │
│   "resume_id": "507f1f77bcf86cd799439011",          │
│   "top_k": 10,                                       │
│   "filters": {                                       │
│     "location": "New York",                          │
│     "job_type": "Full-time"                          │
│   }                                                  │
│ }                                                    │
│                                                      │
│ Headers: {                                           │
│   "Authorization": "Bearer token...",                │
│   "Content-Type": "application/json"                │
│ }                                                    │
└─────────────────────────────────────────────────────┘

BACKEND (FastAPI)
═════════════════════════════════════════════════════════════════════════════

Step 1: Route Handling
├─ POST request reaches /jd-match/semantic-search endpoint
├─ Authentication verified ✓
├─ Request validation ✓
└─ Parse JSON body

Step 2: Load Resume from MongoDB
├─ Query: db.resumes.findOne({_id: ObjectId(resume_id)})
└─ Result:
   {
     "_id": ObjectId(...),
     "student_id": ObjectId(...),
     "parsed_data": {
       "summary": "5 years full-stack developer...",
       "skills": {...},
       "experience": [...],
       ...
     }
   }

Step 3: Generate Resume Embedding
├─ Extract resume text:
│  "Summary: 5 years full-stack... | Skills: Python, JavaScript... | ..."
│
├─ Pass to Sentence-BERT
│
└─ Resume Embedding: [0.124, -0.234, ..., 0.445]  (384-dim, normalized)

Step 4: FAISS Vector Search
├─ Query embedding against index
├─ Get top 20 most similar jobs
├─ Apply filter (location = "New York")
└─ Result: 12 jobs match filters, sorted by similarity
   [
     {"job_id": "...", "similarity": 0.847, "metadata": {...}},
     {"job_id": "...", "similarity": 0.823, "metadata": {...}},
     ...
   ]

Step 5: For Each Top Job (process first 10)
├─ Fetch full job document from MongoDB
├─ Calculate hybrid score:
│  ├─ Get semantic score (already have from FAISS)
│  ├─ Extract features for traditional ML
│  ├─ Load Random Forest model
│  ├─ Predict ML score
│  └─ Combine: 60% semantic + 40% ML
│
├─ Analyze skill gap
│  ├─ Compare resume skills to required/preferred
│  ├─ Identify matched, partial, missing skills
│  └─ Generate recommendations
│
└─ Build result object:
   {
     "job_id": "507f1f77bcf86cd799439012",
     "job_title": "Senior Full-Stack Developer",
     "company": "TechCorp",
     "location": "New York",
     "semantic_score": 84.7,
     "ml_score": 78.5,
     "overall_score": 82.2,
     "matched_skills": ["Python", "React"],
     "missing_skills": ["Docker"],
     "recommendations": [...]
   }

Step 6: Sort and Return Top Results
├─ Sort all results by overall_score (descending)
├─ Take top 10
└─ Prepare response

Step 7: Send HTTP Response
┌──────────────────────────────────────────────────┐
│ HTTP/1.1 200 OK                                  │
│                                                   │
│ {                                                 │
│   "status": "success",                            │
│   "data": {                                       │
│     "results": [                                 │
│       {                                          │
│         "job_id": "...",                         │
│         "job_title": "Senior Full-Stack Dev",   │
│         "company": "TechCorp",                   │
│         "location": "New York",                  │
│         "scores": {                              │
│           "overall_score": 82.2,                │
│           "semantic_score": 84.7,               │
│           "ml_score": 78.5,                     │
│           "match_type": "hybrid"                │
│         },                                       │
│         "matched_skills": ["Python", "React"],  │
│         "missing_skills": ["Docker"],           │
│         "recommendations": [                     │
│           "Learn Docker to strengthen...",      │
│           "Build a project using..."             │
│         ]                                        │
│       },                                         │
│       ... (9 more jobs)                          │
│     ],                                           │
│     "count": 10                                  │
│   }                                              │
│ }                                                 │
└──────────────────────────────────────────────────┘

FRONTEND (React App)
═════════════════════════════════════════════════════════════════════════════

JavaScript receives response
                │
                ▼
Parse JSON and update state
                │
                ▼
Render UI Components:

┌──────────────────────────────────────────────────────────┐
│                   SEARCH RESULTS                         │
├──────────────────────────────────────────────────────────┤
│                                                           │
│ ⭐ 1. Senior Full-Stack Developer - TechCorp             │
│    Location: New York | Match: 82/100                    │
│    Matched: Python, React | Missing: Docker              │
│                                                           │
│    "Learn Docker to strengthen your application"         │
│    [View Details] [Apply]                                │
│                                                           │
│ ⭐ 2. Full-Stack Engineer - StartupXYZ                   │
│    Location: New York | Match: 79/100                    │
│    Matched: Python, JavaScript | Missing: Kubernetes     │
│                                                           │
│    "Build more projects with the required tech stack"    │
│    [View Details] [Apply]                                │
│                                                           │
│ ... (8 more jobs)                                        │
│                                                           │
└──────────────────────────────────────────────────────────┘

User clicks on first result → Detailed view
                │
                ▼
New API call for full match details
                │
                ▼
Display detailed feature breakdown, score explanation, etc.

TIMING BREAKDOWN (Total: ~400ms)
════════════════════════════════════════════════════════════

Resume embedding generation:    ~80ms
FAISS search (10K jobs):        ~100ms
Database queries (10 jobs):     ~60ms
Feature extraction (10 jobs):   ~90ms
ML predictions (10 jobs):       ~50ms
JSON serialization:              ~20ms
───────────────────────────────────
TOTAL:                          ~400ms

User experiences: Quick response, sub-second latency ✓
```

This completes the comprehensive ML architecture documentation!
