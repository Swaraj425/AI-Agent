/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import User from './component/User';
import Chat from './component/Chat';
import { FiEye, FiEyeOff, FiLock, FiMail, FiMenu, FiMoon, FiSun, FiUser } from "react-icons/fi";
import axios from "axios";
import { IoShieldCheckmarkOutline } from "react-icons/io5";

const LandingPage = () => {
    const scrollToSection = (id) => {
        const section = document.getElementById(id);
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
        if (navbarOpen) {
            setNavbarOpen(!navbarOpen)
        }
    };

    const [isAuthenticated, setIsAuthenticated] = useState(false); // Track login status

    const handleLoginSuccess = () => {
        setIsAuthenticated(true); // Update state when login is successful
    };

    const steps = [
        {
            id: "idea-validate",
            number: 1,
            title: "Idea Validation",
            description: "Pre-launch insights to shape your startup idea.",
            icon: "🔍",
        },
        {
            id: "mvp-planning",
            number: 2,
            title: "MVP Planning",
            description: "Get an actionable plan for your first product.",
            icon: "🛠️",
        },
        {
            id: "go-to-market",
            number: 3,
            title: "Go-To Market Strategy",
            description: "Proven tactics for a successful launch.",
            icon: "🚀",
        },
        {
            id: "pitch-deck",
            number: 4,
            title: "Pitch Deck",
            description: "Create investor-ready presentations.",
            icon: "📊",
        },
        {
            id: "business-model",
            number: 5,
            title: "Business Model",
            description: "Define a sustainable and scalable business model.",
            icon: "📋",
        },
        {
            id: "financial-forecast",
            number: 6,
            title: "Financial Forecast",
            description: "Plan your finances and predict future growth.",
            icon: "💵",
        },
        {
            id: "competitive-analysis",
            number: 7,
            title: "Competitive Analysis",
            description: "Understand your competitors and market position.",
            icon: "📈",
        },
        {
            id: "investor-email",
            number: 8,
            title: "Investor Email",
            description: "Craft compelling emails to attract investors.",
            icon: "✉️",
        },
        {
            id: "tagline-name",
            number: 9,
            title: "Tagline & Name",
            description: "Create a memorable name and tagline for your startup.",
            icon: "🏷️",
        },
    ];

    const [theme, setTheme] = useState("light");

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") || "light";
        setTheme(savedTheme);
        document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        document.documentElement.classList.toggle("dark", newTheme === "dark");
    };

    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        password: ""
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validatePassword = (password) => {
        const strength = {
            hasLength: password.length >= 8,
            hasUpperCase: /[A-Z]/.test(password),
            hasLowerCase: /[a-z]/.test(password),
            hasNumber: /[0-9]/.test(password),
            hasSpecial: /[!@#$%^&*]/.test(password)
        };
        return Object.values(strength).filter(Boolean).length;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const newErrors = {};

        if (!isLogin) {
            if (!formData.full_name || formData.full_name.split(" ").length < 2) {
                newErrors.full_name = "Please enter your full name (first & last name)";
            }
        }

        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (!formData.password || formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters long";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            try {
                const url = isLogin
                    ? "http://127.0.0.1:8000/auth/login"
                    : "http://127.0.0.1:8000/auth/register";

                const payload = {
                    email: formData.email,
                    password: formData.password,
                };
                if (!isLogin) {
                    payload.full_name = formData.full_name;
                }

                const response = await axios.post(
                    url,
                    payload,
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                console.log("Success:", response.data);

                if (isLogin) {
                    localStorage.setItem('accessToken', response.data.access_token);
                    localStorage.setItem('tokenType', response.data.token_type);
                    alert("Login successful!");
                    handleLoginSuccess();
                } else {
                    alert("Registration successful! Please log in.");
                    setIsLogin(true);
                }

            } catch (error) {
                console.error("Error:", error.response?.data?.detail || error.message);
                alert(error.response?.data?.detail || "Something went wrong");
            } finally {
                setLoading(false);
            }

        } else {
            setLoading(false);
        }
    };

    const [navbarOpen, setNavbarOpen] = useState(false);

    return (
        <>
            {
                isAuthenticated ? (
                    <Chat />
                ) : (
                    <div className={`min-h-screen ${theme === "light" ? 'bg-gradient-to-b from-blue-50 to-white text-gray-900' : 'bg-gradient-to-b from-zinc-950 to-black text-white'} `}>
                        {/* Navbar */}
                        <header className={`flex justify-between items-center px-8 py-4 ${theme === "light" ? 'bg-white text-black ' : 'bg-black text-white'} shadow-md sticky top-0 z-50`}>
                            <h1 className={`text-2xl font-bold ${theme === "light" ? "text-black" : "text-white"}`}>AI Agent</h1>

                            {/* Hamburger Menu for Small Screens */}
                            <button
                                className="sm:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mr-8"
                                onClick={() => setNavbarOpen(!navbarOpen)}
                            >
                                <FiMenu className={`w-6 h-6 ${theme === "light" ? "text-black" : "text-white"}`} />
                            </button>

                            {/* Navigation Links */}
                            <nav
                                className={`${navbarOpen ? "block" : "hidden"
                                    } sm:flex sm:space-x-6 absolute sm:static top-full left-0 w-full sm:w-auto ${theme == "light" ? "bg-white text-black" : "bg-black text-white"} sm:bg-transparent shadow-lg sm:shadow-none z-10 hover:text-blue-400 `}
                            >
                                <button
                                    onClick={() => scrollToSection("home")}
                                    className={`${theme === "light" ? "text-gray-900" : "text-white"} cursor-pointer hover:text-blue-600 block sm:inline-block px-4 py-2 sm:p-0`}
                                >
                                    Home
                                </button>
                                <button
                                    onClick={() => scrollToSection("about")}
                                    className={`${theme === "light" ? "text-gray-900" : "text-white"} cursor-pointer hover:text-blue-600 block sm:inline-block px-4 py-2 sm:p-0`}
                                >
                                    About Us
                                </button>
                                <button
                                    onClick={() => scrollToSection("features")}
                                    className={`${theme === "light" ? "text-gray-900" : "text-white"} cursor-pointer hover:text-blue-600 block sm:inline-block px-4 py-2 sm:p-0`}
                                >
                                    Features
                                </button>

                                {/* Sign In Button for Small Screens */}
                                <button
                                    onClick={() => scrollToSection("auth")}
                                    className={`block sm:hidden px-4 py-2 cursor-pointer ${theme === "light" ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'} rounded-lg mt-2 mb-10 w-[90%] mx-auto   `}
                                >
                                    Sign In
                                </button>

                            </nav>

                            <button
                                onClick={() => scrollToSection("auth")}
                                className={`hidden sm:block px-4 py-2 cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg mr-8`}
                            >
                                Sign In
                            </button>

                            <div className="absolute top-4 right-5">
                                <button
                                    onClick={toggleTheme}
                                    className={`p-2 rounded-full ${theme === "light" ? 'border border-black' : 'border border-white'} `}
                                >
                                    {theme === "light" ? <FiMoon className="w-5 h-5" /> : <FiSun className="w-5 h-5" />}
                                </button>
                            </div>
                        </header>

                        {/* Home Section */}
                        <div className="py-32">
                            <section id="home" className="mb-20 text-center py-32">
                                <div className="flex flex-col md:flex-col items-center justify-center">
                                    <div className="md:w-1/2">
                                        <h2 className={`text-4xl font-bold ${theme === "light" ? "text-black" : "text-white"}  mb-4`}>
                                            AI Agent for Startups
                                        </h2>
                                        <p className={`text-lg ${theme === "light" ? "text-black" : "text-white"} mb-8 text-wrap`}>
                                            <p className={`text-lg ${theme === "light" ? "text-black" : "text-white"} mb-8 text-wrap`}>
                                                Revolutionize your startup journey with AI-driven strategies. Validate your ideas, plan your MVP, and more, and launch with confidence.
                                            </p>
                                        </p>
                                        <button
                                            onClick={() => scrollToSection("auth")}
                                            className={`px-6 py-3 ${theme === "light" ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 " : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 "} text-white cursor-pointer rounded-lg`}
                                        >
                                            Start Validating Your Idea
                                        </button>
                                    </div>
                                    <div className="mt-8 md:mt-0">
                                        <img
                                            src="https://plus.unsplash.com/premium_vector-1682310916908-3dd53df309b8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDExfHx8ZW58MHx8fHx8"
                                            alt="AI Agent Illustration"
                                            className="rounded-lg shadow-lg"
                                        />
                                    </div>
                                </div>
                            </section>

                            <section id="about" className="mt-16 py-32">
                                <h3 className={`text-3xl font-bold text-center ${theme === "light" ? "text-black" : "text-white"} mb-12`}>
                                    About Us
                                </h3>
                                <div className="max-w-4xl mx-auto px-8 text-center">
                                    <p className={`text-lg ${theme === "light" ? "text-black" : "text-white"} mb-6`}>
                                        Welcome to <span className="font-bold">AI Agent</span> — your ultimate startup co-founder powered by AI.
                                        We believe that great ideas deserve the best chance to succeed. Our mission is to empower aspiring entrepreneurs
                                        and early-stage startups by providing instant, actionable guidance throughout their journey.
                                    </p>
                                    <p className={`text-lg ${theme === "light" ? "text-black" : "text-white"} mb-6`}>
                                        With our platform, you can seamlessly validate your startup ideas, craft MVP plans, design investor-ready pitch decks,
                                        and build robust go-to-market strategies — all with the help of intelligent AI tools.
                                        Whether you need financial forecasts, business model frameworks, competitive analysis, or compelling investor emails,
                                        <span className="font-bold"> AI Agent </span> is here to support you at every step.
                                    </p>
                                    <p className={`text-lg ${theme === "light" ? "text-black" : "text-white"}`}>
                                        Our vision is to democratize entrepreneurship by making world-class startup resources accessible to everyone.
                                        Join us and revolutionize your startup journey with confidence, speed, and innovation.
                                    </p>
                                </div>
                            </section>

                            <section id="features" className="mt-44 py-32">
                                <h3 className={`text-3xl font-bold text-center ${theme === "light" ? "text-black" : "text-white"} mb-12`}>
                                    Transform Your Startup Journey
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-8">
                                    {steps.map((step) => (
                                        <div
                                            key={step.id}
                                            className={`${theme === "light" ? "bg-gray-200 text-black" : "bg-zinc-950 text-white"} shadow-lg rounded-lg p-6 text-center`}
                                        >
                                            <div className="w-16 h-16 mx-auto bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 text-3xl">
                                                {step.icon}
                                            </div>
                                            <h4 className="text-xl font-bold mb-2">{step.title}</h4>
                                            <p className="text-gray-600">{step.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>


                            <section id="auth">
                                <div className={`min-h-screen flex items-center justify-center p-4`}>
                                    <div className={`max-w-md w-full space-y-8 ${theme === "dark" ? "bg-[#171717] text-white" : "bg-white"} backdrop-blur-xl p-8 rounded-2xl shadow-2xl relative z-10`}>
                                        <div className="text-center">
                                            <div className={`w-20 h-20 mx-auto mb-4 ${theme === "dark" ? "bg-gradient-to-r from-blue-600 to-purple-600" : "bg-gradient-to-r from-blue-600 to-purple-600"} rounded-2xl flex items-center justify-center`}>
                                                <IoShieldCheckmarkOutline className="w-12 h-12 text-white" />
                                            </div>
                                            <h2 className="text-3xl font-bold mb-2">
                                                {isLogin ? "Welcome Back" : "Create Account"}
                                            </h2>
                                            <p>
                                                {isLogin
                                                    ? "Sign in to revolutionize your startup journey with AI."
                                                    : "Empower your startup dreams with AI-driven strategies."}
                                            </p>
                                        </div>

                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            {!isLogin && (
                                                <div>
                                                    <label className="block text-sm font-medium">
                                                        Full Name
                                                    </label>
                                                    <div className="mt-1 relative">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                                            <FiUser className="h-5 w-5" />
                                                        </div>
                                                        <input
                                                            type="text"
                                                            value={formData.full_name}
                                                            onChange={(e) =>
                                                                setFormData({ ...formData, full_name: e.target.value })
                                                            }
                                                            className="appearance-none block w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400"
                                                            placeholder="John Doe"
                                                        />
                                                    </div>
                                                    {errors.full_name && (
                                                        <p className="mt-2 text-sm text-red-600">{errors.full_name}</p>
                                                    )}
                                                </div>
                                            )}

                                            <div>
                                                <label className="block text-sm font-medium">
                                                    Email address
                                                </label>
                                                <div className="mt-1 relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                                        <FiMail className="h-5 w-5" />
                                                    </div>
                                                    <input
                                                        type="email"
                                                        value={formData.email}
                                                        onChange={(e) =>
                                                            setFormData({ ...formData, email: e.target.value })
                                                        }
                                                        className="appearance-none block w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400"
                                                        placeholder="your@email.com"
                                                    />
                                                </div>
                                                {errors.email && (
                                                    <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium">
                                                    Password
                                                </label>
                                                <div className="mt-1 relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                                        <FiLock className="h-5 w-5" />
                                                    </div>
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        value={formData.password}
                                                        onChange={(e) =>
                                                            setFormData({ ...formData, password: e.target.value })
                                                        }
                                                        className="appearance-none block w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400"
                                                        placeholder="••••••••"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                                    >
                                                        {showPassword ? (
                                                            <FiEyeOff className="h-5 w-5" />
                                                        ) : (
                                                            <FiEye className="h-5 w-5" />
                                                        )}
                                                    </button>
                                                </div>
                                                {errors.password && (
                                                    <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                                                )}
                                                {!isLogin && formData.password && (
                                                    <div className="mt-2">
                                                        <div className="flex gap-2 mb-1">
                                                            {[...Array(5)].map((_, i) => (
                                                                <div
                                                                    key={i}
                                                                    className={`h-1 flex-1 rounded-full ${i < validatePassword(formData.password)
                                                                        ? "bg-green-500"
                                                                        : "bg-gray-200"
                                                                        }`}
                                                                />
                                                            ))}
                                                        </div>
                                                        <p className="text-xs">
                                                            Password strength:{" "}
                                                            {["Weak", "Fair", "Good", "Strong", "Excellent"][
                                                                validatePassword(formData.password) - 1
                                                            ] || "Too weak"}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            {isLogin && (
                                                <div className="text-sm">
                                                    <a
                                                        href="#"
                                                        className="font-medium text-blue-600 hover:text-blue-500"
                                                    >
                                                        Forgot your password?
                                                    </a>
                                                </div>
                                            )}

                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full flex justify-center py-3 px-4 border rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ease-in-out"
                                            >
                                                {loading ? (
                                                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                ) : isLogin ? (
                                                    "Sign in"
                                                ) : (
                                                    "Create account"
                                                )}
                                            </button>
                                        </form>

                                        <div className="text-center">
                                            <p className="text-sm">
                                                {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                                                <button
                                                    type="button"
                                                    onClick={() => setIsLogin(!isLogin)}
                                                    className="font-medium text-blue-600 hover:text-blue-500"
                                                >
                                                    {isLogin ? "Sign up" : "Sign in"}
                                                </button>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                        </div>

                        <footer className="py-8 text-center">
                            <p className="text-gray-600">
                                © 2025 AI Agent. All rights reserved.
                            </p>
                        </footer>
                    </div>
                )
            }
        </>
    );
};

export default LandingPage;