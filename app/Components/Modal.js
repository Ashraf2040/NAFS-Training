import React from 'react';

function Modal({ generatedQuiz, handlePreview, handleDownload, handleImport, isLoadingAction, setIsModalOpen }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl text-theme font-semibold mb-4">Quiz Created Successfully</h2>
        <p className="text-gray-700 mb-6">Do you want to:</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handlePreview}
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-500 transition-all disabled:opacity-50"
            disabled={isLoadingAction}
          >
            Preview
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md shadow-md hover:bg-green-500 transition-all disabled:opacity-50"
            disabled={isLoadingAction}
          >
            Download CSV
          </button>
          <button
            onClick={handleImport}
            className="px-4 py-2 bg-theme text-white font-semibold rounded-md shadow-md hover:bg-themeYellow transition-all disabled:opacity-50"
            disabled={isLoadingAction}
          >
            Import to Database
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;