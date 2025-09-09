import {IRoute} from "../app";

const splatParam = /\*/g;
const curlyBracketsReg = /{([^}]*)}/g;

export function parseQuery(query: string): Record<string, (string | number)[]> {
    if (!query) return {};
    const normalized = query.includes('?') ? query.split('?')[1] : query;
    const params = new URLSearchParams(normalized);
    const result = new Map<string, (string | number)[]>();
    for (const key of params.keys()) {
        result.set(key, params.getAll(key)
            .flatMap(value =>
                value
                    .split(',')
                    .map(v => v.trim())
                    .filter(v => v !== '')
                    .map(v => {
                        const num = Number(v);
                        return isNaN(num) ? v : num;
                    })
            ));
    }
    return Object.fromEntries(result);
}

export const routeMatcherFnCurly = (route: string | RegExp, url: string, routeItem?: IRoute): RequestParams => {
    if (routeItem && routeItem.validator && !routeItem.validator(url)) {
        return
    }
    if (route instanceof RegExp) {
        let matched: Array<string> | null = url?.match(route)
        return {
            matched: !!matched,
            params: {
                path: url
            },
            query: {},
            route
        }
    }
    const queryString = (url ? url?.split('?') : [undefined, undefined])[1];
    const {regExp} = parsePatternCurly(route);
    let matched: Array<string> | null = url?.match(regExp)
    const params1 = matched ? parseParamsCurly(route, url) : {}
    const query = matched ? parseQuery(queryString ? `?${queryString}` : undefined) : {}

    return {
        matched: !!matched,
        params: params1,
        query,
        route
    }
}

export function routeMatcher<T>(url: string, routes: IRoute[], method: string): {
    executors?: T[],
    executor?: T,
    requestParams: RequestParams,
} {
    let match: RequestParams = {
        matched: true,
        route: 'default',
        query: {},
        params: {}
    }
    const middleware = routes
        .filter(r => r.type === 'middleware')
        .map((route) => {
            const {method: routeMethod, url: routePath} = route;
            const methodMatched = routeMethod.toLowerCase() === method.toLowerCase() || routeMethod === '*'
            if (!methodMatched) {
                return undefined
            }
            const result = routeMatcherFnCurly(routePath, url, route)
            if (result?.matched) {
                Object.assign(match, result)
            }
            return result?.matched && route.executor as unknown as T
        }).filter(v => typeof v === 'function')

    let executors = routes
        .filter(r => r.type === 'executor')
        .map(route => {
            const {method: routeMethod, url: routePath} = route;
            const methodMatched = routeMethod.toLowerCase() === method.toLowerCase()
            const result = methodMatched && routeMatcherFnCurly(routePath, url, route)
            if (result?.matched) {
                Object.assign(match, result)
            }
            return result?.matched && route.executor as unknown as T
        })
        .filter(v => typeof v === 'function')

    const requestParams: RequestParams = {
        route: match.route,
        params: match.params,
        query: match.query,
        matched: match.matched,
    }
    return {
        executors: [
            ...middleware,
            ...executors
        ],
        requestParams,
    }
}

export interface RequestParams {
    route: string | RegExp
    params: object
    query: object
    matched: boolean
}

export function parsePatternCurly(pattern: string) {
    const names: any[] = [];
    pattern = pattern
        .replace(curlyBracketsReg, function (match, optional) {
            let m = match.substring(0, match.length - 1)
            m = m.substring(1)
            names.push(m);
            return '([^/?]+)'
        })
        .replace(splatParam, function (match, optional) {
            names.push('path');
            return '([^?]*?)'
        })
    return {
        regExp: new RegExp('^' + pattern + '(?:\\?([\\s\\S]*))?$'),
        namedParams: names
    }
}

function getPathName(urlString: string) {
    if (urlString.startsWith('/')) {
        return urlString;
    }
    try {
        const url = new URL(urlString);
        return url.pathname;
    } catch {
        return urlString;
    }
}

export function parseParamsCurly(route: string, url1: string) {
    const {regExp, namedParams} = parsePatternCurly(route);

    const routeMatcher = regExp;
    const params = namedParams
    let matched: Array<string> | null

    const url = getPathName(url1);

    if (params?.length) {
        matched = url?.match(routeMatcher)

        return params
            ?.reduce((acc: { res: any, add: Function }, v: any, index: number) => acc?.add(v, index), {
                res: {},
                add(key: string, index: number) {
                    const value = matched && matched[index + 1];
                    if (!key || !value) {
                        return this
                    }
                    const res = this.res;
                    res[key] = value
                    return this
                },
            })
            .res
    }
    return {}
}
