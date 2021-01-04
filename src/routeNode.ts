import { ChildRouteMap } from './routeFn';
import {
  ExtractParamsParserReturnTypes,
  InferParamGroups,
  OptionalParamNames,
  RequiredParamNames,
  RouteComponent,
  RouteOptions,
  SerializedParams,
  TemplateParserMap,
} from './types';

export type RouteNodeBase<
  T extends string,
  CRM extends ChildRouteMap<RO>,
  RO extends RouteOptions
> = {
  /**
   * The component for this route
   */
  component: RouteComponent;

  /**
   * Render this route including executing all react-typesafe-routes#RouteMiddleware | The RouteMiddlewares that may have been defined
   */
  render: () => RouteComponent;

  /**
   * The Route template including the query template
   */
  templateWithQuery: T;

  /**
   * The Route template for react-router-dom
   */
  template: string;

  /**
   * The full Route template including parent route
   */
  fullTemplate: string;

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

  /**
   * The RouteOptions for this route with inherited parent options
   */
  options: RO extends undefined ? undefined : Required<RO>;

  /**
   * The child routes of this route
   */
  children: CRM;

  /**
   * The child routes of this route
   */
  includeChildren: boolean;
};

/**
 * If the given RouteNode has Parameters
 * @internal
 */
export function isRouteNodeWithParams(
  node: any
): node is RouteNodeWithParams<any, any, any, any> {
  return node['paramsMap'] !== undefined;
}

export type RouteNodeWithParams<
  T extends string,
  TPM extends TemplateParserMap<T>,
  CRM extends ChildRouteMap<RO>,
  RO extends RouteOptions
> = RouteNodeBase<T, CRM, RO> & {
  paramsMap: TPM;
  parseParams: <G extends InferParamGroups<T>>(
    params: SerializedParams<RequiredParamNames<G>> &
      Partial<SerializedParams<OptionalParamNames<G>>>,
    strict?: boolean
  ) => ExtractParamsParserReturnTypes<TPM, RequiredParamNames<G>> &
    Partial<ExtractParamsParserReturnTypes<TPM, OptionalParamNames<G>>>;
} & (<G extends InferParamGroups<T>>(
    params: ExtractParamsParserReturnTypes<TPM, RequiredParamNames<G>> &
      Partial<ExtractParamsParserReturnTypes<TPM, OptionalParamNames<G>>>
  ) => {
    $: string;
  } & {
    [K in keyof CRM]: CRM[K];
  });

export type RouteNodeWithoutParams<
  T extends string,
  CRM extends ChildRouteMap<RO>,
  RO extends RouteOptions
> = RouteNodeBase<T, CRM, RO> &
  (() => {
    $: string;
  } & {
    [K in keyof CRM]: CRM[K];
  });

export type RouteNode<
  T extends string,
  TPM extends TemplateParserMap<T>,
  CRM extends ChildRouteMap<RO>,
  RO extends RouteOptions
> = keyof TemplateParserMap<T> extends never
  ? RouteNodeWithoutParams<T, CRM, RO>
  : RouteNodeWithParams<T, TPM, CRM, RO>;

export type AnyRouteNode =
  | RouteNodeWithoutParams<string, any, any>
  | RouteNodeWithParams<string, any, any, any>;

export type AnyOptionsRouteNode<RO extends RouteOptions> =
  | RouteNodeWithoutParams<string, any, RO>
  | RouteNodeWithParams<string, any, any, RO>;
