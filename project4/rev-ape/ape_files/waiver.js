/*
 * Academic Planning Environment
 * by Alissa Johnson, Drew Hearle, Steve Dunlap, Steph Russell, and Zach Klink.
 * Copyright (c) Cedarville University, its Computer Science faculty,
 * and the authors. All rights reserved.
 */

/*
 * This is the Waivers object.
 * This has to be pulled out from apeui because it is included in both the student and fac pages
 */

var myWaiver;
$(document).ready(function(){
	$('#waiverShowBtn').click(function(){
		myWaiver = new waiverDialog();
		myWaiver.showWaiverDialog();
	});
});


/*
 * The waivers dialog essentially has 3 "modes"
 * 1. Student Mode (No create, delete, only view student waivers)
 * 2. Advising Mode[fac on student plan] (Create, view, delete student waivers)
 * 3. Global Mode[loaded from Fac pg] (Create, view, delete waivers for entire majors)
 */

//"mode" can be 'student', 'advising', or 'global'
var waiverDialog = function() {
	this.dlog = null;

	this.majorlist = {};
	this.minorlist = {};

	this.majorID = null;
	this.minorID = null;

	this.mode = this.detectMode();
	this.courseList = null;

	this.errorTimeoutID = 0;
};

waiverDialog.prototype.detectMode = function(){
	//look for the ui object, which is in apeui.js
	if(typeof apeUI != 'function'){
		return 'global';
	//} else if ($('#facbtn').length == 1){
	} else if (ui.isFac){
		return 'advising';
	} else {
		return 'student';
	}
}

waiverDialog.prototype.showWaiverDialog = function(){

	var waiver = this;

	waiver.dlog = $('<div id="waiverbox"><p class="throb"></p></div>');
	waiver.dlog.dialog({
		title: 'Waivers',
		resizable: false,
		modal: true,
		draggable: false,
		position: ((waiver.mode == 'global')?(($(window).width() > 1000)?[300, 130]: 'center'):'center'),
		width: 'auto',
		close: function() {

			waiver.dlog.dialog('destroy');
			waiver.dlog.remove();

			if(waiver.mode != 'global'){
				//re-load the plan 
				ui.buildReqTree();
			}
		}
	}).data('waiver', waiver)
	.load('waiver.php?action=waiverDialog&mode=' + waiver.mode, function() {
		if($('#waiverDialog').length == 0){
			if(waiver.mode == 'global'){
				alert('Sorry, you have timed out. Please refresh the page.');
			} else {
				ui.showTimeout();
			}
		} else {
			//resize as we wait for the waiverlist to load
			if(waiver.mode != 'global'){
				waiver.dlog.dialog('option', {position:'center', width: 'auto'});
			}

			$('#waiverDialog input').placeholder();

			$('#waiverClose').button().click(function(){
				waiver.dlog.dialog('close');
			});

			$('#waiverCreate').button().click(function(){
				waiver.validateWaiver();
			});

			$('#addSubstitute').button({icons:{primary:'ui-icon-plus'}}).click(function(){
				$(this).fadeOut(function(){
					$('#sub2').fadeIn();
				});
				$('#replaceAlign span:last').text('with both');
			});

			$('#sub2Close').click(function(){
				$('#sub2').fadeOut(function(){
					$('#addSubstitute').fadeIn().val('');
				});

				$('#replaceAlign span:last').text('with');
			});

			$('#noSub').click(function(){
				if(this.checked){
					$('#subClass, #subClass2').attr('disabled', 'disabled');
					$('#subClass, #subClass2').val('nothing');
				} else {
					$('#subClass, #subClass2').removeAttr('disabled');
					$('#subClass, #subClass2').val('');
				}
			});

			$(this).find('#waiverYears').buttonset().find('input').button({icons: {
				primary: 'ui-icon-empty'
			}}).click(function(){

				if($(this).filter(':checked').length == 0){

					$(this).button('option', 'icons', {
						primary: 'ui-icon-empty'
					});

				} else {
					$(this).button('option', 'icons', {
						primary: 'ui-icon-check'
					});
				}
			});

			$('#initClass, #subClass, #subClass2, #majorList, #minorList').val('Loading...').attr('disabled', true);

			if(waiver.mode == 'global'){
				//setup Major/Minor selection
				var majSelect = $('#majorSelect');
				var minSelect = $('#minorSelect');

				waiver.loadMajorList();
				waiver.loadMinorList();


				majSelect.find('a').click(function(){
					majSelect.fadeOut(function(){
						minSelect.fadeIn();
					});
				});

				minSelect.find('a').click(function(){
					minSelect.fadeOut(function(){
						majSelect.fadeIn();
					});
				});
			} else {
				waiver.loadWaiversAndCourses(null,null);
			}
		}
	});
}

