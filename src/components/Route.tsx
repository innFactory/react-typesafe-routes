import * as React from 'react';
import { Route as OriginalRoute, RouteProps } from 'react-router-dom';
import { AnyRouteNode } from '../routeNode';

export const Route = (
  p: RouteProps & {
    to?: AnyRouteNode;
  }
) => <OriginalRoute {...p} path={p.to ? p.to.fullTemplate : p.path} />;
