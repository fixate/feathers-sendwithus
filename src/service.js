import Debug from 'debug';
import isArray from "lodash/isArray"
const ACT_SEND = 'send'
const ACT_BATCH = 'batch'

const debug = Debug('feathers-sendwithus:service');

export default function createService({ api, templateMapper,batchOpts }) {
  const {path='/api/v1/send',method='POST'}=batchOpts || {}
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
            const data = (isArray(params))?params.map(d=>{
                    return{
                        body:Object.assign({},d,{template}),
                        path,
                        method
                    }
                }):Object.assign({}, params, { template });

            api[(isArray(data))?ACT_BATCH:ACT_SEND](data, (err, result) => {
              if (err) {
                return reject(err);
              }
              resolve(result);
            });
          })
        );
    },
  });
}
