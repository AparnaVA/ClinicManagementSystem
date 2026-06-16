import { useState } from 'react'
import api from '../api/axios'

function Login() {

  const [username, setUsername] = useState('')

  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {

      e.preventDefault()

      try {

        const response = await api.post('accounts/login/',
            {
              username,
              password
            }
          )

        localStorage.setItem('token', response.data.access)

        alert('Login Success')

      }

      catch {

        alert('Invalid Credentials')
      }
    }

  return (

    <div className="container mt-5">

      <h2>Login</h2>

      <form onSubmit={ handleSubmit }>

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Username"
          onChange={(e)=>
            setUsername(
              e.target.value
            )
          }
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          onChange={(e)=>
            setPassword(
              e.target.value
            )
          }
        />

        <button
          className="btn btn-primary"
        >
          Login
        </button>

      </form>

    </div>
  )
}

export default Login