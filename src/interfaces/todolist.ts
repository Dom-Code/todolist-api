import { Document } from 'mongoose';

export default interface ITODOLIST extends Document {
    name: string;
    user_id: string;
    todos: Array<{}>;
}
