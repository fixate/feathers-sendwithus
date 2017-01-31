import Debug from 'debug';
import isArray from "lodash/isArray"
const ACT_SEND = 'send'
const ACT_BATCH = 'batch'

const debug = Debug('feathers-sendwithus:service');

const execApiCall=function(data,api,callType){
    api[callType](data, (err, result) => {
        if (err) {
            return this.reject(err);
        }
        this.resolve(result);
    });
}

export default function createService({ api, templateMapper,batchOpts }) {
  const {path='/api/v1/send',method='POST',chunkSize=10}=batchOpts || {}

  return Object.create({
    setup(app) {
      this.app = app;
    },

    create(params) {
      debug(`create: ${JSON.stringify(params)}`)
      const param_template = (isArray(params))?params[0].template:params.template
      return templateMapper(param_template)
        .then((template) =>
          new Promise((resolve, reject) => {
            const context={resolve,reject};
            const data = (isArray(params))?params.map(d=>{
                    return{
                        body:Object.assign({},d,{template}),
                        path,
                        method
                    }
                }):Object.assign({}, params, { template });
            if(isArray(data)){
                for (let i = 0; i < data.length; i+=chunkSize) {
                    execApiCall.call(context,data.slice(i,i+chunkSize),api,ACT_BATCH)
                }
            }
            else{
                execApiCall.call(context,data,api,ACT_SEND)
            }
          })
        );
    },
  });
}

