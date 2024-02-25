import mongoose, { Types } from "mongoose";

interface IFormCreate {
  title: string
  author_id: Types.ObjectId
  description: string
  type?: string
  settings?: any
  num_questions: number
}

interface IForm extends IFormCreate {
  _id: Types.ObjectId
}

const formSchema = new mongoose.Schema<IForm>({
  title: { type: String, required: true, maxlength: 50, minlength: 1 },
  description: { type: String, maxlength: 300},
  author_id: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: "User", index: 1 },
  num_questions: { type: Number, default: 0 }
})

const Form = mongoose.model<IForm>("Form", formSchema);
export default Form;