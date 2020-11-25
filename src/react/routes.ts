import { floatParser, OptionsRouterType, stringParser } from '..';
import { About, Home, Topics } from './react';

const defaultOptions = {
  appBar: true,
};

export const router = OptionsRouter(defaultOptions, route => ({
  home: route('home', {
    page: () => Home,
  }),
  about: route('about', {
    page: () => About,
  }),
  topics: route(
    'topics',
    {
      page: () => Topics,
      options: {
        appBar: false,
      },
    },
    route => ({
      topic: route(':topicId&:limit?', {
        page: () => Topics,
        params: {
          topicId: stringParser,
          limit: floatParser,
        },
      }),
    })
  ),
}));
