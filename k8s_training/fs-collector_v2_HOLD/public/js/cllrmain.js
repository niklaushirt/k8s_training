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

// Global vars 
var version = 'Get from server';         // store software version
var socket = io.connect();               // sockert io related
var defHdr = 10;                         // default number of labs numbers in header
var clock = null;                        // interval timer for clock
var started = false;
var updateScreen = true;                 // control if stats table will get updated
var checkMark = '&#x2705';               // emoji to display as the checkmark
var tbd = '\u2B55';                      // emoji to display red circle
var pencil = '\u270F';                   // emoji to display pencil
var timeColor = 'darkred'                   // color of numbers in timer display
var role = '';
var app_namespace = 'Unknown';
//var topicFilter = 'B'                   // B - Both, Q - Questions, L - Labs 
var topicList = '';
var currentTopic = '';
var currentCourse = '';
var courseConfig = '';
var currentConfig = '';
var courseKeys;
var bt3;
var bt2;
// team names, color, and text color
var teams;
// labels used for UI elements
var uiLabels = {};
//
var enablePrint = false;
var courseCount = 0;
var b2Chk = '';
var b3Chk = '';

//----------------------------------------------------------
// document ready
//----------------------------------------------------------
$(document).ready(function() {
	// will get the information to populate uiLabels, etc.
	getVersion();
	// will get data to populate drop-down menus
	getSelectLists();
	showSplash();
	
	// no longer shown always hide
	$("#btn1").hide();

	// hide buttons 2 & 3 for now, until class is selected
	$("#btn2").hide();
	$("#btn3").hide();


	// events from tabs being selected controls the clearing of feedback data
	$( 'a[data-toggle="tab"]' ).on( 'shown.bs.tab', function( evt ) {
		var anchor = $( evt.target ).attr( 'href' );
		// each time clear feedback tab fields before showing tab
	   	if(anchor === "#feedback"){
			$("#comments").val('');
			$("#feedStatus").empty();
			$("#feedStatus").html('');
		}
		// insight graphs
		if(anchor === "#insight"){
			socket.emit('insight');
		}	
		
	});

	// show the work for the selected course
	$("#topiclabels").change(function(){
		$("#iBtn1").empty();
		$("#iBtn1").html('');
		$("#iBtn2").empty();
		$("#iBtn2").html('');
		$("#iBtn3").empty();
		$("#iBtn3").html('');
		$("#holdBtn2").hide();
		$("#holdBtn3").hide();
		// get the content for the selected topic by getting info for button 1
		getBtn1();
		//$("#btn2").hide();
		//$("#btn3").hide();
	});

	// show the course description when the course is selected from the option list
	$("#courseList").change(function(){
		$("#courseDesc").empty();
		$("#courseDesc").html('');
		var selected = $('#courseList option:selected').val();
		var desc = courseConfig[selected].c_desc;
		desc = desc.trim();
		$("#courseDesc").empty();
		$("#courseDesc").html(desc);

	});

	// used for drag-n-drop of courses by instructor/author
    $(function() {
        Dropzone.options.fileUploadDropzone = {
            maxFilesize: 1,
            maxFiles: 500,
            addRemoveLinks: true,
            dictResponseError: 'Server not Configured',
            url: '/upload',
            uploadMultiple: true,
            parallelUploads: 5,
            addRemoveLinks: true,
            dictRemoveFile: 'Delete',
            init: function() {

                var cd;
                this.on("success", function(file, response) {
                    $('.dz-progress').hide();
                    $('.dz-size').hide();
                    $('.dz-error-mark').hide();
                    console.log(response);
                    console.log(file);
                    cd = response;
                });
                this.on("addedfile", function(file) {
                    var removeButton = Dropzone.createElement("<a href=\"#\">Remove file</a>");
                    var _this = this;
                    removeButton.addEventListener("click", function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        _this.removeFile(file);
                        var name = "largeFileName=" + cd.pi.largePicPath + "&smallFileName=" + cd.pi.smallPicPath;
                        $.ajax({
                            type: 'POST',
                            url: 'DeleteImage',
                            data: name,
                            dataType: 'json'
                        });
                    });
                    file.previewElement.appendChild(removeButton);
                });
            }
        };
    })
});

// dynamically add the canvas element definitions for each course on the insight tab
function addCanvasDefs(cnt) {
	let cCnt = 0;
	let rtn = '';
	// increment cnt 
	cnt = cnt + 1;
	$("#graphs").html('');
	for (var c = 1; c < cnt; c++) {
		cCnt++;
		rtn = rtn +
		'<div class="container">' +
			'<div class="row my-2">' +
				'<div class="col-md-12 py-1">' +
					'<div class="card">' +
						'<div class="card-body">' +
							'<canvas id="chart' + cCnt + '">' 
							
		rtn = rtn +					
							'</canvas>' +
						'</div>' +
					'</div>' +
				'</div>' +
			'</div>' +
		'</div>'
	}
	$("#graphs").empty();
	$("#graphs").html(rtn);
}


