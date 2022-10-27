import * as React from 'react';
import { Navigate as OriginalRedirect, NavigateProps } from 'react-router-dom';

/**
 * Wrapper component for the `react-router-dom` Redirect replacing the `to` prop to accept a built route without the `.$` for convenience
 *
 * @see [https://reactrouter.com/web/api/Redirect](https://reactrouter.com/web/api/Redirect)
 *
 * @example
 * ```tsx
 * const router = Router(route => ({
 *  login: route('login', { component: Login }),
 *  home: route('home', { component: Home }),
 * }));
 *
 * <Redirect to={router.home()} />
 * ```
 */
export const Redirect = (
  p: Omit<NavigateProps, 'to'> & {
    to: { $: string };
  }
) => <OriginalRedirect {...p} to={p.to.$} />;
