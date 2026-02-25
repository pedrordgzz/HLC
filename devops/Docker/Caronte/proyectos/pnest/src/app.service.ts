import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): object {
    return {
      message: 'Hola desde NestJS en Docker!',
      version: '1.0.0',
      entorno: 'desarrollo',
    };
  }

  getSalud(): object {
    return { status: 'ok', uptime: process.uptime() };
  }
}