// multi language support is implemented by setting the html elements
function setLabels() {
	$("#ctitle").html(uiLabels.collectorName + ' - ' + app_namespace);

	// slideout menu ites
	$("#menu00").html(uiLabels.menu00);
	$("#menu01").html(uiLabels.menu01);
	$("#menu02").html(uiLabels.menu02);
	$("#menu03").html(uiLabels.menu03);
	$("#menu04").html(uiLabels.menu04);
	$("#menu05").html(uiLabels.menu05);
	$("#menu06").html(uiLabels.menu06);
	$("#menu07").html(uiLabels.menu07);
	$("#menu08").html(uiLabels.menu08);
	$("#menu09").html(uiLabels.menu09);
	$("#menu10").html(uiLabels.menu10);
	$("#menu11").html(uiLabels.menu11);

	// tab labels
	$("#tab00").html(uiLabels.tab00);
	$("#tab01").html(uiLabels.tab01);
	$("#tab02").html(uiLabels.tab02);
	$("#tab03").html(uiLabels.tab03);
	$("#tab04").html(uiLabels.tab04);
	$("#tab05").html(uiLabels.tab05);

	// tab headers and buttons
	$("#tab00_hdr").html(uiLabels.tab00_hdr);
	$("#tab00_btn").html(uiLabels.tab00_btn);

	$("#tab01_hdr").html(uiLabels.tab01_hdr);
	$("#tab01_ns").html(uiLabels.tab01_ns);
	$("#tab01_wait").html(uiLabels.tab01_wait);

	$("#tab02_hdr").html(uiLabels.tab02_hdr);
	$("#tab02_hdr").hide();
	emptyCourse();

	$("#tab03_hdr").html(uiLabels.tab03_hdr);
	$("#tab03_inst").html(uiLabels.tab03_inst);
	$("#tab03_btn").html(uiLabels.tab03_btn);

	$("#tab04_hdr").html(uiLabels.tab04_hdr);

	$("#tab05_hdr").html(uiLabels.tab05_hdr);

	$("#modal_del_hdr1").html(uiLabels.modal_del_hdr1);
	$("#modal_del_hdr2").html(uiLabels.modal_del_hdr2);
	$("#modal_del_confirm").html(uiLabels.modal_del_confirm);
	$("#modal_del_btn1").html(uiLabels.modal_del_btn1);
	$("#modal_del_btn2").html(uiLabels.modal_del_btn2);

	$("#modal_time_hdr1").html(uiLabels.modal_time_hdr1);
	$("#modal_time_lbl").html(uiLabels.modal_time_lbl);
	$("#modal_time_btn1").html(uiLabels.modal_time_btn1);
	$("#modal_time_btn2").html(uiLabels.modal_time_btn2);

	$("#modal_ful_hdr").html(uiLabels.modal_ful_hdr);
	$("#modal_ful_msg").html(uiLabels.modal_ful_msg);
	$("#modal_ful_btn1").html(uiLabels.modal_ful_btn1);
	$("#modal_ful_btn2").html(uiLabels.modal_ful_btn2);

	$("#modal_valid_hdr").html(uiLabels.modal_valid_hdr);
	$("#modal_valid_btn").html(uiLabels.modal_valid_btn);

	$("#modal_about_hdr").html(uiLabels.modal_about_hdr);
	$("#modal_about_ver").html(uiLabels.modal_about_ver);
	$("#modal_about_lbl").html(uiLabels.modal_about_lbl);
	$("#modal_about_mid").html(uiLabels.modal_about_mid);
	$("#modal_about_ui").html(uiLabels.modal_about_ui);

	$("#modal_team_hdr").html(uiLabels.modal_team_hdr);
	$("#modal_team_lbl").html(uiLabels.modal_team_lbl);
	$("#modal_team_btn").html(uiLabels.modal_team_btn);

	$("#modal_print_hdr1").html(uiLabels.modal_print_hdr1);
	$("#modal_print_lbl").html(uiLabels.modal_print_lbl);
	$("#modal_print_btn1").html(uiLabels.modal_print_btn1);
	$("#modal_print_btn2").html(uiLabels.modal_print_btn2);
	$("#modal_print_preview").html(uiLabels.modal_print_preview);
	$("#modal_print_fail").html(uiLabels.modal_print_fail);

	$("#modal_delete_hdr1").html(uiLabels.modal_delete_hdr1);
	$("#modal_delete_btn1").html(uiLabels.modal_delete_btn1);
	$("#modal_delete_btn2").html(uiLabels.modal_delete_btn2);
	$("#modal_delete_pass").html(uiLabels.modal_delete_pass);
	$("#modal_delete_fail").html(uiLabels.modal_delete_fail);

	$("#modal_publish_hdr1").html(uiLabels.modal_publish_hdr1);
	$("#modal_publish_pub").html(uiLabels.modal_publish_pub);
	$("#modal_publish_unp").html(uiLabels.modal_publish_unp);
	$("#modal_publish_btn1").html(uiLabels.modal_publish_btn1);
	$("#modal_publish_btn2").html(uiLabels.modal_publish_btn2);
	$("#modal_publish_th1").html(uiLabels.modal_publish_th1);
	$("#modal_publish_th2").html(uiLabels.modal_publish_th2);
	$("#modal_publish_th3").html(uiLabels.modal_publish_th3);

	$("#modal_updateC_hdr1").html(uiLabels.modal_updateC_hdr1);
	$("#modal_updateC_desc").html(uiLabels.modal_updateC_desc);
	$("#modal_updateC_btn1").html(uiLabels.modal_updateC_btn1);
	$("#modal_updateC_btn2").html(uiLabels.modal_updateC_btn2);
	$("#modal_updateC_pass").html(uiLabels.modal_updateC_pass);
	$("#modal_updateC_fail").html(uiLabels.modal_updateC_fail);

	$("#modal_lang_hdr1").html(uiLabels.modal_lang_hdr1);
	$("#modal_lang_btn1").html(uiLabels.modal_lang_btn1);
	$("#modal_lang_btn2").html(uiLabels.modal_lang_btn2);

}


