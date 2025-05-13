import React from 'react';
import { NavLink } from 'react-router-dom'
const HostNav: React.FC = () => {


  const navStyleClass: ({ isActive }: { isActive: boolean }) => string = ({ isActive }) => {
    return isActive ? 'nav-link active' : 'nav-link';
  }
  return (
    <ul className="nav nav-tabs">
      <li className="nav-item">
        <NavLink className={navStyleClass} to="/">Products</NavLink>
      </li>
      <li className="nav-item">
        <NavLink className={navStyleClass} to="/orders">Orders</NavLink>
      </li>
      <li className='nav-item'>
        <NavLink className={navStyleClass} to="/carts">Carts</NavLink>
      </li>
    </ul>
  );
};

export default HostNav;