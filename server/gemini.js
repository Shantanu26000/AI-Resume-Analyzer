async function analyzeResume(text) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`,
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
                text: `
You are an ATS Resume Analyzer.

Return ONLY valid JSON.

{
  "atsScore": number,
  "missingSkills":["skill1","skill2","skill3"],
  "suggestions":[
    "suggestion1",
    "suggestion2",
    "suggestion3"
  ]
}

Resume:

${text}
`,
              },
            ],
          },
        ],
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(JSON.stringify(data));
  }

  return data.candidates[0].content.parts[0].text;
}

module.exports = analyzeResume;