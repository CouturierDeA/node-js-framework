export const queryParseTestCases = [
    {
        it: 'Parses query from url part',
        input: "/users/1/pictures/3?test=1,2,3&test=4,5,6,&test=7&test2=AAA",
        output: {
            test: [1, 2, 3, 4, 5, 6, 7],
            test2: ['AAA']
        }
    },
    {
        it: 'Parses query from query string',
        input: "?test=1,2,3&test=4,5,6,&test=7&test2=AAA",
        output: {
            test: [1, 2, 3, 4, 5, 6, 7],
            test2: ['AAA']
        }
    },
    {
        it: 'Parses same query as an array of elements',
        input: "?test=testStr&test=testStr",
        output: {
            test: ['testStr', 'testStr'],
        }
    },
    {
        it: 'Parses single query parameter',
        input: "?test=testStr",
        output: {
            test: ['testStr'],
        }
    },
    {
        it: 'Parser query parameters with close values',
        input: "?fq=fqv&sq=sqv",
        output: {
            fq: ['fqv'],
            sq: ['sqv'],
        }
    },
    {
        it: 'Parses query passed as an list of arguments divided by coma separator',
        input: "test=1,2,3&test=4,5,6,&test=7&test2=AAA",
        output: {
            test: [1, 2, 3, 4, 5, 6, 7],
            test2: ['AAA'],
        }
    },
    {
        it: 'Parses encoded query params',
        input: "/search?query=hello%20world&category=web%26dev",
        output: {
            query: ['hello world'],
            category: ['web&dev'],
        }
    },
    {
        it: 'Parses query passed as an list of arguments divided by coma separator',
        input: "?test=1,2,3&test=4,5,6,&test=7&test2=AAA",
        output: {
            test: [1, 2, 3, 4, 5, 6, 7],
            test2: ['AAA'],
        }
    },
    {
        it: 'Parses encoded query params',
        input: "https://test-multiple-query-params?test=1,2,3,4,5&id=6,7,8,9",
        output: {
            test: [1, 2, 3, 4, 5],
            id: [6,7,8,9],
        }
    },
    // { // Todo:
    //     it: 'Parses query passed as an list of arguments divided by coma separator',
    //     input: "test[0]=1&test[1]=2&test[2]=3&test[4]=4&test2=AAA",
    //     output: {
    //         test: [1, 2, 3, 4],
    //         test2: ['AAA'],
    //     }
    // },
]
