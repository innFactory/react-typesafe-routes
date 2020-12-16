import { matchPath, useLocation } from 'react-router-dom';
import { AnyRouteNode } from '../routeNode';

export const useRouteActive = (
  route: AnyRouteNode,
  strict?: boolean
): boolean => {
  const { pathname } = useLocation();
  return (
    matchPath(pathname, {
      path: route.fullTemplate,
      strict: strict ?? true,
    }) != null
  );
};
