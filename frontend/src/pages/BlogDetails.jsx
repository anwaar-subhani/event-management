import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { apiRequest } from '../utils/api'
import { DEFAULT_EVENT_IMAGE } from '../utils/eventMapper'
import './BlogDetails.css'

function BlogDetails() {
  const { blogId } = useParams()
  const [blog, setBlog] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const loadBlog = async () => {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const response = await apiRequest(`/blogs/${blogId}`)
        setBlog(response?.data?.blog || null)
      } catch (error) {
        setErrorMessage(error.message || 'Failed to load blog')
      } finally {
        setIsLoading(false)
      }
    }

    if (blogId) {
      loadBlog()
    }
  }, [blogId])

  return (
    <>
      <Navbar />
      <main className="page blog-details-page">
        <div className="blog-details-container">
          <Link className="blog-back-link" to="/blogs">
            Back to Blogs
          </Link>

          {isLoading ? (
            <p>Loading blog...</p>
          ) : errorMessage ? (
            <p>{errorMessage}</p>
          ) : blog ? (
            <article className="blog-details-card">
              <img src={blog.image || DEFAULT_EVENT_IMAGE} alt={blog.title} className="blog-details-image" />
              <div className="blog-details-meta">
                <h1>{blog.title}</h1>
                <p>
                  By {blog.author || 'Event Team'} · {blog.readTimeMinutes || 5} min read
                </p>
              </div>
              <p className="blog-details-description">{blog.description}</p>
              <div className="blog-details-content">
                {(blog.content || 'No additional content available for this blog yet.')
                  .split('\n')
                  .map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
              </div>
            </article>
          ) : (
            <p>Blog not found.</p>
          )}
        </div>
      </main>
    </>
  )
}

export default BlogDetails