import { useContext } from 'react'
import { Spinner } from '../../components/Spinner'
import { Link } from 'react-router-dom'
import EditFormContext, { EditFormProvider } from './EditFormContext'
import Create from './Create'

function EditForm() {

  const { loding } = useContext(EditFormContext)

  if (loding)
    return (
      <div className='w-full pt-48 flex justify-center'>
        <Spinner size={10} />
      </div>
    );
  return (
    <div  className='w-full edit-form min-h-screen flex flex-col'>
      <nav className='w-full flex justify-between px-5 border-b py-4'>
        <Link to={'/'} className='text-slate-400 font-extrabold text-xl'>Dashboard / </Link>
        <div></div>
      </nav>

      {/* <Routes>
        <Route path='/' element={<Create />} />
      </Routes> */}
      <div className='match-navbar'>
        <Create />
      </div>
    </div>
  )
}

export default function EditFormPage() {
  return (
    <EditFormProvider>
      <EditForm />
    </EditFormProvider>
  )
}