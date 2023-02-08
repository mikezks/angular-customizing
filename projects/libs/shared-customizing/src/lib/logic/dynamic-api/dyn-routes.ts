import { Provider } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  BaseRouteReuseStrategy,
  Route,
  RouteReuseStrategy,
  UrlMatchResult,
  UrlSegment,
  UrlSegmentGroup
} from '@angular/router';
import { getCustomizingService } from "../customizing/customizing.service";
import { getAsyncModule } from "../discovery/discovery.service";
import { CustomizingRouteConfigType } from "../customizing/customizing-loader.config";
import { DynComponentFactory, CardComponentFactory } from "./dyn-component";

const ROOT_SCOPE = '[root]';

const configToRoute: Record<CustomizingRouteConfigType, (...args: any[]) => Partial<Route>> = {
  routes: (key: string) => ({
    children: [{
      path: '',
      loadChildren: () => getAsyncModule(key)
    }]
  }),
  component: (key: string) => ({
    loadComponent: () => getAsyncModule(key)
  }),
  html: (content: string) => ({
    component: DynComponentFactory(content),
    children: [{ path: '**', children: [] }]
  }),
  card: (title: string, content: string) => ({
    component: CardComponentFactory(title, content),
    children: [{ path: '**', children: [] }]
  })
};

const dynRouteMap: Record<string, Record<string, Partial<Route>>> = {};

export function matchDynamicRoutes() {
  const matcher = (
    segments: UrlSegment[],
    group: UrlSegmentGroup,
    route: Route
  ): UrlMatchResult | null => {
    const config = getCustomizingService();
    const scope = segments === group.segments ? ROOT_SCOPE :
      group.segments.slice(
        0, group.segments.length - segments.length
      ).map(s => s.toString()).join('/');
    const path = segments[0]?.toString();
    const dynRouteConfig = config.getState('routes', scope, path);
    dynRouteMap[scope] = dynRouteMap[scope] || {};
    if (! dynRouteMap[scope][path]) {
      dynRouteMap[scope][path] = configToRoute?.[dynRouteConfig?.type]?.(...dynRouteConfig?.source);
    }
    const dynRoute = dynRouteMap[scope][path];

    if (dynRoute && dynRouteConfig.active) {
      Object.keys(route).forEach(
        key => key !== 'matcher' && (delete (route as Record<string, unknown>)[key])
      );
      const { path, matcher, ...routeProps } = dynRoute;
      Object.assign(route, routeProps);

      return {
        consumed: [segments[0]]
      };
    }

    return null;
  };

  return {
    matcher,
    children: []
  };
}

export function provideMatcherComponentReuse(): Provider {
  return {
    provide: RouteReuseStrategy,
    useClass: class extends BaseRouteReuseStrategy {
      override shouldReuseRoute = (
        future: ActivatedRouteSnapshot,
        curr: ActivatedRouteSnapshot
      ) => future.toString() !== curr.toString()
    }
  };
}
