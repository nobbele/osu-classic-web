import mongoose from 'mongoose'
const AutoIncrement = require('mongoose-sequence')(mongoose);

// TODO gamemode

export interface IBeatmap {
    id: number,
    checksum: string,
    filename: string,
    creator: string,
}

const beatmapSchema = new mongoose.Schema<IBeatmap>({
    id: { type: Number },
    checksum: { type: String },
    filename: { type: String },
    creator: { type: String }
}, { _id: false });

export interface IBeatmapMetadata {
    title: string,
}

const beatmapMetadataSchema = new mongoose.Schema<IBeatmapMetadata>({
    title: { type: String }
}, { _id: false });

export interface IBeatmapSet {
    id: number,
    uploader_id: number,
    beatmaps: IBeatmap[],
    status: string,
    metadata: IBeatmapMetadata,
}

const beatmapSetSchema = new mongoose.Schema<IBeatmapSet>({
    id: { type: Number },
    uploader_id: { type: Number, required: true },
    beatmaps: [{ type: beatmapSchema, required: true }],
    status: { type: String, required: true },
    metadata: {
        type: beatmapMetadataSchema, default: {}
    },
});

if (!mongoose.models.BeatmapSet) {
    beatmapSetSchema.plugin(AutoIncrement, {
        id: 'beatmap_set_id_seq',
        inc_field: 'id',
        //disable_hooks: true
    });
}

if (!mongoose.models.Beatmap) {
    beatmapSchema.plugin(AutoIncrement, {
        id: 'beatmap_id_seq',
        inc_field: 'id',
        //disable_hooks: true,
    });
}

const BeatmapSet: mongoose.Model<IBeatmapSet & Document> = mongoose.models.BeatmapSet || mongoose.model('BeatmapSet', beatmapSetSchema);
const Beatmap: mongoose.Model<IBeatmap & Document> = mongoose.models.Beatmap || mongoose.model('Beatmap', beatmapSchema);

export default BeatmapSet;
export { Beatmap };