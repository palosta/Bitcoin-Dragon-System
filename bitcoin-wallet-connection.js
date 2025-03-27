document.addEventListener('DOMContentLoaded', () => {
    const connectButton = document.getElementById('connect-wallet');
    const walletAddressElement = document.getElementById('wallet-address');
    const verificationResultElement = document.getElementById('verification-result');

    // Wallet connection methods for different Bitcoin wallets
    const walletConnectors = {
        xverse: {
            connect: async () => {
                if (window.XverseProviders) {
                    try {
                        const response = await window.XverseProviders.request('getAccounts');
                        return response.result[0];
                    } catch (error) {
                        console.error('Xverse connection error:', error);
                        throw error;
                    }
                }
                throw new Error('Xverse wallet not found');
            }
        },
        unisat: {
            connect: async () => {
                if (window.unisat) {
                    try {
                        const accounts = await window.unisat.requestAccounts();
                        return accounts[0];
                    } catch (error) {
                        console.error('Unisat connection error:', error);
                        throw error;
                    }
                }
                throw new Error('Unisat wallet not found');
            }
        },
        magicEden: {
            connect: async () => {
                if (window.magicEden) {
                    try {
                        const response = await window.magicEden.bitcoin.connect();
                        return response.address;
                    } catch (error) {
                        console.error('Magic Eden connection error:', error);
                        throw error;
                    }
                }
                throw new Error('Magic Eden wallet not found');
            }
        },
        okx: {
            connect: async () => {
                if (window.okxwallet && window.okxwallet.bitcoin) {
                    try {
                        const accounts = await window.okxwallet.bitcoin.requestAccounts();
                        return accounts[0];
                    } catch (error) {
                        console.error('OKX wallet connection error:', error);
                        throw error;
                    }
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

        // Try connecting with each wallet type
        const walletTypes = ['xverse', 'unisat', 'magicEden', 'okx'];
        
        for (const walletType of walletTypes) {
            try {
                const address = await walletConnectors[walletType].connect();
                
                // Display truncated address
                walletAddressElement.textContent = `Connected (${walletType}): ${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
                
                // Perform wallet verification (replace with your actual verification logic)
                await verifyWallet(address, walletType);
                
                return; // Stop after successful connection
            } catch (error) {
                console.log(`${walletType} connection failed:`, error.message);
            }
        }

        // If no wallet connected
        verificationResultElement.textContent = 'No compatible Bitcoin wallet found. Please install one of: Xverse, Unisat, Magic Eden, or OKX.';
    }

    // Wallet verification function
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

    // Optional: Add wallet availability detection
    function detectAvailableWallets() {
        const availableWallets = [];
        
        if (window.XverseProviders) availableWallets.push('Xverse');
        if (window.unisat) availableWallets.push('Unisat');
        if (window.magicEden) availableWallets.push('Magic Eden');
        if (window.okxwallet && window.okxwallet.bitcoin) availableWallets.push('OKX');
        
        if (availableWallets.length > 0) {
            connectButton.textContent = `Connect (${availableWallets.join(', ')})`;
        }
    }

    // Run wallet detection on page load
    detectAvailableWallets();
});
