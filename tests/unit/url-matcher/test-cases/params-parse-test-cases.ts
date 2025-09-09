export const paramsParseTestCases = [
    {
        get it() {
            return `1 Parses params of ${this.input} to ${this.path}`
        },
        path: '/users/:uid/pictures/:pid',
        input: "/users/1/pictures/2",
        options: {},
        output: {
            uid: '1',
            pid: '2',
        }
    },
    {
        get it() {
            return `2 Parses params of ${this.input} to ${this.path}`
        },
        path: '/users/:uid/pictures/:pid',
        input: "/users/1/pictures/2",
        options: {},
        output: {
            uid: '1',
            pid: '2',
        }
    },
    {
        get it() {
            return `3 Parses params of ${this.input} to ${this.path}`
        },
        path: '/pictures/:uid',
        input: "/pictures/2",
        options: {},
        output: {
            uid: '2',
        }
    },
    {
        get it() {
            return `3 Parses params of ${this.input} to ${this.path}`
        },
        path: '/pictures',
        input: "/pictures",
        options: {},
        output: {}
    }
]
