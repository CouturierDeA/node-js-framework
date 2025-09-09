import {
    routeMatcherFnCurly,
} from '../../../src/framework/core/route-matcher';

describe('Route matcher ', () => {
    it('Matches route params /users/{uid}/pictures/{pid}', () => {
        const test = {
            path: '/users/{uid}/pictures/{pid}',
            input: "/users/1/pictures/2",
            options: {},
            output: {
                matched: true,
                params: {
                    uid: '1',
                    pid: '2',
                },
                query: {},
                route: '/users/{uid}/pictures/{pid}',
            }
        };
        const res = routeMatcherFnCurly(test.path, test.input)
        expect(res).toEqual(test.output)
    })
    it('Matches route named and asterisk* params from /users/{uid}/pictures/{pid}/*', () => {
        const test = {
            path: '/users/{uid}/pictures/{pid}/*',
            input: "/users/1/pictures/2/test-any-route",
            options: {},
            output: {
                matched: true,
                params: {
                    path: 'test-any-route',
                    uid: '1',
                    pid: '2',
                },
                query: {},
                route: '/users/{uid}/pictures/{pid}/*'
            }
        };
        const res = routeMatcherFnCurly(test.path, test.input)
        expect(res).toEqual(test.output)
    })
    it('Matches regular expressions', () => {
        const test = {
            path: /(.*)\.(js|css|html|jpeg|jpg|png|svg)$/g,
            input: "/static/js/main-page.js",
            options: {},
            get output() {
                return {
                    matched: true,
                    params: {
                        path: "/static/js/main-page.js",
                    },
                    query: {},
                    route: this.path
                }
            }
        }
        const res = routeMatcherFnCurly(test.path, test.input)
        expect(res).toEqual(test.output)
    })

    it.todo('Matches /** /users/1/pictures/2/test-any-route/test-any-route-next')
    it.todo('Matches /users/:uid/pictures/:uid/*/aaa')
})
