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
Routine to parse the solution.hmtl files and place data in memory
*/

const cllr = require('./cllr');
const utl = require('./utl');
const fs = require('fs');


let button1_label = cllr.button_1_label;
let button1_delay = cllr.button_1_delay;
let button1_color = cllr.button_1_color; 

let button2_label = cllr.button_2_label;
let button2_delay = cllr.button_2_delay;
let button2_color = cllr.button_2_color; 

let button3_label = cllr.button_3_label;
let button3_delay = cllr.button_3_delay;
let button3_color = cllr.button_3_color; 

let course_title = cllr.course_title;
let course_desc = cllr.course_desc;
let course_max = cllr.course_max;
let course_auto = cllr.course_auto;

let infotab = [];
let pMessages = '';

let s01 = '<div><pre><code ';
let e01 = '</code></pre></div>';

let s02 = '<table>';
let s03 = '</table>';
let s04 = '<thead>';
let s05 = '<tr>';

let s06 = '<pre><code>';
let e06 = '</code></pre>';

let s07 = '<p>Confirm ';
let s08 = '<tbody><tr>';
let s09 = '</tbody></table>';

let r01 = '<br><table class="table-bordered" cellspacing="10">'
let r02 = '<thead style="background-color: #eee;">';
let r03 = '<tr style="background-color: #f8f8f8;">'; 
let r04 = '<tbody><tr style="background-color: #f8f8f8;">'; 

let rkey = 1000;
let count = 0;
let buffer;
let pfile = '';
let segments = {};
let newButton1 = true;
let sfile = 0;
let thtml = '';


//------------------------------------------------------------------------------
// Append message to string with \n (newline)
//------------------------------------------------------------------------------
let pMsg = function(msg) {
    pMessages = pMessages + msg + '\n';
}


//------------------------------------------------------------------------------
// process the buffer that contains the course definition
//------------------------------------------------------------------------------
let processBuffer = function() {
    try {
        // set default processing parameters
        setCourseDefault();
        pMsg ('\n' + cllr.uiLabels.pmsg_001 + ' ' + pfile);
        // process the course by parsing the html 
        ripBuffer();
    } catch (e) {
        utl.logMsg('cllrP010 - Error message: ' + e);
    }
};
    

//------------------------------------------------------------------------------
// set course defaults
//------------------------------------------------------------------------------
function setCourseDefault() {
    button1_label = cllr.button1_label;
    button1_delay = cllr.button1_delay;
    button1_color = cllr.button1_color; 
    
    button2_label = cllr.button2_label;
    button2_delay = cllr.button2_delay;
    button2_color = cllr.button2_color; 
    
    button3_label = cllr.button3_label;
    button3_delay = cllr.button3_delay;
    button3_color = cllr.button3_color; 
    
    course_auto = cllr.course_auto;
    course_max = cllr.course_max;
    course_title = cllr.course_title;
    course_desc = cllr.course_desc;
    cllr.courseNumb++;
    course_id = cllr.course_id + cllr.courseNumb;
    if (cllr.courseIds === '') {
        cllr.courseIds = course_id; 
    } else {
        cllr.courseIds = cllr.courseIds + ',' + course_id
    }
    infotab = [];
    pMessages = '';
}


