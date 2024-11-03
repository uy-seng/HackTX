import { useEffect, useRef, useState } from "react";
import Timer from "./timer";
import hash from "object-hash";
import Editor from "@monaco-editor/react";

export default function Home() {
  const initialData = JSON.stringify(
    {
      name: "Example",
      description: "This is an example JSON",
      version: "1.0.0",
    },
    null,
    2
  );

  const initialHash = hash(initialData);

  // Example progress value (out of 100)
  const progress = 40; // Set this dynamically based on actual game progress
  const chatBoxRef = useRef(null);
  const [isChat, setIsChat] = useState(true); // State to toggle between chat and code editor
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: [
        { type: "text", text: "Welcome to your coding interview simulation!" },
      ],
    },
  ]);
  const [userInput, setUserInput] = useState("");
  const [chatLang, setChatLang] = useState("en"); // Define chatLang here

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInput) return;

    const userMessage = {
      role: "user",
      content: [{ type: "text", text: userInput }],
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const response = await fetch("/api/anthropic/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userMessage: userInput, lang: chatLang }),
      });

      const data = await response.json();

      const assistantMessage = {
        role: "assistant",
        content: [...data.content],
      };

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
      chatBoxRef.current.style.height = "auto";
      chatBoxRef.current.style.height = `${chatBoxRef.current.scrollHeight}px`;
    }
  }, [userInput]);

  return (
    <div
      className="flex relative min-h-screen bg-cover"
      style={{
        backgroundImage: "url('/background.jpg')",
      }}
    >
      {/* Progress Bar */}
      <div
        className="fixed z-50 flex items-center"
        style={{ top: "0", left: "0", right: "570px" }}
      >
        <div className="w-full px-4">
          {/* <div className="bg-gray-300 h-4">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div> */}
          <div className="absolute left-0 flex justify-between w-full p-4">
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

      {/* Characters and Question Box */}
      <div className="flex flex-col justify-between items-center w-[calc(100%-570px)] p-4 min-h-screen">
        <div
          className="flex items-center justify-center w-full px-8"
          style={{ marginLeft: "-240px", marginTop: "290px" }}
        >
          {" "}
          {/* Increased marginTop */}
          {/* Monkey Character */}
          <div className="flex flex-col items-center mr-16 w-56">
            {" "}
            {/* Adjust width here */}
            <p className="text-xs">Health: 80/100</p>
            <div className="h-2 w-32 bg-gray-300 rounded mb-1">
              <div
                className="h-full bg-green-500"
                style={{ width: "80%" }}
              ></div>
            </div>
            <img
              src="/mockey.png"
              alt="Monkey"
              className="h-48 w-48 object-contain"
            />
          </div>
          {/* Cat Character */}
          <div className="flex flex-col items-center ml-16 w-56">
            {" "}
            {/* Adjust width here */}
            <p className="text-xs">Health: 60/100</p>
            <div className="h-2 w-32 bg-gray-300 rounded mb-1">
              <div className="h-full bg-red-500" style={{ width: "60%" }}></div>
            </div>
            <img
              src="/cat.png"
              alt="Cat"
              className="h-48 w-48 object-contain"
            />
          </div>
        </div>

        {/* Centered Question Box */}
        <div
          className="bg-white shadow-md p-2 rounded w-full text-black text-left"
          style={{ height: "150px", marginLeft: "-240px" }}
        >
          {" "}
          {/* Adjust margin here */}
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
      <div className="fixed right-0 top-0 h-screen w-[570px] bg-white shadow-lg z-50 flex flex-col">
        <div className="text-black flex flex-row items-center justify-between border-b border-gray-200 p-4">
          <Timer />
          {/* Toggle Buttons at Top Center */}
          <div className="flex justify-center items-center">
            <button
              onClick={() => setIsChat(true)}
              className={`px-4 py-2 rounded-l-lg ${
                isChat
                  ? "bg-purple-800 text-white"
                  : "bg-gray-200 text-gray-800"
              } transition`}
            >
              Chat
            </button>
            <button
              onClick={() => setIsChat(false)}
              className={`px-4 py-2 rounded-r-lg ${
                !isChat ? "bg-blue-800 text-white" : "bg-gray-200 text-gray-800"
              } transition`}
            >
              Code Editor
            </button>
          </div>
        </div>

        {isChat ? (
          <>
            <div className="text-black p-4">
              <label htmlFor="ChatLanguageSelect">Chat Language: </label>
              <select
                id="ChatLanguageSelect"
                value={chatLang}
                onChange={(e) => setChatLang(e.target.value)}
              >
                <option value="en">English</option>
                <option value="zh_CN">Simplified Chinese</option>
              </select>
            </div>
            <div className="p-4 overflow-y-auto h-[calc(100%-56px)]">
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
                  rows={1}
                  style={{ overflowWrap: "break-word", width: "100%" }}
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-purple-700 text-white font-semibold rounded-r-lg"
                >
                  Send
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-grow overflow-hidden">
            <Editor
              height="100%"
              defaultLanguage="javascript"
              defaultValue="// Start coding here..."
            />
          </div>
        )}
      </div>
    </div>
  );
}
