import mongoose from 'mongoose'

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

const BeatmapSet: mongoose.Model<IBeatmapSet & Document> = mongoose.models.BeatmapSet || mongoose.model('BeatmapSet', beatmapSetSchema);

export default BeatmapSet;