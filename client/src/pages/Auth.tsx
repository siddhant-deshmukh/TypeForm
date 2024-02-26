import { useCallback, useContext, useState } from "react"
import AppContext from "../AppContext"
import axios, { AxiosError } from "axios"
import { Spinner } from "../components/Spinner"


export default function Auth() {

  const { setUser } = useContext(AppContext)
  const [loding, setLoding] = useState<boolean>(false)
  const [authType, setAuthType] = useState<"login" | "register">("register")
  const [formInputs, setFormInputs] = useState<{ name: string, email: string, password: string }>({
    name: "",
    email: "",
    password: ""
  })

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setFormInputs((prev) => {
      return {
        ...prev,
        [event.target.name]: event.target.value
      }
    })
  }, [setFormInputs])

  const handleSubmitForm = useCallback(() => {
    setLoding(true)
    axios.post(`${import.meta.env.VITE_API_URL}/${authType}`, {
      ...formInputs,
    }, {
      withCredentials: true
    }).then(({ status, data }) => {
      console.log(status, data)
      if (data.user) {
        setUser(data.user)
      }
    }).catch((err: AxiosError) => {
      console.error("While", authType, err)
    }).finally(() => {
      setLoding(false)
    })
  }, [authType, formInputs, setUser, setLoding])

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          // console.log("Submitted")
          handleSubmitForm()
        }}
        className="border p-5 rounded-xl shadow-lg sm:w-[448px] flex-col space-y-5">

        <h1 className="text-3xl font-extrabold my-10 text-center">TypeForm</h1>
        {
          authType === "register" &&
          <div>
            <div className="mb-2 block">
              <label htmlFor="name1">Your Name</label>
            </div>
            <input
              id="name1"
              type="name"
              name="name"
              minLength={3} maxLength={50}
              value={formInputs.name}
              onChange={handleInputChange}
              required />
          </div>
        }
        <div>
          <div className="mb-2 block">
            <label htmlFor="email1">Your Email</label>
          </div>
          <input
            id="email1"
            type="email"
            name="email"
            placeholder="name@flowbite.com"
            maxLength={50}
            value={formInputs.email}
            onChange={handleInputChange}
            required />
        </div>
        <div>
          <div className="mb-2 block">
            <label htmlFor="password1" >Your password</label>
          </div>
          <input
            id="password1"
            type="password"
            name="password"
            minLength={5} maxLength={20}
            value={formInputs.password}
            onChange={handleInputChange}
            required />
        </div>

        <button disabled={loding} className="w-full bg-blue-700" type="submit">
          
          {
            loding && <div className="mx-auto"><Spinner size={4} /></div>
          }
          {
            !loding && <span>{authType}</span>
          }
        </button>

        <div className="pt-5 flex justify-center items-center space-x-3 text-sm">
          {
            authType === "login" &&
            <>
              <p>Don't have account. </p>
              <button className="" onClick={() => { setAuthType("register") }}>Register</button>
            </>
          }
          {
            authType === "register" &&
            <>
              <p>Don't have account. </p>
              <button className="" onClick={() => { setAuthType("login") }}>Login</button>
            </>
          }
        </div>
      </form>
    </div>
  )
}
