Voici mes slides infinis responsives. Je n’ai trouvé aucun slide infini qui soit responsive sur codepen. J’ai décidé d’en faire moi-même.

La création d’une fonction slider() permet de mettre autant de slides qu’on veut sur une page web. Il prend en entrée un élément "el" qui représente un élément parent contenant toutes les images du slide.

On génère la pagination (les points de navigation) dynamiquement en fonction du nombre d'images avec createElement().

On clone la première et la dernière image pour créer un slide infini.

On peut changer d’images au clic sur les flèches et également sur les points de navigation.

Sur mobile, on peut changer d’images au glissement de doigts.

Pour le slide multi, la fonction slider() prend un 2e paramètre pour le nombre d’images affichées simultanément. Sur mobile ou si vous réduisez la largeur, le slide passe à une image et recrée les points de navigation parce que le nombre d’images à afficher simultanément n’est plus le même.