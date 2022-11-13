import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  Routes,
  useParams,
} from 'react-router-dom';
import {
  Link,
  Route,
  useRouteOptions,
  useRouteParams,
  useRoutesActive,
  createRouteObjectsFromRouter,
} from 'react-typesafe-routes';
import { router } from './Router';

const AppRoot = () => {
  const r = createBrowserRouter(createRouteObjectsFromRouter(router));

  return <RouterProvider router={r} />;
};

const HighlightLink = (
  props: React.PropsWithChildren<{
    to: { $: string };
    isActive: boolean;
  }>
) => {
  const style: React.CSSProperties = {
    color: 'blue',
  };
  const activeStyle: React.CSSProperties = {
    color: 'red',
  };
  return (
    <Link to={props.to} style={props.isActive ? activeStyle : style}>
      {props.children}
    </Link>
  );
};

export const Root = () => {
  const options = useRouteOptions(router);
  const { home, about, topics, restricted } = useRoutesActive({
    home: router.home,
    about: router.home.children.about,
    topics: router.home.children.topics,
    restricted: router.home.children.restricted,
  });

  return (
    <div>
      <ul>
        <li>
          <HighlightLink isActive={home} to={router.home()}>
            Home
          </HighlightLink>
        </li>
        <li>
          <HighlightLink isActive={about} to={router.home().about()}>
            About
          </HighlightLink>
        </li>
        <li>
          <HighlightLink isActive={topics} to={router.home().topics()}>
            Topics
          </HighlightLink>
        </li>
        <li>
          <HighlightLink isActive={restricted} to={router.home().restricted()}>
            Restricted
          </HighlightLink>
        </li>
      </ul>
      <p>Options: {JSON.stringify(options)}</p>
      <p>AppBar supposed to be visible: {options.appBar ? 'Yes' : 'No'}</p>

      <Outlet />
    </div>
  );
};

// export const AuthMiddleware: RouteMiddleware = NextComponent => {
//   // This does not make any sense and it's sole purpose is just to test if hooks work in the middleware.
//   if (history.length > 3) {
//     return () => <Navigate to={router.home().$} />;
//   }
//   return NextComponent;
// };

export const Home = () => <h2>Home</h2>;

export const About = () => <h2>About</h2>;

export const Restricted = () => <h2>Restricted</h2>;

export const Topics = () => {
  return (
    <div>
      <h2>Topics</h2>
      <ul>
        <li>
          <Link
            to={router
              .home()
              .topics()
              .topic({ topicId: 0, topicName: 'components' })}
          >
            Components
          </Link>
        </li>
        <li>
          <Link
            to={router
              .home()
              .topics()
              .topic({
                topicId: 1,
                topicName: 'props-v-state',
                limit: 668.5,
              })}
          >
            Props v. State
          </Link>
        </li>
      </ul>
      <Outlet />
    </div>
  );
};

export function NoTopic() {
  return <h3>Please select a topic.</h3>;
}

export function Topic() {
  let { topicId, topicName, limit } = useRouteParams(
    router.home.children.topics.children.topic
  );

  return (
    <h3>
      Requested topic ID: {topicId}, Name: {topicName}, limit:&nbsp;
      {limit ? limit * 2 : 'unknown'}
    </h3>
  );
}

ReactDOM.render(<AppRoot />, document.getElementById('root'));