//----------------------------------------------------------
// socket io definitions for incoming 
//----------------------------------------------------------

socket.on('connect', function(data) {
    socket.emit('join', 'Session connected');
});

socket.on('version', function(data) {
	version = data.version;
	role = data.role;

	if (role === 'I' || role === 'i') {
		$("#author").show();
	} else {
		$("#author").hide();
		$("#graphTab").hide();
		$("#tab05").hide();
	}

	// set the colors/teams/student that will be used to display stats
	if (typeof data.teams !== 'undefined') {
		teams = data.teams;
	}

	// set the enablePrint control
	if (typeof data.enablePrint !== 'undefined') {
		enablePrint = data.enablePrint;
	}

	if (!enablePrint) {
		$("#coursePrint").hide();
	}	

	// set the labels
	if (typeof data.uiLabels !== 'undefined') {
		uiLabels = data.uiLabels;
	}
	app_namespace = data.ns;
	console.log('Version: ' + version + '  Role: ' + role + ' Namespace: ' + data.ns);
	$("#ctitle").html(uiLabels.collectorName + ' - ' + app_namespace);
	setLabels();

});

socket.on('data', function(data) {
	console.log('GotStats');
	if (updateScreen) {	
		var hdr = buildTblHeader();
		var stats = buildTblStats(data);
		$("#stats").empty();
    	$("#stats").html('');
		$("#stats").html(hdr + stats);
	} 
});

socket.on('getInfoResults', function(info) {
	console.log('Requested information received')
	var gkey = info.gkey;
	if (gkey.indexOf(currentConfig.b1_title) > -1 ) {
		$("#iBtn1").empty();
		$("#iBtn1").html(info.data);
		$("#holdBtn1").show();
	}
	if (currentConfig.b2_title.length > 0){
		if (gkey.indexOf(currentConfig.b2_title) > -1 ) {
			$("#iBtn2").empty();
			$("#iBtn2").html(info.data);
			$("#holdBtn2").show();
		}
	}

	if (currentConfig.b3_title.length > 0){
		if (gkey.indexOf(currentConfig.b3_title) > -1 ) {
			$("#iBtn3").empty();
			$("#iBtn3").html(info.data);
			$("#holdBtn3").show();
		}
	}
});

socket.on('getDropDownsResults', function(data) {
	dropDowns(data);
});

socket.on('updateCoursesResult', function(data) {
	let resp = '';
	if (data.status === 'PASS') {
		dropDowns(data);
		resp = uiLabels.modal_updateC_pass
	} else {
		let msg = '';
		if (typeof data.status.errno !== 'undefined') {
			msg = ': ' + data.status.errno;
		}
		resp = uiLabels.modal_updateC_fail + msg
	}

	$("#updateCResult").empty();
	$("#updateCResult").html('');
	$("#updateCResult").html(resp);
});

socket.on('refreshResults', function(data) {
	dropDowns(data);
	let resp = uiLabels.modal_delete_pass
	$("#deleteResult").empty();
	$("#deleteResult").html('');
	$("#deleteResult").html(resp);
});

socket.on('deleteCourseResults', function(data) {
	// save data from server
	let resp = 'Unknown';
	if (data.msg === 'PASS') {
		// update the course data from the server
		socket.emit('validateCourses', 'refresh');
	} else {
		resp = uiLabels.modal_delete_fail
		$("#deleteResult").empty();
		$("#deleteResult").html('');
		$("#deleteResult").html(resp);
	}
});

socket.on('setLanguageResults', function(data) {

	// set the labels
	if (typeof data.uiLabels !== 'undefined') {
		uiLabels = data.uiLabels;
	}
	$("#ctitle").html(uiLabels.collectorName + ' - ' + app_namespace);
	setLabels();
	populateLanguageList();
	let resp = 'Unknown';
	if (data.status === 'PASS') {
		resp = uiLabels.modal_lang_pass
	} else {
		resp = uiLabels.modal_lang_fail
	}
	$("#langResult").empty();
	$("#langResult").html('');
	$("#langResult").html(resp);
});


socket.on('feedbackResults', function(data) {
	$("#feedStatus").empty();
	$("#feedStatus").html('');
	$("#feedStatus").html('<br><br><p>' + data.status + '</p>');
});

socket.on('feedbackResults', function(data) {
	$("#feedStatus").empty();
	$("#feedStatus").html('');
	$("#feedStatus").html('<br><br><p>' + data.status + '</p>');
});

socket.on('teamColorResults', function(data) {
	let rtn = '<table class="table table-bordered"><thead><tr>' +
		'<th style="padding: 4px; width: 33%;">' + uiLabels.modal_team_lbl + '</th>' +
		'<th style="padding: 4px; width: 33%;">' + uiLabels.modal_team_lbl + '</th>' +
		'<th style="padding: 4px; width: 33%;">' + uiLabels.modal_team_lbl + '</th>' +
		'</tr></thead><tbody>';

	let rows = '';
	let tc = 1;
	let item = '';
	let row = '';
	for (team in data.teams) {
		item = data.teams[team];
		if (tc === 1) {
			row = row + '<tr>';
		}
		row = row + '<td style="padding: 2px; background-color:' + item.color + '; color: ' + item.text + '">' + team + '</td>';
		tc++
		if (tc === 4) {
			row = row + '</tr>';
			rows = rows + row;
			tc = 1;
			row = '';
		}
	}

	rtn = rtn + rows + '</tbody></table>';
	$("#teamShow").html(rtn);	
	$("#teamWait").html('');	

});


