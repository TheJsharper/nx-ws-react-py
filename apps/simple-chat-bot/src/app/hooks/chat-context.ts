import { useContext } from "react";
import { AppChatContextType, AppChatContextTypeImpl, AppChatsContext } from "../models/app-context-text";
import { AppContextType, Mycontext } from "../contexts/app.chats-context.provider";

export const useChatContext = (): AppContextType => {
    const context = useContext(Mycontext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
}