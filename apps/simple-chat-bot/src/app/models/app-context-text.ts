export interface AppContextType {
  user: string | null;
  setUser: (user: string | null) => void;
}
