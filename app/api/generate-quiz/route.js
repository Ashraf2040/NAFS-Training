import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const subject = formData.get("subject");
    const standard = formData.get("standard");

    if (!file || !subject || !standard) {
      return NextResponse.json(
        { error: "Missing file, subject, or standard" },
        { status: 400 }
      );
    }

    const fileBuffer = await file.arrayBuffer();
    const fileText = Buffer.from(fileBuffer).toString("utf-8");

    const prompt = `
      Generate a quiz based on the following content for subject "${subject}" and standard "${standard}".
      Content: "${fileText}"
      Format the quiz as a JSON object with the following structure:
      {
        "title": "Quiz Title based on Subject and Standard",
        "subject": "${subject}",
        "standard": "${standard}",
        "questions": [
          {
            "id": "uuid-q1",
            "text": "Question text here",
            "type": "multiple-choice",
            "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
            "correctAnswer": 2
          }
        ],
        "totalQuestions": 10,
        "createdAt": "ISO timestamp"
      }
      Respond strictly with only the JSON object, no markdown, no explanations.
    `;

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "DeepSeek API key is not configured" },
        { status: 500 }
      );
    }

    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        temperature: 0.0,
        max_tokens: 2048,
        messages: [
          {
            role: "system",
            content: "You are a precise and concise assistant. Respond strictly with valid JSON only.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `DeepSeek API request failed: ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    let quizContent = data.choices[0].message.content;

    // Clean and extract JSON
    quizContent = quizContent.replace(/```json\n|\n```/g, '').trim();
    if (!quizContent.startsWith('{')) {
      const jsonMatch = quizContent.match(/{[\s\S]*}/);
      if (jsonMatch) {
        quizContent = jsonMatch[0];
      } else {
        throw new Error("No valid JSON block found in response");
      }
    }

    let generatedQuiz;
    try {
      generatedQuiz = JSON.parse(quizContent);
    } catch (parseError) {
      return NextResponse.json(
        { error: `Failed to parse quiz data: ${parseError.message}`, rawResponse: quizContent },
        { status: 500 }
      );
    }

    return NextResponse.json(generatedQuiz, { status: 200 });
  } catch (error) {
    console.error("Error generating quiz:", error);
    return NextResponse.json(
      { error: `Server error: ${error.message}` },
      { status: 500 }
    );
  }
}





// import { NextResponse } from "next/server";

// export async function POST(req) {
//   try {
//     const formData = await req.formData();
//     const file = formData.get("file");
//     const subject = formData.get("subject");
//     const standard = formData.get("standard");

//     if (!file || !subject || !standard) {
//       return NextResponse.json(
//         { error: "Missing file, subject, or standard" },
//         { status: 400 }
//       );
//     }

//     const fileBuffer = await file.arrayBuffer();
//     const fileText = Buffer.from(fileBuffer).toString("utf-8");

//     const prompt = `
//       Generate a quiz based on the following content for subject "${subject}" and standard "${standard}".
//       Content: "${fileText}"
//       Format the quiz as a JSON object with the following structure:
//       {
//         "title": "Quiz Title based on Subject and Standard",
//         "subject": "${subject}",
//         "standard": "${standard}",
//         "questions": [
//           {
//             "id": "uuid-q1",
//             "text": "Question text here",
//             "type": "multiple-choice",
//             "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
//             "correctAnswer": 2 // the index (0-based) of the correct option
//           }
//           // Add more questions as needed, aim for at least 10
//         ],
//         "totalQuestions": 10,
//         "createdAt": "ISO timestamp"
//       }
//     `;

//     const apiKey = process.env.PERPLEXITY_API_KEY;
//     if (!apiKey) {
//       return NextResponse.json(
//         { error: "API key is not configured" },
//         { status: 500 }
//       );
//     }

//     const response = await fetch("https://api.perplexity.ai/chat/completions", {
//       method: "POST",
//       headers: {
//         "Authorization": `Bearer ${apiKey}`,
//         "Content-Type": "application/json",
//         "Accept": "application/json",
//       },
//       body: JSON.stringify({
//         model: "sonar-pro",
//         stream: false,
//         max_tokens: 2048,
//         temperature: 0.0,
//         messages: [
//           {
//             role: "system",
//             content: "You are a precise and concise assistant for generating educational quizzes in JSON format.",
//           },
//           {
//             role: "user",
//             content: prompt,
//           },
//         ],
//       }),
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       return NextResponse.json(
//         { error: `API request failed: ${errorText}` },
//         { status: response.status }
//       );
//     }

//     const data = await response.json();
//     const quizContent = data.choices[0].message.content;

//     let generatedQuiz;
//     try {
//       const jsonMatch = quizContent.match(/{[\s\S]*}/);
//       if (jsonMatch) {
//         generatedQuiz = JSON.parse(jsonMatch[0]);
//       } else {
//         throw new Error("No valid JSON found in response");
//       }
//     } catch (parseError) {
//       return NextResponse.json(
//         { error: `Failed to parse quiz data: ${parseError.message}`, rawResponse: quizContent },
//         { status: 500 }
//       );
//     }

//     // --- CSV GENERATION SECTION ---
//     const quizId = generatedQuiz.id || "uuid-1";
//     const quizTitle = generatedQuiz.title || "Untitled Quiz";
//     const icon = "faBook";

//     const csvHeader = [
//       "quizId",
//       "quizTitle",
//       "icon",
//       "questionId",
//       "mainQuestion",
//       "choices",
//       "correctAnswer",
//       "answeredResult",
//       "totalAttempts",
//       "correctAttempts",
//       "incorrectAttempts"
//     ].join(",") + "\n";

//     const rows = (generatedQuiz.questions || []).map((q, i) => {
//       const choices = Array.isArray(q.options) ? q.options.join("|") : "";
//       const correctAnswer = typeof q.correctAnswer === "number" ? q.correctAnswer : 0;
//       return [
//         quizId,
//         quizTitle,
//         icon,
//         q.id || `uuid-q${i + 1}`,
//         q.text || "",
//         choices,
//         correctAnswer,
//         0, // answeredResult
//         0, // totalAttempts
//         0, // correctAttempts
//         0  // incorrectAttempts
//       ].map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",");
//     });

//     const csvData = csvHeader + rows.join("\n");

//     return new NextResponse(csvData, {
//       status: 200,
//       headers: {
//         "Content-Type": "text/csv",
//         "Content-Disposition": `attachment; filename="${quizTitle.replace(/\s+/g, '_')}.csv"`,
//       },
//     });
//   } catch (error) {
//     console.error("Error generating quiz:", error);
//     return NextResponse.json(
//       { error: `Server error: ${error.message}` },
//       { status: 500 }
//     );
//   }
// }


