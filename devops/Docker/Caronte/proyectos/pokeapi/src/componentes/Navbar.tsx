import React from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom'; 

export const Navbar: React.FC = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Nav className="me-auto">
                <Nav.Link as={NavLink} to="/">Inicio</Nav.Link>
                <Nav.Link as={NavLink} to="/gen1">Gen 1</Nav.Link>
                <Nav.Link as={NavLink} to="/gen2">Gen 2</Nav.Link>
                <Nav.Link as={NavLink} to="/gen3">Gen 3</Nav.Link>
                <Nav.Link as={NavLink} to="/digimon" className="digi">Digimon</Nav.Link>
            </Nav>
        </nav>
    );
};