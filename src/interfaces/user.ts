import mongoose, { Document } from 'mongoose';

export default interface IUSER extends Document {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
    name: string;
    password: string;

    todolists: Array<string>;
}
