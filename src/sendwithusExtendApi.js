/* eslint-disable no-underscore-dangle */
import restler from 'restler';

export default function extendSendwithusApi(api) {
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

  api.batch = function(data, callback) {
    const url = api._buildUrl('batch');
    const options = api._getOptions();

    api.emit('request', 'POST', url, options.headers, data);
    restler
      .postJson(url, data, options)
      .once('complete', (result, response) => {
        if (response.statusCode === 200) {
          callback(null, result);
          return;
        }

        const err = new Error(`Batch api call failed with status ${response.statusCode}`);
        err.response = response;
        callback(err, result);
      });
  };

  return api;
}
/* eslint-enable no-underscore-dangle */
