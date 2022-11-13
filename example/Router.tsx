import * as React from 'react';
import {
  floatParser,
  intParser,
  OptionsRouter,
  stringParser,
} from 'react-typesafe-routes';
import { About, Home, NoTopic, Restricted, Root, Topic, Topics } from './index';

const defaultOptions = {
  appBar: true,
};

export const router = OptionsRouter(defaultOptions, route => ({
  home: route(
    '/',
    {
      element: () => <Root />,
      index: {
        element: () => <Home />,
      },
    },
    route => ({
      about: route('about', {
        element: () => <About />,
      }),
      restricted: route('restricted', {
        element: () => <Restricted />,
      }),
      topics: route(
        'topics',
        {
          element: () => <Topics />,
          index: {
            element: () => <NoTopic />,
          },
          options: {
            appBar: false,
          },
        },
        route => ({
          topic: route(':topicName/:topicId&:limit?', {
            element: () => <Topic />,
            params: {
              topicName: stringParser,
              topicId: intParser,
              limit: floatParser,
            },
          }),
        })
      ),
    })
  ),
}));
