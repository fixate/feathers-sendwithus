import restler from 'restler';
import {handleBatchResponse} from './utils'

export default function extendSendwithusApi(api) {
    /*returns a result array with errors and success*/


  if (!api.getTemplates) {
    // XXX: Object mutation, probably want to rewrite the sendwithus client lib to not
    // use classes, and more so, support all the sendwithus api calls!
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



  if (!api.batch){
    api.batch = function(data,callback){

        const url = api._buildUrl('bath');

        const options = api._getOptions();
        
        api.emit('request', 'POST', url, options.headers, data);
        restler
            .postJson(url, data, options)
            .once('complete', function(result, response) {
                handleBatchResponse.call(api, result, response, callback);
            });
    }
  }

  return api;
}

