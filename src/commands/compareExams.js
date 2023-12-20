
const fs = require('fs');
const { readFileSync, promises: fsPromises } = require('fs');
const { get } = require('http');
const { emitWarning, exit } = require('process');
const readline = require('readline');
const { receiveMessageOnPort } = require('worker_threads');
const vg = require('vega');
const vegalite = require('vega-lite');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const dir = './Forms/'
var readDir = fs.readdirSync(dir);
var mcq=0,tof=0,fill=0,matching=0,essay=0;
var QuestionType = {
    TOF: 1,                  // true/false
    QCM: 2,                  // multiple choice with specified feedback for right and wrong answers
    FILL_IN_THE_BLANK: 3,    // fill-in-the-blank
    MATCHING: 4,             // matching
    ESSAY: 5,                // essay
    properties: {
        1: { name: "TOF", value: 1 },
        2: { name: "QCM", value: 2 },
        3: { name: "FILL_IN_THE_BLANK", value: 3 },
        4: { name: "MATCHING", value: 4 },
        5: { name: "ESSAY", value: 5 },
    }
}

// Shuffle array order and output
function shuffle(arr) {
    let newArr = [];
    let length = arr.length;
    for (let i = 0; i < length; i++) {
        let index = Math.floor(Math.random() * (length - i));
        newArr[i] = arr[index];
        arr.splice(index, 1);
    }
    return newArr;
}

// Class Question
// Distinguish questions by questionTitle
class Question {
    constructor(questionTitle = '', question = '', questionType = 0
        , options = []) {
        this._questionTitle = questionTitle;
        this._question = question;
        this._questionType = questionType;
        this._options = options;
    }
    // getter
    get questionTitle() { return this._questionTitle; }
    get question() { return this._question; }
    get questionType() { return this._questionType; }
    get options() { return this._options; }
    // setter
    set questionTitle(questionTitle) { this._questionTitle = questionTitle; }
    set question(question) { this._question = question; }
    set questionType(questionType) { this._questionType = questionType; }
    set options(options) { this._options = options; }
    // private
    optionsToString() {
        if (this._options.length > 0) {
            if (QuestionType.properties[this._questionType].name === 'QCM') {
                let str = '';
                for (let i = 0; i < this._options.length; i++) {
                    str = str + this._options[i].slice(1) + '\n';
                }
                return str;
            }
            else if (QuestionType.properties[this._questionType].name === 'MATCHING') {
                let left = [], right = [], k = 0;
                for (let i = 0; i < this._options.length; i++) {
                    left[k] = this._options[i].split("->")[0].slice(1);
                    right[k] = this._options[i].split("->")[1];
                    k++;
                }
                left = shuffle(left);
                right = shuffle(right);
                let str = '';
                for (let i = 0; i < this._options.length; i++) {
                    str = str + left[i] + '      ' + right[i] + '\n';
                }
                return str;
            }
        }
    }
    // only return the question and options
    toString() {
        if(QuestionType.properties[this._questionType].name === 'MATCHING' || QuestionType.properties[this._questionType].name === 'QCM')
            return this._question.toString() + '\n' + this.optionsToString();
        else
            return this._question.toString() + '\n';
    }
}


// input string
// return question title(string)
function getQuestionTitle(questionString) {
    if (typeof questionString === 'string') {
        let q = questionString.match(/::.*::/);
        if (q) {
            return q[0].replace(/::/g, "");
        }
    }
}


// input string
// return question(string)
function getQuestion(questionString) {
    if (typeof questionString === 'string') {
        return questionString.replace(/\/\/.*\n/g, "").
        replace(/::.*::|\[[^\]]*\]|\<[^\>]*\>|\n/g, "").
        replace(/\{[^\{^\}]*\}/g, "_____");
    }
}

// input string
// return answer(array, array.length is 1)
function getAnswer(questionString) {
    if (typeof (questionString) === 'string') {
        return questionString.match(/\{[^\}]*\}/g);
    }
}

// get question title, entre << ~1 ~2 =4 ~3 >> and return QuestionType.typeName
// input string
// return QuestionType.typeName(int)
function getQuestionType(optionsString) {
    let questionType;
    if ((optionsString === null) || (optionsString == "")) {
        questionType = QuestionType.ESSAY;
    } else if (optionsString === "TRUE" || optionsString === "T" || optionsString === "F" || optionsString === "FALSE") {
        questionType = QuestionType.TOF;
    } else if (/.*->.*/.test(optionsString)) {
        questionType = QuestionType.MATCHING;
    } else {
        let isTransferred = false, isQCM = false;
        for (let i = 0; i < optionsString.length; i++) {
            if (optionsString[i] === '\\' && !isTransferred) {
                isTransferred = true;
            }
            else if (isTransferred) {
                isTransferred = false;
            }
            else if (optionsString[i] === '~') {
                isQCM = true;
                questionType = QuestionType.QCM;
            }
            else if (optionsString[i] === '=' && !isQCM) {
                questionType = QuestionType.FILL_IN_THE_BLANK;
            }
        }
    }
    return questionType;
}