socket.on('validateCoursesResult', function(data) {
	closeNav();
    showValidateCoursesResult(data);
});


socket.on('pdfCreated', function(ofn) {
	var rtn = '';
	if (ofn !== 'FAIL') {
		rtn = '<a target="_blank" alt="course" title="Course" href="coursecatalog/' + ofn + '.pdf">' + uiLabels.modal_print_preview + '</a>';
	} else {
		rtn = uiLabels.modal_print_fail;
	}
	$("#pdfPreview").empty();
	$("#pdfPreview").html('');
	$("#pdfPreview").html(rtn);
});

socket.on('insightResults', function(data) {
	let cCnt = 0;
	let info = '';
	let cName = 'chart';
	let cData;
	let chartName
	for (chart in data) {
		info = data[chart];
		cCnt++;
		chartName = cName + cCnt;
		cData = null;
		cData = document.getElementById(chartName);
		if (cData) {
			new Chart(cData, info);
		}
	}
});



//----------------------------------------------------------
// socket io definitions for out-bound
//----------------------------------------------------------

function dropDowns(data) {
	topicList = data.labels;
	courseConfig = data.courseConfig;
	courseKeys = data.courseIds;
	populateCourseCatalogList(data.courseIds);
	if (courseCount > 0) {
		addCanvasDefs(courseCount);    // need to set this number dynamically based on number of courses 
	}
	populatePrintList(courseConfig);
	populateDeleteList(courseConfig);
	populateLanguageList();
}
 




// send request to server to get drop down list data
function getSelectLists() {
    socket.emit('getDropDowns');
}

// send request to server to get drop down list data for course delete
function getDeleteList() {
    socket.emit('getDeleteList');
}

// send request to server to get software version
function getVersion() {
    socket.emit('getVersion');
}

// send request to server to clear stats and handle the model
function clearStats() {
    closeNav();	
	$('#deleteModal').modal('show'); // Show delete modal box.
	$('.confirm_delete').on('click', function() {
		  	console.log('Clear the stats');
			socket.emit('clearStats', {});

			var hdr = buildTblHeader(defHdr);
			$("#stats").empty();
			$("#stats").html('');
			$("#stats").html(hdr);
		});
}

function showValidateCoursesResult(data) {
	$("#validateContents").html('');

	var htm;
	var result;
	var hl;
	if (typeof data.info === 'string') {
		htm = data.info.split('\n');
	} else {
		htm = data.info;
	}

	if (typeof htm.length !== 'undefined' ) {
		hl = htm.length;
		result = '';
	
		for (var h = 0; h < hl; h++) {
			if (htm[h].indexOf('infotab') === -1 ) {
				result = result + htm[h] + '<br>';
			}
		}
		// a hack for something that's broken
		for (j = 0; j < 15; j++) {
			result = result + '<br>';
		}
	}

    $("#validateContents").empty();
    $("#validateContents").html('');
    $("#validateContents").html(result);
    $("#validateModal").modal();
}

//----------------------------------------------------------
// send feedback to server
//----------------------------------------------------------
function sendFeedback() {
	console.log('feedback button')
	var comments = $('#comments').val();
	comments = comments.trim();
    if (comments !== '') {
		socket.emit('feedback',{'namespace': app_namespace, 'comments': comments});
    } else {
		var msg = uiLabels.tab03_nothing;
		console.log(msg)
		$("#feedStatus").empty();
		$("#feedStatus").html('');
		$("#feedStatus").html('<br><br><p>' + msg + '</p>');
	}
}


// show file upload modal 
function fileUpload() {
    $("div#filedropzone").show();
    closeNav();
    $("#fileModal").modal();
}

// show print course modal 
function printModal() {
	closeNav();
	$("#pdfPreview").empty();
	$("#pdfPreview").html('');
    $("#printModal").modal();
}

// validate course
function validateCourses() {
	closeNav();
	
	var resp = '<br><div><img style="float: left; vertical-align: middle; margin-bottom: 0.75em;" src="images/loading.gif" height="40" width="40">' +
	'&nbsp;&nbsp;&nbsp;&nbsp;<span style="vertical-align: middle;"></span></div>';
	$("#validateContents").html(resp);
    $("#validateModal").modal();

    socket.emit('validateCourses');
}

// update available courses
function updateCourses() {
	var resp = '<br><div><img style="float: left; vertical-align: middle; margin-bottom: 0.75em;" src="images/loading.gif" height="40" width="40">' +
	'&nbsp;&nbsp;&nbsp;&nbsp;<span style="vertical-align: middle;"></span></div>';
	$("#updateCResult").html(resp);

    socket.emit('updateCourses');
}

// validate course
function updateCoursesModal() {
	closeNav();
	$("#updateCoursesModal").modal();

}

// update dispaly language
function updateLanguage() {
	$("#langResult").empty();
	$("#langResult").html('');
	var lang = $("#langList option:selected").val();
    socket.emit('setLanguage', lang);
	var resp = '<br><div><img style="float: left; vertical-align: middle; margin-bottom: 0.75em;" src="images/loading.gif" height="40" width="40">' +
	'&nbsp;&nbsp;&nbsp;&nbsp;<span style="vertical-align: middle;"></span></div>';
	$("#langResult").html(resp);
	populateLanguageList();
}

// validate course
function languageModal() {
	closeNav();
	$("#languageModal").modal();

}


//----------------------------------------------------------
// screen handlers
//----------------------------------------------------------

