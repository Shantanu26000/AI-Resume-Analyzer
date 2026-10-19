# ResumeIQ AI — AI-Powered Resume Analyzer

An AI-powered resume analysis platform that helps job seekers evaluate their resumes, identify skill gaps, and improve their alignment with job requirements using AI-driven insights.

**Live Demo:** [ResumeIQ AI](https://ai-resume-analyzer-ognq.onrender.com)  
**GitHub Repository:** [AI-Resume-Analyzer](https://github.com/Shantanu26000/AI-Resume-Analyzer)

---

## Overview

ResumeIQ AI analyzes resumes and generates actionable feedback to help users improve their resumes for Applicant Tracking Systems (ATS). It combines an interactive web interface, AI-powered analysis, secure authentication, and persistent storage to deliver a complete resume improvement experience.

## Features

- **AI-Powered Resume Analysis:** Analyze uploaded resumes and receive an estimated ATS score with actionable recommendations.
- **Resume Upload:** Upload resume files directly from your device.
- **Skill Gap Analysis:** Identify potentially missing skills and areas for improvement.
- **Score Breakdown:** Review performance across keywords, skills, formatting, and experience.
- **Job Description Matching:** Compare your resume against job requirements to identify relevant skills and potential gaps.
- **Analysis History:** Access previously saved analyses and view individual reports.
- **PDF Reports:** Download formatted resume analysis reports.
- **User Authentication:** Register and log in with password hashing and JWT-based authentication.
- **Profile Settings:** View and update profile information.
- **Interactive Dashboard:** Track resume analysis statistics and navigate between features.
- **Responsive UI:** A modern interface with dark styling, animations, and responsive layouts.

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | Next.js, React, TypeScript, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MySQL |
| AI Integration | Google Gemini API |
| Authentication | JSON Web Tokens (JWT), bcrypt |
| Resume Processing | PDF parsing with `pdf-parse` |
| UI & Animations | Framer Motion, Recharts |
| PDF Generation | jsPDF |
| Deployment | Render, Railway |

## Application Architecture

```text
User
 |
 v
Next.js Frontend
(Render)
 |
 | REST API Requests
 v
Express.js Backend
(Railway)
 |
 +-------------------+
 |                   |
 v                   v
MySQL Database    Google Gemini API
 |                   |
 v                   v
Saved Analyses    AI Insights
User Profiles    ATS Feedback
```

## Project Structure

```text
AI-Resume-Analyzer/
├── client/
│   ├── app/
│   │   ├── dashboard/
│   │   ├── upload/
│   │   ├── analysis/
│   │   ├── history/
│   │   ├── job-match/
│   │   ├── settings/
│   │   ├── login/
│   │   └── register/
│   ├── components/
│   ├── package.json
│   └── ...
├── server/
│   ├── routes/
│   ├── controllers/
│   ├── uploads/
│   ├── server.js
│   └── ...
└── README.md
```

*The structure above highlights the main application areas; exact filenames may vary.*

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js and npm
- MySQL Server or an accessible MySQL database
- A Google Gemini API key

### 1. Clone the repository

```bash
git clone https://github.com/Shantanu26000/AI-Resume-Analyzer.git
cd AI-Resume-Analyzer
```

### 2. Configure the backend

Navigate to the backend directory and install dependencies:

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory and configure the environment variables required by your backend.

Example configuration:

```env
PORT=5000
JWT_SECRET=your_secure_jwt_secret
```

Configure your MySQL connection settings and Gemini API key using the variable names expected by your backend code.

Create the required database and tables before starting the application.

### 3. Start the backend

From the `server` directory, run:

```bash
node server.js
```

The backend should start on `http://localhost:5000` when using port 5000.

### 4. Configure the frontend

Open another terminal and navigate to the project root:

```bash
cd client
npm install
```

Create a `.env.local` file inside `client`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

For local development, this points the frontend to your local backend.

### 5. Start the frontend

From the `client` directory, run:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

ResumeIQ AI is deployed using separate frontend and backend services.

- **Frontend:** Render
- **Backend API:** Railway
- **Database:** MySQL hosted on Railway

For the deployed frontend, configure the following environment variable in the Render service:

```env
NEXT_PUBLIC_API_URL=https://ai-resume-analyzer-production-c6b4.up.railway.app
```

Use the appropriate environment variables for the backend database connection, JWT secret, and Gemini API credentials in Railway.

**Important:** After changing a `NEXT_PUBLIC_` environment variable, trigger a new frontend deployment so the updated value is included in the build.

Never commit `.env`, `.env.local`, database credentials, API keys, or JWT secrets to GitHub.

## Security Considerations

- Passwords are hashed before storage.
- JWT authentication protects applicable API endpoints.
- Environment variables are used for sensitive configuration.
- Profile and analysis operations should enforce user authorization on the backend.
- Uploaded files should be validated and handled securely.

## Future Improvements

- Add more detailed resume-to-job compatibility metrics.
- Support additional resume formats.
- Provide tailored resume improvement suggestions for specific job roles.
- Add enhanced analytics and progress tracking.
- Improve automated testing and API documentation.

## Author

**Shantanu**

Computer Science and Engineering

GitHub: [@Shantanu26000](https://github.com/Shantanu26000)

---

## Disclaimer

ResumeIQ AI provides AI-generated guidance and estimated ATS compatibility scores. These scores are not official employer ATS results and do not guarantee shortlisting, interviews, or employment.
