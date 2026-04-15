import "./BlogsPage.css";

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
    <div className="blogs-container">
      <h1>Blogs</h1>
      <input type="text" placeholder="Search blogs..." className="search-bar"/>
      <div className="blogs-grid">
        {blogs.map(blog => (
          <div key={blog.id} className="blog-card">
            <img src={blog.image} alt="blog" />
            <h3>{blog.title}</h3>
            <p>{blog.description}</p>
            <button>Read More</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BlogsPage;