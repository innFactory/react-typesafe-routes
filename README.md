# React (Awesome) Typesafe Routes

The last routing library you will ever need in your React projects. (At least if you're using react-router–dom but also why wouldn't you?)

## Example

```tsx
const defaultOptions = {
  appBar: true,
};

const authMiddleware: RouteMiddleware = (next) => {
  if(isAuthenticated) {
    return next;
  } else {
    return () => <Redirect to={router.login()} />;
  }
};

export const router = OptionsRouter(defaultOptions, route => ({
  home: route('/', {
    page: () => <HomePage />,
  }),
  login: route('/login', {
    page: () => <LoginPage />,
    options: { appBar: false }
  }),
  players: route(
    '/players',
    {
      page: () => <PlayersPage />,
      middleware: next => authMiddleware(next),
    },
    (route) => ({
      info: route(
        '/:name/:id',
        {
          page: () => <PlayerInfoPage />,
          params: {
            name: stringParser,
            id: intParser
          },
        },
        (route) => ({
          rating: route('/rating/:id', {
            page: () => <PlayerRatingPage />,
            params: { id: intParser },
          }),
          ban: route('/rating/:id', {
            page: () => <PlayerRatingPage />,
            params: { id: intParser },
          }),
        }),
      ),
    }),
  ),
}));
```

## Roadmap
- Optional defaults for optional parameters
- Parsing parent params in a nicer way