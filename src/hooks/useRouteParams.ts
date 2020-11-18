import { IParseOptions, parse } from 'qs';
import { useLocation, useParams } from 'react-router-dom';
import { RouteNodeWithParams } from '..';

export const useRouteParams = <
  T extends RouteNodeWithParams<string, any, any, any>
>(
  r: T,
  o: IParseOptions = {}
): ReturnType<T['parseParams']> => {
  const { search } = useLocation();
  return r.parseParams({
    ...useParams(),
    ...parse(search, { ignoreQueryPrefix: true, ...o }),
  }) as any;
};
