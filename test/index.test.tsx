import * as React from 'react';
import { Redirect } from 'react-router-dom';
import {
  booleanParser,
  dateParser,
  intParser,
  OptionsRouter,
  RouteMiddleware,
  Router,
  stringListParser,
  stringParser,
} from '../src/index';

function TestPage(content?: String) {
  return <div>{content}</div>;
}

test('nested routes', () => {
  const options = {
    appBar: true,
    userDrawer: true,
  };

  const router = OptionsRouter(options, route => ({
    group: route(
      'group/:groupId?&:filter?&:limit',
      {
        page: TestPage,
        params: {
          groupId: stringParser,
          filter: booleanParser,
          limit: intParser,
        },
        options: {
          appBar: false,
        },
      },
      route => ({
        settings: route(
          'settings/:settingsId',
          {
            page: TestPage,
            params: {
              settingsId: stringParser,
            },
          },
          route => ({
            account: route('account', {
              page: TestPage,
            }),
            language: route('lang/:lang', {
              page: TestPage,
              params: {
                lang: stringListParser('de', 'en'),
              },
            }),
          })
        ),
      })
    ),
  }));

  expect(
    router
      .group({ filter: true, limit: 20, groupId: 'groupId' })
      .settings({ settingsId: 'settingsId' }).$
  ).toBe('/group/groupId/settings/settingsId?filter=true&limit=20');

  expect(
    router
      .group({ limit: 30 })
      .settings({ settingsId: 'settingsId' })
      .account().$
  ).toBe('/group/settings/settingsId/account?limit=30');

  expect(
    router
      .group({ limit: 30 })
      .settings({ settingsId: 'settingsId' })
      .language({ lang: 'de' }).$
  ).toBe('/group/settings/settingsId/lang/de?limit=30');
});

test('param parser', () => {
  const router = Router(route => ({
    group: route('group/:groupId?&:filter?&:limit&:date?', {
      page: TestPage,
      params: {
        groupId: stringParser,
        filter: booleanParser,
        limit: intParser,
        date: dateParser,
      },
    }),
  }));

  expect(
    router.group.parseParams({
      limit: '99',
      filter: 'true',
      groupId: 'abc',
      date: '2020-10-02T10:29:50Z',
    })
  ).toEqual({
    limit: 99,
    filter: true,
    groupId: 'abc',
    date: new Date('2020-10-02T10:29:50Z'),
  });

  expect(router.group.parseParams({ limit: '9' })).toEqual({ limit: 9 });

  expect(router.group.parseParams({ limit: '9', extra: 1 } as any)).toEqual({
    limit: 9,
  });

  expect(() => router.group.parseParams({} as any, true)).toThrowError();
});

test('template', () => {
  const options = {
    appBar: true,
    userDrawer: true,
  };

  const router = OptionsRouter(options, route => ({
    group: route(
      'group/:groupId?&:filter?&:limit',
      {
        page: TestPage,
        params: {
          groupId: stringParser,
          filter: booleanParser,
          limit: intParser,
        },
        options: {
          appBar: false,
        },
      },
      route => ({
        settings: route(
          'settings/:settingsId',
          {
            page: TestPage,
            params: {
              settingsId: stringParser,
            },
          },
          route => ({
            account: route('account', {
              page: TestPage,
            }),
          })
        ),
      })
    ),
  }));

  expect(router.group.children.settings.template).toBe('settings/:settingsId');
  expect(router.group.template).toBe('group/:groupId?');
});

test('nested options', () => {
  const options = {
    appBar: true,
    userDrawer: true,
  };

  const router = OptionsRouter(options, route => ({
    home: route('', {
      page: TestPage,
    }),
    auth: route(
      'auth',
      {
        page: TestPage,
        options: {
          appBar: false,
        },
      },
      route => ({
        login: route('login', {
          page: TestPage,
        }),
        register: route('register', {
          page: TestPage,
          options: {
            appBar: true,
          },
        }),
      })
    ),
  }));
  expect(router.auth.options.appBar).toBe(false);
  expect(router.auth.children.login.options.appBar).toBe(false);
  expect(router.auth.children.register.options.appBar).toBe(true);
  expect(router.home.options.appBar).toBe(true);
});

test('middleware', () => {
  const loginPage = () => TestPage('login');
  // This is a function because it needs access to router
  const makeRedirect = () => <Redirect to={router.login().$} />;

  const middleware: RouteMiddleware = next => {
    // eslint-disable-next-line no-self-compare
    if (true == true) {
      return makeRedirect();
    }
    return next;
  };

  const router = Router(route => ({
    login: route('login', {
      page: loginPage(),
    }),
    restricted: route(
      'restricted',
      {
        page: TestPage,
        middleware: middleware,
      },
      route => ({
        dashboard: route('dashboard', { page: TestPage }),
      })
    ),
  }));

  expect(router.restricted.children.dashboard.render()).toEqual(makeRedirect());

  expect(router.restricted.render()).toEqual(makeRedirect());

  expect(router.login.render()).toEqual(loginPage());
});
