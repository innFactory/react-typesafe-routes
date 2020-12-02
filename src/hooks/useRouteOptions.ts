import { matchPath, useLocation } from 'react-router-dom';
import * as _ from 'lodash';
import { routerToRouteList } from '../utils/routerUtils';
import { OptionsRouterType } from '../router';
import { RouteOptions } from '../types';

export const useRouteOptions = <RO extends RouteOptions>(
  router: OptionsRouterType<RO>
): RO => {
  const { pathname, search } = useLocation();

  const location = pathname + search;

  const route = _.find(
    routerToRouteList<RO>(router, true),
    route =>
      matchPath(location, {
        path: route.parentTemplate + '/' + route.template,
      }) != null
  );

  return (route?.options as RO) ?? router.defaultOptions;
};
