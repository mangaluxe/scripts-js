"use strict";

let i;
let lastcontent;
const calcOut = document.querySelector(".calc-out");
const calcKeys = document.querySelectorAll(".calc-key > .key");
const erase = document.getElementById("erase");
const c = document.getElementById("c");
const soldes = document.getElementById("soldes");
const initial = document.getElementById("initial");

if (soldes) {

    /**
    * Evite doublon pour le point
    * (Exemples: 1.5 + 2.2 est autorisé. 1.5 + 2.2.2 est interdit)
    */
    function checkDouble() {
        const contents = calcOut.textContent;

        let array = contents.split(/[+\-*/]/);
        // console.log(array); // Exemple: Si contents = "12 + 4 - 5 / 2 * 3", alors on obtient un tableau comme: ["12", "4", "5", "2", "3"]
        let last = array[array.length-1];
        // console.log(last); // Exemple: 3

        if (/[.]/.test(last)) { // $ pour fin de chaîne. test() vérifie s'il y a une correspondance entre un texte et un regex
            lastcontent = "";
        }
    }

    /**
    * Vérifier un nombre décimal valide
    * @param string input
    * @return bool
    */
    function validNumber(input) {
        return /^\d+\.?\d+$/.test(input); // + pour 1 ou plusieurs. ? pour 0 ou 1.
    }


    // ----- Affichage prix soldés -----

    /**
    * Calculer et afficher les prix soldés
    */
    function calcSoldes() {
        let calcType = document.querySelector("input[name=calc-type]:checked").value; // Compatible IE9+
        // console.log(calcType); // "soldes" ou "initial"

        try { // On teste avec try & catch, car validNumber(ABC) renvoi une erreur
            (validNumber(calcOut.textContent));
        }
        catch (error) {
            return false; // Arrête la fonction si erreur
        }

        let calcContent = calcOut.textContent;
        
        if (isNaN(calcContent)) { // Si calcContent est NaN
            return; // Arrete la fonction
        }
        // console.log(calcContent);

        if (calcContent !== "") { /* Si le champ n'est pas vide */
            document.querySelector(".calc-screen-soldes-2 > div").classList.remove("invisible");
        }
        else {
            document.querySelector(".calc-screen-soldes-2 > div").classList.add("invisible");
        }

        if (calcType === "soldes") {
            document.getElementById("calc_type_text").classList.add("hidden");

            // document.getElementById("output10").innerText = (calcContent-(calcContent*10)/100).toFixed(2)+" €"; // toFixed(2) pour garder 2 chiffres après la virgule
            // document.getElementById("output20").innerText = (calcContent-(calcContent*20)/100).toFixed(2)+" €";
            // document.getElementById("output30").innerText = (calcContent-(calcContent*30)/100).toFixed(2)+" €";

            // Plus court :
            for (i = 10; i <= 90; i += 10) {
                let outputId = "output" + i;
                let discount = calcContent * i / 100;
                let discountedPrice = calcContent - discount;
                document.getElementById(outputId).innerText = discountedPrice.toFixed(2) + " €";
            }
        }
        else if (calcType === "initial") {
            document.getElementById("calc_type_text").classList.remove("hidden");

            // document.getElementById("output10").innerText = (calcContent/(1-10/100)).toFixed(2)+" €"; // toFixed(2) pour garder 2 chiffres après la virgule
            // document.getElementById("output20").innerText = (calcContent/(1-20/100)).toFixed(2)+" €";
            // document.getElementById("output30").innerText = (calcContent/(1-30/100)).toFixed(2)+" €";

            // Plus court :
            const reductions = [10, 20, 30, 40, 50, 60, 70, 80, 90];
            reductions.forEach(reduction => {
                const outputId = `output${reduction}`;
                document.getElementById(outputId).innerText = (calcContent / (1 - reduction / 100)).toFixed(2) + " €";
            });

        }
    }

    // ----- Au clic sur les boutons -----

    for (i = 0; i < calcKeys.length; i++) { // On fait une boucle pour viser toutes les calcKeys de la calculatrice
        calcKeys[i].addEventListener("click", function () {
            lastcontent = this.textContent;

            if (lastcontent === ".") {
                checkDouble(); // Pour éviter doublons pour la virgule */.
            }

            calcOut.textContent += lastcontent;
            calcSoldes(); // Appel à la fonction calcSoldes() pour mettre à jour le résultat
        });
    }

    // ----- Au clic sur le bouton Soldes/Prix initial -----

    soldes.addEventListener("click", calcSoldes); // Appel à la fonction calcSoldes() pour mettre à jour le résultat

    initial.addEventListener("click", calcSoldes);

    // ----- Efface dernière entrée -----

    erase.addEventListener("click", function () {
        calcOut.textContent = calcOut.textContent.substring(0, calcOut.textContent.length-1); // Efface dernier caractère
        calcSoldes(); // Appel à la fonction calcSoldes() pour mettre à jour le résultat
    })

    // ----- Clear -----

    c.addEventListener("click", function () {
        calcOut.textContent = ""; // Vider champ input
        calcSoldes(); // Appel à la fonction calcSoldes() pour mettre à jour le résultat
    });
    


    // ----- Ratio d'Aspect des boutons (pour anciens navigateurs qui ne supportent pas encore aspect-ratio en css) -----

    // function keyRatio() {
    //     let w = document.querySelector(".t1").clientWidth;
    //     console.log(w);
    //     w = Math.round(w - w*(20/100));
    //     console.log(w);

    //     const myKey = document.querySelectorAll(".calc-key > div");
    //     for (i = 0; i < myKey.length; i++) {
    //         myKey[i].style.height = w + "px";
    //     }
    // }

    // window.addEventListener("resize", keyRatio);

    // keyRatio(); // Appel à cette fonction une fois au chargement

}