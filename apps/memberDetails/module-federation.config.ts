import { ModuleFederationConfig } from '@nx/module-federation';

const config: ModuleFederationConfig = {
  name: 'memberDetails',
  exposes: {
    './Routes': 'apps/memberDetails/src/app/remote-entry/entry.routes.ts',
  },
};

export default config;
