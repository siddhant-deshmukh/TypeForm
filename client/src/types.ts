export interface IUserCreate {
  name: string,
  email: string,
  password?: string,
}
export interface IUser extends IUserCreate {
  _id: string,
}

export interface IFormCreate {
  title: string
  description: string
  type?: string
  settings?: any
}
export interface IFormSnippet {
  _id: string
  title: string
  description: string
  type?: string
}
export interface IForm extends IFormCreate {
  _id: string
  questions: string[]
  author_id: string
}

export interface IQuestionCreate {
  title: string
  form_id: string
  description: string
  // seq_number: number
  imgUrl: string
  type: "short" | "long" | "mcq"
  maxLength?: number
  options?: string[]
}

export interface IQuestion extends IQuestionCreate {
  _id: string
  author_id: string
  seq_no?: number
}