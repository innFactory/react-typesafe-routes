import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { AnyRouterType } from '..';
import { anyRouterToRouteList } from '../utils/routerUtils';

interface Props {
  router: AnyRouterType;
}

export function RouterSwitch(props: Props) {
  const { router } = props;

  return (
    <Switch>
      {anyRouterToRouteList(router).map((route, index) => (
        <Route
          key={index}
          path={`/${route.template}`}
          component={(route.render() as any)()}
        />
      ))}
    </Switch>
  );
}
