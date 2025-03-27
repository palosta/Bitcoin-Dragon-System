document.addEventListener('DOMContentLoaded', () => {
    const connectButton = document.getElementById('connect-wallet-btn');
    const walletAddressDisplay = document.getElementById('wallet-address');

    if (!connectButton) {
        console.error('Bouton de connexion non trouvé');
        return;
    }

    // Configuration des portefeuilles
    const wallets = [
        { 
            name: 'Xverse', 
            connect: async () => {
                try {
                    if (!window.XverseProvider) {
                        console.log('Xverse wallet not detected');
                        return null;
                    }
                    const accounts = await window.XverseProvider.request({
                        method: 'getAccounts'
                    });
                    return accounts[0];
                } catch (error) {
                    console.error('Xverse connection error:', error);
                    return null;
                }
            }
        },
        { 
            name: 'Unisat', 
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
            name: 'MagicEden', 
            connect: async () => {
                try {
                    if (!window.magicEden) {
                        console.log('MagicEden wallet not detected');
                        return null;
                    }
                    const accounts = await window.magicEden.request({
                        method: 'getAccounts'
                    });
                    return accounts[0];
                } catch (error) {
                    console.error('MagicEden connection error:', error);
                    return null;
                }
            }
        },
        { 
            name: 'OKX', 
            connect: async () => {
                try {
                    if (!window.okxwallet?.bitcoin) {
                        console.log('OKX wallet not detected');
                        return null;
                    }
                    const accounts = await window.okxwallet.bitcoin.requestAccounts();
                    return accounts[0];
                } catch (error) {
                    console.error('OKX connection error:', error);
                    return null;
                }
            }
        }
    ];
    // Fonction de débogage pour vérifier les objets globaux
                    function debugWalletAvailability() {
                        console.log('Débogage des portefeuilles Bitcoin :');
                        console.log('Xverse:', window.XverseProvider ? 'Disponible' : 'Non détecté');
                        console.log('Unisat:', window.unisat ? 'Disponible' : 'Non détecté');
                        console.log('MagicEden:', window.magicEden ? 'Disponible' : 'Non détecté');
                        console.log('OKX:', window.okxwallet?.bitcoin ? 'Disponible' : 'Non détecté');                
    }

    // Ajoutez cette ligne à votre script existant
    debugWalletAvailability();
});
    // Créer le popup de sélection de portefeuille
    function createWalletPopup() {
        // Vérifier si le popup existe déjà
        if (document.getElementById('wallet-popup')) return;

        const popup = document.createElement('div');
        popup.id = 'wallet-popup';
        popup.innerHTML = `
            <div class="wallet-popup-overlay">
                <div class="wallet-popup-content">
                    <h2>Sélectionnez un portefeuille</h2>
                    <div class="wallet-list">
                        ${wallets.map((wallet, index) => `
                            <button class="wallet-option" data-wallet="${index}">
                                ${wallet.name}
                            </button>
                        `).join('')}
                    </div>
                    <button id="close-popup">Fermer</button>
                </div>
            </div>
        `;
        document.body.appendChild(popup);

        // Gestion des événements de connexion
        popup.querySelectorAll('.wallet-option').forEach(button => {
            button.addEventListener('click', async () => {
                const walletIndex = button.getAttribute('data-wallet');
                const wallet = wallets[walletIndex];
                
                try {
                    const address = await wallet.connect();
                    if (address) {
                        if (walletAddressDisplay) {
                            walletAddressDisplay.textContent = `Connecté avec ${wallet.name}: ${shortenAddress(address)}`;
                        }
                        document.body.removeChild(popup);
                    } else {
                        alert('Échec de la connexion. Vérifiez que le portefeuille est installé.');
                    }
                } catch (error) {
                    console.error('Erreur de connexion:', error);
                    alert('Une erreur est survenue lors de la connexion.');
                }
            });
        });

        // Fermeture du popup
        const closeButton = document.getElementById('close-popup');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                document.body.removeChild(popup);
            });
        }
    }

    // Raccourcir l'adresse
    function shortenAddress(address) {
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    }

    // Ajout de l'écouteur d'événements sur le bouton de connexion
    connectButton.addEventListener('click', createWalletPopup);

    console.log('Script de connexion de portefeuille initialisé');
});
