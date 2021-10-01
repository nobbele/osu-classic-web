import mongoose from 'mongoose'
import Score from './score';

export interface IUser {
    username: string,
    password: string,
    id: number,
    profile_image?: string,

    total_score: number,
    ranked_score: number,
    accuracy: number,
    play_count: number,
    performance_points: number,
}

const userSchema = new mongoose.Schema<IUser>({
    username: { type: String, required: true },
    password: { type: String, required: true },
    id: { type: Number, required: true },
    profile_image: String,

    total_score: { type: Number, default: 0 },
    ranked_score: { type: Number, default: 0 },
    accuracy: { type: Number, default: 1 },
    play_count: { type: Number, default: 0 },
    performance_points: { type: Number, default: 0 },
});

const User: mongoose.Model<IUser & Document> = mongoose.models.User || mongoose.model('User', userSchema);

export default User;

export async function getUserRank(id: number): Promise<number | null> {
    let user = await User.findOne({ id });
    if (!user) {
        return null;
    }

    // TODO more efficient way rank user.
    // TODO - Local cache (redis)?
    // TODO - periodic service on bancho?

    let result = await User.aggregate([
        {
            '$project': {
                '_id': '$_id',
                'performance_points': '$performance_points'
            }
        }, {
            '$sort': {
                'performance_points': -1
            }
        }, {
            '$match': {
                'performance_points': {
                    '$gte': user.performance_points
                }
            }
        }, {
            '$count': 'performance_points'
        }
    ]);

    // This actually returns the pp ranking, not the pp itself
    return result[0].performance_points;
}

export async function recalculateStats(id: number) {
    const user = await User.findOne({ id });
    if (!user) {
        return;
    }

    const userScores = await Score.find({ user_id: user.id, ranked: true });

    user.ranked_score = userScores.reduce((acc, score) => acc + score.total_score, 0);
    // TODO accuracy

    user.save();
}