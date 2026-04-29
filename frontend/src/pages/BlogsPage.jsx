import { useEffect, useMemo, useState } from 'react';
import './BlogsPage.css';
import Navbar from '../components/Navbar';
import { apiRequest } from '../utils/api';
import { DEFAULT_EVENT_IMAGE } from '../utils/eventMapper';

function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBlogs = async () => {
      setIsLoading(true);
      try {
        const response = await apiRequest('/blogs');
        setBlogs(response?.data?.blogs || []);
      } catch {
        setBlogs([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadBlogs();
  }, []);

  const filteredBlogs = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return blogs;

    return blogs.filter((blog) => {
      return (
        String(blog.title || '').toLowerCase().includes(term) ||
        String(blog.description || '').toLowerCase().includes(term)
      );
    });
  }, [blogs, searchTerm]);

  return (
    <>
      <Navbar />
      <main className="page blogs-page">
        <div className="blogs-page-container">
          <h1>Blogs</h1>
          <p className="blogs-description">
            Read practical event tips, stories, and updates from the community.
          </p>

          <div className="blogs-toolbar">
            <input
              type="text"
              placeholder="Search blogs..."
              className="blogs-search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <div className="blogs-grid-page">
            {isLoading ? (
              <p>Loading blogs...</p>
            ) : filteredBlogs.length === 0 ? (
              <p>None</p>
            ) : (
              filteredBlogs.map((blog) => (
                <article key={blog._id} className="blog-card">
                  <img src={blog.image || DEFAULT_EVENT_IMAGE} alt={blog.title} />
                  <h3>{blog.title}</h3>
                  <p>{blog.description}</p>
                  <button type="button">Read More</button>
                </article>
              ))
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export default BlogsPage;