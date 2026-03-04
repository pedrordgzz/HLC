import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pelicula } from './entities/pelicula.entity';
import { CreatePeliculaDto } from './dto/create-pelicula.dto';
import { UpdatePeliculaDto } from './dto/update-pelicula.dto';

@Injectable()
export class PeliculasService {
    constructor(
        @InjectRepository(Pelicula)
        private repositorioPeliculas: Repository<Pelicula>,
    ) { }

    async crear(createPeliculaDto: CreatePeliculaDto): Promise<Pelicula> {
        const pelicula = this.repositorioPeliculas.create(createPeliculaDto);
        return this.repositorioPeliculas.save(pelicula);
    }

    async obtenerTodas(): Promise<Pelicula[]> {
        return this.repositorioPeliculas.find();
    }

    async obtenerUna(id: number): Promise<Pelicula> {
        const pelicula = await this.repositorioPeliculas.findOne({ where: { id } });
        if (!pelicula) {
            throw new NotFoundException(`No se ha encontrado la película con ID ${id}`);
        }
        return pelicula;
    }

    async actualizar(id: number, updatePeliculaDto: UpdatePeliculaDto): Promise<Pelicula> {
        const pelicula = await this.obtenerUna(id);
        this.repositorioPeliculas.merge(pelicula, updatePeliculaDto);
        return this.repositorioPeliculas.save(pelicula);
    }

    async eliminar(id: number): Promise<void> {
        await this.obtenerUna(id);
        await this.repositorioPeliculas.delete(id);
    }

    async buscarFiltrado(titulo?: string, yearInicio?: number, yearFin?: number): Promise<Pelicula[]> {
        const consulta = this.repositorioPeliculas.createQueryBuilder('pelicula');

        if (titulo) {
            consulta.andWhere('pelicula.titulo LIKE :titulo', { titulo: `%${titulo}%` });
        }

        if (yearInicio && yearFin) {
            consulta.andWhere('pelicula.year BETWEEN :yearInicio AND :yearFin', { yearInicio, yearFin });
        } else if (yearInicio) {
            consulta.andWhere('pelicula.year >= :yearInicio', { yearInicio });
        } else if (yearFin) {
            consulta.andWhere('pelicula.year <= :yearFin', { yearFin });
        }

        return consulta.getMany();
    }
}
