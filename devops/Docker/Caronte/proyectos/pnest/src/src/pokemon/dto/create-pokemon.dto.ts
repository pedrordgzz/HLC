import { IsString, IsInt, IsNotEmpty, MinLength, Min, Max } from 'class-validator';

// DTO para la creación de un nuevo Pokémon
export class CreatePokemonDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    nombre: string;

    @IsString()
    @IsNotEmpty()
    tipo: string;

    @IsInt()
    @Min(1)
    @Max(999)
    hp: number;
}
