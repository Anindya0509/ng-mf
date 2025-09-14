import { ModuleFederationConfig } from '@nx/module-federation';

const config: ModuleFederationConfig = {
  name: 'dashboard',
  remotes: ['bookDetails', 'memberDetails'],
};
export default config;
