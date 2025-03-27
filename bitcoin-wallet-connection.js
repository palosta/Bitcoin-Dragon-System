document.addEventListener('DOMContentLoaded', () => {
    const connectButton = document.getElementById('connect-wallet');
    const walletAddressElement = document.getElementById('wallet-address');
    const verificationResultElement = document.getElementById('verification-result');

    // Enhanced wallet detection function
    function detectWallets() {
        const wallets = {
            xverse: !!(window.XverseProviders || window.btc || window.getProvider),
            unisat: !!window.unisat,
            magicEden: !!window.magicEden?.bitcoin,
            okx: !!(window.okxwallet?.bitcoin || window.okx)
        };

        console.log('Wallet Detection:', wallets);
        return wallets;
    }

    // Wallet connection methods for different Bitcoin wallets
    const walletConnectors = {
        xverse: {
            connect: async () => {
                // Multiple potential connection methods
                if (window.XverseProviders) {
                    const response = await window.XverseProviders.request('getAccounts');
                    return response.result[0];
                }
                if (window.btc) {
                    const response = await window.btc.request('getAccounts');
                    return response.result[0];
                }
                if (window.getProvider) {
                    const provider = await window.getProvider('xverse');
                    const accounts = await provider.requestAccounts();
                    return accounts[0];
                }
                throw new Error('Xverse wallet connection failed');
            }
        },
        unisat: {
            connect: async () => {
                if (window.unisat) {
                    const accounts = await window.unisat.requestAccounts();
                    return accounts[0];
                }
                throw new Error('Unisat wallet not found');
            }
        },
        magicEden: {
            connect: async () => {
                if (window.magicEden?.bitcoin) {
                    const response = await window.magicEden.bitcoin.connect();
                    return response.address;
                }
                throw new Error('Magic Eden wallet not found');
            }
        },
        okx: {
            connect: async () => {
                if (window.okxwallet?.bitcoin) {
                    const accounts = await window.okxwallet.bitcoin.requestAccounts();
                    return accounts[0];
                }
                if (window.okx) {
                    const accounts = await window.okx.bitcoin.requestAccounts();
                    return accounts[0];
                }
                throw new Error('OKX wallet not found');
            }
        }
    };

    // Wallet connection function
    async function connectWallet() {
        // Reset previous states
        walletAddressElement.textContent = '';
        verificationResultElement.textContent = '';

        // Detect available wallets
        const availableWallets = detectWallets();
        console.log('Available Wallets:', availableWallets);

        // Try connecting with each wallet type
        const walletTypes = ['xverse', 'unisat', 'magicEden', 'okx'];
        
        for (const walletType of walletTypes) {
            if (availableWallets[walletType]) {
                try {
                    const address = await walletConnectors[walletType].connect();
                    
                    // Display truncated address
                    walletAddressElement.textContent = `Connected (${walletType}): ${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
                    
                    // Perform wallet verification (replace with your actual verification logic)
                    await verifyWallet(address, walletType);
                    
                    return; // Stop after successful connection
                } catch (error) {
                    console.error(`${walletType} connection failed:`, error);
                }
            }
        }

        // If no wallet connected
        verificationResultElement.textContent = 'No compatible Bitcoin wallet found. Please install or unlock one of: Xverse, Unisat, Magic Eden, or OKX.';
    }

    // Wallet verification function (same as before)
    async function verifyWallet(address, walletType) {
        try {
            // Replace with your actual backend verification endpoint
            const response = await fetch(`https://yourbackend.com/verify/${walletType}/${address}`);
            const result = await response.json();
            
            verificationResultElement.textContent = result.verified 
                ? 'Wallet Verified ✅' 
                : 'Wallet Not Verified ❌';
        } catch (error) {
            console.error('Verification error:', error);
            verificationResultElement.textContent = 'Verification failed';
        }
    }

    // Add click event listener to connect button
    connectButton.addEventListener('click', connectWallet);

    // Enhanced wallet availability detection
    function updateConnectButton() {
        const availableWallets = detectWallets();
        const detectedWallets = Object.keys(availableWallets)
            .filter(wallet => availableWallets[wallet])
            .map(wallet => wallet.charAt(0).toUpperCase() + wallet.slice(1));
        
        if (detectedWallets.length > 0) {
            connectButton.textContent = `Connect (${detectedWallets.join(', ')})`;
        }
    }

    // Run wallet detection on page load
    updateConnectButton();
});
