# emn-a3-dev-fest-app

## Description
Cette application a été élaborée durant un cours d'application multiplateforme. Le but était d'élaborer une petite appli' mobile avec cordova pour se familiariser avec Cordova

## Architecture
Les scripts sont organisés en factories et controllers. Les factories servent à alléger au maximum les contrôleurs et à être réutilisables.

## Ce qui a été fait
* Page de garde avec logo de l'école, liens vers les présentations et présentateurs
* Visualisation de la liste des présentations et des présentateurs
* Détail d'une présentation, avec possibilité de naviguer vers les présentateurs associés + affichages de différentes infos (salle, horaire, langue)
* Détail d'un présentateur, avec possibilité de naviguer vers la présentation associée
* Ajout / suppression du présentateur dans les contacts du téléphone avec notification de validation ou erreur
* Possibilité de créer plusieurs notes pour une même présentation
* Dans chaque note, constituée d'un titre et de la note en question, on peut ajouter plusieurs images / vidéos / sons liés à cette note
* La suppression d'une note engendre la suppression de tous les médias liés à celle-ci dans la base sqlite


## Points d'amélioration
* Utiliser des constantes (nom de tables, chemin vers le json des données, durée des dialogs, etc)
