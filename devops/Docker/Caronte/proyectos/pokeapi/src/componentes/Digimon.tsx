import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { Error } from './Error';

// Defino los props que yo voy a usar a la hora de mostrar en las cards
interface Digimon {
    nombre: string;
    imagen: string;
    nivel: string;
}

export const GaleriaDigimon: React.FC = () => {
    // Estado para guardar la lista de digimons
    const [digimons, setDigimons] = useState<Digimon[]>([]);
    //Estado para saber si esta cartgando o no
    const [cargando, setCargando] = useState<boolean>(true);
    // Estado para controlar si ha ocurrido un error
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        // Función para pedir los datos
        const obtenerDigimons = async () => {
            setCargando(true);
            try {
                // Hacemos la petición a la API de Digimon
                const response = await fetch('https://digimon-api.vercel.app/api/digimon');
                const data = await response.json();

                // Creo una lista de 10 números aleatorios simples
                const seleccion: Digimon[] = [];
                for (let i = 0; i < 10; i++) {
                    // Elegimos un índice aleatorio del total de datos recibidos
                    const randomIdx = Math.floor(Math.random() * data.length);
                    const d = data[randomIdx];
                    
                    // Guardamos la información limpia en el array
                    seleccion.push({
                        nombre: d.name,
                        // Ruta a la imagen
                        imagen: d.img,
                        nivel: d.level
                    });
                }

// Guardo el estado, si ha fallado, hago que me muestre ese mensaje en la consola
                setDigimons(seleccion);
            } catch (error) {
                console.error("Algo salió mal:", error);
                setError(true);
            } finally {
                setCargando(false);
            }
        };

        obtenerDigimons();
    }, []);

// Se muestra este mensaje cuando esta cargando
    if (cargando) return <h2 className="mensaje">Abriendo Digital World...</h2>;

// Si hay un error, mostramos el componente de error
    if (error) return <Error/>;

// Pintamos la informacion obtenida con la peticion a la api usando los props qdefinidos antes en el componente Card
    return (
        <div className="grid-container">
            {digimons.map((d, index) => (
                <Card 
                    key={index} 
                    nombre={d.nombre} 
                    imagen={d.imagen} 
                    dato={d.nivel} 
                    etiqueta="Nivel" 
                />
            ))}
        </div>
    );
};