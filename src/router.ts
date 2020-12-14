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
) => OptionsRouterType<RO, CRM>;

export type OptionsRouterType<
  RO extends RouteOptions,
  CRM extends ChildRouteMap<RO> = any
> = {
  [key: string]: never;
} & {
  defaultOptions: RO;
} & {
    [K in keyof CRM]: CRM[K];
  };

export type RouterFn = <CRM extends ChildRouteMap<undefined>>(
  routes: RoutesFn<undefined, CRM>
) => RouterType<CRM>;

export type RouterType<CRM extends ChildRouteMap<undefined>> = {
  [K in keyof CRM]: CRM[K];
};

export type AnyRouterType = OptionsRouterType<any, any> | RouterType<any>;
