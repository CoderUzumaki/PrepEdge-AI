export default function Privacy() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-12 prose prose-slate">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-[var(--color-muted)] mb-4">Last updated: June 2025</p>

      <section className="space-y-4 text-sm leading-relaxed">
        <h2 className="text-xl font-semibold">Information We Collect</h2>
        <p>We collect account information (name, email) via Firebase Authentication, interview responses, and optionally uploaded resume PDFs stored securely on Cloudinary.</p>

        <h2 className="text-xl font-semibold">How We Use Your Data</h2>
        <p>Your data is used to generate personalized interview questions, evaluate answers, and provide performance reports. Resume content is summarized by AI and cached temporarily.</p>

        <h2 className="text-xl font-semibold">Data Storage</h2>
        <p>Interview data is stored in MongoDB Atlas. Authentication is handled by Firebase. We do not sell your personal data to third parties.</p>

        <h2 className="text-xl font-semibold">Your Rights</h2>
        <p>You may request deletion of your account and associated data by contacting us through the Contact page.</p>

        <h2 className="text-xl font-semibold">Contact</h2>
        <p>For privacy-related inquiries, please use our Contact form.</p>
      </section>
    </div>
  );
}
