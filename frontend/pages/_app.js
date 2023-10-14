import '@/styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';

import { RainbowKitProvider, getDefaultWallets, lightTheme } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

const { chains, publicClient } = configureChains(
  [sepolia],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'Xela Exchange',
  projectId: '6e8e88ca2d45e9790c40e82dbe4462a5',
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

function App({ Component, pageProps }) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} theme={lightTheme({
        accentColor: '#5f29d470',
        accentColorForeground: 'white',
        borderRadius: 'large',
        fontStack: 'system', 
      })}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default App;
