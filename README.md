# ResumeIQ AI

**AI-powered resume analysis and job matching platform**

ResumeIQ AI helps users evaluate their resumes, identify missing skills, and receive actionable recommendations to improve their applications.

## Features

- **ATS Resume Analysis:** Generate an ATS compatibility score and category-wise breakdown.
- **Skill Gap Analysis:** Identify skills that may be missing from your resume.
- **AI Recommendations:** Get practical suggestions to improve resume content.
- **Job Description Matching:** Compare resume information with a target job description.
- **Analysis History:** Review previous resume analyses.
- **PDF Reports:** Download a structured resume analysis report.
- **User Authentication:** Register, log in, and manage your profile.
- **Responsive UI:** Modern interface with animations and interactive charts.

## Tech Stack

### Frontend
- Next.js
- React and TypeScript
- Tailwind CSS
- Framer Motion
- Recharts

### Backend
- Node.js
- Express.js
- MySQL
- JWT authentication
- bcrypt
- Gemini AI API
- jsPDF for PDF report generation

## Project Structure

```text
AI-Resume-Analyzer/
├── client/          # Next.js frontend
│   ├── app/
│   └── components/
├── server/          # Express backend
│   ├── routes/
│   └── ...
└── README.md
```

## Getting Started

### Prerequisites

- Node.js and npm
- MySQL
- Gemini API key

### 1. Clone the repository

```bash
git clone https://github.com/Shantanu26000/AI-Resume-Analyzer.git
cd AI-Resume-Analyzer
```

### 2. Install frontend dependencies

```bash
cd client
npm install
```

Configure the frontend environment variables if your application requires them.

### 3. Install backend dependencies

Open another terminal from the project root:

```bash
cd server
npm install
```

Create a `server/.env` file containing the environment variables required by your backend, such as the database connection settings, JWT secret, and Gemini API key. Use the variable names expected by your existing code.

### 4. Start the application

Start the backend using the script defined in `server/package.json`, and start the frontend using the script defined in `client/package.json`.

The development servers have been configured to run at:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

## Security

- Keep API keys, database credentials, and JWT secrets out of source control.
- Configure environment variables separately for development and production.
- Never commit real `.env` files.

## Future Improvements

- Production deployment
- Enhanced resume feedback
- Additional export and reporting options

## Author

**Shantanu**

*Turning ideas into intelligent solutions.*

