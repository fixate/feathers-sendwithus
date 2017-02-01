import test from 'tape-async';
import feathersSendwithus from '../src';

test('Options', (t) => {
  t.throws(() => feathersSendwithus({}), Error, 'Requires the apiKey option to be set');
  t.doesNotThrow(() => feathersSendwithus({ apiKey: 'blah' }), 'Does not throw with correct options');
  t.end();
});

[
  './service',
  './templateMapper',
    './utils.js',
].forEach((p) => {
  /* eslint global-require: 0, import/no-dynamic-require: 0 */
  require(p)(test);
});
