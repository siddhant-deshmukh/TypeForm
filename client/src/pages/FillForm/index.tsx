import axios from 'axios'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'

import { IQuestion } from '../../types'
import QuestionPage from './QuestionPage'
import SubmitForm from './SubmitForm'

export default function FillForm() {
  const { form_id } = useParams()
  const parentRef = useRef<HTMLDivElement | null>(null)

  const [loding, setLoding] = useState<boolean>(false)
  const [questions, setQuestions] = useState<IQuestion[]>([])
  const [currentQuestion, setCurrentQuestion] = useState<number>(0)
  const [responses, setResponses] = useState<(Map<string, string | string[] | undefined>)>(new Map())

  useEffect(() => {
    if (form_id) {
      setLoding(true)
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
    }
  }, [form_id])

  // const scrollParentRef = useCallback((to: "up" | "down") => {
  //   if (to === "up") {
  //     if (currentQuestion > 0 && parentRef.current) {
  //       parentRef.current.scrollTop -= (window.innerHeight)
  //     }
  //     setCurrentQuestion((prev) => prev - 1)
  //   } else {
  //     if (currentQuestion < questions.length && parentRef.current) {
  //       parentRef.current.scrollTop += (window.innerHeight)
  //     }
  //     setCurrentQuestion((prev) => prev + 1)
  //   }
  // }, [parentRef, currentQuestion, questions])

  useEffect(() => {
    if (parentRef.current && currentQuestion >= 0 && currentQuestion <= questions.length) {
      parentRef.current.scrollTop = currentQuestion * (window.innerHeight)
    }
  }, [currentQuestion, questions])


  const NextQuestion = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }, [questions, currentQuestion, setCurrentQuestion])
  const PrevQuestion = useCallback(() => {
    if (currentQuestion < questions.length) {
      setCurrentQuestion((prev) => prev + 1)
    }
  }, [questions, currentQuestion, setCurrentQuestion])


  useEffect(() => {

  }, [setCurrentQuestion])

  return (
    <div ref={parentRef} className='relative w-full h-screen scroll-smooth overflow-y-hidden'>
      {
        questions.map((question, index) => {
          return <QuestionPage key={question._id} setResponses={setResponses} question={question} queNo={index} />
        })
      }
      {
        form_id &&
        <SubmitForm responses={responses} form_id={form_id} />
      }
      <div className='flex fixed bottom-10 right-10'>
        <button
          onClick={() => {
            NextQuestion()
          }}
          className='text-xl font-extrabold bg-blue-700 hover:bg-blue-500 px-5 py-4 text-white'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
          </svg>
        </button>
        <button
          onClick={() => {
            PrevQuestion()
          }}
          className='text-xl font-extrabold bg-blue-700 hover:bg-blue-500 px-5 py-4 text-white border-l '>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </button>
      </div>
    </div >
  )
}
