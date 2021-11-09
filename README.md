# React (Awesome) Typesafe Routes

![CI](https://github.com/innFactory/react-typesafe-routes/workflows/CI/badge.svg)
[![Version](https://img.shields.io/npm/v/react-typesafe-routes.svg)](https://www.npmjs.com/package/react-typesafe-routes)
[![Downloads](https://img.shields.io/npm/dt/react-typesafe-routes.svg)](https://www.npmjs.com/package/react-typesafe-routes)

The last routing library you will ever need in your React projects. (At least if you're using react-router–dom but also why wouldn't you?)

[Typedoc documentation](https://innfactory.github.io/react-typesafe-routes)

## Table of Contents

- [React (Awesome) Typesafe Routes](#react-awesome-typesafe-routes)
  - [Table of Contents](#table-of-contents)
  - [Installing](#installing)
  - [Example](#example)
    - [Router definition](#router-definition)
    - [Usage in App](#usage-in-app)
    - [Route programatically](#route-programatically)
  - [Types of Routers](#types-of-routers)
    - [OptionsRouter](#optionsrouter)
    - [Router](#router)
  - [Routes](#routes)
    - [Route Template and Parameters](#route-template-and-parameters)
      - [Basic parameters](#basic-parameters)
      - [Optional parameters](#optional-parameters)
      - [Query parameters](#query-parameters)
      - [Child Routes](#child-routes)
    - [Middlewares](#middlewares)
  - [Parameter Parsers](#parameter-parsers)
    - [Available Parsers](#available-parsers)
    - [Your own parser](#your-own-parser)
  - [Hooks](#hooks)
    - [useRouteOptions](#userouteoptions)
    - [useRouteParams](#userouteparams)
    - [useRouteActive and useRoutesActive](#userouteactive-and-useroutesactive)
  - [Components](#components)
    - [RouterRoutes](#routerroutes)
    - [Link](#link)
    - [NavLink](#navlink)
    - [Navigate](#navigate)
    - [Route](#route)
  - [Roadmap](#roadmap)
  - [Contributing](#contributing)
  - [License](#license)

## Installing

Make sure you are using at least `Typescript 4.1.2` in your project. To find out what version you are using use `npm ls typescript`. There is a known issue with `react-scripts 4.0.1` still requiring `Typescript 3` but you can circumvent that by adding a `--legacy-peer-deps` to your install command.

```sh
npm install react-typesafe-routes

or

yarn add react-typesafe-routes
```

## Example

### Router definition

```tsx
const defaultOptions = {
  appBar: true,
};

const AuthMiddleware: RouteMiddleware = (next) => {
  if (isAuthenticated) {
    return next;
  } else {
    return () => <Navigate to={router.login()} />;
  }
};

export const router = OptionsRouter(defaultOptions, route => ({
  home: route('/', {
    component: <HomePage />
  }),
  login: route('/login', {
    component: <LoginPage />
    options: { appBar: false },
  }),
  players: route(
    '/players',
    {
      component: <PlayersPage />
      middleware: AuthMiddleware,
    },
    route => ({
      info: route(
        '/:name/:id',
        {
          component: <PlayerInfoPage />
          params: {
            name: stringParser,
            id: intParser,
          },
        },
        route => ({
          rating: route('/rating/:id', {
            component: <PlayerRatingPage />
            params: { id: intParser },
          }),
          ban: route('/rating/:id', {
            component: <PlayerRatingPage />
            params: { id: intParser },
          }),
        })
      ),
    })
  ),
}));
```

### Usage in App

The BrowserRouter comes from `react-router-dom` you can use any Router from that package that you like.

```tsx
const AppBar = () => {
  return (
    <div>
      <ul>
        <li><Link to={router.home()}>Home</Link></li>
        <li><Link to={router.player()}>Players</Link></li>
      </ul>
    </div>
  );
}

const App = () => {
  const { appBar } = useRouteOptions(router);

  return (
    <BrowserRouter>
      <div>
        { appBar && <AppBar />}
        <RouterRoutes router={router} />
      </div>
    </BrowserRouter>
  );
}
```

### Route programatically

To go to a route programmatically / without a `Link` Component:
```ts
const history = useHistory();
history.push(router.players().player({ id: 1, name: 'playerName' }).$);
```
The function will require you to input required parameters and don't forget the dollar sign at the end.
## Types of Routers

### OptionsRouter
This is the router most people will probably use. It supports Global options that configurable on a per Route basis and they automatically apply for child routes.

For example the login route is supposed to be full screen and doesn't require the AppBar.
```tsx
const defaultOptions = {
  appBar: true,
};

const router = OptionsRouter(defaultOptions, route => ({
  home: route('/', {
    component: <HomePage />
  }),
  login: route('/login', {
    component: <LoginPage />
    options: { appBar: false }
  }),
});

const App = () => {
  const options = useRouteOptions(router);

  return (
    <div>
      {options.appBar && <AppBar>}
      <RouterRoutes router={router} />
    </div>
  );
};
```

### Router
The Router is basically the same as the OptionsRouter but it doesn't have Options as the name already implied. No idea why you would need this but it's there just in case.

```tsx
const router = Router(route => ({
  home: route('/', {
    component: <HomePage />
  }),
  login: route('/login', {
    component: <LoginPage />
  }),
});

const App = () => {
  return (
    <div>
      <RouterRoutes router={router} />
    </div>
  );
};
```

## Routes

Routes can only be create inside an [OptionsRouter](#optionsrouter) or a [Router](#router).
```tsx
const options = { appBar: true };
const router = OptionsRouter(options, route => ({
  home: route(
    /**
     * The route template
    */
    '',
    {
      // The Component to be rendered on this route.
      component: RouteComponent;

      // The Parsers for the parameters in this route.
      params: Record<string, ParamParser<any>>;

      // A middleware for this route
      middleware?: RouteMiddleware;

      // Global options for this route
      options?: Partial<RO>;

      // Wether or not to include this routes child routes in a RouterRoutes  - Defaults to true
      includeChildren?: boolean;
    }
  ),
});
```

### Route Template and Parameters
Every route **requires** a component to be defined and for every parameter you define you are **required** to define a parser.
#### Basic parameters

Basic parameters are defined with a colon in front of them.

```tsx
const router = Route(route => ({
  test: route('test/:id', {
    component: <TestPage />,
    params: {
      id: intParser,
    }
  })
}));
```

#### Optional parameters

If you want a parameter to be optional you can add a question mark behind it. Optional parameters still **require** a parser to be defined.

```tsx
const router = Route(route => ({
  test: route('test/:id?', {
    component: <TestPage />,
    params: {
      id: intParser,
    }
  })
}));
```

#### Query parameters

A query parameter has an ampersand in front of it, they can be chained and also be made optional with a question mark.

```tsx
const router = Route(route => ({
  test: route('test/:id?&:filter&:page?', {
    component: <TestPage />,
    params: {
      id: intParser,
      page: intParser,
      filter: stringParser,
    }
  })
}));
```


#### Child Routes
Child routes can be defined with the third argument of the route function - Another route function!

```tsx
const router = Route(route => ({
  test: route('test/:id?&:filter&:page?', {
    component: <TestPage />,
    params: {
      id: intParser,
      page: intParser,
      filter: stringParser,
    }
  }, route => ({
    child: route('test')
  })),
}));
```

### Middlewares

A middleware is a special kind of function component that gets injected into your tree above your route. It also automatically applies to all child routes.

Example for a Firebase authentication middleware:
```tsx
const AuthMiddleware: RouteMiddleware = (next) => {
  // Get the FirebaseUser from state if your state make sure your state is
  // persistent if not this won't work for you since the FirebaseUser will
  // not be in the state in time.
  // firebase.auth().currentUser won't work since it's not always up to date
  const firebaseUser = useSelector((state: RootState) => state.firebaseUser);
	if (firebaseUser === null) {
		return () => <Navigate to={router.login()} />;
	}
	return next;
}

export const router = Router(route => ({
  login: route('login', {
    component: <Login />,
  }),
  restricted: route('restricted', {
    component: <Restricted />,
    middleware: AuthMiddleware,
  }),
});
```

## Parameter Parsers
Every parameter has a parser which makes [useRouteParams](#userouteparams) possible.

### Available Parsers
The following are self explanatory:
- stringParser
- floatParser
- intParser
- dateParser
- booleanParser
-

But there is also the **stringListParser** used like this:

```tsx
// Probably defined in your Page file
const testTabs = ['overview', 'statistics', 'comments'] as const;

const router = Route(route => ({
  test: route('test&:tab', {
    component: <TestPage />,
    params: {
      tab: stringListParser(testTabs),
    }
  })
}));
```

Which will result in your parameter being one of the tabs.

### Your own parser

The general interface for a ParamParser is:

```tsx
export interface ParamParser<T> {
  parse: (s: string) => T;
  serialize: (x: T) => string;
}
```

You can implement your own kind of parser as an example the **intParser**:

```tsx
export const intParser: ParamParser<number> = {
  parse: s => parseInt(s),
  serialize: x => x.toString(),
};
```
## Hooks

There are a few complementary Hooks to make your life easier.

### useRouteOptions

This is useful whenever you need those global route options of an [OptionsRouter](#optionsrouter). Since you define defaults in the Router those values will never be undefined and always return the correct values for your current route.

```tsx
const options = { appBar: true };
const router = OptionsRouter(options, route => ({
  home: route('', {
    component: <HomePage />
    }),
  entry: route('entries/:id', {
    component: <EntryPage />
    params: {
      id: intParser
    }
  })
}));

const options = useRouteOptions(router);

// or destructured
const { appBar } = useRouteOptions(router);
```

### useRouteParams

This is the way to go when you need those parameters of your Route. Let's say you have the Router from right above.

```tsx
export const EntryPage = () => {
  // id is statically typed to be a number
  const { id } = useRouteParams(router.entry);

  return <div>Entry {id}</div>;
}
```
### useRouteActive and useRoutesActive

This is the way to go when you need those parameters of your Route. Let's say you have the Router from right above.

```tsx
const HighlightLink = (
  props: React.PropsWithChildren<{
    to: { $: string };
    isActive: boolean;
  }>
) => {
  const style: React.CSSProperties = { color: 'blue' };
  const activeStyle: React.CSSProperties = { color: 'red' };

  return (
    <Link to={props.to} style={props.isActive ? activeStyle : style}>
      {props.children}
    </Link>
  );
};

export const App = () => {
  // Check if a single route is active
  const active = useRouteActive(router.home);

  // Check if multiple routes are active
  const { home, entry } = useRoutesActive({
    home: router.home,
    entry: router.entry,
  });

  return (
    <ul>
      <li>
        <HighlightLink isActive={home} to={router.home()}>
          Home
        </HighlightLink>
      </li>
      <li>
        <HighlightLink isActive={entry} to={router.entry()}>
          Entry
        </HighlightLink>
      </li>
    </ul>
  );
}
```

## Components

### RouterRoutes

This is what you would use instead of the `Routes` and `Route` from `react-router-dom`. You just give it your router and it automatically adds al the routes for you.

```tsx
<RouterRoutes router={router}/>
```

### Link
This is a simple wrapper Component for the `react-router-dom` Link.

```tsx
<Link to={router.home()}></Link>
```
### NavLink
This is a simple wrapper Component for the `react-router-dom` NavLink.

```tsx
<NavLink to={router.home()}></NavLink>
```
### Navigate
This is a simple wrapper Component for the `react-router-dom` Navigate.

```tsx
<Navigate to={router.home()}></Navigate>
```
### Route
This is a simple wrapper Component for the `react-router-dom` Route.

```tsx
<Route to={router.home()}></Route>
```

## Roadmap

- Optional defaults for optional parameters
- Parsing parent params in a nicer way

## Contributing
All contributions are welcome. Please open an issue about your request or bug fix before submitting a pull request.

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/DevNico"><img src="https://avatars.githubusercontent.com/u/24965872?v=3?s=100" width="100px;" alt=""/><br /><sub><b>DevNico</b></sub></a><br /><a href="https://github.com/innFactory/react-typesafe-routes/commits?author=DevNico" title="Code">💻</a> <a href="https://github.com/innFactory/react-typesafe-routes/commits?author=DevNico" title="Documentation">📖</a></td>
  </tr>
</table>
<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
## License

This project is licensed under the terms of the [MIT license](LICENSE).
