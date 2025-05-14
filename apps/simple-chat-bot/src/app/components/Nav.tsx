import React from 'react';
import { NavLink } from 'react-router-dom'
const HostNav: React.FC = () => {


  const navStyleClass: ({ isActive }: { isActive: boolean }) => string = ({ isActive }) => {
    return isActive ? 'nav-link active' : 'nav-link';
  }
  return (
    <ul className="nav nav-tabs">
      <li className="nav-item">
        <NavLink className={navStyleClass} to="/">Chat AI</NavLink>
      </li>
      <li className="nav-item">
        <NavLink className={navStyleClass} to="/train">LLMS</NavLink>
      </li>
      <li className='nav-item'>
        <NavLink className={navStyleClass} to="/llm-rag">LLM RAG</NavLink>
      </li>
    </ul>
  );
};

export default HostNav;