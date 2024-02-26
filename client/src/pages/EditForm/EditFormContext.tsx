import axios from "axios";
import { IForm, IQuestion } from "../../types";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const EditFormContext = React.createContext<{
  form_id: string | undefined
  loding: boolean,
  isQuestionChange: boolean
  form: IForm | null
  questions: IQuestion[]
  selectedQue: IQuestion | null
  createNewQuestion: () => void
  editSelectedQue: (newQue: IQuestion) => void
  deleteQuestion: (question: IQuestion) => void
  updateTheQuestion: (question: IQuestion) => void
  changeSelectedQue: (newQue: IQuestion | null) => void
  setLoding: React.Dispatch<React.SetStateAction<boolean>>
  setForm: React.Dispatch<React.SetStateAction<IForm | null>>
  setQuestions: React.Dispatch<React.SetStateAction<IQuestion[]>>
  setSelectedQue: React.Dispatch<React.SetStateAction<IQuestion | null>>
}>({
  form: null,
  questions: [],
  loding: false,
  selectedQue: null,
  form_id: undefined,
  isQuestionChange: false,
  setForm: () => { },
  deleteQuestion: () => { },
  createNewQuestion: () => { },
  editSelectedQue: () => { },
  updateTheQuestion: () => { },
  changeSelectedQue: () => { },
  setLoding: () => { },
  setQuestions: () => { },
  setSelectedQue: () => { },
})


export const EditFormProvider = ({ children }: { children: React.ReactNode }) => {

  const { form_id } = useParams()

  const [loding, setLoding] = useState<boolean>(false)
  const [form, setForm] = useState<IForm | null>(null)
  const [questions, setQuestions] = useState<IQuestion[]>([])
  const [selectedQue, setSelectedQue] = useState<IQuestion | null>(null)
  const [isQuestionChange, setIsQuestionChanged] = useState<boolean>(false)


  useEffect(() => {
    setLoding(true)
    axios.get(`${import.meta.env.VITE_API_URL}/f/${form_id}`, { withCredentials: true })
      .then(({ status, data }) => {
        if (status === 200 && data.form) {
          // console.log(status, data)
          setForm(data.form)

          axios.get(`${import.meta.env.VITE_API_URL}/f/q/${form_id}`, { withCredentials: true })
            .then(({ status, data }) => {
              if (status === 200 && data.questions) {
                setQuestions(data.questions)
              } else
                throw { status, data };
            }).catch((err) => {
              console.error("While getting questions", err)
            }).finally(() => {
              setLoding(false)
            })
        } else
          throw { status, data };
      }).catch((err) => {
        console.error("While fetching form", err)
        setLoding(false)
      })

  }, [form_id])

  const deleteQuestion = useCallback((question: IQuestion) => {
    axios.delete(`${import.meta.env.VITE_API_URL}/q/${form_id}/${question._id}`, { withCredentials: true })
      .then(({ status }) => {
        if (status === 200) {
          // let queNumber = 0
          // questions.forEach((que, index) => {
          //   if (que._id === question._id) {
          //     queNumber = index
          //   }
          // })
          setSelectedQue(null)

          setQuestions((prev) => {
            return prev.slice().filter((que) => question._id != que._id)
          })
        }
      }).catch(() => {

      })
  }, [form_id, questions, setQuestions, setSelectedQue])

  const createNewQuestion = useCallback(() => {
    axios.post(`${import.meta.env.VITE_API_URL}/q/${form_id}`, {
      "title": "New Question",
      "description": "",
      "type": "short",
      "maxLength": "1",
    }, { withCredentials: true })
      .then(({ status, data }) => {
        if (status === 201 && data.question) {
          setSelectedQue({ ...data.question, seq_no: questions.length })
          setQuestions((prev) => {
            const newQuestion: IQuestion = { ...data.question, seq_no: prev.length }
            return prev.slice().concat([newQuestion])
          })
        } else
          throw { status, data };
      }).catch((err) => {
        console.error("While creating new question", err)
      })
  }, [form_id, questions, setQuestions, setSelectedQue])

  const updateTheQuestion = useCallback(async (question: IQuestion) => {
    // console.log(question)
    try {
      const { status, data } = await axios.put(`${import.meta.env.VITE_API_URL}/q/${form_id}/${question._id}`, {
        ...question
      }, { withCredentials: true })
      console.log(status, data)
      setIsQuestionChanged(false)

      return true
    } catch (err) {
      console.error("While updating question", question._id, err)
      return false
    }
  }, [form_id, setIsQuestionChanged])

  const changeSelectedQue = useCallback((newQue: IQuestion | null) => {
    // console.log(newQue)
    if (selectedQue) {
      updateTheQuestion(selectedQue).then((value) => {
        if (value)
          setSelectedQue(newQue);
        else
          console.error("Unable to update the question")
      })
    } else {
      setSelectedQue(newQue)
    }
    // if (newQue)
    //   setSelectedQue({ ...newQue });
    // else
    //   setSelectedQue(newQue);
  }, [selectedQue, setSelectedQue])

  const editSelectedQue = useCallback((newQue: IQuestion) => {
    setSelectedQue(newQue)
    setQuestions((prev) => {
      const newQuestions = prev.slice()
      if (newQue.seq_no) {
        newQuestions[newQue.seq_no] = newQue
      }

      console.log(newQue.seq_no, newQuestions.map((que) => { return que.options?.join("-") }))
      return newQuestions
    })
    setIsQuestionChanged(true)
  }, [selectedQue, setSelectedQue, setIsQuestionChanged])

  return (
    <EditFormContext.Provider value={{
      form_id,
      isQuestionChange,
      createNewQuestion, deleteQuestion,
      updateTheQuestion, changeSelectedQue, editSelectedQue,
      form, setForm,
      loding, setLoding,
      questions, setQuestions,
      selectedQue, setSelectedQue,
    }}>
      {children}
    </EditFormContext.Provider>
  )
}

export default EditFormContext