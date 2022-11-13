import {
  ActionFunction,
  LoaderFunction,
  ShouldRevalidateFunction,
} from 'react-router-dom';
import { ChildRouteMap } from './routeFn';
import {
  ExtractParamsParserReturnTypes,
  InferParamGroups,
  OptionalParamNames,
  RequiredParamNames,
  RouteElement,
  RouteOptions,
  SerializedParams,
  TemplateParserMap,
} from './types';

export type RouteNodeRouteObject = {
  /**
   * The component for this route
   */
  element: RouteElement;

  /**
   * The element for the index route
   */
  index?: RouteNodeRouteObject;

  /**
   * The element for the index route
   */
  layout?: RouteNodeRouteObject;

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

export type RouteNodeBase<
  T extends string,
  CRM extends ChildRouteMap<RO>,
  RO extends RouteOptions
> = {
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
   * The RouteOptions for this route with inherited parent options
   */
  options: RO extends undefined ? undefined : Required<RO>;

  /**
   * The child routes of this route
   */
  children: CRM;

  layout: RouteNodeRouteObject | undefined;

  index: RouteNodeRouteObject | undefined;
} & RouteNodeRouteObject;

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
      Partial<SerializedParams<OptionalParamNames<G>>>
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
