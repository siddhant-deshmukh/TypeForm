import { useContext } from "react"
import EditFormContext from "../EditFormContext"
import { IQuestion } from "../../../types"

export default function QuestionSetting() {
  const { selectedQue, editSelectedQue } = useContext(EditFormContext)

  const queTypes: IQuestion['type'][] = ["short", "long", "mcq"]
  return (
    <div className="bg-white min-w-64 max-w-64 px-2.5 py-5">

      <h6 className="font-medium text-slate-800">Question Setting</h6>
      {
        !selectedQue &&
        <p className="text-sm text-slate-700 mt-5">Select a question from left pannel</p>
      }
      {
        selectedQue &&
        <div>
          <div className="max-w-sm mx-auto mt-10">
            <label htmlFor="ques-type" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select Question Type</label>
            <select
              value={selectedQue.type}
              onChange={(e) => {
                editSelectedQue({...selectedQue, type: e.target.value as IQuestion['type']})
              }}
              id="ques-type" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg outline-none  block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white">
              {
                queTypes.map((type, index) => {
                  return <option key={index} value={type}>{type}</option>
                })
              }

            </select>
          </div>

        </div>
      }
    </div>
  )
}
