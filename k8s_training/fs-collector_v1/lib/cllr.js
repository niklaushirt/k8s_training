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
 Global object for application variables
*/

"use strict"
let sepLine =  '--------------------------------------------';
let cllr = module.exports = {
    config: {},                                       // configuration data read from config.json file
    softwareVersion: '0.0.1',                         // default software version
    enablePrint: false,
    startTime: 0,              //
    startMilli: 0,             //
    ofile: '',                 //
    auditCnt: 0,               //
    icount: 0,                 //
    eventCnt: 0,               //
    instructorURL: '',         //
    instructorLocal: 'http://localhost:4200',          // default url when running local 
    instructorCloud: 'http://dashboard.default',       // default url when running in cloud
    courseNumb: 100,                                   // default beginning course number
    app_namespace: 'Unknown',                          //
    app_user: 'Unknown',                               //
    reported: '',                                      //
    data: '{"items": []}',                             //
    reported: {},                                      //
    counted: {},                                       //
    countkey: '',                                      //
    skipAudit: 0,                                      //
    sepxx: sepLine,                                    // sep line
    stats: {},                                         // events as reported
    sep00: sepLine,                                    // sep line
    namespace: {},                                     // contains the audit entries for each namespace
    sep01: sepLine,                                    // sep line 
    namespacekey: '',                                  // string with comma seperated namespaces
    sep02: sepLine,                                    // sep line
    auditlog: {},                                      // instructor audit log info received, not used when student
    sep03: sepLine,                                    // sep line
    printFileNames: [],                                // files that can be printed to PDF 
    labels: '',                                        //
    courseIds: '',                                     //
    courseTitles: '@@',                                //
    courseConfig: {},                                  // all course configurations
    courses: {},                                       // gets populated with the course content that is shown
    segmentKeys: [],                                   //
    autoLinks: {},                                     // auto report links
    
    // ------------------ default values for course definitions --------------------
    button1_label: 'Question',
    button1_delay: 0,
    button1_color: '#e6f2ff',

    button2_label: 'Hint',
    button2_delay: 0,
    button2_color: '#e6ffe6',

    button3_label: 'Answer',
    button3_delay: 0,
    button3_color: '#ffe6b3',

    course_title: 'Student course',
    course_desc: 'Learning provided by IBM',
    course_id: 'CS-',                                  // DO NOT change, will break UI
    course_max: 10,                                    // number of segments/tasks to show in UI 
    course_auto: "no",                                 // Does this source auto report completion
    
    // -------------------------------------------------------
    courseDirectory: '/public/coursecatalog/',         // the directory where the course MD files are located
    createHtml: true,                                  // should the course segement files be created for debugging
    blackText: '',                                     // NO LONGER USED
    environment: {},                                   // local environment variables
    // ---------------------- default english labels for UI ---------------------------------
    uiLabels: {
        "collectorName": "Collector",
        "softwareVersion": "0.0.1",
        "markComplete":"Press to mark completed",
        "completeMsg": "Marked complete",
        "student": "Student",
        "instructor": "Instructor",
        
        "time_msg": "Remaining time",
        "time_hour": "h ",
        "time_min": "m ",
        "time_sec": "s",
        "time_stop": "&#x1F6D1; STOP",

        "menu00": "About Collector",
        "menu01": "Start Timer",
        "menu02": "Clear Timer",
        "menu03": "Clear Stats",
        "menu04": "Upload course",
        "menu05": "Validate course",
        "menu06": "Print course to PDF",
        "menu07": "Teams",

        "tab00": "Courses",
        "tab01": "Statistics",
        "tab02": "Class work",
        "tab03": "Feedback",
        "tab04": "Information",
        "tab05": "Insight",
    
        "tab00_hdr": "Catalog of courses",
        "tab00_list": "select course",
        "tab00_btn": "Begin course",
    
        "tab01_hdr": "Completed Work",
        "tab01_ns": "namespace",
        "tab01_wait": "Waiting for data",
    
        "tab02_hdr": "Select item from drop down to begin",
        "tab02_begin": "Begin course to populate",
        "tab02_list": "select work",
    
        "tab03_hdr": "Feedback",
        "tab03_inst": "Enter feedback in the following section and press Send when complete",
        "tab03_btn": "Send",
        "tab03_nothing": "Nothing submitted, feedback comments are blank",
        "tab03_ok": "Feedback was successfully received, thank you.",
    
        "tab04_hdr": "Supplemental information. Document links may open new tab.",
    
        "tab05_hdr": "Course Insight",
    
        "modal_del_hdr1": "Confirm clear stats",
        "modal_del_hdr2": "You are about to delete the completion statistics.",
        "modal_del_confirm": "Do you want to proceed?",
        "modal_del_btn1": "Delete",
        "modal_del_btn2": "Cancel",
    
        "modal_time_hdr1": "TIMER - Set and Start",
        "modal_time_lbl": "Minutes to count down",
        "modal_time_btn1": "Start timer",
        "modal_time_btn2": "Close",
    
        "modal_ful_hdr": "Course upload",
        "modal_ful_msg": "Drop course file(s) here or click to upload.<br />",
        "modal_ful_btn1": "Validate courses",
        "modal_ful_btn2": "Close",
    
        "modal_valid_hdr": "Course validation results",
        "modal_valid_btn": "Close",
        
        "modal_about_hdr": "Collector",
        "modal_about_ver": "Version",
        "modal_about_lbl": "This application is intended to assist with training an enablement courses provided by IBM",
        "modal_about_mid": "Server technology used",
        "modal_about_ui": "User interface technology used",

        "modal_print_hdr1": "Print course to PDF",
        "modal_print_lbl": "Minutes to count down",
        "modal_print_btn1": "Print",
        "modal_print_btn2": "Close",
        "modal_print_list": " select file",
        "modal_print_preview": "Preview generated PDF",
        "modal_print_fail": "Failed to generate PDF",

        "modal_team_hdr": "Team name and color",
        "modal_team_lbl": "Team",
        "modal_team_btn": "Close",

        "pmsg_001": "Processing course",
        "pmsg_002": "Content added for segment",
        "pmsg_003": "Invalid course parameter",
        "pmsg_004": "Parameter",
        "pmsg_005": "------ Start new topic ------",
        "pmsg_006": "Inserting complete button",

        "graph_01_title": "Time to complete work",
        "graph_01_yTitle": "Course work",
        "graph_01_xTitle": "Seconds"
    },

    // ---------------------- default team colors and names ---------------------------------

    teams: {
        "black":{"color":"#000000", "text":"white"},
        "navy":{"color":"#000080", "text":"white"},
        "darkblue":{"color":"#00008B", "text":"white"},
        "mediumblue":{"color":"#0000CD", "text":"white"},
        "blue":{"color":"#0000FF", "text":"white"},
        "darkgreen":{"color":"#006400", "text":"white"},
        "green":{"color":"#008000", "text":"white"},
        "teal":{"color":"#008080", "text":"white"},
        "darkcyan":{"color":"#008B8B", "text":"white"},
        "deepskyblue":{"color":"#00BFFF", "text":"white"},
        "darkturquoise":{"color":"#00CED1", "text":"white"},
        "mediumspringgreen":{"color":"#00FA9A", "text":"white"},
        "lime":{"color":"#00FF00", "text":"white"},
        "springgreen":{"color":"#00FF7F", "text":"white"},
        "aqua":{"color":"#00FFFF", "text":"white"},
        "cyan":{"color":"#00FFFF", "text":"white"},
        "midnightblue":{"color":"#191970", "text":"white"},
        "dodgerblue":{"color":"#1E90FF", "text":"white"},
        "lightseagreen":{"color":"#20B2AA", "text":"white"},
        "forestgreen":{"color":"#228B22", "text":"white"},
        "seagreen":{"color":"#2E8B57", "text":"white"},
        "darkslategray":{"color":"#2F4F4F", "text":"white"},
        "darkslategrey":{"color":"#2F4F4F", "text":"white"},
        "limegreen":{"color":"#32CD32", "text":"white"},
        "mediumseagreen":{"color":"#3CB371", "text":"white"},
        "turquoise":{"color":"#40E0D0", "text":"white"},
        "royalblue":{"color":"#4169E1", "text":"white"},
        "steelblue":{"color":"#4682B4", "text":"white"},
        "darkslateblue":{"color":"#483D8B", "text":"white"},
        "mediumturquoise":{"color":"#48D1CC", "text":"white"},
        "indigo ":{"color":"#4B0082", "text":"white"},
        "darkolivegreen":{"color":"#556B2F", "text":"white"},
        "cadetblue":{"color":"#5F9EA0", "text":"white"},
        "cornflowerblue":{"color":"#6495ED", "text":"white"},
        "rebeccapurple":{"color":"#663399", "text":"white"},
        "mediumaquamarine":{"color":"#66CDAA", "text":"white"},
        "dimgray":{"color":"#696969", "text":"white"},
        "dimgrey":{"color":"#696969", "text":"white"},
        "slateblue":{"color":"#6A5ACD", "text":"white"},
        "olivedrab":{"color":"#6B8E23", "text":"white"},
        "slategray":{"color":"#708090", "text":"white"},
        "slategrey":{"color":"#708090", "text":"white"},
        "lightslategray":{"color":"#778899", "text":"white"},
        "lightslategrey":{"color":"#778899", "text":"white"},
        "mediumslateblue":{"color":"#7B68EE", "text":"white"},
        "lawngreen":{"color":"#7CFC00", "text":"white"},
        "chartreuse":{"color":"#7FFF00", "text":"white"},
        "aquamarine":{"color":"#7FFFD4", "text":"white"},
        "maroon":{"color":"#800000", "text":"white"},
        "purple":{"color":"#800080", "text":"white"},
        "olive":{"color":"#808000", "text":"white"},
        "gray":{"color":"#808080", "text":"white"},
        "grey":{"color":"#808080", "text":"white"},
        "skyblue":{"color":"#87CEEB", "text":"white"},
        "lightskyblue":{"color":"#87CEFA", "text":"white"},
        "blueviolet":{"color":"#8A2BE2", "text":"white"},
        "darkred":{"color":"#8B0000", "text":"white"},
        "darkmagenta":{"color":"#8B008B", "text":"white"},
        "saddlebrown":{"color":"#8B4513", "text":"white"},
        "darkseagreen":{"color":"#8FBC8F", "text":"white"},
        "lightgreen":{"color":"#90EE90", "text":"white"},
        "mediumpurple":{"color":"#9370DB", "text":"white"},
        "darkviolet":{"color":"#9400D3", "text":"white"},
        "palegreen":{"color":"#98FB98", "text":"white"},
        "darkorchid":{"color":"#9932CC", "text":"white"},
        "yellowgreen":{"color":"#9ACD32", "text":"white"},
        "sienna":{"color":"#A0522D", "text":"white"},
        "brown":{"color":"#A52A2A", "text":"white"},
        "darkgray":{"color":"#A9A9A9", "text":"white"},
        "darkgrey":{"color":"#A9A9A9", "text":"white"},
        "lightblue":{"color":"#ADD8E6", "text":"white"},
        "greenyellow":{"color":"#ADFF2F", "text":"white"},
        "paleturquoise":{"color":"#AFEEEE", "text":"white"},
        "lightsteelblue":{"color":"#B0C4DE", "text":"white"},
        "powderblue":{"color":"#B0E0E6", "text":"white"},
        "firebrick":{"color":"#B22222", "text":"white"},
        "darkgoldenrod":{"color":"#B8860B", "text":"white"},
        "mediumorchid":{"color":"#BA55D3", "text":"white"},
        "rosybrown":{"color":"#BC8F8F", "text":"white"},
        "darkkhaki":{"color":"#BDB76B", "text":"white"},
        "silver":{"color":"#C0C0C0", "text":"white"},
        "mediumvioletred":{"color":"#C71585", "text":"white"},
        "indianred ":{"color":"#CD5C5C", "text":"white"},
        "peru":{"color":"#CD853F", "text":"white"},
        "chocolate":{"color":"#D2691E", "text":"white"},
        "tan":{"color":"#D2B48C", "text":"black"},
        "lightgray":{"color":"#D3D3D3", "text":"black"},
        "lightgrey":{"color":"#D3D3D3", "text":"black"},
        "thistle":{"color":"#D8BFD8", "text":"black"},
        "orchid":{"color":"#DA70D6", "text":"black"},
        "goldenrod":{"color":"#DAA520", "text":"black"},
        "palevioletred":{"color":"#DB7093", "text":"black"},
        "crimson":{"color":"#DC143C", "text":"black"},
        "gainsboro":{"color":"#DCDCDC", "text":"black"},
        "plum":{"color":"#DDA0DD", "text":"black"},
        "burlywood":{"color":"#DEB887", "text":"black"},
        "lightcyan":{"color":"#E0FFFF", "text":"black"},
        "lavender":{"color":"#E6E6FA", "text":"black"},
        "darksalmon":{"color":"#E9967A", "text":"black"},
        "violet":{"color":"#EE82EE", "text":"black"},
        "palegoldenrod":{"color":"#EEE8AA", "text":"black"},
        "lightcoral":{"color":"#F08080", "text":"black"},
        "khaki":{"color":"#F0E68C", "text":"black"},
        "aliceblue":{"color":"#F0F8FF", "text":"black"},
        "honeydew":{"color":"#F0FFF0", "text":"black"},
        "azure":{"color":"#F0FFFF", "text":"black"},
        "sandybrown":{"color":"#F4A460", "text":"black"},
        "wheat":{"color":"#F5DEB3", "text":"black"},
        "beige":{"color":"#F5F5DC", "text":"black"},
        "whitesmoke":{"color":"#F5F5F5", "text":"black"},
        "mintcream":{"color":"#F5FFFA", "text":"black"},
        "ghostwhite":{"color":"#F8F8FF", "text":"black"},
        "salmon":{"color":"#FA8072", "text":"black"},
        "antiquewhite":{"color":"#FAEBD7", "text":"black"},
        "linen":{"color":"#FAF0E6", "text":"black"},
        "lightgoldenrodyellow":{"color":"#FAFAD2", "text":"black"},
        "oldlace":{"color":"#FDF5E6", "text":"black"},
        "red":{"color":"#FF0000", "text":"black"},
        "fuchsia":{"color":"#FF00FF", "text":"black"},
        "magenta":{"color":"#FF00FF", "text":"black"},
        "deeppink":{"color":"#FF1493", "text":"black"},
        "orangered":{"color":"#FF4500", "text":"black"},
        "tomato":{"color":"#FF6347", "text":"black"},
        "hotpink":{"color":"#FF69B4", "text":"black"},
        "coral":{"color":"#FF7F50", "text":"black"},
        "darkorange":{"color":"#FF8C00", "text":"black"},
        "lightsalmon":{"color":"#FFA07A", "text":"black"},
        "orange":{"color":"#FFA500", "text":"black"},
        "lightpink":{"color":"#FFB6C1", "text":"black"},
        "pink":{"color":"#FFC0CB", "text":"black"},
        "gold":{"color":"#FFD700", "text":"black"},
        "peachpuff":{"color":"#FFDAB9", "text":"black"},
        "navajowhite":{"color":"#FFDEAD", "text":"black"},
        "moccasin":{"color":"#FFE4B5", "text":"black"},
        "bisque":{"color":"#FFE4C4", "text":"black"},
        "mistyrose":{"color":"#FFE4E1", "text":"black"},
        "blanchedalmond":{"color":"#FFEBCD", "text":"black"},
        "papayawhip":{"color":"#FFEFD5", "text":"black"},
        "lavenderblush":{"color":"#FFF0F5", "text":"black"},
        "seashell":{"color":"#FFF5EE", "text":"black"},
        "cornsilk":{"color":"#FFF8DC", "text":"black"},
        "lemonchiffon":{"color":"#FFFACD", "text":"black"},
        "floralwhite":{"color":"#FFFAF0", "text":"black"},
        "snow":{"color":"#FFFAFA", "text":"black"},
        "yellow":{"color":"#FFFF00", "text":"black"},
        "lightyellow":{"color":"#FFFFE0", "text":"black"},
        "ivory":{"color":"#FFFFF0", "text":"black"},
        "white":{"color":"#FFFFFF", "text":"black"}
    },

    //last le is a holder
    do_not_delete: 'do not delete'
};