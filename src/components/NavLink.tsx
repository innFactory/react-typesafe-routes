import * as React from 'react';
import { NavLink as OriginalNavLink } from 'react-router-dom';

/**
 * Wrapper component for the `react-router-dom` NavLink replacing the `to` prop to accept a built route without the `.$` for convenience
 *
 * @see [https://reactrouter.com/web/api/Redirect](https://reactrouter.com/web/api/NavLink)
 *
 * @example
 * ```tsx
 * const router = Router(route => ({
 *  login: route('login', { component: Login }),
 *  home: route('home', { component: Home }),
 * }));
 *
 * <NavLink to={router.home()} />
 * ```
 */
export const NavLink = (
  p: Omit<Parameters<typeof OriginalNavLink>[number], 'to'> & {
    to: { $: string };
  }
) => (
  <OriginalNavLink {...p} to={p.to.$}>
    {p.children}
  </OriginalNavLink>
);
