import { useContext } from 'react'
import QuestionListElemnt from './QuestionListElemnt'
import EditFormContext from '../../EditFormContext'

export default function QuesListSidebar() {
  const { questions, selectedQue, isQuestionChange, updateTheQuestion, createNewQuestion } = useContext(EditFormContext)
  return (
    <div className='min-w-64 max-w-64 flex flex-col flex-nowrap h-full  py-5 border-r'>
      <div className='w-full text-xl px-2.5 flex justify-between items-center'>
        <span>Content</span>
        <button
          onClick={() => {
            createNewQuestion()
          }}
          className=' font-extrabold bg-slate-900 text-white rounded-md px-3 py-1'>+</button>
      </div>
      <div className='flex flex-col mt-5'>
        {
          questions.map((question, index) => {
            return <QuestionListElemnt isSelected={question._id === selectedQue?._id} question={question} index={index} key={question._id} />
          })
        }
      </div>

      <div className='px-2 mt-auto pb-3'>
        <button
          onClick={() => {
            if (selectedQue) {
              updateTheQuestion(selectedQue)
            }
          }}
          disabled={!isQuestionChange}
          className={`${isQuestionChange ? "bg-slate-900" : "bg-slate-400"} text-white w-full py-2 rounded-lg`}>
          Update the Question
        </button>
      </div>
    </div>
  )
}


