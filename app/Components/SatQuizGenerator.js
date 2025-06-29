import React from 'react';

function SatQuizGenerator({
  selectedSubject,
  setSelectedSubject,
  selectedStandard,
  setSelectedStandard,
  uploadedFile,
  setUploadedFile,
  uploadedQuizFile,
  setUploadedQuizFile,
  handleGenerateQuiz,
  handleDirectImport,
  standards,
}) {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h1 className="text-center text-theme font-semibold">SAT Quiz Generator</h1>
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
          {selectedSubject &&
            standards[selectedSubject]?.map((standard, index) => (
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
  );
}

export default SatQuizGenerator;