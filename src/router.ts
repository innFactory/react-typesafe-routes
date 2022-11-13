import { ChildRouteMap, RouteFn } from './routeFn';
import { RouteOptions } from './types';

type RoutesFn<RO extends RouteOptions, CRM extends ChildRouteMap<RO>> = (
  route: RouteFn<RO>
) => CRM;

export type OptionsRouterFn = <
  RO extends RouteOptions,
  CRM extends ChildRouteMap<RO>
>(
  options: Required<RO>,
  routes: RoutesFn<RO, CRM>
) => RouterType<RO, CRM>;

export type RouterType<
  RO extends RouteOptions,
  CRM extends ChildRouteMap<RO>
> = RO extends undefined
  ? {
      [K in keyof CRM]: CRM[K];
    }
  : {
      [key: string]: never;
    } & {
      defaultOptions: RO;
    } & {
        [K in keyof CRM]: CRM[K];
      };

export type RouterFn = <CRM extends ChildRouteMap<undefined>>(
  routes: RoutesFn<undefined, CRM>
) => RouterType<undefined, CRM>;
