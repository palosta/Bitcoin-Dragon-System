// staking-system.js
// Gestion du staking des ordinals Bitcoin Dragon System

// Importer les dépendances
import walletConnector from './bitcoin-wallet-connection.js';

class OrdinalStakingSystem {
  constructor() {
    this.stakingEnabled = true; // Flag pour activer/désactiver le système
    this.stakedOrdinals = [];
    this.stakingRates = {
      //