// delete a course modal
function deleteCourseModal() {
	$("#deleteResult").empty();
	$("#deleteResult").html('');
    $("#deleteCourseModal").modal();
}

// delete a course process
function deleteCourse() {
	$("#deleteResult").empty();
	$("#deleteResult").html('');
	var pFile = $("#deleteList option:selected").val();
	socket.emit('deleteCourse', pFile);
	var resp = '<br><div><img style="float: left; vertical-align: middle; margin-bottom: 0.75em;" src="images/loading.gif" height="40" width="40">' +
	'&nbsp;&nbsp;&nbsp;&nbsp;<span style="vertical-align: middle;"></span></div>';
	$("#deleteResult").html(resp);
}

// publish courses
function publishCourses() {
	buildPublishTable();
    closeNav();
    $("#publishModal").modal();
}

function buildPublishTable() {
    $("#pubTable").empty();
    $("#pubTable").html('');
	
	let html = '';
	let row = ''
	let pub = '';
	let keys = courseKeys.split(',');
	let key = '';
	for (let p = 0; p < courseKeys.length; p++) {
		
		row = '';
		key = keys[p];

		if (typeof courseConfig[key] !== 'undefined') {
			if (courseConfig[key].published === true) {
				pub = uiLabels.modal_publish_pub
			} else {
				pub = uiLabels.modal_publish_unp
			}
			row = row + '<tr style="text-align: left; background-color: white;">' +
				'<td> <button type="button" class="btn-sm btn-outline-primary" onclick="publishToggle(\'' + key  + '\')" >' +
				uiLabels.modal_publish_btn2 + '</button></td>' +
				'<td style="margin-left: 5px; text-align: center;" id="pubrow-' + p + '">' + pub + '</td>' +
				'<td style="margin-left: 5px;">' +  courseConfig[key].c_title   + '</td> </tr>';

			html = html + row;
		}
	}
	$("#pubTable").html(html);	
}

function publishToggle(key) {
	let status = courseConfig[key].published;
	let rtn;
	if (status === true) {
		courseConfig[key].published = false;
		rtn = false;
	} else {
		courseConfig[key].published = true;
		rtn = true;
	}
	let data = {'key': key, 'status': rtn}
	socket.emit('publishCourse', data);
	buildPublishTable();
	socket.emit('validateCourses', 'refresh');
	//populateCourseCatalogList(courseIds);
}


// show the splash screen
function showSplash() {
    closeNav();
	$("#splash").show();
	$("#holdBtn1").hide();
	$("#holdBtn2").hide();
	$("#holdBtn3").hide();
	$("#ctitle").html(uiLabels.collectorName + ' - ' + app_namespace);
}

// start timer 
function setTimer() {
    closeNav();
    // screen defaults
	$("#minutes").val();
	$("#labtime").html('');
	$("#labtime").show();
	$("#timerModal").modal();
}

// start timer 
function clearTimer() {
	closeNav();
	clearInterval(clock);
    $("#labtime").hide();
}

// show the about modal 
function about() {
    closeNav();
    $("#version").empty();
    $("#version").html('');
    $("#version").html(uiLabels.modal_about_ver +  '  ' + uiLabels.softwareVersion);
    $("#aboutModal").modal();
}

// show the team modal 
function teamModal() {
	closeNav();
	socket.emit('teamColors');
	var resp = '<br><div><img style="float: left; vertical-align: middle; margin-bottom: 0.75em;" src="images/loading.gif" height="40" width="40">' +
	'&nbsp;&nbsp;&nbsp;&nbsp;<span style="vertical-align: middle;"></span></div>';
	$("#teamWait").html(resp);	
	$("#teamModal").modal();

}

// course selected and begin pressed
function startCourse() {
	clearBtns();
	$("#btn2").hide();
	$("#btn3").hide();

	var courseID = $("#courseList option:selected").val();
	currentConfig = courseConfig[courseID];
	currentCourse = courseID;

	$("#ctitle").html(uiLabels.collectorName + ' - ' + app_namespace + ': ' + courseConfig[courseID].c_title);

	// display selected course in UI
	console.log('Selected course: \n' + JSON.stringify(currentConfig, null, 4));

	// get the maximun count for the stats tab and set rendering default
	var tof = typeof courseConfig[courseID].c_max;
	if (tof !== 'undefined') {
		if (tof !== 'string') {
			defHdr = courseConfig[courseID].c_max;
		} else {
			defHdr = parseInt(courseConfig[courseID].c_max, 10);
		}
	}

	$("#btn1").hide()

	// set button titles so we can check them later
	b2Chk = courseConfig[courseID].b2_title;
	b3Chk = courseConfig[courseID].b3_title;


	// build the drop down selection list for the course then dispaly the tab
	populateTopicsList(courseID)
	$('#myTab a[href="#classwork"]').tab('show'); 

	// populate the Information tab with provided data
	if (typeof courseConfig[courseID].infotab !== 'undefined') {
		if (courseConfig[courseID].infotab.length > 0) {
			var info = '';
			for (var i = 0; i < courseConfig[courseID].infotab.length; i++) {
				if (i === 0 ) {
					info = courseConfig[courseID].infotab[i];
				} else {
					info = info + courseConfig[courseID].infotab[i];
				}
			}
			$("#infodocs").empty();
			$("#infodocs").html('');
			$("#infodocs").html(info);
		}
	}

	buildTblHeader();
	buildTblStats();

	//Added NIKH - select first topic
	document.getElementById("topiclabels").selectedIndex=1;
	$("#topiclabels").change();
}

