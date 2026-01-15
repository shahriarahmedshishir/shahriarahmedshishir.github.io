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

// Function to generate random gradient colors
const generateRandomGradient = () => {
  const gradients = [
    "from-blue-500 to-purple-600",
    "from-purple-500 to-pink-600",
    "from-pink-500 to-orange-600",
    "from-teal-500 to-blue-500",
    "from-green-500 to-emerald-600",
    "from-cyan-500 to-blue-600",
    "from-indigo-500 to-purple-600",
    "from-violet-500 to-fuchsia-600",
    "from-rose-500 to-pink-600",
    "from-amber-500 to-orange-600",
    "from-lime-500 to-green-600",
    "from-sky-500 to-indigo-600",
    "from-fuchsia-500 to-purple-600",
    "from-emerald-500 to-teal-600",
    "from-orange-500 to-red-600",
  ];
  return gradients[Math.floor(Math.random() * gradients.length)];
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

  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    technologies: "",
    githubUrl: "",
    liveUrl: "",
    featured: false,
    color: generateRandomGradient(),
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
        color: generateRandomGradient(),
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
    <div className="min-h-screen bg-[#0a0a0f] pb-20">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-[#0a0a0f]/80 backdrop-blur-xl z-50 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="text-2xl font-bold">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                {"<Admin Panel />"}
              </span>
            </div>

            {/* Desktop menu */}
            <div className="hidden md:flex space-x-1">
              {["Projects", "Blogs", "Experiences", "Messages"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                >
                  {item}
                </a>
              ))}
            </div>

            {/* Mobile menu */}
            <button
              className="md:hidden text-gray-400 hover:text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <FolderGit2 size={24} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-[#0f0f1a]/95 backdrop-blur-xl border-t border-white/5">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {["Projects", "Blogs", "Experiences", "Messages"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="block px-3 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
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
      <section id="projects" className="pt-28 px-4 max-w-4xl mx-auto mb-16">
        <h2 className="text-4xl font-bold mb-8 text-center">
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Add Project
          </span>
        </h2>
        <form
          onSubmit={submitProject}
          className="space-y-4 bg-[#0f0f1a]/90 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl"
        >
          <input
            type="text"
            name="title"
            placeholder="Project Title"
            value={projectForm.title}
            onChange={handleProjectChange}
            className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-lg text-white placeholder-gray-500 focus:border-blue-500/50 focus:outline-none transition-colors"
            required
          />
          <textarea
            name="description"
            placeholder="Project Description"
            value={projectForm.description}
            onChange={handleProjectChange}
            className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-lg text-white placeholder-gray-500 focus:border-blue-500/50 focus:outline-none transition-colors h-32 resize-none"
            required
          />
          <input
            type="text"
            name="technologies"
            placeholder="Technologies (comma separated)"
            value={projectForm.technologies}
            onChange={handleProjectChange}
            className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-lg text-white placeholder-gray-500 focus:border-blue-500/50 focus:outline-none transition-colors"
            required
          />
          <input
            type="text"
            name="githubUrl"
            placeholder="GitHub URL"
            value={projectForm.githubUrl}
            onChange={handleProjectChange}
            className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-lg text-white placeholder-gray-500 focus:border-blue-500/50 focus:outline-none transition-colors"
          />
          <input
            type="text"
            name="liveUrl"
            placeholder="Live URL"
            value={projectForm.liveUrl}
            onChange={handleProjectChange}
            className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-lg text-white placeholder-gray-500 focus:border-blue-500/50 focus:outline-none transition-colors"
          />
          <label className="flex items-center space-x-2 text-gray-300">
            <input
              type="checkbox"
              name="featured"
              checked={projectForm.featured}
              onChange={handleProjectChange}
              className="w-4 h-4 rounded border-white/10 bg-white/5 text-blue-500 focus:ring-blue-500/50"
            />
            <span>Featured Project</span>
          </label>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
          >
            Add Project
          </button>
        </form>
      </section>

      {/* Blogs Section */}
      <section id="blogs" className="pt-28 px-4 max-w-4xl mx-auto mb-16">
        <h2 className="text-4xl font-bold mb-8 text-center">
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Add Blog
          </span>
        </h2>
        <form
          onSubmit={submitBlog}
          className="space-y-4 bg-[#0f0f1a]/90 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl"
        >
          <input
            type="text"
            name="title"
            placeholder="Blog Title"
            value={blogForm.title}
            onChange={handleBlogChange}
            className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-lg text-white placeholder-gray-500 focus:border-purple-500/50 focus:outline-none transition-colors"
            required
          />
          <textarea
            name="content"
            placeholder="Blog Content"
            value={blogForm.content}
            onChange={handleBlogChange}
            className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-lg text-white placeholder-gray-500 focus:border-purple-500/50 focus:outline-none transition-colors h-48 resize-none"
            required
          />
          <input
            type="text"
            name="author"
            placeholder="Author Name"
            value={blogForm.author}
            onChange={handleBlogChange}
            className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-lg text-white placeholder-gray-500 focus:border-purple-500/50 focus:outline-none transition-colors"
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={blogForm.category}
            onChange={handleBlogChange}
            className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-lg text-white placeholder-gray-500 focus:border-purple-500/50 focus:outline-none transition-colors"
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
          >
            Add Blog
          </button>
        </form>
      </section>

      {/* Experiences Section */}
      <section id="experiences" className="pt-28 px-4 max-w-4xl mx-auto mb-16">
        <h2 className="text-4xl font-bold mb-8 text-center">
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Add Experience
          </span>
        </h2>
        <form
          onSubmit={submitExperience}
          className="space-y-4 bg-[#0f0f1a]/90 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl"
        >
          <input
            type="text"
            name="title"
            placeholder="Job Title"
            value={experienceForm.title}
            onChange={handleExperienceChange}
            className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-lg text-white placeholder-gray-500 focus:border-blue-500/50 focus:outline-none transition-colors"
            required
          />
          <input
            type="text"
            name="company"
            placeholder="Company"
            value={experienceForm.company}
            onChange={handleExperienceChange}
            className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-lg text-white placeholder-gray-500 focus:border-blue-500/50 focus:outline-none transition-colors"
            required
          />
          <input
            type="text"
            name="period"
            placeholder="Period (e.g., 2023 - Present)"
            value={experienceForm.period}
            onChange={handleExperienceChange}
            className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-lg text-white placeholder-gray-500 focus:border-blue-500/50 focus:outline-none transition-colors"
            required
          />
          <textarea
            name="description"
            placeholder="Job Description"
            value={experienceForm.description}
            onChange={handleExperienceChange}
            className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-lg text-white placeholder-gray-500 focus:border-blue-500/50 focus:outline-none transition-colors h-32 resize-none"
            required
          />
          <select
            name="icon"
            value={experienceForm.icon}
            onChange={handleExperienceChange}
            className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-lg text-white focus:border-blue-500/50 focus:outline-none transition-colors"
          >
            {Object.keys(iconOptions).map((icon) => (
              <option
                key={icon}
                value={icon}
                className="bg-[#0f0f1a] text-white"
              >
                {icon}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
          >
            Add Experience
          </button>
        </form>
      </section>
      <section id="messages" className="pt-28 px-4 max-w-7xl mx-auto mb-16">
        <h2 className="text-4xl font-bold mb-12 text-center">
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Received Messages
          </span>
        </h2>

        {loading ? (
          <div className="bg-[#0f0f1a]/90 backdrop-blur-xl rounded-2xl p-12 border border-white/10 text-center">
            <p className="text-gray-400 text-lg">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="bg-[#0f0f1a]/90 backdrop-blur-xl rounded-2xl p-12 border border-white/10 text-center">
            <Mail className="w-16 h-16 mx-auto mb-4 text-gray-500" />
            <p className="text-gray-400 text-lg mb-2">No messages yet</p>
            <p className="text-gray-500 text-sm">
              Messages from your portfolio contact form will appear here
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className="bg-[#0f0f1a] backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-blue-500/50 transition-all cursor-pointer relative group hover:shadow-lg hover:shadow-blue-500/10"
              >
                <div onClick={() => setSelectedMessage(msg)}>
                  <h3 className="text-lg font-semibold text-white mb-2 truncate">
                    {msg.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-3 truncate">
                    {msg.email}
                  </p>
                  <p className="text-gray-300 text-sm line-clamp-2">
                    {msg.message}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(msg._id)}
                  className="absolute top-4 right-4 text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={20} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {selectedMessage && (
          <MessageModal
            message={selectedMessage}
            onClose={() => setSelectedMessage(null)}
          />
        )}
      </section>
    </div>
  );
};

export default AdminPanel;
