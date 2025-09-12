import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

function InterviewCard({ title, date, interviewId, className = "" }) {
  const navigate = useNavigate();
  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 mb-2">{title}</h4>
          <p className="text-sm text-gray-600">{date}</p>
        </div>
        <button
          onClick={() => navigate(`/interview/report/${interviewId}`)}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        >
          View Report
        </button>
      </div>
    </div>
  );
}

export default function InterviewList({ interviews = [], itemsPerPage = 3 }) {
  // ✅ Always force interviews to be an array
  const safeInterviews = Array.isArray(interviews) ? interviews : [];

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(safeInterviews.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentInterviews = safeInterviews.slice(startIndex, endIndex);

  const goToPage = (page) => setCurrentPage(page);
  const goToPrevious = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const goToNext = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Past Interviews
      </h3>

      <div className="space-y-4 mb-6">
        {currentInterviews.length > 0 ? (
          currentInterviews.map((interview) => (
            <InterviewCard
              key={interview._id}
              title={interview.interview_name}
              date={interview.created_at}
              interviewId={interview._id}
            />
          ))
        ) : (
          <p className="text-gray-500 text-sm">No interviews found.</p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <button
            onClick={goToPrevious}
            disabled={currentPage === 1}
            className="p-2 rounded-md text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`w-8 h-8 rounded-md text-sm font-medium transition-colors ${
                currentPage === page
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={goToNext}
            disabled={currentPage === totalPages}
            className="p-2 rounded-md text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
