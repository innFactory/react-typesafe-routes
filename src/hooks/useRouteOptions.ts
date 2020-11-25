import { matchPath, useLocation } from 'react-router-dom';
import { OptionsRouter, RouteOptions } from '..';
import * as _ from 'lodash';
import { routerToRouteList } from '../utils/routerUtils';

export const useRouteOptions = <RO extends RouteOptions>(
  router: OptionsRouter<RO>
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
