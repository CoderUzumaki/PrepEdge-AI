import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGithub, FaGoogle, FaEyeSlash, FaEye } from "react-icons/fa";
import Toast from "../components/Toast";
import {useAuth} from "../context/AuthContext"
import {
	auth,
	googleProvider,
	signInWithPopup,
	signInWithEmailAndPassword,
} from "../firebase";
import { GithubAuthProvider } from "firebase/auth";
import axios from "axios";

export default function Login() {
	const githubProvider = new GithubAuthProvider();
	const {	user, setUser } = useAuth();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [validation, setValidation] = useState({
		name: "untouched",
		email: "untouched",
		password: "untouched",
	});
	const [toast, setToast] = useState({
		show: false,
		message: "",
		type: "success",
	});

	const navigate = useNavigate();

	const validateEmail = (value) => {
		if (value.trim() === "") return "empty";
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(value) ? "valid" : "invalid";
	};

	const validatePassword = (value) => {
		if (value === "") return "empty";
		return "valid";
	};

	const handleEmailChange = (value) => {
		setEmail(value);
		setValidation((prev) => ({
			...prev,
			email: validateEmail(value),
		}));
	};

	const handlePasswordChange = (value) => {
		setPassword(value);
		setValidation((prev) => ({
			...prev,
			password: validatePassword(value),
		}));
	};

	const getRingColor = (fieldValidation) => {
		switch (fieldValidation) {
			case "empty":
				return "focus:ring-orange-500 focus:border-orange-500";
			case "invalid":
				return "focus:ring-red-500 focus:border-red-500 ring-2 ring-red-500 border-red-500";
			case "valid":
				return "focus:ring-blue-500 focus:border-blue-500";
			default:
				return "focus:ring-blue-500 focus:border-blue-500";
		}
	};

	const showToast = (message, type) => {
		setToast({ show: true, message, type });
	};

	const hideToast = () => {
		setToast((prev) => ({ ...prev, show: false }));
	};

	const handleEmailLogin = async () => {
		const emailValidation = validateEmail(email);
		const passwordValidation = validatePassword(password);

		setValidation({
			email: emailValidation,
			password: passwordValidation,
		});

		if (emailValidation !== "valid" || passwordValidation !== "valid") {
			showToast("Please fill in all fields correctly", "error");
			return;
		}

		try {
			const userCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);
			const idToken = await userCredential.user.getIdToken();
			await axios.post(
				`${import.meta.env.VITE_API_URL}/api/auth/login`,
				{},
				{
					headers: {
						Authorization: `Bearer ${idToken}`,
					},
				}
			);

			setUser(userCredential.user);
			console.log("User logged in:", user);
			showToast("Logged in successfully!", "success");
			setTimeout(() => {
				navigate("/");
			}, 500);
		} catch (err) {
			showToast(err.message || "An error occurred during login", "error");
		}
	};

	const handleGoogleLogin = async () => {
		try {
			const result = await signInWithPopup(auth, googleProvider);
			const idToken = await result.user.getIdToken();
			await axios.post(
				`${import.meta.env.VITE_API_URL}/api/auth/login`,
				{},
				{
					headers: {
						Authorization: `Bearer ${idToken}`,
					},
				}
			);

			setUser(result.user);
			console.log("User logged in:", user);
			showToast("Logged in successfully!", "success");
			setTimeout(() => {
				navigate("/");
			}, 2000);
		} catch (err) {
			showToast(
				err.message || "An error occurred during Google login",
				"error"
			);
		}
	};

	//for github login
	const handleGithubLogin = async () => {
		try {
			const result = await signInWithPopup(auth, githubProvider);
			const credential = GithubAuthProvider.credentialFromResult(result);
			const token = credential.accessToken;

			const idToken = await result.user.getIdToken();
			await axios.post(
				`${import.meta.env.VITE_API_URL}/api/auth/login`,
				{},
				{
					headers: {
						Authorization: `Bearer ${idToken}`,
					},
				}
			);

			setUser(result.user); // Set the authenticated user
			showToast("Successfully signed in with GitHub!", "success");

			setTimeout(() => {
				navigate("/");
			}, 2000);
		} catch (err) {
			const msg =
			err?.code === "auth/account-exists-with-different-credential" 
				? "An account already exists with the same email using a different sign-in method. Please log in with that provider." 
				: (err?.message || "An error occurred during GitHub login");
			showToast(msg, "error");
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 min-w-screen">
			{toast.show && (
				<Toast
					message={toast.message}
					type={toast.type}
					onClose={hideToast}
				/>
			)}

			<main className="flex items-center justify-center min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8">
				<div className="w-full max-w-md">
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
						<div className="text-center mb-8">
							<h1 className="text-2xl font-bold text-gray-900">
								Login to your account
							</h1>
						</div>

						<form
							className="space-y-6"
							onSubmit={(e) => e.preventDefault()}
						>
							<div>
								<label
									htmlFor="email"
									className="block text-sm font-medium text-gray-700 mb-1"
								>
									Email address
								</label>
								<input
									id="email"
									type="email"
									value={email}
									onChange={(e) =>
										handleEmailChange(e.target.value)
									}
									placeholder="Enter your email"
									className={`w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none transition-all ${getRingColor(
										validation.email
									)}`}
								/>
								{validation.email === "invalid" && (
									<p className="mt-1 text-sm text-red-600">
										Please enter a valid email address
									</p>
								)}
								{validation.email === "empty" && (
									<p className="mt-1 text-sm text-orange-600">
										Email is required
									</p>
								)}
							</div>

							<div>
								<label
									htmlFor="password"
									className="block text-sm font-medium text-gray-700 mb-1"
								>
									Password
								</label>
								<div className="relative">
									<input
										id="password"
										type={
											showPassword ? "text" : "password"
										}
										value={password}
										onChange={(e) =>
											handlePasswordChange(e.target.value)
										}
										placeholder="Enter your password"
										className={`w-full px-3 py-2 pr-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none transition-all ${getRingColor(
											validation.password
										)}`}
									/>
									<button
										type="button"
										onClick={() =>
											setShowPassword(!showPassword)
										}
										className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
									>
										{showPassword ? (
											<FaEyeSlash className="w-4 h-4" />
										) : (
											<FaEye className="w-4 h-4" />
										)}
									</button>
								</div>
								{validation.password === "invalid" && (
									<p className="mt-1 text-sm text-red-600">
										Password must be at least 6 characters
										long
									</p>
								)}
								{validation.password === "empty" && (
									<p className="mt-1 text-sm text-orange-600">
										Password is required
									</p>
								)}
								<div className="text-right mt-2">
									<Link
										to="#"
										className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
									>
										Forgot password?
									</Link>
								</div>
							</div>

							<button
								type="submit"
								onClick={handleEmailLogin}
								className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
							>
								Login
							</button>
						</form>

						<div className="mt-6">
							<div className="relative">
								<div className="absolute inset-0 flex items-center">
									<div className="w-full border-t border-gray-300"></div>
								</div>
								<div className="relative flex justify-center text-sm">
									<span className="px-2 bg-white text-gray-500">
										Or continue with
									</span>
								</div>
							</div>

							<div className="mt-6 grid grid-cols-2 gap-3">
								<button
									onClick={handleGithubLogin}
									className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
									<FaGithub className="w-4 h-4 mr-2" />
									Github
								</button>
								<button
									onClick={handleGoogleLogin}
									className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
								>
									<FaGoogle className="w-4 h-4 mr-2" />
									Google
								</button>
							</div>
						</div>

						<div className="mt-6 text-center">
							<p className="text-sm text-gray-600">
								{"Don't have an account? "}
								<Link
									to="/signup"
									className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
								>
									Sign Up
								</Link>
							</p>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
