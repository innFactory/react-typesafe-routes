import * as React from 'react';
import {
  booleanParser,
  dateParser,
  intParser,
  OptionsRouter,
  Router,
  stringListParser,
  stringParser,
} from '../src/index';

function TestPage(props?: { content?: String }) {
  return <div>{props?.content}</div>;
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
        element: () => <TestPage />,
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
        item: route(':name/:id&:tab?', {
          element: () => <TestPage />,
          params: {
            id: intParser,
            name: stringParser,
            tab: stringParser,
          },
        }),
        settings: route(
          'settings/:settingsId',
          {
            element: () => <TestPage />,
            params: {
              settingsId: stringParser,
            },
          },
          route => ({
            account: route('account', {
              element: () => <TestPage />,
            }),
            language: route('lang/:lang', {
              element: () => <TestPage />,
              params: {
                lang: stringListParser(['de', 'en']),
              },
            }),
          })
        ),
      })
    ),
    product: route(':name/:id&:tab?', {
      element: () => <TestPage />,
      params: {
        id: intParser,
        name: stringParser,
        tab: stringParser,
      },
    }),
  }));

  expect(
    router
      .group({ filter: true, limit: 20, groupId: 'groupId' })
      .settings({ settingsId: 'settingsId' }).$
  ).toBe('/group/groupId/settings/settingsId?filter=true&limit=20');

  expect(
    router
      .group({ filter: true, limit: 20, groupId: 'groupId' })
      .item({ id: 99, name: 'abc' }).$
  ).toBe('/group/groupId/abc/99?filter=true&limit=20');

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

  expect(router.product({ id: 99, name: 'abc' }).$).toBe('/abc/99');
});

test('param parser', () => {
  const router = Router(route => ({
    group: route(
      '/group/:groupId?&:filter?&:limit&:date?',
      {
        element: () => <TestPage />,
        params: {
          groupId: stringParser,
          filter: booleanParser,
          limit: intParser,
          date: dateParser,
        },
      },
      route => ({
        item: route(':name/:id&:tab?', {
          element: () => <TestPage />,
          params: {
            id: intParser,
            name: stringParser,
            tab: stringParser,
          },
        }),
      })
    ),
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

  expect(
    router.group.children.item.parseParams({
      name: 'abc',
      id: '99',
      tab: 'overview',
    })
  ).toEqual({
    name: 'abc',
    id: 99,
    tab: 'overview',
  });

  expect(router.group.parseParams({ limit: '9' })).toEqual({ limit: 9 });

  expect(router.group.parseParams({ limit: '9', extra: 1 } as any)).toEqual({
    limit: 9,
  });

  expect(() => router.group.parseParams({} as any)).toThrowError();
});

test('template', () => {
  const options = {
    appBar: true,
    userDrawer: true,
  };

  const router = OptionsRouter(options, route => ({
    group: route(
      '/group/:groupId?&:filter?&:limit',
      {
        element: () => <TestPage />,
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
          '/settings/:settingsId',
          {
            element: () => <TestPage />,
            params: {
              settingsId: stringParser,
            },
          },
          route => ({
            account: route('account', {
              element: () => <TestPage />,
            }),
          })
        ),
      })
    ),
  }));

  expect(router.group.children.settings.template).toBe('/settings/:settingsId');
  expect(router.group.template).toBe('/group/:groupId?');
});

test('nested options', () => {
  const options = {
    appBar: true,
    userDrawer: true,
  };

  const router = OptionsRouter(options, route => ({
    home: route('', {
      element: () => <TestPage />,
    }),
    auth: route(
      '/auth',
      {
        element: () => <TestPage />,
        options: {
          appBar: false,
        },
      },
      route => ({
        login: route('login', {
          element: () => <TestPage />,
        }),
        register: route('register', {
          element: () => <TestPage />,
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

test('nested pages', () => {
  const TestPageA = () => <TestPage content="a" />;
  const TestPageB = () => <TestPage content="b" />;
  const TestPageC = () => <TestPage content="c" />;

  const router = Router(route => ({
    routeA: route(
      'a',
      {
        element: () => <TestPageA />,
      },
      route => ({
        routeB: route(
          'b',
          {
            element: () => <TestPageB />,
          },

          route => ({
            routeC: route('c', {
              element: () => <TestPageC />,
            }),
          })
        ),
      })
    ),
  }));

  expect(router.routeA.element()).toEqual(<TestPageA />);
  expect(router.routeA.children.routeB.element()).toEqual(<TestPageB />);
  expect(router.routeA.children.routeB.children.routeC.element()).toEqual(
    <TestPageC />
  );
});
