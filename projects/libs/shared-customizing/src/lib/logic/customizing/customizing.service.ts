import { APP_INITIALIZER, inject, Injectable, Injector, Provider, ProviderToken } from "@angular/core";
import { BehaviorSubject, distinctUntilChanged, filter, map, Observable, tap } from "rxjs";
import { getAsyncModule } from "../discovery/discovery.service";
import { DynProviderType } from "../model/dynamic";
import { CustomizingConfig, CUSTOMIZING_CONFIG_LOADER, CustomizingConfigType, DynRouteConfig, DynToggleConfig } from "./customizing-loader.config";


@Injectable({
  providedIn: 'root'
})
export class CustomizingService {
  #config = new BehaviorSubject<CustomizingConfig>({
    routes: {},
    services: {},
    functions: {}
  });
  #configLoader = inject(CUSTOMIZING_CONFIG_LOADER);
  #injector = inject(Injector);

  reloadConfig(): void {
    this.#configLoader.subscribe(
      config => this.setConfig(config)
    );
  }

  setConfig(config: CustomizingConfig) {
    this.#config.next(config);
  }

  toggleActiveState(configType: CustomizingConfigType, key: string, path = ''): boolean {
    let state: DynRouteConfig | DynToggleConfig = { active: false };
    if (configType === 'routes') {
      state = this.#config.value[configType][key][path];
      this.#config.value[configType][key][path] = {
        ...state as DynRouteConfig,
        active: !state.active
      }
    } else {
      state = this.#config.value[configType][key] as DynRouteConfig;
      this.#config.value[configType][key] = {
        ...state,
        active: !state.active
      }
    }
    this.#config.next(this.#config.value);

    return !state.active;
  };

  getState(configType: 'routes', key: string, path: string): DynRouteConfig;
  getState(configType: CustomizingConfigType, key: string): DynToggleConfig;
  getState(configType: CustomizingConfigType, key: string, path = ''): DynRouteConfig | DynToggleConfig {
    return configType === 'routes' ?
      this.#config.value?.[configType]?.[key]?.[path] as DynRouteConfig :
      this.#config.value?.[configType]?.[key] as DynToggleConfig;
  }

  getState$(configType: 'routes', key: string, path: string): Observable<DynRouteConfig>;
  getState$(configType: CustomizingConfigType, key: string): Observable<DynToggleConfig>;
  getState$(configType: CustomizingConfigType, key: string, path = ''): Observable<DynRouteConfig | DynToggleConfig> {
    return this.#config.asObservable().pipe(
      configType === 'routes' ?
        map(config => config?.[configType]?.[key]?.[path] as DynRouteConfig) :
        map(config => config?.[configType]?.[key] as DynToggleConfig),
      filter(config => !!config),
      distinctUntilChanged()
    );
  }

  toggleService<S, T extends DynProviderType<S>>(token: T, key: string) {
    getAsyncModule<S>(key).then(
      esm => {
        this.toggleActiveState('services', key) ?
          token.set(this.#injector.get<S>(esm as ProviderToken<S>)) :
          token.reset();
      }
    );
  }
}

let customizingService = {} as CustomizingService;
function setCustomizingService(service: CustomizingService) {
  customizingService = service;
}
export function getCustomizingService(): CustomizingService {
  return customizingService;
}

export function provideCustomizingInitConfig(): Provider {
  return {
    provide: APP_INITIALIZER,
    useFactory: () => {
      const configLoader = inject(CUSTOMIZING_CONFIG_LOADER);
      const customizingService = inject(CustomizingService);
      setCustomizingService(customizingService);
      return () => configLoader.pipe(
        tap(config => customizingService.setConfig(config))
      );
    },
    multi: true
  };
}
