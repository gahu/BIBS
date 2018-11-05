import React from 'react';
import { NavLink } from 'react-router-dom';

const Navigator = () => {
    return (
        <div className="Navigators">
            <NavLink exact to="/"> Home </NavLink>
            <NavLink to="/page"> page </NavLink>
            <NavLink to="/editor"> editor </NavLink>
            <NavLink to="/maps"> map </NavLink>
        </div>
    );
};
export default Navigator;