import {
    parseParamsCurly,
} from '../../../src/framework/core/route-matcher';

describe('test params matcher ', () => {
    it(`Parses params from /users/{uid}/pictures/{pid}`, () => {
        const test = {
            path: '/users/{uid}/pictures/{pid}',
            input: "/users/1/pictures/2",
            output: {
                uid: '1',
                pid: '2',
            }
        }
        const res = parseParamsCurly(test.path, test.input)
        expect(res).toEqual(test.output)
    })

    it(`Parses params from /pictures/{uid}`, () => {
        const test = {
            path: '/pictures/{uid}',
            input: "/pictures/2",
            output: {
                uid: '2',
            }
        }
        const res = parseParamsCurly(test.path, test.input)
        expect(res).toEqual(test.output)
    })

    it(`Parses zero params from /pictures/`, () => {
        const test = {
            path: '/pictures',
            input: "/pictures",
            output: {}
        }
        const res = parseParamsCurly(test.path, test.input)
        expect(res).toEqual(test.output)
    })

    it(`Parses zero params from /edit/{todoId}`, () => {
        const test = {
            path: '/edit/{todoId}',
            input: "/edit/1",
            output: {
                todoId: '1',
            }
        }
        const res = parseParamsCurly(test.path, test.input)
        expect(res).toEqual(test.output)
    })

    it(`Parses params from https://localhost:4000/todo/edit/1`, () => {
        const test = {
            path: `/todo/edit/{todoId}`,
            input: "https://localhost:4000/todo/edit/1",
            output: {
                todoId: '1',
            }
        }
        const res = parseParamsCurly(test.path, test.input)
        expect(res).toEqual(test.output)
    })
    //
    // it(`Parses zero params from /pictures/[.*?.(?:jpeg|png)]`, () => {
    //     const test = {
    //         path: '/pictures/[.*?.(?:jpeg|png)]',
    //         input: "/pictures/photo.png",
    //         options: {},
    //         output: {
    //             uid: '2',
    //         }
    //     }
    //     const res = parseParamsCurly(test.path, test.input)
    //     expect(res).toEqual(test.output)
    // })
})
