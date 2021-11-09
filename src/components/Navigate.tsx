import * as React from 'react';
import { Navigate as OriginalNavigate, NavigateProps } from 'react-router-dom';

/**
 * Wrapper component for the `react-router-dom` Navigate replacing the `to` prop to accept a built route without the `.$` for convenience
 *
 * @see [https://reactrouter.com/web/api/Navigate](https://reactrouter.com/web/api/Navigate)
 *
 * @example
 * ```tsx
 * const router = Router(route => ({
 *  login: route('login', { component: Login }),
 *  home: route('home', { component: Home }),
 * }));
 *
 * <Navigate to={router.home()} />
 * ```
 */
export const Navigate = (
  p: Omit<NavigateProps, 'to'> & {
    to: { $: string };
  }
) => <OriginalNavigate {...p} to={p.to.$} />;
