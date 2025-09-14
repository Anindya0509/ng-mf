import { ModuleFederationConfig } from '@nx/module-federation';

const config: ModuleFederationConfig = {
  name: 'bookDetails',
  exposes: {
    './Routes': 'apps/bookDetails/src/app/remote-entry/entry.routes.ts',
  },
};

export default config;
