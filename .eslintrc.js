module.exports = {
  extends: 'airbnb-base',
  'rules': {
    'strict': 0,
    'no-floating-decimal': 0,
    'no-multiple-empty-lines': 0,
    'no-use-before-define': 0,
    'no-underscore-dangle':  ["error", { "allow": ["_id"]  }],
    'space-before-function-paren': 0,
    'import/no-extraneous-dependencies': ["error", { "devDependencies": true }],
    'func-names': 0,
    'consistent-return': 0,
  },
  'globals': {
  },
};
