import { LoadRemoteModuleOptions } from "@angular-architects/module-federation-runtime";
import { HttpClient } from "@angular/common/http";
import { InjectionToken, inject } from "@angular/core";
import { Observable } from "rxjs";


export interface DiscoveryLoadConfig {
  [key: string]: LoadRemoteModuleOptions
};

export const DISCOVERY_CONFIG_URL = new InjectionToken<string>(
  'DISCOVERY_CONFIG_URL',
  {
    providedIn: 'root',
    factory: () => './assets/config/discovery.config.json'
  }
);

export function defaultDiscoveryConfigLoader(): Observable<DiscoveryLoadConfig> {
  return inject(HttpClient).get<DiscoveryLoadConfig>(inject(DISCOVERY_CONFIG_URL));
}

export const DISCOVERY_CONFIG_LOADER = new InjectionToken<Observable<DiscoveryLoadConfig>>(
  'DISCOVERY_CONFIG_LOADER',
  {
    providedIn: 'root',
    factory: defaultDiscoveryConfigLoader
  }
);
