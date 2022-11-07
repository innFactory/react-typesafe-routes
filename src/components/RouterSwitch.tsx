import * as React from 'react';
import { Route, Routes } from 'react-router-dom';
import { AnyRouterType } from '../router';
import { RouteComponent } from '../types';
import { anyRouterToRouteList } from '../utils/routerUtils';

/**
 * Props for a RouterSwitch
 */
interface RouterSwitchProps {
  router: AnyRouterType;
  frame?: React.ReactElement;
}

/**
 * react-router-dom Switch wrapper that creates Route components for every route defined in the given router
 *
 * @param props - Props containing the router to use
 */
export const RouterSwitch = (props: RouterSwitchProps) => {
  const routes = anyRouterToRouteList(props.router).map((route, index) => {
    const Component: RouteComponent = route.render();
    return (
      <Route
        key={index}
        path={route.fullTemplate}
        caseSensitive={route.sensitive}
        element={<Component />}
      />
    );
  });

  if (props.frame !== undefined) {
    const frame = React.cloneElement(props.frame, {
      children: <>{routes}</>,
    });

    return <Routes>{frame}</Routes>;
  }

  return <Routes>{routes}</Routes>;
};
