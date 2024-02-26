import mongoose, { Types } from "mongoose";

interface IFormResponseCreate {
  form_id: Types.ObjectId
  time: number
  formresponse: IQuesRes[]
}

interface IFormResponse extends IFormResponseCreate {
  _id: Types.ObjectId
}

export interface IQuesRes {
  que_id: Types.ObjectId
  answer: string[]
}

const quesResSchema = new mongoose.Schema<IQuesRes>({
  que_id: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: "Question", index: 1 },
  answer: [{ type: String, required: true }]
}, { _id: false })

const formResponseSchema = new mongoose.Schema<IFormResponse>({
  form_id: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: "Form", index: 1 },
  formresponse: [{ type: quesResSchema }],
  time: { type: Number, required: true }
})

const FormResponse = mongoose.model<IFormResponse>("FormResponse", formResponseSchema);
export default FormResponse;