function clearBtns() {
	$("#iComplete").empty();
	$("#iComplete").html('');
	$("#iComplete").hide();

	$("#iBtn1").empty();
	$("#iBtn1").html('');
	$("#holdBtn1").hide();

	$("#iBtn2").empty();
	$("#iBtn2").html('');
	$("#holdBtn2").hide();

	$("#iBtn3").empty();
	$("#iBtn3").html('');
	$("#holdBtn3").hide();
}


// send requests to server for data 
function getBtn1() {
	$("#btn2").hide();
	$("#btn3").hide();
	var geth = $("#topiclabels option:selected").text();
	// if different from previous topic reset screen sections
	if(geth !== currentTopic) {
		currentTopic = geth;
		clearBtns();

		if (currentConfig.b2_delay > 0 && currentConfig.b2_title.length > 0)	{
			delayButton2(currentConfig.b2_delay)
		} else {
			if (b2Chk === '' || b2Chk.length < 1) {
				$("#btn2").hide();
			} else {
				$("#btn2").show();
			}			
		}
		if (currentConfig.b3_delay > 0 && currentConfig.b3_title.length > 0)	{
			delayButton3(currentConfig.b3_delay)
		} else {
			if (b3Chk === '' || b3Chk.length < 1) {
				$("#btn3").hide();
			} else {
				$("#btn3").show();
			}
		}
	}
	
	var label = currentCourse + ' :- ' + geth;
	var data = {
		"item": label,
		"namespace": app_namespace,
		"action": 'start'
	}
	
    socket.emit('getInformation', data);
}

// send requests to server for button 2
function getBtn2() {
	var geth = $("#topiclabels option:selected").text();
	geth = bldRequest(geth, 2)
	var data = {
		"item": geth,
		"namespace": app_namespace,
		"action": 'button'
    }
    socket.emit('getInformation', data);
}

// send requests to server for button 3
function getBtn3() {
	var geth = $("#topiclabels option:selected").text();
	geth = bldRequest(geth, 3)
	var data = {
		"item": geth,
		"namespace": app_namespace,
		"action": 'button'
    }
    socket.emit('getInformation', data);
}

// build the proper search key to retrieve data for selected item
function bldRequest(geth, btn) {
	var hl = currentConfig.b1_title.length;
	var tail = geth.substring(hl);
	if (btn === 2) {
		return currentCourse + ' :- ' + currentConfig.b2_title + tail;
	}
	if (btn === 3) {
		return currentCourse + ' :- ' + currentConfig.b3_title + tail;
	}
}

function markComplete(key) {
	console.log('Mark complete: ' + key);
	$("#iComplete").empty();
	
	let fp = key.indexOf(':- ');
	if (fp > -1 ) {
		let msg = key.split(' ');
		if (typeof msg[3] !== 'undefined') {
			$("#iComplete").html(msg[3] + ' - ' + uiLabels.completeMsg);
		} else {
			$("#iComplete").html(key);
		}
	} else {
		$("#iComplete").html(key);
	}

		//Added NIKH
		var selectedTopic=document.getElementById("topiclabels").selectedIndex;
		selectedTopic=selectedTopic+1;
		var numberofTopics=document.getElementById("topiclabels").length
		if (selectedTopic<numberofTopics){
			//Select next topic
			document.getElementById("topiclabels").selectedIndex=selectedTopic;
			$("#topiclabels").change();
			$("#topiclabels").attr("disabled", false);
			$("#holdBtn1").stop().animate({ scrollTop: 0 }, 500);
		}
		else{
			//Block and tell user the lab is done
			$("#iComplete").hide();
			$("#holdBtn3").hide();
			$("#holdBtn1").hide();
			$("#btn3").hide();
			$("#btn2").hide();
			
			//document.getElementById("tab02_hdr").innerHTML='The course has ended. You did it!!!';
			$("#btn3").innerHTML='';
			alert("You have arrived at the end. You did it!!!");
			//$('.nav-tabs a[href="#catalog"]').tab('show');
			$('.nav-tabs a[href="#score"]').tab('show');
			$("#topiclabels").attr("disabled", false);
		}
	
	let msg = 
	$("#iComplete").show();

	var result = {'namespace': app_namespace, 'item': key};
	socket.emit('markComplete', result);
	$("#holdBtn1").scrollTop(0);
	
}

// course selected and begin pressed
function printCourse() {
	$("#pdfPreview").empty();
	$("#pdfPreview").html('');
	//$('#printModal').modal('hide'); // Show delete modal box.
	var pFile = $("#printList option:selected").val();
	socket.emit('printCourse', pFile);
	var resp = '<br><div><img style="float: left; vertical-align: middle; margin-bottom: 0.75em;" src="images/loading.gif" height="40" width="40">' +
	'&nbsp;&nbsp;&nbsp;&nbsp;<span style="vertical-align: middle;"></span></div>';
	$("#pdfPreview").html(resp);
}

//----------------------------------------------------------
// slide out navigation functions
//----------------------------------------------------------
function openNav() {
    document.getElementById("sideNavigation").style.width = "250px";
}

function closeNav() {
    document.getElementById("sideNavigation").style.width = "0";
}


//----------------------------------------------------------
// Statistics table functions
//----------------------------------------------------------

