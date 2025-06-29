import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route"; // Corrected path for App Router

export async function POST(req) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      console.error("Authentication failed: No session found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the form data
    const formData = await req.formData();
    const file = formData.get("file");
    const subject = formData.get("subject");
    const standard = formData.get("standard");

    // Validate inputs
    if (!file || !subject || !standard) {
      console.error("Validation failed:", { file: !!file, subject, standard });
      return NextResponse.json(
        { error: "Missing file, subject, or standard" },
        { status: 400 }
      );
    }

    // Validate file type and size
    const allowedTypes = ["text/plain", "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowedTypes.includes(file.type)) {
      console.error("Invalid file type:", file.type);
      return NextResponse.json(
        { error: "Invalid file type. Allowed: .txt, .pdf, .doc, .docx" },
        { status: 400 }
      );
    }
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      console.error("File size exceeds limit:", file.size);
      return NextResponse.json(
        { error: "File size exceeds 10MB limit" },
        { status: 400 }
      );
    }

    // Read file content (basic example for text files)
    const fileBuffer = await file.arrayBuffer();
    let fileText = Buffer.from(fileBuffer).toString("utf-8");

    if (fileText.length === 0) {
      console.error("Empty file content");
      return NextResponse.json(
        { error: "File content is empty" },
        { status: 400 }
      );
    }

    // Prepare the prompt for DeepSeek API
    const prompt = `
      Generate a quiz based on the following content for subject "${subject}" and standard "${standard}".
      Content: "${fileText.slice(0, 1000)}"
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
        "createdAt": "${new Date().toISOString()}"
      }
      Respond with only the JSON object, without any additional text or markdown.
    `;

    // Call DeepSeek API
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      console.error("DeepSeek API key not configured");
      return NextResponse.json(
        { error: "DeepSeek API key is not configured" },
        { status: 500 }
      );
    }

    console.log("Sending request to DeepSeek API");
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-chat", // Adjust based on DeepSeek's documentation
        messages: [
          {
            role: "system",
            content: "You are a precise assistant for generating educational quizzes in JSON format. Respond strictly with valid JSON, without markdown or additional text.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 2048,
        temperature: 0.0,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("DeepSeek API error:", errorText);
      return NextResponse.json(
        { error: `DeepSeek API request failed: ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const quizContent = data.choices[0].message.content;

    // Log the raw response for debugging
    console.log("DeepSeek API Response Content:", quizContent);

    // Parse the JSON response
    let generatedQuiz;
    try {
      let jsonString = quizContent;
      const jsonMatch = quizContent.match(/{[\s\S]*}/);
      if (jsonMatch) {
        jsonString = jsonMatch[0];
        console.log("Extracted JSON block:", jsonString.slice(0, 100) + "...");
      }
      generatedQuiz = JSON.parse(jsonString);
      console.log("Successfully parsed JSON. Quiz Title:", generatedQuiz.title);
    } catch (parseError) {
      console.error("JSON Parsing Error:", parseError.message);
      return NextResponse.json(
        { error: `Failed to parse quiz data: ${parseError.message}`, rawResponse: quizContent },
        { status: 500 }
      );
    }

    // Validate quiz structure
    if (!generatedQuiz.questions || !Array.isArray(generatedQuiz.questions)) {
      console.error("Invalid quiz structure: missing questions array");
      return NextResponse.json(
        { error: "Invalid quiz structure: missing or invalid questions array" },
        { status: 500 }
      );
    }

    // Generate CSV
    const quizId = generatedQuiz.id || `uuid-${Date.now()}`;
    const quizTitle = generatedQuiz.title || `Quiz_${subject}_${standard}`;
    const icon = "faBook";

    const csvHeader = [
      "quizId",
      "quizTitle",
      "icon",
      "questionId",
      "mainQuestion",
      "choices",
      "correctAnswer",
      "answeredResult",
      "totalAttempts",
      "correctAttempts",
      "incorrectAttempts",
    ].join(",") + "\n";

    const rows = generatedQuiz.questions.map((q, i) => {
      const choices = Array.isArray(q.options) ? q.options.join("|") : "";
      const correctAnswer = typeof q.correctAnswer === "number" ? q.correctAnswer : 0;
      return [
        quizId,
        quizTitle,
        icon,
        q.id || `uuid-q${i + 1}`,
        q.text || "",
        choices,
        correctAnswer,
        0,
        0,
        0,
        0,
      ].map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",");
    });

    const csvData = csvHeader + rows.join("\n");

    // Return CSV response
    return new NextResponse(csvData, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${quizTitle.replace(/\s+/g, '_')}.csv"`,
      },
    });
  } catch (error) {
    console.error("Error generating quiz CSV:", error);
    return NextResponse.json(
      { error: `Server error: ${error.message}` },
      { status: 500 }
    );
  }
}