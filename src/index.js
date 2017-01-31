import Debug from 'debug';
import sendwithus from 'sendwithus';

import createTemplateMapper from './templateMapper';
import extendSendwithusApi from './sendwithusExtendApi';
import createService from './service';

const debug = Debug('feathers-sendwithus:main');

function checkOpts(opts) {
  if (!opts.apiKey) {
    throw new Error('Sendwithus API key was not passed to feathersSendwithus().');
  }
}

export default function feathersSendwithus(config) {
  const options = Object.assign({
    templateNameMapping: true,
    templateNameCacheTimeout: '1h',
    templateMapper: createTemplateMapper,
  }, config);

  debug(`Creating feathers-sendwithus service with options: ${JSON.stringify(options)}`);

  checkOpts(options);

  const api = extendSendwithusApi(sendwithus(options.apiKey));
  const templateMapper = options.templateNameMapping ?
    options.templateMapper(api, options) :
    t => Promise.resolve(t);

  return createService({ api, templateMapper });
}
