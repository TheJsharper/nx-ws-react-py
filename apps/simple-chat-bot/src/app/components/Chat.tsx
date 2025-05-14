import { useEffect, useRef, useState } from "react";
import { useChatContext } from "../hooks/chat-context";
import { ChatType } from "../models/app-context-text";
import { uuidv4 } from "../utils/app.utils";
import "./app.chat.scss";

const Chat = () => {


  const [inputState, setInputState] = useState("");

  const [inputFlag, setInputFalg] = useState(false);

  const ws = useRef<WebSocket>(null);

  const { chats, setChats } = useChatContext();
  // const { input, setInput } = useInputContext();

  const handleSend = () => {
    if (inputState.trim() && chats && setChats) {
      const askChat = { id: uuidv4().toString(), text: inputState, sender: "user", status: "streaming_user", message_status: "success" };
      chats.push(askChat);
      setChats([...chats]);

      setInputFalg(true);
    }
  };

  useEffect(() => {
    ws.current = new WebSocket("ws://127.0.0.1:8000/chat");
    ws.current.onopen = () => console.log("ws opened");
    ws.current.onclose = () => console.log("ws closed");

    let chunkId = "";
    ws.current.onmessage = e => {
      if (inputFlag) return;
      const message: ChatType = JSON.parse(e.data);
      if (message.status === "start_streaming_ai" && setChats && chats) {
        chunkId = message.id;
        chats.push(message);
        setChats([...chats]);
        console.log("start_streaming_ai", chats);
      }
      if (message.status === "streaming_ai" && setChats && chats) {
        const indexId = chats.findIndex((chat) => chat.id === chunkId);
        if (indexId !== -1) {
          const currentChat = chats[indexId];
          currentChat.text += " " + message.text;
          setChats([...chats]);
        }

      }
      if (message.status === "end_streaming_ai" && setChats && chats) {
        const indexId = chats.findIndex((chat) => chat.id === chunkId);
        if (indexId !== -1) {
          const currentChat = chats[indexId];
          currentChat.text += " " + message.text;
          // setChats([...chats, currentChat]);
        }
        setInputFalg(false);
        chunkId = "";
      }

      console.log("data", message);
    };

    const wsCurrent = ws.current;
    console.log("WebSocket opened");

    return () => {
      wsCurrent.close();
      console.log("WebSocket closed");
    };
  }, []);

  useEffect(() => {

    if (!ws.current) return;
    if (inputFlag && inputState.trim().length > 0) {
      ws.current.send(inputState);
      console.log("USEFFECT send", inputState);
      setInputState("");
    }
  }, [inputFlag]);






  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>Chat with AI</h1>
      </div>
      <div className="chat-messages">
        {chats?.map((chat, index: number) => (
          <div
            key={index}
            className={`chat-bubble ${chat.sender === "user" ? "user" : "ai"}`}
          >
            {chat.text}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={inputState}
          onKeyDown={event => {
            if (event.key === 'Enter') {
              handleSend();
            }
          }}
          onChange={(e) => setInputState(e.target.value)}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Chat;