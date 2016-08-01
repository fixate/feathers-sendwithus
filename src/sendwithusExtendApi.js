import restler from 'restler';

export default function extendSendwithusApi(api) {
  return Object.assign({
    getTemplates(callback) {
      const url = this._buildUrl('templates');

      const options = this._getOptions();

      this.emit('request', 'GET', url, options.headers);
      restler
        .get(url, options)
        .once('complete', (result, response) => {
          this._handleResponse.call(this, result, response, callback);
        });
    },
  }, api);
}

