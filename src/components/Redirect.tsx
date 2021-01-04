import * as React from 'react';
import { Redirect as OriginalRedirect, RedirectProps } from 'react-router-dom';

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
  p: Omit<RedirectProps, 'to'> & {
    to: { $: string };
  }
) => <OriginalRedirect {...p} to={p.to.$} />;
