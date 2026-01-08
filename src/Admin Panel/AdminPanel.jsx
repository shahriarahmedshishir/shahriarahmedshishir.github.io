import api from "../api";
import { Briefcase, FolderGit2, Github, Linkedin, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { User, Mail } from "lucide-react";
import MessageModal from "./MessageModal";

const iconOptions = {
  Briefcase,
  FolderGit2,
  Github,
  Linkedin,
};

const AdminPanel = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get("/application/messages");
        setMessages(res.data);
      } catch (error) {
        console.error("Error fetching messages", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/application/messages/${id}`);
      setMessages((prev) => prev.filter((msg) => msg._id !== id));
    } catch (err) {
      console.error("Failed to delete message:", err);
    }
  };

  // --- Form States ---
  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    technologies: "",
    githubUrl: "",
    liveUrl: "",
    featured: false,
    color: "from-teal-500 to-blue-500",
  });

  const [experienceForm, setExperienceForm] = useState({
    title: "",
    company: "",
    period: "",
    description: "",
    icon: "Briefcase",
  });

  const [blogForm, setBlogForm] = useState({
    title: "",
    content: "",
    author: "",
    category: "",
  });

  // --- Handlers ---
  const handleProjectChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProjectForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleExperienceChange = (e) => {
    const { name, value } = e.target;
    setExperienceForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlogChange = (e) => {
    const { name, value } = e.target;
    setBlogForm((prev) => ({ ...prev, [name]: value }));
  };

  // --- Submit Functions ---
  const submitProject = async (e) => {
    e.preventDefault();
    try {
      await api.post("/application/projects", {
        ...projectForm,
        technologies: projectForm.technologies.split(",").map((t) => t.trim()),
      });
      alert("Project added!");
      setProjectForm({
        title: "",
        description: "",
        technologies: "",
        githubUrl: "",
        liveUrl: "",
        featured: false,
        color: "from-teal-500 to-blue-500",
      });
    } catch (err) {
      console.error(err);
      alert("Error adding project");
    }
  };

  const submitExperience = async (e) => {
    e.preventDefault();
    try {
      await api.post("/application/experiences", experienceForm);
      alert("Experience added!");
      setExperienceForm({
        title: "",
        company: "",
        period: "",
        description: "",
        icon: "Briefcase",
      });
    } catch (err) {
      console.error(err);
      alert("Error adding experience");
    }
  };

  const submitBlog = async (e) => {
    e.preventDefault();
    try {
      await api.post("/application/blogs", blogForm);
      alert("Blog added!");
      setBlogForm({ title: "", content: "", author: "", category: "" });
    } catch (err) {
      console.error(err);
      alert("Error adding blog");
    }
  };

  // --- JSX ---
  return (
    <div className="min-h-screen bg-slate-900 ">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-md z-50 border-b border-purple-500/20 text-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              {"<Admin Panel/>"}
            </div>

            {/* Desktop menu */}
            <div className="hidden md:flex space-x-8">
              {["Projects", "Blogs", "Experiences"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="hover:text-purple-400 transition-colors duration-300"
                >
                  {item}
                </a>
              ))}
            </div>

            {/* Mobile menu */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <FolderGit2 size={24} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-slate-800/95 backdrop-blur-md">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {["Projects", "Blogs", "Experiences"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="block px-3 py-2 hover:bg-purple-500/20 rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Projects Section */}
      <section id="projects" className="pt-24 px-4 max-w-4xl mx-auto mb-16">
        <h2 className="text-3xl font-bold mb-6 text-amber-50 text-center">
          Add Project
        </h2>
        <form
          onSubmit={submitProject}
          className="space-y-4 bg-white p-6 rounded shadow"
        >
          <input
            type="text"
            name="title"
            placeholder="Project Title"
            value={projectForm.title}
            onChange={handleProjectChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <textarea
            name="description"
            placeholder="Project Description"
            value={projectForm.description}
            onChange={handleProjectChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            type="text"
            name="technologies"
            placeholder="Technologies (comma separated)"
            value={projectForm.technologies}
            onChange={handleProjectChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            type="text"
            name="githubUrl"
            placeholder="GitHub URL"
            value={projectForm.githubUrl}
            onChange={handleProjectChange}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            name="liveUrl"
            placeholder="Live URL"
            value={projectForm.liveUrl}
            onChange={handleProjectChange}
            className="w-full border px-3 py-2 rounded"
          />
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="featured"
              checked={projectForm.featured}
              onChange={handleProjectChange}
            />
            <span>Featured</span>
          </label>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add Project
          </button>
        </form>
      </section>

      {/* Blogs Section */}
      <section id="blogs" className="pt-24 px-4 max-w-4xl mx-auto mb-16">
        <h2 className="text-3xl font-bold mb-6 text-amber-50 text-center">
          Add Blog
        </h2>
        <form
          onSubmit={submitBlog}
          className="space-y-4 bg-white p-6 rounded shadow"
        >
          <input
            type="text"
            name="title"
            placeholder="Blog Title"
            value={blogForm.title}
            onChange={handleBlogChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <textarea
            name="content"
            placeholder="Blog Content"
            value={blogForm.content}
            onChange={handleBlogChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            type="text"
            name="author"
            placeholder="Author Name"
            value={blogForm.author}
            onChange={handleBlogChange}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={blogForm.category}
            onChange={handleBlogChange}
            className="w-full border px-3 py-2 rounded"
          />
          <button
            type="submit"
            className="bg-purple-500 text-white px-4 py-2 rounded"
          >
            Add Blog
          </button>
        </form>
      </section>

      {/* Experiences Section */}
      <section id="experiences" className="pt-24 px-4 max-w-4xl mx-auto mb-16">
        <h2 className="text-3xl font-bold mb-6 text-amber-50 text-center">
          Add Experience
        </h2>
        <form
          onSubmit={submitExperience}
          className="space-y-4 bg-white p-6 rounded shadow"
        >
          <input
            type="text"
            name="title"
            placeholder="Job Title"
            value={experienceForm.title}
            onChange={handleExperienceChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            type="text"
            name="company"
            placeholder="Company"
            value={experienceForm.company}
            onChange={handleExperienceChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            type="text"
            name="period"
            placeholder="Period"
            value={experienceForm.period}
            onChange={handleExperienceChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={experienceForm.description}
            onChange={handleExperienceChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <select
            name="icon"
            value={experienceForm.icon}
            onChange={handleExperienceChange}
            className="w-full border px-3 py-2 rounded"
          >
            {Object.keys(iconOptions).map((icon) => (
              <option key={icon} value={icon}>
                {icon}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Add Experience
          </button>
        </form>
      </section>
      <section
        id="messages"
        className="h-screen overflow-y-auto bg-slate-900/90 p-8"
      >
        <h2 className="text-4xl md:text-6xl font-bold mb-12 text-center text-amber-50">
          Received{" "}
          <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Messages
          </span>
        </h2>

        {loading ? (
          <p className="text-center text-gray-300">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="text-center text-gray-300">No messages yet.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className="bg-slate-800/50 rounded-2xl p-6 border border-purple-500/20 hover:shadow-lg hover:shadow-purple-500/30 transition-all cursor-pointer relative"
              >
                <h3
                  className="text-lg font-semibold text-amber-50 mb-2 truncate"
                  onClick={() => setSelectedMessage(msg)}
                >
                  {msg.name}
                </h3>
                <p
                  className="text-gray-300 text-sm truncate"
                  onClick={() => setSelectedMessage(msg)}
                >
                  {msg.message}
                </p>
                <button
                  onClick={() => handleDelete(msg._id)}
                  className="absolute top-3 right-3 text-red-500 hover:text-red-400"
                >
                  <X size={20} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {selectedMessage && (
          <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
            <div className="bg-slate-900 max-w-2xl w-full rounded-2xl p-6 relative border border-purple-500/30">
              <button
                onClick={() => setSelectedMessage(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
              >
                ✕
              </button>
              <h3 className="text-2xl font-bold text-amber-50 mb-2">
                {selectedMessage.name}
              </h3>
              <p className="text-gray-300 text-sm mb-4">
                {selectedMessage.email}
              </p>
              <p className="text-gray-200 whitespace-pre-wrap">
                {selectedMessage.message}
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminPanel;
