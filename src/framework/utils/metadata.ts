import { AutowiredOptions, ComponentDecoratorOptions } from '../component';
import {
    ApplyMappingOptions,
    ArgumentInjectionsType,
    ArgumentsInjector,
} from '../controller/controller';
import { InstanceCreator } from './instance-creator';

const COMPONENT_DECORATOR = 'ComponentDecorator';

export function defineComponentDecorator<
    T extends { new (...args: any[]): {} },
>(constructor: T, options?: ComponentDecoratorOptions) {
    Reflect.defineMetadata(
        COMPONENT_DECORATOR,
        {
            options,
            constructor,
        },
        constructor
    );
}

const ARGUMENT_INJECTIONS = 'ARGUMENT_INJECTIONS';

export function defineArgumentInjections<T>(
    target: any,
    propertyKey: string,
    parameterIndex: number,
    argInjector: ArgumentsInjector<T>
) {
    const argumentInjections = getArgumentInjections(target, propertyKey);
    Reflect.defineMetadata(
        ARGUMENT_INJECTIONS,
        {
            ...argumentInjections,
            [parameterIndex]: argInjector,
        },
        target,
        propertyKey
    );
}

export function getArgumentInjections<S>(target: any, propertyKey: string) {
    return (
        (Reflect.getMetadata(
            ARGUMENT_INJECTIONS,
            target,
            propertyKey
        ) as ArgumentInjectionsType<S>) || {}
    );
}

const CONSTRUCTOR_ARGUMENT_INJECTIONS = 'CONSTRUCTOR_ARGUMENT_INJECTIONS';
export type ArgsInjectionOnConstructor<T> = {
    propertyKey: string;
    args: {
        [key: string]: ArgumentsInjector<T>;
    };
};

export function defineArgumentInjectionsOnConstructor<T>(
    target: any,
    propertyKey: string,
    parameterIndex: number,
    argInjector: ArgumentsInjector<T>
) {
    let argumentInjections = getArgumentInjectionsFromConstructor<T>(
        target.constructor
    );
    const newArjInjConstr: ArgsInjectionOnConstructor<T> =
        argumentInjections.find((arg) => arg.propertyKey === propertyKey) || {
            propertyKey,
            args: {},
        };

    newArjInjConstr.args = {
        ...(newArjInjConstr.args || {}),
        [parameterIndex]: argInjector,
    };

    Reflect.defineMetadata(
        CONSTRUCTOR_ARGUMENT_INJECTIONS,
        [...argumentInjections, newArjInjConstr],
        target.constructor
    );
}

export function getArgumentInjectionsFromConstructor<T>(
    target: any
): ArgsInjectionOnConstructor<T>[] {
    return Reflect.getMetadata(CONSTRUCTOR_ARGUMENT_INJECTIONS, target) || [];
}

const COMPONENT_INSTANCE_CREATOR = 'COMPONENT_INSTANCE_CREATOR';

export function defineComponentInstanceCreator<T>(
    constructor: T,
    instanceCreator: InstanceCreator<T>
) {
    Reflect.defineMetadata(
        COMPONENT_INSTANCE_CREATOR,
        instanceCreator,
        constructor
    );
}

export function getComponentInstanceCreator<T>(
    constructor: T
): InstanceCreator<T> {
    return Reflect.getMetadata(COMPONENT_INSTANCE_CREATOR, constructor);
}

const CONTROLLER_DECORATOR = 'ControllerDecorator';

export function defineControllerInstanceCreator<
    T extends { new (...args: any[]): {} },
>(constructor: T, instanceCreator: InstanceCreator<T>) {
    Reflect.defineMetadata(CONTROLLER_DECORATOR, instanceCreator, constructor);
}

export function getControllerInstanceCreator<T>(
    constructor: T
): InstanceCreator<T> {
    return Reflect.getMetadata(CONTROLLER_DECORATOR, constructor);
}

const ROUTE_OPTIONS = 'ROUTE_OPTIONS';
const CONTROLLER_ROUTE_OPTIONS = 'CONTROLLER_ROUTE_OPTIONS';

export type ControllerRouteMeta<T> = {
    url?: string;
};

export function defineControllerMeta<T extends { new (...args: any[]): {} }>(
    constructor: T,
    options?: ControllerRouteMeta<T>
) {
    Reflect.defineMetadata(CONTROLLER_ROUTE_OPTIONS, options, constructor);
}

export function getControllerMeta<T extends { new (...args: any[]): {} }>(
    constructor: T
): ControllerRouteMeta<T> {
    return Reflect.getMetadata(CONTROLLER_ROUTE_OPTIONS, constructor) || {};
}

export type RouteMetaOptions<T> = {
    url: string | RegExp;
    method: string;
    executor: keyof T | string;
};

export function defineRouteMeta<T extends { new (...args: any[]): {} }>(
    constructor: T,
    options: RouteMetaOptions<T>
) {
    const routeMeta = getRouteMeta(constructor);
    const newMeta: RouteMetaOptions<T>[] = [...routeMeta, options];
    Reflect.defineMetadata(ROUTE_OPTIONS, newMeta, constructor);
}

export function getRouteMeta<T extends { new (...args: any[]): {} }>(
    constructor: T
): RouteMetaOptions<T>[] {
    return Reflect.getMetadata(ROUTE_OPTIONS, constructor) || [];
}

const AUTOWIRED_DECORATOR = 'AUTOWIRED';

export function getAutoWired<T>(constructor: T): AutowiredOptions[] {
    return Reflect.getMetadata(AUTOWIRED_DECORATOR, constructor) || [];
}

export function defineAutoWired<T>(constructor: T, options: AutowiredOptions) {
    Reflect.defineMetadata(
        AUTOWIRED_DECORATOR,
        [...getAutoWired(constructor), options],
        constructor
    );
}

const MAPPING_DECORATOR = 'MAPPING_DECORATOR';

export function defineMappingMeta<T>(
    constructor: T,
    propertyKey: keyof T,
    options: ApplyMappingOptions
) {
    const mappingMeta = getMappingMeta(constructor);
    Reflect.defineMetadata(
        MAPPING_DECORATOR,
        [
            ...mappingMeta,
            {
                propertyKey,
                options,
            },
        ],
        constructor
    );
}

export type MappingMeta<T> = {
    propertyKey: string;
    options: ApplyMappingOptions;
};

export function getMappingMeta<T>(constructor: T): MappingMeta<T>[] {
    return Reflect.getMetadata(MAPPING_DECORATOR, constructor) || [];
}
