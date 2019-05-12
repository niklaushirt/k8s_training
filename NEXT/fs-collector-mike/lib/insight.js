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
 Build the insight 01 charts 
*/

const cllr = require('./cllr');
const utl = require('./utl');
const eudata = require('../insight/eudata');

let lbl = {};
let rptData = {};
let rtnData = {};
let currData = {};
let rptDef = {
    'data': ['course', 'work', 'team'],
    'label': 'work',
    'chart': 'course' 
};

//=======================

function loadData() {
    let elm1;
    let elm2;
    let elm3;
    let startMilli = 0;
    let endMilli = 0;
    let rCnt = 0;

    try {
        // get auditlog data and process
        //data = eudata.getData();
        utl.logMsg('cllrI100 - Getting insight data');

        data = cllr.auditlog;

        // get starting times for labs
        
        for (team in data) {
            // label 
            for (item in data[team]) {
                rCnt++;
                // save label value
                checkLabel(data[team][item], team)

                if (rptDef.data.length === 3) {
                    elm1 = bldElement(data[team][item], rptDef.data[0], team);
                    elm2 = bldElement(data[team][item], rptDef.data[1], team);
                    elm3 = bldElement(data[team][item], rptDef.data[2], team);

                    startMilli = 0;
                    endMilli = 0;

                    if (data[team][item].evt === 'start') {
                        startMilli = data[team][item].milli;
                    }
                    if (data[team][item].evt === 'complete') {
                        endMilli = data[team][item].milli;
                    }

                    if (typeof rptData[elm1] === 'undefined') {
                        rptData[elm1] = {};
                    }
                    if (typeof rptData[elm1][elm2] === 'undefined') {
                        rptData[elm1][elm2] = {};
                    }
                    if (typeof rptData[elm1][elm2][elm3] === 'undefined') {
                        rptData[elm1][elm2][elm3] = {'start': startMilli, 'end': endMilli}
                    } else {
                        // if already exist update the start and stop milli
                        if (data[team][item].evt === 'start') {
                            if (startMilli < rptData[elm1][elm2][elm3].start) {
                                rptData[elm1][elm2][elm3].start = startMilli;
                            }
                        }
                        if (data[team][item].evt === 'complete') {
                            if (endMilli > rptData[elm1][elm2][elm3].end) {
                                rptData[elm1][elm2][elm3].end = endMilli;
                            }
                        }
                    }
                }
            }
        }
        if (rCnt === 0) {
            utl.logMsg('cllrI105 - No team data located');
        } else if (rCnt === 1) {
            utl.logMsg('cllrI105 - Located data for ' + rCnt + ' team');
        } else if (rCnt > 1) {
            utl.logMsg('cllrI105 - Located data for ' + rCnt + ' teams');
        }


        // calculate durations
        if (rptDef.data.length === 3) {
            for (lvl1 in rptData) {
                for (lvl2 in rptData[lvl1]) {
                    for (lvl3 in rptData[lvl1][lvl2]) {
                        if (rptData[lvl1][lvl2][lvl3].end > rptData[lvl1][lvl2][lvl3].start) {
                            let dur = rptData[lvl1][lvl2][lvl3].end - rptData[lvl1][lvl2][lvl3].start;
                            let ts = dur / 1000;
                            // Round to minutes or keep as seconds?
                            // This will do minutes: 
                            //let tm = Math.round(ts / 60);
                            // This will do seconds
                            let tm = Math.round(ts / 1);
                            rptData[lvl1][lvl2][lvl3].dur = tm;
                        } 
                    }
                }
            }
        }
        if (rCnt > 0) {
            utl.logMsg('cllrI110 - Durations calculated');
        }

        // read each course entry in the lbl variable and build the Labels for the report
        // and push the data into the datasets
        let newLbl = [];
        let rptInfo = {};
        for (course in lbl) {
            newLbl = [];
            let lblTmp = lbl[course].split('..')
            for (let s = 0; s < lblTmp.length; s++) {
                if (lblTmp[s].length > 1) {
                    let wrkVal = removePeriods(lblTmp[s]);
                    newLbl.push(wrkVal);
                }
            }

            for (let r = 0; r < newLbl.length; r++) {
                bldData(course, newLbl[r], r)
            }

            rptInfo = bldRptDef(course, newLbl);
            rtnData[course] = rptInfo;
            utl.logMsg('cllrI115 - Build dataset and labels for course: ' + course);
        }
        return rtnData;
    } catch (e) {
        console.log(e);
        return null;
    }
}

