function createElement(name: string | Function, props: { [id: string]: string | Function }, ...content: string[]) {
    props = props || {};
    const isComponent = name instanceof Function;
    const propString = Object.keys(props)
        .map(key => {
            const value = props[key];
            if (isComponent) {
                return `${key}=${value}`
            }
            if (typeof value === 'function') return `${key}="(${value.toString()})()"`
            if (key === "className") return `class=${value}`;
            // if (key === "value") return `value="${value}"`;
            else return `${key}="${value}"`;
        })
        .join(' ');
    const attrs = propString.length ? ` ${propString}` : '';
    const joinedContent = content
        .flat()
        .filter(Boolean)
        .join('');
    if (!name) return joinedContent
    if (isComponent) return name(props, ...content);
    return `<${name}${attrs}>${joinedContent}</${name}>`;
}

export const GSX = {
    createElement,
};

export default GSX;
