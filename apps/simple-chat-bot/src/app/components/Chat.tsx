import { useState } from "react";
import "./app.chat.scss"; // Import the CSS file for styling

const Chat = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can I help you?", sender: "ai" },
    { id: 2, text: "What is the weather today?", sender: "user" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { id: Date.now(), text: input, sender: "user" }]);
      setInput("");
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>Chat with AI</h1>
      </div>
      <div className="chat-messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`chat-bubble ${message.sender === "user" ? "user" : "ai"}`}
          >
            {message.text}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
            onKeyDown={event => {
                if (event.key === 'Enter') {
                    handleSend();
                }
              }}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Chat;