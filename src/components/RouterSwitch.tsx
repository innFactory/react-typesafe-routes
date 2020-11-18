import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { OptionlessRouter, OptionsRouter } from '..';

interface Props {
  router: OptionlessRouter<any> | OptionsRouter<any, any>;
}

export function RouterSwitch(props: Props) {
  const { router } = props;

  return (
    <Switch>
      {Object.entries(router)
        .filter(val => val[0] !== 'defaultOptions')
        .map((route, index) => (
          <Route
            key={index}
            path={`/${route[1].template}`}
            component={route[1].render()()}
          />
        ))}
    </Switch>
  );
}
