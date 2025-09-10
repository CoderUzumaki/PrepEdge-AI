
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firebase_user_id: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    tier: {
        type: String,
        enum: ['basic', 'pro', 'ultimate'],
        default: 'basic',
        required: true
    },
    badges: {
        type: [String],
        default: [],
    },
    streak: {
        type: Number,
        default: 0,
    },
    leaderboardPoints: {
        type: Number,
        default: 0,
    },
    bookmarks: {
        type: [{
            type: String, // Can be resource/question/interview ID
        }],
        default: [],
    },
    created_at: {
        type: Date,
        default: Date.now
    },
});

const User = mongoose.model('User', userSchema);
export default User;