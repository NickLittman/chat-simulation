"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  generateRandomMessage,
  generateRandomUser,
  getRandomColor,
} from "../utils/generateRandom.js";
import "../globals.css";
import { FaGithub } from "react-icons/fa";


const ChatSimulation = () => {
  const [message, setMessage] = useState("");
  const [messageRate, setMessageRate] = useState(5);
  const [simulationState, setSimulationState] = useState("stopped"); // 'stopped', 'running', 'paused'
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false); // State for controlling the toast visibility
  const [showMoment, setShowMoment] = useState(true); // State for controlling the moment visibility

  const chatWindowRef = useRef(null);
  const messageIntervalRef = useRef(null);

  const appendMessage = (msg, isUser = false) => {
    const bubble = document.createElement("div");
    bubble.className = "chat-bubble" + (isUser ? " user-message" : "");
    bubble.textContent = msg;

    const label = document.createElement("span");
    label.textContent = isUser ? "You" : generateRandomUser();
    label.style.color = isUser ? "#ff4500" : getRandomColor();
    label.style.fontWeight = "bold";
    label.style.marginRight = "10px";

    const messageContainer = document.createElement("div");
    messageContainer.className = "message-container";
    messageContainer.appendChild(label);
    messageContainer.appendChild(bubble);

    chatWindowRef.current.appendChild(messageContainer);
    chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
  };

  const handleSendMessage = () => {
    if (message) {
      appendMessage(message, true); // true for user message
      setMessage("");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  const startSimulation = () => {
    if (simulationState === "stopped" || simulationState === "paused") {
      setSimulationState("running");
      const intervalTime = 1000 / messageRate;
      messageIntervalRef.current = setInterval(() => {
        appendMessage(generateRandomMessage());
      }, intervalTime);
    }
  };

  const handlePauseResume = () => {
    if (simulationState === "running") {
      clearInterval(messageIntervalRef.current);
      setSimulationState("paused");
    } else if (simulationState === "paused") {
      startSimulation();
    }
  };

  const handleStopSimulation = () => {
    clearInterval(messageIntervalRef.current);
    setSimulationState("stopped");
    chatWindowRef.current.innerHTML = ""; // Clear all messages
  };

  const handleCreateMoment = () => {
    const previousRate = messageRate;
    setMessageRate(5 * previousRate); // Update message rate for the moment
    clearInterval(messageIntervalRef.current); // Clear the existing interval

    // Start a new interval with the updated message rate
    const intervalTime = 1000 / (5 * previousRate);
    messageIntervalRef.current = setInterval(() => {
      appendMessage(generateRandomMessage());
    }, intervalTime);

    setToastMessage(`⭐⭐⭐Big moment! Message Rate Spiked to ${5 * previousRate} mps⭐⭐⭐`);
    setShowToast(true);
    setShowMoment(false);

    // Restore the previous message rate after 2 seconds
    setTimeout(() => {
      setMessageRate(previousRate);
      clearInterval(messageIntervalRef.current); // Clear the moment's interval
      if (simulationState === "running") {
        // Restart with the original rate only if the simulation is still running
        messageIntervalRef.current = setInterval(() => {
          appendMessage(generateRandomMessage());
        }, 1000 / previousRate);
      }
      setShowToast(false);
      setShowMoment(true);
    }, 2000);
  };

  useEffect(() => {
    if (simulationState === "running") {
      clearInterval(messageIntervalRef.current);
      messageIntervalRef.current = setInterval(() => {
        appendMessage(generateRandomMessage());
      }, 1000 / messageRate);
    }
  }, [messageRate]);

  useEffect(() => {
    return () => clearInterval(messageIntervalRef.current); // Cleanup on component unmount
  }, []);

  return (
    <div className="container mx-auto px-2 sm:px-4 py-2 dark:bg-gray-800">
  <div className="flex flex-col justify-center items-center space-y-4">
    <div className="w-full sm:w-2/3 lg:w-1/2">
      {showToast && (
        <div className="toast mb-4 text-center text-sm bg-gray-200 dark:bg-gray-700 dark:text-white rounded">
          {toastMessage}
        </div>
      )}
      <div ref={chatWindowRef} className="overflow-y-auto h-96 mb-4 bg-white dark:bg-gray-900 rounded-lg p-4">
        {/* Chat bubbles will be appended here */}
      </div>
      <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:items-center md:space-x-4">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-grow bg-gray-100 dark:bg-gray-700 dark:text-white rounded p-2"
          placeholder="Type your message..."
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition-colors"
        >
          Send
        </button>
      </div>
      <div className="mt-4">
        <label className="font-semibold text-gray-800 dark:text-gray-200">
          Message rate:
        </label>
        <div className="flex items-center mt-1">
          <input
            type="range"
            min="1"
            max="200"
            value={messageRate}
            onChange={(e) => setMessageRate(e.target.value)}
            className="slider flex-grow"
          />
          <input
            type="number"
            min="1"
            max="200"
            value={messageRate}
            onChange={(e) => setMessageRate(e.target.value)}
            className="ml-2 border border-gray-300 dark:border-gray-600 dark:text-gray-700 rounded p-1 text-center w-16"
          />
          <span className="ml-2 text-gray-500 dark:text-gray-400 text-sm">
            messages per second
          </span>
        </div>
      </div>
      <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
        {simulationState === "running" && showMoment === 'true'(
          <button
            onClick={handleCreateMoment}
            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full transition-colors"
          >
            Create Moment
          </button>
        )}
        <button
          onClick={simulationState === "running" ? handlePauseResume : startSimulation}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full transition-colors"
        >
          {simulationState === "running" ? "Pause" : "Start"} Simulation
        </button>
        <button
          onClick={handleStopSimulation}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full transition-colors"
        >
          Stop Simulation
        </button>
      </div>
    </div>
  </div>
  <a
    href="https://github.com/NickLittman/chat-simulation"
    target="_blank"
    rel="noopener noreferrer"
    title="Fork me on GitHub"
    className="text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 mt-4"
  >
    <FaGithub className="text-4xl" />
  </a>
</div>



  );
};

export default ChatSimulation;
