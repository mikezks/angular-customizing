import { loadRemoteModule, LoadRemoteModuleOptions } from "@angular-architects/module-federation-runtime";
import { APP_INITIALIZER, inject, Injectable, Provider } from "@angular/core";
import { tap } from "rxjs";
import { DiscoveryLoadConfig, DISCOVERY_CONFIG_LOADER } from './discovery-loader.config';


@Injectable({
  providedIn: 'root'
})
export class DiscoveryService {
  #loadConfig: DiscoveryLoadConfig = {};
  #configLoader = inject(DISCOVERY_CONFIG_LOADER);
  #dynModules: Record<string, unknown> = {};

  reloadConfig(): void {
    this.#configLoader.subscribe(
      config => this.setLoadConfig(config)
    );
  }

  setLoadConfig(loaderConfig: DiscoveryLoadConfig) {
    this.#loadConfig = loaderConfig;
  }

  getLoadConfig<T>(key: string) {
    return this.#loadConfig[key];
  }

  loadModFed<T>(config: LoadRemoteModuleOptions | string): Promise<T> {
    const modFedConfig = typeof config === 'string' ? this.getLoadConfig(config) : config;
    return loadRemoteModule<T>(modFedConfig);
  }

  getModule<T>(key: string): T;
  getModule<T>(key: string, asyncOp: boolean): Promise<T>;
  getModule<T>(key: string, asyncOp = false): Promise<T> | T {
    const module = this.#dynModules[key] as T;
    const getDefaultExport = (esm: any) => (esm as any)?.default || esm as T;
    if (!module) {
      const promise = this.loadModFed<T>(key).then(
        esm => this.#dynModules[key] = esm
      );
      if (asyncOp) {
        return promise.then(
          getDefaultExport
        );
      }
    }
    const mod = getDefaultExport(module);

    return asyncOp ? new Promise(resolve => resolve(mod)) : mod;
  }
}

let discoveryService = {} as DiscoveryService;
function setDiscoveryService(service: DiscoveryService) {
  discoveryService = service;
}
export function getDiscoveryService(): DiscoveryService {
  return discoveryService;
}
export function getDynModule<T>(key: string): T {
  return getDiscoveryService().getModule<T>(key);
}
export function getAsyncModule<T>(key: string): Promise<T> {
  return getDiscoveryService().getModule<T>(key, true);
}

export function provideDiscoveryInitConfig(): Provider {
  return {
    provide: APP_INITIALIZER,
    useFactory: () => {
      const configLoader = inject(DISCOVERY_CONFIG_LOADER);
      const discoveryService = inject(DiscoveryService);
      // const router = inject(Router);
      // router.events.pipe(map(() => router.url),distinctUntilChanged()).subscribe(console.log);
      setDiscoveryService(discoveryService);
      return () => configLoader.pipe(
        tap(config => discoveryService.setLoadConfig(config))
      );
    },
    multi: true
  };
}
