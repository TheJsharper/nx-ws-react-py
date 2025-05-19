import { useContext } from "react";
import { AppChatContextType, AppChatContextTypeImpl, AppChatsContext } from "../models/app-context-text";

export const useChatContext = (): AppChatContextTypeImpl => {
    const context = useContext(AppChatsContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
}