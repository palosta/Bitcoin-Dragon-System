// bitcoin-wallet-connection.js

document.addEventListener('DOMContentLoaded', () => {
    // Fonction pour charger la bibliothèque Sats Connect dynamiquement
    function loadSatsConnect() {
        return new Promise((resolve, reject) => {
            // Vérifier si Sats Connect est déjà chargé
            if (window.SatsConnect) {
                resolve(window.SatsConnect);
                return;
            }

            // Créer un élément script pour charger Sats Connect
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/sats-connect@3.0.0/dist/umd/index.js';
            script.async = true;
            script.onload = () => {
                if (window.SatsConnect) {
                    resolve(window.SatsConnect);
                } else {
                    reject(new Error('Sats Connect not loaded correctly'));
                }
            };
            script.onerror = () => reject(new Error('Failed to load Sats Connect'));
            document.head.appendChild(script);
        });
    }

    const connectButton = document.getElementById('connect-wallet-btn');
    const walletAddressDisplay = document.getElementById('wallet-address');
    const walletModal = document.getElementById('wallet-modal');
    const closeModalButton = document.querySelector('.close-modal');
    const walletOptionsContainer = document.querySelector('.wallet-options');

    if (!connectButton) {
        console.error('Bouton de connexion non trouvé');
        return;
    }

    // Configuration des portefeuilles
    const wallets = [
        { 
            name: 'Xverse',
            icon: "assets/xverse.png",
            available: false,
            connect: async () => {
                try {
                    const SatsConnect = await loadSatsConnect();
                    const { request } = SatsConnect;
                    
                    // Utiliser la méthode wallet_connect pour se connecter
                    const response = await request('wallet_connect', {
                        addresses: ['ordinals', 'payment', 'stacks'],
                        message: 'Connect to Bitcoin Dragon System'
                    });
                    
                    if (response.status === 'success') {
                        const paymentAddress = response.result.addresses.find(
                            addr => addr.purpose === 'payment'
                        );
                        return paymentAddress?.address;
                    }
                    return null;
                } catch (error) {
                    console.error('Xverse connection error:', error);
                    return null;
                }
            }
        },
        { 
            name: 'Unisat',
            icon: "assets/unisat.png",
            available: false,
            connect: async () => {
                try {
                    // Vérifier si l'API Unisat est disponible
                    if (window.unisat) {
                        const accounts = await window.unisat.requestAccounts();
                        return accounts[0];
                    }
                    
                    // Utiliser Sats Connect comme fallback
                    const SatsConnect = await loadSatsConnect();
                    const { Wallet } = SatsConnect;
                    
                    const data = await Wallet.request('getAccounts', {
                        network: {
                            type: 'Mainnet'
                        },
                        message: 'Connect to Bitcoin Dragon System',
                        paymentAddress: true,
                        ordinalAddress: true
                    });
                    
                    return data.paymentAddress || data.address;
                } catch (error) {
                    console.error('Unisat connection error:', error);
                    return null;
                }
            }
        },
        { 
            name: 'Magic Eden',
            icon: "assets/magic-eden.png",
            available: false,
            connect: async () => {
                try {
                    const SatsConnect = await loadSatsConnect();
                    const { Wallet } = SatsConnect;
                    
                    const data = await Wallet.request('getAccounts', {
                        network: {
                            type: 'Mainnet'
                        },
                        message: 'Connect to Bitcoin Dragon System',
                        paymentAddress: true,
                        ordinalAddress: true
                    });
                    
                    return data.paymentAddress || data.address;
                } catch (error) {
                    console.error('Magic Eden connection error:', error);
                    return null;
                }
            }
        },
        { 
            name: 'OKX',
            icon: "assets/okx.png",
            available: false,
            connect: async () => {
                try {
                    // Vérifier si OKX Wallet est disponible
                    if (window.okxwallet?.bitcoin) {
                        const accounts = await window.okxwallet.bitcoin.requestAccounts();
                        return accounts[0];
                    }
                    
                    // Utiliser Sats Connect comme fallback
                    const SatsConnect = await loadSatsConnect();
                    const { Wallet } = SatsConnect;
                    
                    const data = await Wallet.request('getAccounts', {
                        network: {
                            type: 'Mainnet'
                        },
                        message: 'Connect to Bitcoin Dragon System',
                        paymentAddress: true,
                        ordinalAddress: true
                    });
                    
                    return data.paymentAddress || data.address;
                } catch (error) {
                    console.error('OKX connection error:', error);
                    return null;
                }
            }
        },
        { 
            name: 'Leather',
            icon: "assets/leather.png",
            available: false,
            connect: async () => {
                try {
                    const SatsConnect = await loadSatsConnect();
                    const { Wallet } = SatsConnect;
                    
                    const data = await Wallet.request('getAccounts', {
                        network: {
                            type: 'Mainnet'
                        },
                        message: 'Connect to Bitcoin Dragon System',
                        paymentAddress: true,
                        ordinalAddress: true
                    });
                    
                    return data.paymentAddress || data.address;
                } catch (error) {
                    console.error('Leather connection error:', error);
                    return null;
                }
            }
        }
    ];

    // Raccourcir l'adresse
    function shortenAddress(address) {
        if (!address) return "";
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    }

    // Vérifier la disponibilité des portefeuilles
    async function checkWalletAvailability() {
        try {
            // Charger Sats Connect
            await loadSatsConnect();
            
            // Obtenir la liste des portefeuilles disponibles
            const { getProviders } = window.SatsConnect;
            const availableProviders = await getProviders();
            
            // Mettre à jour la disponibilité des portefeuilles
            wallets.forEach(wallet => {
                const provider = availableProviders.find(p => 
                    p.name.toLowerCase().includes(wallet.name.toLowerCase())
                );
                wallet.available = !!provider;
            });
            
            // Vérifier également les API directes
            if (window.unisat) {
                wallets.find(w => w.name === 'Unisat').available = true;
            }
            
            if (window.okxwallet?.bitcoin) {
                wallets.find(w => w.name === 'OKX').available = true;
            }
            
            console.log('Wallet availability updated:', wallets.map(w => `${w.name}: ${w.available}`).join(', '));
        } catch (error) {
            console.error('Error checking wallet availability:', error);
        }
    }

    // Initialiser la modal avec les options de portefeuille
    function initWalletModal() {
        if (!walletOptionsContainer) return;
        
        // Vider le conteneur
        walletOptionsContainer.innerHTML = '';
        
        // Ajouter chaque option de portefeuille
        wallets.forEach((wallet, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = wallet.available ? 'wallet-option' : 'wallet-option wallet-option-install';
            optionElement.setAttribute('data-wallet', index);
            optionElement.innerHTML = `
                <span class="wallet-option-name">${wallet.name} ${!wallet.available ? '(Installation)' : ''}</span>
                <img src="${wallet.icon}" alt="${wallet.name}" class="wallet-option-icon" onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2224%22 height=%2224%22 viewBox=%220 0 24 24%22><rect width=%2224%22 height=%2224%22 fill=%22%23ddd%22/><text x=%2212%22 y=%2216%22 font-size=%2212%22 text-anchor=%22middle%22 fill=%22%23333%22>${wallet.name[0]}</text></svg>';">
            `;
            walletOptionsContainer.appendChild(optionElement);
        });
        
        // Ajouter les écouteurs d'événements
        walletOptionsContainer.querySelectorAll('.wallet-option').forEach(option => {
            option.addEventListener('click', async () => {
                const walletIndex = option.getAttribute('data-wallet');
                const wallet = wallets[walletIndex];
                
                if (!wallet.available) {
                    // Diriger vers le site d'installation du portefeuille
                    const walletUrls = {
                        'Xverse': 'https://www.xverse.app/download',
                        'Unisat': 'https://unisat.io/download',
                        'Magic Eden': 'https://wallet.magiceden.io/download',
                        'OKX': 'https://www.okx.com/web3/wallet/download',
                        'Leather': 'https://leather.io/install-extension'
                    };
                    
                    window.open(walletUrls[wallet.name], '_blank');
                    return;
                }
                
                console.log(`Tentative de connexion à ${wallet.name}...`);
                
                try {
                    const address = await wallet.connect();
                    if (address) {
                        if (walletAddressDisplay) {
                            walletAddressDisplay.textContent = `Connecté avec ${wallet.name}: ${shortenAddress(address)}`;
                        }
                        connectButton.textContent = 'Connecté';
                        connectButton.classList.add('connected');
                        closeWalletModal();
                    } else {
                        alert(`Échec de la connexion à ${wallet.name}. Vérifiez que l'extension est correctement installée.`);
                    }
                } catch (error) {
                    console.error(`Erreur de connexion à ${wallet.name}:`, error);
                    alert(`Une erreur est survenue lors de la connexion à ${wallet.name}.`);
                }
            });
        });
    }

    // Ouvrir la modal de portefeuille
    function openWalletModal() {
        if (walletModal) {
            walletModal.style.display = 'flex';
        }
    }

    // Fermer la modal de portefeuille
    function closeWalletModal() {
        if (walletModal) {
            walletModal.style.display = 'none';
        }
    }

    // Initialisation des écouteurs d'événements
    function initEventListeners() {
        // Ouvrir la modal au clic sur le bouton de connexion
        connectButton.addEventListener('click', async () => {
            // Vérifier la disponibilité des portefeuilles avant d'ouvrir la modal
            await checkWalletAvailability();
            
            // Initialiser la modal avec les portefeuilles disponibles
            initWalletModal();
            
            // Ouvrir la modal
            openWalletModal();
        });
        
        // Fermer la modal au clic sur le bouton de fermeture
        if (closeModalButton) {
            closeModalButton.addEventListener('click', closeWalletModal);
        }
        
        // Fermer la modal au clic à l'extérieur
        if (walletModal) {
            walletModal.addEventListener('click', (event) => {
                if (event.target === walletModal) {
                    closeWalletModal();
                }
            });
        }
    }

    // Initialisation
    initEventListeners();
    console.log('Script de connexion de portefeuille initialisé');
});
