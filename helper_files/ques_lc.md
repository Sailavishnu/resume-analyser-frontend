Yep. Let's map the **complete end-to-end workflow** of your LeetCode-style compiler environment, from the moment an admin creates a question to the moment a student gets **Accepted / Wrong Answer / Runtime Error**.

## 1. Overall Architecture

```text
                    ┌──────────────────────┐
                    │      STUDENT         │
                    │                      │
                    │  Select Problem      │
                    │  Select Language     │
                    │  Write Code          │
                    │  Run / Submit        │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │    REACT FRONTEND    │
                    │                      │
                    │ Monaco Code Editor   │
                    │ Problem Interface    │
                    │ Test Case Interface  │
                    └──────────┬───────────┘
                               │
                        HTTP / REST API
                               │
                               ▼
                    ┌──────────────────────┐
                    │    FASTAPI SERVER    │
                    │                      │
                    │ Authentication       │
                    │ Problem Management   │
                    │ Submission Handling  │
                    │ Result Processing    │
                    └──────────┬───────────┘
                               │
                     Create execution job
                               │
                               ▼
                    ┌──────────────────────┐
                    │   EXECUTION SERVICE  │
                    │                      │
                    │ Docker Sandbox       │
                    │ C++ Environment      │
                    │ Java Environment     │
                    │ Python Environment   │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │    TEST RUNNER       │
                    │                      │
                    │ Input → Program      │
                    │ Output → Expected    │
                    │ Compare              │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │      RESULT          │
                    │                      │
                    │ Accepted             │
                    │ Wrong Answer         │
                    │ Compilation Error    │
                    │ Runtime Error        │
                    │ Time Limit Exceeded  │
                    └──────────────────────┘
```

---

# 2. Admin Creates the Problem

Before students can solve anything, **Admin** creates predefined coding questions.

Example:

```text
Problem ID: P001

Title:
Two Sum

Description:
Given an array of integers and a target,
return the indices of two numbers that add up
to the target.

Difficulty:
Easy

Category:
Arrays

Languages:
C++
Java
Python 3
```

Admin also defines:

### Visible test cases

```text
Input:
5
2 7 11 15 3
9

Expected Output:
0 1
```

### Hidden test cases

```text
Input:
4
1 5 8 10
13

Expected Output:
1 2
```

Students **don't receive the hidden test cases**.

---

# 3. Problem Stored in MongoDB

Your database could conceptually look like:

```text
problems
│
├── problemId
├── title
├── description
├── difficulty
├── category
├── constraints
├── starterCode
│
├── visibleTestCases
│     ├── input
│     └── expectedOutput
│
└── hiddenTestCases
      ├── input
      └── expectedOutput
```

You can also store:

```text
timeLimit
memoryLimit
supportedLanguages
```

---

# 4. Student Opens Coding Page

Student goes to:

```text
Placement Preparation
        ↓
Coding Practice
        ↓
Two Sum
```

Frontend requests:

```text
GET /api/problems/P001
```

FastAPI retrieves the problem from MongoDB.

It sends back:

```text
Problem
Description
Constraints
Examples
Starter Code
Supported Languages
```

**It does NOT send hidden test cases.**

---

# 5. Frontend Displays Coding Environment

The page contains two major sections.

```text
┌─────────────────────────────────────────────────────┐
│                    Coding Problem                   │
├──────────────────────┬──────────────────────────────┤
│                      │ Language: C++ ▼              │
│ Problem description  │                              │
│                      │ Monaco Editor                │
│ Examples             │                              │
│                      │ #include <bits/stdc++.h>    │
│ Constraints           │                              │
│                      │ int main() {                 │
│                      │     ...                      │
│                      │ }                            │
│                      │                              │
│                      │ [Run]       [Submit]         │
└──────────────────────┴──────────────────────────────┘
```

The student selects:

```text
C++
Java
Python 3
```

The starter code changes according to the language.

---

# 6. Student Writes Code

Suppose they write:

```text
C++

#include <bits/stdc++.h>
using namespace std;

int main() {

    // student's solution

}
```

The code stays inside the Monaco editor.

The frontend does **not compile it**.

It sends the code to your backend.

---

# 7. Student Clicks `Run`

This is an important distinction.

### Run

Usually tests against **sample/visible test cases**.

