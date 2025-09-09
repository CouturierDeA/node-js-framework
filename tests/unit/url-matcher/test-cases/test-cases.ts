export const routeMatcherTest = [
    {
        get it() {
            return `1 Matches routes of ${this.input} to ${this.path}`
        },
        path: '/users/:uid/pictures/:pid',
        input: "/users/1/pictures/2",
        options: {},
        output: {
            matched: true,
            params: {
                uid: ['1'],
                pid: ['2'],
            },
            query: {},
            route: '/users/:uid/pictures/:pid',
        }
    },
    {
        get it() {
            return `2 Matches routes of ${this.input} to ${this.path}`
        },
        path: '/users/:uid/pictures/:uid',
        input: "/users/1/pictures/2",
        options: {},
        output: {
            matched: true,
            params: {
                uid: ['1', '2'],
            },
            query: {},
            route: '/users/:uid/pictures/:uid',
        }
    },
    {
        get it() {
            return `3 Matches routes of ${this.input} to ${this.path}`
        },
        path: '/users/:uid/pictures/:uid/test',
        input: "/users/1/pictures/2/test",
        options: {},
        output: {
            matched: true,
            params: {
                uid: ['1', '2'],
            },
            query: {},
            route: '/users/:uid/pictures/:uid/test'
        }
    },
    {
        get it() {
            return `4 Matches routes with /* ${this.input} to ${this.path}`
        },
        path: '/users/:uid/pictures/:uid/*',
        input: "/users/1/pictures/2/test-any-route",
        options: {},
        output: {
            matched: true,
            params: {
                path: ['test-any-route'],
                uid: ['1', '2'],
            },
            query: {},
            route: '/users/:uid/pictures/:uid/*'
        }
    },
    {
        get it() {
            return `5 Matches routes of ${this.input} to ${this.path}`
        },
        path: '/users/:uid/pictures',
        input: "/users/1/pictures?test=123",
        options: {},
        output: {
            matched: true,
            params: {
                uid: ['1'],
            },
            query: {
                test: ['123']
            },
            route: '/users/:uid/pictures'
        }
    },
    {
        get it() {
            return `6 Matches routes of ${this.input} to ${this.path}`
        },
        path: '/users/pictures',
        input: "/users/pictures",
        options: {},
        output: {
            matched: true,
            params: {},
            query: {},
            route: '/users/pictures'
        }
    },
    {
        get it() {
            return `7 Not Matches routes of ${this.input} to ${this.path}`
        },
        path: '/users/:id/pictures',
        input: "/users/pictures",
        options: {},
        output: {
            matched: false,
            params: {},
            query: {},
            route: '/users/:id/pictures'
        }
    },
    {
        get it() {
            return `4 Parses params with /* ${this.input} to ${this.path}`
        },
        path: '/users/:uid/pictures/:uid/*/aaa',
        input: "/users/1/pictures/2/test-any-route/all",
        output: {
            matched: false,
            params: {},
            query: {},
            route: '/users/:uid/pictures/:uid/*/aaa'
        }
    },
    {
        get it() {
            return `4 Parses params with /* ${this.input} to ${this.path}`
        },
        path: '/users/:uid/pictures/:uid/**',
        input: "/users/1/pictures/2/test-any-route/test-any-route-next",
        output: {
            matched: true,
            params: {
                path: ['test-any-route/test-any-route-next'],
                uid: ['1', '2'],
            },
            query: {},
            route: "/users/:uid/pictures/:uid/**",
        }
    },
]
