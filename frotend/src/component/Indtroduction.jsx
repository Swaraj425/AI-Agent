import React from 'react';

const IntroductionMessage = ({ darkMode }) => {
    return (
        <div
            className={`flex flex-col items-center justify-center text-center p-6 sm:p-12 space-y-12 ${
                darkMode ? 'bg-black text-white' : 'bg-white text-black'
            }`}
        >
            {/* Welcome Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-4xl font-extrabold">
                👋 Welcome to your{' '}
                <span className={darkMode ? 'text-blue-400' : 'text-blue-500'}>
                    Startup AI Agent!
                </span>
            </h1>

            {/* Tools List */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-10 mt-8">
                <div className="flex items-center space-x-3 sm:space-x-2">
                    <span className="text-xl sm:text-2xl lg:text-2xl">💡</span>
                    <span
                        className={`text-lg sm:text-xl lg:text-xl ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}
                    >
                        Idea Validation
                    </span>
                </div>
                <div className="flex items-center space-x-3 sm:space-x-2">
                    <span className="text-2xl sm:text-3xl lg:text-2xl">📈</span>
                    <span
                        className={`text-lg sm:text-xl lg:text-xl ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}
                    >
                        Go-To-Market Strategy
                    </span>
                </div>
                <div className="flex items-center space-x-3 sm:space-x-2">
                    <span className="text-2xl sm:text-3xl lg:text-2xl">📝</span>
                    <span
                        className={`text-lg sm:text-xl lg:text-xl ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}
                    >
                        MVP Planning
                    </span>
                </div>
                <div className="flex items-center space-x-3 sm:space-x-2">
                    <span className="text-2xl sm:text-3xl lg:text-2xl">📊</span>
                    <span
                        className={`text-lg sm:text-xl lg:text-xl ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}
                    >
                        Pitch Deck Generator
                    </span>
                </div>
                <div className="flex items-center space-x-3 sm:space-x-2">
                    <span className="text-2xl sm:text-3xl lg:text-2xl">💰</span>
                    <span
                        className={`text-lg sm:text-xl lg:text-xl ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}
                    >
                        Financial Forecasting
                    </span>
                </div>
                <div className="flex items-center space-x-3 sm:space-x-2">
                    <span className="text-2xl sm:text-3xl lg:text-2xl">📉</span>
                    <span
                        className={`text-lg sm:text-xl lg:text-xl ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}
                    >
                        Competitive Analysis
                    </span>
                </div>
                <div className="flex items-center space-x-3 sm:space-x-2">
                    <span className="text-2xl sm:text-3xl lg:text-2xl">✉️</span>
                    <span
                        className={`text-lg sm:text-xl lg:text-xl ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}
                    >
                        Investor Email Drafting
                    </span>
                </div>
                <div className="flex items-center space-x-3 sm:space-x-2">
                    <span className="text-2xl sm:text-3xl lg:text-2xl">🏷️</span>
                    <span
                        className={`text-lg sm:text-xl lg:text-xl ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}
                    >
                        Tagline & Name Generator
                    </span>
                </div>
            </div>

            {/* Call to Action */}
            <p
                className={`text-lg sm:text-xl lg:text-2xl ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                } mt-1`}
            >
                🚀 Let's begin with your idea. What's your startup idea?
            </p>
        </div>
    );
};

export default IntroductionMessage;