//------------------------------------------------------------------------------
// Get the label from the H4 line
//------------------------------------------------------------------------------
let getLabel = function(line) {
    let rtn = '';
    let fp = line.indexOf('>');
    let lp = line.length - 5;
    let x = line.substring(fp + 1, lp);
    return x;
};

    
//------------------------------------------------------------------------------
// Save the ripped lines for the segment of the course
// Segments are saved in the cllr.courses variable.  Yep, all course content
// is stored in memory.  The course segment, the newly ripped html for the is what
// gets stored.  The system generated unique course id along with the segement / label
// are the key used to store and retrieve the content.
//------------------------------------------------------------------------------
let saveData = function(type, label, content, cnt) {
    try {
        let clbl = course_id + ' :- ' + label
        let key = label.split(' ');
        let segKey = course_id + '.' + type + '.' + key[1];
        // add key to array
        cllr.segmentKeys.push(segKey);
        
        // save data (segment content) to memory array
        cllr.courses[clbl] = content;

        thtml = thtml + content;

        //save to segment also
        segments[clbl] = content;

        // Used in UI to populate drop down
        // save labels to be returned when browser asks for lists
        if (cllr.labels === '') {
            cllr.labels = clbl;
        } else {
            cllr.labels = cllr.labels + ',' + clbl;
        }

        pMsg(' - ' + cllr.uiLabels.pmsg_002 + ': ' + clbl);
        utl.logMsg('cllrP020 - Content added Last line: ' + cnt + ' for label: ' + clbl)

    } catch (err) {
        utl.logMsg('cllrP030 - Error adding content, message: ' + err);
    }
};

    
//------------------------------------------------------------------------------
// Handle the :<parm>: definitions for the course.  These will override the global 
// default course definitions.
//------------------------------------------------------------------------------
let setParm = function(data) {
    let info = [];

    // handle infotab lines that have more than two colons 
    if (data.startsWith('<p>:infotab:')) {
        info[0] = '';
        info[1] = 'infotab';
        info[2] = data.substring(12);
    } else {
        info = data.split(':');
    }

    let pd = '';
    if (info.length < 3) {
        utl.logMsg('cllrP100 - Invalid course parameter: ' + data);
        pMsg(cllr.uiLabels.pmsg_003 + ': ' + data);
        return;
    }

    try {
        // drop </p> if there
        if (info[2].endsWith('</p>')) {
            pd = info[2].substring(0, info[2].length - 4);
        } else {
            pd = info[2]
        }
        // strip spaces
        pd = pd.trim();

        // which parameter needs processed
        switch(info[1]) {
            // course level
            case 'course_title':
                course_title = pd;
            break;
            case 'course_desc':
                course_desc = pd;
            break;
            case 'course_max':
                course_max = pd;
            break;
            case 'course_auto':
                course_auto = pd;
            break;
            case 'course_auto_links':
                buildAutoLink(pd);
            break;

            // button 1 level
            case 'button1_color':
                button1_color = pd;
            break;
            case 'button1_delay':
                button1_delay = pd;
            break;
            case 'button1_label':
                button1_label = pd;
            break;

            // button 2 level
            case 'button2_color':
                button2_color = pd;
            break;
            case 'button2_delay':
                button2_delay = pd;
            break;
            case 'button2_label':
                button2_label = pd;
            break;

            // button 3 level
            case 'button3_color':
                button3_color = pd;
            break;
            case 'button3_delay':
                button3_delay = pd;
            break;
            case 'button3_label':
                button3_label = pd;
            break;

            // info tab data
            case 'infotab':
                infotab.push(pd);
            break;

            default:
                utl.logMsg('cllrP105 - Unknown course parameter: ' + data);
        }
        pMsg(' - ' + cllr.uiLabels.pmsg_004 + ': ' +info[1] + ' = ' + pd);
        if (pd.length > 65 ) {
            utl.logMsg('cllrP110 - Parm: ' + info[1] + ' = ' + pd.substring(0,65) + ' . . .');
        } else {
            utl.logMsg('cllrP115 - Parm: ' + info[1] + ' = ' + pd);
        }

    } catch (err) {
        utl.logMsg('cllrP120 - Error adding content, message: ' + err);
        pMsg(cllr.uiLabels.pmsg_003 + ': ' + data);

    }
};

// add the 
let appendBlankTarget = function (data) {
    let rtn = data;
    let lp;
    let newData;
    let fp = data.indexOf('<a href="http');
    if (fp > -1) {
        // find ending > for the href
        lp = data.indexOf('>', fp);    
        // does the target parm already exist?
        if (data.indexOf('target=', lp) === -1 ){
            // create the modified href to include the target 
            newData = data.substring(0, lp - 1) + '" target="_blank"' + data.substring(lp);
        }
        rtn = newData;
    }
    return rtn;
}

