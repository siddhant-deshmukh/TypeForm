import axios from "axios"
import { useCallback, useState } from "react"

export default function SubmitForm({ form_id, responses, setSubmitted }: {
  form_id: string
  setSubmitted: React.Dispatch<React.SetStateAction<boolean>>
  responses: Map<string, string | string[] | undefined>
}) {


  const handleSubmit = useCallback(() => {

    console.log(responses)
    const form_response: any[] = []
    if (responses) {
      responses.forEach((answer, que_id) => {
        form_response.push({ que_id, answer: (Array.isArray(answer) ? answer : [answer]) })
      })
    }

    axios.post(`${import.meta.env.VITE_API_URL}/r/${form_id}`, {
      form_response: form_response
    }, { withCredentials: true }).then(({ status, data }) => {
      console.log(status, data)
      if (status === 201 && data.resId) {
        setSubmitted(true)
        localStorage.setItem(form_id, data.resId)
      }
    }).catch((err) => {
      console.log("While submitting form", err)
    })

  }, [responses, form_id])

  return (
    <div className='flex w-full h-screen'>
      <div className='w-[60%] flex items-center px-[5%]'>
        <div>
          <h1 className="text-2xl text-slate-600 font-semibold">Are you sure that you wanted to submit this form?</h1>

          <button
            onClick={() => { handleSubmit() }}
            className="bg-blue-700 hover:bg-blue-800 font-semibold text-white text-xl px-3 py-1.5 mt-10">
            Submit
          </button>
        </div>
      </div>
      <img className='h-full w-[40%]' src="/default-img.png" />
    </div>
  )
}
