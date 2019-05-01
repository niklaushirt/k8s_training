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
 Create PDF from html created from markdown
*/

"use strict"

const cllr = require('../lib/cllr');
const utl = require('../lib/utl');
const fs = require('fs');
let puppeteer;

async function pupPrint(title, pfile) {
    const cwd = process.cwd();
    const fn = cwd + '/public/' + pfile + '_print.html';
    const ofn = cwd + cllr.courseDirectory + pfile + '.pdf';
    const style1 = cwd + "/public/css/markdown.css";
    const style2 = cwd + "/public/css/github.css";
    const top = '<!DOCTYPE html><html><head></head><body>';
    const bot = '</body></html>';
    let html = '';
    try {
        html = fs.readFileSync(fn, {"encoding": "utf8"})
        html = top + html + bot;
    } catch(e) {
        utl.logMsg('cllrD100 - Failed to read input file: ' + fn + ', message: ' + e);
        return 'FAIL';
    }

    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        const serverLoc = 'http://localhost:' + cllr.listenPort;

        await page.goto(serverLoc, { waitUntil: 'networkidle0' });
        await page.setContent(html);
        await page.addStyleTag({ path: style1 });
        await page.addStyleTag({ path: style2 });
        
        let pdf_options = 
        {
            "printBackground": true,
            "format": "Letter",
            "margin": {"top": "30mm", "right": "20mm", "bottom": "30mm", "left": "20mm"},
            "path": ofn,
            "displayHeaderFooter": true,
            "headerTemplate": "<span style='font-size: 10px; font-family: Arial; width: 100%; height: 30px; background-color: black; color:black; margin: 20px;'>" + 
                title + "<span style=\"float: right;\"class=\"date\"></span>",
            "footerTemplate": "<span style='font-size: 10px; font-family: Arial; width: 100%; height: 30px; background-color: black; color:black; margin: 20px;'>" + 
                "<hr>Page&nbsp;<span class=\"pageNumber\"></span>&nbsp;of <span class=\"totalPages\">" + 
                "</span></span>"        
        }

        await page.pdf( pdf_options );
        await browser.close();
        utl.logMsg('cllrD105 - Created PDF: ' + ofn);
        return;

    } catch(e) {
        utl.logMsg('cllrD110 - Failed to process input file: ' + fn + ', message: ' + e);
        return 'FAIL';
    }
}

//------------------------------------------------------------------------------
// common routines
//------------------------------------------------------------------------------
module.exports = {

    //------------------------------------------------------------------------------
    // check for config.json to get configuration ifo 
    //------------------------------------------------------------------------------

    createPdf: async function(pfile) {
        // if print is enalbled 
        if (cllr.enablePrint === true) {
            if (typeof puppeteer === 'undefined') {
                puppeteer = require('puppeteer');
            }
        }

        let entry = pfile.split('::');
        utl.logMsg('cllrD010 - Request to create PDF for file: ' + pfile);
        let result  = await pupPrint(entry[0], entry[1]);
        if (result !== 'FAIL') {
            result = entry[1];
        }
        return result;
    }
  //end of exports 
};