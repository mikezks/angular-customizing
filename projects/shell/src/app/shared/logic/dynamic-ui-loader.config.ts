import { HttpClient } from "@angular/common/http";
import { InjectionToken, inject } from "@angular/core";
import { CustomizingConfigType } from "@flight42/shared-customizing";
import { Observable } from "rxjs";


export interface ToggleDetails {
  label: string;
  active: boolean;
  text?: string;
}

export interface Toggle {
  key: string;
  label: string;
  toggle$?: Observable<ToggleDetails>;
}

export interface DynamicUiWidgetConfig {
  title: string;
  type: CustomizingConfigType;
  toggles: Toggle[];
}

export interface ToggleAction {
  fn: () => void;
  reload?: boolean;
};


export const DYNAMIC_UI_CONFIG_URL = new InjectionToken<string>(
  'DYNAMIC_UI_CONFIG_URL',
  {
    providedIn: 'root',
    factory: () => './assets/config/dynamic-ui.config.json'
  }
);

export function defaultDynamicUiConfigLoader(): Observable<DynamicUiWidgetConfig[]> {
  return inject(HttpClient).get<DynamicUiWidgetConfig[]>(inject(DYNAMIC_UI_CONFIG_URL));
}

export const DYNAMIC_UI_CONFIG_LOADER = new InjectionToken<Observable<DynamicUiWidgetConfig[]>>(
  'DYNAMIC_UI_CONFIG_LOADER',
  {
    providedIn: 'root',
    factory: defaultDynamicUiConfigLoader
  }
);
