import React, { useState, useEffect } from "react";
import { FiEye, FiEyeOff, FiLock, FiMail, FiUser, FiSun, FiMoon } from "react-icons/fi";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import axios from "axios";

const AuthPages = ({ onLoginSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        password: ""
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [theme, setTheme] = useState("light");

    // Load theme from localStorage
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

        // Validate inputs
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

                    onLoginSuccess();
                    alert("Login successful!");
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

    return (
        <div className={`min-h-screen flex items-center justify-center p-4 ${theme === "dark" ? "bg-[#0b0b0b] text-white" : "bg-gray-100 text-gray-900"}`}>
            <div className="absolute top-4 right-4">
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                >
                    {theme === "light" ? <FiMoon className="w-5 h-5" /> : <FiSun className="w-5 h-5" />}
                </button>
            </div>

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
    );
};

export default AuthPages;