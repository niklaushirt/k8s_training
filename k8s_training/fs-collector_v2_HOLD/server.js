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

"use strict"
//------------------------------------------------------------------------------
// Require statements
//------------------------------------------------------------------------------
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');
const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');
const chalk = require('chalk');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// app defined requires
const cllr = require('./lib/cllr');
const utl = require('./lib/utl');
const runtimeConfig = require('./lib/config')
const student = require('./lib/student');
const courses = require('./lib/courses');
const printC = require('./lib/printCourse');
const insight = require('./lib/insight');


//------------------------------------------------------------------------------
// Application variables
//------------------------------------------------------------------------------
let auditSender;                  // interval timer
let role = 'S';                   // S = student, I = Instructor
let port = 3000;
let options;
let optionDefinitions = [{
        name: 'port',
        alias: 'p',
        type: Number,
        defaultOption: 3000
    },
    {
        name: 'help',
        alias: 'h'
    },
    {
        name: 'role',
        alias: 'r',
        type: String,
        defaultOption: 'S'
    }
];

let bb = chalk.green;
let CLLR_TITLE = chalk.bold.underline('Collector server' );
let CLLR_VERSION = chalk.bold.underline('Version: ' + cllr.softwareVersion );

// Do not change the spacing of the following VPK_HEADER, and 
// do not delete the single tick mark
let CLLR_HEADER = `
${bb('-----------------------------------------------------------------')}
${bb(CLLR_TITLE)}
${bb(CLLR_VERSION)}                  
${bb('-----------------------------------------------------------------')}              
  `
//Do not delete the single tick mark above

// splash the start banner
splash();

// Global vars
cllr.startTime = new Date();;
cllr.startMilli = cllr.startTime.getTime();

//------------------------------------------------------------------------------
// process start parameters if provided
//------------------------------------------------------------------------------
options = commandLineArgs(optionDefinitions)

// -help used
if (typeof options.help !== 'undefined') {
    help();
    process.exit(0);
}

// -p used
if (typeof options.port !== 'undefined' && options.port !== null) {
    port = options.port;
    if (port < 1 || port > 65535) {
        utl.logMsg('cllrM010 - Invalid port number defined.  Valid range is 1 - 65535.');
        process.exit(-1);
    }
}

// -r role
if (typeof options.role !== 'undefined' && options.role !== null) {
    role = options.role;
    role = role.toUpperCase();
    if (role === 'S' || role === 'I') {
        utl.logMsg('cllrM020 - Role: ' + role + ' is being used.');
    } else {
        utl.logMsg('cllrM021 - Invalid role defined.  Valid values are S or I.');
        process.exit(-1);
    }
}


// check for config.json file to get parameters
readConfig(role);

// set destination and storage for the drag-n-drop of courses
const dest = process.cwd() + cllr.courseDirectory;
let storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, dest)
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname)
        let ext = path.extname(file.originalname).toUpperCase();
        if (ext !== '.MD') {
            console.log('NOT A COURSE FILE')
        }
    }
});

//------------------------------------------------------------------------------
// get environment variable
//------------------------------------------------------------------------------
let localVars = process.env;

// check if running as Instructor
// any value for this 
if (typeof localVars.INSTRUCTOR !== 'undefined') {
    // force role to instructor
    role = 'I'
    utl.logMsg('cllrM030 - Role enabled as instructor.');
} 



// namespace - 
if (typeof localVars.APP_NAMESPACE !== 'undefined') {
    cllr.app_namespace = localVars.APP_NAMESPACE;
    cllr.instructorURL = cllr.instructorCloud;
} else {
    cllr.instructorURL = cllr.instructorLocal;
    if (role === 'I') {
        cllr.app_namespace = cllr.uiLabels.instructor;
    } else {
        cllr.app_namespace = cllr.uiLabels.student;
    }
}
utl.logMsg('cllrM040 - Environment APP_NAMESPACE: ' + cllr.app_namespace);


//------------------------------------------------------------------------------
// Define express routes / urls
//------------------------------------------------------------------------------
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

