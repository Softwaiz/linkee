type SignalCallback<T = string> = (lastValue: T | undefined, nextValue: T | undefined) => void;

export function signal<T = string>(initialValue: T) {
    let value = initialValue;
    const listeners = new Set<SignalCallback<T>>();
    return {
        get value() {
            return value;
        },
        watch(callback: SignalCallback<T>) {
            listeners.add(callback);
            return () => listeners.delete(callback);
        },
        set value(newValue) {
            const lastValue = value;
            value = newValue;
            listeners.forEach(listener => listener(lastValue, newValue));
        }
    }
}

export type Signal<T> = ReturnType<typeof signal<T>>;