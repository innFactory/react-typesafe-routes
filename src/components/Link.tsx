import * as React from 'react';
import { Link as OriginalLink } from 'react-router-dom';

/**
 * Wrapper component for the `react-router-dom` Link replacing the `to` prop to accept a built route without the `.$` for convenience
 *
 * @see [https://reactrouter.com/web/api/Navigate](https://reactrouter.com/web/api/Link)
 *
 * @example
 * ```tsx
 * const router = Router(route => ({
 *  login: route('login', { component: Login }),
 *  home: route('home', { component: Home }),
 * }));
 *
 * <Link to={router.home()} />
 * ```
 */
export const Link = (
  p: Omit<Parameters<typeof OriginalLink>[number], 'to'> & {
    to: { $: string };
  }
) => (
  <OriginalLink {...p} to={p.to.$}>
    {p.children}
  </OriginalLink>
);
