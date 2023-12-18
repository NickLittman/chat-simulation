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
  const [messageRate, setMessageRate] = useState(10);
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
    <div className="container mx-auto p-4 dark:bg-gray-800">
      <div className="flex justify-center">
        <div className="w-full md:w-2/3 lg:w-1/2">
          {showToast && (
            <div className="toast dark:bg-gray-700 dark:text-white">
              {toastMessage}
            </div>
          )}
          <div ref={chatWindowRef} className="overflow-y-auto h-96 mb-4 bg-white dark:bg-gray-900">
            {/* Chat bubbles will be appended here */}
          </div>
          <div className="flex items-center">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="chat-input bg-gray-100 dark:bg-gray-700 dark:text-white"
              placeholder="Type your message..."
            />
            <button
              onClick={handleSendMessage}
              className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            >
              Send
            </button>
          </div>
          <div className="mt-4 flex items-center">
            <label className="font-semibold mr-2 text-gray-800 dark:text-gray-200">
              Message rate:
            </label>
            <input
              type="range"
              min="1"
              max="200"
              value={messageRate}
              onChange={(e) => setMessageRate(e.target.value)}
              className="slider"
            />
            <span className="ml-2 border border-gray-300 dark:border-gray-600 rounded p-1 text-center w-16 text-gray-800 dark:text-gray-200">
              {messageRate}
            </span>
            <span className="ml-2 text-gray-500 dark:text-gray-400 text-sm">
              messages per second
            </span>
          </div>
          <div className="mt-4">
            {simulationState === "running" && (
              <button
                onClick={handleCreateMoment}
                className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full"
              >
                Create Moment
              </button>
            )}

            <button
              onClick={simulationState === "running" ? handlePauseResume : startSimulation}
              className={`ml-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full`}
            >
              {simulationState === "running" ? "Pause" : "Start"} Simulation
            </button>
            <button
              onClick={handleStopSimulation}
              className="ml-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
            >
              Stop Simulation
            </button>
          </div>
        </div>
        <a
          href="https://github.com/NickLittman/chat-simulation"
          target="_blank"
          rel="noopener noreferrer"
          title="Fork me on GitHub"
          className="text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
        >
          <FaGithub className="text-4xl" />
        </a>
      </div>
    </div>
  );
};

export default ChatSimulation;
