import mongoose, { Schema } from 'mongoose';
import ITODO from '../interfaces/todo';

const TodoSchema: Schema = new Schema(
    {
        name: { type: String, require: true },
        completed: { type: Boolean || null, require: true },
        date: { type: Date || null, required: true },
        list_id: { type: String, required: true },
        user_id: { type: String, required: true }
    },
    {
        timestamps: true
    }
);

export default mongoose.model<ITODO>('Todo', TodoSchema);