// Express app definitions
app.use(cors());

app.get('/', function(req, res) {
    res.sendfile(__dirname + '/public/index.html');
});

app.post('/audit',function(req,res){
    res.end("OK");
    let ns = req.body.audit.ns;
    let evt = req.body.audit.events;
    utl.logMsg('cllrM100 - POST audit data event received for: ' + ns);
    cllr.auditlog[ns] = evt;
});

app.get('/auditlog',function(req,res){
    res.end(JSON.stringify(cllr.auditlog,null,2));
    utl.logMsg('cllrM105 - GET auditlog event received');
});

app.get('/dumpcore',function(req,res){
    res.end(JSON.stringify(cllr,null,2));
    utl.logMsg('cllrM110 - GET dumpcore event received');
    //console.log(JSON.stringify(cllr,null,2));
});

app.get('/courses',function(req,res){
	let rtn = {'courses': cllr.courses, 'labels': cllr.labels, 'courseConfig': cllr.courseConfig, 'courseIds': cllr.courseIds}
    res.json(rtn);
    //res.end(JSON.stringify(cllr,null,2));
    utl.logMsg('cllrM110 - GET dumpcore event received');
    //console.log(JSON.stringify(cllr,null,2));
});


app.get('/ping', function(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    res.end('Server is OK\n');
    utl.logMsg('cllrM115 - GET ping event received');
});

app.get('/quit', function(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    res.end('Server stopped\n');
    utl.logMsg('cllrM120 - GET quit event received');
    stopAll();
});

// event from student, running container, or application is receivied
app.get('/status/:ns/:event', function(req, res) {
    let event = req.params.event;
    let ns = req.params.ns;
    let course = '';
    let work = '';
    let segment = '';
    utl.logMsg('cllrM130 - GET status event received, with: ' + ns + '/' + event);
    let parts = [];
    // build parts based on UI or auto-complete, UI has :- in event
    if (event.indexOf(':-') > -1 ) {
        parts = event.split(':-');
        course = parts[0].trim();
        let tmp = parts[1].trim();
        let ainfo = tmp.split(' ');
        work = ainfo[1];
        segment = ainfo[0];
    } else {
        parts = event.split('-');
        course = 'unknown';
        segment = 'AutoComplete';
        work = 'unknown';
        if (typeof cllr.autoLinks[parts[1]] !== 'undefined') {
            course = cllr.autoLinks[parts[1]].course;
            work = cllr.autoLinks[parts[1]].name;
        } else {
            if (typeof cllr.autoLinks[parts[1]] !== 'undefined') {
                course = cllr.autoLinks[parts[1]].course;
                work = cllr.autoLinks[parts[1]].name;
                utl.logMsg('cllrM133 - Did not locate autoLinks for entry: ' + ns + '/' + event);
            } else {
                course = 'NoCourse';
                work = 'NoWork';
                utl.logMsg('cllrM135 - Possible invalid autoLinks for entry: ' + ns + '/' + event);
            }
        }
    }

    // default to complete
    let evt = 'complete';
    let eventInfo = {'course': course, 'segment': segment, 'work': work, 'evt': evt};
    addDataNew(ns, eventInfo);

    res.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    res.end('GotIt\n');
});
  
// course upload with DropZone
app.post('/upload', function(req, res) {
    utl.logMsg('cllrM140 - POST upload course event received');

    let upload = multer({
        storage: storage
    }).array('file', 4);

    upload(req, res, function(err) {
        if (err) {
            utl.logMsg('cllrM145 - Error processing upload, message: ' + err);
            return res.status(422);
        }
        res.end("File(s) processed");
    });
});


