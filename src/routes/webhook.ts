import { FastifyInstance, FastifyReply, FastifyRequest, RouteShorthandOptions } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { ReceiveWebhook } from '../types/ReceiveMessage';

export default (server: FastifyInstance<Server, IncomingMessage, ServerResponse>, opts: RouteShorthandOptions, next: (err?: Error) => void): void => {
  server.get('/', opts, (req: FastifyRequest, rep: FastifyReply) => {
    rep.header('Content-Type', 'application/json').status(200).send({ status: 'ok' });
  });

  server.post<{Body: ReceiveWebhook}>('/', opts, (req: FastifyRequest<{Body: ReceiveWebhook}>, rep: FastifyReply) => {
    console.log(req.body);
    rep.header('Content-Type', 'application/json').status(200).send({ status: 'ok' });
  });

  next();
};
