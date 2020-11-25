import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { AnyRouter } from '..';
import { routerToRouteList } from '../utils/routerUtils';

interface Props {
  router: AnyRouter;
}

export function RouterSwitch(props: Props) {
  const { router } = props;

  return (
    <Switch>
      {routerToRouteList(router).map((route, index) => (
        <Route
          key={index}
          path={`/${route.template}`}
          component={(route.render() as any)()}
        />
      ))}
    </Switch>
  );
}
