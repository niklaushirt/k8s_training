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
 Course related functions
*/

"use strict"

let Marked = require('marked');
let fs = require('fs');
let utl = require('../lib/utl');
let phb = require('./parseHtmlBuffer');
let cllr = require('../lib/cllr');
//let auditLog = require('../lib/auditLog');
let cwd = process.cwd();

function validateCourses(evt) {
    // clear all existing data are rebuild with validation
    cllr.courseIds = '';
    cllr.courseTitles = '@@';
    cllr.courseConfig = {};
    cllr.courses = {};

    readCatalogDirectory();
    //auditLog.add(cllr.app_namespace, 'Validated courses')
}


function readCatalogDirectory() {
    if (!cllr.courseDirectory.endsWith('/')) {
        cllr.courseDirectory = cllr.courseDirectory + '/';
    }
    let files = fs.readdirSync(cwd + cllr.courseDirectory);
    // reset starting course number
    cllr.courseNumb = 100;
    
    files.forEach(function(file) {
        try {
            if (file.endsWith('.md') || file.endsWith('.MD') || file.endsWith('.Md') || file.endsWith('.mD')) {
                utl.logMsg('cllrC010 - Starting rending from MarkDown to HTML for file: ' + cwd + cllr.courseDirectory + file);
                // read MarkDown file into a string
                let buff = fs.readFileSync(cwd + cllr.courseDirectory + file, {"encoding": "utf8"})

                // ---- PREPROCESS the markdown and insert blank lines after :parms:  ----
                // check buffer for proper formatting of control parms
                let chkArray = buff.split('\n');
                let newArray = []; 
                let hl = chkArray.length;
                for (let c = 0; c < hl; c++) {
                    newArray.push(chkArray[c] + '\n');
                    if (chkArray[c].startsWith(':')) {
                        // force blank line between control parameters, required in phb
                        newArray.push('  \n');
                    }
                }

                // rebuild the buff
                if (newArray.length > 0) {
                    buff = newArray.join("");
                    newArray = null;
                }

                // ---- Convert the markdown to HTML ----
                // convert string to html
                let result = Marked(buff);

                // ---- PREPROCESS the html and split <h4 line ----
                // check for <h4 values and ensure they start on a new line
                // this is needed to insure the course gets properly parsed
                chkArray = result.split('\n');
                let hArray = [];
                let nhl = chkArray.length;
                let item = '';
                let cp;
                for (let n = 0; n < nhl; n++) {
                    item = chkArray[n];
                    cp = item.indexOf('<h4');
                    if (cp > 3 ) {
                        hArray.push(item.substring(0, cp) + '\n');
                        hArray.push(item.substring(cp) + '\n');
                    } else {
                        hArray.push(item + '\n');
                    }
                }

                // rebuild the result
                if (hArray.length > 0) {
                    result = hArray.join("");
                    hArray = null;
                }

                // append <body></body> if not there already
                let newfile = file.substring(0, file.length - 3);
                if (result.indexOf('<body>') === -1) {
                    result = '<body> \n' + result + '</body>\n';
                }
                
                // Write the new html file to the coursecatalog directory
                utl.logMsg('cllrC015 - Created temp file: ' +  file );
                fs.writeFileSync(cwd + cllr.courseDirectory + newfile + '.html', result);
                // save the new file name for UI to use in Print capability
                cllr.printFileNames.push(newfile);

                // Parse the HTML file and create the snippets for the sections
                utl.logMsg('cllrC020 - Created course html file: ' + cwd + cllr.courseDirectory + newfile)
                let segments = phb.parse(result, newfile);

                // remove the temp html file
                deleteFile(cwd + cllr.courseDirectory + newfile + '.html');

                // if set write our the entire processing for the snippet parser
                //if (cllr.createHtml) {
                //    fs.writeFileSync(cwd + cllr.courseDirectory + newfile + '_segments.html', JSON.stringify(segments,null,4) );
                //}
            }
        } catch(err) {
            utl.logMsg('cllrC030 - Error processing course file: ' +  cwd + cllr.courseDirectory + file);
        }
    });
};

function toArrayBuffer(buf) {
    var ab = new ArrayBuffer(buf.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buf.length; ++i) {
        view[i] = buf[i];
    }
    return ab;
};

function toBuffer(ab) {
    var buf = Buffer.alloc(ab.byteLength);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buf.length; ++i) {
        buf[i] = view[i];
    }
    return buf;
};

// Delete a file.
function deleteFile(file) {
    fs.unlink(file, function(err) {
        if(err && err.code == 'ENOENT') {
            utl.logMsg('cllrC040 - File does not exist, file: ' +  file + ' cannot delete');
        } else if (err) {
            utl.logMsg('cllrC043 - Error deleting file: ' +  file + ' message: ' + err);
        } else {
            utl.logMsg('cllrC045 - Deleted temp file: ' +  file );
        }
    });    
};

//------------------------------------------------------------------------------
// common routines
//------------------------------------------------------------------------------
module.exports = {

    //------------------------------------------------------------------------------
    // check for config.json to get configuration ifo 
    //------------------------------------------------------------------------------
    validate: function() {
        validateCourses();
    }
    
  //end of exports 
};