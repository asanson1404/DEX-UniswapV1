import '@/styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';

import { RainbowKitProvider, getDefaultWallets, lightTheme } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

const { chains, publicClient } = configureChains(
  [sepolia],
  [
    jsonRpcProvider({
      rpc: () => ({
        http: "https://misty-shy-pine.ethereum-sepolia.quiknode.pro/05277f6c32cb0fce7c041874e0a40085822f6e42/"
      }),
    })
  ]
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
        accentColor: 'rgba(50, 130, 188, 0.862)',
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
