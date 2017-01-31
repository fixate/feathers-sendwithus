import createTemplateMapper from '../src/templateMapper';

module.exports = function(test) {
  test('Template Mapper', function* (t) {
    const mockApi = {
      getTemplates(cb) {
        cb(null, [{ name: 'a', id: '123' }, { name: 'friendly', id: 'theId' }]);
      },
    };

    const mapper = createTemplateMapper(mockApi, {
      templateNameCacheTimeout: '1d',
    });

    t.equals(yield mapper('a'), '123', 'Maps template name to id');
    t.equals(yield mapper('friendly'), 'theId', 'Maps template name to id');
    t.equals(yield mapper('b'), 'b', 'Resolves to same template name if template name doesn\'t exist');
  });
};
