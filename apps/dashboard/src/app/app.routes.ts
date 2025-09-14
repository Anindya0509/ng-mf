import { NxWelcome } from './nx-welcome';
import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'memberDetails',
    loadChildren: () =>
      import('memberDetails/Routes').then((m) => m!.remoteRoutes),
  },
  {
    path: 'bookDetails',
    loadChildren: () =>
      import('bookDetails/Routes').then((m) => m!.remoteRoutes),
  },
  {
    path: '',
    component: NxWelcome,
  },
];
