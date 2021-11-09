# CHANGELOG.md

## 1.0.0 (unreleased)

BREAKING:

  - upgrade to use `react-router-dom: ^6.0.1`
  - `Redirect` renamed to `Navigate` to conform with react-router-dom naming
  - `RouterSwitch` renamed to `RouterRoutes` to conform with react-router-dom naming
  - the `sensitive` prop of a route was renamed to `caseSensitive` to conform with react-router-dom naming
  - the `strict` prop of a route does no longer exist
  - the `exact` prop of a route does no longer exist. If you need your path to be deep matching add a `*` to the end
  - the `component` prop of the route function now requires a `React.ReactComponent` instead of a `React.ReactElement`.

Fix:

  - use correct JSX syntax in `Middleware` documentation example