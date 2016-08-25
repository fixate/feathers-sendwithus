# feathers-sendwithus

[![Build Status](https://travis-ci.org/fixate/feathers-sendwithus.svg?branch=master)](https://travis-ci.org/fixate/feathers-sendwithus)

Feathers service for sending mailers with [sendwithus](sendwithus.com).

STATUS: Under development

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

## Configuration

`apiKey` - Sendwithus api key (Required)

`templateNameMapping` - Will map template names to IDs when doing api calls (default: `true`)

`templateNameCacheExpiry` - Duration before templates are fetched again to be
                            mapped. *Set larger or smaller depending on how
                            often you create new templates or change template names
                            (default 1h (one hour))

`templateMapper` - Custom function which maps templates (default: the built in cached template mapper)
                   e.g.

```javascript
const myMap = { friendly: 'templateId' };

const service = sendwithusService({
  ...
  templateMapper: (t) => Promise.resolve(myMap[t] || t),
});

service.create({
template: 'friendly',
...
}) will send { template: 'templateId' };
```


