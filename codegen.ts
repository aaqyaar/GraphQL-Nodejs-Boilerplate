import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'src/graphql/schema',
  documents: 'src/graphql/schema/*.{gql,graphql}',
  generates: {
    'src/__generated__/generated.ts': {
      plugins: [
        'typescript',
        'typescript-resolvers',
        'typescript-mongodb',
        'typescript-operations',
      ],
    },
  },
};

export default config;
