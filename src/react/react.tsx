import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
  BrowserRouter,
  Route,
  Switch,
  useHistory,
  useRouteMatch,
} from 'react-router-dom';
import { Link, RouterSwitch, useRouteOptions, useRouteParams } from '..';
import { Redirect } from '../components';
import { RouteMiddleware } from '../types';
import { router } from './routes';

const AppRoot = () => {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
};

const App = () => {
  const options = useRouteOptions(router);

  return (
    <div>
      <ul>
        <li>
          <Link to={router.home()}>Home</Link>
        </li>
        <li>
          <Link to={router.about()}>About</Link>
        </li>
        <li>
          <Link to={router.topics()}>Topics</Link>
        </li>
        <li>
          <Link to={router.restricted()}>Restricted</Link>
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
          <Link to={router.topics().topic({ topicId: 'components' })}>
            Components
          </Link>
        </li>
        <li>
          <Link
            to={router.topics().topic({
              topicId: 'props-v-state',
              limit: 668.5,
            })}
          >
            Props v. State
          </Link>
        </li>
      </ul>

      <Switch>
        <Route path={match.path + router.topics.children.topic.template}>
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
  let { topicId, limit } = useRouteParams(router.topics.children.topic);

  return (
    <h3>
      Requested topic ID: {topicId}, limit:&nbsp;
      {limit ? limit * 2 : 'unknown'}
    </h3>
  );
}

ReactDOM.render(<AppRoot />, document.getElementById('app'));
