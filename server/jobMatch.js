// const fetch = require("node-fetch");

async function analyzeJobMatch(resumeText, jobDescription) {

  const prompt = `
You are an expert ATS resume analyzer.

Compare the following RESUME with the JOB DESCRIPTION.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Analyze how well the resume matches the job.

Return ONLY valid JSON.
Do not use markdown.
Do not add explanations outside JSON.

Use exactly this structure:

{
  "matchScore": 0,
  "matchedSkills": [],
  "missingSkills": [],
  "recommendations": []
}

Rules:

1. matchScore must be a number from 0 to 100.
2. matchedSkills should contain important skills from the job description that are clearly present in the resume.
3. missingSkills should contain important job requirements or skills that are missing from the resume.
4. recommendations should contain 3 to 5 specific suggestions for improving the resume for this job.
5. Do not invent skills that are not relevant to the job description.
6. Focus primarily on technical skills, tools, technologies and important job requirements.
`;

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY,
      },

      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error?.message || "Gemini API request failed"
    );
  }

  return data.candidates[0].content.parts[0].text;
}

module.exports = analyzeJobMatch;