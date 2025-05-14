import { useContext } from "react";
import { AppChatInputContext, AppChatInputContextType } from "../models/app-context-text";

export const useInputContext = (): Partial<AppChatInputContextType> => {
    const context = useContext(AppChatInputContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};