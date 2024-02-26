import { useEffect, useState } from "react"
import { IQuestion } from "../../types"

export default function QuestionPage({ question, queNo, setResponses }: {
  setResponses: React.Dispatch<React.SetStateAction<Map<string, string | string[] | undefined>>>,
  question: IQuestion
  queNo: number
}) {
  const [textResponse, setTextResponse] = useState<string>("")
  const [optionsResponse, setOptionResponse] = useState<string[]>([])

  useEffect(() => {
    setResponses((prev) => {
      const newMap = new Map(prev)
      newMap.set(question._id, textResponse)
      return newMap
    })
  }, [textResponse, question, setResponses])

  useEffect(() => {
    setResponses((prev) => {
      const newMap = new Map(prev)
      newMap.set(question._id, optionsResponse)
      return newMap
    })
  }, [optionsResponse, question, setResponses])

  return (
    <div className='flex w-full h-screen'>
      <div className='w-[60%] flex items-center'>
        {
          question &&
          <div className='px-[5%] w-full'>
            {
              question.seq_no != undefined &&
              <span className='text-sm mb-2 text-slate-600 font-medium'>Question number {question.seq_no + 1}.</span>
            }
            <div>
              <h1
                className='text-slate-900 text-3xl mb-5 outline-none'
              >{queNo + 1}. {question.title}</h1>
            </div>
            {
              (question.type === "short") &&
              <div className="border-b border-b-blue-800">
                <input
                  value={textResponse}
                  onChange={(e) => {
                    setTextResponse(e.target.value)
                  }}
                  className='text-blue-800 text-3xl py-3  outline-none w-full' placeholder="Type your answer here" />
              </div>
            }
            {
              (question.type === "long") &&
              <div className="border-b border-r border-blue-800">
                <textarea
                  value={textResponse}
                  onChange={(e) => {
                    setTextResponse(e.target.value)
                  }}
                  rows={4}
                  className='text-blue-800 text-3xl py-3  outline-none w-full' placeholder="Type your answer here" />
              </div>
            }
            {
              question.type === "mcq" && question.options &&
              <ul className="flex flex-col space-y-2 items-start">
                {
                  question.options.map((option, index) => {
                    const isOptionSelected = optionsResponse.indexOf(option)
                    return <button
                      key={index}
                      onClick={() => {
                        if (isOptionSelected === -1) {
                          setOptionResponse((prev) => prev.slice().concat([option]))
                        } else {
                          setOptionResponse((prev) => prev.slice().filter((op) => op != option))
                        }
                      }}
                      className="flex items-center p-1.5 pr-3 hover:bg-blue-50 border-blue-800 text-xl space-x-3 border rounded-lg text-blue-800">
                      {
                        isOptionSelected === -1 &&
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                      }
                      {
                        isOptionSelected != -1 &&
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-white fill-blue-800">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                      }
                      <span>{option}</span>
                    </button>
                  })
                }
              </ul>
            }
          </div>
        }
      </div>
      <img className='h-full w-[40%]' src="/default-img.png" />
    </div>
  )
}
