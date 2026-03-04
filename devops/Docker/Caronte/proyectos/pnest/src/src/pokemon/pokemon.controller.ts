import { Controller, Get, Post, Put, Delete, Body, Query, Param, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';

// Controlador que atiende todas las peticiones que lleguen a /pokemon
@Controller('pokemon')
export class PokemonController {
    constructor(private readonly pokemonService: PokemonService) { }

    // Crea un nuevo Pokémon con los datos del body
    @Post()
    crear(@Body() createPokemonDto: CreatePokemonDto) {
        return this.pokemonService.crear(createPokemonDto);
    }

    // Devuelve todos los Pokémon
    @Get()
    obtenerTodos() {
        return this.pokemonService.obtenerTodos();
    }

    // Búsqueda con filtros opcionales: nombre, tipo y HP mínimo
    @Get('query')
    buscarFiltrado(
        @Query('nombre') nombre?: string,
        @Query('tipo') tipo?: string,
        @Query('minHp') minHp?: string,
    ) {
        return this.pokemonService.buscarFiltrado(
            nombre,
            tipo,
            minHp ? parseInt(minHp) : undefined,
        );
    }

    // Devuelve el Pokémon con ese ID
    @Get(':id')
    obtenerUno(@Param('id', ParseIntPipe) id: number) {
        return this.pokemonService.obtenerUno(id);
    }

    // Actualiza los datos de un Pokémon existente
    @Put(':id')
    actualizar(
        @Param('id', ParseIntPipe) id: number,
        @Body() updatePokemonDto: UpdatePokemonDto,
    ) {
        return this.pokemonService.actualizar(id, updatePokemonDto);
    }

    // Elimina un Pokémon por su ID
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    eliminar(@Param('id', ParseIntPipe) id: number) {
        return this.pokemonService.eliminar(id);
    }
}
