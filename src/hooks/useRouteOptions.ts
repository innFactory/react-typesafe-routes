// file1.ts
/**
 * This file contains the useRouteOptions hook.
 *
 * @packageDocumentation
 * @module react-typesafe-routes
 */
import { matchPath, useLocation } from 'react-router-dom';
import { routerToRouteList } from '../utils/routerUtils';
import { OptionsRouterType } from '../router';
import { RouteOptions } from '../types';

/**
 * Returns the RouteOptions} of the given {@link OptionsRouter
 * with all values being non-null.
 *
 * @example
 * ```tsx
 * const router = OptionsRouter({ appBar: true }, route => ({
 *  login: route('login', {
 *    component: Login,
 *    options: { appBar: false }
 *  }),
 *  home: route('home', {
 *    component: Home,
 *  }),
 * }));
 *
 * const { appBar } = useRouteOptions(router);
 * ```
 *
 * `/login - appBar: false`
 *
 * `/home - appBar: true`
 *
 *
 * @typeParam RO    The RouteOptions of the `router`
 * @param router    The OptionsRouter to use.
 *
 * @returns         Non-null RouteOptions for the currently active Route
 */
export const useRouteOptions = <RO extends RouteOptions>(
  router: OptionsRouterType<RO>
): RO => {
  const { pathname } = useLocation();

  const routeList = routerToRouteList<RO>(router, true);
  const route = routeList.filter(
    route => matchPath(pathname, route.fullTemplate) != null
  );

  return (route[0]?.options as RO) ?? router.defaultOptions;
};
