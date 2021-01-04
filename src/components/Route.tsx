import * as React from 'react';
import { Route as OriginalRoute, RouteProps } from 'react-router-dom';
import { AnyRouteNode } from '../routeNode';

/**
 * Wrapper component for the `react-router-dom` Route adding
 * a `to` propto accept a `RouteNode` for convenience. It
 * uses the full route template including parent paths.
 * It also applies `strict`, `sensitive` and `exact` setting of the given `route`.
 *
 * @remark
 * `path` prop overrides the given routes template
 *
 * @see [https://reactrouter.com/web/api/Route](https://reactrouter.com/web/api/Route)
 *
 * @example
 * ```tsx
 * const router = Router(route => ({
 *  login: route('login', { component: Login }),
 *  home: route('home', { component: Home }),
 * }));
 *
 * <Route to={router.home} />
 * ```
 */
export const Route = (
  p: RouteProps & {
    to?: AnyRouteNode;
  }
) => (
  <OriginalRoute
    {...p}
    path={p.to?.fullTemplate ?? p.path}
    strict={p.to?.strict ?? p.strict ?? false}
    exact={p.to?.exact ?? p.exact ?? false}
    sensitive={p.to?.sensitive ?? p.sensitive ?? false}
  />
);
