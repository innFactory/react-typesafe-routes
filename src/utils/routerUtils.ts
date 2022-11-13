import { ChildRouteMap } from '../routeFn';
import { AnyOptionsRouteNode, AnyRouteNode } from '../routeNode';
import { RouterType } from '../router';
import { RouteOptions } from '../types';

export function optionsRouterToRouteList<RO extends RouteOptions>(
  router: RouterType<RO, any>
): AnyOptionsRouteNode<RO>[] {
  return flattenRouteList(
    Object.entries<AnyOptionsRouteNode<RO>>(router)
      .filter(val => val[0] !== 'defaultOptions')
      .map(val => val[1])
  );
}

export function anyRouterToRouteList(
  router: RouterType<any, any>
): AnyRouteNode[] {
  return Object.entries<AnyRouteNode>(router)
    .filter(val => val[0] !== 'defaultOptions')
    .map(val => val[1]);
}

function flattenRouteMap<RO extends RouteOptions = any>(
  routeMap: ChildRouteMap<RO>
): AnyOptionsRouteNode<RO>[] {
  return Object.entries(routeMap).flatMap<AnyOptionsRouteNode<RO>>(val => {
    if (
      typeof val[1].children === 'object' &&
      Object.entries(val[1].children).length > 0
    ) {
      return [val[1], ...flattenRouteMap<RO>(val[1].children)];
    }

    return [val[1]];
  });
}

function flattenRouteList<RO extends RouteOptions = any>(
  routes: AnyOptionsRouteNode<RO>[]
): AnyOptionsRouteNode<RO>[] {
  return routes.flatMap<AnyOptionsRouteNode<RO>>(val => {
    if (
      typeof val.children === 'object' &&
      Object.entries(val.children).length > 0
    ) {
      return [val, ...flattenRouteMap<RO>(val.children)];
    }

    return [val];
  });
}
