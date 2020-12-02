import {
  TemplateParserMap,
  RouteMiddleware,
  RouteOptions,
  RoutePage,
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
   * The Page to be rendered on this route.
   */
  page: RoutePage;

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
   * Defaults to true.
   */
  includeChildren?: boolean;
};
