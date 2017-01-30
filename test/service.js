import createService from '../src/service';
import sinon from 'sinon';
import {batchFixture,fixtures} from "./test-utils"
const fakeMails = fixtures.getData(4)
const fakeResponse = fakeMails.map(m=>{
    return Object.assign({},m,{template:m.template+ '\''})
})
module.exports = function(test) {
  const api = {
    send(data, cb) { cb(null, data); },
    batch(data, cb) { cb(null, data); }
  };

  sinon.spy(api, 'send');
  sinon.spy(api, 'batch');

  const templateMapper = (t) => Promise.resolve(`${t}'`);
  const batchOpts={size:2}
  const service = createService({ api, templateMapper,batchOpts});

  test("Service", function*(t) {
    //const data =
    const data = fakeMails[0]
    const result = yield service.create(data);

    t.deepEqual(result, fakeResponse[0]);

    t.ok(api.send.called, 'Api Send called');
    t.deepEquals(api.send.getCall(0).args[0].recipient, data.recipient, 'Calls with data');
    t.deepEquals(api.send.getCall(0).args[0].template, 'theId\'', 'Calls with mapped template');
  });

    test("Service - batch email send", function*(t) {

        const data =fakeMails;

        const result = yield service.create(data);
        //console.log(result)
        const expected= batchFixture(fakeResponse.slice(0,2))
        t.deepEqual(result,expected);

        t.ok(api.batch.called, 'Api batch called');
        t.deepEquals(api.batch.getCall(0).args[0][0].body.recipient, data[0].recipient, 'Calls with data');
        t.deepEquals(api.batch.getCall(0).args[0][0].body.template, 'theId\'', 'Calls with mapped template');
        t.deepEquals(api.batch.getCall(0).args[0][0].method, 'POST', 'calls with POST method');
        t.deepEquals(api.batch.getCall(0).args[0][0].path, '/api/v1/send', 'calls with send path');
        t.equal(api.batch.callCount,2,'calls batch api twice')
        t.deepEqual(api.batch.getCall(1).args[0],batchFixture(fakeResponse.slice(2,4)),'second call holds next pair of args')
    });



};
