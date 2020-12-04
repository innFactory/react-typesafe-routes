import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { AnyRouterType } from '../router';
import { anyRouterToRouteList } from '../utils/routerUtils';

export const RouterSwitch = (props: { router: AnyRouterType }) => {
  return (
    <Switch>
      {anyRouterToRouteList(props.router).map((route, index) => {
        return (
          <Route
            key={index}
            path={`/${route.template}`}
            render={route.render() as any}
          />
        );
      })}
    </Switch>
  );
};
