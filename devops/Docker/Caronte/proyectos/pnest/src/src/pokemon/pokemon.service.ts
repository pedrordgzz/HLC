import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pokemon } from './entities/pokemon.entity';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';

// Servicio con la lógica de negocio para Pokémon
@Injectable()
export class PokemonService {
    constructor(
        @InjectRepository(Pokemon)
        private repositorioPokemon: Repository<Pokemon>,
    ) { }

    // Crea y guarda un nuevo Pokémon
    async crear(createPokemonDto: CreatePokemonDto): Promise<Pokemon> {
        const pokemon = this.repositorioPokemon.create(createPokemonDto);
        return this.repositorioPokemon.save(pokemon);
    }

    // Devuelve todos los Pokémon
    async obtenerTodos(): Promise<Pokemon[]> {
        return this.repositorioPokemon.find();
    }

    // Devuelve un Pokémon por su ID
    async obtenerUno(id: number): Promise<Pokemon> {
        const pokemon = await this.repositorioPokemon.findOne({ where: { id } });
        if (!pokemon) {
            throw new NotFoundException(`No se ha encontrado el Pokémon con ID ${id}`);
        }
        return pokemon;
    }

    // Actualiza los datos de un Pokémon existente
    async actualizar(id: number, updatePokemonDto: UpdatePokemonDto): Promise<Pokemon> {
        const pokemon = await this.obtenerUno(id);
        this.repositorioPokemon.merge(pokemon, updatePokemonDto);
        return this.repositorioPokemon.save(pokemon);
    }

    // Elimina un Pokémon por su ID
    async eliminar(id: number): Promise<void> {
        await this.obtenerUno(id);
        await this.repositorioPokemon.delete(id);
    }

    // Busca Pokémon con filtros opcionales: nombre (LIKE), tipo exacto y HP mínimo
    async buscarFiltrado(nombre?: string, tipo?: string, minHp?: number): Promise<Pokemon[]> {
        const consulta = this.repositorioPokemon.createQueryBuilder('pokemon');

        // Filtro por nombre parcial con LIKE
        if (nombre) {
            consulta.andWhere('pokemon.nombre LIKE :nombre', { nombre: `%${nombre}%` });
        }

        // Filtro por tipo exacto
        if (tipo) {
            consulta.andWhere('pokemon.tipo = :tipo', { tipo });
        }

        // Filtro por HP mínimo
        if (minHp) {
            consulta.andWhere('pokemon.hp > :minHp', { minHp });
        }

        return consulta.getMany();
    }
}
