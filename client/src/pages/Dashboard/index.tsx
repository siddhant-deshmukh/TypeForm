import { useContext, useEffect, useState } from 'react'
import AppContext from '../../AppContext'
import axios from 'axios'
import { Link } from 'react-router-dom'
import CreateFormModal from './CreateFormModal'
import Navbar from './Navbar'

export default function Dashboard() {
  const { user, userForms, setuserForms } = useContext(AppContext)
  const [createFormModalToggle, setFormModalToggle] = useState<boolean>(false)

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/f`, { withCredentials: true })
      .then(({ status, data }) => {
        if (status === 200 && data.forms) {
          setuserForms(data.forms)
        } else
          throw { status, data };
      }).catch((err) => {
        console.error("While getting forms list", err)
      })
  }, [setuserForms, user])

  return (
    <div className='max-w-screen-xl mx-auto p-4 w-full'>
      <Navbar />

      <button
        onClick={() => { setFormModalToggle(true) }}
        className='bg-slate-900 text-white rounded-2xl px-5 py-2 mt-10 font-semibold'> + Create form</button>

      <CreateFormModal 
        setFormModalToggle={setFormModalToggle} 
        createFormModalToggle={createFormModalToggle}/>

      <div className="relative mt-10 overflow-x-auto">
        <table className="w-full  text-sm text-left rtl:text-right text-slate-500 dark:text-gray-400">
          <thead className="text-xs text-white uppercase bg-slate-900 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Title
              </th>
              <th scope="col" className="px-6 py-3">
                Type
              </th>
              <th scope="col" className="px-6 py-3">
                Updated at
              </th>
            </tr>
          </thead>
          <tbody>

            {
              userForms.map((form) => {
                return (
                  <tr className="bg-white max-w-screen-xl border-b dark:bg-gray-800 dark:border-gray-700">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 truncate w-[60%] whitespace-nowrap dark:text-white">
                      <Link to={`/edit/f/${form._id}`} className='hover:underline' >{form.title.slice(0, 50)}
                      </Link>
                    </th>
                    <td className="px-6 py-4 w-[20%]">
                      Silver
                    </td>
                    <td className="px-6 py-4 w-[20%]">
                      Laptop
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>

    </div>
  )
}
