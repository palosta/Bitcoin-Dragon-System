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

    // Configuration des portefeuilles avec leurs icônes
    const wallets = [
        { 
            name: 'Xverse',
            icon: "assets/xverse.png",
            iconType: "png",
            connect: async () => {
                try {
                    // Vérifiez plusieurs façons d'accéder à Xverse
                    const provider = window.XverseProviders?.BitcoinProvider || 
                                    window.XverseProvider || 
                                    window.bitcoinProvider;
                    
                    if (!provider) {
                        console.log('Xverse wallet not detected. Available window objects:', Object.keys(window).filter(k => k.includes('Xverse')));
                        return null;
                    }
                    
                    console.log('Xverse provider found:', provider);
                    
                    // Essayer différentes méthodes
                    let accounts;
                    if (provider.getAccounts) {
                        accounts = await provider.getAccounts();
                    } else if (provider.request) {
                        accounts = await provider.request({ method: 'getAccounts' });
                    } else if (provider.connect) {
                        await provider.connect();
                        accounts = await provider.getAccounts();
                    }
                    
                    console.log('Xverse accounts:', accounts);
                    return accounts && accounts.length > 0 ? accounts[0] : null;
                } catch (error) {
                    console.error('Xverse connection error:', error);
                    return null;
                }
            }
        },
        { 
            name: 'Unisat',
            icon: "assets/unisat.png",
            iconType: "png",
            connect: async () => {
                try {
                    if (!window.unisat) {
                        console.log('Unisat wallet not detected');
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
            iconType: "png",
            connect: async () => {
                try {
                    // Vérifier différentes façons dont Magic Eden peut s'exposer
                    const provider = window.magicEden || 
                                    window.magicEdenWallet || 
                                    window.bitcoin?.magicEden ||
                                    window.MagicEden;
                    
                    if (!provider) {
                        console.log('Magic Eden wallet not detected. Available window objects:', 
                            Object.keys(window).filter(k => k.toLowerCase().includes('magic')));
                        return null;
                    }
                    
                    console.log('Magic Eden provider found:', provider);
                    
                    // Essayer différentes méthodes de connexion
                    let accounts;
                    if (provider.getAccounts) {
                        accounts = await provider.getAccounts();
                    } else if (provider.request) {
                        accounts = await provider.request({ method: 'getAccounts' });
                    } else if (provider.requestAccounts) {
                        accounts = await provider.requestAccounts();
                    } else if (provider.connect) {
                        await provider.connect();
                        accounts = await provider.getAddress ? [await provider.getAddress()] : [];
                    }
                    
                    console.log('Magic Eden accounts:', accounts);
                    return accounts && accounts.length > 0 ? accounts[0] : null;
                } catch (error) {
                    console.error('Magic Eden connection error:', error);
                    return null;
                }
            }
        },
        { 
            name: 'OKX',
            icon: "assets/okx.png",
            iconType: "png",
            connect: async () => {
                try {
                    const provider = window.okxwallet?.bitcoin || window.bitcoin?.okx;
                    if (!provider) {
                        console.log('OKX wallet not detected');
                        return null;
                    }
                    const accounts = await provider.requestAccounts();
                    return accounts[0];
                } catch (error) {
                    console.error('OKX connection error:', error);
                    return null;
                }
            }
        },
        { 
            name: 'Leather',
            icon: "assets/leather.png",
            iconType: "png",
            connect: async () => {
                try {
                    // Vérifier différentes façons dont Leather peut s'exposer
                    const provider = window.leather || 
                                    window.leatherProvider || 
                                    window.StacksProvider ||
                                    window.bitcoin?.leather ||
                                    window.stacks;
                    
                    if (!provider) {
                        console.log('Leather wallet not detected. Available window objects:', 
                            Object.keys(window).filter(k => k.toLowerCase().includes('leather') || 
                                                        k.toLowerCase().includes('stacks')));
                        return null;
                    }
                    
                    console.log('Leather provider found:', provider);
                    
                    // Essayer différentes méthodes de connexion
                    let accounts;
                    if (provider.getAccounts) {
                        accounts = await provider.getAccounts();
                    } else if (provider.request) {
                        accounts = await provider.request({ method: 'getAccounts' });
                    } else if (provider.requestAccounts) {
                        accounts = await provider.requestAccounts();
                    } else if (provider.connect) {
                        await provider.connect();
                        accounts = await provider.getAddress ? [await provider.getAddress()] : [];
                    }
                    
                    console.log('Leather accounts:', accounts);
                    return accounts && accounts.length > 0 ? accounts[0] : null;
                } catch (error) {
                    console.error('Leather connection error:', error);
                    return null;
                }
            }
        }
    ];

    // Fonction de débogage pour vérifier les objets globaux
    function debugWalletAvailability() {
        console.log('Débogage des portefeuilles Bitcoin :');
        
        // Xverse
        console.log('Xverse présence:', window.XverseProvider ? 'XverseProvider trouvé' : 'XverseProvider non trouvé');
        console.log('Bitcoin provider:', window.bitcoinProvider ? 'bitcoinProvider trouvé' : 'bitcoinProvider non trouvé');
        
        // Unisat
        console.log('Unisat présence:', window.unisat ? 'Trouvé' : 'Non trouvé');
        
        // Magic Eden
        console.log('Magic Eden présence:', window.magicEden ? 'magicEden trouvé' : 'magicEden non trouvé');
        console.log('Magic Eden wallet:', window.magicEdenWallet ? 'magicEdenWallet trouvé' : 'magicEdenWallet non trouvé');
        
        // OKX
        console.log('OKX présence (bitcoin):', window.okxwallet?.bitcoin ? 'okxwallet.bitcoin trouvé' : 'okxwallet.bitcoin non trouvé');
        console.log('OKX présence (alt):', window.bitcoin?.okx ? 'bitcoin.okx trouvé' : 'bitcoin.okx non trouvé');
        
        // Leather
        console.log('Leather présence:', window.leather ? 'leather trouvé' : 'leather non trouvé');
        console.log('Leather provider:', window.leatherProvider ? 'leatherProvider trouvé' : 'leatherProvider non trouvé');
        
        // Log tous les objets window qui contiennent "bitcoin"
        console.log('Tous les objets bitcoin possibles:');
        Object.keys(window).filter(key => 
            key.toLowerCase().includes('bitcoin') || 
            key.toLowerCase().includes('wallet') || 
            key.toLowerCase().includes('xverse') || 
            key.toLowerCase().includes('magic') ||
            key.toLowerCase().includes('leather') ||
            key.toLowerCase().includes('stacks')
        ).forEach(key => {
            console.log(`- ${key} trouvé`);
        });
    }

    // Raccourcir l'adresse
    function shortenAddress(address) {
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
                <img src="${wallet.icon}" alt="${wallet.name}" class="wallet-option-icon">
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
                        // Changer l'apparence du bouton
                        connectButton.textContent = 'Connecté';
                        connectButton.classList.add('connected');
                        closeWalletModal();
                    } else {
                        alert('Échec de la connexion. Vérifiez que le portefeuille est installé.');
                    }
                } catch (error) {
                    console.error('Erreur de connexion:', error);
                    alert('Une erreur est survenue lors de la connexion.');
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

    // Initialisation
    initWalletModal();
    initEventListeners();
    debugWalletAvailability();

    console.log('Script de connexion de portefeuille initialisé');
});
