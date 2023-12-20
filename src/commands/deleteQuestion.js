const readline = require('readline');
const fs = require('fs');
const { Console } = require('console');
var questions = [];
var result = [];

const r1 = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});


fs.readdir('./Forms/', function (err, forms) {
    //Vérifie si aucun form n'existe
    let ree = forms.length
    if (ree == "0") {
        console.log("\n You have no form ! Create one to resume the process \n")
        r1.close();
    } else {
        // Affiche les forms
        console.log("--------------------Forms-------------------------\n")
        for (var a = 0; a < forms.length; a++) {
            console.log(a, "-", forms[a]);
        }
        console.log("---------------------------------------------------\n")

        r1.question('In wich Form you want to delete a question (Select a number) ', function (numform) {
            //Vérifie la réponse du user  
            let typenumform = null;
            if ((numform.match(/[^0-9+]/g))) {
                typenumform = "notok"
            }
            if ((numform < 0) || (numform > forms.length - 1) || (typenumform != null) || (numform.trim() == "")) {

                console.log("The inserted argument is false");

                r1.close();

            } else {
                fs.readFile("./Forms/" + forms[numform], function doc(err, data) {
                    // Lit le form et le traite question par question
                    if (err) throw err;
                    const document = data.toString();
                    let quest = (document.split('\n::'));
                    const firstElement = quest.shift();
                    for (var i = 0; i < quest.length; i++) {
                        if ((quest[i]) && (quest[i][0] != "/")) {
                            let array = quest[i].trim()
                            if (array[0] != ":") {
                                questions.push("::" + array)
                                array = "::" + array
                                console.log("Question", i, ":\n", array, "\n")
                            } else {
                                console.log("Question", i, ":\n", array, "\n")
                                questions.push(array)
                            }
                        }
                    }

                    r1.question('Insert the number of the questions you want to delete separated by a space ', function (nums) {
                        // Vide le form
                        fs.truncate("./Forms/" + forms[numform], 0, function () { })
                        let pour = nums.split(" ");
                        //Vérifie l'insértion du user
                        for (var x = 0; x < pour.length; x++) {
                            let typenums = null;
                            if ((pour[x].match(/[^0-9+]/g))) {
                                typenums = "notok"
                            }
                            if ((pour[x] < 0) || (pour[x] > questions.length - 1) || (pour[x].trim() == "") || (typenums != null)) {

                                console.log("There is no question", pour[x], "Or empty argument inserted")
                            } else {
                                //Si la question existe,on l'a supprime
                                for (var i = 0; i < questions.length; i++) {
                                    if ((i == pour[x])) {
                                        console.log("Question", i, "deleted")
                                        questions[i] = "";
                                    }
                                }
                            }
                        }
                        // On remplit le tableau sans les questions supprimées
                        for (var i = 0; i < questions.length; i++) {
                            if ((questions[i])) {
                                result.push(questions[i])
                            }

                        }
                        result.unshift(firstElement.trim());
                        new Promise(r => setTimeout(r, 2000));
                        let finalWrite = result.toString();
                        let topWrite = finalWrite.replace(/,/g, "\n\n")
                        // On remet le form
                        fs.appendFile("./Forms/" + forms[numform], topWrite + "\n\n", err => {
                            if (err) {
                                console.error(err);
                            }
                        });
                        r1.close();

                    })

                })
            }
        })
    }
})
