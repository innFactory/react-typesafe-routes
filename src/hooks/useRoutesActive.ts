import { matchPath, useLocation } from 'react-router-dom';
import { ChildRouteMap } from '../routeFn';

export const useRoutesActive = <CRM extends ChildRouteMap<any>>(
  routes: CRM,
  strict?: boolean
): { [K in keyof CRM]: boolean } => {
  const { pathname } = useLocation();
  const re: { [key: string]: boolean } = {};

  for (const [key, value] of Object.entries(routes)) {
    re[key] =
      matchPath(pathname, {
        path: value.fullTemplate,
        strict: strict ?? true,
      }) != null;
  }

  return re as any;
};
