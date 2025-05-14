import { createContext, ReactNode } from "react";

// Define the types for the contexts
export interface AppChatContextType {
  chats: ChatType[];
  setChats: (chats: ChatType[]) => void;
}

export interface AppChatInputContextType {
  input: Partial<ChatType>;
  setInput: (input: Partial<ChatType>) => void;
}

export interface ChatType {
  id: string;
  text: string;
  sender: string;
  status: string;
  message_status: string;
}

// Initial values for chats
export const initialChats: ChatType[] = [
  { id: "1", text: "Hello! How can I help you?", sender: "ai", status: "streaming_ai", message_status: "success" },
  { id: "2", text: "What is the weather today?", sender: "user", status: "streaming_user", message_status: "success" },
];

// Create contexts
export const AppChatsContext = createContext<Partial<AppChatContextType>>({});

export const AppChatInputContext = createContext<Partial<AppChatInputContextType>>({});

// Props for the provider components
export interface AppProviderProps {
  children: ReactNode; // Explicitly type the children prop
}
