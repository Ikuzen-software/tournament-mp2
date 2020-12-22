Site d'organisation de tournois


Le projet vise à créer un site permettant aux utilisateurs d'organiser et de participer à leurs propres tournois.
Que ce soit pour mesurer le talent de sportifs, de jeux vidéos ou autres jeux de reflexion, tout tournoi demande une organisation.
L'idée d'un site qui permet d'organiser ses tournois pourrait satisfaire de nombreux types d'utilisateurs.
Il remplirait plusieurs besoin :
- donner de la visibilité à son tournoi
- faciliter les organisateurs, en leur donnant des outils pour organiser leur tournoi plus simplement (outils graphiques, seeding etc)
- gerer les inscriptions avec un systeme d'authentification (il faudra être connecté pour participer)
- stocker et traiter les données des resultats de tournois plus simplement.
Il existe déjà des applications de ce genre (challonge étant le plus connu et le plus utilisé).
Mais il est toujours possible de se demarquer en ajoutant differentes fonctionnalités.
Il existe de nombreuses alternatives, notamment des sites qui rajoutent leur propre plateforme de paiement pour les tournois.

L'application aura à terme pour but d'être utilisable n'importe où (chez soi, sur un lieu de tournoi, depuis le mobile d'un participant ...)

Les fonctionnalités du MVP :
avoir 3 roles d'utilisateurs : admin, organisateur et participant
possibilité de s'inscrire avec un mail.
en tant qu'organisateur, possibilité de créer un tournoi.
en tant que participant possibilité de participer à un tournoi.
au minimum 3 types de tournois : round robin, single elimination et double elimination bracket
Avoir une representation graphique des tournois dynamiques.
Specifications :

front :
-> page d'accueil avec inscription/login, onglets pour differentes rubriques.
-> composants permettant de representer les arbres de tournoi.

En temps qu'admin : possibilité de voir tout le contenu (liste complete membres/tournois, tournois privés).
possibilité de modifier, supprimer des tournois, des membres etc.

En tant que membre : 
possibilité de créer un tournoi.
de rejoindre un tournoi.
être notifié quand un tournoi commence, quand son match commence etc...
possibilité d'être notifié par mail.


API :
RESTFUL
avec swagger
le role organisateur a accès à toutes les requetes de gestion de données du tournoi qu'il organise.
le role participant peut avoir accès aux requetes put pour les matchs qu'il a en cours.

Les données representants les arbres de tournois devront être serialisables (exportable en fichier)


1 - Pitcher son projet
Presentation (les besoins etc)

2 - La typologie des utilisateurs (visiteurs anonymes, qui se connectent/s'inscrivent)
ex : ce qui s'affiche pour quel utilisateur (mdp oublié, s'inscrire, participer à un chat)
faire une matrice de role

3 -liste des fonctionnalités
(pour les complexes, faire un mockup/wireframe par ex)


Pour la BDD, lister les entités, dictionnaire de données.
UML
quel systeme de bdd utiliser

TEST SCENARI

SCENARIO 
NOM: créer un tournoi
DESCRIPTION: En tant qu'utilisateur, créer un tournoi depuis le page tournament-list, remplir le formulaire de création et valider.

cas 1 : nom de tournoi déjà pris
Input - name : my tournament
        game : some game
        format: simple-elimination
        tournament size: 4
        tournament start: 11/30/2020
Ouput - bouton de formulaire non clickable -> formulaire reactive non valide, et case du formulaire en surbrillance rouge
Resultat - formulaire non valide

cas 2: date de tournoi dans le passé
Input - name : my other tournament
        game : some game
        format: simple-elimination
        tournament size: 4
        tournament start: 11/30/1900
Ouput - bouton de formulaire non clickable -> formulaire reactive non valide, et case du formulaire en surbrillance rouge
Resultat - formulaire non valide

SCENARIO 
NOM: Participer à un tournoi
DESCRIPTION: En tant qu'utilisateur, participer à un tournoi sur la page de detail d'un tournoi

cas 1 : le tournoi est complet
Input - none 
Ouput - bouton participer non visible -> isParticipating is false
Resultat - bouton participer non visible

cas 2 : tournoi non complet
Input - none 
Ouput - bouton participer visible -> isParticipating is true
Resultat - bouton participer visible

SCENARIO 
NOM: valider le resultat d'un match
DESCRIPTION: En tant qu'utilisateur et organisateur d'un tournoi, je veux valider le resultat d'un match après avoir rempli le formulaire du score.

cas 1 : je met un score egal des deux côtés
Input - 3 - 3
Ouput - bouton valider le score non clickable - formulaire non valide
Resultat - bouton valider le score non clickable

cas 2 : je met un score superieur à l'autre
Input - 3-0 
Ouput - bouton valider clickable -> valider rend le joueur 1 gagnant, et fait avancer le tournoi
Resultat - bouton valider clickable, et rend le joueur 1 gagnant. Update l'affichage de l'arbre.





