/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState, memo } from "react";
import { useChatContext } from "../hooks/chat-context";
import { ChatType } from "../models/app-context-text";
import { uuidv4 } from "../utils/app.utils";
import "./app.chat.scss";
import { ActionTypes, AppContextType } from "../contexts/app.chats-context.provider";

const Chat = (context: AppContextType) => {

  // const context: AppContextType = useChatContext();

  const [inputState, setInputState] = useState("");

  const [inputFlag, setInputFalg] = useState(false);

  const [inputHndler, setInputHndler] = useState(false);

  const [chatMessages, setChatMessages] = useState<ChatType[]>([])

  const ws = useRef<WebSocket>(new WebSocket("ws://127.0.0.1:8000/chat"));

  const handleSend = (e: any) => {
    e.preventDefault();
    if (inputState.trim()) {
      const askChat = { id: uuidv4().toString(), text: inputState, sender: "user", status: "streaming_user", message_status: "success" };
      // context.setChats([...context.chats, askChat])
      const current = [...context.state.chats, askChat];
      context.dispatch({ type: ActionTypes.ADD_MESSAGE, payload: [askChat] });
      chatMessages.push(askChat)
      setChatMessages([...chatMessages])


      setInputHndler(true);
      setInputFalg(true);
    }
  };

  useEffect(() => {
    //context =  useChatContext();
    //ws.current = new WebSocket("ws://127.0.0.1:8000/chat");
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
        /*context.chats = [...context.chats, message]
        context.setChats([...context.chats]);
        console.log("start_streaming_ai", context.chats);*/
        // const current = [...context.state.chats, message];
        context.dispatch({ type: ActionTypes.ADD_MESSAGE, payload: [message] });

        chatMessages.push(message)
        setChatMessages([...chatMessages])

      }
      if (message.status === "streaming_ai" && message.sender === "ai") {
        const indexId = context.state.chats.findIndex((chat) => chat.id === chunkId);
        if (indexId !== -1) {
          const currentChat = context.state.chats[indexId];
          currentChat.text += " " + message.text;
          //chats.push(currentChat);
          //context.setChats([...context.chats, currentChat,])
          const current = [...context.state.chats.filter((c) => c.id !== chunkId), { ...currentChat }]
          context.dispatch({ type: ActionTypes.ADD_MESSAGE, payload: current });
          setChatMessages([...chatMessages.filter((c) => c.id !== chunkId), ])
          chatMessages.push(currentChat);
        }

      }
      if (message.status === "end_streaming_ai" && message.sender === "ai") {
        const indexId = context.state.chats.findIndex((chat) => chat.id === chunkId);
        if (indexId !== -1) {
          const currentChat = context.state.chats[indexId];
          currentChat.text += " " + message.text;
          //context.setChats([...context.chats])
          const current = [...context.state.chats.filter((c) => c.id !== chunkId), { ...currentChat }]
          context.dispatch({ type: ActionTypes.ADD_MESSAGE, payload: current });
          setChatMessages([...chatMessages.filter((c) => c.id !== chunkId)]);
           chatMessages.push(currentChat);
          setInputFalg(false);
          chunkId = "";
        }
      }

      console.log("data", message);
    };

    console.log("WebSocket opened INIT");

    return () => {
      ws.current.close();
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

  useEffect(() => {
    /*const askChat = { id: uuidv4().toString(), text: inputState, sender: "user", status: "streaming_user", message_status: "success" };
  context.setChats([...context.chats,askChat]);*/
  }, [inputHndler])






  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>Chat with AI</h1>
      </div>
      <div className="chat-messages">
        {chatMessages.map((chat, index: number) => (
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
        <button onClick={(e) => handleSend(e)}>Send</button>
      </div>
    </div>
  );
};

export default Chat;