import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Signup(props) {
  const [credentials, setCredentials] = useState({ name: "", email: "", password: "", cpassword: "" })
  let navigate = useNavigate()

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password } = credentials
    const response = await fetch("http://localhost:5000/api/auth/createuser", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password })

    })
    const json = await response.json()
    console.log(json);
    if (json.success) {
      localStorage.setItem('token', json.authtoken)
      navigate('/')
      props.showAlert("Account Created Successfully", "success")

    }
    else {
      props.showAlert("Invalid Credential", "danger")
    }
  }

  return (
    <div className='conatainer mt-2'>
      <h2 className='my-3'>Create an account to use iNotebook</h2>
      <form className='my-2' onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input type="text" className="form-control" id="name" name="name" aria-describedby="emailHelp" value={credentials.name} onChange={onChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input type="email" className="form-control" id="email" name="email" aria-describedby="emailHelp" value={credentials.email} onChange={onChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
          <input type="password" className="form-control" id="password" name='password' value={credentials.password} onChange={onChange} minLength={5} required />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">Confirm Password</label>
          <input type="password" className="form-control" id="cpassword" name='cpassword' value={credentials.password} onChange={onChange} minLength={5} required />
        </div>

        <button   className="btn btn-primary">Signup</button>
      </form>
    </div>
  )
}

export default Signup
