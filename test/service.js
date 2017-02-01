import sinon from 'sinon';

import fixtures from './fixtures';
import createService from '../src/service';

module.exports = function(test) {
  const api = {
    send(data, cb) { cb(null, Object.assign({ api: true }, data)); },
    batch(data, cb) { cb(null, data.map(d => Object.assign({ api: true }, d.body))); },
  };

  sinon.spy(api, 'send');
  sinon.spy(api, 'batch');

  const templateMapper = names => Promise.resolve(names.map(n => `${n}'`));
  const service = createService({ api, templateMapper, batchChunkSize: 2 });

  test('Service', function* (t) {
    const data = fixtures.sendRequest();
    const result = yield service.create(data);
    const expectedResponse = Object.assign({}, data, { api: true, template: `${data.template}'` });

    t.deepEqual(result, expectedResponse, 'Correct response');

    t.ok(api.send.called, 'Api Send called');
    t.deepEquals(api.send.getCall(0).args[0].recipient, data.recipient, 'Calls with data');
    t.deepEquals(api.send.getCall(0).args[0].template, `${data.template}'`, 'Calls with mapped template');
  });

  test('Service - batch email send', function* (t) {
    const fakeBatch = fixtures.batchSendRequest(3);

    const result = yield service.create(fakeBatch);
    const expected = fakeBatch.map(d => Object.assign({}, d, { api: true, template: `${d.template}'` }));
    t.deepEqual(result, expected, 'Expected results');

    t.ok(api.batch.called, 'Api batch called');
    t.deepEquals(api.batch.getCall(0).args[0][0].body.recipient, fakeBatch[0].recipient, 'Calls with data');
    t.deepEquals(api.batch.getCall(0).args[0][0].body.template, `${fakeBatch[0].template}'`, 'Calls with mapped template');
    t.deepEquals(api.batch.getCall(0).args[0][0].method, 'POST', 'calls with POST method');
    t.deepEquals(api.batch.getCall(0).args[0][0].path, '/api/v1/send', 'calls with send path');
    t.equal(api.batch.callCount, 2, 'Calls batch api with each batch');
    const expectedSecondBatch = [{
      body: Object.assign({}, fakeBatch[1], { template: `${fakeBatch[1].template}'` }),
      method: 'POST',
      path: '/api/v1/send',
    }];
    t.deepEqual(api.batch.getCall(1).args[0], expectedSecondBatch, 'second call holds next pair of args');
  });
};
