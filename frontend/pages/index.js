import { useState } from "react";

export default function InterviewChat() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: [{ type: "text", text: "Welcome to your coding interview simulation!" }],
    },
  ]);
  const [userInput, setUserInput] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInput) return;

    // Add user's message to the chat in the expected format
    const userMessage = { role: "user", content: [{ type: "text", text: userInput }] };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      // Send user message to API route
      const response = await fetch("/api/anthropic/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userMessage: userInput }),
      });

      const data = await response.json();


      console.log(data.content)
      // Append the assistant's response to the chat in the expected format
      const assistantMessage = { role: "assistant", content: [...data.content] };

      console.log([...messages, assistantMessage]);
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: [{ type: "text", text: "Sorry, something went wrong." }] },
      ]);
    }

    setUserInput(""); // Clear the input field
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "1rem" }}>
      <div>
        <h1>Problem</h1>
        <p>
          Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.
          The overall runtime complexity should be O(log (m+n)).
          
          Example 1:
          Input: nums1 = [1,3], nums2 = [2]
          Output: 2.00000
          Explanation: merged array = [1,2,3] and median is 2.

          Example 2:
          Input: nums1 = [1,2], nums2 = [3,4]
          Output: 2.50000
          Explanation: merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5.
        </p>
      </div>
      <div style={{ border: "1px solid #ddd", padding: "1rem", height: "60vh", overflowY: "scroll" }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ textAlign: msg.role === "user" ? "right" : "left", margin: "0.5rem 0" }}>
            <strong>{msg.role === "user" ? "You" : "Assistant"}:</strong>{" "}
            {msg.content.map((contentItem, idx) => (
              <span key={idx}>{contentItem.text}</span>
            ))}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} style={{ display: "flex", marginTop: "1rem" }}>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your response..."
          style={{ flexGrow: 1, padding: "0.5rem" }}
        />
        <button type="submit" style={{ padding: "0.5rem 1rem" }}>Send</button>
      </form>
    </div>
  );
}
