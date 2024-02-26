import { useContext } from "react"
import AppContext from "./AppContext"
import { Spinner } from "./components/Spinner"
import Auth from "./pages/Auth"
import Dashboard from "./pages/Dashboard"
import { Route, Routes } from "react-router-dom"
import EditForm from "./pages/EditForm"
import FillForm from "./pages/FillForm"

function App() {

  const { authLoading, user } = useContext(AppContext)

  if (authLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Spinner size={20} />
      </div>
    )
  } else if (user) {
    return (
      <div className="w-full ">
        <main className="w-full min-h-screen">
          <Routes>
            <Route path="*" element={<Dashboard />} />
            <Route path="/edit/f/:form_id" element={<EditForm />} />
            <Route path="/fill/f/:form_id" element={<FillForm />} />
          </Routes>
        </main>
      </div>
    )
  } else {
    return (
      <Auth />
    )
  }
}

export default App