waiverDialog.prototype.loadMajorList = function(){
	var waiver = this;
	$.getJSON('manage.php?action=majorlist', function(data){
		if(data.type == 'majorlist') {

			waiver.majorlist = data.data;

			var flatMajorList = []
			$.each(waiver.majorlist,function(k,v){
				flatMajorList.push(k);
			});

			$('#majorList').val('')
				.attr('disabled', false)
				.autocomplete({
					source: flatMajorList,
					minLength: 0,
					selectFirst: true,
					select: function(event,item){waiver.loadWaiversAndCourses(item, this);}
				});

		} else if(data.type == 'timeout' || data.data == 'nologin'){
			alert('Sorry, you have timed out. Please refresh the page.');
		} else if(data.type == 'error') {
			console.log('getMinorList error: ' + data.data);
			alert('getMinorList error: ' + data.data + '. Please report a bug.');
		} else {
			console.log('Unknown error in getMinorList');
			alert('Unknown error in getMinorList. Please report a bug.');
		}
	});
}

waiverDialog.prototype.loadMinorList = function(){
	var waiver = this;

	$.getJSON('manage.php?action=minorlist', function(data){
		if(data.type == 'minorlist') {

			waiver.minorlist = data.data;

			var flatMinorList = []
			$.each(waiver.minorlist,function(k,v){
				flatMinorList.push(k);
			});

			$('#minorList').val('')
				.attr('disabled', false)
				.autocomplete({
					source: flatMinorList,
					minLength: 0,
					selectFirst: true,
					select: function(event,item){waiver.loadWaiversAndCourses(item, this);}
				});

		} else if(data.type == 'timeout' || data.data == 'nologin'){
			alert('Sorry, you have timed out. Please refresh the page.');
		} else if(data.type == 'error') {
			console.log('getMinorList error: ' + data.data);
			alert('getMinorList error: ' + data.data + '. Please report a bug.');
		} else {
			console.log('Unknown error in getMinorList');
			alert('Unknown error in getMinorList. Please report a bug.');
		}
	});
}

waiverDialog.prototype.loadWaiversAndCourses = function(item, el){
	var waiver = this;

	//we need to know wen both Waivers and Courseslist have FULLY been loaded(callback complete)
	//SEE:
	//http://api.jquery.com/category/deferred-object/
	//http://api.jquery.com/jQuery.when/
	var loadWaiversDef = new $.Deferred();
	var loadCourseListDef = new $.Deferred();

	waiver.loadWaivers(item, el, loadWaiversDef);

	if(waiver.mode != 'student'){

		$.getJSON('waiver.php?action=courselist&mode=' + waiver.mode, function(data){
			if(data.type == 'courselist'){
				waiver.courseList = data.data;

				//add transfer classes that don't have a direct Cedarville mapping to our courselist so it can act as a substitution
				//Yes, they are this much of a pain to find
				if(waiver.mode == 'advising'){
					for(var year in ui.curPlan.years){
						var yr = ui.curPlan.years[year];
						for(var sem in yr){
							if(sem == 'fa' || sem == 'sp' || sem == 'su'){
								for(var crs in yr[sem]){
									if(yr[sem][crs].trans && ui.coursecat[ yr[sem][crs].name ] == undefined){
										waiver.courseList[ yr[sem][crs].name ] = '[TRANSFER]';
									}
								}
							}
						}
					}
				}

				waiver.initCourseAutocomplete();

				loadCourseListDef.resolve();
			} else if(data.type == 'timeout' || data.data == 'nologin'){
				alert('Sorry, you have timed out. Please refresh the page.');
			} else {
				alert('Error loading Course list. Please Report a bug.');
			}
		});

	} else {
		waiver.courseList = ui.coursecat;
		loadCourseListDef.resolve();
	}

	//apply hover titles when both callbacks are complete
	//check passing the promisses
	$.when(loadWaiversDef, loadCourseListDef).then(function(){

		//don't forget that a title is also added when adding a new waiver
		$('#waiverList .waiverCourse').each(function(k, v){
			var text = $(v).text();
			var hoverText = '';
			if(text.substring(0,6) == 'COURSE'){
				hoverText = 'Waiver Slot';
			} else {
				hoverText = waiver.courseList[text];
			}

			$(v).attr('title', hoverText );
		});
	});
}

