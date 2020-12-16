import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
  BrowserRouter,
  Switch,
  useHistory,
  useRouteMatch,
} from 'react-router-dom';
import { Link, Route, RouterSwitch, useRouteOptions, useRouteParams } from '..';
import { Redirect } from '../components';
import { useRoutesActive } from '../hooks/useRoutesActive';
import { RouteMiddleware } from '../types';
import { router } from './routes';

const AppRoot = () => {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
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

const App = () => {
  const options = useRouteOptions(router);
  const { home, about, topics, restricted } = useRoutesActive({
    home: router.home,
    about: router.about,
    topics: router.topics,
    restricted: router.restricted,
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
          <HighlightLink isActive={about} to={router.about()}>
            About
          </HighlightLink>
        </li>
        <li>
          <HighlightLink isActive={topics} to={router.topics()}>
            Topics
          </HighlightLink>
        </li>
        <li>
          <HighlightLink isActive={restricted} to={router.restricted()}>
            Restricted
          </HighlightLink>
        </li>
      </ul>
      <p>Options: {JSON.stringify(options)}</p>
      <p>AppBar supposed to be visible: {options.appBar ? 'Yes' : 'No'}</p>

      <RouterSwitch router={router} />
    </div>
  );
};

export const AuthMiddleware: RouteMiddleware = next => {
  const history = useHistory();
  // This does not make any sense and it's sole purpose is just to test if hooks work in the middleware.
  if (history.length > 3) {
    return () => <Redirect to={router.home()} />;
  }
  return next;
};

export const Home = () => <h2>Home</h2>;

export const About = () => <h2>About</h2>;

export const Restricted = () => <h2>Restricted</h2>;

export const Topics = () => {
  let match = useRouteMatch();

  return (
    <div>
      <h2>Topics</h2>

      <ul>
        <li>
          <Link
            to={router.topics().topic({ topicId: 0, topicName: 'components' })}
          >
            Components
          </Link>
        </li>
        <li>
          <Link
            to={router.topics().topic({
              topicId: 1,
              topicName: 'props-v-state',
              limit: 668.5,
            })}
          >
            Props v. State
          </Link>
        </li>
      </ul>

      <Switch>
        <Route to={router.topics.children.topic}>
          <Topic />
        </Route>
        <Route path={match.path}>
          <h3>Please select a topic.</h3>
        </Route>
      </Switch>
    </div>
  );
};

export function Topic() {
  let { topicId, topicName, limit } = useRouteParams(
    router.topics.children.topic
  );

  return (
    <h3>
      Requested topic ID: {topicId}, Name: {topicName}, limit:&nbsp;
      {limit ? limit * 2 : 'unknown'}
    </h3>
  );
}

ReactDOM.render(<AppRoot />, document.getElementById('app'));
