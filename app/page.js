"use client";
import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [chatHistory, setChatHistory] = useState([
    { role: "bot", content: "Hi there! How can I help you today?" },
  ]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatMessagesRef = useRef(null);
  const API_ENDPOINT = "/api/analyze";

  const scrollToBottom = () => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const addMessage = (role, content) => {
    setChatHistory((prev) => [...prev, { role, content }]);
  };

  const simulateTypingEffect = (text, callback) => {
    setIsLoading(false); // 👈 Hide spinner instantly
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        callback(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 5); // Speed is already fast, you can reduce it more if needed
  };


  const sendMessage = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const message = userInput.trim();
    addMessage("user", message);
    setUserInput("");
    addMessage("bot", ""); // Placeholder
    setIsLoading(true);

    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: [...chatHistory, { role: "user", content: message }],
        }),
      });

      const data = await response.json();

      let raw = data.reply || "Unexpected response from AI.";
      raw = raw.trim();
      if (raw.startsWith("```")) {
        raw = raw.replace(/```[a-z]*\n?/i, "").replace(/```$/, "");
      }

      let parsedContent = "Unable to parse response.";
      try {
        const json = JSON.parse(raw);
        const lastPart = Array.isArray(json.parts)
          ? json.parts[json.parts.length - 1]
          : json;
        parsedContent = lastPart?.content || JSON.stringify(json);
      } catch (err) {
        parsedContent = raw;
      }

      simulateTypingEffect(parsedContent, (partial) => {
        setChatHistory((prev) => {
          const updated = [...prev];
          updated[updated.length - 1].content = partial;
          return [...updated];
        });
      });
    } catch (err) {
      setChatHistory((prev) => [
        ...prev.slice(0, -1),
        { role: "bot", content: "Error: " + err.message },
      ]);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#1B1C1D] text-white font-sans">
      <header className="bg-[#282A2C] p-5 text-center text-2xl font-bold border-b border-[#2c2c2c]">
        <span className="bg-gradient-to-r from-[#4A6DFF] to-[#8E44FF] bg-clip-text text-transparent font-roboto">
          Nomad AI
        </span>
      </header>

      <main
        className="flex-1 overflow-y-auto p-6 space-y-4 flex flex-col"
        ref={chatMessagesRef}
      >
        {chatHistory.map((msg, idx) => {
          if (msg.role === "bot" && msg.content === "" && isLoading) return null; // 👈 Hide empty bot bubble
          return (
            <div
              key={idx}
              className={`px-4 py-3 rounded-xl text-base leading-relaxed whitespace-pre-line break-words max-w-[80%] ${msg.role === "user"
                ? "bg-[#333537] self-end text-white rounded-br-md"
                : "self-start text-gray-200"
                }`}
            >
              {msg.content}
            </div>
          );
        })}


        {isLoading && (
          <div className="self-start flex items-center justify-center w-12 h-12">
            <img src="/icon.png" className="relative h-5 w-5" alt="hi"></img>
            <div className="loader absolute"></div>
          </div>
        )}
      </main>

      <form
        onSubmit={sendMessage}
        className="flex p-4 bg-[#282A2C] border-t border-[#000000]"
      >
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Ask Nomad AI..."
          className="flex-1 px-4 py-3 bg-[#1d1d1d] text-white rounded-full outline-none"
        />
        <button
          type="submit"
          className="ml-3 px-4 py-2 bg-gradient-to-r from-[#4A6DFF] to-[#8E44FF] rounded-full text-white font-medium"
        >
          ➤
        </button>
      </form>
      <style jsx global>{`
        .loader {
          width: 35px;
          aspect-ratio: 1;
          border-radius: 50%;
          background: conic-gradient(from 0deg, #0093FF, #8E44FF, #0093FF);
          mask: 
            radial-gradient(farthest-side, transparent 80%, black 66%);
          -webkit-mask: 
            radial-gradient(farthest-side, transparent 80%, black 66%);
          animation:
            l20-1 0.5s infinite linear alternate,
            l20-2 1.0s infinite linear;
        }
        @keyframes l20-1{
          0%    {clip-path: polygon(50% 50%,0       0,  50%   0%,  50%    0%, 50%    0%, 50%    0%, 50%    0% )}
          12.5% {clip-path: polygon(50% 50%,0       0,  50%   0%,  100%   0%, 100%   0%, 100%   0%, 100%   0% )}
          25%   {clip-path: polygon(50% 50%,0       0,  50%   0%,  100%   0%, 100% 100%, 100% 100%, 100% 100% )}
          50%   {clip-path: polygon(50% 50%,0       0,  50%   0%,  100%   0%, 100% 100%, 50%  100%, 0%   100% )}
          62.5% {clip-path: polygon(50% 50%,100%    0, 100%   0%,  100%   0%, 100% 100%, 50%  100%, 0%   100% )}
          75%   {clip-path: polygon(50% 50%,100% 100%, 100% 100%,  100% 100%, 100% 100%, 50%  100%, 0%   100% )}
          100%  {clip-path: polygon(50% 50%,50%  100%,  50% 100%,   50% 100%,  50% 100%, 50%  100%, 0%   100% )}
        }
        @keyframes l20-2{ 
          0%    {transform:scaleY(1)  rotate(0deg)}
          49.99%{transform:scaleY(1)  rotate(135deg)}
          50%   {transform:scaleY(-1) rotate(0deg)}
          100%  {transform:scaleY(-1) rotate(-135deg)}
        }
      `}</style>
    </div>
  );
}

