import { useLocation } from 'react-router-dom';
import { ChildRouteMap, OptionsRouter, RouteOptions } from '..';

export const useRouteOptions = <
  RO extends RouteOptions,
  CRM extends ChildRouteMap<RO>
>(
  router: OptionsRouter<RO, CRM>
): RO => {
  const { search } = useLocation();

  return (search as any) || router.defaultOptions;
};
