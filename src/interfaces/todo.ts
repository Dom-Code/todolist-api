import { Document } from 'mongoose';

export default interface ITODO extends Document {
    name: string;
    completed: boolean;
    date: Date | null;
    user_id: string;
    list_id: string;
}
