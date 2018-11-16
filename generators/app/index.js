var Generator = require('yeoman-generator');
const fs = require('fs');
var exists = false;
module.exports = class extends Generator {
	// The name `constructor` is important here
	constructor(args, opts) {
		// Calling the super constructor is important so our generator is correctly set up
		super(args, opts);
		// Next, add your custom code
		this.option('babel'); // This method adds support for a `--babel` flag
		this.config.save();
	}
	async prompting() {
		this.date = new Date();
		this.year = 1900 + this.date.getYear();
		this.log(`Hey there!`);
		this.answers = await this.prompt([{
			type: 'input',
			name: 'filetype',
			message: 'Would you like to create just a new React Component(1) or Container both(2)? Type 1 or 2.',
		},
			{
				type: 'input',
				name: 'name',
				message: 'Your component name?',
			},
			{
				type: 'confirm',
				name: 'redux',
				message: 'Do u wish to add redux to your component?',
			}
		]);
		this.name = this.answers.name.split(' ').join('_');
		switch (this.answers.filetype) {
			case '2':
				//container content
				this.containercontent = `
/**
* @Date: ${this.date};
* @Copyright: (c) ${this.year};
* This code file/snippet/block, including any other configuration files,
* is for the sole use of the ***** ******, *** and may contain business
* confidential and privileged information.
* Any unauthorized review, use, disclosure or distribution is prohibited.
*/
     import React, { Component } from 'react';
     import { View } from 'react-native';
     import PropTypes from 'prop-types';
     ${this.answers.redux ? `import { connect } from 'react-redux';` : ''}

     import ${this.name} from './${this.name}';
     ${this.answers.redux ? `import { ${this.name}Actions } from '../../actions/${this.name}Actions';` : ''}

     ${this.answers.redux ? `@connect(store => ({
     }))` : ''}

     export default class ${this.name}Container extends Component{
       componentDidMount() {

       }
       render() {
         return (
           <${this.name} />
         );
       }
    }`;
			case '1':
				//component content
				this.componentcontent = `
    /**
    * @Date: ${this.date};
    * @Copyright: (c) ${this.year};
    * This code file/snippet/block, including any other configuration files,
    * is for the sole use of the ***** ******, *** and may contain business
    * confidential and privileged information.
    * Any unauthorized review, use, disclosure or distribution is prohibited.
    */
    import React, { Component } from 'react';
     import { View } from 'react-native';
     import PropTypes from 'prop-types';
     ${this.answers.redux ? `import { connect } from 'react-redux';` : ''}

     ${this.answers.redux ? `@connect(store => ({
     }))` : ''}

     export default class ${this.name} extends Component{
       componentDidMount() {

       }
       render() {
         return (
         );
       }
      }`;
				//action file content
				this.actioncontent = `
  /**
* @Date: ${this.date};
* @Copyright: (c) ${this.year};
* This code file/snippet/block, including any other configuration files,
* is for the sole use of the ***** ******, *** and may contain business
* confidential and privileged information.
* Any unauthorized review, use, disclosure or distribution is prohibited.
*/
  //import statements go here

  const ${this.name}ActionTypes = {

  };

  const ${this.name}Actions = {

  };

  export {
${this.name}ActionTypes,
${this.name}Actions,
};
`;
				break;
			default:
				this.log('Sorry! Kindly respond with valid inputs (1 or 2).');
		}
	};
	writing() { //writing content to the files.
		var dir = `./app/routes/${this.name}`;
		if (!fs.existsSync(dir)) {
			//creating a new directory if it doesn't exist.
			this.log('Creating new directory...');
			fs.mkdirSync(dir);
		}
		switch (this.answers.filetype) {
			case '2':
				fs.stat(`./app/routes/${this.name}/${this.name}Container.js`, function(err) {
					//checking if container file exists
					if (!err) {
						exists = true;
						return console.log('Sorry!Your container file exists');
					}
				});
				//creating a new container file
				fs.writeFileSync(`./app/routes/${this.name}/${this.name}Container.js`, this.containercontent);
			case '1':
				fs.stat(`./app/routes/${this.name}/${this.name}.js`, function(err) {
					//checking if component file exists
					if (!err) {
						exists = true;
						return console.log('Your component file exists');
					}
				});
				//creating a new container file
				fs.writeFileSync(`./app/routes/${this.name}/${this.name}.js`, this.componentcontent);
				//checking if action file exists
				fs.stat(`./app/actions/${this.name}Actions.js`, function(err) {
					//checking if container file exists
					if (!err) {
						exists = true;
						return console.log('Your action file exists!');
					}
				});
				// creating action file
				this.answers.redux && fs.writeFileSync(`./app/actions/${this.name}Actions.js`, this.actioncontent);
				this.log('Success!');
				break;
			default:
				this.log('Could not create file(s).');
		}
	}
	end() {
		this.log('Bbye! See you soon.');
	}
};