### Submit

Tests against **all test cases**, including hidden ones.

So:

```text
RUN
 ↓
Visible Tests
```

while:

```text
SUBMIT
 ↓
Visible Tests
+
Hidden Tests
```

---

# 8. Frontend Sends Request

For example:

```text
POST /api/code/run
```

Request contains:

```text
{
    problemId: "P001",
    language: "cpp",
    sourceCode: "student code..."
}
```

For Submit:

```text
POST /api/code/submit
```

Same basic information.

---

# 9. FastAPI Receives Submission

FastAPI first validates:

```text
Is user authenticated?
        ↓
Is problem valid?
        ↓
Is language supported?
        ↓
Is source code present?
        ↓
Is code size within limit?
```

If everything is okay:

```text
Create execution job
```

---

# 10. Execution Service Takes Over

This is where the interesting stuff happens.

FastAPI should **not directly execute arbitrary student code on the main server**.

Instead:

```text
FastAPI
   │
   ▼
Execution Service
   │
   ▼
Docker Container
```

A temporary container is created.

For example:

```text
Submission #9281

┌─────────────────────────────┐
│ Docker Sandbox              │
│                             │
│ student.cpp                 │
│ compiler: g++               │
│ input.txt                   │
│                             │
│ CPU limit                   │
│ Memory limit                │
│ Time limit                  │
│ Network disabled            │
└─────────────────────────────┘
```

---

# 11. Language Determines Environment

The execution service determines what to run.

### C++

```text
student.cpp
     ↓
g++
     ↓
student executable
     ↓
execute
```

### Java

```text
Main.java
     ↓
javac
     ↓
Main.class
     ↓
java Main
```

### Python

```text
main.py
     ↓
python3
```

The student doesn't need to know any of this.

From their perspective:

```text
Write code → Run
```

---

# 12. Compilation Happens

For C++:

```text
g++ student.cpp -o program
```

If compilation fails:

```text
Compilation Error
```

The execution stops.

Frontend receives something like:

```text
{
    status: "COMPILATION_ERROR",
    error: "expected ';' before '}'"
}
```

Frontend displays:

```text
❌ Compilation Error

main.cpp:12:
expected ';' before '}'
```

---

# 13. If Compilation Succeeds

Now the program is executed against the test cases.

For example:

```text
Test Case 1
     ↓
Input
     ↓
Student Program
     ↓
Output
     ↓
Compare Expected Output
```

Then:

```text
Test Case 2
     ↓
Input
     ↓
Student Program
     ↓
Output
     ↓
Compare
```

And so on.

---

# 14. Test Case Engine

Suppose:

```text
Input:

5
2 7 11 15 3
9
```

Expected:

```text
0 1
```

Student program produces:

```text
0 1
```

Comparison:

```text
Expected == Actual
        ↓
       YES
        ↓
     PASSED
```

---

# 15. Wrong Answer

Suppose the expected result is:

```text
0 1
```

but student program produces:

```text
1 2
```

Then:

```text
Expected:
0 1

Actual:
1 2

        ↓

❌ Wrong Answer
```

---

# 16. Runtime Error

Suppose student writes:

```text
int x = 10 / 0;
```

or accesses invalid memory.

The program crashes.

Execution service detects the non-zero exit/crash.

Result:

```text
⚠ Runtime Error
```

---

# 17. Infinite Loop

Student writes:

```text
while(true) {
}
```

Your sandbox has a time limit.

For example:

```text
Time Limit = 2 seconds
```

After 2 seconds:

```text
Process killed
       ↓
Time Limit Exceeded
```

This is **very important** for an online judge.

---

# 18. Memory Abuse

Suppose someone tries to allocate ridiculous amounts of memory.

Docker/container limits prevent the process from consuming the entire server.

For example:

```text
Memory Limit = 256 MB
```

If exceeded:

```text
Memory Limit Exceeded
```

---

# 19. Hidden Test Cases

Now comes the actual "LeetCode" part.

Suppose you have:

```text
Visible:
3 test cases

Hidden:
17 test cases
```

Student sees:

```text
3 visible cases
```

But Submit runs:

```text
3 visible
+
17 hidden
=
20 total
```

The hidden inputs remain inside the backend/execution environment.

The response should **not return them to the browser**.

---

# 20. Final Evaluation