//------------------------------------------------------------------------------
// Define SocketIO events and handlers
//------------------------------------------------------------------------------
io.on('connection', (client) => {

    // send data to browser to display stats
    setInterval(function() {
        let result = blbData();
        if (typeof result.items !== 'undefined') {
            if (typeof result.items[0] !== 'undefined') {
                client.emit('data', result)
            }
        }
    }, 5000);

    // provide the software version and role that is currently being used
    client.on('getVersion', function(data) {
        utl.logMsg('cllrM200 - Get software version request being sent.');
        let result = {'version': cllr.softwareVersion, 'role': role, 'ns': cllr.app_namespace, 'enablePrint': cllr.enablePrint, 'publish': cllr.coursePublished};
        if (typeof cllr.teams !== 'undefined') {
            result.teams = cllr.teams;
        }
        if (typeof cllr.uiLabels !== 'undefined') {
            result.uiLabels = cllr.uiLabels;
        }
        client.emit('version', result);
    });

    // remove old statistics
    client.on('clearStats', function() {
        utl.logMsg('cllrM210 - Clear stats request received, all stats removed.');
        cllr.stats = {};
        cllr.namespace = {};
        cllr.namespacekey = '';
   });

   // get data for drop downs in UI, this includes the courses
    client.on('getDropDowns', function(data) {
        utl.logMsg('cllrM220 - Get drop-down lists request received');
        // return the comma seperated string of drop-down lists
        let result = {'courseIds': cllr.courseIds, 'courseConfig': cllr.courseConfig, 'labels': cllr.labels, 'printFiles': cllr.printFileNames, 'publish': cllr.coursePublished}
        client.emit('getDropDownsResults', result);
    });

    // get courses
    client.on('updateCourses', function() {
        utl.logMsg('cllrM210 - Update courses request received.');
        let rtn = '';
        student.getCourseData()
        .then(function(result) {
            rtn = {'status': result, 'courseIds': cllr.courseIds, 'courseConfig': cllr.courseConfig, 'labels': cllr.labels, 'printFiles': cllr.printFileNames, 'publish': cllr.coursePublished}
            client.emit('updateCoursesResult', rtn);
        })
        .catch(function(err) {
            utl.logMsg('cllrM212 - Error Processing error, message: ' + err, 'icp');
            rtn = {'status': err}
            client.emit('updateCoursesResult', rtn);
        });
    });

    // run the render and validation process for all courses in the the course directory
    client.on('validateCourses', function(data) {
        utl.logMsg('cllrM230 - Validate courses request received');
        courses.validate();
        setTimeout(function() {
            let cid = cllr.courseIds.split(',');
            let result = '';
            for (let v = 0; v < cid.length; v++) {
                result = result + '\n' + cllr.courseConfig[cid[v]].pMsg + '-----------------';
            }
            if (data !== 'refresh') {
                client.emit('validateCoursesResult', {'info': result});
            } else {

                let keys = Object.keys(cllr.courseConfig);
                let key = ''
                let status = '';
                for (let k = 0; k < keys.length; k++) {
                    key = keys[k];
                    status = cllr.coursePublished[key].published
                    cllr.courseConfig[key].published = status;
                }

                let result = {'courseIds': cllr.courseIds, 'courseConfig': cllr.courseConfig, 'labels': cllr.labels, 'printFiles': cllr.printFileNames, 'publish': cllr.coursePublished}
                client.emit('refreshResults', result);
            }
        }, 2000);
     });

    // store UI submitted feedback
    client.on('feedback', function(data) {
        utl.logMsg('cllrM240 - Feedback comments received');

        let auditInfo = {'evt': 'feedback', 'comments': data.comments};
        //auditLog.add(data.namespace, auditInfo)
        addDataNew(data.namespace, auditInfo);

        let result = {'status': cllr.uiLabels.tab03_ok};
        client.emit('feedbackResults', result);
    });

    // add a completion entry in the audit log
    client.on('markComplete', function(data) {
        utl.logMsg('cllrM250 - Mark complete received');
        // save the information
        // build audit record
        let parts = data.item.split(' ');
        let action = 'complete';
        let eventInfo = {'course': parts[0], 'segment': parts[2], 'work': parts[3], 'evt': action};
        addDataNew(data.namespace, eventInfo);

        client.emit('markCompletekResults', 'OK');

        // If student role, tell the instructor about this so the complete 
        // event can be recorded at the instructor level.
        if (role === 'S') {
            student.tellInstructor(data.namespace, data.item);
        }
    });

    // get the html for the topic of a course
    client.on('getInformation', function(data) {
        utl.logMsg('cllrM260 - Get information request for: ' + data.item);

        // build audit record
        let parts = data.item.split(' ');
        let auditInfo = {'course': parts[0], 'segment': parts[2], 'work': parts[3], 'evt': data.action};
        addDataNew(data.namespace, auditInfo);

        // get the segment content to send back to student
        let answer = cllr.courses[data.item];
       
        let result = {
            "gkey": data.item,
            "data": answer
        }
        // send back to client
        client.emit('getInfoResults', result);
    });


    // ---------------- set display language request ----------------
    // store UI submitted feedback
    client.on('setLanguage', function(data) {
        let lang = data.split('::');
        let result = {};
        utl.logMsg('cllrM263 - Set language request received for: ' + lang[1]);
        runtimeConfig.setLanguage(lang[1]);
        if (typeof cllr.uiLabels !== 'undefined') {
            result.uiLabels = cllr.uiLabels;
        }
        result.status = 'PASS';
        client.emit('setLanguageResults', result);
    });

    // ---------------- publish course request ----------------
    // store UI submitted feedback
    client.on('publishCourse', function(data) {
        let key = data.key;
        let status = data.status;
        utl.logMsg('cllrM265 - Publish course data request received');
        cllr.courseConfig[key].published = status;
        cllr.coursePublished[key].published = status;
    });


    // ---------------- chart related requests ----------------
    // store UI submitted feedback
    client.on('insight', function() {
        utl.logMsg('cllrM270 - Insight data request received');
        let result = insight.createReport();
        client.emit('insightResults', result);
    });


    // ---------------- team related requests ----------------
    // retireve team info
    client.on('teamColors', function() {
        utl.logMsg('cllrM275 - Team colors request received');
        let cwd = process.cwd();
        let result = fs.readFileSync(cwd + '/teams.json', {"encoding": "utf8"})
        result = JSON.parse(result);
        client.emit('teamColorResults', result);
    });


    // ---------------- delete course requests ----------------
    // retireve course info
    client.on('deleteCourse', function(data) {
        utl.logMsg('cllrM277 - Delete course request received');
        console.log(JSON.stringify(data,null, 2));
        let status = courses.deleteCourse(data);
        let result = {'msg': status}
        client.emit('deleteCourseResults', result);
    });


    // ---------------- print related requests ----------------    
    // print course to PDF
    client.on('printCourse', function(data) {
        utl.logMsg('cllrM280 - Print course request received');
        printC.createPdf(data)
        .then(function(result) {
            try {
                if (result === 'FAIL') {
                    client.emit('pdfCreated', 'FAIL');
                } else {
                    client.emit('pdfCreated', result);
                }
            } catch (err) {
                utl.logMsg('cllrM290 - Unable to create PDF: ' + data + ', message: ' + err);
                client.emit('pdfCreated', 'FAIL');
            }
        })
        .catch(function(err) {
            utl.logMsg('cllrM295 - Processing error creating PDF: ' + data + ', message: ' + err);
            client.emit('pdfCreated', 'FAIL');
        });

   });

});

  
//------------------------------------------------------------------------------
// start all 
//------------------------------------------------------------------------------
function startAll() {
    utl.logMsg('cllrM500 - Server started on port: ' + port);
    server.listen(port);
    cllr.listenPort = port;
}

