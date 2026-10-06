# CareerLens – Smart Job Application & Interview Intelligence Platform

CareerLens is a full-stack career management platform designed to help job seekers manage their resumes, discover suitable job opportunities, track applications, and organize interview preparation in one place.

The platform also provides resume-to-job skill matching by extracting skills from uploaded resumes and comparing them with the skills identified from job descriptions.

---

## 📌 Project Overview

Job seekers often manage resumes, job applications, interview schedules, and preparation activities across multiple platforms.

CareerLens provides a centralized platform where users can:

- Create and manage their account
- Upload and manage resumes
- Extract skills from resumes
- Browse job opportunities
- Compare resume skills with job requirements
- View job match percentages
- Identify missing skills
- Apply for jobs
- Track application status
- Manage interview rounds
- Store interview questions and answers

The project follows a modern full-stack architecture using React, Django REST Framework, Python, and MySQL.

---

## ✨ Key Features

### 🔐 User Authentication
- User registration
- User login
- Token-based authentication
- Logout functionality
- Authenticated user profile

### 📄 Resume Management
- Upload resumes
- Supports PDF, DOCX, and TXT files
- Extract text from uploaded resumes
- Automatically identify technical skills
- Store resume information securely

### 💼 Job Management
- Browse available jobs
- View job descriptions
- View company and location information
- View job type and experience requirements
- Add and manage job opportunities

### 🎯 Resume–Job Matching
- Extract required skills from job descriptions
- Compare resume skills with job requirements
- Calculate skill match percentage
- Display matched skills
- Identify missing skills

### 📝 Application Tracking
Users can track applications through different stages:

- Saved
- Applied
- Shortlisted
- Assessment
- Technical Interview
- HR Interview
- Selected
- Rejected

Duplicate applications for the same job are prevented.

### 🎤 Interview Management
- Create interview rounds
- Schedule interviews
- Track interview status
- Add interview feedback
- Store interview questions
- Categorize questions by topic
- Set question difficulty
- Store answers

### 📊 Dashboard
The dashboard provides a centralized view of the user's career activities, including jobs, resumes, applications, interviews, and skill matches.

---

## 🛠️ Technologies Used

### Frontend
- React.js
- JavaScript
- Axios
- Vite
- HTML
- CSS

### Backend
- Python
- Django
- Django REST Framework

### Database
- MySQL

### Authentication
- Django Token Authentication

### Resume Processing
- PyPDF
- python-docx
- Python-based skill extraction

### Development Tools
- Visual Studio Code
- MySQL Workbench
- Git & GitHub

---

## 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │      React.js        │
                    │      Frontend        │
                    └──────────┬───────────┘
                               │
                               │ REST API
                               ▼
                    ┌──────────────────────┐
                    │   Django REST API    │
                    │       Backend        │
                    └──────────┬───────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
       ┌────────────┐   ┌────────────┐   ┌────────────┐
       │   Python   │   │  Matching  │   │   Resume   │
       │   Business │   │   Logic    │   │ Processing │
       │   Logic    │   │            │   │            │
       └────────────┘   └────────────┘   └────────────┘
              │                │                │
              └────────────────┼────────────────┘
                               ▼
                    ┌──────────────────────┐
                    │        MySQL         │
                    │       Database       │
                    └──────────────────────┘
