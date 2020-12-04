import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { AnyRouterType } from '../router';
import { anyRouterToRouteList } from '../utils/routerUtils';

export const RouterSwitch = (props: { router: AnyRouterType }) => {
  return (
    <Switch>
      {anyRouterToRouteList(props.router).map((route, index) => {
        const Component = route.render();
        return (
          <Route key={index} path={`/${route.template}`}>
            <Component />
          </Route>
        );
      })}
    </Switch>
  );
};
