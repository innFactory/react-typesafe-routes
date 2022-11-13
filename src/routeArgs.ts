import {
  ActionFunction,
  LoaderFunction,
  ShouldRevalidateFunction,
} from 'react-router-dom';
import { RouteNodeRouteObject } from './routeNode';
import { TemplateParserMap, RouteOptions, RouteElement } from './types';

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
   * The element to render when the route matches the URL.
   *
   * See https://reactrouter.com/en/main/route/route#element
   */
  element: RouteElement;

  /**
   * Defining a layout Element implicitly wraps the route in a layout route.
   *
   * e.g.
   * ```tsx
   * {
   *  element: <Page />,
   *  layout: <Layout />
   * }
   * // is equivalent to
   * <Route layout={<Layout />}>
   *   <Route element={<Page />} />
   * </Route>
   * ```
   *
   * See https://reactrouter.com/en/main/route/route#layout-routes
   */
  layout?: RouteNodeRouteObject;

  /**
   * Adds an index route to this routes children.
   *
   * See https://reactrouter.com/en/main/start/tutorial#index-routes
   * and https://reactrouter.com/en/main/guides/index-route
   */
  index?: RouteNodeRouteObject;

  /**
   * Global options for this Route.
   */
  options?: Partial<RO>;

  /**
   * See https://reactrouter.com/en/main/route/loader
   */
  loader?: LoaderFunction;

  /**
   * See https://reactrouter.com/en/main/route/route#casesensitive
   */
  caseSensitive?: boolean;

  /**
   * See https://reactrouter.com/en/main/route/action
   */
  action?: ActionFunction;

  /**
   * See https://reactrouter.com/en/main/route/error-element
   */
  errorElement?: JSX.Element;

  /**
   * See https://reactrouter.com/en/main/route/should-revalidate
   */
  shouldRevalidate?: ShouldRevalidateFunction;
};
