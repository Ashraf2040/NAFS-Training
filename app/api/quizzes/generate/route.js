import { NextRequest, NextResponse } from "next/server";

import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";

import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";

// import saveQuizz from "./saveToDb";

export async function POST(req) {
  const body = await req.formData();
  const document = body.get("pdf");

  try {
    const pdfLoader = new PDFLoader(document , {
      parsedItemSeparator: " ",
    });
    const docs = await pdfLoader.load();

    const selectedDocuments = docs.filter(
      (doc) => doc.pageContent !== undefined
    );
    const texts = selectedDocuments.map((doc) => doc.pageContent);

    const prompt = `
    Given the following text, which may be in Arabic or English, generate a quiz based on the text. The quiz should be in the same language as the text. If the text already contains questions, use those questions directly to form the quiz. If the text does not contain questions, generate new questions based on the text. Return JSON only that contains a quiz object with fields: icon, quizTitle, id, and quizQuestions. The id should be unique and contain only alphanumeric characters. The quizQuestions is an array of objects with fields: id, mainQuestion, choices, correctAnswer, answeredResult (default -1), and statistics. The statistics is an object with fields: totalAttempts (default 0), correctAttempts (default 0), and incorrectAttempts (default 0).
    `;
    

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not provided" },
        { status: 500 }
      );
    }

    const model = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: "gpt-4-1106-preview",
    });

    const parser = new JsonOutputFunctionsParser();
    const extractionFunctionSchema = {
      name: "extractor",
      description: "Extracts fields from the output",
      parameters: {
        type: "object",
        properties: {
          quiz: {
            type: "object",
            properties: {
              icon: { type: "string" },
              quizTitle: { type: "string" },
              id: { type: "string" },
              quizQuestions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    mainQuestion: { type: "string" },
                    choices: {
                      type: "array",
                      items: { type: "string" },
                    },
                    correctAnswer: { type: "number" },
                    answeredResult: { type: "number", default: -1 },
                    statistics: {
                      type: "object",
                      properties: {
                        totalAttempts: { type: "number", default: 0 },
                        correctAttempts: { type: "number", default: 0 },
                        incorrectAttempts: { type: "number", default: 0 },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    };

    const runnable = model
      .bind({
        functions: [extractionFunctionSchema],
        function_call: { name: "extractor" },
      })
      .pipe(parser);

    const message = new HumanMessage({
      content: [
        {
          type: "text",
          text: prompt + "\n" + texts.join("\n"),
        },
      ],
    });

    const result = await runnable.invoke([message]);
    // console.log(result);

    // const { quizzId } = await saveQuizz(result.quizz);

    return NextResponse.json({ result }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}