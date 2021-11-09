import * as React from 'react';
import { Route, Routes } from 'react-router-dom';
import { AnyRouterType } from '../router';
import { anyRouterToRouteList } from '../utils/routerUtils';

/**
 * Props for a RouterRoutes component
 */
interface RouterRoutesProps {
  router: AnyRouterType;
  frame: React.ReactElement<React.PropsWithChildren<any>>;
}

/**
 * react-router-dom Routes wrapper that creates Route components for every route defined in the given router
 *
 * @param props - Props containing the router to use
 */
export const RouterRoutes = (props: RouterRoutesProps) => {
  const routes = anyRouterToRouteList(props.router).map((route, index) => {
    const Element = route.render();
    return (
      <Route
        key={index}
        path={route.fullTemplate}
        caseSensitive={route.caseSensitive}
        element={Element}
      />
    );
  });

  if (props.frame) {
    const frame = React.cloneElement(props.frame, {
      children: <>{routes}</>,
    });

    return <Routes>{frame}</Routes>;
  }

  return <Routes>{routes}</Routes>;
};
