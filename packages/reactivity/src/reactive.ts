import { track, trigger } from "./effect";

export function reactive(target: object) {
  return new Proxy(target, {
    get(target: any, key: string | symbol, receiver: any): any {
      const res = Reflect.get(target, key);
      track(target, key);
      return res;
    },
    set(target: any, key: string | symbol, newValue: any, receiver: any): boolean {
      const res = Reflect.set(target, key, newValue);
      trigger(target, key);
      return res;
    },

  });
}
