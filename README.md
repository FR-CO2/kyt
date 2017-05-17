
# KyT
Outil de kanban avec gestion d'imputations

## Les contraintes techniques
### Compatibilités navigateurs 
L'application est compatible avec Edge et 
Firefox et Chrome (dernières versions).

### Serveur
<p>Il faut avoir un JRE (v1.7 au minimum)</p>
L'application se base sur le niveau de maturité Hateoas pour les communications entre le front et le back. <strong>Aussi, il est indispensable de le firewall et le serveur web permettent l'utilisation des mots clefs PUT et DELETE en plus des habituels POST et GET.</strong> 

## Démo 
URL : <a href="https://fr-co2-kyt.herokuapp.com" title="Démo" alt="Démo" target="_blank">https://fr-co2-kyt.herokuapp.com</a><br/>
Utilisateur admin par défaut (username/password) : admin/admin123

## Types des droits
Il existe deux types d'utilisateurs dans l'application : 
* l'administrateur (admin)
* l'utilisateur (user)

L'utilisateur ne peut que modifier les informations liées à son compte.<br/>
En plus des informations liées à son compte, l'administrateur peut ajouter, modifier et supprimer d'autres utilisateurs.

## Partie back-end
Cette partie est accessible en cliquant sur le nom de l'utilisateur connecté.

### Profil
Cette page comporte les informations liées à l'utilisateur connecté.<br/>
Le rôle de l'utilisateur (droit sur l'application) est affiché.<br/>
C'est également sur cette page que l'utilisateur peut modifier son mot de passe, son adresse mail et sa photo de profil.

Les projets rattachés à l'utilisateur y sont listés.

### Administrer utilisateurs
Seul les utilisateurs ayant un rôle administrateur peuvent accéder à cette page. 
Elle permet d'ajouter un nouvel utilisateur (via le bouton <cite>Ajouter</cite>), de modifier l'adresse mail ou le rôle d'un utilisateur existant ou même de le supprimer.

### Paramétrer l'application
Seul les utilisateurs ayant un rôle administrateur peuvent accéder à cette page.

Sur cette page sont présents trois paramètres liés aux imputations :
* name : par défaut la valeur est la journée. 
* step : par défaut la valeur est 0.1. Cette valeur sert à définir l'unité minimale pour les imputations
* max : par défaut la valeur est 1. Cette valeur sert à définir l'unité maximale pour les imputations d'une journée.<br/>

Ces valeurs sont générales à l'application. Toute modification nécessite que les utilisateurs connectés se déconnectent, reconnectent. 

## Partie Front-end

### Dashboard
Cette page est la page sur laquelle arrive l'utilisateur qui vient de se connecter.
Elle est composée de deux blocs : 

#### Mes tâches
Ca regroupe toutes les taches affectées à l'utilisateur, pour tous les projets.<br/>
Si l'utilisateur clique sur une tâche, sa page de modification s'affiche.

#### Mon calendrier
<p>Cette partie de la page comporte le calendrier du mois en cours.<br/>
Il est possible de naviguer entre les mois grâce aux flèches présentes en haut à droit du calendrier. Pour revenir sur le mois courant, il suffit de cliquer sur le bouton <cite>Aujourd'hui</cite>.</p>

<p>C'est aussi par cette page que l'utilisateur s'impute.<br/>
Pour ce faire, il clique sur le jour pour lequel il veut s'imputer. <strong>Il ne faut pas cliquer sur la tâche dans le jour, mais vraiment dans la case du jour.</strong></p>

##### Imputations
La pop up d'imputation s'ouvre lorsqu'on clique dans la case du jour pour lequel on veut s'imputer.<br/>
Soit la tâche est déjà présente, soit on peut la rechercher via le champ de recherche : <cite>Ajouter une tâche</cite>.<br/>
Le maximum de la charge consommée est paramétré dans la partie <cite>Paramétrer l'application</cite>.<br/>
La charge restant correspond au début à la charge totale inscrite sur la tâche. Une fois que l'utilisateur a renseigné une nouvelle charge restante, c'est cette valeur qui sert pour les autres jours non imputés.
 
### Mes projets
#### Projet lié à l'utilisateur
##### Kanban
Cette page est le Kanban du projet.<br/>
Elle a les catégories et les couloirs définis pour le projet.<br/>
L'utilisateur peut déplacer une tâche en la sélectionnant et la relachant dans le couloir et/ou la catégorie. 

##### Liste des tâches
Cette page comporte toutes les tâches du projet.<br/>
Par défaut, 10 tâches apparaient. Il est possible d'en afficher 20 ou mêmes 50 sur la page en cliquant sur la valeur <cite>Nb éléments</cite>.<br/>
Il est possible de modifier une tâche en cliquant sur le bouton <cite>Editer</cite> (apparait au survol de la tâche) et de la supprimer en cliquant sur l'icone de la poubelle (apparait au survol de la tâche).<br/>
Le bouton <cite>Editer</cite> renvoie vers la page de la tâche.

