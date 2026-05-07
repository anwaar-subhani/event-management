import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import './BlogsPage.css';
import './Dashboard.css';
import Navbar from '../components/Navbar';
import ManageBlogs from '../components/ManageBlogs';
import { apiRequest, getAuthToken } from '../utils/api';
import { DEFAULT_EVENT_IMAGE } from '../utils/eventMapper';

function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showAdminTools, setShowAdminTools] = useState(false);
  const token = getAuthToken();

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

          {token ? (
            <section className="dashboard-panel" style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                <div>
                  <h2 style={{ marginBottom: '0.4rem' }}>Blog Management</h2>
                  <p style={{ margin: 0 }}>Create, edit, or delete blogs right here.</p>
                </div>
                <button type="button" onClick={() => setShowAdminTools((previous) => !previous)}>
                  {showAdminTools ? 'Hide Tools' : 'Manage Blogs'}
                </button>
              </div>
              {showAdminTools ? <ManageBlogs token={token} /> : null}
            </section>
          ) : null}

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
                  <Link className="blog-read-link" to={`/blogs/${blog._id}`}>
                    Read More
                  </Link>
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