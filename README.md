# GL02_A23_SAITAMATEAN



## Description:

La fonction principale de l’outil doit être de regrouper un ensemble de questions pour créer 
un fichier GIFT d’examen. Dans ce cadre, le logiciel doit permettre à l’utilisateur de rechercher et 
visualiser une question de la banque de données afin de la choisir pour l’ajouter au test.

L’utilitaire doit également permettre de générer un fichier d’identification et de contact des 
enseignants au format VCard. Dans cet objectif, l’outil doit donc permettre en amont aux 
enseignants de renseigner les données nécessaires afin de générer le fichier d’identification.

Par ailleurs, l’outil doit permettre de simuler la passation d’un test par un étudiant et 
d’afficher un bilan des réponses à la fin de cette simulation. Afin de permettre de vérifier la qualité 
des tests préparés, le logiciel doit permettre de vérifier que le test généré est conforme aux 
indications du SYREM, c’est à dire qu’il comporte entre 15 et 20 questions et qu’une question 
même question n’apparaisse qu’une seule fois dans le test.

Le logiciel est developpé par le language de programmation JavaScript.

## Licence:

Le logiciel est sous licence MIT.

## Installations nécessaires:

$ npm install:  fs 
                colors 
                readline-sync
                Caporal
                @caporal/core 
                vega
                vega-lite 

## Les fonctions spécifiques:

- SPEC01 : définir d'ensemble de questions.
- SPEC02 : Creation de different types de questions.
- SPEC03 : possibilité de choisir les questions depuis la banque de questions.
- SPEC04 : Permettre aux utilisateurs de chercher, affichage et choisir des questions.
- SPEC05 : Visualisation d'un profile d'exam GIFT.
- SPEC06 : Simulation d’une passation de test.
- SPEC07 : Vérifier la qualité des données d'un examen
- SPEC08 : Générer un fichier d’identification et de contact au format vCARD (RFC 6350).
- SPEC09 : Comparer le profil d’un examen avec un ou plusieurs autre profiles.

## Utilisation:

- Démarrage

$ node caporalcli.js --help vous présentera les différentes commandes et leur objectif.

- SPEC01 et SPEC02

$ node caporalcli.js create 

Cette commande permet à l'utilisateur de créer un ensemble de questions de son choix et du type qu'il souhaite, puis les ajouter à exam exam existant ou à un nouveau exam qui sera exporté dans le dossier Forms.

- SPEC03 ET SPEC04

$ node caporalcli.js select 

Cette commande permet la recherche et la selection d'un ensemble de questions selon un mot clé depuis la banque de questions pour ensuite les rajouter à un exam.

$ node caporalcli.js modify 

La commande a pour objectif de modifier une question dans un exam.

$ node caporalcli.js delete

cette commande permet la suppresion d'une ou un ensemble de questions dans un exam.

- SPEC05

$ node caporalcli.js display 

La commande permet la Visualisation d'un profile d'exam.

- SPEC06

$ node caporalcli.js simulate

cette commande a pour objectif de simuler un exam et de donner un rapport à la fin.

- SPEC07

$ node caporalcli.js check

Avec cette commande on peut vérifier la qualité d'un exam et vérifier s'il contient entre 15-20 questions et des questions non répétées.

- SPEC08

$ node caporalcli.js contact

La commande permet de créer un fichier contact pour l'enseignant, dans un format Vcard (RFC 6350)

- SPEC09

$ node caporalcli.js compare

la commande permet l'affichage d'un graphique contenant les détails d'un examen.

## Test Unitaire:

Des tests unitaires ont été implémentés pour vérifier le parseur et des fonctions, pour cela il faut utiliser: $ npm test le framework utilisé est Jasmine.



## Liste des contributeurs:
VALIER Anna
KOLEDZI.KO
ZHU Hanyu
SHI.JIAHAO

# groupe les experts:

JABOTE Mohamed Amine
SIDQUI Youssef 
LEJEUNE Nicolas
AZZOUZ Mohamed
