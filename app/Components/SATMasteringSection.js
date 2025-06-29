import React, { useState } from 'react';
import Modal from './Modal';

function SATMasteringSection() {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedStandard, setSelectedStandard] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedQuizFile, setUploadedQuizFile] = useState(null);
  const [generatedQuiz, setGeneratedQuiz] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingAction, setIsLoadingAction] = useState(false);

  const standards = {
    Chemistry: ["NGSS HS-PS1-1", "NGSS HS-PS1-2", "AP Chemistry Unit 1"],
    Math: ["Common Core Algebra I", "Common Core Geometry", "AP Calculus AB"],
    English: ["Common Core ELA 9-10", "Common Core ELA 11-12", "AP English Literature"],
  };

  const handleGenerateQuiz = async () => {
    if (!selectedSubject || !selectedStandard || !uploadedFile) {
      alert("Please select a subject, standard, and upload a file.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", uploadedFile);
      formData.append("subject", selectedSubject);
      formData.append("standard", selectedStandard);

      const response = await fetch("/api/generate-quiz", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate quiz");
      }

      const quizData = await response.json();
      setGeneratedQuiz(quizData);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error generating quiz:", error);
      alert(`Failed to generate quiz: ${error.message}`);
    }
  };

  const handleDirectImport = async () => {
    if (!uploadedQuizFile) {
      alert("Please upload a quiz file to import.");
      return;
    }
    if (!selectedSubject) {
      alert("Please select a subject before importing a quiz.");
      return;
    }

    try {
      setIsLoadingAction(true);
      const formData = new FormData();
      formData.append("file", uploadedQuizFile);
      formData.append("subject", selectedSubject);
      formData.append("skill", selectedStandard || "");

      const response = await fetch("/api/quizzes/import-sat", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to import SAT quiz");
      }

      const result = await response.json();
      alert(`SAT Quiz imported successfully! ${result.message}`);
    } catch (error) {
      console.error("Error importing SAT quiz directly:", error);
      alert(`Failed to import SAT quiz: ${error.message}`);
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleImport = async () => {
    if (!generatedQuiz) {
      alert("No generated quiz data available to import.");
      return;
    }
    if (!selectedSubject) {
      alert("Please select a subject before importing a quiz.");
      return;
    }

    try {
      setIsLoadingAction(true);
      const csvContent = convertQuizDataToCSV(generatedQuiz);
      const blob = new Blob([csvContent], { type: "text/csv" });
      const file = new File([blob], "generated-quiz.csv", { type: "text/csv" });

      const formData = new FormData();
      formData.append("file", file);
      formData.append("subject", selectedSubject);
      formData.append("skill", selectedStandard || "");

      const response = await fetch("/api/quizzes/import-sat", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to import generated SAT quiz");
      }

      const result = await response.json();
      alert(`Generated SAT Quiz imported successfully! ${result.message}`);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error importing generated SAT quiz:", error);
      alert(`Failed to import generated SAT quiz: ${error.message}`);
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handlePreview = () => {
    console.log("Previewing Quiz:", generatedQuiz);
    alert("Preview functionality to be implemented. Check console for quiz data.");
  };

  const handleDownload = async () => {
    try {
      setIsLoadingAction(true);
      const formData = new FormData();
      formData.append("file", uploadedFile);
      formData.append("subject", selectedSubject);
      formData.append("standard", selectedStandard);

      const response = await fetch("/api/generate-quiz-csv", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to download quiz CSV");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const contentDisposition = response.headers.get("Content-Disposition");
      const filename = contentDisposition
        ? contentDisposition.split("filename=")[1].replace(/"/g, "")
        : "generated_quiz.csv";
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      alert("Quiz CSV downloaded successfully!");
    } catch (error) {
      console.error("Error downloading quiz:", error);
      alert(`Failed to download quiz: ${error.message}`);
    } finally {
      setIsLoadingAction(false);
    }
  };

  const convertQuizDataToCSV = (quizData) => {
    console.log("Generated Quiz Data for Conversion:", quizData);
    if (!quizData) {
      throw new Error("Quiz data is null or undefined");
    }

    let questions = [];
    let quizId = `generated-quiz-${Date.now()}`;
    let quizTitle = "Generated SAT Quiz";

    if (Array.isArray(quizData)) {
      questions = quizData;
    } else if (quizData.quizQuestions && Array.isArray(quizData.quizQuestions)) {
      questions = quizData.quizQuestions;
      quizId = quizData.id || quizId;
      quizTitle = quizData.quizTitle || quizTitle;
    } else if (quizData.questions && Array.isArray(quizData.questions)) {
      questions = quizData.questions;
      quizId = quizData.id || quizId;
      quizTitle = quizData.quizTitle || quizTitle;
    } else {
      throw new Error("Invalid quiz data format for CSV conversion: No questions array found");
    }

    if (questions.length === 0) {
      throw new Error("No questions found in quiz data");
    }

    const headers = [
      "quizId",
      "quizTitle",
      "questionId",
      "mainQuestion",
      "choices",
      "correctAnswer",
      "answeredResult",
      "totalAttempts",
      "correctAttempts",
      "incorrectAttempts",
    ];

    const rows = questions.map((question, index) => {
      return [
        quizId,
        quizTitle,
        question.id || `q-${index}-${Date.now()}`,
        question.mainQuestion || question.question || "",
        question.choices ? (Array.isArray(question.choices) ? question.choices.join("|") : question.choices) : "",
        question.correctAnswer !== undefined ? question.correctAnswer : 0,
        question.answeredResult !== undefined ? question.answeredResult : 0,
        question.statistics?.totalAttempts || question.totalAttempts || 0,
        question.statistics?.correctAttempts || question.correctAttempts || 0,
        question.statistics?.incorrectAttempts || question.incorrectAttempts || 0,
      ];
    });

    const csvRows = [headers, ...rows].map(row => row.join(","));
    return csvRows.join("\n");
  };

  return (
    <div className="block">
      <h1 className="text-center text-theme font-semibold">No SAT Quizzes have been assigned</h1>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col gap-2">
          <label className="text-theme font-medium">Select Subject:</label>
          <select
            className="p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-theme focus:border-transparent"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <option value="">Choose a Subject</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Math">Math</option>
            <option value="English">English</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-theme font-medium">Select Standard:</label>
          <select
            className="p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-theme focus:border-transparent"
            value={selectedStandard}
            onChange={(e) => setSelectedStandard(e.target.value)}
            disabled={!selectedSubject}
          >
            <option value="">Choose a Standard</option>
            {selectedSubject && standards[selectedSubject]?.map((standard, index) => (
              <option key={index} value={standard}>
                {standard}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-theme font-medium">Upload Note (Generate Quiz):</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            className="p-2 border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-theme file:text-white hover:file:bg-themeYellow"
            onChange={(e) => setUploadedFile(e.target.files[0])}
          />
          {uploadedFile && (
            <p className="text-sm text-gray-600">Selected File: {uploadedFile.name}</p>
          )}
        </div>

        <button
          className="w-full py-3 px-4 bg-theme text-white font-semibold rounded-md shadow-md hover:bg-themeYellow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleGenerateQuiz}
          disabled={!selectedSubject || !selectedStandard || !uploadedFile}
        >
          Generate Quiz from Note
        </button>

        <div className="flex flex-col gap-2">
          <label className="text-theme font-medium">Upload Quiz (Direct Import):</label>
          <input
            type="file"
            accept=".csv"
            className="p-2 border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-theme file:text-white hover:file:bg-themeYellow"
            onChange={(e) => setUploadedQuizFile(e.target.files[0])}
          />
          {uploadedQuizFile && (
            <p className="text-sm text-gray-600">Selected Quiz File: {uploadedQuizFile.name}</p>
          )}
        </div>

        <button
          className="w-full py-3 px-4 bg-theme text-white font-semibold rounded-md shadow-md hover:bg-themeYellow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleDirectImport}
          disabled={!uploadedQuizFile || !selectedSubject}
        >
          Import Quiz Directly
        </button>
      </div>
      <Modal
        isOpen={isModalOpen}
        onPreview={handlePreview}
        onDownload={handleDownload}
        onImport={handleImport}
        isLoadingAction={isLoadingAction}
      />
    </div>
  );
}

export default SATMasteringSection;
