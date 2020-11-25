import {
  AnyOptionsRouteNode,
  AnyRouteNode,
  AnyRouterType,
  ChildRouteMap,
  OptionsRouterType,
  RouteOptions,
} from '..';

export function routerToRouteList<RO extends RouteOptions>(
  router: OptionsRouterType<RO>,
  forceChildRoutes = false
): AnyOptionsRouteNode<RO>[] {
  return flattenRouteList(
    Object.entries<AnyOptionsRouteNode<RO>>(router)
      .filter(val => val[0] !== 'defaultOptions')
      .map(val => val[1]),
    forceChildRoutes
  );
}

export function anyRouterToRouteList(
  router: AnyRouterType,
  forceChildRoutes = false
): AnyRouteNode[] {
  return flattenRouteList(
    Object.entries<AnyRouteNode>(router)
      .filter(val => val[0] !== 'defaultOptions')
      .map(val => val[1]),
    forceChildRoutes
  );
}

function flattenRouteMap<RO extends RouteOptions = any>(
  routeMap: ChildRouteMap<RO>,
  forceChildRoutes = false
): AnyOptionsRouteNode<RO>[] {
  return Object.entries(routeMap).flatMap<AnyOptionsRouteNode<RO>>(val => {
    if (val[1].includeChildren || forceChildRoutes) {
      if (
        typeof val[1].children === 'object' &&
        Object.entries(val[1].children).length > 0
      ) {
        return [val[1], ...flattenRouteMap<RO>(val[1].children)];
      }
    }
    return [val[1]];
  });
}

function flattenRouteList<RO extends RouteOptions = any>(
  routes: AnyOptionsRouteNode<RO>[],
  forceChildRoutes = false
): AnyOptionsRouteNode<RO>[] {
  return routes.flatMap<AnyOptionsRouteNode<RO>>(val => {
    if (val.includeChildren || forceChildRoutes) {
      if (
        typeof val.children === 'object' &&
        Object.entries(val.children).length > 0
      ) {
        return [val, ...flattenRouteMap<RO>(val.children)];
      }
    }
    return [val];
  });
}
