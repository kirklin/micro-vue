type KeyToDepMap = Map<any, Set<any>>;
const targetMap = new WeakMap<object, KeyToDepMap>();

// eslint-disable-next-line import/no-mutable-exports
export let activeEffect: ReactiveEffect | undefined;

export class ReactiveEffect<T = any> {
  private readonly _fn: Function;
  constructor(fn: () => T) {
    this._fn = fn;
  }

  run() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    activeEffect = this;
    this._fn();
  }
}
export function effect<T = any>(fn: () => T) {
  const _effect = new ReactiveEffect(fn);

  _effect.run();
}

/**
 * Tracks access to a reactive property.
 *
 * This will check which effect is running at the moment and record it as dep
 * which records all effects that depend on the reactive property.
 *
 * @param target - Object holding the reactive property.
 * @param key - Identifier of the reactive property to track.
 */
export function track(target: object, key: unknown) {
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }
  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep);
  }
  dep.add(activeEffect);
}

export function trigger(target: object, key: unknown) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    // never been tracked
    return;
  }
  const dep = depsMap.get(key);
  dep?.forEach((effect: ReactiveEffect) => {
    effect.run();
  });
}