let buildAutoLink = function (data) {
    try {
        let newData = data.split(',');
        let links = {};
        let item;
        for (let k = 0; k < newData.length; k++) {
            item = newData[k].split('=');
            links[item[0]] = {'name': item[1], 'course': course_id};
        }
        //console.log(JSON.stringify(links,null,4));
        cllr.autoLinks = links;
    } catch(err) {
        utl.logMsg('cllrP130 - Error building course auto links, message: ' + err);
        pMsg(cllr.uiLabels.pmsg_007 + ': ' + data);

    }
}

//------------------------------------------------------------------------------
// rip the course content html to build the segments that will be presented to the 
// student 
//------------------------------------------------------------------------------
let ripBuffer = function() {

    utl.logMsg('cllrP200 - Ripping course html');

    let type = ''
    let label = '';
    let newType = '';
    let newLabel = '';
    let keep = false;
    let content = '';
    let addBR = false;
    let body = false;
    let chkNB = true;
    let lastDone = false;
    let publish = false;

    try {
        // process record from input file
        for (b = 0; b < buffer.length; b++) {
            line = buffer[b];
            count++;
            chkNB = true;

            // controls if the line is actually written to student content.  Class parms :course, :button, etc. are not written to course content
            //keep = false;

            if (line.startsWith('<body>')) {
                body = true;
            };

            if (body) {

                // check for course parameters
                if (line.startsWith('<p>:button') || line.startsWith('<p>:course_')  || line.startsWith('<p>:infotab:')) {
                    keep = false;
                    setParm(line);
                    chkNB = false;
                }

                // should href have target=_blank to force opening in new tab
                if (chkNB) {
                    line = appendBlankTarget(line);
                }

                // determine if there is a category (button label match) defined
                if (line.startsWith('<h4 ') ) {
                    if (line.indexOf(button1_label) > -1 ) {
                        if (button1_label !== '' ) {
                        //if (line.indexOf(button1_label) > -1 ) {
                            newLabel = getLabel(line);
                            newType = button1_label;
                            keep = true;
                        }
                    } else if (line.indexOf(button2_label) > -1 ) {
                        if (button2_label !== '' ) {
                        //if (line.indexOf(button2_label) > -1 ) {
                            newLabel = getLabel(line);
                            newType = button2_label;
                            keep = true;
                        }
                    } else if (line.indexOf(button3_label) > -1 ) {
                        if (button3_label !== '' ) {
                        //if (line.indexOf(button3_label) > -1 ) {
                            newLabel = getLabel(line);
                            newType = button3_label;
                            keep = true;
                        }
                    }
                }

                // last record so save data;
                if (line.startsWith('</body>')) {
                    saveData(type, label, content, count);
                    keep = false;
                    lastDone = true;
                }
            }
            
            // will the line be included in the student course content
            if (keep) {
                // is this the first time something was found?
                if (type === '') {
                    type = newType;
                    label = newLabel;
                    content = '';
                }
                // is this a new label / button / segment
                if (newLabel !== label) {
                    saveData(type, label, content, count);
                    label = newLabel;
                    type = newType;
                    content = line;

                    if (newButton1) {
                        pMsg(' ' + cllr.uiLabels.pmsg_005);
                        newButton1 = false;
                    }

                } else {
                    var nline = '';
                    // is this a line that needs <br> added    
                    if (line.startsWith(s01) || line.startsWith(s06)) {
                       addBR = true;
                    }

                    // check if there is a need to add <br> to force line break 
                    if (addBR) {
                        if (line.startsWith(e01) || line.startsWith(e06)) {
                            if (line.startsWith(e06)) {
                                if (line.length > 13) {
                                    nline = line.substring(0,13)
                                    // force a break and insert new line 
                                    content = content + nline;
                                    nline = '<br>' + line.substring(13) + '<br>';
                                } else {
                                    nline = '<br>' + line + '<br>';
                                }
                            }
                            
                        } else {
                            nline = '<br>' + line;
                        }
                    }
                     
                    // check for table related lines
                    if (line.startsWith(s02)) {
                        // add border to table
                        nline = r01;
                    }

                    if (line.startsWith(s03)) {
                        // add border to table
                        nline = line + '<br>';
                    }

                    if (line.startsWith(s04)) {
                        // add shading to table header
                        nline = r02;
                    }

                    if (line.startsWith(s05)) {
                        // add shading to table header
                        nline = r03;
                    }

                    if (line.startsWith(s08)) {
                        // add shading to table header
                        nline = r04;
                    }


                    // Write the line after other processing is done
                    // this saves the modified line for the course content segment 
                    if (nline !== '') {
                        content = content + nline;
                    } else {
                        content = content + line;
                    }

                    // should the Confirm button be inserted?
                    if (line.startsWith(s07)) {
                        pMsg(' - ' + cllr.uiLabels.pmsg_006)
                        var key = '';
                        if (line.length > 15 ) {
                            key = cllr.course_id + cllr.courseNumb + ' :- MarkComplete ' + line.substring(11, line.length - 4);
                        } else {
                            rkey++;
                            key = cllr.course_id + cllr.courseNumb + ' :- MarkComplete ' + rkey;
                        }
                        var cmi = '<div>' 
                        + '<button class="btn btn-success" onclick="markComplete(\'' 
                        + key 
                        + '\')">' + cllr.uiLabels.markComplete + '</button></div>';
                        content = content + cmi;
                    }

                    // check to turn off adding <br>
                    if (line.indexOf(e01) > -1 || line.indexOf(e06) > -1 )  {
                        addBR = false;
                    }

                }
            }
        }

        // check if the last segement was saved.  Should be triggered by </body>
        // yet if missing from html we still want this last segement
        if (lastDone === false) {
            saveData(type, label, content, count);
        }

        if (typeof cllr.coursePublished[course_id] === 'undefined') {
            cllr.coursePublished[course_id] = {
                'course_id': course_id,
                'published': true
            }
            publish = true;
        } else {
            publish = cllr.coursePublished[course_id].publish;
        }

        //console.log(JSON.stringify(cllr.coursePublished, null, 4));

        // save the configuration used to parse the input document
        cllr.courseConfig[course_id] = {
            'course_id': course_id,
            'published': publish, 
            'filename': pfile,
            'b1_color': button1_color,
            'b1_delay': button1_delay,
            'b1_title': button1_label,
            'b2_color': button2_color,
            'b2_delay': button2_delay,
            'b2_title': button2_label,
            'b3_color': button3_color,
            'b3_delay': button3_delay,
            'b3_title': button3_label,
            'c_title' : course_title,
            'c_desc'  : course_desc,
            'c_max'   : course_max,
            'c_auto'  : course_auto,
            'infotab' : infotab,
            'pMsg'    : pMessages
        };


        // append the config to the segement
        segments[course_id] = cllr.courseConfig[course_id];

        utl.logMsg('cllrP250 - Processed course document');

        let cwd = process.cwd();
        sfile++;
        //console.log(thtml);
        let loop = true;
        let fp;
        let tmp1;
        let tmp2;
        // modify the location to find courseimages
        while (loop === true) {
            fp = thtml.indexOf('../courseimages');
            if (fp > -1){
                tmp1 = thtml.substring(0,fp);
                tmp2 = thtml.substring(fp + 3);
                thtml = tmp1+tmp2;
            } else {
                loop = false;
            }
        }

        // create the print formatted html that is used to create PDF
        fs.writeFileSync(cwd + '/public/' + pfile + '_print.html', thtml);
        utl.logMsg('cllrP255 - Created print html for: ' + pfile);


    } catch (e) {
        utl.logMsg('cllrP260 - Error ripping course message: ' + e);
        segments['error'] = 'cllrP777 - Error ripping buffer message: ' + e;
    }
};


//------------------------------------------------------------------------------
// common routines
//------------------------------------------------------------------------------
module.exports = {

    //------------------------------------------------------------------------------
    // Parse the html that was produced from the markdown
    //------------------------------------------------------------------------------
    parse: function(data, filename) {
        // parse the String with \n (new line breaks) into an array 
        count = 0;
        buffer = data.split('\n');
        thtml = '';
        pfile = filename;
        processBuffer();
        return segments;
    }
    
//end of exports 
};