import React from "react";

const LandingPage = ({ onStartValidating }) => {
    const scrollToSection = (id) => {
        const section = document.getElementById(id);
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-gray-900">
            {/* Navbar */}
            <header className="flex justify-between items-center px-8 py-4 bg-white shadow-md sticky top-0 z-50">
                <h1 className="text-2xl font-bold text-blue-600">AI Agent</h1>
                <nav className="space-x-6">
                    <button
                        onClick={() => scrollToSection("home")}
                        className="text-gray-700 cursor-pointer hover:text-blue-600"
                    >
                        Home
                    </button>
                    <button
                        onClick={() => scrollToSection("features")}
                        className="text-gray-700 cursor-pointer hover:text-blue-600"
                    >
                        Features
                    </button>
                    <button
                        onClick={() => scrollToSection("community")}
                        className="text-gray-700 cursor-pointer hover:text-blue-600"
                    >
                        Community
                    </button>
                </nav>
                <button
                    onClick={onStartValidating}
                    className="px-4 py-2 bg-blue-600 cursor-pointer text-white rounded-lg hover:bg-blue-700"
                >
                    Sign In
                </button>
            </header>

            {/* Home Section */}
            <main className="px-8 py-16">
                <section id="home" className="text-center h-[40rem]">
                    <div className="flex flex-col md:flex-col items-center justify-center">
                        <div className="md:w-1/2">
                            <h2 className="text-4xl font-bold text-blue-600 mb-4">
                                AI Agent for Startups
                            </h2>
                            <p className="text-lg text-gray-700 mb-8">
                                Revolutionize your startup journey with AI-driven strategies.
                                Validate your ideas, plan your MVP, and launch with confidence.
                            </p>
                            <button
                                onClick={onStartValidating}
                                className="px-6 py-3 bg-blue-600 cursor-pointer text-white rounded-lg hover:bg-blue-700"
                            >
                                Start Validating Your Idea
                            </button>
                        </div>
                        <div className="mt-8 md:mt-0">
                            <img
                                src="https://plus.unsplash.com/premium_vector-1682310916908-3dd53df309b8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDExfHx8ZW58MHx8fHx8" // Replace with your image URL
                                alt="AI Agent Illustration"
                                className="rounded-lg shadow-lg"
                            />
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="mt-16">
                    <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">
                        Transform Your Startup Journey
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                                🔍
                            </div>
                            <h4 className="text-lg font-bold">Idea Validation</h4>
                            <p className="text-gray-600">
                                Pre-launch insights to shape your startup idea.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                                🛠️
                            </div>
                            <h4 className="text-lg font-bold">MVP Planning</h4>
                            <p className="text-gray-600">
                                Get an actionable plan for your first product.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                                🚀
                            </div>
                            <h4 className="text-lg font-bold">Go-To Market Strategy</h4>
                            <p className="text-gray-600">
                                Proven tactics for a successful launch.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                                📊
                            </div>
                            <h4 className="text-lg font-bold">Pitch Deck Generator</h4>
                            <p className="text-gray-600">
                                Create investor-ready presentations.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                                📊
                            </div>
                            <h4 className="text-lg font-bold">Pitch Deck Generator</h4>
                            <p className="text-gray-600">
                                Create investor-ready presentations.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                                📊
                            </div>
                            <h4 className="text-lg font-bold">Pitch Deck Generator</h4>
                            <p className="text-gray-600">
                                Create investor-ready presentations.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                                📊
                            </div>
                            <h4 className="text-lg font-bold">Pitch Deck Generator</h4>
                            <p className="text-gray-600">
                                Create investor-ready presentations.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                                📊
                            </div>
                            <h4 className="text-lg font-bold">Pitch Deck Generator</h4>
                            <p className="text-gray-600">
                                Create investor-ready presentations.
                            </p>
                        </div>

                    </div>
                </section>

                {/* Community Section */}
                <section id="community" className="mt-16">
                    <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">
                        Join Our Community
                    </h3>
                    <p className="text-center text-gray-600">
                        Connect with like-minded entrepreneurs and share your journey.
                    </p>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-gray-100 py-8 text-center">
                <p className="text-gray-600">
                    © 2025 AI Agent. All rights reserved.
                </p>
            </footer>
        </div>
    );
};

export default LandingPage;