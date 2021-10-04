import mongoose from 'mongoose'
const AutoIncrement = require('mongoose-sequence')(mongoose);

export interface IBeatmapSubmit {
    id: number,
}

const beatmapSchema = new mongoose.Schema<IBeatmapSubmit>({});

if (!mongoose.models.BeatmapSetSubmit) {
    beatmapSchema.plugin(AutoIncrement, {
        id: 'beatmap_id_seq',
        inc_field: 'id'
    });
}

export interface IBeatmapSetSubmit {
    id: number,
    creator_id: number,
    beatmaps: IBeatmapSubmit[],
}

const beatmapSetSubmitSchema = new mongoose.Schema<IBeatmapSetSubmit>({
    creator_id: { type: Number, required: true },
    beatmaps: [{ type: beatmapSchema, required: true }]
});

if (!mongoose.models.BeatmapSetSubmit) {
    beatmapSetSubmitSchema.plugin(AutoIncrement, {
        id: 'beatmap_set_id_seq',
        inc_field: 'id'
    });
}

const BeatmapSetSubmit: mongoose.Model<IBeatmapSetSubmit & Document> = mongoose.models.BeatmapSetSubmit || mongoose.model('BeatmapSetSubmit', beatmapSetSubmitSchema);

export default BeatmapSetSubmit;