// get question options, turn << ~1 ~2 =4 ~3 >> into << [~1, ~2, =4, ~3] >>
// input string
// return options(string array)
function getOptions(optionsString) {
    let ret = [];
    let k = 0, isTransferred = false;
    for (let i = 0, j = 0; j < optionsString.length; j++) {
        if (isTransferred) {
            isTransferred = false;
        }
        else if (optionsString[j + 1] === '\\' && !isTransferred) {
            isTransferred = true;
        }
        else if (optionsString[j + 1] === '~' || optionsString[j + 1] === '=' || j === optionsString.length - 1) {
            let str = optionsString.slice(i, j + 1).replace(/^\s*|\s*$/g, "");
            if (str != '~' && /\s*\S+?/.test(str)) {
                ret[k++] = str;
            }
            i = j;
            i++;
        }
    }
    return ret;
}

// deal with options
// input options(string array), question(class Question)
function deal(optionsStringArray, questionQuestion) {
    if (optionsStringArray != null) {
        optionsStringArray = optionsStringArray[0].replace(/<[^>]*>|\{|\}|\n/g, "");
        // get question type
        questionQuestion.questionType = getQuestionType(optionsStringArray);
        // get options
        questionQuestion.options = getOptions(optionsStringArray);
    }
}

const { Console } = require('console');
const {logger} = require("vega");
var content=0;

const r = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

//The user have to choose a file to compare the different types of questions
fs.readdir('./Forms/', function (err, forms) {
    console.log(forms)
    let content;
    r.question('Enter then name of the form ', function (name) {
        fs.readFile('./Forms/' + name, function read(err, data) {
            if (err) {
                throw err;
            }
            content = data.toString();
            console.log(content)
            let questions = (content.split('\n\n'));

            let questionTypeArray = [0, 0, 0, 0, 0];
            // 0 -> QCM 1->TOF ...and so on

            for (let i = 0, k = 0; i < questions.length; i++) {
                let question = new Question();
                question.question = getQuestion(questions[i]);
                question.questionTitle = getQuestionTitle(questions[i]);
                let answers = getAnswer(questions[i]);
                if (answers != null) {
                    deal(answers, question);
                    if (question.question.length != 0) {

                        //The program is reading the number of each type
                        if (question.questionType==undefined){
                            console.log("\n Your form contains a bad format question delete it");
                        }
                        else{
                            switch (QuestionType.properties[question.questionType].name) {
                                case 'TOF':
                                    questionTypeArray[0]++;
                                    break;
                                case 'QCM':
                                    questionTypeArray[1]++;
                                    break;
                                case 'FILL_IN_THE_BLANK':
                                    questionTypeArray[2]++;
                                    break;
                                case 'MATCHING':
                                    questionTypeArray[3]++;
                                    break;
                                case 'ESSAY':
                                    questionTypeArray[4]++;
                                    break;
                            }
                        }

                    }


                }
            }

            tof = questionTypeArray[0];
            mcq = questionTypeArray[1];
            fill = questionTypeArray[2];
            matching = questionTypeArray[3];
            essay = questionTypeArray[4];
            console.log(tof);
            console.log(mcq);
            console.log(fill);
            console.log(matching);
            console.log(essay);
            var type = ['TOF', 'MCQ', 'FILL', 'MATCHING', 'ESSAY'];
            var avg = []
            for (let i = 0; i < 5; i++) {
                avg.push({"a": type[i], "b": questionTypeArray[i]});
            }

            //Vega lite graphic
            var VlSpec = {
                  "width":"400",
                "height":"400",
                "data": {"values": avg},
                "encoding": {
                    "y": {"field": "a", "type": "nominal",  "axis": {"title": "Type of questions"}},
                    "x": {"field": "b", "type": "quantitative",  "axis": {"title": "Number of questions"}}
                  },
                  "layer": [{
                    "mark": "bar"
                  }, {
                    "mark": {
                      "type": "text",
                      "align": "left",
                      "baseline": "middle",
                      "dx": 3
                    },
                    "encoding": {
                      "text": {"field": "b", "type": "quantitative"}
                    }
                  }]
            }


            const myChart = vegalite.compile(VlSpec).spec;
            var runtime = vg.parse(myChart);
            var view = new vg.View(runtime).renderer('svg').run();
            var mySvg = view.toSVG();

            //We are going to save the svg file
            mySvg.then(function (res) {
                fs.writeFileSync(`./graphics/result.svg`, res)
                view.finalize();
                //info("%s", JSON.stringify(myChart, null, 2));
                //logger.info(` >> Chart output : ./graphics/result.svg`);
            });


        });
        r.close();


    })
    });









