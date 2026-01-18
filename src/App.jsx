import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import api from "./api";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";

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
  ArrowRight,
  Star,
  Download,
  Check,
  Circle,
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
  const [isLoading, setIsLoading] = useState(true);
  const [displayedText, setDisplayedText] = useState("");

  // Mock API URL

  // Loading screen timer
  useEffect(() => {
    // Ensure page starts at top
    window.scrollTo(0, 0);
    document.body.style.overflow = "hidden"; // Prevent scrolling during loading

    // Hide loading screen after animation completes
    // Duration: letter animations (~1000ms) + delay (200ms) + slide-up completion (1500ms)
    const timer = setTimeout(() => {
      setIsLoading(false);
      document.body.style.overflow = "unset"; // Re-enable scrolling
      window.scrollTo({ top: 0, behavior: "smooth" }); // Smooth scroll to top
    }, 2700); // Loading screen stays until website fully covers viewport

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "unset";
    };
  }, []);

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
      { threshold: 0.1 },
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

        // Sort blogs by createdAt (newest first) or by _id if createdAt doesn't exist
        const sortedBlogs = blogsRes.data.sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          }
          // MongoDB ObjectIDs contain timestamp - use them if createdAt doesn't exist
          return b._id.localeCompare(a._id);
        });

        setBlogs(sortedBlogs);
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
    <>
      {/* Loading Screen with Typewriter Effect */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0a0f]"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                className="absolute w-[600px] h-[600px] rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)",
                  top: "20%",
                  left: "10%",
                }}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute w-[500px] h-[500px] rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(236,72,153,0.2) 0%, transparent 70%)",
                  bottom: "15%",
                  right: "10%",
                }}
                animate={{
                  scale: [1.2, 1, 1.2],
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>

            {/* Staggered Letter Reveal */}
            <div className="relative z-10 text-center">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold">
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {"Shahriar Shishir".split("").map((char, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.06,
                        ease: "easeOut",
                      }}
                      className="inline-block"
                      style={{ whiteSpace: char === " " ? "pre" : "normal" }}
                    >
                      {char === " " ? "\u00A0" : char}
                    </motion.span>
                  ))}
                </span>
              </h1>

              {/* Loading Dots */}
              <motion.div
                className="flex justify-center gap-2 mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-purple-400"
                    animate={{
                      y: [0, -10, 0],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden"
        initial={{ y: "100%" }}
        animate={{ y: isLoading ? "100%" : 0 }}
        transition={{
          duration: 1.5,
          ease: [0.25, 0.46, 0.45, 0.94], // Smoother easing - gentle start and end
          delay: isLoading ? 0 : 0.2,
        }}
      >
        {/* Enhanced Scroll Progress Bar */}
        <motion.div
          className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 z-50 origin-left"
          style={{ scaleX: scrollProgress / 100 }}
        />

        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#1a0a2e] to-[#0a0a0f]" />

          {/* Floating orbs */}
          <motion.div
            className="absolute w-[500px] h-[500px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
              top: "10%",
              left: "10%",
              transform: `translate(${mousePosition.x * 30}px, ${
                mousePosition.y * 30
              }px)`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute w-[400px] h-[400px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)",
              bottom: "20%",
              right: "15%",
              transform: `translate(${mousePosition.x * -25}px, ${
                mousePosition.y * -25
              }px)`,
            }}
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute w-[350px] h-[350px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)",
              top: "50%",
              left: "50%",
              transform: `translate(${mousePosition.x * -15}px, ${
                mousePosition.y * 15
              }px)`,
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        {/* Navigation */}
        <motion.nav
          className="fixed top-0 w-full bg-[#0a0a0f]/80 backdrop-blur-xl z-50 border-b border-white/5"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <motion.div
                className="text-2xl font-bold"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {"<Shahriar Shishir />"}
                </span>
              </motion.div>

              {/* Desktop Menu */}
              <div className="hidden md:flex items-center space-x-1">
                {[
                  "Home",
                  "About",
                  "Skills",
                  "Projects",
                  "Experience",
                  "Contact",
                  "Blogs",
                ].map((item, index) => (
                  <motion.a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-lg ${
                      activeSection === item.toLowerCase()
                        ? "text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                    onClick={() => setActiveSection(item.toLowerCase())}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {activeSection === item.toLowerCase() && (
                      <motion.div
                        layoutId="activeSection"
                        className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                    <span className="relative z-10">{item}</span>
                  </motion.a>
                ))}
              </div>

              {/* Mobile Menu Button */}
              <motion.button
                className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                whileTap={{ scale: 0.95 }}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                className="md:hidden bg-[#0a0a0f]/95 backdrop-blur-xl border-t border-white/5"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="px-4 py-4 space-y-2">
                  {[
                    "Home",
                    "About",
                    "Skills",
                    "Projects",
                    "Experience",
                    "Contact",
                    "Blogs",
                  ].map((item, index) => (
                    <motion.a
                      key={item}
                      href={`#${item.toLowerCase()}`}
                      className="block px-4 py-3 rounded-lg hover:bg-white/5 transition-colors text-gray-300 hover:text-white"
                      onClick={() => {
                        setActiveSection(item.toLowerCase());
                        setIsMenuOpen(false);
                      }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {item}
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>

        {/* Hero Section */}
        <section
          id="home"
          className="min-h-screen flex items-center justify-center pt-20 px-4 relative"
        >
          <div className="max-w-6xl mx-auto text-center z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Badge */}
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-sm text-gray-300">
                  Available for new opportunities
                </span>
              </motion.div>

              {/* Main Heading */}
              <motion.h1
                className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <span className="block text-gray-400 text-2xl md:text-3xl font-normal mb-4">
                  Hi, I'm Shahriar Shishir
                </span>
                <span className="block">
                  <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Full Stack
                  </span>
                </span>
                <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
                  Developer
                </span>
              </motion.h1>

              <motion.p
                className="text-lg md:text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                Crafting exceptional digital experiences with{" "}
                <span className="text-blue-400 font-semibold">MERN Stack</span>,{" "}
                <span className="text-purple-400 font-semibold">Python</span> &{" "}
                <span className="text-pink-400 font-semibold">C/C++</span>
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-wrap justify-center gap-4 mb-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                <motion.a
                  href="#contact"
                  className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full font-semibold overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Let's Talk
                    <ArrowRight
                      size={18}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600"
                    initial={{ x: "100%" }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.a>
                <motion.a
                  href="#projects"
                  className="px-8 py-4 rounded-full font-semibold border-2 border-white/20 hover:border-white/40 hover:bg-white/5 transition-all backdrop-blur-sm flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Work
                  <FolderGit2 size={18} />
                </motion.a>
              </motion.div>

              {/* Social Links */}
              <motion.div
                className="flex justify-center gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.8 }}
              >
                {[
                  {
                    icon: Github,
                    href: "https://github.com/shahriarahmedshishir",
                    color: "hover:text-gray-300",
                  },
                  {
                    icon: Linkedin,
                    href: "https://www.linkedin.com/in/shahriarshishir/",
                    color: "hover:text-blue-400",
                  },
                  {
                    icon: Mail,
                    href: "mailto:shesirsikder1234@gmail.com",
                    color: "hover:text-pink-400",
                  },
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 rounded-full bg-white/5 border border-white/10 ${social.color} transition-all backdrop-blur-sm`}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <social.icon size={20} />
                  </motion.a>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* About Section */}
        <section
          id="about"
          className="min-h-screen flex items-center justify-center px-4 py-32 relative"
        >
          <div className="max-w-6xl mx-auto">
            <div>
              {/* Section Header */}
              <div className="text-center mb-16">
                <motion.span
                  className="inline-block text-sm font-semibold text-blue-400 uppercase tracking-wider mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                >
                  Get to know me
                </motion.span>
                <motion.h2
                  className="text-4xl md:text-6xl font-bold"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                >
                  About{" "}
                  <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Me
                  </span>
                </motion.h2>
              </div>

              {/* Cards Grid */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <motion.div
                  className="group relative bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl p-8 border border-white/10 hover:border-blue-500/50 transition-all duration-500 overflow-hidden"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-500/30 transition-all duration-500" />
                  <div className="relative z-10">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6">
                      <Server className="text-white" size={32} />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-white">
                      Full Stack Expertise
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      Specialized in MERN stack development with MongoDB,
                      Express.js, React, and Node.js. I build scalable,
                      high-performance web applications that deliver exceptional
                      user experiences and solve real-world problems.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className="group relative bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-8 border border-white/10 hover:border-purple-500/50 transition-all duration-500 overflow-hidden"
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl group-hover:bg-purple-500/30 transition-all duration-500" />
                  <div className="relative z-10">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-6">
                      <Cpu className="text-white" size={32} />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-white">
                      Multi-Language Proficiency
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      Strong foundation in Python and C/C++ for algorithmic
                      challenges, system-level programming, and high-performance
                      applications. Experienced in tackling complex
                      computational problems efficiently.
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Bottom Card */}
              <motion.div
                className="group relative bg-gradient-to-br from-pink-500/10 to-orange-500/10 rounded-2xl p-8 border border-white/10 hover:border-pink-500/50 transition-all duration-500 overflow-hidden"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                whileHover={{ y: -5 }}
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl group-hover:bg-pink-500/30 transition-all duration-500" />
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-pink-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                    <Award className="text-white" size={32} />
                  </div>
                  <div className="text-center md:text-left flex-1">
                    <h3 className="text-2xl font-bold mb-3 text-white">
                      Continuous Learner & Problem Solver
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      Passionate about staying updated with the latest
                      technologies and best practices. I focus on writing clean,
                      maintainable code and creating applications that make a
                      real impact. My goal is to deliver solutions that not only
                      work but excel.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section
          id="skills"
          className="min-h-screen flex items-center justify-center px-4 py-32"
        >
          <div className="max-w-[90rem] mx-auto">
            <div>
              {/* Section Header */}
              <motion.div
                className="relative z-10 text-center mb-16"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <motion.span
                  className="inline-block text-sm font-semibold text-blue-400 uppercase tracking-wider mb-4"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  My Expertise
                </motion.span>
                <motion.h2
                  className="text-4xl md:text-6xl font-bold"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  Technical{" "}
                  <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Skills
                  </span>
                </motion.h2>
              </motion.div>

              <div className="grid lg:grid-cols-3 gap-8">
                {/* Frontend */}
                <motion.div
                  className="relative group"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />
                  <div className="relative bg-[#0f0f1a]/90 backdrop-blur-xl rounded-2xl p-10 border border-white/10 hover:border-blue-500/50 transition-all duration-500 h-full">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <Code className="text-white" size={28} />
                      </div>
                      <h3 className="text-2xl font-bold">Frontend</h3>
                    </div>
                    <div className="space-y-6">
                      {skills.frontend.map((skill, index) => (
                        <motion.div
                          key={skill.name}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.2 + index * 0.1 }}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-300 font-medium">
                              {skill.name}
                            </span>
                            <span className="text-blue-400 font-semibold">
                              {skill.level}%
                            </span>
                          </div>
                          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.level}%` }}
                              viewport={{ once: true }}
                              transition={{
                                delay: 0.3 + index * 0.1,
                                duration: 1,
                                ease: "easeOut",
                              }}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Backend */}
                <motion.div
                  className="relative group"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />
                  <div className="relative bg-[#0f0f1a]/90 backdrop-blur-xl rounded-2xl p-10 border border-white/10 hover:border-purple-500/50 transition-all duration-500 h-full">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                        <Database className="text-white" size={28} />
                      </div>
                      <h3 className="text-2xl font-bold">Backend</h3>
                    </div>
                    <div className="space-y-6">
                      {skills.backend.map((skill, index) => (
                        <motion.div
                          key={skill.name}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-300 font-medium">
                              {skill.name}
                            </span>
                            <span className="text-purple-400 font-semibold">
                              {skill.level}%
                            </span>
                          </div>
                          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-purple-500 to-pink-600 rounded-full"
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.level}%` }}
                              viewport={{ once: true }}
                              transition={{
                                delay: 0.4 + index * 0.1,
                                duration: 1,
                                ease: "easeOut",
                              }}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Languages */}
                <motion.div
                  className="relative group"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-orange-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />
                  <div className="relative bg-[#0f0f1a]/90 backdrop-blur-xl rounded-2xl p-10 border border-white/10 hover:border-pink-500/50 transition-all duration-500 h-full">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500 to-orange-600 flex items-center justify-center">
                        <Terminal className="text-white" size={28} />
                      </div>
                      <h3 className="text-2xl font-bold">Languages</h3>
                    </div>
                    <div className="space-y-6">
                      {skills.languages.map((skill, index) => (
                        <motion.div
                          key={skill.name}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.4 + index * 0.1 }}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-300 font-medium">
                              {skill.name}
                            </span>
                            <span className="text-pink-400 font-semibold">
                              {skill.level}%
                            </span>
                          </div>
                          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-pink-500 to-orange-600 rounded-full"
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.level}%` }}
                              viewport={{ once: true }}
                              transition={{
                                delay: 0.5 + index * 0.1,
                                duration: 1,
                                ease: "easeOut",
                              }}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section
          id="experience"
          className="min-h-screen flex items-center justify-center px-4 py-32"
        >
          <div className="max-w-5xl mx-auto">
            <div>
              {/* Section Header */}
              <motion.div
                className="relative z-10 text-center mb-16"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <motion.span
                  className="inline-block text-sm font-semibold text-blue-400 uppercase tracking-wider mb-4"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  Career Journey
                </motion.span>
                <motion.h2
                  className="text-4xl md:text-6xl font-bold"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  Work{" "}
                  <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Experience
                  </span>
                </motion.h2>
              </motion.div>

              <div className="space-y-6">
                {experiences.map((exp, index) => {
                  const Icon = iconMap[exp.icon] || Briefcase;
                  return (
                    <motion.div
                      key={index}
                      className="group relative"
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {/* Timeline Line */}
                      {index !== experiences.length - 1 && (
                        <div className="absolute left-8 top-20 w-0.5 h-full bg-gradient-to-b from-blue-500/50 to-transparent md:block hidden" />
                      )}

                      <div className="relative bg-[#0f0f1a]/50 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/10 hover:border-blue-500/50 transition-all duration-500 overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-500" />

                        <div className="relative flex flex-col md:flex-row gap-6">
                          {/* Icon */}
                          <div className="flex-shrink-0">
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                              <Icon size={28} className="text-white" />
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                              <h3 className="text-2xl font-bold text-white mb-2 md:mb-0">
                                {exp.title}
                              </h3>
                              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-400 text-sm font-medium w-fit">
                                <Circle size={8} className="fill-current" />
                                {exp.period}
                              </span>
                            </div>
                            <p className="text-purple-400 font-semibold mb-4 text-lg">
                              {exp.company}
                            </p>
                            <p className="text-gray-400 leading-relaxed">
                              {exp.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {experiences.length === 0 && (
                <motion.div
                  className="text-center py-16"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-6">
                    <Briefcase size={40} className="text-blue-400" />
                  </div>
                  <p className="text-gray-400 text-lg">
                    Experience information will be displayed here
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </section>

        {/* Projects Section with Slider */}
        <section
          id="projects"
          className="min-h-screen flex items-center justify-center px-4 py-20"
        >
          <div className="max-w-7xl mx-auto w-full flex flex-col">
            <div className="flex-1 flex flex-col">
              {/* Section Header */}
              <motion.div
                className="relative z-10 text-center mb-8 flex-shrink-0"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <motion.span
                  className="inline-block text-sm font-semibold text-blue-400 uppercase tracking-wider mb-4"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  Portfolio
                </motion.span>
                <motion.h2
                  className="text-4xl md:text-6xl font-bold"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  Featured{" "}
                  <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Projects
                  </span>
                </motion.h2>
              </motion.div>

              {/* Slider Container */}
              <div className="flex-1 flex items-center px-12">
                {projects.length > 0 ? (
                  <div className="relative w-full">
                    <div className="overflow-hidden rounded-2xl">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={currentSlide}
                          initial={{ opacity: 0, x: 100 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -100 }}
                          transition={{ duration: 0.5 }}
                          className="relative bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />

                          <div className="relative p-6 md:p-8">
                            <div className="flex flex-col lg:flex-row gap-6 items-center">
                              {/* Project Info */}
                              <div className="flex-1 space-y-3">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                                  <Star
                                    size={14}
                                    className="text-yellow-400 fill-yellow-400"
                                  />
                                  <span className="text-xs">
                                    Featured Project
                                  </span>
                                </div>

                                <h3 className="text-xl md:text-2xl font-bold text-white">
                                  {projects[currentSlide].title}
                                </h3>

                                <p className="text-gray-300 leading-relaxed text-sm">
                                  {projects[currentSlide].description}
                                </p>

                                <div className="flex flex-wrap gap-2">
                                  {projects[currentSlide].technologies.map(
                                    (tech) => (
                                      <span
                                        key={tech}
                                        className="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-medium hover:bg-white/10 transition-colors"
                                      >
                                        {tech}
                                      </span>
                                    ),
                                  )}
                                </div>

                                <div className="flex flex-wrap gap-3">
                                  <motion.a
                                    href={projects[currentSlide].githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:border-white/20 transition-all text-sm"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    <Github
                                      size={16}
                                      className="group-hover:text-purple-400 transition-colors"
                                    />
                                    <span>View Code</span>
                                  </motion.a>
                                  <motion.a
                                    href={projects[currentSlide].liveUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full hover:shadow-lg hover:shadow-blue-500/50 transition-all text-sm"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    <span>Live Demo</span>
                                    <ExternalLink
                                      size={16}
                                      className="group-hover:translate-x-1 transition-transform"
                                    />
                                  </motion.a>
                                </div>
                              </div>

                              {/* Project Visual */}
                              <div className="flex-1 flex justify-center lg:justify-end">
                                <motion.div
                                  className="relative w-full max-w-xs aspect-video rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center overflow-hidden group"
                                  whileHover={{ scale: 1.02 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all duration-500" />
                                  <Code
                                    size={60}
                                    className="text-white/20 group-hover:text-white/30 transition-colors"
                                  />
                                </motion.div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* Navigation Buttons */}
                    {projects.length > 1 && !isLoading && (
                      <>
                        <motion.button
                          onClick={prevSlide}
                          className="absolute top-1/2 -left-6 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center z-10"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3, duration: 0.4 }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <ChevronLeft size={24} />
                        </motion.button>
                        <motion.button
                          onClick={nextSlide}
                          className="absolute top-1/2 -right-6 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center z-10"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3, duration: 0.4 }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <ChevronRight size={24} />
                        </motion.button>
                      </>
                    )}

                    {/* Dots Indicator */}
                    {projects.length > 1 && !isLoading && (
                      <motion.div
                        className="flex justify-center mt-4 gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.4 }}
                      >
                        {projects.map((_, index) => (
                          <motion.button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`h-2 rounded-full transition-all ${
                              currentSlide === index
                                ? "w-8 bg-gradient-to-r from-blue-500 to-purple-600"
                                : "w-2 bg-white/20 hover:bg-white/40"
                            }`}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                          />
                        ))}
                      </motion.div>
                    )}
                  </div>
                ) : (
                  <motion.div
                    className="text-center py-16"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                  >
                    <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-6">
                      <FolderGit2 size={40} className="text-blue-400" />
                    </div>
                    <p className="text-gray-400 text-lg">
                      Projects will be displayed here
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </section>
        {/* Blogs Section */}
        <section
          id="blogs"
          className="min-h-screen flex items-center justify-center px-4 py-20"
        >
          <div className="max-w-6xl mx-auto w-full flex flex-col">
            <div className="flex-1 flex flex-col">
              {/* Section Header */}
              <motion.div
                className="relative z-10 text-center mb-8 flex-shrink-0"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <motion.span
                  className="inline-block text-sm font-semibold text-blue-400 uppercase tracking-wider mb-4"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  Thoughts & Ideas
                </motion.span>
                <motion.h2
                  className="text-4xl md:text-6xl font-bold"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  My{" "}
                  <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Blogs
                  </span>
                </motion.h2>
              </motion.div>

              <div className="overflow-y-auto custom-scrollbar pr-2">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {blogs.map((blog, index) => (
                    <motion.div
                      key={blog._id}
                      onClick={() => setSelectedBlog(blog)}
                      className="group cursor-pointer relative bg-[#0f0f1a]/50 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-blue-500/50 transition-all duration-500 overflow-hidden"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all duration-500" />

                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                          <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wide">
                            {blog.category}
                          </span>
                          <ArrowRight
                            size={20}
                            className="text-gray-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all"
                          />
                        </div>

                        <h3 className="text-xl font-bold mb-3 text-white line-clamp-2 group-hover:text-blue-400 transition-colors">
                          {blog.title}
                        </h3>

                        <p className="text-gray-400 text-sm line-clamp-3 mb-4">
                          {blog.content}
                        </p>

                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <User size={16} />
                          <span>{blog.author}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {blogs.length === 0 && (
                <motion.div
                  className="text-center py-16"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-6">
                    <MessageSquare size={40} className="text-blue-400" />
                  </div>
                  <p className="text-gray-400 text-lg">
                    Blog posts will be displayed here
                  </p>
                </motion.div>
              )}
            </div>

            <AnimatePresence>
              {selectedBlog && (
                <BlogModal
                  blog={selectedBlog}
                  onClose={() => setSelectedBlog(null)}
                />
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Contact Section */}
        <section
          id="contact"
          className="min-h-screen flex items-center justify-center px-4 py-20"
        >
          <div className="max-w-4xl mx-auto">
            <div>
              {/* Section Header */}
              <motion.div
                className="relative z-10 text-center mb-12"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <motion.span
                  className="inline-block text-sm font-semibold text-blue-400 uppercase tracking-wider mb-4"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  Let's Connect
                </motion.span>
                <motion.h2
                  className="text-4xl md:text-6xl font-bold"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  Get In{" "}
                  <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                    Touch
                  </span>
                </motion.h2>
              </motion.div>

              <p className="text-gray-300 mb-8 max-w-2xl mx-auto text-center">
                Have a project idea or just want to say hi? Fill out the form
                below, and I’ll get back to you soon!
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
          </div>
        </section>

        {/* Footer */}
        <footer className="relative bg-[#0a0a0f] border-t border-white/5 py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-center md:text-left">
                <div className="text-2xl font-bold mb-2">
                  <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {"<Shahriar Shishir/>"}
                  </span>
                </div>
                <p className="text-gray-400 text-sm">
                  © {new Date().getFullYear()} Shahriar Shishir. All rights
                  reserved.
                </p>
              </div>

              <div className="flex gap-4">
                {[
                  {
                    icon: Github,
                    href: "https://github.com/shahriarahmedshishir",
                    color: "hover:text-gray-300",
                  },
                  {
                    icon: Linkedin,
                    href: "https://www.linkedin.com/in/shahriarshishir/",
                    color: "hover:text-blue-400",
                  },
                  {
                    icon: Mail,
                    href: "mailto:shesirsikder1234@gmail.com",
                    color: "hover:text-pink-400",
                  },
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 rounded-full bg-white/5 border border-white/10 ${social.color} transition-all`}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <social.icon size={20} />
                  </motion.a>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-white/5 text-center">
              <p className="text-gray-500 text-sm">
                Built with <span className="text-red-400">♥</span> using React,
                Tailwind CSS & Framer Motion
              </p>
            </div>
          </div>
        </footer>
      </motion.div>
    </>
  );
};

export default App;

const BlogModal = ({ blog, onClose }) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-[#0f0f1a]/95 backdrop-blur-xl max-w-3xl w-full rounded-3xl p-8 relative border border-white/10 shadow-2xl"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gradient overlay */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />

        {/* Close Button */}
        <motion.button
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center transition-colors z-50"
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
        >
          <X size={20} className="text-gray-400" />
        </motion.button>

        {/* Meta */}
        <div className="relative z-10 flex flex-wrap items-center gap-3 mb-6">
          <span className="px-4 py-2 rounded-full bg-blue-500/20 text-blue-400 text-sm font-semibold uppercase tracking-wide">
            {blog.category}
          </span>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <User size={16} />
            <span>{blog.author}</span>
          </div>
        </div>

        <h2 className="relative z-10 text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          {blog.title}
        </h2>

        {/* Scrollable Blog Content */}
        <div className="relative z-10 max-h-[60vh] overflow-y-auto text-gray-300 leading-relaxed space-y-4 pr-4 custom-scrollbar">
          {blog.content.split("\n").map((para, index) => (
            <p key={index} className="text-base">
              {para}
            </p>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};
