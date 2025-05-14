import { useState } from "react";
import { AppChatsContext, AppProviderProps, ChatType, initialChats } from "../models/app-context-text";

export const AppChatsContextProvider: React.FC<AppProviderProps> = ({ children }: AppProviderProps) => {
    const [chats, setChats] = useState<ChatType[]>(initialChats);

    return (
        <AppChatsContext.Provider value={{ chats, setChats }}>
            {children}
        </AppChatsContext.Provider>
    );
};
