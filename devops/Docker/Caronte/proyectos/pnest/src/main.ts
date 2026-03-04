import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Pelicula } from './peliculas/entities/pelicula.entity';

// Datos iniciales para api-peliculas
const peliculasIniciales = [
  { titulo: "La La Land", director: "Damien Chazelle", year: 2016, duracion_minutos: 128 },
  { titulo: "Zootopia", director: "Byron Howard", year: 2016, duracion_minutos: 108 },
  { titulo: "Deadpool", director: "Tim Miller", year: 2016, duracion_minutos: 108 },
  { titulo: "Monsters, Inc.", director: "Pete Docter", year: 2001, duracion_minutos: 92 },
  { titulo: "Finding Nemo", director: "Andrew Stanton", year: 2003, duracion_minutos: 100 },
  { titulo: "The Nice Guys", director: "Shane Black", year: 2016, duracion_minutos: 116 },
  { titulo: "Bee Movie", director: "Simon J. Smith", year: 2007, duracion_minutos: 95 },
  { titulo: "Begin Again", director: "John Carney", year: 2013, duracion_minutos: 104 },
  { titulo: "WALL-E", director: "Andrew Stanton", year: 2008, duracion_minutos: 98 },
  { titulo: "Up", director: "Pete Docter", year: 2009, duracion_minutos: 96 },
  { titulo: "The Boss Baby", director: "Tom McGrath", year: 2017, duracion_minutos: 97 },
  { titulo: "X-Men: Apocalypse", director: "Bryan Singer", year: 2016, duracion_minutos: 144 },
  { titulo: "Moana", director: "Ron Clements", year: 2016, duracion_minutos: 107 },
  { titulo: "Frozen", director: "Chris Buck", year: 2013, duracion_minutos: 102 },
  { titulo: "Coco", director: "Lee Unkrich", year: 2017, duracion_minutos: 105 }
];

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Pipe global de validación
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Habilitar CORS para que el frontend pueda conectar
  app.enableCors();

  // Inserta los datos iniciales solo si la tabla está vacía
  const repositorioPeliculas = app.get(getRepositoryToken(Pelicula));
  const total = await repositorioPeliculas.count();
  if (total === 0) {
    await repositorioPeliculas.save(peliculasIniciales);
    console.log('✅ Datos iniciales de películas insertados correctamente.');
  }

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
  console.log('🎬 API Películas arrancada en puerto ' + (process.env.PORT ?? 3000));
}
bootstrap();
