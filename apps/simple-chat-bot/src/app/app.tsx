
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './app.module.scss';
import HostNav from './components/Nav';
import Chat from './components/Chat';
export function App() {
  return (
    <div className=" app-container">
      <BrowserRouter >
        <HostNav />
        <div className='container-fluid'>
          <Routes >
            <Route path="/" element={<Chat/>} />
            <Route path="orders" element={<div> Orders</div>} />
            <Route path="carts" element={<div> carts</div>} />
            <Route path="*" element={<Navigate replace to="/" />} />
          </Routes>
        </div>
      </BrowserRouter>

    </div>
  );
}

export default App;


