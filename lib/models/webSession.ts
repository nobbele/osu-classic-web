import mongoose from 'mongoose'

export interface IWebSession {
    user_id: number,
    token: string,
}

const webSessionSchema = new mongoose.Schema<IWebSession>({
    user_id: {
        type: Number,
        required: true,
    },
    token: {
        type: String,
        required: true,
    }
});

const WebSession: mongoose.Model<IWebSession & Document> = mongoose.models.WebSession || mongoose.model('WebSession', webSessionSchema);

export default WebSession;