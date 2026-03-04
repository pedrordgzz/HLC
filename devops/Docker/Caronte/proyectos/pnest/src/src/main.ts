import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Pokemon } from './pokemon/entities/pokemon.entity';

// Datos iniciales para api-pokemon
const pokemonIniciales = [
    { nombre: 'Bulbasaur', tipo: 'Planta', hp: 45 },
    { nombre: 'Charmander', tipo: 'Fuego', hp: 39 },
    { nombre: 'Squirtle', tipo: 'Agua', hp: 44 },
    { nombre: 'Pikachu', tipo: 'Eléctrico', hp: 35 },
    { nombre: 'Jigglypuff', tipo: 'Normal', hp: 115 },
    { nombre: 'Meowth', tipo: 'Normal', hp: 40 },
    { nombre: 'Psyduck', tipo: 'Agua', hp: 50 },
    { nombre: 'Machop', tipo: 'Lucha', hp: 70 },
    { nombre: 'Geodude', tipo: 'Roca', hp: 40 },
    { nombre: 'Haunter', tipo: 'Fantasma', hp: 45 },
    { nombre: 'Snorlax', tipo: 'Normal', hp: 160 },
    { nombre: 'Eevee', tipo: 'Normal', hp: 55 },
    { nombre: 'Dragonite', tipo: 'Dragón', hp: 91 },
    { nombre: 'Mewtwo', tipo: 'Psíquico', hp: 106 },
    { nombre: 'Mew', tipo: 'Psíquico', hp: 100 },
];

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Pipe global de validación: whitelist elimina campos no definidos en el DTO
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    // Inserta los datos iniciales solo si la tabla está vacía
    const repositorioPokemon = app.get(getRepositoryToken(Pokemon));
    const total = await repositorioPokemon.count();
    if (total === 0) {
        await repositorioPokemon.save(pokemonIniciales);
        console.log('✅ Datos iniciales de Pokémon insertados correctamente (15 Pokémon).');
    }

    // La API de Pokémon corre en el puerto 3001
    await app.listen(3001);
    console.log('🐾 API Pokémon arrancada en http://localhost:3001');
}
bootstrap();
