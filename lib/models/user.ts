import mongoose from 'mongoose'

export interface IUser {
    username: string,
    user_id: number,
    profile_image?: string,

    total_score: number,
    ranked_score: number,
    accuracy: number,
    play_count: number,
    performance_points: number,
}

const userSchema = new mongoose.Schema<IUser>({
    username: { type: String, required: true },
    user_id: { type: Number, required: true },
    profile_image: String,

    total_score: { type: Number, default: 0 },
    ranked_score: { type: Number, default: 0 },
    accuracy: { type: Number, default: 1 },
    play_count: { type: Number, default: 0 },
    performance_points: { type: Number, default: 0 },
});

const User: mongoose.Model<IUser & Document> = mongoose.models.User || mongoose.model('User', userSchema);

export default User;