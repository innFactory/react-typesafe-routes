import * as React from 'react';
import { Link as OriginalLink } from 'react-router-dom';

export const Link = (
  p: Omit<Parameters<typeof OriginalLink>[number], 'to'> & {
    to: { $: string };
  }
) => (
  <OriginalLink {...p} to={p.to.$}>
    {p.children}
  </OriginalLink>
);
