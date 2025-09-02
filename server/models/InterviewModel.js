import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema({
	user_id: {
		type: String,
		required: true,
		trim: true,
	},

	interview_name: {
		type: String,
		required: true,
		trim: true,
	},
	num_of_questions: {
		type: Number,
		required: true,
		default: 3,
		min: 3,
		max: 10,
	},
	interview_type: {
		type: String,
		enum: ["technical", "behavioral", "mixed"],
		required: true,
	},

	company_name: {
		type: String,
		trim: true,
	},
	company_description: {
		type: String,
		trim: true,
	},
    role: {
		type: String,
		required: true,
		trim: true,
	},
	experience_level: {
        type: String,
        enum: ["fresher", "junior", "mid", "senior"],
        default: "fresher",
    },
	job_description: {
		type: String,
		trim: true,
	},

	resume_link: {
		type: String,
		trim: true,
	},
	focus_area: {
		type: String,
		trim: true,
	},

		questions: [
			{
				question: {
					type: String,
					required: true,
					trim: true,
				},
				preferred_answer: {
					type: String,
					required: true,
					trim: true,
				},
				difficulty: {
					type: String,
					enum: ["easy", "medium", "hard"],
					default: "medium",
				},
				topics: {
					type: [String],
					default: [],
				},
				company_tags: {
					type: [String],
					default: [],
				},
				bookmarkedBy: {
					type: [String], // user IDs who bookmarked
					default: [],
				},
			},
		],

	created_at: {
		type: Date,
		default: Date.now,
	},
});

const Interview = mongoose.model("Interview", interviewSchema);
export default Interview;
