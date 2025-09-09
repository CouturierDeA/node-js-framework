export const routeMatcherTest = [
    {
        get it() {
            return `1 Matches routes of ${this.input} to ${this.path}`
        },
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
    },
    {
        get it() {
            return `4 Matches routes with /* ${this.input} to ${this.path}`
        },
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
    },
    {
        get it() {
            return `6 Matches routes of ${this.input} to ${this.path}`
        },
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
    },
    // {
    //     get it() {
    //         return `7 Not Matches routes of ${this.input} to ${this.path}`
    //     },
    //     path: '/users/:id/pictures',
    //     input: "/users/pictures",
    //     options: {},
    //     output: {
    //         matched: false,
    //         params: {},
    //         query: {},
    //         route: '/users/:id/pictures'
    //     }
    // },
    // {
    //     get it() {
    //         return `4 Parses params with /* ${this.input} to ${this.path}`
    //     },
    //     path: '/users/:uid/pictures/:uid/*/aaa',
    //     input: "/users/1/pictures/2/test-any-route/all",
    //     output: {
    //         matched: false,
    //         params: {},
    //         query: {},
    //         route: '/users/:uid/pictures/:uid/*/aaa'
    //     }
    // },
    // {
    //     get it() {
    //         return `4 Parses params with /* ${this.input} to ${this.path}`
    //     },
    //     path: '/users/:uid/pictures/:uid/**',
    //     input: "/users/1/pictures/2/test-any-route/test-any-route-next",
    //     output: {
    //         matched: true,
    //         params: {
    //             path: ['test-any-route/test-any-route-next'],
    //             uid: ['1', '2'],
    //         },
    //         query: {},
    //         route: "/users/:uid/pictures/:uid/**",
    //     }
    // },
]
