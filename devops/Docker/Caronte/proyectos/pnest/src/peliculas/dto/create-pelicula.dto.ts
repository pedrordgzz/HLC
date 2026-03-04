import { IsString, IsInt, IsNotEmpty, MinLength, Min, Max } from 'class-validator';

export class CreatePeliculaDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    titulo: string;

    @IsString()
    @IsNotEmpty()
    director: string;

    @IsInt()
    @Min(1888)
    @Max(2100)
    year: number;

    @IsInt()
    @Min(1)
    duracion_minutos: number;
}
