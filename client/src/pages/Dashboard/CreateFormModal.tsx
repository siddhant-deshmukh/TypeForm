import axios, { AxiosError } from "axios"
import { useCallback, useContext, useState } from "react"

import AppContext from "../../AppContext"
import { Spinner } from "../../components/Spinner"

export default function CreateFormModal({ createFormModalToggle, setFormModalToggle }: {
  createFormModalToggle: boolean
  setFormModalToggle: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const { setuserForms } = useContext(AppContext)
  const [loding, setLoding] = useState<boolean>(false)
  const [formInputs, setFormInputs] = useState<{ title: string, description: string }>({
    title: "",
    description: "",
  })

  const closeForm = useCallback(() => {
    setFormModalToggle(false)
    setFormInputs({
      title: "",
      description: "",
    })
  }, [setFormModalToggle, setFormInputs])

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormInputs((prev) => {
      return {
        ...prev,
        [event.target.name]: event.target.value
      }
    })
    // console.log([event.target.name], event.target.value)
  }, [setFormInputs])

  const handleSubmitForm = useCallback(() => {
    setLoding(true)
    axios.post(`${import.meta.env.VITE_API_URL}/f`, {
      ...formInputs,
    }, {
      withCredentials: true
    }).then(({ status, data }) => {
      console.log(status, data)
      if (data.form) {
        setuserForms((prev) => {
          return prev.slice().concat([data.form])
        })
        closeForm()
      } else
        throw { status, data };
    }).catch((err: AxiosError) => {
      console.error("While", err)
    }).finally(() => {
      setLoding(false)
    })
  }, [formInputs, setuserForms, setLoding, closeForm])


  return (
    <div className={`z-50 fixed top-0 left-0 w-full ${createFormModalToggle ? 'flex' : 'hidden'} items-center justify-center h-screen bg-black bg-opacity-60`}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          // console.log("Submitted")
          handleSubmitForm()
        }}
        className="border p-5 bg-white rounded-xl shadow-lg sm:w-[448px] flex-col space-y-5">

        <h1 className="text-3xl font-extrabold my-10 text-center">Create New Form</h1>

        <div>
          <div className="mb-2 block">
            <label htmlFor="title1">Form Title</label>
          </div>
          <input
            id="title1"
            name="title"
            placeholder=""
            maxLength={50}
            value={formInputs.title}
            onChange={handleInputChange}
            required />
        </div>
        <div>
          <div className="mb-2 block">
            <label htmlFor="Description1" >Form Description (Optional)</label>
          </div>
          <textarea
            id="Description1"
            name="description"
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            minLength={0} maxLength={300}
            value={formInputs.description}
            onChange={handleInputChange}
          />
        </div>

        <div className="flex w-full space-x-2">

          <button type="button" className="w-full bg-white border-2 border-slate-800 text-slate-900 hover:bg-slate-200 font-semibold"
            onClick={() => {
              console.log("Here")
              closeForm()
            }}>
            Cancel
          </button>

          <button disabled={loding} className="w-full bg-blue-700" type="submit">

            {
              loding && <div className="mx-auto"><Spinner size={4} /></div>
            }
            {
              !loding && <span>Create</span>
            }
          </button>
        </div>


      </form>
    </div>
  )
}
