import { useContext } from 'react'
import EditFormContext from '../EditFormContext'
import EditOptions from './EditOptions'

export default function CenterPanel() {
  const { form, selectedQue, editSelectedQue } = useContext(EditFormContext)

  return (
    <div className='w-full aspect-[1376/788] bg-white flex'>
      <div className='w-full flex items-center'>
        {
          form && !selectedQue &&
          <div className='px-[5%] text-left'>
            <h1 className='text-slate-800 text-2xl mb-5'>{form.title}</h1>
            <h2 className='text-slate-700 text-xl mb-5'>{form.description}</h2>
          </div>
        }
        {
          selectedQue &&
          <div className='px-[5%]'>
            {
              selectedQue.seq_no != undefined &&
              <span className='text-sm mb-2 text-slate-600 font-medium'>Question number {selectedQue.seq_no + 1}.</span>
            }
            <div>
              <input
                className='text-slate-800 text-2xl mb-5 outline-none'
                value={selectedQue.title}
                onChange={(e) => {
                  editSelectedQue({ ...selectedQue, title: e.target.value })
                }} />
            </div>
            {
              (selectedQue.type === "long" || selectedQue.type === "short") &&
              <h2 className='underline text-blue-400 text-4xl'>Type your answer here</h2>
            }
            {
              selectedQue.type === "mcq" &&
              <EditOptions />
            }
          </div>
        }
      </div>
      <img className='h-full w-[40%]' src="/default-img.png" />
    </div>
  )
}
