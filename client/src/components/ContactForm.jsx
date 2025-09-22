import { useState } from "react";
import axios from "axios";
import { FaPaperPlane } from "react-icons/fa";
import { variantsContext } from "../context/motionContext";
import { useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function ContactForm() {
	const sharedData = useContext(variantsContext);
  const { textvariant} =
    sharedData;

		const [showSelect, setShowSelect]=useState(true)



	const containerVariant={
		 hidden:{heigh:0, opacity:0},
    	visible:{heigh:'auto', opacity:1 ,
            transition:{when:'beforeChildren', delay: 1, duration: 1, ease: "easeOut",
							delayChildren:0.4, staggerChildren:0.3, staggerDirection:1
						},
           },
			exit:{heigh:0, opacity:0, 
				transition:{when:'afterChildren', staggerDirection:-1}
			} 
	}

	const childVariant={
			hidden:{x:-20, opacity:0},
			visible:{x:0, opacity:1,
				transition:{ease:'easeOut', duration:0.6}
			}
	}


	const [formData, setFormData] = useState({
		name: "",
		email: "",
		subject: "",
		category: "general",
		message: "",
	});

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);

	const categories = [
		{ value: "general", label: "General Inquiry" },
		{ value: "feature", label: "Feature Request" },
		{ value: "bug", label: "Bug Report" },
		{ value: "collaboration", label: "Collaboration" },
	];

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			const response = await axios.post(
				`${import.meta.env.VITE_API_URL}/api/contact`,
				formData,
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			setIsSubmitted(true);
			setTimeout(() => {
				setIsSubmitted(false);
				setFormData({
					name: "",
					email: "",
					subject: "",
					category: "general",
					message: "",
				});
			}, 5000);
		} catch (error) {
			console.error("Error submitting contact form:", error);
			alert(
				"There was an error submitting your message. Please try again later."
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isSubmitted) {
		return (
			<div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
				<div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
					<FaPaperPlane className="w-8 h-8 text-blue-600" />
				</div>
				<h3 className="text-2xl font-bold text-gray-900 mb-2">
					Message Sent!
				</h3>
				<p className="text-gray-600">
					Thank you for reaching out. We'll get back to you within 24
					hours.
				</p>
			</div>
		);
	}

	return (
		<div className="bg-white rounded-lg border border-gray-200 p-8 max-w-4xl">
			<motion.h2 
			initial="hidden"
      whileInView="visible"
      variants={textvariant}
      viewport={{ amount: 0.5, once: true }}
			className="text-2xl font-bold text-gray-900 mb-6">
				Send us a Message
			</motion.h2>

			<form onSubmit={handleSubmit} className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<motion.label
							initial="hidden"
              whileInView="visible"
              variants={textvariant}
              viewport={{ amount: 0.5, once: true }}
							htmlFor="name"
							className="block text-sm font-medium text-gray-700 mb-2"
						>
							Full Name <span className="text-red-600">*</span>
						</motion.label>
						<motion.input
						  initial="hidden"
              whileInView="visible"
              variants={textvariant}
              viewport={{ amount: 0.5, once: true }}
							type="text"
							id="name"
							name="name"
							value={formData.name}
							onChange={handleChange}
							required
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
							placeholder="Your full name"
						/>
					</div>
					<div>
						<motion.label
						initial="hidden"
              whileInView="visible"
              variants={textvariant}
              viewport={{ amount: 0.5, once: true }}
							htmlFor="email"
							className="block text-sm font-medium text-gray-700 mb-2"
						>
							Email Address{" "}
							<span className="text-red-600">*</span>
						</motion.label>
						<motion.input
							type="email"
							id="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							required
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
							placeholder="your.email@example.com"
						/>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<motion.label
						initial="hidden"
              whileInView="visible"
              variants={textvariant}
              viewport={{ amount: 0.5, once: true }}
							htmlFor="category"
							className="block text-sm font-medium text-gray-700 mb-2"
						>
							Category
						</motion.label>
							<motion.select
							initial="hidden"
              animate="visible"
							exit='exit'
              variants={containerVariant}
							id="category"
							name="category"
							value={formData.category}
							onChange={handleChange}
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
						>
							{categories.map((category) => (
								<option
									key={category.value}
									value={category.value}
								>
									{category.label}
								</option>
							))}
						</motion.select>
						
					</div>
					<div>
						<motion.label
						initial="hidden"
              whileInView="visible"
              variants={textvariant}
              viewport={{ amount: 0.5, once: true }}
							htmlFor="subject"
							className="block text-sm font-medium text-gray-700 mb-2"
						>
							Subject <span className="text-red-600">*</span>
						</motion.label>
						<motion.input
						initial="hidden"
              whileInView="visible"
              variants={textvariant}
              viewport={{ amount: 0.5, once: true }}
							type="text"
							id="subject"
							name="subject"
							value={formData.subject}
							onChange={handleChange}
							required
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
							placeholder="Brief description of your inquiry"
						/>
					</div>
				</div>
				<div>
					<motion.label
					initial="hidden"
              whileInView="visible"
              variants={textvariant}
              viewport={{ amount: 0.5, once: true }}
						htmlFor="message"
						className="block text-sm font-medium text-gray-700 mb-2"
					>
						Message <span className="text-red-600">*</span>
					</motion.label>
					<motion.textarea
					initial="hidden"
              whileInView="visible"
              variants={textvariant}
              viewport={{ amount: 0.5, once: true }}
						id="message"
						name="message"
						value={formData.message}
						onChange={handleChange}
						required
						rows={6}
						className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
						placeholder="Please provide details about your inquiry..."
					/>
				</div>
				<motion.button
							initial="hidden"
              whileInView="visible"
              variants={textvariant}
              viewport={{ amount: 0.5, once: true }}
					type="submit"
					disabled={isSubmitting}
					className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
				>
					{isSubmitting ? (
						<>
							<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
							<span>Sending...</span>
						</>
					) : (
						<>
							<FaPaperPlane className="w-4 h-4" />
							<span>Send Message</span>
						</>
					)}
				</motion.button>
			</form>
		</div>
	);
}
