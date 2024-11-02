import { useEffect, useRef, useState } from "react";
import Timer from "./timer";

export default function Home() {
  // Example progress value (out of 100)
  const progress = 40; // Set this dynamically based on actual game progress
  const chatBoxRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: [
        { type: "text", text: "Welcome to your coding interview simulation!" },
      ],
    },
  ]);
  const [userInput, setUserInput] = useState("");
  const [chatLang, setChatLang] = useState("en");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInput) return;

    // Add user's message to the chat in the expected format
    const userMessage = {
      role: "user",
      content: [{ type: "text", text: userInput }],
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      // Send user message to API route
      const response = await fetch("/api/anthropic/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userMessage: userInput, lang: chatLang }),
      });

      const data = await response.json();

      // Append the assistant's response to the chat in the expected format
      const assistantMessage = {
        role: "assistant",
        content: [...data.content],
      };

      console.log([...messages, assistantMessage]);
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content: [{ type: "text", text: "Sorry, something went wrong." }],
        },
      ]);
    }

    setUserInput(""); // Clear the input field
  };

  useEffect(() => {
    if (chatBoxRef.current) {
      // Reset the height to "auto" to properly calculate the new scrollHeight
      chatBoxRef.current.style.height = "auto";
      // Set the height to match the scrollHeight (content height)
      chatBoxRef.current.style.height = `${chatBoxRef.current.scrollHeight}px`;
    }
  }, [userInput]); // This effect runs every time userInput changes

  return (
    <div
      className="flex relative min-h-screen bg-cover"
      style={{
        backgroundImage:
          "url('https://cdna.artstation.com/p/assets/images/images/019/969/350/large/florian-mazreku-outcasts-background-final.jpg?1565792939')",
      }}
    >
      <Timer />
      <div>
        <h1>Language</h1>
        <label htmlFor="ChatLanguageSelect">Select Language: </label>
        <select
          id="ChatLanguageSelect"
          value={chatLang}
          onChange={(e) => setChatLang(e.target.value)}
        >
          <option value="en">English</option>
          <option value="zh_CN">Simplified Chinese</option>
        </select>
      </div>
      {/* Progress Bar at the top */}
      <div
        className="fixed z-50 flex items-center"
        style={{ top: "60px", left: "0", right: "570px" }}
      >
        <div className="w-full px-4">
          <div className="bg-gray-300 h-4">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          {/* Increment Circles */}
          <div className="absolute left-0 flex justify-between w-full">
            <div className="flex flex-col items-center">
              <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center border border-black">
                <span className="text-black">1</span>
              </div>
              <span className="text-xs mt-1">Start</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center border border-black">
                <span className="text-black">2</span>
              </div>
              <span className="text-xs mt-1">Mid</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center border border-black">
                <span className="text-black">3</span>
              </div>
              <span className="text-xs mt-1">End</span>
            </div>
          </div>
        </div>
      </div>

      {/* Character section on the left */}
      <div className="flex flex-col justify-end items-center w-[calc(100%-570px)] p-4 min-h-screen">
        <div className="flex items-center justify-between w-full px-8 mb-4">
          {/* Mockey Character */}
          <div className="flex flex-col items-center">
            <div className="h-2 w-32 bg-gray-300 rounded mb-1">
              <div
                className="h-full bg-green-500"
                style={{ width: "80%" }}
              ></div>
            </div>
            <img
              src="/mockey.png"
              alt="Mockey"
              className="h-48 w-48 object-contain"
            />
            <p className="text-xs">Health: 80/100</p>
          </div>

          {/* Cat Character */}
          <div className="flex flex-col items-center">
            <div className="h-2 w-32 bg-gray-300 rounded mb-1">
              <div
                className="h-full bg-green-500"
                style={{ width: "60%" }}
              ></div>
            </div>
            <img
              src="/cat.png"
              alt="Cat"
              className="h-48 w-48 object-contain"
            />
            <p className="text-xs">Health: 60/100</p>
          </div>
        </div>

        {/* Centered Question Box */}
        <div className="bg-white shadow-md p-4 rounded mb-8 w-3/4 max-w-lg text-black text-center">
          <h2 className="text-lg font-semibold">Question</h2>
          <p className="mt-2">
            Given an array of integers, return indices of the two numbers such
            that they add up to a specific target. You may assume that each
            input would have exactly one solution, and you may not use the same
            element twice. You can return the answer in any order.
          </p>
        </div>
      </div>

      {/* Chatbox */}
      <div className="fixed right-0 top-0 h-screen w-[570px] bg-white shadow-lg border-l border-gray-200 z-50 flex flex-col">
        {/* Chatbox content */}
        <h2 className="p-4 text-lg font-semibold text-black">Chat</h2>
        <div className="p-4 overflow-y-auto h-[calc(100%-56px)]">
          {/* Messages will be displayed here */}
          {messages.map((msg, index) => (
            <div
              className="text-black"
              key={index}
              style={{
                textAlign: msg.role === "user" ? "right" : "left",
                margin: "0.5rem 0",
              }}
            >
              <strong>{msg.role === "user" ? "You" : "Assistant"}:</strong>{" "}
              {msg.content.map((contentItem, idx) => (
                <span key={idx}>{contentItem.text}</span>
              ))}
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-gray-200">
          <form onSubmit={handleSubmit} className="flex items-center">
            <textarea
              ref={chatBoxRef}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-grow p-3 border border-gray-300 rounded-l-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
              rows={1} /* This controls the initial height */
              style={{ overflowWrap: "break-word", width: "100%" }}
            />
            <button
              type="submit"
              className="ml-2 bg-gray-800 text-white p-2 rounded-r-lg shadow hover:bg-gray-700 transition flex items-center justify-center"
            >
              {/* Up Arrow SVG */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m0 0H8l4-4 4 4h-3z"
                />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
