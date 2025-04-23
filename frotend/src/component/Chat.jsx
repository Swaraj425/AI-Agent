/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
    FiPlus, FiSend, FiMenu, FiTrash2, FiMoon, FiSun, FiSettings, FiLogOut, FiCopy,
    FiCamera,
} from "react-icons/fi";
import { RiChatNewLine } from "react-icons/ri";
import robat from '../assets/robat.jpg'
import IntroductionMessage from "./Indtroduction";

const ChatInterface = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [currentChat, setCurrentChat] = useState([]);
    const [message, setMessage] = useState("");
    const [currentStep, setCurrentStep] = useState("introduction");
    const [introductionSent, setIntroductionSent] = useState(false);
    const [nextStepName, setNextStepName] = useState(""); // Store the name of the next step
    const [showNextStepButton, setShowNextStepButton] = useState(false); // New state for "Next Step" button
    const [userProfile, setUserProfile] = useState({
        name: "John Doe",
        email: "john@example.com",
        profileImage: null,
    });
    const [showSettings, setShowSettings] = useState(false);
    const [editProfile, setEditProfile] = useState({
        name: "",
        email: "",
        password: "",
        profileImage: null,
    });
    const [showIntroduction, setShowIntroduction] = useState(true); // New state for introduction

    const messagesEndRef = useRef(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [currentChat]);

    useEffect(() => {
        if (!introductionSent) {
            handleNewChat();
            setIntroductionSent(true);
        }
    }, [introductionSent]);

    const sendMessageToBackend = async (msg, step, isNextStep = false) => {
        try {
            const res = await axios.post("http://127.0.0.1:8000/chat-agent", {
                message: msg,
                current_step: step,
                is_next_step: isNextStep, // Flag to indicate if this is a next-step action
            });

            const aiMessage = res.data.response;
            const nextStep = res.data.next_step;

            setCurrentChat((prev) => [
                ...prev,
                { type: "ai", content: aiMessage },
            ]);
            setCurrentStep(nextStep || step);

            // Show the "Next Step" button only if it's not a query
            if (!isNextStep) {
                setShowNextStepButton(true);
                setNextStepName(nextStep); // Update the next step name
            }
        } catch (error) {
            console.error("Error sending message to backend", error);
        }
    };

    const handleSend = () => {
        if (!message.trim()) return;

        const userMessage = { type: "user", content: message };

        if (showIntroduction) {
            // Add the user's idea to the chat and hide the introduction
            setCurrentChat((prev) => [...prev, userMessage]);
            setShowIntroduction(false);
            sendMessageToBackend(message, currentStep);
        } else {
            // Otherwise, treat it as a user query
            setCurrentChat((prev) => {
                const updatedChat = [...prev, userMessage];
                sendMessageToBackend(message, currentStep);
                return updatedChat;
            });
        }

        setMessage("");
        setShowNextStepButton(false); // Hide the "Next Step" button when the user sends a new message
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleNextStep = () => {
        if (!nextStepName) return;

        // Add the next step name as a user message
        const userMessage = { type: "user", content: `Proceed to ${nextStepName}` };
        setCurrentChat((prev) => [...prev, userMessage]);

        // Send the next step name to the backend
        sendMessageToBackend(nextStepName, currentStep);

        // Hide the "Next Step" button after clicking it
        setShowNextStepButton(false);
    };

    const handleNewChat = () => {
        setCurrentChat([]);
        setShowIntroduction(true); // Show introduction when starting a new chat
        setCurrentStep("idea-validate");
        setShowNextStepButton(false); // Reset the "Next Step" button
        setNextStepName(""); // Reset the next step name
    };

    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                console.error("No token found. Please log in again.");
                return;
            }

            try {
                const res = await axios.get("http://127.0.0.1:8000/user/me", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const userData = res.data;
                setUserProfile({
                    name: userData.full_name || "John Doe",
                    email: userData.email || "john@example.com",
                    profileImage: userData.profile_image || generateDefaultProfileImage(userData.full_name || "John Doe"),
                });
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    console.error("Token expired or invalid. Redirecting to login.");
                    localStorage.removeItem("access_token");
                    window.location.href = "/login";
                } else {
                    console.error("Error fetching user profile", error);
                }
            }
        };

        fetchUserProfile();
    }, []);

    const handleEditProfile = async () => {
        const token = localStorage.getItem("accessToken");
        const formData = new FormData();

        formData.append("name", editProfile.name || userProfile.name);
        formData.append("email", editProfile.email || userProfile.email);
        if (editProfile.password) formData.append("password", editProfile.password);
        if (editProfile.profileImage instanceof File) {
            formData.append("profileImage", editProfile.profileImage);
        }

        try {
            const res = await axios.patch("http://127.0.0.1:8000/user/update", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });

            const updatedUser = res.data.user;

            // Add a timestamp to the profile image URL to prevent caching
            const profileImageWithTimestamp = updatedUser.profile_image
                ? `${updatedUser.profile_image}?t=${new Date().getTime()}`
                : generateDefaultProfileImage(updatedUser.full_name);

            setUserProfile({
                name: updatedUser.full_name,
                email: updatedUser.email,
                profileImage: profileImageWithTimestamp,
            });

            // Reset the editProfile state
            setEditProfile({
                name: "",
                email: "",
                password: "",
                profileImage: null,
            });

            setShowSettings(false);
        } catch (error) {
            console.error("Error updating profile", error);
        }
    };

    // Function to handle image preview
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setEditProfile((prev) => ({
                ...prev,
                profileImage: file,
                previewImage: previewUrl, // Add a preview URL for the selected image
            }));
        }
    };

    const generateDefaultProfileImage = (name) => {
        const canvas = document.createElement("canvas");
        canvas.width = 100;
        canvas.height = 100;
        const ctx = canvas.getContext("2d");

        // Background color
        ctx.fillStyle = "#4A90E2";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Text (first letter of the name)
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 50px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(name.charAt(0).toUpperCase(), canvas.width / 2, canvas.height / 2);

        return canvas.toDataURL("image/png");
    };

    const renderMessageContent = (content) => {
        const lines = content.split("\n").filter((line) => line.trim() !== "");

        // Check for numbered list
        const isNumberedList = lines.every(line => line.trim().match(/^\d+(\.|[)])\s+/));

        if (isNumberedList) {
            return (
                <ol className="list-decimal pl-5">
                    {lines.map((line, index) => {
                        const match = line.match(/^(\d+(\.|[)])\s+)(.*)/);
                        const number = match ? match[1] : '';
                        const text = match ? match[3].trim() : line.trim(); // trim spaces for cleaner output

                        return (
                            <li key={index}>
                                {text}
                            </li>
                        );
                    })}
                </ol>
            );
        }

        // Render normal paragraphs if it's not a list
        return content.split("\n").map((line, index) => <p key={index}>{line}</p>);
    };






    return (
        <div className={`w-screen h-screen overflow-hidden flex ${darkMode ? "bg-black text-white" : "bg-white text-black"}`}>
            {/* Sidebar */}
            <div className={`sm:w-52 ${sidebarOpen ? "md:w-80" : "hidden"} transition-all duration-300 ${darkMode ? "bg-black border-gray-700" : "bg-gray-100 border-gray-300"} border-r flex flex-col`}>
                <div className="p-4">
                    <button
                        className={`w-full py-3 px-4 cursor-pointer ${darkMode ? "bg-black hover:bg-[#0b0b0b] text-white" : "bg-gray-200 hover:bg-gray-300 text-black"} rounded-lg flex items-center justify-start gap-2 transition-colors`}
                        onClick={handleNewChat}
                    >
                        <RiChatNewLine /> New Chat
                    </button>
                </div>

                {/* User Profile */}
                <div className={`p-4 border-t ${darkMode ? "border-gray-700" : "border-gray-300"}`}>
                    <div className="flex items-center gap-3">
                        <img
                            src={userProfile.profileImage}
                            alt="User avatar"
                            className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1">
                            <div className={`font-medium ${darkMode ? "text-white" : "text-black"}`}>{userProfile.name}</div>
                            <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{userProfile.email}</div>
                        </div>
                        <button
                            onClick={() => setShowSettings(true)}
                            className={`p-2 rounded-full ${darkMode ? "hover:bg-[#0b0b0b] text-gray-300" : "hover:bg-gray-200 text-gray-600"} cursor-pointer`}
                        >
                            <FiSettings />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className={`h-[5.1rem] border-b flex items-center px-4 justify-between ${darkMode ? "bg-black border-gray-700" : "bg-gray-100 border-gray-300"}`}>
                    <div className="flex items-center">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className={`p-2 rounded-full mr-2 ${darkMode ? "hover:bg-[#0b0b0b] text-gray-300" : "hover:bg-gray-200 text-gray-600"} cursor-pointer`}
                        >
                            <FiMenu />
                        </button>
                        <h1 className={`text-xl font-semibold ${darkMode ? "text-white" : "text-black"}`}>AI Chat</h1>
                    </div>

                    {/* Conditionally Render New Chat and Profile Icon */}
                    {!sidebarOpen && (
                        <div className="flex items-center gap-4">
                            <button
                                className={`py-2 px-4 rounded-lg flex items-center gap-2 transition-colors ${darkMode ? "bg-black hover:bg-[#0b0b0b]  text-white" : "bg-gray-200 hover:bg-gray-300 text-black"}`}
                                onClick={handleNewChat}
                            >
                                <RiChatNewLine /> New Chat
                            </button>
                            <button
                                onClick={() => setShowSettings(true)}
                                className={`p-2 rounded-full ${darkMode ? "hover:bg-[#0b0b0b] text-gray-300" : "hover:bg-gray-200 text-gray-600"} cursor-pointer`}
                            >
                                <img
                                    src={userProfile.profileImage}
                                    alt="User avatar"
                                    className="w-8 h-8 rounded-full"
                                />
                            </button>
                        </div>
                    )}
                </div>

                {/* Messages */}
                <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${darkMode ? "bg-black text-white" : "bg-white text-black"}`}>
                    {showIntroduction ? (
                        <IntroductionMessage darkMode={darkMode} />
                    ) : (
                        currentChat.map((msg, index) => (
                            <div key={index} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                                <div className={`max-w-[70%] rounded-lg p-4 ${msg.type === "user" ? (darkMode ? "bg-[#1e1e1e] text-white" : "bg-blue-200 text-black") : (darkMode ? "bg-[#0b0b0b] text-white" : "bg-gray-200 text-black")}`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))
                    )}

                    {/* Next Step Button */}
                    {showNextStepButton && nextStepName && (
                        <div className="flex justify-center mt-4">
                            <button
                                onClick={handleNextStep}
                                className={`px-6 py-2 rounded-lg font-semibold transition-colors ${darkMode ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-blue-200 hover:bg-blue-300 text-black"}`}
                            >
                                Proceed to {nextStepName}
                            </button>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className={`border-t p-4 ${darkMode ? "border-gray-700 bg-black" : "border-gray-300 bg-gray-100"}`}>
                    <div className="flex items-end gap-4">
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your message..."
                            className={`flex-1 resize-none rounded-lg p-3 focus:outline-none focus:ring-1 ${darkMode ? "bg-[#0b0b0b] text-white border-gray-700 focus:ring-blue-200" : "bg-white text-gray-500 border-gray-300 focus:ring-blue-500"}`}
                            rows="1"
                        />
                        <button
                            onClick={handleSend}
                            className={`p-3 rounded-lg transition-colors ${darkMode ? "bg-[#0b0b0b] hover:bg-gray-700 text-white" : "bg-gray-200 hover:bg-gray-300 text-black"}`}
                        >
                            <FiSend />
                        </button>
                    </div>
                </div>
            </div>

            {/* Settings Modal */}

            {showSettings && (
                <div className={`fixed inset-0 backdrop-blur-lg ${darkMode ? "bg-black/5   text-white" : "bg-white/5 text-black"} flex items-center justify-center z-10`}>
                    <div className={`border ${darkMode ? "bg-black text-white border-white" : "bg-white text-black border-black"} p-6 rounded-lg shadow-2xl w-full max-w-lg relative`}>
                        {/* Close Button */}
                        <button
                            onClick={() => setShowSettings(false)}
                            className={`absolute top-4 right-4 ${darkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-black"} cursor-pointer`}
                        >
                            ✕
                        </button>

                        {/* Modal Header */}
                        <h2 className={`text-2xl font-bold mb-6 text-center ${darkMode ? "text-white" : "text-black"}`}>Settings</h2>

                        {/* Settings Menu */}
                        <div className={`flex justify-around border-b pb-3 mb-4 ${darkMode ? "border-gray-700" : "border-gray-300"}`}>
                            <button
                                onClick={() => setEditProfile({ ...editProfile, activeTab: "profile" })}
                                className={`px-4 py-2 ${editProfile.activeTab === "profile" ? "border-b-2 border-blue-500 text-blue-500" : darkMode ? "text-gray-300" : "text-gray-600"} cursor-pointer`}
                            >
                                Profile
                            </button>
                            <button
                                onClick={() => setEditProfile({ ...editProfile, activeTab: "theme" })}
                                className={`px-4 py-2 ${editProfile.activeTab === "theme" ? "border-b-2 border-blue-500 text-blue-500" : darkMode ? "text-gray-300" : "text-gray-600"} cursor-pointer`}
                            >
                                Theme
                            </button>
                            <button
                                onClick={() => setEditProfile({ ...editProfile, activeTab: "logout" })}
                                className={`px-4 py-2 ${editProfile.activeTab === "logout" ? "border-b-2 border-blue-500 text-blue-500" : darkMode ? "text-gray-300" : "text-gray-600"} cursor-pointer`}
                            >
                                Logout
                            </button>
                        </div>

                        {/* Profile Tab */}

                        {editProfile.activeTab === "profile" && (
                            <div className="space-y-4">
                                {!editProfile.isEditing ? (
                                    // Default View (Display Profile Info)
                                    <div className="space-y-4">
                                        <div className="flex flex-col items-center">
                                            <img
                                                src={editProfile.previewImage || userProfile.profileImage || "https://via.placeholder.com/150"}
                                                alt="User avatar"
                                                className="w-32 h-32 rounded-full mb-4" // Increased size
                                            />
                                            <h3 className={`text-lg font-medium ${darkMode ? 'bg-black text-white' : 'bg-white text-black'} dark:`}>{userProfile.name}</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{userProfile.email}</p>
                                        </div>
                                        <button
                                            onClick={() => setEditProfile({ ...editProfile, isEditing: true })}
                                            className={`w-full px-4 py-2 ${darkMode ? 'bg-white text-black' : 'bg-black text-white'} cursor-pointer rounded-lg transition`}
                                        >
                                            Edit Profile
                                        </button>
                                    </div>
                                ) : (
                                    // Edit Mode (Update Profile Info)
                                    <div className="space-y-4">
                                        <div className="relative flex justify-center items-center">
                                            {/* Profile Image Container */}
                                            <div className="w-32 h-32 rounded-full overflow-hidden relative">
                                                {/* Profile Image */}
                                                <img
                                                    src={editProfile.previewImage || userProfile.profileImage || "https://via.placeholder.com/150"}
                                                    alt="User avatar"
                                                    className="w-full h-full object-cover"
                                                />
                                                {/* Hover Overlay */}
                                                <div className={`absolute inset-0 bg-black/50 rounded-full flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer`}>
                                                    <FiCamera className="text-white text-3xl mb-1" />
                                                    <span className="text-white text-sm text-center">CHANGE PROFILE PHOTO</span>
                                                    <input
                                                        type="file"
                                                        id="profileImageInput"
                                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                                        onChange={handleImageChange} // Use the new handler for image preview
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label className={`block text-sm font-medium ${darkMode ? 'text-white' : 'text-black'} mb-1`}>
                                                Name
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Name"
                                                value={editProfile.name}
                                                onChange={(e) => setEditProfile({ ...editProfile, name: e.target.value })}
                                                className={`w-full p-3 border rounded-lg ${darkMode ? 'bg-transparent text-white placeholder:text-gray-400' : 'bg-transparent text-black placeholder:text-gray-500'}  `}
                                            />
                                        </div>
                                        <div>
                                            <label className={`block text-sm font-medium ${darkMode ? 'text-white' : 'text-black'} mb-1`}>
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                placeholder="Email"
                                                value={editProfile.email}
                                                onChange={(e) => setEditProfile({ ...editProfile, email: e.target.value })}
                                                className={`w-full p-3 border rounded-lg ${darkMode ? 'bg-transparent text-white placeholder:text-gray-400' : 'bg-transparent text-black placeholder:text-gray-500'}`}
                                            />
                                        </div>
                                        <div>
                                            <a
                                                href="#"
                                                onClick={() => alert("Redirect to reset password page")}
                                                className="text-blue-500 hover:underline cursor-pointer"
                                            >
                                                Reset Password
                                            </a>
                                        </div>
                                        <div className="flex justify-between">
                                            <button
                                                onClick={() => setEditProfile({ ...editProfile, isEditing: false })}
                                                className={`px-4 py-2 bg-gray-300 ${darkMode ? 'bg-red-500 text-white' : 'bg-red-500 text-white'} rounded-lg cursor-pointer `}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleEditProfile}
                                                className={`px-4 py-2 ${darkMode ? 'bg-white text-black' : 'bg-black text-white'} rounded-lg cursor-pointer`}
                                            >
                                                Save Changes
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Theme Tab */}
                        {editProfile.activeTab === "theme" && (
                            <div className="space-y-4">
                                <h3 className={`text-lg font-medium ${darkMode ? "text-white" : "text-black"}`}>Theme Settings</h3>
                                <div className="flex items-center justify-between">
                                    <span className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}>Dark Mode</span>
                                    <button
                                        onClick={() => setDarkMode(!darkMode)}
                                        className={`px-4 py-2 rounded-lg ${darkMode ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-800"} cursor-pointer`}
                                    >
                                        {darkMode ? "Enabled" : "Disabled"}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Logout Tab */}
                        {editProfile.activeTab === "logout" && (
                            <div className="space-y-4">
                                <h3 className={`text-lg font-medium ${darkMode ? "text-white" : "text-black"}`}>Are you sure you want to logout?</h3>
                                <button
                                    onClick={async () => {
                                        try {
                                            await axios.post("http://127.0.0.1:8000/logout");
                                            localStorage.removeItem("accessToken");
                                            window.location.href = "/login";
                                        } catch (error) {
                                            console.error("Error logging out", error);
                                        }
                                    }}
                                    className={`w-full px-4 py-2 rounded-lg transition ${darkMode ? "bg-red-500 text-white hover:bg-red-600" : "bg-red-500 text-white hover:bg-red-600"} cursor-pointer`}
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

        </div>
    );
};

export default ChatInterface;