function bldData(course, label, ptr) {
    let tData = rptData[course][label];

    for (team in tData) {
        if (typeof currData[team] === 'undefined' ) {
            currData[team] = [];
        }
        let rdata = currData[team];
        if (typeof rptData[course][label][team].dur !== 'undefined') {
            rdata[ptr] = rptData[course][label][team].dur;
            currData[team] = rdata; 
        }
    }
}

function bldRptDef(course, labels) {
    let outData = {
        type: 'horizontalBar', 
        data: {
            labels: lbl,
            datasets: []
        },
        options: {
            title: {
                display: true,
                text: cllr.uiLabels.graph_01_title,
                fontSize: 18,
            },
            legend: {
                display: true,
                position: 'right',
                labels: {
                    fontColor: "#add8e6"
                }
            },
            scales: {
                xAxes: [{
                    beginAtZero: true,
                    barPercentage: 0.4,
                    categoryPercentage: 0.5,
                    scaleLabel: {
                        display: true,
                        labelString: cllr.uiLabels.graph_01_xTitle
                    }
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: cllr.uiLabels.graph_01_yTitle
                    }
                }]
            }
        }    
    }

    let newData = outData;

    newData.data.labels = labels;
    newData.data.datasets = [];
    newData.options.title.text = cllr.uiLabels.graph_01_title;
    newData.options.scales.yAxes[0].scaleLabel.labelString = cllr.uiLabels.graph_01_yTitle;

    for (team in currData) {
        let color = '';
        let tColor = '';
        let info = currData[team];
        if (info.length === 0) {
            continue;
        }
        let result = {};
        result.data = info;

        if (typeof cllr.teams.teams[team] !== 'undefined') {
            color = cllr.teams.teams[team].color;
            tColor = cllr.teams.teams[team].text;
        } else {
            color = 'grey';
            tColor = 'white';
        }
        result.backgroundColor = color;
        result.label = team;
        result.yAxisID
        newData.data.datasets.push(result);
    }
    return newData;
}

function removePeriods(data) {
    if (data.startsWith('.')) {
        data = data.substring(1);
    }
    if (data.endsWith('.')) {
        data = data.substring(0, data.length - 1);
    }
    return data;
}

function bldElement(evt, key, team) {
    let rtn = '';
    switch(key) {
        case 'course':
            rtn = evt.course;
        break;
        case 'segment':
            rtn = evt.segment;
        break;
        case 'work':
            rtn = evt.work;
        break;
        case 'team':
            rtn = team
        break;
    }
    return rtn;
}

function checkLabel(evt, team) {
    let labVal = '';
    let lblGroup = rptDef.chart

    // get and set the value for label group
    switch(rptDef.chart) {
        case 'course':
            lblGroup = evt.course;
        break;
        case 'segment':
            lblGroup = evt.segment;
        break;
        case 'work':
            lblGroup = evt.work;
        break;
        case 'team':
            lblGroup = team;
        break;
    }

    switch(rptDef.label) {
        case 'course':
            lblVal = evt.course;
        break;
        case 'segment':
            lblVal = evt.segment;
        break;
        case 'work':
            lblVal = evt.work;
        break;
        case 'team':
            lblVal = team;
        break;
    }
    
    if (typeof lbl[lblGroup] === 'undefined') {
        lbl[lblGroup] = [];
    }

    let tmp = lbl[lblGroup];
    // add entry to label if not already there
    if (lblVal.length > 0) {
        if (tmp.indexOf('.' + lblVal + '.') === -1) {
            tmp = tmp + '.' + lblVal + '.';
            lbl[lblGroup] = tmp;
        }
    }
}

//------------------------------------------------------------------------------
// common routines
//------------------------------------------------------------------------------
module.exports = {

    //------------------------------------------------------------------------------
    // check if namespace is in array 
    //------------------------------------------------------------------------------
    createReport: function(req) {
        // read all data and create a new array for report
        let data = loadData(req);
        return data;
    }
  
//end of exports 
};