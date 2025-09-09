const PLUS_RE = /\+/g; // %2B
const namedParam = /(\(\?)?:\w+/g;
const splatParam = /\*/g;
var optionalParam = /\((.*?)\)/g;
var escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;

export function parsePattern(pattern: string) {
    const names: any[] = [];
    pattern = pattern
        .replace(escapeRegExp, '\\$&')
        .replace(optionalParam, '(?:$1)?')
        .replace(namedParam, function (match, optional) {
            names.push(match.slice(1));
            return optional ? match : '([^/?]+)'
        })
        .replace(splatParam, function () {
            names.push('path');
            return '([^?]*?)'
        });

    return {
        regExp: new RegExp('^' + pattern + '(?:\\?([\\s\\S]*))?$'),
        namedParams: names
    }
};

export function decode(text: string) {
    try {
        return decodeURIComponent('' + text);
    } catch (err) {
    }
    return '' + text;
}

export function parseQuery(search: string | undefined) {
    if (!search) {
        return {}
    }
    const touple = search?.split('?') || [];
    const queryPath = decode(touple[1] || '');
    if (!queryPath) {
        return {}
    }
    return queryPath.split('&')
        ?.reduce((acc: { res: any, add: Function }, v: string) => acc?.add(v), {
            res: {},
            add(queryTouple: string) {
                const [key, value] = (queryTouple || '')
                    .replace(PLUS_RE, ' ')
                    .split('=');

                if (!key || !value) {
                    return this
                }

                let exist = !!this.res[key];

                const valueSpl = (value || '')
                    ?.split(',')
                    .filter(Boolean)

                !exist && (this.res[key] = []);

                valueSpl
                    .forEach(v => this.res[key]
                        .push(v))
                return this
            },
        }).res
}

export function parseParams(route: string, url: string) {
    const {regExp, namedParams} = parsePattern(route)
    const routeMatcher = regExp;
    const params = namedParams
    let matched: Array<string> | null

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
                    if (!res[key]) {
                        res[key] = []
                    }
                    res[key].push(value);
                    return this
                },
            })
            .res
    }
    return {}

}

export const routeMatcherFn = (route: string, url: string) => {
    const {regExp} = parsePattern(route)
    const routeMatcher = regExp;
    const [path, queryString] = url?.split('?') || [route, undefined];
    let matched: Array<string> | null = url?.match(routeMatcher)
    const params1 = matched ? parseParams(route, url) : {}
    const query = matched ? parseQuery(queryString ? `?${queryString}` : undefined) : {}

    return {
        matched: !!matched,
        params: params1,
        query,
        route
    }
}