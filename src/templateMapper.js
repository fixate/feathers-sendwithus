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

  return t => fetchTemplates()
    .then(templates => (templates.find(tmpl => (tmpl.name === t)) || { id: t }).id);
}
