import mongoose, { Schema } from 'mongoose';
import Refresh from '../interfaces/refresh';

const RefreshSchema: Schema = new Schema(
    {
        token: { type: String, require: true },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        expiryDate: {
            type: Date,
            required: true
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model<Refresh>('Refresh_Tokens', RefreshSchema);
