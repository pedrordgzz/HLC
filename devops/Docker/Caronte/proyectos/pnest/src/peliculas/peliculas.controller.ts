import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Query,
    Param,
    ParseIntPipe,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { PeliculasService } from './peliculas.service';
import { CreatePeliculaDto } from './dto/create-pelicula.dto';
import { UpdatePeliculaDto } from './dto/update-pelicula.dto';

@Controller('peliculas')
export class PeliculasController {
    constructor(private readonly peliculasService: PeliculasService) { }

    @Post()
    crear(@Body() createPeliculaDto: CreatePeliculaDto) {
        return this.peliculasService.crear(createPeliculaDto);
    }

    @Get()
    obtenerTodas() {
        return this.peliculasService.obtenerTodas();
    }

    @Get('query')
    buscarFiltrado(
        @Query('titulo') titulo?: string,
        @Query('yearInicio') yearInicio?: string,
        @Query('yearFin') yearFin?: string,
    ) {
        return this.peliculasService.buscarFiltrado(
            titulo,
            yearInicio ? parseInt(yearInicio) : undefined,
            yearFin ? parseInt(yearFin) : undefined,
        );
    }

    @Get(':id')
    obtenerUna(@Param('id', ParseIntPipe) id: number) {
        return this.peliculasService.obtenerUna(id);
    }

    @Put(':id')
    actualizar(
        @Param('id', ParseIntPipe) id: number,
        @Body() updatePeliculaDto: UpdatePeliculaDto,
    ) {
        return this.peliculasService.actualizar(id, updatePeliculaDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    eliminar(@Param('id', ParseIntPipe) id: number) {
        return this.peliculasService.eliminar(id);
    }
}
