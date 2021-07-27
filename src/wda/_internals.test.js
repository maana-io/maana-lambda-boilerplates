const produce = require('immer');
const { getArgsAndKindMap, sanityCheck } = require('./_internals');
const fooWithBarCollection = require('./mocks/fooWithBarCollection.json');

const inputWithKind = {
	__lambda: {
		_id: '60ff46e026e00da0615e2bf0',
		outputModifiers: [],
		graphQLOperationType: 'QUERY',
		id: '0d600d78-7ae4-4e17-ab29-3f9705a6c748',
		name: 'lambdaTest',
		serviceId: 'c16292e8-0617-4c71-9c00-7d05e6f48263',
		code: 'return JSON.stringify(input);',
		input: [
			{
				modifiers: [],
				_id: '60ff46e02b57210019a1ef63',
				name: 'foo',
				kind: 'FooInput',
			},
		],
		outputKind: 'STRING',
		kinds: [
			{
				_id: '60ff46e02b57210019a1ef64',
				name: 'FooInput',
				fields: [
					{
						modifiers: ['NONULL'],
						_id: '60ff46e02b57210019a1ef65',
						name: 'id',
						kind: 'ID',
					},
					{
						modifiers: ['NONULL'],
						_id: '60ff46e02b57210019a1ef66',
						name: 'name',
						kind: 'STRING',
					},
				],
			},
		],
		sequenceNo: 3,
		runtime: {
			id: 'Q+JavaScript',
			host: 'Q',
			language: 'JavaScript',
		},
	},
	__callingSvcRef: 'd4f54de8-4367-4fcf-a9e9-cdf2f4809b33',
	__ownerSvcRef: 'd4f54de8-4367-4fcf-a9e9-cdf2f4809b33',
	interval: 500,
};

const inputWithMoreThanOneArgument = {
	one: 'sdf',
	two: true,
	__lambda: {
		_id: '60ff453d26e00da0615e2751',
		outputModifiers: [],
		graphQLOperationType: 'QUERY',
		id: '0d600d78-7ae4-4e17-ab29-3f9705a6c748',
		name: 'lambdaTest',
		serviceId: 'c16292e8-0617-4c71-9c00-7d05e6f48263',
		code: 'return JSON.stringify(input);',
		input: [
			{
				modifiers: ['NONULL'],
				_id: '60ff453dc9ea7f0019e934b0',
				name: 'one',
				kind: 'STRING',
			},
			{
				modifiers: ['NONULL'],
				_id: '60ff453dc9ea7f0019e934b1',
				name: 'two',
				kind: 'BOOLEAN',
			},
		],
		outputKind: 'STRING',
		kinds: [],
		sequenceNo: 2,
		runtime: {
			id: 'Q+JavaScript',
			host: 'Q',
			language: 'JavaScript',
		},
	},
	__callingSvcRef: 'd4f54de8-4367-4fcf-a9e9-cdf2f4809b33',
	__ownerSvcRef: 'd4f54de8-4367-4fcf-a9e9-cdf2f4809b33',
	interval: 500,
};

const inputWithNoArguments = {
	one: 'sdf',
	two: true,
	__lambda: {
		_id: '60ff453d26e00da0615e2751',
		outputModifiers: [],
		graphQLOperationType: 'QUERY',
		id: '0d600d78-7ae4-4e17-ab29-3f9705a6c748',
		name: 'lambdaTest',
		serviceId: 'c16292e8-0617-4c71-9c00-7d05e6f48263',
		code: 'return JSON.stringify(input);',
		input: [],
		outputKind: 'STRING',
		kinds: [],
		sequenceNo: 2,
		runtime: {
			id: 'Q+JavaScript',
			host: 'Q',
			language: 'JavaScript',
		},
	},
	__callingSvcRef: 'd4f54de8-4367-4fcf-a9e9-cdf2f4809b33',
	__ownerSvcRef: 'd4f54de8-4367-4fcf-a9e9-cdf2f4809b33',
	interval: 500,
};

const inputWithOneScalarArgument = {
	one: 'string input type',
	__lambda: {
		input: [],
		outputKind: 'STRING',
		kinds: [
			{
				modifiers: ['NONULL'],
				_id: '60ff46e02b57210019a1ef61',
				name: 'one',
				kind: 'STRING',
			},
		],
	},
	__ownerSvcRef: 'd4f54de8-4367-4fcf-a9e9-cdf2f4809b33',
	interval: 500,
};

const inputWithNull = {
	one: 'string input type',
	__lambda: {
		input: [],
		outputKind: 'STRING',
		kinds: [null],
	},
	__ownerSvcRef: 'd4f54de8-4367-4fcf-a9e9-cdf2f4809b33',
	interval: 500,
};

describe('getArgsAndKindMap', () => {
	test('Gets correct inputs and outputs', () => {
		const result = getArgsAndKindMap(fooWithBarCollection);

		expect(result.args.length).toBe(1);
		expect(Object.keys(result.kinds).length).toBe(2);
	});
});

describe('sanityCheck', () => {
	describe('Should only accept a single argument', () => {
		test('Less than one argument', async () => {
			const input = getArgsAndKindMap(inputWithNoArguments);
			expect(() =>
				sanityCheck(input.args, input.kinds)
			).toThrowErrorMatchingInlineSnapshot(
				`"Could not persist. Wrong number of inputs"`
			);
		});

		test('More than one argument', () => {
			const input = getArgsAndKindMap(inputWithMoreThanOneArgument);
			expect(() =>
				sanityCheck(input.args, input.kinds)
			).toThrowErrorMatchingInlineSnapshot(
				`"Could not persist. Wrong number of inputs"`
			);
		});

		test('One argument passes', () => {
			const input = getArgsAndKindMap(fooWithBarCollection);
			expect(() => sanityCheck(input.args, input.kinds)).not.toThrow();
		});
	});

	test('Should not allow null for input', () => {
		const parsed = getArgsAndKindMap(fooWithBarCollection);

		// * nullify a kind in the list
		parsed.kinds[parsed.args[0].kind] = null;

		expect(() =>
			sanityCheck(parsed.args, parsed.kinds)
		).toThrowErrorMatchingInlineSnapshot(
			`"Could not persist. Argument ${parsed.args[0].name} is not a kind"`
		);
	});

	test('Should ensure input kind is truly an Input kind', () => {
		const input = getArgsAndKindMap(fooWithBarCollection);

		// * modify kind name so it doesn't end in "Input"
		const arg = input.args[0];
		const prevName = arg.kind;
		arg.kind += 'Incorrect';
		input.kinds[arg.kind] = {
			...input.kinds[prevName]
		};
		delete input.kinds[prevName];

		expect(() =>
			sanityCheck(input.args, input.kinds)
		).toThrowErrorMatchingInlineSnapshot(
			`"Argument ${arg.name} is not an input kind"`
		);
	});
});
