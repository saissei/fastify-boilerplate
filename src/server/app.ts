/* eslint-disable @typescript-eslint/no-var-requires */
import fastify from 'fastify';
import helmet from 'fastify-helmet';
import { Health } from '../routes/health';
import Webhook from '../routes/webhook';
import Loger from '../logger/main';
const server = fastify();
const port = process.env.PORT || 3000;



class Instance {
  public constructor() {
    this.initialize();
    server.get('/', Health.check);
    server.register(Webhook, {prefix: '/hook'});
  }

  private initialize() {
    server.register(require('fastify-cors'));
    server.register(helmet);
    const logger = new Loger();
    server.listen(port, '::', err => {
      if (err) throw err;
      logger.info(`server listening on ${port}`);
    });
  }

}

new Instance();
