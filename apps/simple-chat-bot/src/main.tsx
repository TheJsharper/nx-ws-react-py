import * as ReactDOM from 'react-dom/client';

import App from './app/app';
import { AppChatInputContextProvider } from './app/contexts/app.chat-input-context.provider';
import { AppChatsContextProvider } from './app/contexts/app.chats-context.provider';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  
  <AppChatsContextProvider >
    <AppChatInputContextProvider >
      <App />
    </AppChatInputContextProvider>
  </AppChatsContextProvider>

)
