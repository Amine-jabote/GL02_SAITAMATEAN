const fs = require('fs');
const colors = require('colors');
const giftParser = require('../../parsers/giftParser.js');
const vCardParser = require('../../parsers/vCardParser.js');
const vg = require('vega');
const vegalite = require('vega-lite');
const exam = require('../../services/examService.js');
const { forEach } = require('vega-lite/build/src/encoding.js');


const cli = require("@caporal/core").default;

cli
	.version('vpf-parser-cli')
	.version('0.07')
	.command('search_question', 'Permet de rechercher une question')
	.argument('<idq>', 'Id de la question à trouver')
	.action(({ args }) => {
		const listequestion = exam.allQuestions();
		listequestion.forEach(question => {
			if (question.id == idq) {
				console.log(question);
			}
		}
		);
	})



cli.run(process.argv.slice(2));
