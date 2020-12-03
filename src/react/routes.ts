import { floatParser, OptionsRouter, stringParser } from '..';
import { About, Home, Topics } from './react';

const defaultOptions = {
  appBar: true,
};

export const router = OptionsRouter(defaultOptions, route => ({
  home: route('home', {
    component: () => Home,
  }),
  about: route('about', {
    component: () => About,
  }),
  topics: route(
    'topics',
    {
      component: () => Topics,
      options: {
        appBar: false,
      },
    },
    route => ({
      topic: route(':topicId&:limit?', {
        component: () => Topics,
        params: {
          topicId: stringParser,
          limit: floatParser,
        },
      }),
    })
  ),
}));
