/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { useChatContext } from "../hooks/chat-context";
import { ChatType } from "../models/app-context-text";
import { uuidv4 } from "../utils/app.utils";
import "./app.chat.scss";

const Chat = () => {


  const [inputState, setInputState] = useState("");

  const [inputFlag, setInputFalg] = useState(false);
  
  const [inputHndler, setInputHndler] = useState(false);
  
  const ws = useRef<WebSocket>(null);

  const context = useChatContext();
  const handleSend = (e:any) => {
    e.preventDefault();
    if (inputState.trim() ) {
     const askChat = { id: uuidv4().toString(), text: inputState, sender: "user", status: "streaming_user", message_status: "success" };
      context.setChats([...context.chats,askChat])
    
     // context.setChats([...context.chats, askChat]);
     // context.setChat(askChat)
     // console.log("INPUT", chats);
     setInputHndler(true);
      setInputFalg(true);
    }
  };

  useEffect(() => {
    ws.current = new WebSocket("ws://127.0.0.1:8000/chat");
    ws.current.onopen = () => console.log("ws opened");
    ws.current.onclose = () => console.log("ws closed");
    ws.current.onerror = (e) => console.error("====> error ocurred ", e)

    let chunkId = "";
    ws.current.onmessage = e => {
      if (inputFlag) return;
      const message: ChatType = JSON.parse(e.data);
      if (message.status === "start_streaming_ai" && message.sender === "ai") {
       // chats.push(message);
        chunkId = message.id;
        //context.setChats([...context.chats, message])
         context.chats = [...context.chats, message]
        context.setChats([...context.chats]);
        console.log("start_streaming_ai", context.chats);


      }
      if (message.status === "streaming_ai" && message.sender === "ai") {
        const indexId = context.chats.findIndex((chat) => chat.id === chunkId);
        if (indexId !== -1) {
          const currentChat = context.chats[indexId];
          currentChat.text += " " + message.text;
          //chats.push(currentChat);
          //context.setChats([...context.chats, currentChat,])
          context.chats = [...context.chats.filter((c)=> c.id !== chunkId), {...currentChat}]
         context.setChats([...context.chats]);
          // chunkId = "";
        }

      }
      if (message.status === "end_streaming_ai" && message.sender === "ai") {
        const indexId = context.chats.findIndex((chat) => chat.id === chunkId);
        if (indexId !== -1) {
          const currentChat = context.chats[indexId];
          currentChat.text += " " + message.text;
             //context.setChats([...context.chats])
             context.chats = [...context.chats.filter((c)=> c.id !== chunkId), {...currentChat}]
              context.setChats([...context.chats]);
          setInputFalg(false);
          chunkId = "";
        }
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

  useEffect(()=>{
        /*const askChat = { id: uuidv4().toString(), text: inputState, sender: "user", status: "streaming_user", message_status: "success" };
      context.setChats([...context.chats,askChat]);*/
  },[inputHndler] )






  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>Chat with AI</h1>
      </div>
      <div className="chat-messages">
        {context.chats?.map((chat, index: number) => (
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
              handleSend(event);
            }
          }}
          onChange={(e) => setInputState(e.target.value)}
        />
        <button onClick={(e)=>handleSend(e)}>Send</button>
      </div>
    </div>
  );
};

export default Chat;