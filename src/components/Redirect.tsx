import * as React from 'react';
import { Redirect as OriginalRedirect, RedirectProps } from 'react-router-dom';

export const Redirect = (
  p: Omit<RedirectProps, 'to'> & {
    to: { $: string };
  }
) => <OriginalRedirect {...p} to={p.to.$} />;
