import { matchPath, useLocation } from 'react-router-dom';
import { AnyRouteNode } from '../routeNode';

/**
 * Returns true if the given route is currently active
 *
 * @example
 * ```tsx
 * const router = Router(route => ({
 *  login: route('login', { component: Login }),
 *  home: route('home', { component: Home }),
 * }));
 *
 * const active = useRouteActive(router.login);
 * ```
 *
 * @param route     The RouteNode to use.
 * @param options   Override strict and exact of the given route
 *
 * @returns         true if the given `route` is active or false if not
 */
export const useRouteActive = (
  route: AnyRouteNode,
  options?: {
    strict?: boolean;
    exact?: boolean;
  }
): boolean => {
  const { pathname } = useLocation();
  return (
    matchPath(pathname, {
      path: route.fullTemplate,
      strict: options?.strict ?? route.strict,
      exact: options?.exact ?? route.exact,
    }) != null
  );
};
