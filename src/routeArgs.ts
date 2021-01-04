import {
  TemplateParserMap,
  RouteOptions,
  RouteComponent,
  RouteMiddleware,
} from './types';

/**
 * RouteFnArgs with Paramers.
 *
 * @typeParam T - The routes template string
 * @typeParam TPM - The map of template parsers
 * @typeParam RO - The RouteOptions type
 *
 * @internal
 */
type RouteFnArgsWithParams<
  T extends string,
  TPM extends TemplateParserMap<T>,
  RO extends RouteOptions
> = RouteFnBaseArgs<RO> & {
  params: TPM;
};

/**
 * If the given RouteFnArgs has Parameters
 * @internal
 */
export function isRouteArgsWithParams(
  args: any
): args is RouteFnArgsWithParams<any, any, any> {
  return args['params'] !== undefined;
}

/**
 * The Route Function Arguments including required parameters if the template contains parameters
 *
 * @typeParam T - The routes template string
 * @typeParam TPM - The map of template parsers
 * @typeParam RO - The RouteOptions type
 */
export type RouteFnArgs<
  T extends string,
  TPM extends TemplateParserMap<T>,
  RO extends RouteOptions
> = keyof TemplateParserMap<T> extends never
  ? RouteFnBaseArgs<RO>
  : RouteFnArgsWithParams<T, TPM, RO>;

/**
 * The Base Route Function Arguments
 */
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
   * Include this Routes child routes in a RouterSwitch.
   *
   * @defaultValue true
   */
  includeChildren?: boolean;

  /**
   * When true, will only match if the path matches the location.pathname exactly.
   *
   * @remark
   * Taken from https://reactrouter.com/web/api/Route/exact-bool
   *
   * @defaultValue true
   */
  exact?: boolean;

  /**
   * When true, a path that has a trailing slash will only match a location.pathname
   * with a trailing slash. This has no effect when there are additional URL segments in the location.pathname.
   *
   * @remark
   * Taken from https://reactrouter.com/web/api/Route/strict-bool
   *
   * @defaultValue false
   */
  strict?: boolean;

  /**
   * When true, will match if the path is case sensitive.
   *
   * @remark
   * Taken from https://reactrouter.com/web/api/Route/sensitive-bool
   *
   * @defaultValue false
   */
  sensitive?: boolean;
};
