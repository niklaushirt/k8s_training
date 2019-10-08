/*
Copyright 2019 Dave Weilert

Permission is hereby granted, free of charge, to any person obtaining a copy of this software 
and associated documentation files (the "Software"), to deal in the Software without restriction, 
including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, 
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial 
portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT 
LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/*----------------------------------------------------------
 Configuration handler
*/

"use strict"

const fs = require('fs');
const cllr = require('../lib/cllr');
const utl = require('../lib/utl');

let buff = '';

let validateConfig = function() {
    let cf = JSON.parse(buff);

    // set the desired UI language
    if (typeof cf.language !== 'undefined') {
        readUiLabels(cf.language);
    } else {
        readUiLabels('english');
    }

    if (typeof cf.softwareVersion !== 'undefined') {
        cllr.softwareVersion = cf.softwareVersion;
        cllr.uiLabels.softwareVersion = cf.softwareVersion;
    } else {
        cllr.softwareVersion = '0.0.1';
        cllr.uiLabels.softwareVersion = "0.0.1";
    }

    if (typeof cf.enablePrint !== 'undefined') {
        if (cf.enablePrint === true) {
            cllr.enablePrint = true;
        } else {
            cllr.enablePrint = false;
        }
    } else {
        cllr.enablePrint = false;
    }

};

let readConfig = function() { 
    let fn = process.cwd() + '/config.json'
    buff = '';      
    try {
        utl.logMsg('cllrF010 - Reading configuration file: ' + fn);
        buff = fs.readFileSync(fn, {"encoding": "utf8"})
    } catch(err) {
        if (err.errno === -2) {
            utl.logMsg('cllrF015 - Did not find file: ' + fn)
        } else {
            utl.logMsg('cllrF020 - Error reading file ' + fn + ', error message: ' + err);
        }
    } 

    if (buff !== '') {
        validateConfig();
    }
};

// get the defined language file for the UI
let readUiLabels = function(lang) {   
    let fn = process.cwd() + '/language/' + lang + '.json'
    let uif = null;
    try {
        utl.logMsg('cllrF110 - Reading uiLabel configuration file: ' + fn);
        uif = fs.readFileSync(fn, {"encoding": "utf8"})
        if (uif.length > 10) {
            uif = JSON.parse(uif)
            cllr.uiLabels = uif.uiLabels;
        }


    } catch(err) {
        if (err.errno === -2) {
            utl.logMsg('cllrF115 - Did not find file: ' + fn)
        } else {
            utl.logMsg('cllrF120 - Error reading file ' + fn + ', error message: ' + err);
        }
    } 

};

let readTeams = function() {   
    let fn = process.cwd() + '/teams.json'
    let teams = null;
    try {
        utl.logMsg('cllrF110 - Reading teams configuration file: ' + fn);
        teams = fs.readFileSync(fn, {"encoding": "utf8"})
        if (teams.length > 10) {
            teams = JSON.parse(teams)
            cllr.teams = teams;
        }

    } catch(err) {
        if (err.errno === -2) {
            utl.logMsg('cllrF115 - Did not find file: ' + fn)
        } else {
            utl.logMsg('cllrF120 - Error reading file ' + fn + ', error message: ' + err);
        }
    } 

}


//------------------------------------------------------------------------------
// common routines
//------------------------------------------------------------------------------
module.exports = {

    //------------------------------------------------------------------------------
    // check for config.json to get configuration ifo 
    //------------------------------------------------------------------------------
    readConfig: function() {
        readConfig();
        readTeams();
    }
  //end of exports 
};


