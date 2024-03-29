import { IContainer } from '@aurelia/kernel';
import { type AccessorType, type IObserver, type ISubscriberCollection, type IObservable, type ISubscriber } from '../observation';
import type { IIndexable } from '@aurelia/kernel';
export interface IDirtyChecker extends DirtyChecker {
}
export declare const IDirtyChecker: import("@aurelia/kernel").InterfaceSymbol<IDirtyChecker>;
export declare const DirtyCheckSettings: {
    /**
     * Default: `6`
     *
     * Adjust the global dirty check frequency.
     * Measures in "timeouts per check", such that (given a default of 250 timeouts per second in modern browsers):
     * - A value of 1 will result in 250 dirty checks per second (or 1 dirty check per second for an inactive tab)
     * - A value of 25 will result in 10 dirty checks per second (or 1 dirty check per 25 seconds for an inactive tab)
     */
    timeoutsPerCheck: number;
    /**
     * Default: `false`
     *
     * Disable dirty-checking entirely. Properties that cannot be observed without dirty checking
     * or an adapter, will simply not be observed.
     */
    disabled: boolean;
    /**
     * Default: `false`
     *
     * Throw an error if a property is being dirty-checked.
     */
    throw: boolean;
    /**
     * Resets all dirty checking settings to the framework's defaults.
     */
    resetToDefault(): void;
};
export declare class DirtyChecker {
    static register(c: IContainer): void;
    private readonly tracked;
    private readonly p;
    constructor();
    createProperty(obj: object, key: PropertyKey): DirtyCheckProperty;
    addProperty(property: DirtyCheckProperty): void;
    removeProperty(property: DirtyCheckProperty): void;
    private readonly check;
}
export interface DirtyCheckProperty extends IObserver, ISubscriberCollection {
}
export declare class DirtyCheckProperty implements DirtyCheckProperty {
    obj: IObservable & IIndexable;
    key: string;
    type: AccessorType;
    constructor(dirtyChecker: IDirtyChecker, obj: IObservable & IIndexable, key: string);
    getValue(): unknown;
    setValue(_v: unknown): void;
    isDirty(): boolean;
    flush(): void;
    subscribe(subscriber: ISubscriber): void;
    unsubscribe(subscriber: ISubscriber): void;
}
//# sourceMappingURL=dirty-checker.d.ts.map