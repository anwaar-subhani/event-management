import { NavLink } from 'react-router-dom'

export default function Logo({ isLink = true, className = '' }) {
  const content = (
    <>
      <span className="brand-main">Event</span>
      <span className="brand-accent">um</span>
    </>
  )

  if (isLink) {
    return (
      <NavLink className={`brand-link ${className}`.trim()} to="/">
        {content}
      </NavLink>
    )
  }

  return <div className={`brand-text ${className}`.trim()}>{content}</div>
}
