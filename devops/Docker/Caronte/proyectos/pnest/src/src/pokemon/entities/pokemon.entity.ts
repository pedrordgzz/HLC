import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// Entidad que representa la tabla "pokemon" en la base de datos MySQL
@Entity()
export class Pokemon {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column()
    tipo: string;

    @Column()
    hp: number;
}
