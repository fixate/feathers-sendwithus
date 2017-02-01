# feathers-sendwithus

[![Build Status](https://travis-ci.org/fixate/feathers-sendwithus.svg?branch=master)](https://travis-ci.org/fixate/feathers-sendwithus)

Feathers service for sending mailers with [sendwithus](sendwithus.com).

STATUS: Under development (used in production since 0.0.4)

## Installation

`npm install --save feathers-sendwithus`


## Usage

```javascript
const sendwithusService = require('feathers-sendwithus');

module.exports = function() {
  const app = this;
  const config = app.get('mailer').sendwithus;
  app.use('/mailers', sendwithusService(config));
};
```

### Client usage:

Data is just passed to the [`sendwithus` api](https://www.sendwithus.com/docs/api#sending-emails) except
`template` which is mapped using the template mapper.

```javascript
app.service('/mailers').create({
  template: 'friendly-name',
  sender: { address: 'bar@email.com' },
  recipient: { address: 'foo@email.com' },
});
```

Works with batches too:

```javascript
app.service('/mailers').create([{
  template: 'forgotten-password',
  sender: { address: 'bar@email.com' },
  recipient: { address: 'foo@email.com' },
}, {
  template: 'confirmation-email',
  sender: { address: 'baz@email.com' },
  recipient: { address: 'foo@email.com' },
}]);

This will use the [`sendwithus` batch api](https://www.sendwithus.com/docs/api#batch-api-requests).
In batch mode (data is an array) the request will always succeed, and return the result of each request.

## Configuration

`apiKey` - Sendwithus api key (Required)

`templateNameMapping` - Will map template names to IDs when doing api calls (default: `true`)

`templateNameCacheExpiry` - Duration before templates are fetched again to be
                            mapped. *Set larger or smaller depending on how
                            often you create new templates or change template names
                            (default 1h (one hour))

`templateMapper` - Custom function which maps templates (default: the built in cached template mapper)
                   e.g.

`batchChunkSize` - default: 10, for the batch api, how many sends to chunk together in a request. Sendwithus [recommend 10](https://www.sendwithus.com/docs/api#batch-api).

## Custom template mapper

`templateMapper` is responsible for mapping given template names (data.template) to template ids that sendwithus understands.
We implement one that fetches all templates and caches it until `templateNameCacheExpiry` time passes.
You can mix ids and names, it will just map the names it finds and leave the rest.

If you want to do your own mapping, say if you want to hard code the template names and ids in a config
to remove the need for fetching you could implement your own mapper:

```javascript
const myMap = { friendly: 'templateId' };

const service = sendwithusService({
  ...
  // @param names {Array} Array of template names passed into service (one for single call, multiple for batch)
  // @returns {Promise} Promise containing ONLY template ids
  templateMapper: names => Promise.resolve(names.map(n => myMap[n] || n)),
});

service.create({
template: 'friendly',
...
}) will send { template: 'templateId' };
```


