import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Pelicula {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    titulo: string;

    @Column()
    director: string;

    @Column()
    year: number;

    @Column()
    duracion_minutos: number;
}
