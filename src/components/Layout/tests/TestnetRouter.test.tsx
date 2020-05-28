import { fireEvent, renderWithRouter } from './../../../utils/test-utils';

const optionalConfig = {
  metaChainShardId: 4294967295,
  elrondApps: [
    {
      id: 'wallet',
      name: 'Wallet',
      to: 'https://wallet.elrond.com/',
    },
    {
      id: 'explorer',
      name: 'Explorer',
      to: 'https://explorer.elrond.com/',
    },
    {
      id: 'docs',
      name: 'Docs',
      to: 'https://docs.elrond.com/',
    },
  ],
  explorerApi: '',
  testnets: [
    {
      default: true,
      id: 'battle-of-nodes',
      name: 'Battle of Nodes',
      nodeUrl: 'https://api.elrond.com',
      elasticUrl: 'https://elastic-aws.elrond.com',
      refreshRate: 6000,
      numInitCharactersForScAddress: 20,
      decimals: 4,
      denomination: 18,
      gasPrice: 100000000000000,
      gasLimit: 1000000,
      gasPerDataByte: 1500,
      gasLimitEditable: true,
      economics: true,
      data: true,
      validatorDetails: true,
      faucet: false,
    },
    {
      default: false,
      id: 'testnet-do-toronto',
      name: 'DigitalOcean TOR Testnet',
      nodeUrl: '***REMOVED***',
      elasticUrl: '***REMOVED***',
      refreshRate: 6000,
      numInitCharactersForScAddress: 20,
      decimals: 4,
      denomination: 18,
      gasPrice: 100000000000000,
      gasLimit: 1000000,
      gasPerDataByte: 1500,
      gasLimitEditable: true,
      economics: true,
      data: true,
      validatorDetails: true,
      faucet: false,
    },
  ],
};

describe('Testnet Router', () => {
  test('Change route on testnet change', async () => {
    const render = renderWithRouter({
      route: '/',
      optionalConfig,
    });
    const testnetSwitch = render.getByTestId('testnetSwitch');
    expect(testnetSwitch.textContent).toBe('Battle of Nodes ');
    fireEvent.click(testnetSwitch);
    const digitalOcean = render.getByText('DigitalOcean TOR Testnet');
    fireEvent.click(digitalOcean);
    expect(render.history.location.pathname).toBe('/testnet-do-toronto');
  });
});
