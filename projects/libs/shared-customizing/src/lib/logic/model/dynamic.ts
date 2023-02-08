import { Observable } from "rxjs";

export type Class<T> = new (...args: any[]) => T;

export interface DynProviderType<T> {
  get$: Observable<T>;
  get: T;
  set(service: T): T;
  reset(): void;
}
