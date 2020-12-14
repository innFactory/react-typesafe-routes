import { matchPath, useLocation } from 'react-router-dom';
import { routerToRouteList } from '../utils/routerUtils';
import { OptionsRouterType } from '../router';
import { RouteOptions } from '../types';

export const useRouteOptions = <RO extends RouteOptions>(
  router: OptionsRouterType<RO>
): RO => {
  const { pathname } = useLocation();

  const routeList = routerToRouteList<RO>(router, true);
  const route = routeList.filter(
    route =>
      matchPath(pathname, {
        path: route.fullTemplate,
      }) != null
  );

  return (route[0]?.options as RO) ?? router.defaultOptions;
};
