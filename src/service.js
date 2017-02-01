import Debug from 'debug';
import chunk from 'lodash.chunk';
import flatten from 'lodash.flatten';
import mapSeries from 'async/mapSeries';

const debug = Debug('feathers-sendwithus:service');

function extractTemplateNames(data) {
  return Array.isArray(data) ? data.map(d => d.template) : [data.template];
}

export default function createService(options) {
  const { api, templateMapper } = options;

  function callBatchApi(batch, callback) {
    api.batch(batch, callback);
  }

  function batchSend(data) {
    const preparedData = data.map(d => ({
      body: d,
      path: '/api/v1/send',
      method: 'POST',
    }));

    const chunks = chunk(preparedData, options.batchChunkSize);
    return new Promise((resolve, reject) => {
      mapSeries(chunks, callBatchApi, (err, results) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(flatten(results));
      });
    });
  }

  function send(data) {
    return new Promise((resolve, reject) => {
      api.send(data, (err, result) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(result);
      });
    });
  }

  return {
    setup(app) {
      this.app = app;
    },

    create(data) {
      debug(`create: ${JSON.stringify(data)}`);

      const templateNames = extractTemplateNames(data);

      return templateMapper(templateNames)
        .then((templates) => {
          if (Array.isArray(data)) {
            const payload = data.map((d, i) => Object.assign({}, d, { template: templates[i] }));
            return batchSend(payload);
          }

          const payload = Object.assign({}, data, { template: templates[0] });
          return send(payload, templates[0]);
        });
    },
  };
}