//------------------------------------------------------------------------------
// stopt all 
//------------------------------------------------------------------------------
function stopAll() {
    statMessages = [];
    utl.logMsg('cllrM510 - Server stopping');
    process.exit(0)
}

//------------------------------------------------------------------------------
// Command line startup and help
//------------------------------------------------------------------------------
function help() {
    let usage = commandLineUsage([{
            content: CLLR_HEADER,
            raw: true,
        },
        {
            header: 'Options',
            optionList: optionDefinitions
        }
    ]);
    console.log(usage);
}

function splash() {
    let adv = commandLineUsage([{
        content: CLLR_HEADER,
        raw: true,
    }]);
    console.log(adv);
}

function readConfig(role) {
    runtimeConfig.readConfig(role);
}


function addDataNew(ns, data) {
    try {
        // is this a new namespace
        if (typeof cllr.namespace[ns] === 'undefined'){
            // create new namespace 
            cllr.namespace[ns] = {'events': [], 'keys': ''};
            // save key
            cllr.namespacekey = cllr.namespacekey + '.' + ns;
            utl.logMsg('cllrM700 - Added new namespace/team/student: ' + ns)
        }

        // check if this event is a new ns:evt value
        let lkey = '';
        if (data.evt === 'feedback') {
            // ensure all feedback is a unique key and permitted
            lkey = ns + ':' + Date.now() + '.'+data.evt;
        } else {
            lkey = ns + ':' + data.course+'.'+data.segment+'.'+data.work+'.'+data.evt;
        }
        if (typeof cllr.stats[lkey] === 'undefined') {
            // save fact that event occured, this prevents duplicate requests
            cllr.stats[lkey] = new Date().toLocaleString();
            // get current items to update
            let items = cllr.namespace[ns];
            // add to keys
            if (typeof items.keys !== 'undefined') {
                items.keys = items.keys + '##' + lkey;
            } else {
                items.keys = '##' + lkey;
            }
            // add entry to items after adding time elements
            data.time = new Date().toLocaleString();
            data.milli = Date.now();
            items.events.push(data);

            // replace the namespace with the updated info
            cllr.namespace[ns] = items;
            utl.logMsg('cllrM705 - Updated: ' + lkey);
            cllr.eventCnt++;
        }
    } catch (err) {
        utl.logMsg('cllrM710 - Error adding ns: ' + ns + ' data: ' + JSON.stringify(data) + ' error message: ' + err);
    }
}