// build the stats table header info
function buildTblHeader(max) {
	if (currentCourse.length === 0) {
		max = 0
	} else {
		max = currentConfig.c_max;
	}

	if (max < defHdr ) {
		max = defHdr;
	}	
	var rtn = '<table class="table table-condensed table-sm"><thead>' 
	+ '<tr style="text-align: center; font-family: Arial Rounded MT Bold, Helvetica Rounded, Arial, sans-serif;">' 
	+ '<th>Team</th>';
	var tm = 0;
	for (var m = 0; m < max; m++ ) {
		tm = m + 1;
		if (m < 9) {
			rtn = rtn + '<th>0' + tm + '</th>';
		} else {
			rtn = rtn + '<th>' + tm + '</th>';
		}
	}
	// if instructor add Cnt
	if (role === 'I') {
		rtn = rtn + '<th>Cnt</th></tr></thead>';
	}
	return rtn;
}


// build the stats table for all reported namespaces / team / color
function buildTblStats(data, max) {
	if (currentCourse.length === 0) {
		max = 0
	} else {
		max = currentConfig.c_max;
	}

	if (max < defHdr ) {
		max = defHdr;
	}	
	if (typeof data === 'undefined') {
		return;
	}
	if (typeof data.items === 'undefined') {
		return;
	}
	if (typeof data.items.length === 'undefined') {
		return;
	}
	var hl = data.items.length;
	var rtn = '<tbody>';
	var color;
	var team;
	var cnt;
	var tColor;
	var defaultNS = false;
	var showCnt = '';
	// loop all entires and create the row in the stats table
	for (var i = 0; i < hl; i++) {
		team = data.items[i].team;
		if (typeof teams.teams[team] !== 'undefined') {
			color = teams.teams[team].color;
			tColor = teams.teams[team].text;
		} else {
			color = 'white';
			tColor = 'black';
		}

		if (color.length > 0) {
			color = color.toLowerCase();
			// default namespace gets changed to snow
			if (team === 'default') {
				defaultNS = true;
			} else {
				defaultNS = false;
			}
			
			// build the table stats data for this entry
			rtn = rtn + '<tr style="text-align: center;">' 
			+ '<td style="background-color: ' 
			+ color 
			+ '; color: ' 
			+ tColor + '; font-size: 125%; font-family: Arial, sans-serif;">' 

			if (defaultNS) {
				rtn = rtn + 'DEFAULT</td>';
			} else {
				rtn = rtn + team + '</td>';
			}
			
			// here is where it needs the fix for stats
			// cnt = data.items[i].cnt;
			cnt = 0;
			if (typeof data.items[i].keys !== 'undefined') {
				var tmp = data.items[i].keys.split('##')
				if (currentCourse.length > 0) {
					for (var k = 0; k < tmp.length; k++) {
						// check if course is auto complete
						if (currentConfig.c_auto === 'yes') {
							if (tmp[k].length > 1) {
								if (tmp[k].startsWith(currentConfig.course_id)) {
									cnt++
								}
							}
						} else  {
							// course is not auto complete so check if the entry has the course id, if so count
							if (tmp[k].indexOf(currentCourse) > -1) {
								cnt++;
							}
						}
					}
				}
			}

			for (var c = 0; c < max; c++) {
				if (c < cnt) {
					rtn = rtn + '<td style="font-size: 125%; ">' + checkMark + ';</td>';
				} else {
					rtn = rtn + '<td style="font-size: 125%; ">' + tbd + '</td>'
				}
			}

			if (role === 'I') {
				rtn = rtn + '<td style="background-color: ' + color 
				+ '; color: '
				+ tColor + '; font-size: 100%; font-family: Arial Rounded MT Bold, Helvetica Rounded, Arial, sans-serif;">' 
				+ i + '</td></tr>'
			} 
		} 
	}
	rtn = rtn + '</tbody></table>'
	return rtn;
}


//----------------------------------------------------------
// Timer common functions
//----------------------------------------------------------
// handle response to show the timer modal
function timer() {
	$("#timerModal").modal('hide');
	var timerMinutes = $("#minutes").val();
	var cnt = (timerMinutes * 60 * 1000);
	var now = new Date().getTime();
	
	// add minutes to now
	cnt = cnt + now;
	
	// enable updating when data received
	updateScreen = true;
	startClock(cnt);
}

// control creation and stopping of interval for timer 
function startClock(cnt) {
	// Set the date we're counting down to based on minutes provided
	var countDownDate = new Date(cnt);

	// if timer is already started clear the timer
	if (started) {
		clearInterval(clock);
		started = false;
	}

	// Update the count down every 1 second
	clock = setInterval(function() {
		started = true;
  		// Get todays date and time
  		var now = new Date().getTime();
	
  		// Find the distance between now and the count down date
  		var distance = countDownDate - now;

  		// Time calculations for days, hours, minutes and seconds
  		var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  		var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  		var seconds = Math.floor((distance % (1000 * 60)) / 1000);
		
  		// Output the result in an element with id="demo"
  		//document.getElementById("labtime").innerHTML = "&#x23F1;"   
  		document.getElementById("labtime").innerHTML = " "   
  			+ uiLabels.time_msg + ":   <span style='color: " + timeColor + ";'>" 
  			+ hours   + "</span>" + uiLabels.time_hour + "<span style='color: " + timeColor + ";'>"
  			+ minutes + "</span>" + uiLabels.time_min  + "<span style='color: " + timeColor + ";'>" 
  			+ seconds + "</span>" + uiLabels.time_sec;
	
  		// If the count down is over, write some text 
  		if (distance < 0) {
			clearInterval(clock);
			clock = null;
			document.getElementById("labtime").innerHTML = uiLabels.time_stop;
  		}
	}, 1000);
}


