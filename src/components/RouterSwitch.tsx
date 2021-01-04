import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { AnyRouterType } from '../router';
import { anyRouterToRouteList } from '../utils/routerUtils';

/**
 * Props for a RouterSwitch
 */
interface RouterSwitchProps {
  router: AnyRouterType;
}

/**
 * react-router-dom Switch wrapper that creates Route components for every route defined in the given router
 *
 * @param props - Props containing the router to use
 */
export const RouterSwitch = (props: RouterSwitchProps) => {
  return (
    <Switch>
      {anyRouterToRouteList(props.router).map((route, index) => {
        const Component = route.render();
        return (
          <Route
            key={index}
            path={route.fullTemplate}
            exact={route.exact}
            strict={route.strict}
            sensitive={route.sensitive}
            component={Component}
          />
        );
      })}
    </Switch>
  );
};
