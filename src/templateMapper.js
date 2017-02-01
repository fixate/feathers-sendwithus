import moment from 'moment';

export default function createTemplateMapper(api, options) {
  const cache = {};
  const timeout = moment.duration(options.templateNameCacheTimeout).seconds();

  function fetchTemplates() {
    return new Promise((resolve, reject) => {
      const now = (new Date()).getTime();
      if (cache.createdAt && cache.createdAt - now > timeout) {
        cache.createdAt = null;
        cache.templates = null;
      }

      if (cache.templates) {
        return resolve(cache.templates);
      }

      api.getTemplates((err, templates) => {
        if (err) {
          return reject(err);
        }

        cache.createdAt = (new Date()).getTime();
        cache.templates = templates;
        resolve(templates);
      });
    });
  }

  return names => fetchTemplates()
    .then(templates => names.map(name => templates.find(t => t.name === name) || name))
    // Extract the id from the template or just use the name (can combine ids and names)
    .then(mappedTemplates => mappedTemplates.map(m => m.id || m));
}
