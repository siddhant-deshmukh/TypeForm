import React, { useCallback, useContext, useEffect, useRef, useState } from "react"
import { IQuestion } from "../../../../types"
import EditFormContext from "../../EditFormContext"

function QuestionListElement({ question, index, isSelected }: {
  isSelected: boolean
  question: IQuestion
  index: number
}) {
  const [toggle, setToggle] = useState<boolean>(false)
  const modalRef = useRef<HTMLDivElement | null>(null)
  const { changeSelectedQue, selectedQue, deleteQuestion } = useContext(EditFormContext)

  const handleClickOutside = useCallback((event: Event) => {
    if (event.target && modalRef.current && !modalRef.current.contains(event.target as Node)) {
      // Close the div (change property to hidden)
      setToggle(false)
    }
  }, [modalRef])

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [])

  if (isSelected && selectedQue) {
    return (
      <div className={`'w-full flex items-center space-x-1.5 ${isSelected ? 'bg-gray-100' : 'bg-white'}  hover:bg-gray-100 text-xs'`}>
        <button onClick={() => { changeSelectedQue({ ...selectedQue, seq_no: index }) }} className='flex items-center pl-2.5 py-1.5 h-[58px] w-full'>
          <span className={`px-2 py-0.5  text-xs text-white rounded ${selectedQue.type === "mcq" ? "bg-red-500" : "bg-sky-500"}`}>{index}</span>
          <div className='ml-1.5 text-slate-900 line-clamp-2 text-left '>{selectedQue.title}</div>
        </button>
        <div ref={modalRef} className='relative'>
          <button className="hover:text-slate-900" onClick={() => { setToggle((prev) => !prev) }} >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-6 px-1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
            </svg>
          </button>

          <div hidden={!toggle} className='absolute z-10  top-0 left-9 bg-white border rounded-lg overflow-hidden'>
            <button onClick={() => { setToggle(false) }} className='text-red-500 p-2 text-base hover:bg-red-500 hover:text-white'>
              Delete
            </button>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className={`'w-full flex items-center space-x-1.5 ${isSelected ? 'bg-gray-100' : 'bg-white'}  hover:bg-gray-100 text-xs'`}>
      <button onClick={() => { changeSelectedQue({ ...question, seq_no: index }) }} className='flex items-center pl-2.5 py-1.5 h-[58px] w-full'>
        <span className={`px-2 py-0.5  text-xs text-white rounded ${question.type === "mcq" ? "bg-red-500" : "bg-sky-500"}`}>{index}</span>
        <div className='ml-1.5 text-slate-900 line-clamp-2 text-left '>{question.title}</div>
      </button>
      <div ref={modalRef} className='relative'>
        <button className="hover:text-slate-900" onClick={() => { setToggle((prev) => !prev) }} >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-6 px-1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
          </svg>
        </button>

        <div hidden={!toggle} className='absolute z-10  top-0 left-9 bg-white border rounded-lg overflow-hidden'>
          <button onClick={() => { deleteQuestion(question); setToggle(false) }} className='text-red-500 p-2 text-base hover:bg-red-500 hover:text-white'>
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default React.memo(QuestionListElement)