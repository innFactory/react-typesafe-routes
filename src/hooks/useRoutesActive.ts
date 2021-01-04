import { matchPath, useLocation } from 'react-router-dom';
import { ChildRouteMap } from '../routeFn';

/**
 * Returns an object with true or false for all the given routes depending
 * on wether or not they are active
 *
 * @example
 * ```tsx
 * const router = Router(route => ({
 *  login: route('login', { component: Login }),
 *  home: route('home', { component: Home }),
 * }));
 *
 * const { home, about } = useRoutesActive({
 *  home: router.home,
 *  about: router.about,
 * });
 * ```
 *
 * `/home: { home: true, about: false }`
 *
 * @typeParam CRM - The Map of RouteNodes
 * @param routes - The RouteNodes to use.
 * @param options   Override strict and exact of the given route
 *
 * @returns         An Object with the given `routes` as keys and a boolean
 *                  for each indicating wether or not the route is active
 */
export const useRoutesActive = <CRM extends ChildRouteMap<any>>(
  routes: CRM,
  options?: {
    strict?: boolean;
    exact?: boolean;
  }
): { [K in keyof CRM]: boolean } => {
  const { pathname } = useLocation();

  return Object.entries(routes)
    .map(v => ({
      [v[0]]:
        matchPath(pathname, {
          path: v[1].fullTemplate,
          strict: options?.strict ?? v[1].strict,
          exact: options?.exact ?? v[1].exact,
        }) != null,
    }))
    .reduce((v, c) => Object.assign(v, c)) as any;
};
