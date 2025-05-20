
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './app.module.scss';
import HostNav from './components/Nav';
import Chat from './components/Chat';
import { useChatContext } from './hooks/chat-context';
export function App() {
  const  context =  useChatContext();

  return (
    <div className=" app-container">
      <BrowserRouter >
        <HostNav />
        <div className='container-fluid'>
          <Routes >
            <Route path="/" element={<Chat {...context}/>} />
            <Route path="train" element={<div> LLMS Train</div>} />
            <Route path="llm-rag" element={<div> LLM RAG</div>} />
            <Route path="*" element={<Navigate replace to="/" />} />
          </Routes>
        </div>
      </BrowserRouter>

    </div>
  );
}

export default App;


