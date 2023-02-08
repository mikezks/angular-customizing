const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({

  name: 'fn-validate-passenger-status',

  exposes: {
    './fn': './projects/custom/fn-validate-passenger-status/src/util/validation/passenger-status.validator.ts',
  },

  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },

});