Suppose:

```text
Test 1 ✓
Test 2 ✓
Test 3 ✓
Test 4 ✓
Test 5 ✓
Test 6 ✗
```

Then:

```text
5 / 6 Test Cases Passed

Result:
Wrong Answer
```

If everything passes:

```text
20 / 20 Test Cases Passed

✓ Accepted
```

---

# 21. Result Sent Back to React

FastAPI returns something like:

```text
{
    status: "ACCEPTED",
    passed: 20,
    total: 20,
    executionTime: 0.18,
    memory: 32,
    language: "cpp"
}
```

React displays:

```text
┌────────────────────────────────────┐
│            ✓ ACCEPTED              │
│                                    │
│         20 / 20 Passed             │
│                                    │
│  Runtime: 0.18 sec                 │
│  Memory: 32 MB                     │
│  Language: C++                     │
└────────────────────────────────────┘
```

---

# 22. Submission Gets Stored

You should also save the submission.

Something like:

```text
submissions
│
├── userId
├── problemId
├── language
├── sourceCode
├── status
├── passedTests
├── totalTests
├── executionTime
├── memoryUsed
└── submittedAt
```

Then students can have:

```text
My Submissions
```

Example:

```text
Two Sum

✓ Accepted       C++       0.18s
✗ Wrong Answer   Python    0.21s
⚠ Runtime Error  Java      0.10s
```

---

# 23. Complete Workflow in One Flow

This is the version I'd put into your **system architecture/documentation**:

```text
                    ADMIN
                      │
                      ▼
             Create Coding Problem
                      │
                      ▼
               MongoDB
          ┌───────────┴───────────┐
          │                       │
    Visible Tests            Hidden Tests
          │                       │
          └───────────┬───────────┘
                      │
                      ▼
                  STUDENT
                      │
                      ▼
             Select Problem
                      │
                      ▼
            Select Programming
               Language
                      │
          ┌───────────┼───────────┐
          ▼           ▼           ▼
         C++         Java       Python 3
          │           │           │
          └───────────┼───────────┘
                      ▼
                Monaco Editor
                      │
                      ▼
                Write Code
                      │
              ┌───────┴───────┐
              │               │
             RUN            SUBMIT
              │               │
              ▼               ▼
        Visible Tests    All Tests
                              │
                              ▼
                         FastAPI
                              │
                              ▼
                     Execution Service
                              │
                              ▼
                       Docker Sandbox
                              │
                    ┌─────────┼─────────┐
                    ▼         ▼         ▼
                   C++       Java      Python
                    │         │         │
                    └─────────┼─────────┘
                              ▼
                       Compile / Execute
                              │
                              ▼
                        Test Runner
                              │
                    ┌─────────┼─────────┐
                    ▼         ▼         ▼
                 Expected   Actual    Limits
                  Output    Output    Check
                    │         │         │
                    └─────────┼─────────┘
                              ▼
                         Evaluation
                              │
       ┌────────────┬─────────┼──────────┬────────────┐
       ▼            ▼         ▼          ▼            ▼
   Accepted    Wrong Ans   Compile    Runtime      Timeout
                             Error      Error
       │
       ▼
   Save Submission
       │
       ▼
   Return Result
       │
       ▼
   React UI
```

## 24. Your actual technology stack

For your existing PPP, I'd use:

| Layer | Technology |
|---|---|
| Frontend | React |
| Code Editor | Monaco Editor |
| Backend API | FastAPI |
| Database | MongoDB |
| Execution | Docker |
| C++ | GCC/G++ |
| Java | OpenJDK |
| Python | Python 3 |
| Isolation | Docker sandbox |
| Authentication | Your existing JWT |
| Submission history | MongoDB |

### One architectural decision I'd strongly recommend

Don't make:

```text
React → FastAPI → compiler
```

Instead make:

```text
React
  ↓
FastAPI
  ↓
Execution Service
  ↓
Docker Sandbox
  ↓
Compiler/Interpreter
```

That separation is what keeps your **main PPP backend** from becoming the place where random student code gets executed.

And you can start small: **3 languages + ~10 predefined problems + visible/hidden tests + Run/Submit + Docker sandbox** is already a legitimate mini online judge. Then you can layer leaderboards, submissions, difficulty, streaks, etc. on top.