//----------------------------------------------------------
// populate the course catalod list
//----------------------------------------------------------
function populateCourseCatalogList(courses) {
    $("#courseList").empty();
    $("#courseList").html('');
	
	var items = [];
	var options = courses.split(',');
	
	// reset course count
	courseCount = 0;

	items.push('&nbsp;' + uiLabels.tab00_list);
	// load array to sort
	for (var j = 0; j < options.length; j++) {
		items.push(options[j])
	};
	// sort course names
	items.sort();
    var listitems = '';
	// build options for html
	for (var i = 0; i < items.length; i++) {
		var key = items[i];
		var ov = '';
		if (key.startsWith('C')) {
			ov = courseConfig[key].c_title;
		} else {
			ov = '&nbsp;' + uiLabels.tab00_list;
		}
		if (typeof courseConfig[key] !== 'undefined') {
			if (courseConfig[key].published === true) {
				//listitems += '<option value="' + items[i] + '">' + items[i] + '</option>';
				listitems += '<option value="' + items[i] + '">' + ov + '</option>';
				// set the number of courses found so the canvas array can match the number of courses
				courseCount = courseCount + 1;
				
			}
		}
	}
    $("#courseList").html(listitems);
}

//----------------------------------------------------------
// populate the language list
//----------------------------------------------------------
function populateLanguageList() {
    $("#langList").empty();
	$("#langList").html('');
	var langs = uiLabels.modal_lang_pick.split(',');
	var items = [];
	items.push('&nbsp;' + uiLabels.modal_lang_list + '::_blank');
	if (typeof langs[0] !== 'undefined') {
		items.push(langs[0].trim() + '::english');
	}
	if (typeof langs[1] !== 'undefined') {
		items.push(langs[1].trim() + '::french');
	}
	if (typeof langs[2] !== 'undefined') {
		items.push(langs[2].trim() + '::german');
	}
	if (typeof langs[3] !== 'undefined') {
		items.push(langs[3].trim() + '::spanish');
	}

	// sort course names
	items.sort();
	var listitems = '';
	var entry;

	// build options for html
	for (var i = 0; i < items.length; i++) {
		entry = items[i].split('::');
        listitems += '<option value="' + items[i] + '">' + entry[0] + '</option>';
	}
    $("#langList").html(listitems);
}

//----------------------------------------------------------
// populate the course delete list
//----------------------------------------------------------
function populateDeleteList(courses) {
    $("#deleteList").empty();
    $("#deleteList").html('');
	var items = [];
	items.push('&nbsp;' + uiLabels.modal_delete_list + '::_blank');
	// load array to sort
	for (course in courses) {
		items.push(courses[course].c_title + '::'+ courses[course].filename)
	}
	// sort course names
	items.sort();
	var listitems = '';
	var entry;
	// build options for html
	for (var i = 0; i < items.length; i++) {
		entry = items[i].split('::');
        listitems += '<option value="' + items[i] + '">' + entry[0] + '</option>';
	}
    $("#deleteList").html(listitems);
}

//----------------------------------------------------------
// populate the course catalod list
//----------------------------------------------------------
function populatePrintList(courses) {
    $("#printList").empty();
    $("#printList").html('');
	var items = [];
	items.push('&nbsp;' + uiLabels.modal_print_list + '::_blank');
	// load array to sort
	for (course in courses) {
		items.push(courses[course].c_title + '::'+ courses[course].filename)
	}
	// sort course names
	items.sort();
	var listitems = '';
	var entry;
	// build options for html
	for (var i = 0; i < items.length; i++) {
		entry = items[i].split('::');
        listitems += '<option value="' + items[i] + '">' + entry[0] + '</option>';
	}
    $("#printList").html(listitems);
}


//----------------------------------------------------------
// populate the topics drop down
//----------------------------------------------------------
function populateTopicsList(course) {
    $("#topiclabels").empty();
	$("#topiclabels").html('');

	var options = topicList.split(',');
    var listitems = '';
	listitems = '<option value="select">&nbsp;&nbsp;' + uiLabels.tab02_list + '</option>';

	for (var j = 0; j < options.length; j++) {
		// check for items that match this course
		if (options[j].startsWith(course + ' :- ')) {
			// remove the course id and ' :- '
			var fp = options[j].indexOf(' :- ');
			var data = options[j].substring(fp + 4);
			// check if this is the first
			if (data.startsWith(currentConfig.b1_title)) {
				var sp = data.indexOf(currentConfig.b1_title);
				var newitem = data.trim();
				// save full key in value and easy to read in the viewable area
				listitems += '<option value="' + options[j] + '">' + newitem + '</option>';
			}
		}
	}

	$("#topiclabels").html(listitems);
	// set the button values
	$("#btn1_label").html(currentConfig.b1_title);
	$("#btn2_label").html(currentConfig.b2_title);
	$("#btn3_label").html(currentConfig.b3_title);

}

function emptyCourse() {
	let listitems = '<option value="select">' + uiLabels.tab02_begin + '</option>';
	$("#topiclabels").html(listitems);
}

//----------------------------------------------------------
// delay showing buttons 2 and 3 if configured with dealy
//----------------------------------------------------------
function delayButton2(delay) {
	$("#btn2").hide()
	bt2 = setInterval(function() {
		  	$("#btn2").show();
      		clearInterval(bt2);
	}, delay);
}

function delayButton3(delay) {
	$("#btn3").hide()
	bt3 = setInterval(function() {
		  	$("#btn3").show();
      		clearInterval(bt3);
	}, delay);
}

//----------------------------------------------------------
console.log('loaded cllrsmain.js');
//----------------------------------------------------------