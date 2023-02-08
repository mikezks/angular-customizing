import { HttpClient } from "@angular/common/http";
import { inject, InjectionToken } from "@angular/core";
import { Observable } from "rxjs";

export type CustomizingConfigType = 'routes' | 'services' | 'functions';
export type CustomizingRouteConfigType = 'routes' | 'component' | 'html' | 'card';

export interface DynToggleConfig {
  active: boolean;
}

export interface DynRouteConfig extends DynToggleConfig {
  type: CustomizingRouteConfigType;
  source: string[];
}

export interface CustomizingConfig {
  routes: Record<string, Record<string, DynRouteConfig>>;
  services: Record<string, DynToggleConfig>;
  functions: Record<string, DynToggleConfig>;
}

export const CUSTOMIZING_CONFIG_URL = new InjectionToken<string>(
  'CUSTOMIZING_CONFIG_URL',
  {
    providedIn: 'root',
    factory: () => './assets/config/customizing.config.json'
  }
);

export function defaultCustomizingConfigLoader(): Observable<CustomizingConfig> {
  return inject(HttpClient).get<CustomizingConfig>(inject(CUSTOMIZING_CONFIG_URL));
}

export const CUSTOMIZING_CONFIG_LOADER = new InjectionToken<Observable<CustomizingConfig>>(
  'CUSTOMIZING_CONFIG_LOADER',
  {
    providedIn: 'root',
    factory: defaultCustomizingConfigLoader
  }
);
