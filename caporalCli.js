const fs = require('fs');
const vg = require('vega');
const vegalite = require('vega-lite');
const rl = require("readline-sync");
const colors = {
    'TOF':"red", 'QCM':"blue", 'FILL_IN_THE_BLANK':"green",
    'MATCHING':"yellow", 'ESSAY':"purple"
}
const cli = require("@caporal/core").default;
//Framework : cli
cli
    .version('0.0.7')
    // The user has the possibility to create a set of questions
    .command('create','Create an exam')
    .action(({ args, options, logger }) =>{
        const add=require('./commands/AddQuestion.js');


    })
    //The user can select a question
   .command('select','Select question')
   .action(() =>{
    const Search=require('./commands/searchQuestion.js');
    })

    //The user can modify a question
    .command('modify','Modify question')
    .action(()=>{
        const Modify=require('./commands/modifyQuestion.js');
    })

    //The user can delete a question
    .command('delete','Delete question')
    .action(()=>{
        const Modify=require('./commands/deleteQuestion.js');
    })

    .command('simulate','Simulate exam')
    .action(() => {
        const Simulate = require('./commands/simulateExam.js');

    })

    .command('check','Check quality')
    .action(()=>{
        const Check=require('./commands/checkExamQuality.js');
    })

    .command('contact','Contact file')
    .action(()=> {
        const Contact=require('./commands/createVcard.js');
    })

.command('compare','Compare Exam')
.action(({args, options, logger})=>{
const Compare=require('./commands/compareExams.js');

})
cli.run(process.argv.slice(2));
