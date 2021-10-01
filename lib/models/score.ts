import mongoose from 'mongoose'
const AutoIncrement = require('mongoose-sequence')(mongoose);

// TODO gamemode

export interface IScore {
    id: number,
    beatmap_id: number,
    user_id: number,
    total_score: number,
    max_combo: number,
    count_50: number,
    count_100: number,
    count_300: number,
    count_miss: number,
    count_katu: number,
    count_geki: number,
    played_at: Date,
    ranked: boolean,
}

const scoreSchema = new mongoose.Schema<IScore>({
    beatmap_id: { type: Number, required: true },
    user_id: { type: Number, required: true },
    total_score: { type: Number, required: true },
    max_combo: { type: Number, required: true },
    count_50: { type: Number, required: true },
    count_100: { type: Number, required: true },
    count_300: { type: Number, required: true },
    count_miss: { type: Number, required: true },
    count_katu: { type: Number, required: true },
    count_geki: { type: Number, required: true },
    played_at: { type: Date, required: true },
    ranked: { type: Boolean, required: true }
});

if (!mongoose.models.Score) {
    scoreSchema.plugin(AutoIncrement, { inc_field: 'id' });
}

const Score: mongoose.Model<IScore & Document> = mongoose.models.Score || mongoose.model('Score', scoreSchema);

export default Score;