waiverDialog.prototype.loadWaivers = function(item, sel, deferred){
	var waiver = this;

	var params = {
		action: 'waiverlist',
		mode: waiver.mode
	}

	if(waiver.mode != 'student'){
		$('#waiverCreate').show();
	}

	var type;
	var name;
	if(waiver.mode == 'global'){
		$(sel).parent().fadeOut(function(){
			$('#waiverList, #curWaiversTitle').fadeIn();
			$('#waiverDialog fieldset').slideDown();

			if($(window).width() < 1000){
				waiver.dlog.dialog('option', {position: 'center', width: 'auto'});
			}
		});

		if(sel.id == 'majorList'){
			type = 'major';
			name = item.item.label

			var majorID = waiver.majorlist[name];
			params['major'] = majorID;
			waiver.majorID = majorID;

		} else if(sel.id == 'minorList'){
			type = 'minor';
			name = item.item.label;

			var minorID = waiver.minorlist[name];
			params['minor'] = minorID;
			waiver.minorID = minorID;
		}
	} else {
		$('#waiverDialog fieldset, #waiverList, #curWaiversTitle').show();
	}

	$.getJSON('waiver.php', params, function(data){
		if(data.type == 'waiverlist'){
			
			if(waiver.mode == 'global'){
				$('#curWaiversTitle').html('Current Waivers for the '+name+' '+type);
			}

			if(data.data.length == 0){
				$('#waiverList .throb').replaceWith('<td id="noWaiver" colspan="100%">It looks like '+((waiver.mode =='global')?'the '+name+' '+type+' doesn\'t':'you don\'t')+' have any waivers.</td>');
			} else {

				var waiverList = $('#waiverList');

				//remove the throb 
				waiverList.find('tr .throb').parent().remove();

				for(var i in data.data){

					//data.data[i]['years'] is valid in global mode and data.data.appliesTo is valid in student/advising mode
					var applies = (data.data[i].appliesTo == '*'?'Student':data.data[i].appliesTo + ' ' + data.data[i].majMin);

					//DMG - fix waiver delete 10/3/12
					waiver.drawWaiver(data.data[i].waiverID, data.data[i].course, data.data[i].subOne, data.data[i].subTwo, data.data[i]['years'], applies);
				}

				waiverList.find('a.delWaiver').click(waiver.delWarning);
			}
			deferred.resolve();

			//final resize
			if(waiver.mode != 'global'){
				waiver.dlog.dialog('option', {position:'center', width: 'auto'});
			}
			
		} else if(data.type == 'timeout' || data.data == 'nologin'){
			if(waiver.mode == 'global'){
				alert('Sorry, you have timed out. Please refresh the page.');
			} else {
				ui.showTimeout();
			}
		} else if(data.type == 'error') {
			console.log('loadWaivers error: ' + data.data);
			if(waiver.mode == 'global'){
				alert('loadWaivers error: ' + data.data + '. Please report a bug.');
			} else {
				ui.showErrorDialog('loadWaivers error: ' + data.data);
			}
		} else {
			console.log('Unknown error in loadWaivers');
			ui.showErrorDialog('Unknown error in loadWaivers. Please report a bug.');
		}
	});
}

waiverDialog.prototype.drawWaiver = function(id, course, subOne, subTwo, years, appliesTo){
	var waiver = this;
	$('#waiverList').append('<tr id=waiver-'+id+'><td><span class="waiverCourse mainCourse">'+course+'</span></td><td>'+(subOne? '<span class="waiverCourse sub1">'+subOne+'</span>' :'none')+(subTwo? ', <span class="waiverCourse sub2">'+subTwo+'</span>' :'')+'</td><td>'+((waiver.mode == 'global')?years.join(', '): appliesTo)+'</td>'+((waiver.mode != 'student')?'<td>'+(((waiver.mode != 'student' && appliesTo =='Student') || waiver.mode == 'global')?'<a href="#waiver'+id+'" class="ui-icon ui-icon-trash delWaiver" title="Delete">Delete</a></td>':'</td>'):'')+'</tr>');
}

waiverDialog.prototype.initCourseAutocomplete = function(){
	var waiver = this;
	
	var flatCourseList = [];

	$.each(waiver.courseList,function(k,v){
		flatCourseList.push({name: k, title: v, value: k+' '+v});
	});

	//$(['#initClass', '#subClass', '#subClass2']).each(function(k,v){
	this.createAutocomplete('#initClass', flatCourseList, false);
	this.createAutocomplete('#subClass' , flatCourseList, true);
	this.createAutocomplete('#subClass2', flatCourseList, true);

  $('#initClass').focus();
}