// build the data array that will be used to update the UI statistics of class work completed
function blbData() {
    let data = {"items": []};
    let keys = cllr.namespacekey.split('.');
    let hl = keys.length;
    let max = 0;
    let rtnCourses;
    let namespace;
    let wdata;
    let cnt;
    for (let k = 0; k < hl; k++) {
        // clear the return courses
        rtnCourses = '';
        // get one of the namespaces in the list
        namespace = keys[k];
        if (namespace !== '') {
            // get the activites that have happened in the namespace 
            wdata = cllr.namespace[namespace].events;
            cnt = 0;
            // loop through activites and find all completed tasks 
            // an update cnt and courses  
            for (let c = 0; c < wdata.length; c++) {
                if (wdata[c].evt === 'complete') {
                    cnt++
                    if (rtnCourses === '') {
                        rtnCourses = '##' + wdata[c].course;
                    } else {
                        rtnCourses = rtnCourses + '##' + wdata[c].course;
                    }
                }
            }
            // build results and push on stack
            let row = {"team": namespace, "cnt": cnt, "keys": rtnCourses};
            data.items.push(row);
            // update max found
            if (cnt > max) {
                max = cnt;
            }
        }
    }
    data.max = max;
    return data;
}

//------------------------------------------------------------------------------
// Print and save environment variables
//------------------------------------------------------------------------------
utl.logMsg('cllrM900 - Environment variables have been stored in cllr');
cllr.environment = process.env;

//------------------------------------------------------------------------------
// If student role audit logs should be sent to instructor
//------------------------------------------------------------------------------
if (role === 'S') {
    auditSender = setInterval(student.sendAuditLog, 60000);
    utl.logMsg('cllrM910 - Send audit log to instructor has been enabled');
}

//------------------------------------------------------------------------------
// validate the course directory if Instructor role otherwise
// as student ask instructor for classes and setup for local student
//------------------------------------------------------------------------------
if (role === 'I' ) {
    courses.validate('Start');
    startAll();
} else {
    // need from instructor:  
    //   cllr.labels 
    //   cllr.courseIds 
    //   cllr.courseConfig
    //   cllr.courses
    startAll();
    student.getCourseData();
}

//------------------------------------------------------------------------------
// begin processing for web and REST endpoints
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------