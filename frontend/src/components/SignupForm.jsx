import { useState } from 'react'
import { apiRequest } from '../utils/api'

function SignupForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    organizationName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((previous) => ({ ...previous, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')

    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match')
      return
    }

    setIsLoading(true)

    try {
      await apiRequest('/organizers/auth/signup', {
        method: 'POST',
        body: {
          name: formData.name,
          organizationName: formData.organizationName,
          email: formData.email,
          password: formData.password,
        },
      })

      setMessage('Signup successful. Please login now.')
      if (onSuccess) onSuccess()
    } catch (error) {
      setMessage(error.message || 'Signup failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Signup</h2>
      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="organizationName"
        placeholder="Organization Name"
        value={formData.organizationName}
        onChange={handleChange}
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirm Password"
        value={formData.confirmPassword}
        onChange={handleChange}
        required
      />
      <button className="submit-btn" type="submit" disabled={isLoading}>
        {isLoading ? 'Signing up...' : 'Signup'}
      </button>
      {message ? <p>{message}</p> : null}
    </form>
  )
}

export default SignupForm