import { useState } from 'react'
import { apiRequest } from '../utils/api'

function LoginForm({ onSuccess }) {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((previous) => ({ ...previous, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')
    setIsLoading(true)

    try {
      const response = await apiRequest('/organizers/auth/login', {
        method: 'POST',
        body: {
          email: formData.email,
          password: formData.password,
        },
      })

      const token = response?.data?.token
      const organizer = response?.data?.organizer

      if (token) {
        localStorage.setItem('organizerToken', token)
      }

      if (organizer) {
        localStorage.setItem('organizerProfile', JSON.stringify(organizer))
      }

      setMessage('Login successful. Redirecting to organizer dashboard...')
      if (onSuccess) onSuccess()
    } catch (error) {
      setMessage(error.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
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
      <button className="submit-btn" type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
      {message ? <p>{message}</p> : null}
    </form>
  )
}

export default LoginForm