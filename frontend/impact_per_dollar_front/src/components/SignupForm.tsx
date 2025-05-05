import { useState } from "react";
import axios,{isAxiosError} from "axios";

const SignupForm = () =>{
    const[email, setEmail]= useState('')
    const[firstName, setFirstName] =useState('')
    const[lastName,setLastName]=useState('')
    const[message,setMessage]=useState('')
    const handleSubmit = async (e:React.FormEvent) =>{ 
        
        e.preventDefault()

        try {
            await axios.post('http://localhost:5000/signup',{
            firstName,
            lastName,
            email,
        })

        setMessage('Please check in your email to your email including the spam box')
        setFirstName("")
        setLastName("")
        setEmail("")
        
        } catch (error: unknown) {
            if (isAxiosError(error)) {
                setMessage(error.response?.data?.message || 'something went wrong')
            } else {
                setMessage('unknown error occured')
            }
            

        }
    }
    return (
        <div>
        <form onSubmit={handleSubmit}>
          <h2>Sign Up for More Info</h2>
          <input
            type="text"
            placeholder="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Submit</button>
        </form>
        {message && <p>{message}</p>}
        </div>
      )
}
export default SignupForm