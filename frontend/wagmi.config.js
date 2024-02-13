import { createConfig, http } from 'wagmi';
import { sepolia } from 'wagmi/chains';

const config = createConfig({
    appName: 'Xela Exchange',
    projectId: '6e8e88ca2d45e9790c40e82dbe4462a5',
    chains: [sepolia],
    transports: {
      [sepolia.id]: http('https://misty-shy-pine.ethereum-sepolia.quiknode.pro/05277f6c32cb0fce7c041874e0a40085822f6e42/'),
    },
});

export default config;