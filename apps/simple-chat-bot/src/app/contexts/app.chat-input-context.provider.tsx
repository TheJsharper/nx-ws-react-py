import { useState } from "react";
import { AppChatInputContext, AppProviderProps, ChatType } from "../models/app-context-text";

// Context provider for chat input
export const AppChatInputContextProvider: React.FC<AppProviderProps> = ({ children }: AppProviderProps) => {
    const [input, setInput] = useState<Partial<ChatType>>({});

    return (
        <AppChatInputContext.Provider value={{ input, setInput }}>
            {children}
        </AppChatInputContext.Provider>
    );
};
