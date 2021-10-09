import mongoose from 'mongoose'
const AutoIncrement = require('mongoose-sequence')(mongoose);

// TODO gamemode

export interface IBeatmap {
    id: number,
    checksum: string,
    filename: string,
    metadata: {
        title: string,
    },
}

const beatmapSchema = new mongoose.Schema<IBeatmap>({
    id: { type: Number, required: true },
    checksum: { type: String, required: true },
    filename: { type: String, required: true },
    metadata: {
        type: {
            title: String,
        }, default: {
            title: "Unknown Title"
        }
    }
});

export interface IBeatmapSet {
    id: number,
    beatmaps: IBeatmap[],
}

const beatmapSetSchema = new mongoose.Schema<IBeatmapSet>({
    id: { type: Number, required: true },
    beatmaps: [{ type: beatmapSchema, required: true }]
});

if (!mongoose.models.BeatmapSet) {
    beatmapSetSchema.plugin(AutoIncrement, {
        id: 'beatmap_set_id_seq',
        inc_field: 'id',
        disable_hooks: true
    });

    beatmapSchema.plugin(AutoIncrement, {
        id: 'beatmap_id_seq',
        inc_field: 'id',
        disable_hooks: true
    });
}

const BeatmapSet: mongoose.Model<IBeatmapSet & Document> = mongoose.models.BeatmapSet || mongoose.model('BeatmapSet', beatmapSetSchema);

export default BeatmapSet;