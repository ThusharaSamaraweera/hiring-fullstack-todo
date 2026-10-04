import { Schema, model, type InferSchemaType, type Types } from 'mongoose';

const todoSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, trim: true, maxlength: 1000, default: '' },
    done: { type: Boolean, required: true, default: false, index: true },
  },
  { timestamps: true },
);

todoSchema.index({ createdAt: -1, _id: -1 });

export type TodoDocument = InferSchemaType<typeof todoSchema> & { _id: Types.ObjectId };
export const TodoModel = model('Todo', todoSchema);
