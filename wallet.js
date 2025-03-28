// wallet.js - Gestion de la connexion aux portefeuilles

document.addEventListener('DOMContentLoaded', function() {
  // Définir les options de portefeuille
  const walletOptions = [
    {
      name: "Xverse",
      icon: "assets/xverse.svg",
    },
    {
      name: "Unisat",
      icon: "assets/unisat.png",
    },
    {
      name: "Magic Eden",
      icon: "assets/magic-eden.png",
    },
    {
      name: "OKX",
      icon: "assets/okx.png",
    },
    {
      name: "Leather",
      icon: "assets/leather.png",
    }
  ];

  // Récupérer les éléments du DOM
  const connectButton = document.getElementById('connect-wallet-btn');
  const modal = document.getElementById('wallet-modal');
  const closeButton = document.querySelector('.close-modal');
  const walletOptionsContainer = document.querySelector('.wallet-options');

  // Créer les options de portefeuille dans la modal
  walletOptions.forEach(wallet => {
    const optionElement = document.createElement('div');
    optionElement.className = 'wallet-option';
    optionElement.innerHTML = `
      <span class="wallet-option-name">${wallet.name}</span>
      <img src="${wallet.icon}" alt="${wallet.name}" class="wallet-option-icon">
    `;
    
    // Gérer le clic sur une option de portefeuille
    optionElement.addEventListener('click', function() {
      connectWallet(wallet.name);
      modal.style.display = 'none';
    });
    
    walletOptionsContainer.appendChild(optionElement);
  });

  // Ouvrir la modal quand on clique sur le bouton connect
  connectButton.addEventListener('click', function() {
    modal.style.display = 'block';
  });

  // Fermer la modal quand on clique sur le X
  closeButton.addEventListener('click', function() {
    modal.style.display = 'none';
  });

  // Fermer la modal quand on clique en dehors
  window.addEventListener('click', function(event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });

  // Fonction pour connecter le portefeuille (simulation)
  function connectWallet(walletName) {
    console.log(`Connecting to ${walletName}...`);
    
    // Dans une vraie implémentation, vous utiliseriez les bibliothèques
    // spécifiques pour chaque portefeuille ici
    
    // Exemple avec Xverse (si vous aviez la bibliothèque)
    /*
    if (walletName === "Xverse") {
      // Code de connexion à Xverse
    }
    */
    
    // Après une connexion réussie, vous pourriez:
    // 1. Stocker des informations dans le localStorage
    // 2. Mettre à jour l'interface utilisateur
    // 3. Afficher l'adresse du portefeuille, etc.
    
    alert(`Connexion à ${walletName} simulée avec succès!`);
    
    // Changer le texte du bouton après connexion
    connectButton.textContent = 'CONNECTED';
    connectButton.classList.add('connected');
  }
});