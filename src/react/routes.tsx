import * as React from 'react';
import {
  floatParser,
  intParser,
  OptionsRouter,
  stringParser,
} from '../../dist';
import { About, AuthMiddleware, Home, Restricted, Topics } from './react';

const defaultOptions = {
  appBar: true,
};

export const router = OptionsRouter(defaultOptions, route => ({
  home: route('', {
    component: <Home />,
  }),
  about: route('about', {
    component: <About />,
  }),
  restricted: route('restricted', {
    component: <Restricted />,
    middleware: AuthMiddleware,
  }),
  topics: route(
    'topics',
    {
      component: <Topics />,
      options: {
        appBar: false,
      },
    },
    route => ({
      topic: route(':topicName/:topicId&:limit?', {
        component: <Topics />,
        params: {
          topicName: stringParser,
          topicId: intParser,
          limit: floatParser,
        },
      }),
    })
  ),
}));
