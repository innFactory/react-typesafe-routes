import { RouteObject } from 'react-router-dom';
import { AnyRouteNode, RouteNodeRouteObject } from './routeNode';
import { RouterType } from './router';
import { anyRouterToRouteList } from './utils/routerUtils';

export const createRouteObjectsFromRouter = (
  router: RouterType<any, any>
): RouteObject[] => {
  const routes = anyRouterToRouteList(router);

  return routes.map(routeNodeToRouteObject);
};

function routeNodeToRouteObject(route: AnyRouteNode): RouteObject {
  const routeObject = routeNodeRouteObjectToRouteObject(route, {
    path: route.template,
  });
  const children: RouteObject[] = [];

  if (route.index !== undefined) {
    children.push(
      routeNodeRouteObjectToRouteObject(route.index, {
        index: true,
      })
    );
  }

  if (route.children !== undefined) {
    children.push(
      ...Object.values<AnyRouteNode>(route.children).map(routeNodeToRouteObject)
    );
  }

  routeObject.children = children;

  if (route.layout !== undefined) {
    const layoutObject = routeNodeRouteObjectToRouteObject(route.layout);
    layoutObject.children = [routeObject];
    return layoutObject;
  }

  return routeObject;
}

const routeNodeRouteObjectToRouteObject = (
  route: RouteNodeRouteObject,
  additional: Partial<RouteObject> = {}
): RouteObject => {
  return {
    action: route.action,
    caseSensitive: route.caseSensitive,
    element: route.element(),
    errorElement: route.errorElement,
    loader: route.loader,
    shouldRevalidate: route.shouldRevalidate,
    ...additional,
  };
};
