import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingScreen from "../components/LoadingScreen";
import { useAuth } from "../context/AuthContext";
import {
  FaArrowRight,
  FaArrowLeft,
  FaUpload,
  FaFileAlt,
  FaTimes,
} from "react-icons/fa";
import Toast from "../components/Toast";

export default function SetupForm() {
  const { user, loading, setLoading } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [drag, setDrag] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const fileInputRef = useRef(null);

  const MAX_FILE_SIZE_MB = 5;

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    interviewName: "",
    numOfQuestions: 3,
    interviewType: "Technical",
    role: "",
    experienceLevel: "Fresher",
    companyName: "",
    companyDescription: "",
    jobDescription: "",
    resume: null,
    focusAt: "",
  });

  const totalSteps = 3;
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsTransitioning(false);
      }, 150);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setIsTransitioning(false);
      }, 150);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDrag(true);
    } else if (e.type === "dragleave") {
      setDrag(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDrag(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const fileSizeMB = file.size / 1024 / 1024;

      if (file.type !== "application/pdf") {
        showToast("Only PDF files are allowed.", "error");
        return;
      }

      if (fileSizeMB > MAX_FILE_SIZE_MB) {
        showToast("File size exceeds 5MB.", "error");
        return;
      }

      handleInputChange("resume", file);
    } else {
      showToast("No file detected.", "error");
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileSizeMB = file.size / 1024 / 1024;

      if (file.type !== "application/pdf") {
        showToast("Only PDF files are allowed", "error");
        return;
      }

      if (fileSizeMB > MAX_FILE_SIZE_MB) {
        showToast("File size exceeds 5MB.", "error");
        return;
      }

      handleInputChange("resume", file);
    } else {
      showToast("No file selected", "error");
    }
  };

  const removeFile = () => {
    handleInputChange("resume", null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      showToast("User not logged in", "error");
      return;
    }

    
    if (!formData.interviewName || !formData.role || !formData.resume) {
      showToast("Please fill all required fields and upload your resume.", "error");
      return;
    }

    setLoading(true);
    const token = await user.getIdToken();

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) data.append(key, formData[key]);
    });

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/interview/setup`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showToast("Interview setup complete!", "success");
      const interviewId = res.data.interview._id;
      navigate(`/interview/${interviewId}`);
    } catch (err) {
      console.error("Error in interview setup:", err.response?.data || err);
      showToast("Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingScreen message="Setting up your interview..." />;

  return (
    <>
      {toast.show && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-8 text-sm text-gray-500">
            Step {currentStep} of {totalSteps}
          </div>

          
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Interview Setup</span>
              <span className="text-sm text-gray-500">{Math.round(progressPercentage)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          
          <form onSubmit={handleSubmit} className="space-y-6">
            {currentStep === 1 && (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Interview Name"
                  value={formData.interviewName}
                  onChange={(e) => handleInputChange("interviewName", e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  required
                />
                <input
                  type="text"
                  placeholder="Role"
                  value={formData.role}
                  onChange={(e) => handleInputChange("role", e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  required
                />
                <select
                  value={formData.experienceLevel}
                  onChange={(e) => handleInputChange("experienceLevel", e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="Fresher">Fresher</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Experienced">Experienced</option>
                </select>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Company Name"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange("companyName", e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
                <textarea
                  placeholder="Company Description"
                  value={formData.companyDescription}
                  onChange={(e) => handleInputChange("companyDescription", e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
                <textarea
                  placeholder="Job Description"
                  value={formData.jobDescription}
                  onChange={(e) => handleInputChange("jobDescription", e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <div
                  className={`border-dashed border-2 p-4 text-center rounded ${
                    drag ? "border-blue-500 bg-blue-50" : "border-gray-300"
                  }`}
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept="application/pdf"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  {formData.resume ? (
                    <div className="flex justify-between items-center">
                      <span><FaFileAlt className="inline mr-2" /> {formData.resume.name}</span>
                      <button type="button" onClick={removeFile}><FaTimes /></button>
                    </div>
                  ) : (
                    <p onClick={() => fileInputRef.current.click()}>
                      <FaUpload className="inline mr-2" /> Drag & drop your resume here or click to upload
                    </p>
                  )}
                </div>
              </div>
            )}

            
            <div className="flex justify-between">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  <FaArrowLeft className="inline mr-2" /> Back
                </button>
              )}
              {currentStep < totalSteps && (
                <button
                  type="button"
                  onClick={handleNext}
                  className="ml-auto px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Next <FaArrowRight className="inline ml-2" />
                </button>
              )}
              {currentStep === totalSteps && (
                <button
                  type="submit"
                  className="ml-auto px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Submit
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
