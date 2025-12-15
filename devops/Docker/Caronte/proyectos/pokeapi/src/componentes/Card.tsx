import React from 'react';

// Interfaz para los props que tendran las cards
interface CardProps {
    nombre: string;
    imagen: string;
    dato: string | number; // Puede ser número si son los HP o string si se muestra el Nivel
    etiqueta: string;
}

export const Card: React.FC<CardProps> = ({ nombre, imagen, dato, etiqueta }) => {
  return (
    <div className="card">
      <img src={imagen} alt={nombre} className="card-img" />
      <h3>{nombre}</h3>
      <p><strong>{etiqueta}:</strong> {dato}</p>
    </div>
  );
};