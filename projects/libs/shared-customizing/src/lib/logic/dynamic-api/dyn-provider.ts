import { FactoryProvider, inject, Type } from "@angular/core";
import { BehaviorSubject } from 'rxjs';
import { Class, DynProviderType } from "../model/dynamic";

export function DynToken<DT, DS extends DT>(token: Class<DT>, service?: Class<DS>) {

  class DynProvider<T> implements DynProviderType<T> {
    #default = inject(service || token) as T;
    #service$ = new BehaviorSubject(this.#default);
    get$ = this.#service$.asObservable();

    static provide<T, S extends T>(token: Type<DynProvider<T>>, service: Type<S>): FactoryProvider {
      return {
        provide: token,
        useFactory: () => {
          const dynProvider = new token();
          dynProvider.set(inject(service));
          return dynProvider;
        }
      };
    }

    get get() {
      return this.#service$.value;
    }

    set(service: T): T {
      this.#service$.next(service);
      return service;
    }

    reset() {
      this.set(this.#default);
    }
  }

  return DynProvider<DT>;
}
