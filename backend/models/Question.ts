import mongoose, { Types } from "mongoose";

interface IQuestionCreate {
  title: string
  author_id: Types.ObjectId
  form_id: Types.ObjectId
  description: string
  seq_number: number
  imgUrl: string
}

interface IQuestion extends IQuestionCreate {
  _id: Types.ObjectId
}

const questionSchema = new mongoose.Schema<IQuestion>({
  title: { type: String, required: true, maxlength: 50, minlength: 1 },
  description: { type: String, required: true, maxlength: 300, minlength: 0 },
  author_id: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: "User", index: 1 },
  form_id: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: "Form", index: 1 },
  seq_number: { type: Number, required: true },
})

// questionSchema.index({ form_id: 1, seq_number: 1 }, { unique: true })

const Question = mongoose.model<IQuestion>("Question", questionSchema);
export default Question;