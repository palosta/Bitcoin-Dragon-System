document.addEventListener("DOMContentLoaded", async function () {
    console.log("Page chargée !");
    
    // Vérifier si SatsConnect est bien chargé
    if (typeof SatsConnect === "undefined") {
        console.error("SatsConnect n'est pas disponible !");
        return;
    }

    // Sélectionner le bouton
    const connectButton = document.getElementById("connectWallet");

    connectButton.addEventListener("click", async () => {
        try {
            console.log("Tentative de connexion au wallet...");

            const response = await SatsConnect.connect({
                payload: { purposes: ["ordinals", "payment"], message: "Connect to Bitcoin Dragon System" },
                onFinish: (response) => {
                    console.log("Connexion réussie :", response);
                    const userAddress = response.address;
                    checkOGEggs(userAddress);
                },
                onCancel: () => {
                    console.warn("Connexion annulée !");
                }
            });

        } catch (error) {
            console.error("Erreur lors de la connexion :", error);
        }
    });

    async function checkOGEggs(address) {
        console.log("Vérification des OG Eggs pour :", address);
        
        const collectionSlug = "og-eggs";  // Remplace par le bon slug
        const apiUrl = `https://api.magiceden.io/v2/ordinals/tokens/${address}`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            const ownsOGEgg = data.some(token => token.collection === collectionSlug);

            if (ownsOGEgg) {
                alert("Félicitations, vous possédez un OG Egg !");
            } else {
                alert("Désolé, vous ne possédez pas de OG Egg.");
            }

        } catch (error) {
            console.error("Erreur lors de la vérification :", error);
        }
    }
});
