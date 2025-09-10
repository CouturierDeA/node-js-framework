import { DependencyComponent, DepKey } from '../app';

export class DiContainer<T = DependencyComponent> {
    depInstances = new Map<DepKey, T>();

    getInstance(key: string) {
        return this.depInstances.get(key);
    }

    setInstance(key: string, value: T) {
        this.depInstances.set(key, value);
    }
}
