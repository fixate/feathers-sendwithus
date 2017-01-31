/* eslint-disable no-underscore-dangle */
import restler from 'restler';

export default function extendSendwithusApi(api) {
  if (!api.getTemplates) {
    // XXX: Object mutation, probably want to rewrite the sendwithus client lib to not
    // use classes, and more so, support all the sendwithus api calls!
    /* eslint no-param-reassign: 0 */
    api.getTemplates = function(callback) {
      const url = api._buildUrl('templates');

      const options = api._getOptions();

      api.emit('request', 'GET', url, options.headers);
      restler
      .get(url, options)
      .once('complete', (result, response) => {
        api._handleResponse.call(api, result, response, callback);
      });
    };
  }

  return api;
}
/* eslint-enable no-underscore-dangle */
