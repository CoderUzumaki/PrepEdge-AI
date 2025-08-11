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

	useEffect(() => {
		 console.log("--------\nCurrent user from context:", user, "\n--------");
	}, [user]);
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
			if (file.type === "application/pdf") {
				handleInputChange("resume", file);
			}
		}
	};

	const handleFileSelect = (e) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];
			if (file.type === "application/pdf") {
				handleInputChange("resume", file);
			}
		}
	};

	const removeFile = () => {
		handleInputChange("resume", null);
		1;
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
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
			console.error("❌ User is null in CreateInterview.jsx");
			return;
		}
		setLoading(true);
		const token = await user.getIdToken();
		 console.log("-------\nToken being sent to backend:", token, "\n-------");

		const data = new FormData();
		Object.keys(formData).forEach((key) => {
			if (formData[key]) {
				data.append(key, formData[key]);
			}
			 console.log("-------\nForm Data: \n", [...data.entries()], "\n-------");
		});
		

		try {
			const res = await axios.post(
				`${import.meta.env.VITE_API_URL}/api/interview/setup`,
				data,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			console.log("-------\nResponse from interview setup:", res.data, "\n-------");

			showToast("Interview setup complete!", "success");
			const interviewId = res.data.interview._id;
			navigate(`/interview/${interviewId}`);
		} catch (err) {
			console.error(
				"------\nError in interview setup:",
				err.response?.data || err,
				"\n------"
			);
			showToast("Something went wrong", "error");
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<LoadingScreen
				message="Setting up your interview..."
			/>
		);
	}

	return (
		<>
			{toast.show && (
				<Toast
					message={toast.message}
					type={toast.type}
					onClose={hideToast}
				/>
			)}
			<div className="min-h-screen bg-gray-50 py-8 px-4">
				<div className="max-w-2xl mx-auto">
					<div className="flex items-center justify-between mb-8 text-sm text-gray-500">
						Step {currentStep} of {totalSteps}
					</div>

					{/* Progress Bar */}
					<div className="mb-8">
						<div className="flex justify-between items-center mb-2">
							<span className="text-sm font-medium text-gray-700">
								Interview Setup
							</span>
							<span className="text-sm text-gray-500">
								{Math.round(progressPercentage)}% Complete
							</span>
						</div>
						<div className="w-full bg-gray-200 rounded-full h-2">
							<div
								className="bg-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
								style={{ width: `${progressPercentage}%` }}
							></div>
						</div>
					</div>

					{/* Form Container */}
					<div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
						<div
							className={`transition-all duration-300 ${
								isTransitioning
									? "opacity-0 transform translate-x-4"
									: "opacity-100 transform translate-x-0"
							}`}
						>
							{/* Step 1: Interview Basics */}
							{currentStep === 1 && (
								<div className="p-8">
									<div className="text-center mb-8">
										<h2 className="text-3xl font-bold text-gray-900 mb-2">
											Interview Setup
										</h2>
									</div>

									<div className="space-y-6">
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Interview Name
											</label>
											<input
												type="text"
												value={formData.interviewName}
												onChange={(e) =>
													handleInputChange(
														"interviewName",
														e.target.value
													)
												}
												placeholder="e.g. Frontend Role at Google"
												className={`w-full px-4 py-3 border ${formData.interviewName!==""? "border-gray-300" : "border-red-500"} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
											/>
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Number of Questions
											</label>
											<select
												value={formData.numOfQuestions}
												onChange={(e) =>
													handleInputChange(
														"numOfQuestions",
														Number.parseInt(
															e.target.value
														)
													)
												}
												className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
											>
												{[3, 4, 5, 6, 7, 8, 9, 10].map(
													(num) => (
														<option
															key={num}
															value={num}
														>
															{num} Questions
														</option>
													)
												)}
											</select>
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-4">
												Interview Type
											</label>
											<div className="grid grid-cols-3 gap-4">
												{[
													"Technical",
													"Behavioral",
													"Mixed",
												].map((type) => (
													<button
														key={type}
														type="button"
														onClick={() =>
															handleInputChange(
																"interviewType",
																type
															)
														}
														className={`px-4 py-3 rounded-lg border-2 transition-all font-medium cursor-pointer${
															formData.interviewType ===
															type
																? "border-blue-500 bg-blue-50 text-blue-700"
																: "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
														}`}
													>
														{type}
													</button>
												))}
											</div>
										</div>
									</div>

									<div className="flex justify-end mt-8">
										<button
											onClick={handleNext}
											disabled={formData.interviewName === ""}
											className={`px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center space-x-2 ${formData.interviewName==="" ? "cursor-not-allowed opacity-50" :""}`}
										>
											<span>Next</span>
											<FaArrowRight className="w-4 h-4" />
										</button>
									</div>
								</div>
							)}

							{/* Step 2: Job Details */}
							{currentStep === 2 && (
								<div className="p-8">
									<div className="text-center mb-8">
										<h2 className="text-3xl font-bold text-gray-900 mb-2">
											Job Details
										</h2>
										<p className="text-gray-600">
											Help us understand the context of
											the role
										</p>
									</div>

									<div className="space-y-6">
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Role
											</label>
											<input
												type="text"
												value={formData.role}
												onChange={(e) =>
													handleInputChange(
														"role",
														e.target.value
													)
												}
												placeholder="e.g. Software Engineer"
												className={`w-full px-4 py-3 border ${formData.role!==""? "border-gray-300" : "border-red-500"}  rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
											/>
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Experience Level
											</label>
											<div className="grid grid-cols-3 gap-4">
												{[
													"Fresher",
													"Junior",
													"Mid",
													"Senior",
												].map((type) => (
													<button
														key={type}
														type="button"
														onClick={() =>
															handleInputChange(
																"experienceLevel",
																type
															)
														}
														className={`px-4 py-3 rounded-lg border-2 transition-all font-medium cursor-pointer${
															formData.experienceLevel ===
															type
																? "border-blue-500 bg-blue-50 text-blue-700"
																: "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
														}`}
													>
														{type}
													</button>
												))}
											</div>
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Company Name
											</label>
											<input
												type="text"
												value={formData.companyName}
												onChange={(e) =>
													handleInputChange(
														"companyName",
														e.target.value
													)
												}
												placeholder="e.g. Tech Innovations Inc"
												className={`w-full px-4 py-3 border ${formData.companyName!==""? "border-gray-300" : "border-red-500"} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
											/>
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Company Description
											</label>
											<textarea
												value={
													formData.companyDescription
												}
												onChange={(e) =>
													handleInputChange(
														"companyDescription",
														e.target.value
													)
												}
												placeholder="Describe the company's mission, values, and culture"
												rows={4}
												className={`w-full px-4 py-3 border ${formData.companyDescription!==""? "border-gray-300" : "border-red-500"} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none`}
											/>
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Job Description
											</label>
											<textarea
												value={formData.jobDescription}
												onChange={(e) =>
													handleInputChange(
														"jobDescription",
														e.target.value
													)
												}
												placeholder="Paste or describe the role, responsibilities, and requirements"
												rows={6}
												className={`w-full px-4 py-3 border ${formData.jobDescription!==""? "border-gray-300" : "border-red-500"} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none`}
											/>
										</div>
									</div>

									<div className="flex justify-between mt-8">
										<button
											onClick={handleBack}
											className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors flex items-center space-x-2"
										>
											<FaArrowLeft className="w-4 h-4" />
											<span>Back</span>
										</button>
										<button
											onClick={handleNext}
											disabled={(formData.jobDescription==="") || (formData.companyDescription==="") || (formData.companyName==="") || (formData.role==="")}
											className={`px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center space-x-2 ${((formData.jobDescription==="") || (formData.companyDescription==="") || (formData.companyName==="") || (formData.role===""))? "cursor-not-allowed opacity-50" :""}`}
										>
											<span>Next</span>
											<FaArrowRight className="w-4 h-4" />
										</button>
									</div>
								</div>
							)}

							{/* Step 3: Resume & Focus */}
							{currentStep === 3 && (
								<div className="p-8">
									<div className="text-center mb-8">
										<h2 className="text-3xl font-bold text-gray-900 mb-2">
											Almost there!
										</h2>
										<p className="text-gray-600">
											Just a few finishing touches
										</p>
									</div>

									<div className="space-y-8">
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-4">
												Resume
											</label>

											{!formData.resume ? (
												<div
													className={`relative border-2 border-dashed border-red-500 rounded-lg p-8 text-center transition-all ${
														drag
															? "border-blue-500 bg-blue-50"
															: "border-gray-300 hover:border-gray-400"
													}`}
													onDragEnter={handleDrag}
													onDragLeave={handleDrag}
													onDragOver={handleDrag}
													onDrop={handleDrop}
												>
													<FaUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
													<div className="space-y-2">
														<button
															type="button"
															onClick={() =>
																fileInputRef.current?.click()
															}
															className="text-blue-600 hover:text-blue-700 font-medium"
														>
															Upload a file
														</button>
														<span className="text-gray-500">
															{" "}
															or drag and drop
														</span>
													</div>
													<p className="text-sm text-gray-400 mt-2">
														PDF only, up to 5MB
													</p>
													<input
														ref={fileInputRef}
														type="file"
														accept=".pdf"
														onChange={
															handleFileSelect
														}
														className="hidden"
													/>
												</div>
											) : (
												<div className="border border-gray-300 rounded-lg p-4 flex items-center justify-between">
													<div className="flex items-center space-x-3">
														<FaFileAlt className="w-8 h-8 text-red-500" />
														<div>
															<p className="font-medium text-gray-900">
																{
																	formData
																		.resume
																		.name
																}
															</p>
															<p className="text-sm text-gray-500">
																{(
																	formData
																		.resume
																		.size /
																	1024 /
																	1024
																).toFixed(
																	2
																)}{" "}
																MB
															</p>
														</div>
													</div>
													<button
														onClick={removeFile}
														className="text-gray-400 hover:text-gray-600 transition-colors"
													>
														<FaTimes className="w-5 h-5" />
													</button>
												</div>
											)}
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Focus Areas
											</label>
											<textarea
												value={formData.focusAt}
												onChange={(e) =>
													handleInputChange(
														"focusAt",
														e.target.value
													)
												}
												placeholder="e.g. Data Structures, System Design, Leadership"
												rows={4}
												className={`w-full px-4 py-3 border ${formData.focusAt!==""? "border-gray-300" : "border-red-500"} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none`}
											/>
										</div>
									</div>

									<div className="flex justify-between mt-8">
										<button
											onClick={handleBack}
											className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors flex items-center space-x-2"
										>
											<FaArrowLeft className="w-4 h-4" />
											<span>Back</span>
										</button>
										<button
											onClick={handleSubmit}
											disabled={(formData.focusAt==="") || (!formData.resume)}
											className={`px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors ${((formData.focusAt==="") || (!formData.resume)) ? "cursor-not-allowed opacity-50" :""}`}
										>
											Start Interview
										</button>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
