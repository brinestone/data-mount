import { defineConfig } from 'orval';
export default defineConfig({
	datamount: {
		input: {
			target: 'http://localhost:5144/openapi/v1.json',
			filters: {
				mode: 'exclude',
				tags: ['Internal', 'General', 'Miscellaneous'],
			}
		},
		output: {
			mode: 'tags-split',
			indexFiles: true,
			target: 'src/sdk/services',
			namingConvention: 'kebab-case',
			client: 'angular',
			override: {
				// zod: {},
				angular: {
					provideIn: false,
					runtimeValidation: true,
				},
			},
			schemas: {
				type: 'zod',
				path: './libs/sdk/models'
			},
			operationSchemas: './libs/sdk/dto'
		},
	}
});