waiverDialog.prototype.createAutocomplete = function(sel, crsList, showTransfers){
	$(sel).val('')
		.attr('disabled', false)
		.autocomplete({
			source: crsList,
			selectFirst: true,
			minLength: 2,
			select: function( event, ui ) {
				$(sel).val( ui.item.name + ' ' + ui.item.title).data('name', ui.item.name);
				return false;
			}

			//clear the text on focus lost if nothing is selected
			}).blur(function(){
				var name = $(sel).data('name');
				if(name == undefined || $(sel).val().search(name) != 0){
					$(sel).val('');
				}

			//magic function from http://jqueryui.com/demos/autocomplete/#custom-data
			//this allows us to just "get" the course name only
			}).data('autocomplete')._renderItem = function(ul, item) {
				if(showTransfers || item.title != '[TRANSFER]'){
					return $('<li></li>')
						.data('item.autocomplete', item )
						.append('<a>' + item.name + ' ' + item.title + '</a>')
						.appendTo( ul );
				} else {
					return false;
				}

	
			};
}

waiverDialog.prototype.validateWaiver = function(){
	var waiver = this;
	var action = {
		action : 'addwaiver',
		mode   : waiver.mode,
		course : $('#initClass').autocomplete('value').data('name')
	}

	var errorMsgs = [];

	if(action.course == ''){
		errorMsgs.push({msg:'No Class has been selected', selector: $('#initClass')});
	} else if(waiver.courseList[action.course] == undefined){
		errorMsgs.push({msg:'Improper Class selection', selector: $('#initClass')});
	}

	if($('#subClass').val() != 'nothing' && $('#subClass').val() != ''){
		var sub = $('#subClass').autocomplete('value').data('name');

		if(waiver.courseList[sub] == undefined){
			errorMsgs.push({msg:'Improper Substitute selection', selector: $('#subClass')});
		} else {
			//actually set the val
			action['sub1'] = sub;
		}

	} else if( !$('#noSub').is(":checked")){
		errorMsgs.push({msg:'Check "No Substitute" or enter a substitute', selector: $('#subClass')});
	}

	if($('#sub2').is(':visible') && $('#subClass2').val().length && $('#subClass2').val() != 'nothing' ){
		action['sub2'] = $('#subClass2').autocomplete('value').data('name');
	}


	//Set global-mode only variables
	if(waiver.mode == 'global'){

		if(waiver.majorID){
			action['major'] = waiver.majorID;
		} else if(waiver.minorID){
			action['minor'] = waiver.minorID;
		} else {
			console.log('something is broken in Major/Minor select');
		}

		if($('#waiverYears input:checked').length){
			$('#waiverYears input:checked').each(function(k,v){
				if(action['years'] === undefined){
					action['years'] = [$(v).attr('id')];
				} else {
					action['years'].push($(v).attr('id'));
				}
			});
		} else {
			errorMsgs.push({msg:'No years have been selected', selector: $('#waiverYears')});
		}
	}

	if(errorMsgs.length == 0){
		waiver.addWaiver(action);
	} else {
		var errorStr = (errorMsgs.length==1?'Error: ':'Errors: ');

		for(i in errorMsgs){
			errorStr += errorMsgs[i].msg + ',<br />';

			if(waiver.mode != 'global'){
				ui.blinkElement(errorMsgs[i].selector);
			}
		}

		var errorDiv = $('#errorDiv');
		errorDiv.html(errorStr.slice(0,-7));
		errorDiv.fadeIn();

		//clear a previous error msg
		clearTimeout(waiver.errorTimeoutID);
		waiver.errorTimeoutID = setTimeout(function(){
			errorDiv.fadeOut(2000); 
		},10000);
	}
}

