import {
  TemplateParserMap,
  RouteOptions,
  RouteComponent,
  RouteMiddleware,
} from './types';

type RouteFnArgsWithParams<
  T extends string,
  TPM extends TemplateParserMap<T>,
  RO extends RouteOptions
> = RouteFnBaseArgs<RO> & {
  params: TPM;
};

export function isRouteArgsWithParams(
  args: any
): args is RouteFnArgsWithParams<any, any, any> {
  return args['params'] !== undefined;
}

export type RouteFnArgs<
  T extends string,
  TPM extends TemplateParserMap<T>,
  RO extends RouteOptions
> = keyof TemplateParserMap<T> extends never
  ? RouteFnBaseArgs<RO>
  : RouteFnArgsWithParams<T, TPM, RO>;

type RouteFnBaseArgs<RO extends RouteOptions> = {
  /**
   * The Component to be rendered on this route.
   */
  component: RouteComponent;

  /**
   * A middleware for this Route.
   */
  middleware?: RouteMiddleware;

  /**
   * Global options for this Route.
   */
  options?: Partial<RO>;

  /**
   * Wether or not to include this Routes child routes in a RouterSwitch.
   *
   * @default true
   */
  includeChildren?: boolean;

  /**
   * Wether or not this route is exact
   *
   * @default true
   */
  exact?: boolean;
};
