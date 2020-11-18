# React (Awesome) Typesafe Routes

This is the last routing library you will ever need in your React projects.

## Syntax

```tsx
const authMiddleware = (page, next) => {
  if(isAuthenticated) {
    return next();
  } else {
    return page;
  }
};

export const router = optionsRouter(history, defaultOptions, {
  home: route('/', {
    page: HomePage,
  }),
  login: route('/login', {
    page: LoginPage,
    options: { appBar: false }
  }),
  players: route('/players', {
    page: PlayersPage,
    middleware: authMiddleware,
    children: (route) => ({
      info: route('/:name/:id', {
        page: PlayerInfoPage,
        params: {
          name: stringParser,
          id: intParser
        },
        children: (route) => ({
          rating: route('/rating/:id', {
            page: PlayerRatingPage,
            params: { id: intParser },
          }),
          ban: route('/rating/:id', {
            page: PlayerRatingPage,
            params: { id: intParser },
          }),
        })
      }),
    },
  }),
});
```


### Credit

Credit where credit is due. The original parsing and type inferation is based on the work of [kruschid](https://github.com/kruschid)/[typesafe-routes](https://github.com/kruschid/typesafe-routes).