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
  parentTemplate: string;
  component: RouteComponent;
  render: () => RouteComponent;
  templateWithQuery: T;
  template: string;
  options: RO extends undefined ? undefined : Required<RO>;
  children: CRM;
  includeChildren: boolean;
}; // & { [K in keyof CRM]: CRM[K] };

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
