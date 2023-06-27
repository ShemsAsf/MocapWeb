#Mocap Project
#####Asfouri Shems

# Description du projet

Le projet consiste en un site web qui permet de prendre des vidéos contenant une personne, d'enregistrer les mouvements en 3D et de les visualiser. Le site web utilise un serveur Flask avec un script Python pour scanner les vidéos et les convertir en mouvements 3D. La visualisation des mouvements se fait à l'aide de la librairie THREE de JavaScript.

## Fonctionnalités

Le site web permet de :

- Télécharger une vidéo en format .mp4 contenant une personne.
- Scanner la vidéo pour détecter les mouvements de la personne et les enregistrer en 3D.
- Visualiser les mouvements en 3D dans le navigateur à l'aide de JavaScript.

## Utilisation

Pour utiliser le site web, il suffit de suivre les étapes suivantes :

1. Télécharger une vidéo en format .mp4 contenant une personne.
2. Charger la vidéo sur le site web à l'adresse index.html.
3. Donnez lui un titre.
4. Cliquer sur le bouton "Submit" pour détecter les mouvements de la personne. (cette etape prends un peu de temps)
5. Une fois les mouvements détectés, cliquer sur le nom de votre vichier sur dans la barre de gauche pour le visualiser en 3D dans le navigateur.
6. Vous pouvez par la suie supprimer votre fichier en cliquant sur le boutton prévue a cet effet.

## Limitations

Le projet ne permet de scanner que des vidéos contenant une personne et en format .mp4. Il est donc important de vérifier que la vidéo respecte ces critères avant de la charger sur le site web. De plus, la détection des mouvements peut ne pas fonctionner correctement si la qualité de la vidéo est trop faible ou si la personne n'est pas bien visible.

## Développement

Le site web a été développé en utilisant les technologies suivantes :

- Python 3.10.11
- Flask
- OpenCV
- Three.js
- JavaScript
- Json

Il a ètè developpé et testé dans un environnement windows uniquement.
Pour installer les dépendances nécessaires au projet, il suffit d'exécuter la commande suivante :

```
python -m venv venv
cd ./venv/
pip install -r requirements.txt
```
Si python3 n'est pas installé chez vous, installez le à [cette adresse](https://www.python.org/downloads/windows/) (faites attention a la version)

Afin de démarrer le serveur Flask, ouvrez le fichier dans le cmd et entrez les commandes suivante :

```
python -m flask run
```

## Auteur

Ce projet a été développé par ASFOURI Shems dans le cadre du projet TER de 3eme année au sein du cursus informatique à la facultée des sciences de Montpellier.
