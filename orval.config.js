module.exports = {
    openbridge: {
      input: {
        target: './config/octagon.yml',
      },
      output: {
        target: './api/endpoints/octagon.ts',
        schemas: './api/model',
        mode: 'tags-split',
        client: 'react-query',
        prettier: true,
        override: {
            mutator: {
              path: './services/custom-axios-instance.ts',
              name: 'customInstance',
            },
          },   
        },

    },
  };
 