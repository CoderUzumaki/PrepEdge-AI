import { useState } from "react";
import axios from "axios";
import LoadingScreen from "../components/LoadingScreen";

export default function ResumeReview() {
  const [file, setFile] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setFeedback("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setFeedback("");
    setError("");
    try {
      const formData = new FormData();
      formData.append("resume", file);
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/resume/review`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFeedback(res.data.feedback || res.data.summary || "No feedback returned.");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to analyze resume.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">AI-Powered Resume Review</h1>
        <form onSubmit={handleSubmit} className="mb-6" aria-label="Resume Upload Form">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="mb-4 block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            aria-label="Upload your resume"
          />
          <button
            type="submit"
            disabled={!file || loading}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-busy={loading}
          >
            {loading ? "Analyzing..." : "Get AI Feedback"}
          </button>
        </form>
        {loading && <LoadingScreen message="Analyzing your resume..." showProgress />}
        {feedback && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-900 whitespace-pre-line" aria-live="polite">
            <h2 className="font-semibold mb-2">AI Feedback:</h2>
            {feedback}
          </div>
        )}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-900" aria-live="assertive">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
