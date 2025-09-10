import { parseQuery } from '../../../src/framework/core/route-matcher';

describe('Query tests ', () => {
    it('Parses query from url part', () => {
        const test = {
            input: '/users/1/pictures/3?test=1,2,3&test=4,5,6,&test=7&test2=AAA',
            output: {
                test: [1, 2, 3, 4, 5, 6, 7],
                test2: ['AAA'],
            },
        };
        const res = parseQuery(test.input);
        expect(res).toEqual(test.output);
    });

    it('Parses query from query string', () => {
        const test = {
            input: '?test=1,2,3&test=4,5,6,&test=7&test2=AAA',
            output: {
                test: [1, 2, 3, 4, 5, 6, 7],
                test2: ['AAA'],
            },
        };
        const res = parseQuery(test.input);
        expect(res).toEqual(test.output);
    });

    it('Parses same query as an array of elements', () => {
        const test = {
            input: '?test=testStr&test=testStr',
            output: {
                test: ['testStr', 'testStr'],
            },
        };
        const res = parseQuery(test.input);
        expect(res).toEqual(test.output);
    });

    it('Parses single query parameter', () => {
        const test = {
            it: 'Parses single query parameter',
            input: '?test=testStr',
            output: {
                test: ['testStr'],
            },
        };
        const res = parseQuery(test.input);
        expect(res).toEqual(test.output);
    });

    it('Parser query parameters with close values', () => {
        const test = {
            input: '?fq=fqv&sq=sqv',
            output: {
                fq: ['fqv'],
                sq: ['sqv'],
            },
        };
        const res = parseQuery(test.input);
        expect(res).toEqual(test.output);
    });

    it('Parses query passed as an list of arguments divided by coma separator', () => {
        const test = {
            input: 'test=1,2,3&test=4,5,6,&test=7&test2=AAA',
            output: {
                test: [1, 2, 3, 4, 5, 6, 7],
                test2: ['AAA'],
            },
        };
        const res = parseQuery(test.input);
        expect(res).toEqual(test.output);
    });

    it('Parses encoded query params', () => {
        const test = {
            input: '/search?query=hello%20world&category=web%26dev',
            output: {
                query: ['hello world'],
                category: ['web&dev'],
            },
        };
        const res = parseQuery(test.input);
        expect(res).toEqual(test.output);
    });

    it('Parses query passed as an list of arguments divided by coma separator', () => {
        const test = {
            input: '?test=1,2,3&test=4,5,6,&test=7&test2=AAA',
            output: {
                test: [1, 2, 3, 4, 5, 6, 7],
                test2: ['AAA'],
            },
        };
        const res = parseQuery(test.input);
        expect(res).toEqual(test.output);
    });

    it('Parses query from full path', () => {
        const test = {
            it: 'Parses query from full path',
            input: 'https://test-multiple-query-params?test=1,2,3,4,5&id=6,7,8,9',
            output: {
                test: [1, 2, 3, 4, 5],
                id: [6, 7, 8, 9],
            },
        };
        const res = parseQuery(test.input);
        expect(res).toEqual(test.output);
    });

    it.todo('Parses queries like test[0]=1&test[1]=2&test[2]=3&test[4]');
});