waiverDialog.prototype.addWaiver = function(action){
	var waiver = this;
	$.post('waiver.php', action, function(data){
		if(data.type == 'ack'){

			//remove the noplan message
			$('#noWaiver').parent().remove();

			//draw the waiver in the waiverlist.  Assuming 'Student' Scope because we only show scope in student/advising mode, and it's ignored in global mode
			waiver.drawWaiver(data.data, action.course, action.sub1, action.sub2, action['years'], 'Student');
			var newWaiver = $('#waiver-' + data.data);

			//add click event
			newWaiver.find('a.delWaiver').click(waiver.delWarning);

			//add hover text
			newWaiver.find('.waiverCourse').each(function(k, v){
				$(v).attr('title', waiver.courseList[$(v).text()]);
			});

			//reset the form
			$('#waiverDialog .waiverClass input').val('');
			$('#waiverYears input').prop('checked', false).button({icons: {
				primary: 'ui-icon-empty'
			}}).button('refresh');

			$('#noSub').prop('checked', false);
			$('#subClass, #subClass2').removeAttr('disabled');
			$('#subClass, #subClass2').val('');

			$('#errorDiv').html('');

		} else if(data.type == 'timeout' || data.data == 'nologin'){
			if(waiver.mode == 'global'){
				alert('Sorry, you have timed out. Please refresh the page.');
			} else {
				ui.showTimeout();
			}
		} else if(data.type == 'error') {
			console.log('add waiver error: ' + data.data);
			if(waiver.mode == 'global'){
				alert('addwaiver error: ' + data.data + '. Please report a bug.');
			} else {
				ui.showErrorDialog('addwaiver error: ' + data.data);
			}
		} else {
			console.log('Unknown error in addwaiver');
			ui.showErrorDialog('Unknown error in addwaiver. Please report a bug.');
		}
	}, 'json');
}

waiverDialog.prototype.delWaiver = function(id){
	var waiver = $('#waiverbox').data('waiver');
	//var id = this.href.split('#')[1];
	//id = parseInt(id.substr(6));
	var action =  {
		action: 'delwaiver',
		mode: waiver.mode,
		waiverID: id,
		course: $('#waiver-'+id+ ' .mainCourse').text()
	}

	if($('#waiver-'+id+ ' .sub1').length != 0){
		action['sub1'] = $('#waiver-'+id+ ' .sub1').text();
	}

	if($('#waiver-'+id+ ' .sub2').length != 0){
		action['sub2'] = $('#waiver-'+id+ ' .sub2').text();
	}


	$.post('waiver.php', action, function(data){
		if(data.type == 'ack'){
			var count = $('#waiverList > thead > tr:first > th').length;

			var row = $('#waiver-'+id);
			row.children('td').each(function(){
				$(this).wrapInner('<div />').children('div').slideUp(200, function(){
					count--;
					if(count==0) {
						row.remove();

						//re-add the no-waiver msg if we deleted the last one
						if($('#waiverList tbody > tr').length == 0){
							
							var name, type;
							if(waiver.mode == 'global'){
								if(waiver.majorID){
									type = 'major';
									$.map(myWaiver.majorlist, function(v,k){
										if(v == waiver.majorID){
											name = k;
											return false;
										}
									});
								} else {
									type = 'minor';
									$.map(myWaiver.minorlist, function(v,k){
										if(v == waiver.minorID){
											name = k;
											return false;
										}
									});
								}
							}

							$('#waiverList tbody').append('<tr><td id="noWaiver" colspan="100%">It looks like '+((waiver.mode =='global')?'the '+name+' '+type+' doesn\'t':'you don\'t')+' have any waivers.</td></tr>');
						}
					}
				});
			});

		
		} else if(data.type == 'timeout' || data.data == 'nologin'){
			if(waiver.mode == 'global'){
				alert('Sorry, you have timed out. Please refresh the page.');
			} else {
				ui.showTimeout();
			}
		} else if(data.type == 'error') {
			console.log('add waiver error: ' + data.data);
			if(waiver.mode == 'global'){
				alert('delWaiver error: ' + data.data + '. Please report a bug.');
			} else {
				ui.showErrorDialog('delWaiver error: ' + data.data);
			}
		} else {
			console.log('Unknown error in delWaiver');
			ui.showErrorDialog('Unknown error in delWaiver. Please report a bug.');
		}
	},'json');
}

waiverDialog.prototype.delWarning = function(){
	var waiver = $('#waiverbox').data('waiver');

	// get waiver ID
	var id = this.href.split('#')[1];
	id = parseInt(id.substr(6));

	$('<div id="confirmdel"><p>Are you sure you want to delete this waiver?</p><h4>Waiver: '+ $('#waiver-' + id + ' .mainCourse').text() +'</h4></div>').dialog({
		resizable: false,
		modal: true,
		draggable: false,
		open: function() {
		
			waiver.closeable = false;
			waiver.confirmOpen = true;
		},
		buttons: {
			'No, not so much.': function() {$(this).dialog('close');},
			'Yes, I\'m sure.' : function() { /*alert('Delete plan ID '+newID);*/waiver.delWaiver(id);$(this).dialog('close');}
		},
		title: 'Confirm Delete',
		close: function() {
			// Note that if you close the box, it's the same as hitting cancel

			/* Need to unload and remove dialog, since it will be created again */
			$(this).dialog('destroy');
			$(this).remove();
		}
	});
}