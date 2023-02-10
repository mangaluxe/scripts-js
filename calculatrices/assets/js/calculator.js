"use strict";

let i;
let contents;
let lastcontent;
let historic = []; // Tableau qui va stocker toutes les opérations
const calcOut = document.querySelector(".calc-out");
const calcHist = document.querySelector(".calc-hist");
const calcKeys = document.querySelectorAll(".calc-key > .key");
const negative = document.getElementById("negative");
const erase = document.getElementById("erase");
const c = document.getElementById("c");
const calc = document.getElementById("calc");

if (calc) {

    // ----- Pour éviter plusieurs fois les opérateurs. Fonction pour vérifier dernière entrée -----

    // function checkLast() {
    //     if ( (calcOut.textContent.slice(-1) === "+") || (calcOut.textContent.slice(-1) === "-") || (calcOut.textContent.slice(-1) === "*") || (calcOut.textContent.slice(-1) === "/") || (calcOut.textContent.slice(-1) === ".") ) {
    //         calcOut.textContent = calcOut.textContent.slice(0, -1); // Effacer dernier caractère si c'est un opérateur +-*/.
    //     }
    // }

    // Plus court avec Regex :

    /**
    * Evite +-/* plusieurs fois de suite
    */
    function checkLast(str) {
        if (/[\+\-\*\/]$/.test(calcOut.textContent)) { // $ pour fin de chaîne. test() vérifie s'il y a une correspondance entre un texte et un regex
            calcOut.textContent = calcOut.textContent.slice(0, -1); // Effacer dernier caractère si c'est un opérateur +-*/.
        }
    }

    /**
    * Evite doublon pour le point
    * (Exemples: 1.5 + 2.2 est autorisé. 1.5 + 2.2.2 est interdit)
    */
    function checkDouble() {
        contents = calcOut.textContent;

        let array = contents.split(/[+\-*/]/); // On coupe entre + - * et /
        // console.log(array); // Exemple: Si contents = "12 + 4 - 5 / 2 * 3", alors on obtient un tableau comme: ["12", "4", "5", "2", "3"]
        let last = array[array.length-1];
        // console.log(last); // Exemple: 3

        if (/[.]/.test(last)) { // $ pour fin de chaîne. test() vérifie s'il y a une correspondance entre un texte et un regex
            lastcontent = "";
        }
    }

    /**
    * Vérifier une opération mathématique valide
    * @param string input
    * @return bool
    */
    function validateExpression(ex) {
        return /^[\d().+\-*/]+$/.test(ex); // Ceci affiche une erreur qui bloque le script si on met une opération comme 1+A. Il faudra utiliser un try et catch
    }


    // ----- Calcul = -----

    /**
    * Calculer et afficher résultat
    */
    function calcul() {
        checkLast(); // Efface le dernier caractère si c'est un opérateur +-*/

        // console.log(validateExpression(calcOut.textContent));

        try {
            (validateExpression(calcOut.textContent));
        }
        catch (error) {
            return false; // Arrête la fonction si erreur
        }

        let resultatBrut = calcOut.textContent;      

        // let resultat = eval(resultatBrut); // eval() permet de calculer, sinon il va afficher 1+1 = 1+1 au lieu 2

        let resultat;
        try {
            resultat = new Function(`return ${resultatBrut}`)();
        }
        catch (error) {
            resultat = NaN;
        }

        // console.log(eval("1.22+1")); // eval() bug sur certains calculs. Exemple: 1.22+1 = 2.2199999999999998
        // console.log(resultatBrut);
        // console.log(resultat);

        // Afficher résultat du calcul :
        if (typeof resultat !== "undefined" && !isNaN(resultat)) { /* Pour éviter d'afficher undefined quand on clique uniquement sur = */
            calcOut.textContent = resultat;
        }

        // Afficher résultat dans l'historique :
        if ((Number(resultatBrut) !== resultat) && (typeof resultat !== "undefined") && (!isNaN(resultat))) { /* Pour éviter d'afficher plusieurs fois dans l'historique quand on reclique sur = */
            historic.push(resultatBrut + " = " + resultat);
            // console.log(historic);

            historic = historic.slice(-3); // Garder que les 3 derniers
            // console.log(historic);
        }

        calcHist.textContent = "";
        for (i = 0; i < historic.length; i++) {
            calcHist.innerHTML += historic[i] + "<br>";
        }
         
    }

    calc.addEventListener("click", calcul); // Clic sur =

    // ----- Au clic sur les boutons -----

    for (i = 0; i < calcKeys.length; i++) { // On fait une boucle pour viser toutes les touches de la calculatrice
        calcKeys[i].addEventListener("click", function () {
            lastcontent = this.textContent;

            lastcontent = lastcontent.replace(/×/g, '*').replace(/÷/g, '/'); // Remplacer × ÷

            // if ((lastcontent === "+") || (lastcontent === "-") || (lastcontent === "*") || (lastcontent === "/")) {
            if (["+", "-", "*", "/"].includes(lastcontent)) {
                checkLast(); // Pour éviter plusieurs fois les opérateurs +-*/
            }

            if (lastcontent === ".") {
                checkDouble(); // Pour éviter le point en doublon
            }

            calcOut.textContent += lastcontent;
        });
    }

    // ----- Nombre négatif -----

    negative.addEventListener("click", function () {
        contents = calcOut.textContent;

        let array = contents.split(/[+\-*/]/); // On coupe entre + - * et /
        // console.log(array); // Exemple: Si contents = "12 + 4 - 5 / 2 * 3", alors on obtient un tableau comme: ["12", "4", "5", "2", "3"]
        let last = array[array.length-1];
        // console.log(last); // Exemple: 3

        let neg = (-last);
        calcOut.textContent = contents.replace(last, neg);
        
    });

    // ----- Efface dernière entrée -----

    erase.addEventListener("click", function () {
        calcOut.textContent = calcOut.textContent.slice(0, -1); // Efface dernier caractère
    });

    // ----- Clear -----

    c.addEventListener("click", function () {
        if (calcOut.textContent === "") {
            calcHist.textContent = ""; // Vider historique
            historic = [];
        }
        else {
            calcOut.textContent = ""; // Vider champ input
        }
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