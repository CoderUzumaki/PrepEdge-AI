import FAQ from "../components/FAQ";
import ContactForm from "../components/ContactForm";
import faqData from "../data/faqData";

export default function Contact() {
	return (
		<div className="min-h-screen bg-white">
			<section className="py-16 lg:py-20 bg-gray-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
						Get in Touch
					</h1>
					<p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
						Have questions about our platform? Need help with your
						interview preparation? We're here to support you every
						step of the way.
					</p>
				</div>
			</section>

			<section className="py-16" id="contact-form">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="w-4xl mx-auto">
<ContactForm />
                    </div>
				</div>
			</section>

			<section className="py-16 bg-gray-50">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
					<FAQ
						title="Frequently Asked Questions"
						subtitle="Explore answers to most common questions."
						faqs={faqData}
						allowMultipleOpen={false}
					/>
				</div>
			</section>
		</div>
	);
}

