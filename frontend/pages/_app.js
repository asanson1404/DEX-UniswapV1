import '@/styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';

import { RainbowKitProvider, lightTheme } from '@rainbow-me/rainbowkit';
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { WagmiProvider } from 'wagmi';
import config from '../wagmi.config'

const queryClient = new QueryClient();

function App({ Component, pageProps }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={lightTheme({
          accentColor: 'rgba(50, 130, 188, 0.862)',
          accentColorForeground: 'white',
          borderRadius: 'large',
          fontStack: 'system', 
        })}>
          <Component {...pageProps} />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App;
