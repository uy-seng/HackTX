import { useEffect, useRef, useState} from "react";
import Timer from "./timer";
import Editor from "@monaco-editor/react";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode";

export default function Home() {
  /**
   * LLM Related Stuff
   */
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
  const [userCode, setUserCode] = useState([]);
  const router = useRouter();
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/login");
    }
  }, [])
  const [llmThinking, setLlmThinking] = useState(null);

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
  /** end of LLM Related Stuff */

  /**
   * Chat Box Related Stuff
   */
  const chatBoxRef = useRef(null);
  const [isChat, setIsChat] = useState(true); // State to toggle between chat and code editor

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.style.height = "auto";
      chatBoxRef.current.style.height = `${chatBoxRef.current.scrollHeight}px`;
    }
  }, [userInput]);
  /** end of Chatbox related stuff */

  /**
   * Monkey throwing bananas animations stuff
   */
  const monkeySprite = useRef(null);
  const bananaSprite = useRef(null);
  const catSprite = useRef(null);
  let monkeyFrames = [
    "mockey.gif",
    "mockey-throw-bananas-2.png",
    "mockey-throw-bananas-3.png",
    "mockey-throw-bananas-4.png",
    "mockey-throw-bananas-5.png",
    "mockey-laugh-1.png",
    "mockey-laugh-2.png",
    "mockey-laugh-1.png",
    "mockey-laugh-2.png",
    "mockey-laugh-1.png",
    "mockey-laugh-2.png",
    "mockey-laugh-1.png",
    "mockey-laugh-2.png",
  ];
  const [monkeyCurrentFrame, setMonkeyCurrentFrame] = useState("mockey.gif");
  let catFrames = ["cat.png", "cat-angry.png"];
  const [catCurrentFrame, setCatCurrentFrame] = useState("cat.gif");
  let currentMonkeyFrame = 0;
  let currentCatFrame = 0;
  let monkeyAnimationInterval;
  let catAnimationInterval;

  // Function to animate Monkey's throw
  function animateMonkeyThrow() {
    monkeyAnimationInterval = setInterval(() => {
      setMonkeyCurrentFrame(monkeyFrames[currentMonkeyFrame]);
      if (currentMonkeyFrame >= 4) {
        clearInterval(monkeyAnimationInterval);
        throwBanana();
        setMonkeyCurrentFrame("mockey-throw-bananas-1.png");
        currentMonkeyFrame = 0;
      } else {
        currentMonkeyFrame++;
      }
    }, 100); // Adjust the frame interval as needed
  }

  // Function to animate Monkey's laugh
  function animateMonkeyLaugh() {
    currentMonkeyFrame = 5;
    monkeyAnimationInterval = setInterval(() => {
      setMonkeyCurrentFrame(monkeyFrames[currentMonkeyFrame]);
      currentMonkeyFrame++;
      if (currentMonkeyFrame >= monkeyFrames.length) {
        clearInterval(monkeyAnimationInterval);
        setMonkeyCurrentFrame("mockey.gif");
        currentMonkeyFrame = 0;
      }
    }, 100); // Adjust the frame interval as needed
  }

  // Function to animate Cat's angry face
  function animateCatAngry() {
    const catAnimationInterval = setInterval(() => {
      if (currentCatFrame < catFrames.length) {
        setCatCurrentFrame(catFrames[currentCatFrame]);
        currentCatFrame++;
      }
    }, 50); // Adjust the frame interval as needed

    // Stop the animation after a set duration (e.g., 5 seconds)
    setTimeout(() => {
      currentCatFrame = 0;
      clearInterval(catAnimationInterval);
      setCatCurrentFrame("cat.gif"); // Reset to default frame
    }, 2000); // Adjust the timeout duration as needed
  }

  // Function to throw the banana
  function throwBanana() {
    bananaSprite.current.style.visibility = "visible"; // Make banana visible
    bananaSprite.current.style.right = "10px"; // Starting position near Monkey

    let bananaPosition = 10; // Starting x position
    let rotationAngle = 0; // Initial rotation angle

    const bananaInterval = setInterval(() => {
      bananaPosition -= 10; // Move banana to the right
      rotationAngle += 10; // Increment rotation angle

      // Update banana's position and rotation
      bananaSprite.current.style.right = `${bananaPosition}px`;
      bananaSprite.current.style.transform = `rotate(${rotationAngle}deg)`;

      // Check for collision with the "cat"
      if (detectCollision(bananaSprite, catSprite, -40)) {
        bananaSprite.current.style.visibility = "hidden"; // Hide banana on collision
        clearInterval(bananaInterval);
        animateMonkeyLaugh();
        animateCatAngry();
      }

      // Stop the banana if it goes off screen
      if (bananaPosition > window.innerWidth) {
        bananaSprite.current.style.visibility = "hidden"; // Hide banana when it goes out of bounds
        clearInterval(bananaInterval);
      }
    }, 50); // Adjust movement speed as needed
  }

  const [userCode, setUserCode] = useState("")

  function handleCorrectAnswer() {
    // TODO: implement;
    alert("Correct answer");
  }

  function handleWrongAnswer() {
    // TODO: implement
    alert("Wrong answer");
  }

  async function compileCodeHandler() {
    const currentUserCode = userCode[currentQuestion];
    // TODO: remove hardcoded user id
    const jwtData = jwtDecode(localStorage.getItem("token"));
    const temp = await fetch("http://localhost:3001/code-execution/submit", {
      method: "POST",
      body: JSON.stringify({
        userId: jwtData.id.toString(),
        lang: "py",
        code: currentUserCode,
        problemId: problems[currentQuestion].id
      }),
      headers: {
        'Content-Type': "application/json"
      }
    });
    const data = await temp.json();
    if (data.verdict !== "AC") {
      handleWrongAnswer();
    } else {
      handleCorrectAnswer();
    }
  }

  // Function to detect collision between banana and cat
  function detectCollision(a, b, offset = 0) {
    const aRect = a.current.getBoundingClientRect();
    const bRect = b.current.getBoundingClientRect();

    return !(
      (
        aRect.right < bRect.left - offset || // Extend left boundary of b
        aRect.left > bRect.right + offset || // Extend right boundary of b
        aRect.bottom < bRect.top - offset || // Extend top boundary of b
        aRect.top > bRect.bottom + offset
      ) // Extend bottom boundary of b
    );
  }
  /** end of monkey throwing bananas animation */

  /**
   * levels selection before starting
   */
  const [level, setLevel] = useState(null);
  useEffect(() => {
    if (level) {
      // Fetch problems based on level
      fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/problems/${level}`)
        .then((res) => res.json())
        .then((data) => {
          data.problems.forEach((problem) => {
            setProblems((prev) => [
              ...prev,
              { statement: problem.statement, id: problem.id },
            ]);
            setCodeTemplate((prev) => [...prev, problem.templates[2]]);
            setUserCode((prev) => [...prev, problem.templates[2]]);
          });
        });
    }
  }, [level])
  /** end of levels selection */

  /**
   * problems, solutions and code template selection 
   */
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [problems, setProblems] = useState([]);
  const [solutions, setSolutions] = useState([]);
  const [codeTemplates, setCodeTemplate] = useState([]);
  /** end of question selection */



  if (level)
    return (
      <div className="flex relative min-h-screen bg-cover" id="background">
        {/* Progress Bar */}
        <div
          className="fixed z-50 flex items-center"
          style={{ top: "0", left: "0", right: "570px" }}
        >
          <div className="w-full px-4 py-4">
            <div className="absolute left-20 flex justify-between w-3/4 p-4">
              <div className="flex flex-col items-center">
                <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center border border-black">
                  <span className="text-black">1</span>
                </div>
                <span className="text-xs mt-1 text-black">Start</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center border border-black">
                  <span className="text-black">2</span>
                </div>
                <span className="text-xs mt-1 text-black">Mid</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center border border-black">
                  <span className="text-black">3</span>
                </div>
                <span className="text-xs mt-1 text-black">End</span>
              </div>
            </div>
          </div>
        </div>

        {/* Container for Characters and Question Box */}
<div className="flex flex-col w-[calc(100%-570px)] h-screen p-4">
  {/* Centered Question Box */}
  <div
  className="bg-white shadow-md p-4 rounded w-full text-black text-left mb-4 pt-14" // Added padding-top here
  style={{ height: "200px" }}
  >
    <h2 className="text-lg font-semibold pt-4">Question</h2>
    <p className="mt-2">
      Given an array of integers, return indices of the two numbers such
      that they add up to a specific target. You may assume that each
      input would have exactly one solution, and you may not use the
      same element twice. You can return the answer in any order.
    </p>
  </div>

  {/* Characters Section */}
  <div className="flex items-center justify-center w-full flex-grow px-8">
    {/* Monkey Character */}
    <div className="flex flex-col items-center mr-16 w-56 relative">
      <p className="text-xs">Health: 80/100</p>
      <div className="h-2 w-32 bg-gray-300 rounded mb-1">
        <div className="h-full bg-green-500" style={{ width: "80%" }}></div>
      </div>
      <img
        ref={monkeySprite}
        src={`/${monkeyCurrentFrame}`}
        alt="Monkey"
        className="h-48 w-48 object-contain"
      />
      <img
        ref={bananaSprite}
        src="/banana.png"
        alt="Banana"
        className="h-8 w-8 object-contain absolute right-[10px] bottom-[100px] invisible"
      />
    </div>
    {/* Cat Character */}
    <div className="flex flex-col items-center ml-16 w-56">
      <p className="text-xs">Health: 60/100</p>
      <div className="h-2 w-32 bg-gray-300 rounded mb-1">
        <div className="h-full bg-red-500" style={{ width: "60%" }}></div>
      </div>
      <img
        ref={catSprite}
        src={`/${catCurrentFrame}`}
        alt="Cat"
        className="h-48 w-48 object-contain"
      />
    </div>
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
                  !isChat
                    ? "bg-blue-800 text-white"
                    : "bg-gray-200 text-gray-800"
                } transition`}
              >
                Code Editor
              </button>
            </div>
            <button className="bg-gray-200 p-3 rounded-lg" onClick={async () => {
              await compileCodeHandler();
            }}>compile</button>
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
                    <strong>
                      {msg.role === "user" ? "You" : "Assistant"}:
                    </strong>{" "}
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
                {/* Test button to throw bananas */}
                {/* <button
                  onClick={animateMonkeyThrow}
                  className="mt-2 px-6 py-2 bg-yellow-500 text-white font-semibold rounded-lg"
                /> */}
              </div>
            </>
          ) : (
            <div className="flex-grow overflow-hidden">
              {
                codeTemplates.length > 0 &&
              <Editor
                height="100%"
                defaultLanguage="python"
                defaultValue={codeTemplates[currentQuestion].code}
                onChange={(value, _) => {
                  setUserCode((prev) => prev.map((code, idx) => {
                    if (idx === currentQuestion) return value;
                    return code;
                  }))
                }}
              />
              }
            </div>
          )}
        </div>
      </div>
    );
  else
    return (
      <div
        id="background"
        className="flex items-center justify-center h-screen"
      >
        {" "}
        {/* Center content vertically and horizontally */}
        <div
          className="flex flex-col justify-center items-center bg-white p-6 rounded-md shadow-lg"
          style={{
            maxWidth: "400px", // Set a maximum width for the container
            width: "100%", // Ensure it takes full width up to max-width
          }}
        >
          <h2 className="text-2xl font-bold text-black mb-4">
            Choose Your Difficulty:
          </h2>

          {/* Level selection buttons */}
          <div className="flex flex-col items-center">
            <button
              value="easy"
              onClick={(e) => setLevel(e.target.value)}
              className="bg-[#2E2053] w-48 py-4 flex justify-center items-center rounded-md border-2 border-[#1B0D33] my-2 text-white font-bold text-xl"
            >
              Easy
            </button>
            <button
              value="medium"
              onClick={(e) => setLevel(e.target.value)}
              className="bg-[#2E2053] w-48 py-4 flex justify-center items-center rounded-md border-2 border-[#1B0D33] my-2 text-white font-bold text-xl"
            >
              Medium
            </button>
            <button
              value="hard"
              onClick={(e) => setLevel(e.target.value)}
              className="bg-[#2E2053] w-48 py-4 flex justify-center items-center rounded-md border-2 border-[#1B0D33] my-2 text-white font-bold text-xl"
            >
              Hard
            </button>
          </div>
        </div>
      </div>
    );
}
