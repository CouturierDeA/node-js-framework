import {
    parseQuery,
    routeMatcherFnCurly,
} from '../../../src/framework/core/route-matcher';
import {queryParseTestCases} from "./test-cases/query-parse-test-cases";
import {routeMatcherTest} from "./test-cases/test-cases-curly";

describe('Query tests ', () => {
    queryParseTestCases.forEach(test => {
        it(test.it, () => {
            const res = parseQuery(test.input)
            expect(res).toEqual(test.output)
        })
    })
})


describe('Route matcher ', () => {
    routeMatcherTest.forEach(test => {
        it(test.it, () => {
            const res = routeMatcherFnCurly(test.path, test.input)
            expect(res).toEqual(test.output)
        })
    })
})
