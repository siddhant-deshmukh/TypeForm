import { useContext, useEffect, useState } from 'react'
import EditFormContext from '../EditFormContext'

export default function EditOptions() {
  const { selectedQue, editSelectedQue } = useContext(EditFormContext)
  const [localOptions, setLocalOptions] = useState<{ id: string, option: string }[]>([])

  useEffect(() => {
    if (selectedQue?.options) {
      const localOp = selectedQue.options.map((option) => {
        return { id: selectedQue._id + Math.floor(Math.random() * 100000).toString(), option: option }
      })
      setLocalOptions(localOp)
    }
  }, [selectedQue, setLocalOptions])

  return (
    <div className='flex flex-col items-start'>
      {
        selectedQue && localOptions && localOptions.map(({id, option}, index) => {
          // Math.floor(Math.random() * 100)
          return <div key={id} className='flex items-center pl-2 space-x-3 mt-3 border bg-gray-200'>
            <span>{index + 1}.</span>
            <input
              className='bg-transparent outline-none py-2'
              defaultValue={option}
              onChange={(e) => {
                const newOptions = selectedQue.options?.slice()
                if (newOptions) {
                  newOptions[index] = e.target.value
                  editSelectedQue({ ...selectedQue, options: newOptions })
                }
              }}
            />
            <button
              onClick={() => {
                if (selectedQue.options) {
                  const newOptions = selectedQue.options?.slice(0, index).concat(selectedQue.options?.slice(index + 1))
                  console.log(newOptions)
                  editSelectedQue({ ...selectedQue, options: newOptions })
                }
              }}
              className='hover: hover:bg-slate-50 font-extrabold px-2 h-10'>
              X
            </button>
          </div>
        })
      }

      <button
        className='text-xl mt-20'
        onClick={() => {
          if (selectedQue?.options) {
            const newOptions = selectedQue.options?.concat(["Option " + (selectedQue.options.length + 1)])
            editSelectedQue({ ...selectedQue, options: newOptions })
          }
        }}
      >Add Option +</button>
    </div>

  )
}
