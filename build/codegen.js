"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    overwrite: true,
    schema: 'src/graphql/schema',
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
exports.default = config;
