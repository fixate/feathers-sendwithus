import Debug from 'debug';

const debug = Debug('feathers-sendwithus:service');

export default function createService({ api, templateMapper }) {
  return Object.create({
    setup(app) {
      this.app = app;
    },

    create(params) {
      debug(`create: ${JSON.stringify(params)}`);
      return templateMapper(params.template)
        .then(template => new Promise((resolve, reject) => {
          const data = Object.assign({}, params, { template });
          api.send(data, (err, result) => {
            if (err) {
              reject(err);
              return;
            }

            resolve(result);
          });
        }));
    },
  });
}
