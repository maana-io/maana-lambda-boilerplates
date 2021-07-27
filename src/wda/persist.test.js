const wda = require('./index');

const inputWithKind = {
	one: 'sdf',
	two: true,
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
				modifiers: ['NONULL'],
				_id: '60ff46e02b57210019a1ef61',
				name: 'one',
				kind: 'STRING',
			},
			{
				modifiers: ['NONULL'],
				_id: '60ff46e02b57210019a1ef62',
				name: 'two',
				kind: 'BOOLEAN',
			},
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
		_id: '60ff453d26e00da0615e2751',
		outputModifiers: [],
		graphQLOperationType: 'QUERY',
		id: '0d600d78-7ae4-4e17-ab29-3f9705a6c748',
		name: 'lambdaTest',
		serviceId: 'c16292e8-0617-4c71-9c00-7d05e6f48263',
		code: 'return JSON.stringify(input);',
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

xdescribe('Error Tests', () => {
	describe('sanityCheck', () => {
		describe('Incorrect number of arguments', () => {
			test('Less than one argument', async () => {
				const check = async () => await wda.persist(inputWithNoArguments);

				expect(check()).rejects.toThrowError();
			});

			test('More than one argument', () => {
				const check = async () =>
					await wda.persist(inputWithMoreThanOneArgument);

				expect(check()).rejects.toThrowError();
			});
		});

		describe('Correct number of arguments', () => {
			test('Input is null', () => {
				const check = async () => await wda.persist(inputWithOneScalarArgument);

				expect(check()).rejects.toThrowError();
			});
		});
	});
});
