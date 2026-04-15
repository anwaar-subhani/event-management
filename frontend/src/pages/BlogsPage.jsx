import "./BlogsPage.css";
import Navbar from "../components/Navbar";

function BlogsPage() {
  const blogs = [
    {
      id: 1,
      title: "How to Organize a Successful Event",
      description: "Learn the key steps to organize a perfect event.",
      image: "https://via.placeholder.com/300"
    },
    {
      id: 2,
      title: "Top 10 Tech Events in 2025",
      description: "Discover the best upcoming tech events.",
      image: "https://via.placeholder.com/300"
    }
  ];
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
            />
          </div>

          <div className="blogs-grid-page">
            {blogs.map(blog => (
              <article key={blog.id} className="blog-card">
                <img src={blog.image} alt={blog.title} />
                <h3>{blog.title}</h3>
                <p>{blog.description}</p>
                <button type="button">Read More</button>
              </article>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

export default BlogsPage;