import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { AnyRouterType } from '../router';
import { anyRouterToRouteList } from '../utils/routerUtils';

interface Props {
  router: AnyRouterType;
}

export function RouterSwitch(props: Props) {
  const { router } = props;

  return (
    <Switch>
      {anyRouterToRouteList(router).map((route, index) => {
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
}
