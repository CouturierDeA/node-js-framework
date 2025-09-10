type Rule<T = string> = {
    validate: (value: T) => boolean;
    rule: string;
    propertyKey: string;
};

function reflectValidator(target: Object, rule: Rule) {
    const rest =
        Reflect.getMetadata('VALIDATE_DECORATOR', target.constructor) ?? [];
    Reflect.defineMetadata(
        'VALIDATE_DECORATOR',
        rest.concat(rule),
        target.constructor
    );
}

export function required(target: object, propertyKey: string) {
    reflectValidator(target, {
        rule: 'required',
        propertyKey,
        validate: (value) => !!value,
    });
}

export function minMaxLength(min = 0, max = Infinity) {
    return function (target: Object, propertyKey: string) {
        reflectValidator(target, {
            rule: 'minMax',
            propertyKey,
            validate: (value) => {
                if (!value) return true;
                return value.length >= min && value.length <= max;
            },
        });
    };
}

export function DTOValidator<R extends Error>(
    getError?: (message: string) => R
) {
    const makeError =
        getError ??
        function (msg: string) {
            return new Error(msg);
        };
    return function <T extends { new (...args: any[]): {} }>(constructor: T) {
        return class extends constructor {
            constructor(...args: any[]) {
                super(...args);
                const validations =
                    Reflect.getMetadata('VALIDATE_DECORATOR', constructor) ??
                    [];
                const invalid = validations.filter((validation) => {
                    return !validation.validate(this[validation.propertyKey]);
                });
                if (invalid.length) {
                    throw makeError('Invalid data transfer object');
                }
            }
        };
    };
}
