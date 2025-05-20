import { useState, useReducer, createContext } from "react";
import { AppChatsContext, AppProviderProps, ChatType, initialChats } from "../models/app-context-text";


export enum ActionTypes {
  SET_CHARACTERS = "SET_CHARACTERS",
  LIKE_CHARACTER = "LIKE_CHARACTER",
  DISLIKE_CHARACTER = "DISLIKE_CHARACTER",
  ADD_MESSAGE= 'ADD_MESSAGE'
}
export type AddMessageAction = {
  type: ActionTypes.ADD_MESSAGE;
  payload: ChatType[];
};

// Define the type for our context data
export interface StateType{
    chats: ChatType[];
}
export type AppContextType = {
  state: StateType,
  dispatch: React.Dispatch<AddMessageAction>,
};
export function reducer(state:StateType, action:AddMessageAction):StateType{
    console.log("REDUCER", state, action)
    return {chats:[...state.chats, ...action.payload]}
}
export const Mycontext = createContext<AppContextType|null>(null);
export const AppChatsContextProvider: React.FC<AppProviderProps> = ({ children }: AppProviderProps) => {
    //const [chats, setChats] = useState<ChatType[]>(initialChats);
  const [state, dispatch] = useReducer(reducer, {chats:[]});

    return (
        <Mycontext.Provider value={{ state, dispatch }}>
            {children}
        </Mycontext.Provider>
    );
};
