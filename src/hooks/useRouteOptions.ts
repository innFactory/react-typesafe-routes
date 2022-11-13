/**
 * This file contains the useRouteOptions hook.
 *
 * @packageDocumentation
 * @module react-typesafe-routes
 */
import { matchPath, useLocation } from 'react-router-dom';
import { RouterType } from '../router';
import { RouteOptions } from '../types';
import { optionsRouterToRouteList } from '../utils/routerUtils';

/**
 * Returns the {@link RouteOptions} of the given {@link OptionsRouter}
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
  router: RouterType<RO, any>
): RO => {
  const { pathname } = useLocation();

  const routeList = optionsRouterToRouteList<RO>(router);

  // exclude wildcard route from list
  const route = routeList
    .filter(r => r.fullTemplate !== '/*')
    .filter(
      route =>
        matchPath(
          {
            path: route.fullTemplate,
            caseSensitive: true,
          },
          pathname
        ) != null
    );

  // if route is empty, the options of the wildcard route would be returned or if undefined the defaultOptions will be returned
  if (route.length === 0) {
    const wildCard = routeList.filter(r => r.fullTemplate === '/*');
    if (wildCard.length === 1) {
      return (wildCard[0]?.options as RO) ?? router.defaultOptions;
    }
  }

  return (route[0]?.options as RO) ?? router.defaultOptions;
};
