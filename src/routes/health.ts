import { FastifyRequest, FastifyReply } from 'fastify';

export class Health {
  public static check(req: FastifyRequest, rep: FastifyReply): void {
    rep.header('Content-Type', 'application/json').status(200).send('OK');
  }
}
