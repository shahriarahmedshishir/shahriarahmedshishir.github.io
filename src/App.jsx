import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import api from "./api";

import { Parallax, ParallaxLayer } from "@react-spring/parallax";
import {
  Mail,
  Github,
  Linkedin,
  Code,
  Database,
  Terminal,
  ExternalLink,
  Send,
  Menu,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Award,
  Briefcase,
  User,
  FolderGit2,
  MessageSquare,
  Rocket,
  Zap,
  Globe,
  Server,
  Cpu,
} from "lucide-react";

const App = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState({ type: "", message: "" });
  const [projects, setProjects] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isVisible, setIsVisible] = useState({});
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [experiences, setExperiences] = useState([]);

  // Mock API URL

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      });
    };

    const handleScroll = () => {
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.scrollY / scrollHeight) * 100;
      setScrollProgress(scrolled);

      const sections = [
        "home",
        "about",
        "skills",
        "experience",
        "projects",
        "contact",
        "blogs",
      ];

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible((prev) => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting,
          }));
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll("section[id]").forEach((section) => {
      observer.observe(section);
    });

    const fetchData = async () => {
      try {
        const [blogsRes, projectsRes, experiencesRes] = await Promise.all([
          api.get("/application/blogs"),
          api.get("/application/projects"),
          api.get("/application/experiences"),
        ]);

        setBlogs(blogsRes.data);
        setProjects(projectsRes.data);
        setExperiences(experiencesRes.data);
      } catch (error) {
        console.error("API fetch error:", error);
      }
    };

    fetchData();

    return () => {
      observer.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!isAutoPlay) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % projects.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlay, projects.length]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setIsMenuOpen(false);
  };

  const iconMap = {
    Briefcase: Briefcase,
    Code: Code,
    Rocket: Rocket,
  };
  const handleMessagesSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ type: "loading", message: "Sending..." });

    try {
      const response = await api.post("/application/messages", formData);
      setFormStatus({ type: "success", message: "Message sent successfully!" });
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setFormStatus({ type: "", message: "" }), 5000);
    } catch (error) {
      console.error("Error sending message:", error);
      setFormStatus({
        type: "error",
        message: "Failed to send message. Please try again.",
      });
      setTimeout(() => setFormStatus({ type: "", message: "" }), 5000);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % projects.length);
    setIsAutoPlay(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + projects.length) % projects.length);
    setIsAutoPlay(false);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlay(false);
  };

  const skills = {
    frontend: [
      { name: "React", level: 95 },
      { name: "JavaScript", level: 90 },
      { name: "HTML/CSS", level: 95 },
      { name: "Tailwind CSS", level: 90 },
      { name: "Redux", level: 85 },
    ],
    backend: [
      { name: "Node.js", level: 90 },
      { name: "Express", level: 90 },
      { name: "MongoDB", level: 85 },
      { name: "REST APIs", level: 90 },
      { name: "WebSockets", level: 80 },
    ],
    languages: [
      { name: "Python", level: 85 },
      { name: "C/C++", level: 80 },
      { name: "JavaScript", level: 90 },
      { name: "TypeScript", level: 75 },
      { name: "SQL", level: 80 },
    ],
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormStatus({ type: "loading", message: "" });

    try {
      await api.post("/application/messages", {
        name: formData.name,
        email: formData.email,
        message: formData.message,
      });

      setFormStatus({
        type: "success",
        message: "Message sent successfully!",
      });

      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      setFormStatus({
        type: "error",
        message:
          error.response?.data?.message ||
          "Failed to send message. Please try again.",
      });
    }
  };

  const navItems = [
    { id: "home", label: "Home", icon: Globe },
    { id: "about", label: "About", icon: User },
    { id: "skills", label: "Skills", icon: Zap },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "projects", label: "Projects", icon: FolderGit2 },
    { id: "contact", label: "Contact", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-x-hidden">
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-slate-800 z-50">
        <div
          className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          style={{
            top: "10%",
            left: "10%",
            transform: `translate(${mousePosition.x * 20}px, ${
              mousePosition.y * 20
            }px)`,
          }}
        />
        <div
          className="absolute w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"
          style={{
            bottom: "10%",
            right: "10%",
            transform: `translate(${mousePosition.x * -20}px, ${
              mousePosition.y * -20
            }px)`,
          }}
        />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-md z-50 border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              {"<Shahriar Shishir />"}
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8">
              {[
                "Home",
                "About",
                "Skills",
                "Projects",
                "Experience",
                "Contact",
                "Blogs",
              ].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="hover:text-purple-400 transition-colors duration-300"
                  onClick={() => setActiveSection(item.toLowerCase())}
                >
                  {item}
                </a>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-slate-800/95 backdrop-blur-md">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {["Home", "About", "Skills", "Projects", "Contact"].map(
                (item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="block px-3 py-2 hover:bg-purple-500/20 rounded-md transition-colors"
                    onClick={() => {
                      setActiveSection(item.toLowerCase());
                      setIsMenuOpen(false);
                    }}
                  >
                    {item}
                  </a>
                )
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="min-h-screen flex items-center justify-center pt-16 px-4"
      >
        <div className="max-w-4xl mx-auto text-center">
          <div
            className={`transform transition-all duration-1000 ${
              isVisible.home
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
              Hi, I'm a{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
                Full Stack Developer
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Building modern web applications with MERN Stack, Python & C/C++
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="#contact"
                className="bg-gradient-to-r from-purple-500 to-pink-600 px-8 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300"
              >
                Get In Touch
              </a>
              <a
                href="#projects"
                className="border-2 border-purple-500 px-8 py-3 rounded-full font-semibold hover:bg-purple-500/20 transform hover:scale-105 transition-all duration-300"
              >
                View Projects
              </a>
            </div>
            <div className="flex justify-center gap-6 mt-8">
              <a
                href="#"
                className="hover:text-purple-400 transform hover:scale-110 transition-all"
              >
                <Github size={28} />
              </a>
              <a
                href="#"
                className="hover:text-purple-400 transform hover:scale-110 transition-all"
              >
                <Linkedin size={28} />
              </a>
              <a
                href="#"
                className="hover:text-purple-400 transform hover:scale-110 transition-all"
              >
                <Mail size={28} />
              </a>
            </div>
          </div>
          <div className="mt-12 animate-bounce">
            <ChevronDown size={32} className="mx-auto text-purple-400" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="min-h-screen flex items-center justify-center px-4 py-20 relative"
      >
        <div className="max-w-6xl mx-auto">
          <div
            className={`transform transition-all duration-1000 ${
              isVisible.about
                ? "translate-x-0 opacity-100"
                : "-translate-x-10 opacity-0"
            }`}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-12 text-center">
              About{" "}
              <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                Me
              </span>
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 transform hover:scale-105">
                <Server className="text-purple-400 mb-4" size={48} />
                <h3 className="text-2xl font-bold mb-4">
                  Full Stack Expertise
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  I'm a passionate full-stack developer specializing in the MERN
                  stack. With expertise in MongoDB, Express.js, React, and
                  Node.js, I create scalable and performant web applications
                  that solve real-world problems.
                </p>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 transform hover:scale-105">
                <Cpu className="text-blue-400 mb-4" size={48} />
                <h3 className="text-2xl font-bold mb-4">
                  Multi-Language Proficiency
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Beyond web development, I have strong foundations in Python
                  and C/C++, enabling me to tackle complex algorithmic
                  challenges, build high-performance applications, and
                  understand systems at a deeper level.
                </p>
              </div>
            </div>

            <div className="mt-8 bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
              <Award className="text-pink-400 mb-4 mx-auto" size={48} />
              <p className="text-lg text-gray-300 leading-relaxed text-center">
                I'm constantly learning and staying updated with the latest
                technologies to deliver modern, user-friendly solutions. My goal
                is to write clean, maintainable code and create applications
                that make a real difference in people's lives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section
        id="skills"
        className="min-h-screen flex items-center justify-center px-4 py-20"
      >
        <div className="max-w-6xl mx-auto w-full">
          <h2 className="text-4xl md:text-6xl font-bold mb-12 text-center">
            Technical{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              Skills
            </span>
          </h2>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Frontend */}
            <div
              className={`transform transition-all duration-1000 delay-100 ${
                isVisible.skills
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 h-full">
                <Code className="text-purple-400 mb-4" size={48} />
                <h3 className="text-2xl font-bold mb-6">Frontend</h3>
                <div className="space-y-4">
                  {skills.frontend.map((skill) => (
                    <div key={skill.name}>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-300">{skill.name}</span>
                        <span className="text-purple-400">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-slate-800/50 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000"
                          style={{
                            width: isVisible.skills ? `${skill.level}%` : "0%",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Backend */}
            <div
              className={`transform transition-all duration-1000 delay-200 ${
                isVisible.skills
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl p-6 border border-blue-500/20 hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 h-full">
                <Database className="text-blue-400 mb-4" size={48} />
                <h3 className="text-2xl font-bold mb-6">Backend</h3>
                <div className="space-y-4">
                  {skills.backend.map((skill) => (
                    <div key={skill.name}>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-300">{skill.name}</span>
                        <span className="text-blue-400">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-slate-800/50 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-1000"
                          style={{
                            width: isVisible.skills ? `${skill.level}%` : "0%",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Languages */}
            <div
              className={`transform transition-all duration-1000 delay-300 ${
                isVisible.skills
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl p-6 border border-green-500/20 hover:border-green-500/40 hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300 h-full">
                <Terminal className="text-green-400 mb-4" size={48} />
                <h3 className="text-2xl font-bold mb-6">Languages</h3>
                <div className="space-y-4">
                  {skills.languages.map((skill) => (
                    <div key={skill.name}>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-300">{skill.name}</span>
                        <span className="text-green-400">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-slate-800/50 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-1000"
                          style={{
                            width: isVisible.skills ? `${skill.level}%` : "0%",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section
        id="experience"
        className="min-h-screen flex items-center justify-center px-4 py-20"
      >
        <div className="max-w-4xl mx-auto w-full">
          <h2 className="text-4xl md:text-6xl font-bold mb-12 text-center">
            Work{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              Experience
            </span>
          </h2>

          <div className="space-y-8">
            {experiences.map((exp, index) => {
              const Icon = exp.icon;
              return (
                <div
                  key={index}
                  className={`transform transition-all duration-1000 delay-${
                    index * 100
                  } ${
                    isVisible.experience
                      ? "translate-x-0 opacity-100"
                      : "translate-x-10 opacity-0"
                  }`}
                >
                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 transform hover:scale-105">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/30">
                        <Icon size={32} className="text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-1">{exp.title}</h3>
                        <p className="text-purple-400 mb-2">{exp.company}</p>
                        <p className="text-gray-400 text-sm mb-3">
                          {exp.period}
                        </p>
                        <p className="text-gray-300">{exp.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Projects Section with Slider */}
      <section
        id="projects"
        className="min-h-screen flex items-center justify-center px-4 py-20"
      >
        <div className="max-w-7xl mx-auto w-full">
          <h2 className="text-4xl md:text-6xl font-bold mb-12 text-center">
            Featured{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              Projects
            </span>
          </h2>

          {/* Slider Container */}
          <div className="relative">
            <div className="overflow-hidden rounded-2xl">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {projects.map((project) => (
                  <div
                    key={project._id}
                    className={`min-w-full flex flex-col md:flex-row items-center justify-center gap-8 bg-gradient-to-br ${project.color} p-8 rounded-2xl shadow-lg`}
                  >
                    {/* Project Info */}
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-3xl font-bold mb-4">
                        {project.title}
                      </h3>
                      <p className="text-gray-200 mb-4 leading-relaxed">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-6">
                        {project.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-4 py-1 bg-slate-900/30 rounded-full border border-white/20 text-sm"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-wrap justify-center md:justify-start gap-4">
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center gap-2 bg-slate-900/40 px-5 py-2 rounded-full hover:bg-slate-900/70 transition-all"
                        >
                          <Github
                            size={18}
                            className="group-hover:text-purple-400"
                          />
                          GitHub
                        </a>
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center gap-2 border border-white/20 px-5 py-2 rounded-full hover:bg-white/10 transition-all"
                        >
                          <ExternalLink
                            size={18}
                            className="group-hover:text-pink-400"
                          />
                          Live Demo
                        </a>
                      </div>
                    </div>

                    {/* Project Thumbnail */}
                    <div className="flex-1 flex justify-center">
                      <div className="w-72 h-48 md:w-96 md:h-60 bg-slate-900/30 border border-white/10 rounded-xl flex items-center justify-center text-gray-400">
                        <Code size={64} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Slider Controls */}
            <button
              onClick={prevSlide}
              className="absolute top-1/2 -left-7 transform -translate-y-1/2 bg-slate-800/70 hover:bg-slate-800 p-3 rounded-full border border-white/20 backdrop-blur-md transition-all"
            >
              <ChevronLeft size={28} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute top-1/2 -right-7 transform -translate-y-1/2 bg-slate-800/70 hover:bg-slate-800 p-3 rounded-full border border-white/20 backdrop-blur-md transition-all"
            >
              <ChevronRight size={28} />
            </button>

            {/* Dots Indicator */}
            <div className="flex justify-center mt-6 gap-3">
              {projects.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    currentSlide === index
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 w-8"
                      : "bg-slate-500/50 hover:bg-slate-400/70"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* Blogs Section */}
      <section
        id="blogs"
        className="min-h-screen flex items-center justify-center px-4 py-20"
      >
        <div className="max-w-5xl mx-auto w-full">
          <h2 className="text-4xl md:text-6xl font-bold mb-12 text-center">
            My{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              Blogs
            </span>
          </h2>

          <div className="h-[60vh] overflow-y-auto space-y-6 pr-2">
            {blogs.map((blog, index) => (
              <div
                key={blog._id}
                onClick={() => setSelectedBlog(blog)}
                className={`blog-card cursor-pointer bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20
            hover:border-purple-500/40 transition-all duration-500
            ${
              isVisible.blogs
                ? "translate-y-0 opacity-100 delay-" + index * 100
                : "translate-y-10 opacity-0"
            }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm px-3 py-1 rounded-full bg-purple-500/20 text-purple-300">
                    {blog.category}
                  </span>
                  <span className="text-gray-400 text-sm">
                    By {blog.author}
                  </span>
                </div>

                <h3 className="text-2xl font-bold mb-2">{blog.title}</h3>
                <p className="text-gray-300 line-clamp-3">{blog.content}</p>
              </div>
            ))}
          </div>
        </div>

        {selectedBlog && (
          <BlogModal
            blog={selectedBlog}
            onClose={() => setSelectedBlog(null)}
          />
        )}
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="min-h-screen flex items-center justify-center px-4 py-20"
      >
        <div className="max-w-4xl mx-auto w-full text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-12">
            Get In{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              Touch
            </span>
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Have a project idea or just want to say hi? Fill out the form below,
            and I’ll get back to you soon!
          </p>

          <form
            onSubmit={handleMessagesSubmit}
            className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20 shadow-lg space-y-6 max-w-2xl mx-auto"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <input
                type="text"
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="p-4 bg-slate-900/50 rounded-lg border border-white/10 focus:border-purple-500 outline-none text-white"
              />
              <input
                type="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="p-4 bg-slate-900/50 rounded-lg border border-white/10 focus:border-purple-500 outline-none text-white"
              />
            </div>

            <textarea
              placeholder="Your Message"
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              required
              className="w-full p-4 bg-slate-900/50 rounded-lg border border-white/10 focus:border-purple-500 outline-none text-white h-40 resize-none"
            />

            <button
              type="submit"
              disabled={formStatus.type === "loading"}
              className="group bg-gradient-to-r from-purple-500 to-pink-600 px-8 py-4 rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/40 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 mx-auto"
            >
              {formStatus.type === "loading" ? (
                <span className="animate-pulse">Sending...</span>
              ) : (
                <>
                  <Send
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                  Send Message
                </>
              )}
            </button>

            {formStatus.message && (
              <p
                className={`mt-4 text-sm ${
                  formStatus.type === "success"
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {formStatus.message}
              </p>
            )}
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900/90 border-t border-purple-500/20 py-6 text-center text-gray-400">
        <p className="text-sm">
          © {new Date().getFullYear()}{" "}
          <span className="text-purple-400 font-semibold">DevPortfolio</span>.
          All rights reserved.
        </p>
        <div className="flex justify-center gap-6 mt-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-purple-400"
          >
            <Github size={20} />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400"
          >
            <Linkedin size={20} />
          </a>
          <a href="mailto:dev@example.com" className="hover:text-pink-400">
            <Mail size={20} />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default App;
const BlogModal = ({ blog, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
      <div className="bg-slate-900 max-w-3xl w-full rounded-2xl p-6 relative border border-purple-500/30">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
        >
          ✕
        </button>

        {/* Meta */}
        <div className="flex flex-wrap gap-3 mb-4">
          <span className="px-3 py-1 text-sm rounded-full bg-purple-500/20 text-purple-300">
            {blog.category}
          </span>
          <span className="text-gray-400 text-sm">Author: {blog.author}</span>
        </div>

        <h2 className="text-3xl font-bold mb-4">{blog.title}</h2>

        {/* Scrollable Blog Content */}
        <div className="max-h-[60vh] overflow-y-auto text-gray-300 leading-relaxed space-y-4">
          {blog.content.split("\n").map((para, index) => (
            <p key={index}>{para}</p>
          ))}
        </div>
      </div>
    </div>
  );
};
