import { APP_INITIALIZER, inject, Injectable, Provider } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DynFlightService } from '@flight42/logic-flight';
import { CustomizingService } from '@flight42/shared-customizing';
import { BehaviorSubject, map, tap } from 'rxjs';
import { DynamicUiWidgetConfig, DYNAMIC_UI_CONFIG_LOADER, ToggleAction } from './dynamic-ui-loader.config';


@Injectable({
  providedIn: 'root'
})
export class DynamicUiService {
  #router = inject(Router);
  #route = inject(ActivatedRoute);
  #flightService = inject(DynFlightService);
  #customizingService = inject(CustomizingService);
  #configLoader = inject(DYNAMIC_UI_CONFIG_LOADER);
  #widgets$ = new BehaviorSubject<DynamicUiWidgetConfig[]>([]);
  state$ = this.#getWidgetConfig$();

  reloadConfig(): void {
    this.#configLoader.subscribe(
      config => this.setConfig(config)
    );
  }

  setConfig(config: DynamicUiWidgetConfig[]) {
    this.#widgets$.next(config);
  }

  #actions: Record<string, ToggleAction> = {
    'booking.ticket': { fn: () => this.#customizingService.toggleActiveState('routes', 'booking', 'ticket') },
    'booking/flight.search': { fn: () => this.#customizingService.toggleActiveState('routes', 'booking/flight', 'search') },
    'booking/flight.edit': { fn: () => this.#customizingService.toggleActiveState('routes', 'booking/flight', 'edit') },
    'booking/passenger.search': { fn: () => this.#customizingService.toggleActiveState('routes', 'booking/passenger', 'search') },
    'service-flight': { fn: () => this.#customizingService.toggleService(this.#flightService, 'service-flight'), reload: false },
    'fn-validate-passenger-status': { fn: () => this.#customizingService.toggleActiveState('functions', 'fn-validate-passenger-status'), reload: false }
  };

  #transformStateToText(active: boolean, text: string) {
    return `${ text }: ${ active ? 'default' : 'custom' }`;
  }

  #getWidgetConfig$() {
    return this.#widgets$.pipe(
      map(widgets => widgets.map(widget => ({
        ...widget,
        toggles: widget.toggles.map(toggle => ({
          ...toggle,
          toggle$: (widget.type === 'routes' ?
              this.#customizingService.getState$(widget.type, toggle.key.split('.')[0], toggle.key.split('.')[1]) :
              this.#customizingService.getState$(widget.type, toggle.key.split('.')[0])
            ).pipe(
              map(config => ({
                label: toggle.label,
                active: config.active,
                text: this.#transformStateToText(config.active, toggle.label)
              }))
            )
        }))
      })))
    );
  }

  toggle(key: string): void {
    this.#actions[key]?.fn?.();
    this.#actions[key].reload !== false && this.#router.navigate(this.#route.snapshot.url);
  }
}


export function provideDynamicUiInitConfig(): Provider {
  return {
    provide: APP_INITIALIZER,
    useFactory: () => {
      const configLoader = inject(DYNAMIC_UI_CONFIG_LOADER);
      const dynamicUiService = inject(DynamicUiService);
      return () => configLoader.pipe(
        tap(config => dynamicUiService.setConfig(config))
      );
    },
    multi: true
  };
}
