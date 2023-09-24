/*

user 
- id
- name
- email, 
- todolist_id


todolist 
- id 
- name
- user_id
- todolist array 
  -> stores todos

todo 
- id 
- name
- completed
- date
  -> date or null
*/

import mongoose, { Schema } from 'mongoose';
import ITODOLIST from '../interfaces/todolist';

const TodolistSchema: Schema = new Schema(
    {
        name: { type: String, require: true },
        user_id: { type: String, require: true },
        todos: { type: Array, required: true }
    },
    {
        timestamps: true
    }
);

export default mongoose.model<ITODOLIST>('Todolist', TodolistSchema);
