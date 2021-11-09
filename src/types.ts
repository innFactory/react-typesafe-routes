import { ParamParser } from "./paramParser";

/**
 * The React Component for a Route
 */
export type RouteComponent = React.ReactElement;

export type RouteOptions = Record<string, any> | undefined;

export type RouteMiddleware = (
next: RouteComponent
) =>  RouteComponent;

type InferParam<T extends string, M extends [string, string]> =
  T extends `:${infer O}?` ? [M[0], M[1] | O]
  : T extends `:${infer O}*` ? [M[0], M[1] | O]
  : T extends `:${infer O}+` ? [M[0] | O, M[1]]
  : T extends `:${infer O}` ? [M[0] | O, M[1]]
  : M;

export type InferParamGroups<P extends string> =
  P extends `${infer A}/${infer B}` ? InferParam<A, InferParamGroups<B>>
  : P extends `${infer A}&${infer B}` ? InferParam<A, InferParamGroups<B>>
  : InferParam<P, [never, never]>;

type MergeParamGroups<G extends [string, string]> = G[0] | G[1];

export type RequiredParamNames<G extends [string, string]> = G[0];

export type OptionalParamNames<G extends [string, string]> = G[1];

export type SerializedParams<K extends string = string> = Record<K, string>;

export type RawParams = Record<string, unknown>;

export type ParamsParserMap<K extends string> = Record<K, ParamParser<any>>;

export type TemplateParserMap<T extends string> = ParamsParserMap<MergeParamGroups<InferParamGroups<T>>>;

export type ExtractParamsParserReturnTypes<
  P extends ParamsParserMap<any>,
  F extends keyof P,
  > = {
    [K in F]: ReturnType<P[K]["parse"]>;
  }