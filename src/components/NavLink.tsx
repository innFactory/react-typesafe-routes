import * as React from 'react';
import { NavLink as OriginalNavLink } from 'react-router-dom';

export const NavLink = (
  p: Omit<Parameters<typeof OriginalNavLink>[number], 'to'> & {
    to: { $: string };
  }
) => (
  <OriginalNavLink {...p} to={p.to.$}>
    {p.children}
  </OriginalNavLink>
);
