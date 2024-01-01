
const readline = require('readline');
const fs = require('fs');
const { Console } = require('console');
const { rawListeners } = require('process');
var result=[];

const r = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});


const dir = './Forms'
let path = 'Forms/EM-U5-p34-Voc.gift'

function verifyTest(questions) {
    let correct = true;
    const titleRegex = /^::.+::/g;
    console.log(questions);
    for (let i = 0; i < questions.length; i++) {
        if (questions[i] != undefined && questions[i] != '') {
            let array = questions[i].trim()
            result.push(array)
            if (questions[i].match(titleRegex) != null)
                continue;
            else
                correct = false;
        }
    }
    // questions.forEach(question =>{
    //     if(question.match(/{[^}]*}/g)) correct = false;
    // })

    // questions.forEach(question => {
    // if (questions.filter(q => q.title == question.split(titleRegex).length > 1)) {
    //     correct = false;
    //     }
    // });
    if (result.length < 15 || result.length > 20) {

        correct = false;
    }
    console.log(result.length)
    return correct;

}


fs.readdir('./Forms/', function (err, readDir) {
    if (err) {
        throw err;
    }
    for (let i = 0; i < readDir.length; i++) {
        console.log(readDir[i]);
    }
    r.question('Enter the name of the form ', function (name) {
        fs.readFile('./Forms/' + name, function read(err, data) {
            if (err) {
                throw err;
            }
            const document = data.toString();
            let questions = (document.split('\n\n'));
            questions.shift();

            console.log(verifyTest(questions));
            r.close();
        });
    })
})
