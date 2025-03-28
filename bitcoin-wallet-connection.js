document.addEventListener('DOMContentLoaded', () => {
    const connectButton = document.getElementById('connect-wallet-btn');
    const walletAddressDisplay = document.getElementById('wallet-address');
    const walletModal = document.getElementById('wallet-modal');
    const closeModalButton = document.querySelector('.close-modal');
    const walletOptionsContainer = document.querySelector('.wallet-options');

    if (!connectButton) {
        console.error('Bouton de connexion non trouvé');
        return;
    }

    // Configuration des portefeuilles - assurez-vous que les chemins d'icônes sont corrects
    const wallets = [
        { 
            name: 'Xverse',
            icon: "assets/xverse.png", // Changé en .png au cas où
            connect: async () => {
                try {
                    // Vérifiez différentes façons d'accéder à Xverse
                    if (window.XverseProviders?.BitcoinProvider) {
                        return await connectXverse(window.XverseProviders.BitcoinProvider);
                    } else if (window.XverseProvider) {
                        return await connectXverse(window.XverseProvider);
                    } else if (window.bitcoinProvider) {
                        return await connectXverse(window.bitcoinProvider);
                    } else {
                        openWalletWebsite('Xverse', 'https://www.xverse.app/download');
                        return null;
                    }
                } catch (error) {
                    console.error('Xverse connection error:', error);
                    return null;
                }
            }
        },
        { 
            name: 'Unisat',
            icon: "assets/unisat.png",
            connect: async () => {
                try {
                    if (!window.unisat) {
                        openWalletWebsite('Unisat', 'https://unisat.io/download');
                        return null;
                    }
                    const accounts = await window.unisat.requestAccounts();
                    return accounts[0];
                } catch (error) {
                    console.error('Unisat connection error:', error);
                    return null;
                }
            }
        },
        { 
            name: 'Magic Eden',
            icon: "assets/magic-eden.png",
            connect: async () => {
                try {
                    if (window.magicEden) {
                        return await connectMagicEden(window.magicEden);
                    } else if (window.magicEdenWallet) {
                        return await connectMagicEden(window.magicEdenWallet);
                    } else {
                        openWalletWebsite('Magic Eden', 'https://wallet.magiceden.io/download');
                        return null;
                    }
                } catch (error) {
                    console.error('Magic Eden connection error:', error);
                    return null;
                }
            }
        },
        { 
            name: 'OKX',
            icon: "assets/okx.png",
            connect: async () => {
                try {
                    if (window.okxwallet?.bitcoin) {
                        const accounts = await window.okxwallet.bitcoin.requestAccounts();
                        return accounts[0];
                    } else {
                        openWalletWebsite('OKX', 'https://www.okx.com/web3/wallet/download');
                        return null;
                    }
                } catch (error) {
                    console.error('OKX connection error:', error);
                    return null;
                }
            }
        },
        { 
            name: 'Leather',
            icon: "assets/leather.png",
            connect: async () => {
                try {
                    if (window.leather) {
                        return await connectLeather(window.leather);
                    } else if (window.leatherProvider) {
                        return await connectLeather(window.leatherProvider);
                    } else if (window.stacks) {
                        return await connectLeather(window.stacks);
                    } else {
                        openWalletWebsite('Leather', 'https://leather.io/install-extension');
                        return null;
                    }
                } catch (error) {
                    console.error('Leather connection error:', error);
                    return null;
                }
            }
        }
    ];

    // Fonctions d'aide pour la connexion
    async function connectXverse(provider) {
        if (provider.getAccounts) {
            const accounts = await provider.getAccounts();
            return accounts[0];
        } else if (provider.request) {
            const accounts = await provider.request({ method: 'getAccounts' });
            return accounts[0];
        }
        return null;
    }

    async function connectMagicEden(provider) {
        if (provider.getAccounts) {
            const accounts = await provider.getAccounts();
            return accounts[0];
        } else if (provider.request) {
            const accounts = await provider.request({ method: 'getAccounts' });
            return accounts[0];
        }
        return null;
    }

    async function connectLeather(provider) {
        if (provider.getAccounts) {
            const accounts = await provider.getAccounts();
            return accounts[0];
        } else if (provider.request) {
            const accounts = await provider.request({ method: 'getAccounts' });
            return accounts[0];
        } else if (provider.connect) {
            await provider.connect();
            const account = provider.addresses?.mainnet;
            return account;
        }
        return null;
    }

    function openWalletWebsite(walletName, url) {
        const confirmed = confirm(`${walletName} n'a pas été détecté. Souhaitez-vous visiter le site de ${walletName} pour l'installer?`);
        if (confirmed) {
            window.open(url, '_blank');
        }
    }

    // Raccourcir l'adresse
    function shortenAddress(address) {
        if (!address) return "";
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    }

    // Initialiser la modal avec les options de portefeuille
    function initWalletModal() {
        if (!walletOptionsContainer) return;
        
        // Vider le conteneur
        walletOptionsContainer.innerHTML = '';
        
        // Ajouter chaque option de portefeuille
        wallets.forEach((wallet, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'wallet-option';
            optionElement.setAttribute('data-wallet', index);
            optionElement.innerHTML = `
                <span class="wallet-option-name">${wallet.name}</span>
                <img src="${wallet.icon}" alt="${wallet.name}" class="wallet-option-icon" onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2224%22 height=%2224%22 viewBox=%220 0 24 24%22><rect width=%2224%22 height=%2224%22 fill=%22%23ddd%22/><text x=%2212%22 y=%2216%22 font-size=%2212%22 text-anchor=%22middle%22 fill=%22%23333%22>${wallet.name[0]}</text></svg>';">
            `;
            walletOptionsContainer.appendChild(optionElement);
        });
        
        // Ajouter les écouteurs d'événements
        walletOptionsContainer.querySelectorAll('.wallet-option').forEach(option => {
            option.addEventListener('click', async () => {
                const walletIndex = option.getAttribute('data-wallet');
                const wallet = wallets[walletIndex];
                
                try {
                    const address = await wallet.connect();
                    if (address) {
                        if (walletAddressDisplay) {
                            walletAddressDisplay.textContent = `Connecté avec ${wallet.name}: ${shortenAddress(address)}`;
                        }
                        connectButton.textContent = 'Connecté';
                        connectButton.classList.add('connected');
                        closeWalletModal();
                    }
                } catch (error) {
                    console.error('Erreur de connexion:', error);
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
        connectButton.addEventListener('click', openWalletModal);
        
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

    // Débogage des portefeuilles disponibles
    function debugWalletAvailability() {
        console.log('Débogage des portefeuilles Bitcoin :');
        console.log('Xverse:', window.XverseProvider || window.bitcoinProvider ? 'Disponible' : 'Non détecté');
        console.log('Unisat:', window.unisat ? 'Disponible' : 'Non détecté');
        console.log('Magic Eden:', window.magicEden || window.magicEdenWallet ? 'Disponible' : 'Non détecté');
        console.log('OKX:', window.okxwallet?.bitcoin ? 'Disponible' : 'Non détecté');
        console.log('Leather/Stacks:', window.leather || window.stacks ? 'Disponible' : 'Non détecté');
    }

    // Initialisation
    initWalletModal();
    initEventListeners();
    debugWalletAvailability();

    console.log('Script de connexion de portefeuille initialisé');
});
