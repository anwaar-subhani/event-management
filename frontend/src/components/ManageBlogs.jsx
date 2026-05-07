import { useEffect, useState } from 'react';
import { apiRequest } from '../utils/api';
import { DEFAULT_EVENT_IMAGE } from '../utils/eventMapper';

function ManageBlogs({ token, isAdmin }) {
  const [adminBlogs, setAdminBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [editingBlogId, setEditingBlogId] = useState('');
  const [blogForm, setBlogForm] = useState({
    title: '',
    description: '',
    content: '',
    author: 'Event Team',
    image: '',
    readTimeMinutes: 5,
    isPublished: true,
  });

  const loadAdminBlogs = async () => {
    if (!token || !isAdmin) {
      setAdminBlogs([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await apiRequest('/blogs/admin', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdminBlogs(response?.data?.blogs || []);
    } catch (error) {
      setAdminBlogs([]);
      setMessage(error.message || 'Failed to load admin blogs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminBlogs();
  }, [token, isAdmin]);

  const handleFormChange = (event) => {
    const { name, value, type, checked } = event.target;
    setBlogForm((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const resetForm = () => {
    setEditingBlogId('');
    setBlogForm({
      title: '',
      description: '',
      content: '',
      author: 'Event Team',
      image: '',
      readTimeMinutes: 5,
      isPublished: true,
    });
  };

  const handleBlogSubmit = async (event) => {
    event.preventDefault();

    if (!isAdmin || !token) {
      setMessage('Admin access required to manage blogs.');
      return;
    }

    try {
      const payload = {
        ...blogForm,
        readTimeMinutes: Number(blogForm.readTimeMinutes) || 5,
      };

      if (editingBlogId) {
        await apiRequest(`/blogs/${editingBlogId}`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}` },
          body: payload,
        });
        setMessage('Blog updated successfully.');
      } else {
        await apiRequest('/blogs', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: payload,
        });
        setMessage('Blog created successfully.');
      }

      resetForm();
      await loadAdminBlogs();
    } catch (error) {
      setMessage(error.message || 'Failed to save blog');
    }
  };

  const handleEditBlog = (blog) => {
    setEditingBlogId(blog._id);
    setBlogForm({
      title: blog.title || '',
      description: blog.description || '',
      content: blog.content || '',
      author: blog.author || 'Event Team',
      image: blog.image || '',
      readTimeMinutes: blog.readTimeMinutes || 5,
      isPublished: Boolean(blog.isPublished),
    });
  };

  const handleDeleteBlog = async (blogId) => {
    if (!isAdmin || !token) return;

    try {
      await apiRequest(`/blogs/${blogId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Blog deleted successfully.');
      if (editingBlogId === blogId) resetForm();
      await loadAdminBlogs();
    } catch (error) {
      setMessage(error.message || 'Failed to delete blog');
    }
  };

  if (!token) {
    return (
      <div className="dashboard-panel">
        <h2>Manage Blogs</h2>
        <p>Please login to manage blogs.</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="dashboard-panel">
        <h2>Manage Blogs</h2>
        <p>Admin access required.</p>
      </div>
    );
  }

  return (
    <div className="dashboard-panel">
      <h2>Manage Blogs</h2>
      <form onSubmit={handleBlogSubmit} className="create-event-form" style={{ maxWidth: '820px' }}>
        <div className="create-event-grid">
          <label>
            Title
            <input name="title" value={blogForm.title} onChange={handleFormChange} required />
          </label>
          <label>
            Author
            <input name="author" value={blogForm.author} onChange={handleFormChange} />
          </label>
          <label className="full-width-field">
            Description
            <textarea name="description" value={blogForm.description} onChange={handleFormChange} required />
          </label>
          <label className="full-width-field">
            Content
            <textarea name="content" rows="6" value={blogForm.content} onChange={handleFormChange} />
          </label>
          <label>
            Image URL
            <input name="image" value={blogForm.image} onChange={handleFormChange} />
          </label>
          <label>
            Read Time (minutes)
            <input
              name="readTimeMinutes"
              type="number"
              min="1"
              value={blogForm.readTimeMinutes}
              onChange={handleFormChange}
            />
          </label>
          <label>
            <input
              name="isPublished"
              type="checkbox"
              checked={blogForm.isPublished}
              onChange={handleFormChange}
            />{' '}
            Publish immediately
          </label>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="submit">{editingBlogId ? 'Update Blog' : 'Create Blog'}</button>
          {editingBlogId ? (
            <button type="button" onClick={resetForm}>Cancel Edit</button>
          ) : null}
        </div>
      </form>

      {message ? <p>{message}</p> : null}

      <div style={{ marginTop: '2rem' }}>
        <h3>Existing Blogs</h3>
        {isLoading ? (
          <p>Loading blogs...</p>
        ) : adminBlogs.length === 0 ? (
          <p>No blogs available.</p>
        ) : (
          <div className="blogs-grid-page">
            {adminBlogs.map((blog) => (
              <article key={blog._id} className="blog-card">
                <img src={blog.image || DEFAULT_EVENT_IMAGE} alt={blog.title} />
                <h3>{blog.title}</h3>
                <p>{blog.description}</p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button type="button" onClick={() => handleEditBlog(blog)}>Edit</button>
                  <button type="button" onClick={() => handleDeleteBlog(blog._id)}>Delete</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageBlogs;