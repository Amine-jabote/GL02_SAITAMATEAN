const { Console } = require('console');
const fs = require('fs');
const readline = require('readline');
const time = require('readline-sync');
var namefile;
const question = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})
class Question {
 mcq;
    openAnswer;
    matching;
    textComplete;
    trueFalse;
    correct;
    correct1;
    wrong1;
    q;
    q1;
    wrong2;
    veracity;
    numberMatches;
    ArrayMatch = [];
    MatchAnswers = [];
    questionGift;
    constructor() {
        this.mcq = false;
        this.openAnswer = false;
        this.trueFalse = false;
        this.textComplete = false;
        this.matching = false;
    }

    Choose() {
        question.question('Do you want to add the question(s) to a new form (Tap 1) or use an existent form(Tap 2) \n', function (choix) {
            if (choix == "1") {
                fs.readdir('./Forms/', function (err, forms) {

                    question.question('Enter the name of the new file wihout the extension ', function (fileName) {
                        fileName = fileName.replace(" ", "_");
                        question.question('Enter the title of your GIFT exam ', function (testname) {
                            namefile = fileName + ".gift";
                            const exist = forms.find(element => element == namefile);
                            if (exist == undefined) {
                                console.log("Your Gift Form will be exported in the Forms directory at the end of the process \n")

                                fs.appendFile("./Forms/" + namefile, "//Question: " + testname + "\n\n", err => {
                                    if (err) {
                                        console.error(err);
                                    }
                                });
                                var questions = new Question();
                                questions.createQuestion();

                            } else {
                                console.log("A form", { namefile }, "already exists")
                                question.close();
                            }
                        })

                    })
                })
            } else if (choix == "2") {

                fs.readdir('./Forms/', function (err, forms) {
                    let ree = forms.length
                    if (ree == "0") {
                        console.log("\n You have no form ! Create one to resume the process \n")
                        question.close();
                    } else {
                        console.log("--------------------Forms-------------------------\n")
                        for (var a = 0; a < forms.length; a++) {
                            console.log(a, "-", forms[a]);
                        }
                        console.log("---------------------------------------------------\n")

                        question.question('In wich Form you want to add the question you will create (Select a number) ', function (numform) {
                            let typenumform = null;
                            if ((numform.match(/[^0-9+]/g))) {
                                typenumform = "notok"
                            }
                            if ((numform < 0) || (numform > forms.length - 1) || (typenumform != null) || (numform.trim() == "")) {

                                console.log("The inserted argument is false ");

                                question.close();

                            } else {
                                namefile = forms[numform];
                                var questions = new Question();
                                questions.createQuestion();
                            }
                        })



                    }
                })
            } else {
                console.log("The inserted argument is false");
                question.close();
            }
        })
    }
    createQuestion() {
        question.question('please enter the type of question (1:for MCQ, 2:for Open Answer, 3:for Check List, 4:for Fill In the Blank and 5:for True or False)\n', (answer) => {
            if (answer === '1') {
                console.log("You chose a MCQ !");
                this.mcq = true;
                if (this.mcq === true) {
                    question.question('please enter the multiple choices question\n', (answer) => {
                        // console.log(answer);
                        this.q = answer;
                        question.question('please enter the correct answer\n', (answer) => {
                            //   console.log(answer);
                            this.correct = answer;
                            question.question('please enter a wrong answer\n', (answer) => {
                                //     console.log(answer);
                                this.wrong1 = answer;
                                question.question('please enter a wrong answer\n', (answer) => {
                                    //       console.log(answer);
                                    this.wrong2 = answer;
                                    question.question('please choose a digit for the question source\n', answer => {
                                        this.digit = answer;
                                        question.question('please choose a page number\n', answer => {
                                            let numberpage = answer;
                                            question.question('please choose a title for your question \n', answer => {
                                                this.titleQuestion = answer;
                                                this.questionGift = '::' + 'EM' + ' U' + this.digit + ' p' + numberpage.toString() + ' ' + this.titleQuestion + '::' + this.q + '{' + '(\n' + '~' + this.wrong1 + '\n' + '=' + this.correct + '\n' + '~' + this.wrong2 + ')' + '}';
                                                console.log(this.questionGift);
                                                fs.appendFile("./Forms/" + namefile, this.questionGift + "\n\n", err => {
                                                    if (err) {
                                                        console.error(err);
                                                    }
                                                });
                                                question.close();
                                            })
                                        })
                                    })


                                })

                            })
                        })
                    })
                }
            } else if (answer === '2') {
                console.log("You chose an open answer !");
                this.openAnswer = true;
                if (this.openAnswer === true) {
                    question.question('please enter your question for an open answer (Essay) \n', (answer) => {
                        //  console.log(answer);
                        this.q = answer;
                        question.question('please choose a digit for the question source \n', answer => {
                            this.digit = answer;
                            question.question('please choose a page number for your question \n', answer => {
                                let numberpage = answer;
                                question.question('please choose a title for your question \n', answer => {
                                    this.titleQuestion = answer;
                                    this.questionGift = '::' + 'EM' + ' U' + ' q' + this.digit + ' p' + numberpage.toString() + ' ' + this.titleQuestion + '::' + this.q + '{' + '' + '}';
                                    console.log(this.questionGift);
                                    fs.appendFile("./Forms/" + namefile, this.questionGift + "\n\n", err => {
                                        if (err) {
                                            console.error(err);
                                        }
                                    });
                                    question.close();
                                })
                            })
                        })
                    })
                }
            } else if (answer === '3') {
                console.log("You chose a matching question !");
                this.matching = true;
                if (this.matching === true) {
                    this.q = time.question('please enter the text of your matching \n');
                    this.numberMatches = time.question('Please enter the number of sentences you want: \n');
                    let typenumx = null;
                    if ((this.numberMatches.match(/[^0-9+]/g))) {
                        typenumx = "notok"
                    }
                    if (typenumx != null) {
                        console.log("Bad answer format! Insert a number")
                        question.close();
                    } else {
                        for (let i = 0; i < this.numberMatches; i++) {
                            this.ArrayMatch[i] = time.question('Please enter the sentence \n');
                            this.MatchAnswers[i] = time.question('Please enter the matching one\n');
                        }
                        let i = 0;
                        let sentence = [];
                        while (i < this.numberMatches) {
                            sentence[i] = `=${i} -> ` + this.ArrayMatch[i];
                            //console.log(sentence[i]);
                            i++
                        }
                        this.digit = time.question('please choose a digit for the question source\n');
                        this.titleQuestion = time.question('please choose a title for your question \n');
                        let numberpage = parseInt(time.question('Please enter the page number \n'));
                        let finalWrite = sentence.toString();
                        let topWrite = finalWrite.replace(/,/g, "\n")
                        //I will add the options
                        this.questionGift = '::' + 'EM' + 'U' + this.digit + ' p' + numberpage.toString() + ' ' + this.titleQuestion + '' + '::' + this.q + ' {\n' + topWrite + '\n}';
                        console.log(this.questionGift);
                        fs.appendFile("./Forms/" + namefile, this.questionGift + "\n\n", err => {
                            if (err) {
                                console.error(err);
                            }
                        });
                        question.close();
                    }
                }


            } else if (answer === '4') {
                console.log("You chose a text to complete !");
                this.textComplete = true;
                if (this.textComplete === true) {
                    question.question('please enter the text part A \n', (answer) => {
                        //   console.log(answer);
                        this.q = answer;
                        question.question('please enter the correct answer\n', (answer) => {
                            //     console.log(answer);
                            this.correct = answer;
                            question.question('please enter the text part B  \n', (answer) => {
                                // console.log(answer);
                                this.q1 = answer;
                                // question.question('please enter the correct answer\n', (answer) => {
                                //   console.log(answer);
                                //   this.correct1 = answer;
                                question.question('please choose a digit for the question source\n', answer => {
                                    this.digit = answer;
                                    question.question('please enter a page number for your question \n', answer => {
                                        let numberpage = answer;
                                        question.question('please choose a title for your question \n', answer => {
                                            this.titleQuestion = answer;

                                            this.questionGift = '::' + 'EM' + ' U' + this.digit + ' p' + numberpage.toString() + ' ' + this.titleQuestion + '' + '::' + '[html]' + '/' + 'Please fill the gap: ' + this.q + ' {=' + this.correct + '} ' + this.q1;
                                            console.log(this.questionGift);
                                            fs.appendFile("./Forms/" + namefile, this.questionGift + "\n\n", err => {
                                                if (err) {
                                                    console.error(err);
                                                }
                                            });
                                            question.close();
                                        })
                                        //})
                                    })
                                })
                            })

                        })
                    })
                }
            } else if (answer === '5') {
                console.log("You chose a True or false question !");
                this.trueFalse = true;
                if (this.trueFalse === true) {
                    question.question('please enter your question True or False\n', answer => {
                        //console.log(answer);
                        this.q = answer;
                        question.question('please enter the veracity if it is true or false \n', answer => {
                            //console.log(answer);
                            this.veracity = answer.toUpperCase();
                            question.question('please choose a digit for the question source', answer => {
                                this.digit = answer;
                                question.question('please enter a page number for your question \n', answer => {
                                    let numberpage = answer;
                                    question.question('please choose a title for your question \n', answer => {
                                        this.titleQuestion = answer;

                                        this.questionGift = '::' + 'EM' + ' U' + this.digit + ' p' + numberpage.toString() + ' ' + this.titleQuestion + ' ' + 'Please enter the veracity' + '::' + '/' + this.q + '{' + this.veracity + '}';
                                        console.log(this.questionGift);
                                        fs.appendFile("./Forms/" + namefile, this.questionGift + "\n\n", err => {
                                            if (err) {
                                                console.error(err);
                                            }
                                        });
                                        question.close();
                                    })
                                })
                            })
                        })


                    })
                }

            }


        })

    }

}

function read() {
    var questions = new Question();
    questions.Choose();

}
read();