###### Ajout d'une tâche
L'utilisateur arrive sur cette page en cliquant sur un bouton <cite>Nouvelle tâche</cite>.<br/>
Seul le nom de la tâche est obligatoire et son état sera Backlog.<br/>
Les autres champs servent à trier et retrouver plus facilement les tâches dans le kanban.

###### Modification d'une tâche
<p>L'utilisateur arrive sur cette page en cliquant sur la tâche.</br>
Il peut modifier le nom, l'état, le couloir, la catégorie, les personnes assignées, l'urgence, la date de début et celle de fin, la charge totale, les pré-requis (tâche parente), les requis par (tâche enfante), la description et ajouter des commentaires. 
Si des champs personnalisés ont été créés sur le projet, leurs valeurs pour la tâche seront également modifiables.</p>
<p>C'est également sur cette page qu'il pourra voir l'historique des modifications de la tâche.</p>

##### Consommations
<p>Cette page résume les imputations des utilisateurs du projet par semaine. Il est possible de l'avoir par mois, en cliquant sur <cite>Semaine</cite> et en sélectionnant Mois à la place.</p> 

<p>Si la somme des imputations de l'utilisateur pour une journée est inférieure à ce qui est définit dans la partie paramétrage, la valeur apparait en rouge.<br/>
Il est possible d'avoir le détail des imputations en cliquant sur la flèche</p>

#### Paramétrage d'un projet
Pour accéder à la partie paramétrages d'un projet, il faut cliquer sur <cite>Mes projets</cite>,<cite>Administrer les projets</cite> et sur l'icone stylo du projet à administrer.<br/>L'onglet <cite>Mes Administrer les projets</cite> n'est accessible qu'aux administrateurs de l'application.<br/>
C'est également par là qu'on peut supprimer un projet. Pour cela au lieu de cliquer sur l'icone stylo, il suffit de cliquer sur l'icone poubelle.

Un manager peut administrer son projet en allant sur <cite>Mes projets</cite>, en sélectionnant son projet et en cliquant sur <cite>Paramétrage</cite>.

##### Champs personnalisés
Cette page permet d'ajouter des champs personnalisés au projet. 
Il existe trois types de champs personnalisés : 
* texte
* date
* nombre

Chaque champ personnalisable peut être rendu obligatoire ou non, en sélectionnant le champ obligatoire présent dans le formulaire.

##### Catégories
Par défaut, un projet a trois catégories déjà présentes : 
* Issue : pour les anomalies
* Evolution : pour les évolutions
* Assistance : pour les demandes d'assistance

<p>Chacune a une couleur prédéfinie. Il est possible de changer le nom et la couleur des catégories par défaut, mais aussi de les supprimer.</p>
<p>Il est possible d'ajouter de nouvelles catégories. Pour cela, il suffit de cliquer sur le bouton <cite>Nouvelles catégories</cite> et de renseigner son nom et sa couleur.</p>

##### Etats
Chaque projet a quatre états présents par défaut : 
* Backlog : pour les demandes en attente
* Prêt : pour les demandes prêtes
* En cours : pour les demandes en cours
* Terminé : pour les demandes terminées

<p>L'état Terminé est un état de fermeture.<br/>
Aucun des états par défaut n'est masqué dans le Kanban.</br>
Il est possible de modifier le nom, l'état de fermeture et le fait qu'il soit masqué dans le kanban pour chaque état par défaut. Ils peuvent être également supprimés.</p>

<p>Il est possible d'ajouter de nouveaux états, en cliquant sur <cite>Nouvel état</cite>. Il faut renseigner son nom et cocher si on veut que ce soit un état de cloture, pareil pour s'il faut qu'il soit masqué dans le kanban.</p>

##### Couloirs
Il n'y a pas de couloir prévu par défaut pour un projet.</br>
Pour ajouter un nouveau catégorie, il suffit de cliquer sur <cite>Nouveau couloir</cite> et renseigner le nom du couloir. Il est possible d'ajouter une date de fin prévue et si le couloir est repliable ou non.

##### Membres
<p>Pour qu'un utilisateur puisse voir et naviguer dans le projet, il doit être déclaré dans l'onglet <cite>Membres</cite>.<br/>
C'est aussi par cet onglet qu'un manager peut supprimer un membre d'un projet.</p>

<p>Pour ajouter un nouveau membre, il faut cliquer sur le bouton <cite>Nouveau membre</cite>. Il faut taper le nom de l'utilisateur et les utilisateurs correspondants apparaissent par autocomplétion. Il suffit de sélectionner le correspondant et de lui assigner un rôle sur le projet.</p>

Il existe trois types de rôles :
* consummor : il peut s'imputer sur une tache. Changer l'état et le couloir de la tache par le kanban.
* contributor : il peut, en plus des droits du consummor, ajouter de nouvelles taches, les modifier, voir les consommations.
* manager : il est administrateur du projet.

Un administrateur de l'application est forcément manager de tous les projets. S'il est rajouté sur un projet en tant que consummor ou contributor, c'est le droit administrateur qui prime. 
