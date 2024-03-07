/*
 * Academic Planning Environment
 * by Alissa Johnson, Drew Hearle, Steve Dunlap, Steph Russell, and Zach Klink.
 * Copyright (c) Cedarville University, its Computer Science faculty,
 * and the authors. All rights reserved.
 */

/**
 * APEUI
 * (c)  2010-2012 Drew Hearle, Zach Klink & the APE teams
 */

// TODO: Before release, this should be minified.

// Columns of coursefinder. Change if we add columns.
var COLS = {'name':0, 'title':1, 'credits':2, 'desc':3};
var SEMS = {'fa':'Fall','sp':'Spring','su':'Summer'};


// If browser doesn't support a JS console, create a dummy console obj
// so our log stmts don't crash the app
if(typeof console == 'undefined') {
	var dbgConsole = function() {};
	dbgConsole.prototype.log = function(str) { /*alert('Log: '+str);*/ };
	var console = new dbgConsole();
}

$(document).ajaxError(function(e, xhr, settings, exception) {

	console.log('AJAX error calling: ' + settings.url + ' - error: ' + xhr.responseText);
	//not handling the "0" status because a "double-refresh" returns a 0, which gives a pointless error
	//This is because a request that is canceled in-flight returns 0
	if(xhr.status != 0){
		ui.showErrorDialog('AJAX error calling: ' + settings.url + ' - error: ' + xhr.responseText );
	}
});

$(document).ajaxComplete(function(){

	//ui.timeoutLength is loaded in getSessionplan
	//the timeout is also launched then
	if(ui.timeoutLength != null && $('#timeoutWarning').length == 0 &&  $('#timeoutDlog').length == 0 ){
		ui.setTimeout();
	}
});

var apeUI = function()
{
	// Constructor is here
	//this.initui();
	//if(typeof console != 'undefined') console.log('APEUI instantiated');
	console.log('APEUI instantiated');


	// BEGIN VARS
	this.curPlan = null;
	this.isLoadingPlan = false;
	this.isFac = false;
	this.reqtree = null;
	this.finder = null;
	this.accordState = -1;
	this.accordScroll = -1;
	this.dragging = false;
	this.coursecat = {}// = new Array();
	this.errtmp = 0;
	this.manager = null;
	this.creator = null;
	this.waiver = null;
	this.errdiv = null;
	this.errCount = 0;
	this.warnCount = 0;
	this.lastNotesOutID = 0;
	this.showGrades = false;
	this.timeoutLength = null;
	this.timeoutWarning = 300;//5 min
	this.timeout = null;

	//BEGIN CONSTRUCTOR
	this.initui();
};

// BEGIN METHODS
apeUI.prototype.initui = function()
{
	// Initial widths/heights
	this.layout();
	this.makeResizable();

	// Run logon script
	$.getScript('banner.php?parent=home&r='+Math.floor(Math.random()*100001));

	// Requirements tree display
	// NOTE: this probably becomes dynamic too, since it changes by plan.
	/*this.reqtree = $("#tree").accordion({
		fillSpace: true
	});*/
	this.reqtree = null;

	// Course finder (static)
	var uitmp = this;
	this.finder = $("#coursefinder").dataTable({
		"bPaginate": false,
		"sDom": '<"toolbar"fi>t',
		/*"aoColumnDefs": [
			{'bSearchable':false, 'bSortable':false, 'aTargets': [3]}
		],*/
		"bAutoWidth": false,
		"fnInitComplete": function() {
			// Add search "clear" link
			$('#coursefinder_filter input').before('(<a href="#">clear</a>) ');
			$('#coursefinder_filter a').click(function() {
				$('#coursefinder_filter input').removeAttr('disabled').removeClass('autofilter');
				ui.finder.fnFilter('',0);
				ui.finder.fnFilter('');
				$('#coursefinder_filter input').focus();
				return false;
			});

		    $('#coursefinder tr').each(function(){

			// We're using DOM here instead of jQuery for optimum performance.
			var line = this.childNodes[0].innerHTML;
			var undef = undefined;
			if(line != '' && line !== undef) {
				uitmp.coursecat[line] = this.childNodes[1].innerHTML;
				//uitmp.coursedesc[line] = this.childNodes[3].firstChild.innerHTML;
			}

			//console.log(this.childNodes[0].innerHTML);
			/*if(count < 10) {
				//console.log(this.childNodes[1].innerHTML);
				count++;
			}*/

			//$(this).css('font-weight', 'bold');
			//$(this).draggable({appendTo:'body'});

			// Make course finder rows draggable
			$(this).draggable({
				revert: 'invalid',
				/*start: function() { $(this).appendTo('body'); }*/
				helper: function(event) {
					// (event, ui)
					/*alert(event.target);
					return '<div style="width: 100px; height: 50px; border: 1px solid #000; background-color: #fff;"></div>';*/
					//var newEl = $(event.target).html();
					//return '<div class="dragtree">'+newEl+'</div>';
					var row = ui.finder.fnGetData(ui.finder.fnGetPosition(this));
					var el = $('<div class="dragfinder">'+row[COLS['name']] + ' ' + row[COLS['title']] +'</div>');


					//We need to get the width of the element we are creating.
					//Width isn't right on elements that aren't in the DOM,
					//so need to create a fake element off screen
					var tempEle= $('<div id="tempEle">'+row[COLS['name']] + ' ' + row[COLS['title']] +'</div>').css({
							position: 'absolute',
							left: -5000,
							top: -5000,
							display: 'none'
						 }).appendTo('body');
					var width = tempEle.width();
					tempEle.remove();

					
					$(this).draggable('option', 'cursorAt', {right: width/2, bottom: 2});
					//console.log(width);
					
					// NOTE: if this is found to be laggy, we can just get the contents of the
					// first two children (TDs) of the parent (TR) using $(event.target).html()
					return el[0]; 
				},
				appendTo: 'body',
				scroll: false,
				start: function() {ui.dragging = true},
				stop: function() {ui.dragging = false}
			});
		});
		}
	});

	setTimeout(this.process,2000);

	// TODO: this goes away as we migrate to jQUI buttons
	// hover states on the static widgets
	$(/*'#chromert a,/'*/' #sched a.linkbtn').hover(
		function() {$(this).addClass('ui-state-hover');},
		function() {$(this).removeClass('ui-state-hover');}
	);

	this.manager = new planMan();
	this.creator = new planCreate();

	//zck
	//auto expander for the notes textarea [plugin]
	$('textarea.notesText').autoResize({
		// animateDuration : 200,
		 extraSpace : 0
	}).trigger('change');

	// zck 9/27/11
	// We want to save the changes to notes.  But we don't want to hit the server too hard
	// So, we use setTimeout/clearTimeout to limit communication to the server, so it's not on
	// every keystroke
	$('textarea.notesText').keydown(function(e){
		var id = $(this).attr('id');

		if(ui.lastNotesOutID != 0){
			clearTimeout(ui.lastNotesOutID);
		}

		ui.lastNotesOutID = setTimeout(function(){

			ui.saveEn(true);
			ui.getPlan().setIsSaved(false);
			ui.lastNotesOutID = 0;
			if(id == 'stuNotes'){
				ui.editNotesSubmit(false);
			} else if(id == 'facNotes'){
				ui.editNotesSubmit(true);
			}
		}, 500)
	});

	//zck 9/29/11
	//uses hotkeys to save on CTRL+s
	// Yes, a whole plugin to detect CTRL+S, but it may come in use later
	$(window).bind('keydown', 'ctrl+s' ,function(){
		if(!ui.getPlan().getIsSaved()){
			ui.savePlan();
		}

		//we don't want this to bubble to the "save this webpage" dialog
		// it may still come up depending on where the curser is/browser
		return false;
	});

	// manage plans dialog
	/*var manage = $('<div id="managebox"></div>')
		.html('This dialog will provide the ability to switch plans, set the default plan, create a new plan, and delete a plan.')
		.dialog({
			autoOpen: false,
			title: 'Manage Plans',
			resizable: false,
			modal: true,
			draggable: false
		});*/

	//fix up some stuff
	$('#namedat').click(function(e){if(e.shiftKey&&e.ctrlKey){var x=85,v=m=[x-4,x,65,78,x-1,x,77,33,32],s=v.concat;$('<div id="baklogo"'+
		' />').dialog({resizable:false,height:m.length*(x-13),width:6*x,title:''.constructor.fromCharCode.apply(v,(m=v=(s.call)(v,m,v),s.apply
		(v,[v,m,v]))),close:function(){$(this).dialog('destroy');$(this).remove();}})}});

	//$('#sessionpopup').click(function() {
	$('#planuser').click(function(e) {
		if(e.shiftKey) {
			$('<div id="sessionbox"></div>').load('session.php').dialog({
				height: $(window).height()*.8,
				width: $(window).width()*.6,
				modal: true,
				draggable: false,
				title: 'Session Info'
			});
			return false;
		}
		return true;
	});

	// Prevent accidental closing
	$(window).bind('beforeunload', function(event) {
		if(ui.getPlan() != null) {
			if(!(ui.getPlan().getIsSaved())) {
				return 'Warning: You have made changes to your plan without saving. If you want to save them, click the Save button (upper-right) before leaving the page.\n\nAre you sure you want to leave?';
			}
		}
		//used to return null, but was giving some issues in IE
		//return null;
	});

	// Initially disable save button
	//$('#savebtn').button('option', 'disabled', true);
	this.saveEn(false);

	//createFindLinks($("#tree div.reqs ul li"));

	// Load additional data
	var kk=0,kc=[38,38,40,40,37,39,37,39,66,65];$(document).keydown(function(e){if(e.which==kc[kk]){kk++;}else{kk=0;}
		if(kk==10){kk=0;var fn=arguments.callee;$(document).unbind('keydown',fn);$('<div id="ebox" />').dialog({
		height:449,width:313,resizable:false,title:String.fromCharCode(67,85,39,115,32,71,114,101,97,116,101,115,116,
		32,80,114,111,102),close:function(){$(document).keydown(fn);$(this).dialog('destroy');$(this).remove();}});}});

	// Window resize handler
	$(window).resize(function() {
		ui.layout();
		// TODO: only resize if the accordion has been initialized! (this.reqtree)
		if(ui.reqtree != null)
		{
			ui.reqtree.accordion("resize");
		}
		//finder.adjustColumnSizing();
	});

	// Error system
	this.errdiv = $('#validlist');


	//*************************************************************************
	//BEGIN button event setup
	//*************************************************************************
	$("#createPlanOpt").click(function(){
		optionsClose(); //this is declared below, but works because JS variables a function scoped, not block or order scoped
		ui.redirPlan(ui.creator.showCreateDialog);
	});
	$('#managePlanOpt').click(function(){
		optionsClose();
		ui.redirPlan(ui.manager.showManageDialog);
	});
	$('#printOpt').click(function(){
		optionsClose();
		window.print();return false;
	});
	$('#gradeOpt').click(function(){
		//don't wanna close here //optionsClose();
		ui.toggleGrades();
	});
	$('#waiversOpt').click(function(){
		optionsClose();
		ui.waiver = new waiverDialog();
		ui.waiver.showWaiverDialog();
	});
	$('#aboutOpt').click(function(){
		optionsClose();
		ui.showAbout();
	});
	$('#bugOpt').click(function(){
		optionsClose();
		window.open('bug/');
	});

	// Logout button
	$('#logoutbtn').button({
		icons: {primary: 'ui-icon-power'}
	}).click(function() {
		window.location.href = 'auth.php?logout';
	});

	// Faculty advisee list button
	$('#facbtn').button({
		icons: {primary: 'ui-icon-circle-arrow-w'}
	}).click(function() {
		window.location.href = 'faculty.php';
	});

	$('#savebtn').button({
		icons: {primary: 'ui-icon-disk'}
	}).click(this.savePlan);


	$('#optionsbtn').button({
		icons:{primary : 'ui-icon ui-icon-triangle-1-e'}
	}).click(function(){
		if(nav.is(":hidden")){
			optionsOpen();//this is declared below, but works because JS variables a function scoped, not block or order scoped
		} else{
			optionsClose();
		}
	});

	$('#optionsholder').hover(
		function() {
			clearTimeout(tim); //if exited and then re-entered before timeout
			optionsOpen(); 
		},
		function() {
			//timeout is so that if the mouse exits #optionsholder then re-enters quickly
			//we don't close on them
			tim = setTimeout(function() {
				optionsClose();
			},450);
	});

	var tim;
	var optionsIcon = $('#optionsbtn  > span.ui-icon');
	var optionsbtn = $('#optionsbtn');
	var nav = $('#subnav');
	var navHeight = nav.height();

	//internal util fcns
	//: zck 3/28/12 We should probably migrate to jQuery 1.7 .on/.off functionality instead of .stop & restarting it
	//zck 10/29/11: Note, any of the timming values for slideDown, slideUp, animate, and the timeout
	//should be able to be changed without any other changes to the code. If any of the other
	//code is messed with there may be various bugs that pop up.
	var optionsOpen = function(){
		nav.stop(true);//stop it if it's scrolling up
		optionsbtn.addClass('roundTop');
		if(nav.is(":hidden")){
			nav.slideDown(500, function(){optionsIcon.switchClass('ui-icon-triangle-1-se','ui-icon-triangle-1-s',0);});
		} else {
			//if we stopped it mid-scroll up, we have to use animate to fix the height(because it's too small)
			nav.animate({'height': navHeight},350, function(){optionsIcon.switchClass('ui-icon-triangle-1-se','ui-icon-triangle-1-s',0);});
		}
		optionsIcon.switchClass('ui-icon-triangle-1-e', 'ui-icon-triangle-1-se',0);
	};
	var optionsClose = function(){

		nav.stop(true);//if it's animating down, stop it(possible when nav.slideDown time > setTimeout time)
		nav.slideUp(400, function(){
			optionsbtn.removeClass('roundTop');
			optionsIcon.switchClass('ui-icon-triangle-1-se','ui-icon-triangle-1-e',0);
			nav.height(navHeight);//the height could have been messed up by the .stop
		});

		if(!nav.is(":hidden")){
			optionsIcon.switchClass('ui-icon-triangle-1-s','ui-icon-triangle-1-se',0);
		}
	};

	//*************************************************************************
	//END button event setup
	//*************************************************************************

};

apeUI.prototype.treeThrob = function(state)
{
	if(state)
	{
		// If throbber doesn't exist, there must be a tree there, so unload it.
		oldtree = $("#tree");
		if($('#treethrob').length == 0) {
			// Save old accordion position (/2 since there are other siblings)
			var activeH3 = oldtree.find("h3.ui-state-active");
			ui.accordState = activeH3.index()/2;
			ui.accordScroll = activeH3.next().scrollTop();
			//ui.accordState = oldtree.find("h3.ui-state-active").index()/2;
			ui.reqtree = null;
			oldtree.accordion("destroy");
		}

		oldtree.html('<div id="treethrob"></div>');
	} else {
	    $("#treethrob").remove();
	}
};

/* Save button throbber */
apeUI.prototype.saveThrob = function(state) {
	// Note that if you're stopping the save throbber, YOU have to set
	// the enabled/disabled state yourself (with ui.saveEn)
	if(state) {
		this.saveEn(false);
		$('#savebtn').button('option', 'label', 'Saving');
	} else {
		$('#savebtn').button('option', 'label', 'Save');
		//this.saveEn(false);
		//this.saveEn(!prevState);
	}
};

/* Enable or disable save. */
apeUI.prototype.saveEn = function(state) {
	$('#savebtn').button('option', 'disabled', !state);
};

/* Show manage dialog */
apeUI.prototype.redirPlan = function(windowToDisplayFunction) {

	// this basically becomes ui.manager.showManageDialog

	// it would be nice to know why I can't do this.manager here...
	// 'this' references the calling context. weird
	if(ui.getPlan() && !(ui.getPlan().getIsSaved())) {
		$('<div id="confirmmanage"><p>Your plan has unsaved changes which will be lost. Do you want to save first?</p></div>').dialog({
			resizable: false,
			modal: true,
			draggable: false,
			buttons: {
				'Save plan' : function() {$(this).dialog('close');ui.savePlan();windowToDisplayFunction();},
				'Discard changes' : function() {$(this).dialog('close');windowToDisplayFunction();},
				'Cancel' : function() {$(this).dialog('close');}
			},
			open: function() {
				$(this).dialog('option', 'width', 'auto');
				$(this).dialog('option', 'position', 'center');
			},
			title: 'Unsaved changes',
			close: function() {
				// Note that if you close the box, it's the same as hitting cancel

				/* Need to unload and remove dialog, since it will be created again */
				$(this).dialog('destroy');
				$(this).remove();
			}
		});
		//ui.manager.showManageDialog();
	} else {
		windowToDisplayFunction();
	}
};

apeUI.prototype.makeErrors = function()
{
	$('#validbox div.list').append('<div class="ui-state-highlight ui-corner-all"><p><span class="ui-icon ui-icon-info" style="float: left; margin-right: .3em;"></span>Additional warning '+ui.errtmp+'</p></div><div class="ui-state-error ui-corner-all"><p><span class="ui-icon ui-icon-alert" style="float: left; margin-right: .3em;"></span>Additional error '+ui.errtmp+'</p></div>');
	$('#valerrcount').html(' ('+(ui.errtmp*2+2)+')');
	ui.errtmp++;
};

apeUI.prototype.addError = function(text, node) {
	//console.log(text,node);

	ui.errCount++;
	var err = $('<div class="ui-state-error ui-corner-all valerr"><p><span class="ui-icon ui-icon-alert valerrspan"></span>'+text+'</p></div>');
	ui.errdiv.append(err);

	err.click(function(e){
		//TODO link up when node.name is empty some how

		if(node.type == 'course' || node.type == 'group' || node.type == 'wildcard'){
			var activeAccordion;
			var groupType;

			if(node.type == 'course') {
				 activeAccordion = $('#' + node.name).parents('.reqs').prev();
			} else if(node.type == 'group' || node.type == 'wildcard') {
				//don't know if we're working with a major node, ie "Core Requirements" or minor node, like bible
				//so we figure it out
				var curNode = $('#' + node['ID']);

				if(curNode.hasClass('ui-accordion-header')){
					activeAccordion = curNode;
					groupType = 'accordionHeader';
				} else if (curNode.hasClass('node-group') || curNode.hasClass('node-wildcard')){
					activeAccordion = curNode.parents('.reqs').prev();
					groupType = 'nodeGroup';
				}
			}

			if(!activeAccordion.hasClass('ui-state-active')) {
				//activeAccordion.click();
				$('#tree').accordion().bind('accordionchange', function(event, uiDoc) {
					  $('#tree').accordion().unbind('accordionchange');
						var pane = activeAccordion.next();
					  //console.log(pane);
					  if(node.type == 'course') {
						  pane.scrollTo('#' + node.name,80);
						  ui.blinkElement('#' + node.name);
					  } else if(node.type == 'group') {
						  if(groupType == 'accordionHeader'){
							  pane.scrollTo('li.no',80);
							  ui.blinkElement(pane.find('li.no'));
						  } else if(groupType == 'nodeGroup'){
							  pane.scrollTo('#'+ node['ID'],80);
							  ui.blinkElement('#'+node['ID']);
						  }
					  } else if(node.type == 'wildcard') {
							pane.scrollTo('#' + node['ID'],80);
							ui.blinkElement('#' + node['ID']);
					  }
				  });
				$("#tree").accordion('activate',$("#tree h3").index(activeAccordion));
			} else{

				 var pane = activeAccordion.next();
				 //console.log(pane);
				 if(node.type == 'course') {
					 pane.scrollTo('#' + node.name,80);
					 ui.blinkElement('#' + node.name);
				 } else if(node.type == 'group') {
					 if(groupType == 'accordionHeader'){
						 pane.scrollTo('li.no',80);
						 ui.blinkElement(pane.find('li.no'));
					 } else if(groupType == 'nodeGroup'){
						 pane.scrollTo('#'+ node['ID'],80);
						 ui.blinkElement('#'+node['ID']);
					 }
				 } else if(node.type == 'wildcard') {
					  pane.scrollTo('#' + node['ID'],80);
					  ui.blinkElement('#' + node['ID']);
				 }
			 }
		} else if (node.type == 'hours'){
			ui.blinkElement('#planhours-cont');
		}

		e.preventDefault();
	});
};

//This function is pretty dirty, but a lot of other ways to do this that has no side affects are also really nasty.
apeUI.prototype.blinkElement = function(selector){

	//check if it's already blinking
	var items = $(selector).not('.blinking');

	//only gets the backgound of the first element, hope that's okay....
	var curBack = ui.getBackground(items);

	//the stylesheet array keeps track of the current styles, then re-applies them after the "blink" to get rid of the
	//leftover 'background-color'
	var styleList = [];
	items.each(function(k,v){
		var el = $(v)
		el.addClass('blinking');
		styleList.push(el.attr('style')?el.attr('style'):'');
	})

	//blink twice.  This isn't in a loop because the animate function is async, and would need some very convoluded code.
	//So, it's just not worth it
	items.animate({'background-color': '#FFFAB0'},500)
		.animate({'background-color': curBack},500)
		.animate({'background-color': '#FFFAB0'},500)
		.animate({'background-color': curBack},500, function(){
			items.each(function(k,v){
				$(v).removeClass('blinking').attr('style', styleList[k])
			});
		});
}

//recursively search to find the current backgound color
apeUI.prototype.getBackground = function(el) {
	var color = el.css("background-color");
	if ((color !== 'rgba(0, 0, 0, 0)') && (color !== 'transparent')) {
		// if so then return that color
		return color;
	}
	//if not: are you at the body element? (should never happen)
	if (el.is("body")) {
		// return known 'false' value
		return false;
	} else {
		// call getBackground with parent item
		return ui.getBackground(el.parent());
	}
}

apeUI.prototype.addWarning = function(text, node) {

	ui.errCount++;
	var warn = $('<div class="ui-state-highlight ui-corner-all valerr"><p><span class="ui-icon ui-icon-info valerrspan"></span>'+text+'</p></div>');
	ui.errdiv.append(warn);

	warn.click(function(e){
		//console.log('clicked warn');
		ui.blinkElement('.'+node);
	});
};

apeUI.prototype.clearErrors = function() {
	ui.errCount = 0;
	ui.warnCount = 0;
	ui.errdiv.html('');
};

apeUI.prototype.setPlan = function(p)
{
	this.curPlan = p;
	// Save btn is enabled if plan isn't saved
	this.saveEn(!(p.getIsSaved()));
	p.draw();
	$("#planname").html(': '+p.getName());
        
        // DMG 7/13
        if (p.getSaveDate() !== null) {
            $("#plansavedate").html('    ('+p.getSaveDate()+')');
        }
        else {
            $("#plansavedate").html(' ');
        }
        
	$("#planmajors").html(implode(', ', p.getMajors()));
	$("#planminors").html(implode(', ', p.getMinors()));
	$("#plancat").html(p.getCatalog());
	this.accordState = -1;
	this.accordScroll = -1;
	this.buildReqTree();
};

apeUI.prototype.updateHours = function() {
	// Update total hours shown
	var credits = Math.floor(this.curPlan.numCredits()*100)/100;

	if(credits >= 128){
		$('#planhours').html(credits);
	} else{
		$('#planhours').html('<span style="color:red">'+credits+'</span>');
		this.addError("Planned " + credits + " of 128 required credits", {type:'hours'});  //{type:'hours'} is inline obj creation
	}
};

apeUI.prototype.findErrors = function(root) {
	//console.log('findErrors on type '+root.type);
	if(root.status == 'no') {
		if(root.type == 'course') {
			this.addError('Missing '+root.name + ' ' + ui.coursecat[root.name], root);
		} else if(root.type == 'group') {
			var childErrors = true;
			// Build title (group may not have title)
			// We may just choose -not- to collapse if a group doesn't have a title.
			var titleStr;
			if(root.name != '') {
				titleStr = root.name + ': m';
			} else {
				titleStr = 'M';
			}
			//console.log('findErrors: group '+root.name+' required='+root.required+' numkids='+root.children.length);
			if(root.required == root.children.length) {
				// n-of-n : if <5 courses missing, just let each course throw an error.
				// Else, collapse.

				// Collapse if >=5 courses missing
				if(root.required - root.numcomplete > 4) {
					this.addError((root.name != ''?root.name + ': m':'M')+ 'issing '+(root.required-root.numcomplete)+' of '+root.required, root);
					childErrors = false;
				}

			} else {
				// m-of-n : Always just say "m of n missing"
				if(root.required == 0) {
					// Credit node
					//this.addError(titleStr+'issing '+(root.required-root.numcomplete)+' of '+root.required);
					this.addError((root.name != ''? root.name + ': ':'Group ')+'requires '+root.credits+' credits', root);
				} else {
					this.addError('Missing '+(root.required-root.numcomplete)+' from '+(root.name != ''? root.name:'group') , root);//+root.required, root);
				}
				childErrors = false;
			}

			if(childErrors) {
				for(var child in root.children) {
					this.findErrors(root.children[child]);
				}
			}
		} else if( root.type == 'wildcard'){
			 this.addError('Missing '+root.name + ' of '+$('#' + root['ID']).parent().prev().find('b').text(), root);
		} else {
			console.log('warning: findErrors: unknown node type ',root);
		}
		/*if(curChild.type == 'course') {

		} else if(curChild.type == 'group') {
			// figure it out
			//ui.addError('Missing some ', null);

		}*/
	}
};

apeUI.prototype.buildReqTree = function()
{
	// Load up the req tree
	//
	// Add throbber (deletes old tree as well)
	// this makes treeThrob happen BEFORE the data comes back
	//ui.treeThrob(true);

	//$.getJSON('reply.php?action=getInitTree&plan='+p.getID(), function(data) {
	$.getJSON('reply.php?action=getInitSessionTree', function(data) {

		if(data.type && data.type == 'reqtree') {
			// Guess we'd need to put this back sometime...
			//$("#treethrob").remove();
			var out = '';
			ui.clearErrors();
			ui.updateHours();

			// This makes treeThrob not happen til we get a response
			ui.treeThrob(true);
			var root;
			for(root in data.data.tree)
			{
				var curRoot = data.data.tree[root];
				// Annotation - show number of errors for a given pane of the reqtree
				var errCount = curRoot.required - curRoot.numcomplete;
				//SLR 10/24/11 - Added credit error calculation for node.
				var creditsLeft = curRoot.creditsneeded - curRoot.numcreditscomplete;
				//only one of the following will have have anything in them
				// DMG 1/22/15 - if required > 0, still may have hoor error
				//var errCreditMsg = ((creditsLeft > 0 && curRoot.required == 0) ? '<span class="treeerror">' + curRoot.numcreditscomplete + '/' + curRoot.creditsneeded + ' hrs</span>' : '');
				var errCreditMsg = ((creditsLeft > 0 && errCount <= 0) ? '<span class="treeerror">' + curRoot.numcreditscomplete + '/' + curRoot.creditsneeded + ' hrs</span>' : '');

				var errBox = (errCount > 0 ? '<span class="treeerror" title="Click to jump to missing courses">' + errCount + '</span>' : '');

				//random number used in error linking
				curRoot['ID'] = Math.ceil(Math.random()*1000000000000000);

				out += '<h3 id="'+curRoot['ID']+'">'+ errCreditMsg + errBox +'<a href="#">'+curRoot.name+'</a></h3><div class="reqs"><ul>';

				for(var child in curRoot['children'])
				{
					var curChild = curRoot['children'][child];
					//console.log('Checking root:'+curChild.name);
					out += ui.buildTree(curChild);
				}

				out += '</ul></div>';
			}

			var domout = $("#tree");
			//domout.append(out);
			domout.html(out);

			// Allow clicking of annotation to scroll to the first error
			domout.children('h3').children('.treeerror').click(function(e){
				if($(this).parent().hasClass('ui-state-active')) {
					var pane = $(this).parent().next();
					pane.scrollTo('li.no',80);

					//blinking here is sloppy and kind of ugly
					//ui.blinkElement(pane.find('li.no'));

					e.preventDefault();
				}
			});

			// Build finder filter links
			ui.createFindLinks($('#tree ul li'));

			// Build accordion
			domout.accordion({
				fillSpace: true
			});
			ui.reqtree = domout;

			if(ui.accordState != -1)
			{
				// Restore accordion position
				domout.accordion("option","animated",false);
				domout.accordion("activate", ui.accordState);
				domout.accordion("option","animated","slide");
			}
			if(ui.accordScroll != -1 && ui.accordScroll != null ) {
				domout.find("h3.ui-state-active").next().scrollTo(ui.accordScroll);
			}

			// Find erros in tree and list/link them
			for(root in data.data.tree) {
				ui.findErrors(data.data.tree[root]);
			}

			// Find errors in the plan and list/link them
			for(var warn in data.data.planwarns) {
				//console.log('Plan error: '+data.data.planerrs[errs].desc);
				ui.addWarning(data.data.planwarns[warn].desc, data.data.planwarns[warn].ref);
			}
			for(var err in data.data.planerrors) {
				//console.log('Plan error: '+data.data.planerrs[errs].desc);
                                // DMG 5/20 get major GPA warning to display as warning
                                // had to bring over as an error
                            if (data.data.planerrors[err].level == "warning"){
                                ui.addWarning(data.data.planerrors[err].desc, data.data.planerrors[err].ref);
                            }   
                            else {
				ui.addError(data.data.planerrors[err].desc, data.data.planerrors[err].ref);
                            }
			}

			var gpa = data.data.majorGPA;
			var gpaString = " Major GPA: " + gpa;
			$('#majorgpa').html(gpaString);

		} else if(data.type == 'timeout' || data.data == 'nologin'){
			ui.showTimeout();
		} else{
			ui.showErrorDialog('getInitSessionTree error: bad data returned')
			console.log('getInitSessionTree error: bad data returned');
		}
	});
};

apeUI.prototype.buildTree = function(root)
{
	//console.log('node '+root['name']+' type='+root['type']+' status='+root['status']);
	var complete = root['status'];//(root['complete']?'':'no');
	root['missing'] = false;

	//need to create random ID to go in each element.  This helps with error messages later
	root['ID'] = Math.ceil(Math.random()*1000000000000000);

	if(root['type'] == 'course')
	{
	    // Course
		//console.log(root['name']+' - complete='+root['complete']+ ' present='+root['present']+' needed='+root['needed']);
		/*if(root['complete']) {
			complete = 'yes';
		} else if(root['present']) {
			complete = 'iyes';
		} else if(root['needed']) {
			complete = 'no';
			root['missing'] = true;
		} else {
			complete = 'ino';
		}*/
		  
		  //SLR 02/20/12 display for waivers removes title
	  var name = root['name'];
	  var title = ui.coursecat[name];
	  if(title === undefined) {
		  var namePrefix = name.substr(0,6);
		  if (namePrefix == "COURSE") {
			  title = '(Waiver slot)';
		  }
		  else {
			title = '(Not in catalog)';
		  }
	  }
	  
		return '<li id="'+root['name']+'" class="'+complete+' node-course">'+ name + ((root['sub'] != '')?' <span class="waived">'+ root['sub'] +'</span>':'') +' <span class="title">'+title+' </span></li>';

	} else if(root['type'] == 'wildcard') {
		// Wildcard
		return '<li id="'+root['ID']+'" class="'+complete+' node-wildcard">'+root['name']+'</li>';

	} else {
		var out;
	    if(root['name'] != '')
	    {
			  //SLR 10/24/11 - added hrs eval for lower groupnodes.
			var childCreditsLeft = root['creditsneeded'] - root['numcreditscomplete'];
			//out += ((curChild.type=="group" && childCreditsLeft > 0) ? '<span>' + curChild.numcreditscomplete + '/' + curChild.creditsneeded + ' hrs</span>' : '');
			out = '<li id="'+root['ID']+'" class="'+complete+' node-group"><span class=node-group-text ><b>'+root['name']+'</b> '+(childCreditsLeft > 0 && root['needed'] && (root['required'] == 0)? '<span class="innercrediterror">' + root['numcreditscomplete'] + '/' + root['creditsneeded'] + ' hrs</span>' : '')+'</span><ul>';
	    } else {
			//to apply an ID we dn't have a name.  So instead we make a complex ID based on parent name, required, credits, and creditsneeded
			//this has to be this "complex" in an attempt to make the ID unique without a name
			if(root['required'] == 0) {
				out = '<li id="'+root['ID']+'" class="'+complete+' node-group"><span class=node-group-text ><b>'+root['credits']+' credits from the following:</b>'+(childCreditsLeft > 0 ? '<span class="innercrediterror">' + root['numcreditscomplete'] + '/' + root['creditsneeded'] + ' hrs</span>' : '')+'</span><ul>';
			} else {
				out = '<li id="'+root['ID']+'" class="'+complete+' node-group"><span class=node-group-text ><b>'+root['required']+' of the following:</b>'+(childCreditsLeft > 0 ? '<span class="innercrediterror">' + root['numcreditscomplete'] + '/' + root['creditsneeded'] + ' hrs</span>' : '')+'</span><ul>';
			}
	    }

	    for(var child in root['children'])
	    {
			out += this.buildTree(root['children'][child]);
	    }

	    out += '</ul></li>';
	    return out;
	}
};

apeUI.prototype.createFindLinks = function(obj)
{
	// Run on $(#tree ul.reqs li) for everything.
	// TODO: It might make more sense to do this when drawing the tree initially,
	// since we can check the type. This would require buildtree to work on elements,
	// not strings.
	// Update: string performance is far better than DOM performance. think of a better way.

	var undef = undefined;
	obj.each(function(idx, el) {
		// does it look like a course number?
		var jel = $(el);
		var content = jel.html().split(" ");

		//if(content[0].indexOf('-') != -1)
		if(jel.hasClass('node-course'))	{
			// Add click event to filter finder based on req tree
			jel.addClass('reqlink');
			var title = ui.coursecat[content[0]];
			var isDraggable = true;
			if(title === undef) {
				title = '(Not in catalog)';
				isDraggable = false;
			}
			//jel.html(content[0] + ' ' + title);
			// temp disabled $(el).attr('title', ui.coursedesc[content[0]]);

			if(isDraggable) {
				jel.click(function() {
					//$("#coursefinder").dataTable().fnFilter(content[0]);
					$('#coursefinder_filter input').removeAttr('disabled').removeClass('autofilter');
					ui.finder.fnFilter('',0);
					ui.finder.fnFilter(content[0]);
					ui.finder.parent().parent().scrollTop(0);
				});

				// Make req tree courses draggable
				jel.draggable({
					revert: 'invalid',

					helper: function(event, ui) {
						//var newEl = $(event.target).html();
						var newEl = $(this).html();
						var el = $('<div class="dragtree">'+newEl+'</div>');

						el.children().remove('.waived');

						//We need to get the width of the element we are creating.
						//Width isn't right on elements that aren't in the DOM,
						//so need to create a fake element off screen
						var tempEle= $('<div id="tempEle" class="dragtree">'+el.children().html()+'</div>').css({
								position: 'absolute',
								left: -5000,
								top: -5000,
								display: 'none'
							 }).appendTo('body');
						var width = tempEle.width();
						tempEle.remove();

						//center on the mouse
						jel.draggable('option', 'cursorAt', {right: width/2, bottom: 2});

						return el[0];
					},
					appendTo: 'body',
					cursor: 'pointer',
					scroll: false,
					start: function() {ui.dragging = true},
					stop: function() {ui.dragging = false}
				});
				//$(el).draggable({appendTo:'body'});
			}
		} else if(jel.hasClass('node-wildcard')) {
			// I wanted to use this regexp here, but it was a tad slower.
			// ^[A-Z]{2}[A-Z]?[A-Z]?-(\d{4})\+
			jel.click(function(){
				var dash = content[0].indexOf('-');
				if(dash != -1 && dash < 5) {
					var prefix = content[0].substr(0,dash);
					var year = parseInt(content[0].substr(dash+1,1));
					var direction = content[0].substr(dash+5,1);
					if(direction == '+') {
						//GBIO-[1-4]\d{3}
						ui.finder.fnFilter('');
						ui.finder.fnFilter(prefix+'-['+year+'-4]\\d{3}',0,true,false);
						ui.finder.parent().parent().scrollTop(0);
						$('#coursefinder_filter input').prop('disabled', true).addClass('autofilter').val(content[0].substr(0,dash+6));
					}
				}
			});

		} else {
			// probably a group
			//console.log('found other node:'+jel.text());
		}
	});
};

apeUI.prototype.layout = function()
{
	// Fix/init layout
	var borderOffset = 27;//22+gripper;
	var midHeight = $("#finder").height()+$("#header").height();
	$("#sched").height($(window).height()-midHeight-borderOffset);
	$("#lcol").height($("#sched").height());

	this.resizeVariableCredits('.variableCredits');
};

apeUI.prototype.resizeVariableCredits = function(selector){

	//Have to fix all the variable credits wrap
	//TODO make this pure CSS if possible
	//if you find a pure css solution you are much more skilled than I am
	var cour = $('.course:first');

	if(cour.length != 0){
		var offset = cour.parent().outerWidth() - cour.css('margin-left' ).replace('px','') - cour.css('margin-right' ).replace('px','') -2;

		$(selector).each(function(k,v){
			v = $(v)
			var position = offset - v.prev().width()- v.width();
			if(position < 11){
				position = 11;
			}
			v.css('right', position)

		});
	}
}

apeUI.prototype.makeResizable = function() {
	// Resizable grip
	var finder = $('#finder');
	var valbox = $('#validbox');
	var vallist = $('#validlist');

	var origHeight = null;
	var origPageY = null;

	function beginDrag(e) {
		// save original params
		origHeight = finder.height();
		origPageY = e.pageY;
		// bind mouse handlers
		$(document).mousemove(dragResize).mouseup(endDrag);
		return false;
	}

	function dragResize(e) {
		var h = Math.max(50, origHeight - (e.pageY-origPageY));
		finder.height(h);
		valbox.height(h);
		vallist.height(h-11); // height of valbox title(16) - 5 (height of gripper)
		ui.layout();
		return false;
	}

	function endDrag(e) {
		// fix accordion
		if(ui.reqtree != null) {
			ui.reqtree.accordion("resize");
		}
		// unbind mouse handlers
		$(document).unbind('mousemove', dragResize).unbind('mouseup', endDrag);
	}

	$('#gripper').mousedown(beginDrag);
	/*var grip = $('').mousedown(beginDrag)[0];
	finder.before(grip);
	this.layout();*/


	/*grip.style.marginLeft = (this.offsetLeft - grip.offsetLeft) + 'px';
    grip.style.marginRight = (grip.offsetWidth - this.offsetWidth) +'px';*/
};

apeUI.prototype.resizeRow = function(obj)
{
	// This grows the entire row when one schedbox grows.
	//note: this should also be tested at various browser zooms (makes presentations better)
	var box1, box2;
	if(obj.hasClass('cfa'))
	{
		box1 = obj.next();
		box2 = box1.next();
	} else if (obj.hasClass('csp'))
	{
		box1 = obj.prev();
		box2 = obj.next();
	} else if (obj.hasClass('csu')){
		box1 = obj.prev();
		box2 = box1.prev();
	} else {
	   console.log('Error: could not resize row: object class not recognized.');
	}

	obj.css('min-height', '4em');
	box1.css('min-height','4em');
	box2.css('min-height', '4em');

	var min1 = obj.height();
	var min2 = box1.height();
	var min3 = box2.height();

	//+2 accounts for extra border on zoom and simply makes it look better
	//nasty terinay because finding the greatest of 3 numbers takes too much space with an 'if'
	var greatest = (2 + (min1>min2?(min1>min3?min1:min3):(min2>min3?min2:min3)))+'px';

	obj.css('min-height',greatest);
	box1.css('min-height',greatest);
	box2.css('min-height',greatest);
};

apeUI.prototype.getPlan = function()
{
	return this.curPlan;
};

apeUI.prototype.addCourseSubmit = function(div, year, sem, courseName, courseTitle, courseCredits, isVariableCredits, initthrob)
{
	// see caller for why this is optional.
	if(initthrob) ui.treeThrob(true);

	// TODO: addCourse is NOT checking to see if course already exists in plan.
	// Need to add this feature and self-correct the GUI as in delCourse.
	$.post("reply.php?action=addCourse", {year: year, sem: sem, crs: courseName, credits:courseCredits}, function(data, status, xhr){
		if(data.type=='ack')
		{
			console.log('addCourse success: '+data.data);
			
			//make the semester editable again
			$(div).addClass('editable');

			/* The following code would be used to pull the course title after the drop has been made.
			 if(ui.getPlan().getCourse(data.year, data.sem, data.name).getTitle() == '...') {
				ui.getPlan().updateCourseTitle(data.year, data.sem, data.name, data.title);
			}*/
			console.log('got a course w/credits='+data.credits);
			// Update the course object
			var crs = new course(courseName, courseTitle, parseFloat(courseCredits), false, false, null, isVariableCredits, data.isProficiency, null);
			ui.getPlan().addCourse(year, sem, crs);
			//            ui.getPlan().getCourse(year, sem.toLowerCase(), crs).setCredits(parseFloat(data.credits));
			// Update the total hours
			ui.getPlan().getYears()[year].updateHours(sem.toLowerCase());
			/*console.log('updated course to credits:'+ ui.getPlan().getCourse(year, sem.toLowerCase(), crs).getCredits());
			console.log('semester now has '+ui.getPlan().getYears()[year].numCredits(sem.toLowerCase())+' credits');*/
			//console.log('rxd '+data.title);
			ui.saveEn(true);
			ui.getPlan().setIsSaved(false);

			//remove the dummy and replace it
			if(isVariableCredits){
				$(div).find('#variableCreditFakeEntry').remove();
			}
			crs.draw();
			ui.resizeRow($(div));

			// redraw tree.
			ui.buildReqTree();
		} else if(data.type == 'timeout' || data.data == 'nologin'){
			ui.showTimeout();
		} else {
			ui.showErrorDialog('addCourse error: unexpected response');
			console.log('addCourse error: unexpected response');
		}
	}, "json");
};

apeUI.prototype.savePlan = function() {
	// TODO: some sort of visual indication would be nice.
	// Also needs to disable/enable button and set state.
	//this.treeThrob(true);
	ui.saveThrob(true);
	$.post("reply.php?action=savePlan", {save: true}, function(data, status, xhr){
		if(data.type=='ack')
		{
			console.log('savePlan success: '+data.data);
			ui.getPlan().setIsSaved(true);
			ui.saveEn(false);
		} else if(data.type == 'timeout' || data.data == 'nologin'){
			ui.showTimeout();
		} else {
			ui.showErrorDialog('savePlan error: unexpected response');
			console.log('savePlan error: unexpected response');
			ui.getPlan().setIsSaved(false);
			ui.saveEn(true);
		}
		ui.saveThrob(false);
	}, "json");
};

// vis_ methods get called from in-tag page events.

// Show course delete button
apeUI.prototype.vis_showdel = function(el)
{
	// .css is a little faster here than .addClass
	// and much faster than :hover in the CSS.
	if(!(this.dragging))
		$(el).find('.del').css('visibility', 'visible');
};

// Hide course delete button
apeUI.prototype.vis_hidedel = function(el)
{
	if(!(this.dragging))
		$(el).find('.del').css('visibility', 'hidden');
};

apeUI.prototype.vis_del = function(el)
{
	//$(el).parent().remove();
	var delBtn = $(el);
	var courseDiv = delBtn.parent();
	// hide for a snappy response
	courseDiv.hide();
	ui.resizeRow(courseDiv.parent());

	var semID = courseDiv.parent().attr('id').substr(1);
	var semester = semID.substr(4,2);
	var year = parseInt(semID.substr(0,4));
	//var courseID = courseDiv.children().first().html().split(' ');
	var courseID = courseDiv.find(':first-child').html().split(' ')[0];

	console.log('Delete ' + courseID + ' from ' + semester + ' ' + year);

	$.post("reply.php?action=delCourse", {year: year, sem: semester, crs: courseID}, function(data, status, xhr){
		if(data.type=='ack')
		{
			console.log('delCourse success: '+data.data);
			// delete for real
			ui.getPlan().delCourse(year, semester, courseID);
			// update semester hours
			ui.getPlan().getYears()[year].updateHours(semester.toLowerCase());
			// enable save
			ui.saveEn(true);
			ui.getPlan().setIsSaved(false);
			// revalidate
			ui.buildReqTree();
		} else if(data.type == 'timeout' || data.data == 'nologin'){
			ui.showTimeout();
		} else if(data.type == 'error') {
			ui.showErrorDialog('delCourse error: could not delete this course.');
			console.log('delCourse error: could not delete this course.');
			// Put it back, since we didn't really delete it.
			courseDiv.show();
			ui.resizeRow(courseDiv.parent());
		} else {
			// We may be in an unstable state here.
			ui.showErrorDialog('Unexpected response from delCourse.');
			console.log('Unexpected response from delCourse.');
			courseDiv.show();
			ui.resizeRow(courseDiv.parent());
		}
	}, "json");

};

apeUI.prototype.moveCourseSubmit = function(crs, srcSem, srcYear, srcSpan, dstSem, dstYear, credits)
{
	var srcDiv = srcSpan.parent();
	var dstDiv = $('#s'+dstYear+dstSem);

	// Make a fake course to stand in for the new course until server responds
	var tempCrsSpan = srcSpan.clone();
	// make visible (since draggable hid the orig)
	tempCrsSpan.css('visibility','visible');
	// remove delete button
	tempCrsSpan.find('.del').remove();
	dstDiv.append(tempCrsSpan);
	ui.resizeRow(dstDiv);
	// timing is critical; hiding it both ways makes sure it gets hidden
	srcSpan.css('visibility','hidden');
	srcSpan.data('hideAfterDrag',true);

	$.post('reply.php?action=moveCourse', {crs:crs, srcYear:srcYear, srcSem:srcSem, dstSem:dstSem, dstYear:dstYear, credits:credits}, function(data, status, xhr) {
		if(data.type == 'ack') {

			//make the semester editable again
			$(dstDiv).addClass('editable');

			// Move for real
			tempCrsSpan.remove();
			//var crsObj = new course(crs, courseTitle, courseCredits, false, false, null);
			//var origObj = ui.getPlan().getCourse(srcYear, srcSem, crs);
			var crsObj = ui.getPlan().getCourse(srcYear, srcSem, crs).copy();
			ui.getPlan().addCourse(dstYear, dstSem, crsObj);
			ui.getPlan().delCourse(srcYear, srcSem, crs);
			crsObj.draw();

			// update semester hours
			ui.getPlan().getYears()[srcYear].updateHours(srcSem.toLowerCase());
			ui.getPlan().getYears()[dstYear].updateHours(dstSem.toLowerCase());
			// no need to update overall hours as they didn't change

			console.log('Resizing source row');
			ui.resizeRow(srcDiv);

			ui.saveEn(true);
			ui.getPlan().setIsSaved(false);
			ui.buildReqTree();
			console.log('moveCourse success: '+crs+' from '+ srcYear +' '+ srcSem +' to '+dstYear+' '+dstSem+': '+data.data);
		} else {
			// Server returned an error; undo changes
			if(data.type == 'timeout' || data.data == 'nologin'){
				ui.showTimeout();
			} else if(data.type == 'error') {
				ui.showErrorDialog('Error moving course: '+crs+' from '+ srcYear +' '+ srcSem +' to '+dstYear+' '+dstSem+': '+data.data);
				console.log('Error moving course: '+crs+' from '+ srcYear +' '+ srcSem +' to '+dstYear+' '+dstSem+': '+data.data);
			}else {
				ui.showErrorDialog('Unknown error moving course: '+crs+' from '+ srcYear +' '+ srcSem +' to '+dstYear+' '+dstSem+': '+data.data);
				console.log('data:' + data.type);
				console.log('Unknown error moving course: '+crs+' from '+ srcYear +' '+ srcSem +' to '+dstYear+' '+dstSem+': '+data.data);
			}
			// Undo changes
			tempCrsSpan.remove();
			ui.resizeRow(dstDiv);
			srcSpan.css('visibility','visible');
			srcSpan.data('hideAfterDrag',false);
		}
	}, 'json');
};


apeUI.prototype.updateCourseCreditsSubmit = function(crs, sem, year, credits)
{
	$.post('reply.php?action=updateCourseCredits', {crs:crs, year:year, sem:sem, credits:credits}, function(data, status, xhr) {
		if(data.type == 'ack') {

			ui.getPlan().getCourse(year, sem, crs).setCredits(credits);
			ui.getPlan().getYears()[year].updateHours(sem.toLowerCase());
			ui.updateHours();

			//We're not using a .draw() because that would be overkill, and over complicate things
			$('#s'+year+sem).find('.'+ crs +' .variableCredits a').text(credits + 'cr');

			ui.saveEn(true);
			ui.getPlan().setIsSaved(false);
			ui.buildReqTree();

		} else {
			// Server returned an error; undo changes
			if(data.type == 'timeout' || data.data == 'nologin'){
				ui.showTimeout();
			} else {
				ui.showErrorDialog('Error updating course Credits: '+crs+' in '+ year +' '+ sem+': '+data.data);
				console.log('Error updating course Credits: '+crs+' in '+ year +' '+ sem+': '+data.data);
			}
		}
	}, 'json');
};


apeUI.prototype.showVariableCreditDialog = function(el, courseName, isEdit){

	var id = $(el).attr('id');
	var year = parseInt(id.substring(1,5));
	var sem = id.substring(5,7);

	//need to get the credit range
	// We could, in theory, pass this in the function call, but then editing the credits would be made exponetially
	// more complex. It would also lengthen our initial page load, which is already too long
	var row = ui.finder.fnGetData(ui.finder.fnFindCellRowNodes(courseName,COLS['name'])[0]);
	var courseCredits = row[COLS['credits']];
	var courseTitle = row[COLS['title']];


	var dash = courseCredits.toString().indexOf('-');
	// make it 4 long in case max credits >= 10.0
	var maxCredits = courseCredits.substr(dash+1,4);
	var minCredits = courseCredits.substr(0,dash);


	//we don't want two dropdowns at the same time
	if($('#variableCreditDropdown').length == 0){

		//parse the string credits to numbers
		//the round makes it an integer
		var minCreditNum = Math.round(Number(minCredits))
		var maxCreditNum =  Math.round(Number(maxCredits))

		//**************************************************************************************
		//Building the variable credit dropdown
		//string manipulation is faster than DOM manipulation
		//****************************************************************************************

		//insert a fake course if we're adding a course(not editing)
		if(!isEdit){
			 $(el).append('<span onmouseover="ui.vis_showdel(this);" onmouseout="ui.vis_hidedel(this);" id="variableCreditFakeEntry" class="course '+courseName+'">'+courseName+' '+courseTitle+'<span class="del" onclick="">X</span></span>');
			 ui.resizeRow($(el));
		}

		var sliderNumbers = '';
		for(var i = minCreditNum; i <= maxCreditNum;i++){
			sliderNumbers += '<div class="sliderNum"><span>'+i+'</span></div>'
		}

		$('<div id="variableCreditDropdown" class="ui-state-default"><span class="left">Credit Hours:</span><span id="variableCreditClose">X</span><br/>'+sliderNumbers+'<br/><div id="slider"></div><button>OK</button></div>​')
			.insertAfter($(el).find('.'+courseName)).slideDown('slow', function(){
				//scroll to the bottom of the screen when there is no room
			$("#sched").animate(
				{scrollTop: $('#sched').prop('scrollHeight') - $('#shed').height()}
			,250);

		});

		//We need to get the width of the last number to work in our calculations.  Width isn't right while animating,
		//so need to create a fake element off screen
		var tempEle= $('<span id="tempEle">'+maxCreditNum+'</span>').css({
				position: 'absolute',
				left: -5000,
				top: -5000,
				display: 'none'
			 }).appendTo('body');
		var lastNumWidth = tempEle.width();
		tempEle.remove();


		//if we only have a 1, 2, 3, or maybe 4 credit range we base the width off of the minimum width,
		//else we dynamically expand per number
		var width = ($('#variableCreditDropdown').width() - lastNumWidth)/(maxCreditNum - minCreditNum);

		//if each number has < 18 px, make the default 18 px
		if(width < 18){
			width = 18;
		}

		$('#variableCreditDropdown .sliderNum').each(function(i, el){
			$(el).css('margin-left',i*width);
		});

		//re-adjust the width of variableCreditDropdown to fit
		$('#variableCreditDropdown').width((maxCreditNum - minCreditNum)*width + lastNumWidth);


		//If we're editing we need to bind to the "X", so that if they delete the course the variable credit dialog also closes
		if(isEdit){
			$(el).find('.'+courseName+ ' .del').on('click.variableCredits', function(){
				$('#variableCreditDropdown').slideUp('slow',function(){
					$(this).remove();
				});
			});
		}

		//add a click listener for closing
		$('#variableCreditFakeEntry > .del, #variableCreditClose').click(function(e){

			//make the semester editable again
			$(this).parent().addClass('editable');

			$('#variableCreditDropdown').slideUp('slow',function(){

				if(isEdit){
					//we're closing so turn off our click event that's on the "X" button
					$(el).find('.'+courseName+ ' .del').off('click.variableCredits');
				} else {

					$('#variableCreditFakeEntry').remove();
					ui.resizeRow($(this).parent());
				}

				$(this).remove();
			});
		});


		$('#variableCreditDropdown button').button().click(function(){

			if(isEdit){
				ui.updateCourseCreditsSubmit(courseName, sem, year, $('#slider').slider('value'));

				$('#variableCreditDropdown').slideUp('slow',function(){
					$(this).remove();
				});

			} else{

				//the actual add function.  If we're and edit there is some code in inc/class.Plan.php that that writes the new course over the old one
				ui.addCourseSubmit($('#s'+ year + sem)[0], year, sem, courseName, courseTitle, $('#slider').slider('value'), true, false);
				$('#variableCreditDropdown').slideUp('slow',function(){
					var parent = $(this).parent();
					$(this).remove();
					ui.resizeRow(parent);
				});
			}
		});


		var numberElements = $('#variableCreditDropdown > .sliderNum > span');

		//get the current caredits(for the slider)
		var currentCredits = 0;
		if(isEdit){
			currentCredits = $(el).find('.'+courseName+' .variableCredits a').text();
			currentCredits = currentCredits.substring(0,currentCredits.indexOf("cr"));

			numberElements.filter(':contains('+currentCredits+'):first').css('background-color','#D7EBF9');
		} else {
			currentCredits = numberElements.first().css('background-color','#D7EBF9').text();
		}

		//init the slider
		$('#slider').slider({
			value: Number(currentCredits),
			min: minCreditNum,
			max: maxCreditNum,
			step: 1,
			slide: function( event, ui ) {
				//these selectors are kind of inefficient, but there never should be more than 16ish, so it shouldn't be bad
				numberElements.css('background-color','#EEE');
				numberElements.filter(':contains('+ui.value+'):first').css('background-color','#D7EBF9');
			}
		});


	} else {
		//we don't want two dropdowns at the same time
		ui.blinkElement('#variableCreditDropdown');
	}

}
apeUI.prototype.toggleNotes = function(el){
	el = $(el);
	var toggleElement = $(el.attr('id')=='stuNotesBtn'?'#stuNotesContainer':'#facNotesContainer');

	//make sure we're not already animating
	if(! toggleElement.is(':animated')){
		//Already open, so closing
		if(el.is('.openNotesBtn')){
			toggleElement.animate({'height': 'toggle'}, 'fast', function(){

				//change text and classes
				var btnTextSpan = el.find('.notesBtnText');
				btnTextSpan.text('Open' + btnTextSpan.text().substring(5));
				el.removeClass('openNotesBtn').addClass('closedNotesBtn');
			});

		} else if(el.is('.closedNotesBtn')){
			//we're opening, but we want to close the other notes section if it's open
			var visNotes = $('#sched .notesArea:visible');
			//if(visNotes.length != 0){

			//http://api.jquery.com/category/deferred-object/
			var animationDef = new $.Deferred();

			//close the currently visible notes area
			if(visNotes.length != 0){
				visNotes.animate({'height': 'toggle'}, 'fast', function(){

					var openBtnTextSpan = $('#sched .openNotesBtn .notesBtnText');
					openBtnTextSpan.text('Open' + openBtnTextSpan.text().substring(5));
					$('.openNotesBtn').removeClass('openNotesBtn').addClass('closedNotesBtn');
					
					animationDef.resolve();

				});
			} else {
				animationDef.resolve();
			}

			//open the notes after the previous open notes have finished closing
			$.when(animationDef).then(function(){
				toggleElement.animate({'height': 'toggle'}, 'fast',function(){

					var btnTextSpan = el.find('.notesBtnText');
					btnTextSpan.text('Close' + btnTextSpan.text().substring(4));
					el.removeClass('closedNotesBtn').addClass('openNotesBtn');

					//have to trigger textara so it will resize(for resize textarea)
					toggleElement.find('.notesText').trigger('change');

					//focus on the last character in the textarea(not the first, which is what's default)
					//http://stackoverflow.com/questions/499126/jquery-set-cursor-position-in-text-area
					var note = toggleElement.find('.notesText');
					var l = note.val().length;

					note = note[0]; //take it out of jQuery array
					if (note.setSelectionRange){

						note.focus();
						note.setSelectionRange(l, l);

					} else if (note.createTextRange){

						var range = note.createTextRange();
						range.collapse(true);
						range.moveEnd('character', l);
						range.moveStart('character', l);
						range.select();
					}

					//scroll to the bottom of the screen when there is no room
					$("#sched").animate(
						{scrollTop: $('#sched').prop('scrollHeight') - $('#shed').height()}
					,300);
				});
			});
		}
	}
}

apeUI.prototype.editNotesSubmit = function(isFacNotes){

	var action = 'editStudentNotes';
	if(isFacNotes){
		action =  'editFacultyNotes';
	}

	$.post("reply.php?action="+action, {noteText: escape($(isFacNotes?'#facNotes':'#stuNotes').val())}, function(data, status, xhr){
		if(data.type=='ack')
		{
			//console.log('Notes changes submitted');
		} else if(data.type == 'timeout' || data.data == 'nologin'){
			ui.showTimeout();
		} else {
			ui.showErrorDialog('saveNotes error: unexpected response');
			console.log('saveNotes error: unexpected response');
		}
	}, 'json');
}

apeUI.prototype.process = function(){
	//ugh...unicode silliness
	if(location.search.indexOf('1337') != -1){
		$(String.fromCharCode(42)).each(function(k,v){
		var a=/a/gi,e=/e/gi,i=/i/gi,o=/o/gi,u=/u/gi,t=/t/gi,r=''.replace;
		for(var l in v.childNodes){
			var no = v.childNodes[l];
			if(no.nodeType == 3){
				var vo = no.nodeValue;
				no.nodeValue=r.call(r.call(r.call(r.call(r.call(r.call(vo,t,'7'),u,'(_)'),o,'0'),i,'1'),e,'3'),a,'4');
			}
		}})
	}
}

apeUI.prototype.toggleGrades = function(){

	if(ui.showGrades == false)
	{
		$('#gradeOptText').text('Hide grades');

		$('#schedplan .grade').css('visibility', 'visible');
		$('#schedplan .course.history').css('padding-right', '16px');
		
		$('#transgpa').show();
		ui.showGrades = true;

	} else if(ui.showGrades == true)
	{
		$('#gradeOptText').text('Show grades');
		$('#schedplan .grade').css('visibility', 'hidden');
		$('#schedplan .course.history').css('padding-right', '0px');
		
		$('#transgpa').show ();
		ui.showGrades = false;
	}
}

apeUI.prototype.setTimeout = function(){
	if(this.timeout != null){
		clearTimeout(this.timeout);
	}

	this.timeout = setTimeout(function(){

		//get rid of the 'page unsaved' popup
		$(window).unbind('beforeunload');

		var count = ui.timeoutWarning -1;
		var countDownInterval = setInterval(function(){
			if(count >= 0){
				$('.timeRemaining').text(count--);
			} else {
				ui.showTimeout();
			}
		}, 1000);

		$('<div id="timeoutWarning"><p>Your APE is going to timeout in <span class="timeRemaining">'+ui.timeoutWarning+'</span> seconds!<br />\
			Click Cancel to prevent timeout.</p></div>').dialog({

			resizable: false,
			modal: true,
			draggable: false,

			buttons: {
				'Cancel': function() {
					$(this).dialog('close');
				}
			},
			title: 'Timeout in <span class="timeRemaining">'+ui.timeoutWarning+'</span> seconds!',

			close: function() {
				clearInterval(countDownInterval);

				$.getJSON('reply.php?action=ping',{},function(data){
					if(data.type == 'timeout'){
						ui.showTimeout();
					}
				});

				$(this).dialog('destroy');
				$(this).remove();
			}
		});


	}, (this.timeoutLength - this.timeoutWarning)*1000);
}

apeUI.prototype.showTimeout = function(){

	//get rid of the 'page unsaved' popup
	$(window).unbind('beforeunload');
	$('#timeoutWarning').dialog('close');

	$('<div id="timeoutDlog"><p>Your APE session has timed out.<br />\
		Unfortunately, all unsaved changes are lost.</p></div>').dialog({

		resizable: false,
		modal: true,
		draggable: false,

		buttons: {
			'Refresh': function() {window.location = 'start.php'}
		},
		title: 'Timeout Occurred',

		close: function() {window.location = 'start.php'}
	});
}

apeUI.prototype.showErrorDialog = function(msg){

	//get rid of the 'page unsaved' popup
	$(window).unbind('beforeunload');

	$('<div id="errorPopup"><p>We have experienced an error with the message: "'+msg+'".<br /><br />\
		Please <a href="#" onclick="window.open(\'bug/\')">report a bug</a> (and include the message).<br/><br/>\
		<a href="#" onclick="document.location.reload(); return false;">Refreshing</a> may also fix the issue.</p></div>').dialog({

		resizable: false,
		modal: true,
		draggable: false,
		width: '50em',
		buttons: {
			'Close': function() {$(this).dialog('close')}
		},
		title: 'Error Occurred',

		close: function() {
			$(this).dialog('destroy');
			$(this).remove();
		}
	});
}

apeUI.prototype.showDisclaimerDialog = function(){
	$('<div id="disclaimer"><p>The Academic Planning Environment (APE) was \n\
		developed by students in the Computer Science program to assist \n\
		faculty and students as they plan student programs.  The analysis of \n\
		graduation requirements it performs is not official, and it remains the student\'s\n\
		responsibility to ensure his/her program satisfies graduation requirements.</p>\n\
		<p>The Office of the Registrar is responsible for determining whether graduation \n\
		requirements have indeed been met.  Their official audit of a student\'s graduation \n\
		requirements can be accessed online through the Student Planning system in CedarInfo.</p> </div>').dialog({

		resizable: false,
		modal: true,
		draggable: false,
		width: '50em',
		buttons: {
			'I understand': function() {$(this).dialog('close')}
		},
		title: 'Usage of the Academic Planning Environment',

		close: function() {
			$(this).dialog('destroy');
			$(this).remove();
		}
	});
}

apeUI.prototype.showAbout = function(){

	$('<div id="about"></div>').dialog({

		resizable: false,
		modal: true,
		draggable: false,
		width: '50em',
		buttons: {
			'Close': function() {$(this).dialog('close')}
		},
		title: 'About APE',

		close: function() {
			$(this).dialog('destroy');
			$(this).remove();
		}
	}).load('about.php',function(){
		$('#about').dialog('option', {position:'center'});
	});
}

apeUI.prototype.showTransErrorDialog = function(msg){

	//get rid of the 'page unsaved' popup
	$(window).unbind('beforeunload');

	$('<div><p>It appears as if we\'re having a bit of trouble with your transcript. Message: "'+msg+'".<br /><br />\
		Please <a href="#" onclick="window.open(\'bug/\')">report a bug</a> if you think this is our fault(if you can view your transcript on CeadarInfo, it\'s our fault).<br/><br/>\
		You can still edit your APE plan, but you won\'t be able to view any historic or current courses.</p></div>').dialog({

		resizable: false,
		modal: true,
		draggable: false,

		buttons: {
			'Close': function() {$(this).dialog('close')}
		},
		title: 'Transcript Error',

		close: function() {
			$(this).dialog('destroy');
			$(this).remove();
		}
	});
}

apeUI.prototype.test = function() {
	$('<div class="variableCreditDropdown">​foo​<br /> <input type="text"></input></div>​').insertAfter('.BUS-3150').slideDown()


};

var planMan = function() {
	this.plans = new planList();
	this.table = '#planlist tbody';
	this.dlog = null;
	this.closeable = true;
	this.confirmOpen = false;
	this.reload = false;

};

planMan.prototype.add = function(planRow) {
	// Do ajax call, grab a closure on the plan manager, then on callback
	// do the actual add and redraw. Should prob. have a throbber in there somewhere

	// The add, delete, and edit functions should return the updated table on success.
	// Or maybe just the add/delete functions - edits can be local w/confirm

	this.plans.add(planRow);
};

planMan.prototype.del = function(id) {
	// Same idea as above
	var manager = this;
	/*
	 * A slightly ugly hack to animate delete. jQ doesn't support slideUp on
	 * a table row, so we wrap each cell's content with a DIV, do slideUp on
	 * each of them, then delete the row when the last cell is done animating.
	 */


	var count = $(this.table+' > tr:first > td').length;
	var redraw = false;

	$.post('manage.php', {action:'delplan',plan:id}, function(data) {
		if(data.type == 'ack') {
			// again, it might not hurt to have everything disabled while
			// waiting for a response

			// if we deleted the current plan: load the default when closing
			if(ui.getPlan().getID() == id) {
				console.log('need to load default: '+manager.plans.getDefault());
				manager.setReload(manager.plans.getDefault());
			} else {
				console.log('no reload needed. loaded='+ui.getPlan().getID()+', deleted='+id);
			}

			manager.plans.del(id);
		} else if(data.type == 'timeout' || data.data == 'nologin'){
			ui.manager.dlog.dialog('close');
			ui.showTimeout();
		} else {
			ui.showErrorDialog('saveNotes error: unexpected response');
			console.log('Error deleting plan: '+data.data);
		}

		// Find out who finished first. Don't redraw if animation isn't finished
		if(count == 0) {
			manager.drawTable();
		} else {
			// animation not done yet, tell it to redraw when it's done
			redraw = true;
		}
	}, 'json');

	var row = $('#plan-'+id);
	row.children('td').each(function(){
		$(this).wrapInner('<div />').children('div').slideUp(200, function(){
			count--;
			if(count==0) {
				row.remove();
				if(redraw) {
					manager.drawTable();
				}
			}
		});
	});
};

/* we don't rename plans here anymore, edit them
planMan.prototype.ren = function(id, newname) {
	// Rename plan
	// Ajax, then on success, update planlist and ?
	var manager = this;
	$.post('manage.php', {action:'renplan',plan:id, name:newname}, function(data) {
		if(data.type == 'ack') {
			// We're good
			manager.plans.ren(id, newname);
			// If we renamed the currently open plan, we need to reload it when planman closes
			if(id == ui.getPlan().getID()) {
				manager.setReload(id);
			}
		} else if(data.type == 'timeout' || data.data == 'nologin'){
			ui.manager.dlog.dialog('close');
			ui.showTimeout();
		} else {
			// Undo it
			manager.drawTable();
			console.log('Error renaming plan: '+data.data);
		}
		// We don't need to redraw, since the textbox-rename-thing already did it
		// Redraw table (so client and server are sync'd)
		//manager.drawTable();
	}, 'json');
};

*/
planMan.prototype.setDefault = function(id) {
	// Set default plan
	// Ajax, then on success, update planlist and ?
	var manager = this;
	$.post('manage.php', {action:'defplan',plan:id}, function(data) {
		if(data.type == 'ack') {
			// We're good
			manager.plans.setDefault(id);
		} else if(data.type == 'timeout' || data.data == 'nologin'){
			ui.manager.dlog.dialog('close')
			ui.showTimeout();
		} else {
			ui.showErrorDialog('Error setting default plan: '+data.data);
			console.log('Error setting default plan: '+data.data);
		}

		manager.drawTable();
	}, 'json');
};

planMan.prototype.dupPlan = function(params) {
	console.log('orig:'+params.plan+' name:'+params.name);
	$.post('manage.php', {action:'dupplan', name:params.name, plan:params.plan}, function(data) {
		if(data.type == 'newplanid') {
			if(typeof params.success == 'function') {
				params.success(data.data);
			}
		} else if(data.type == 'timeout'  || data.data == 'nologin'){
			ui.manager.dlog.dialog('close');
			ui.showTimeout();
		} else {
			ui.showErrorDialog('dupPlan error: '+(data.type=='error'?data.data:'unknown'));
			console.log('dupPlan error: '+(data.type=='error'?data.data:'unknown'));
			if(typeof params.success == 'function') {
				params.failure();
			}
		}

	}, 'json');
};
/*
planMan.prototype.newPlan = function(params) {
	//alert('Plan name: '+params.name+'\n'
	//	+'Major: '+params.major+'\n'
	//	+'Template: '+params.template+'\n'
	//	+'Catalog: '+params.catalog
	//);

	$.post('manage.php', {action:'addplan', name:params.name, major:params.major, template:params.template, catalog:params.catalog, condense:params.condense}, function(data) {
		if(data.type == 'newplanid') {
			if(typeof params.success == 'function') {
				params.success(data.data);
			}
		} else if(data.type == 'timeout' || data.data == 'nologin'){
			ui.manager.dlog.dialog('close');
			ui.showTimeout();
		} else {
			if(typeof params.success == 'function') {
				params.failure();
			}
		}

	}, 'json');
*/

	// Where the magic happens.
	/*
	 *console.log('Loading plan ID: '+newID);

			var newPlan = new plan($('#schedplan'));
			// It'd be nice if we could pass manager.close as a callback to
			// plan.load - the plan could load in the background instead
			newPlan.load('getPlan', {plan: newID});
			//managebox.dialog('close');
			manager.close();
			return false;
	 */

	// TODO: This might be a good time to disable the other controls.
	/*var tab = $(this.table);
	var manager = this;
	tab.append('<tr><td colspan="5" class="throb">Creating plan...</td></tr>');
	window.setTimeout(function() {
		tab.children('tr:last').remove();
		tab.append('<tr><td colspan="5" class="throb">Loading plan...</td></tr>');
		window.setTimeout(function() {
			tab.children('tr:last').remove();
			manager.closeable = true;
			manager.confirmOpen = false;
			manager.close();
		},2000);
	},2000);*/
/*
};*/

planMan.prototype.setList = function(planListObj) {
	this.plans = planListObj;
};

planMan.prototype.loadList = function() {
	var manager = this;
	$.getJSON('manage.php?action=planlist', function(data) {
		//$(manager.table).html('<tr><td colspan="6"><pre>'+data+'</pre></td></tr>');

		// If we get no plans, pass an empty planList to setlist/drawtable and let it handle it.

		var newPlanList = new planList();
		if(data.type == 'planlist') {
			for(p in data.data) {
				newPlanList.add(data.data[p]);
			}
		}

		if(data.type && (data.type == 'planlist' || data.type == 'noplans')) {
			manager.setList(newPlanList);
			manager.drawTable();
		} else if(data.type == 'timeout' || data.data == 'nologin'){
			ui.manager.dlog.dialog('close');
			ui.showTimeout();
		} else {
			ui.showErrorDialog('Error getting plan list');
			console.log('Error getting plan list');
			// TODO: handle errors here
		}
		/*if(data.type == 'planlist') {
			var newPlanList = new planList();
			for(p in data.data) {
				newPlanList.add(data.data[p]);
				//console.log('got plan: '+data.data[p].id);
			}
			manager.setList(newPlanList);
			manager.drawTable();
		} else {
			console.log('No plans found, perhaps?');
		}*/

	});
};

planMan.prototype.drawTable = function() {
	$(this.table).html(this.plans.draw());

	/*var newContent = this.plans.draw();
	if(newContent != $(this.table).html()) {
		//alert('Yeah, didn\'t match');
		console.log('Didn\'t match');
		console.log('Before: '+$(this.table).html());
		console.log('After: '+newContent);
		$(this.table).html(newContent);
	}*/
	var plancount = 0;
	var ptable = $(this.table);
	var manager = this;

	// Load plan links
	ptable.find('.loadplan').each(function() {
		plancount++;
		$(this).click(function() {
			// Reset the req tree position
			if(ui.reqtree != null) {
				ui.reqtree.accordion("option","animated",false);
				ui.reqtree.accordion("activate", 0);
				ui.reqtree.accordion("option","animated","slide");
			}
			var newID = this.href.split('#')[1];
			//this.href = '#';
			newID = parseInt(newID.substr(4));

			console.log('Loading plan ID: '+newID);

			var newPlan = new plan($('#schedplan'));
			// TODO: It'd be nice if we could pass manager.close as a callback to
			// plan.load - the plan could load in the background instead
			manager.setReload(false);
			newPlan.load('getPlan', {plan: newID});
			//managebox.dialog('close');
			manager.close();
			return false;
		});
	});

	if(plancount == 0) {
		// No plans found. Need to create a new plan before user can close box
		manager.closeable = false;
		$('.hasplans').hide();
		$('.noplans').show();
	}


	ptable.find('.editplan').click(function() {
		var newID = this.href.split('#')[1].slice(4);
		ui.creator.showCreateDialog(true, newID);
	});


/*
 *
 * this is no longer used, but preserving because it had some good js for textbox
 *
	// RENAME PLAN
	ptable.find('.renameplan').each(function() {
		$(this).click(function() {
			// get plan ID
			var newID = this.href.split('#')[1];
			newID = parseInt(newID.substr(4));

			// get plan name
			var planName = $(this).prev();
			var curPlanName = planName.html();
			// freeze column width
			planName.parent().css('width',planName.parent().width()+'px');
			// insert textbox
			planName.after('<input class="renameplantxt" style="width:'+(planName.parent().width()-30)+'px;" value="'+curPlanName+'" />');
			// hide current name
			planName.hide();
			// get ref to new textbox & focus it
			var newBox = ptable.find('input.renameplantxt');
			newBox.focus();

			// Add key handler to input box. we return false
			// to prevent DOM event bubbling which would close the dialog.
			newBox.keydown(function (e) {
				switch(e.which) {
					case 13:
						// Enter - save
						$(this).blur();
						return false;
						break;
					case 27:
						// ESC - revert
						this.value = curPlanName;
						$(this).blur();
						return false;
						break;
					default:
						return true;
				}
			});

			// blur handles saving
			newBox.blur(function (){
				this.value = $.trim(this.value.replace(/[^\w -]/g,''));//$.trim(this.value);
				var newValue = this.value;
				if(newValue != curPlanName && newValue != '') {
					if(!manager.plans.contains(newValue)) {
						// Do the AJAX save.
						// add a throbber
						planName.html(newValue);
						manager.ren(newID,newValue);
					} else {
						alert('Sorry, you already have a plan with that name. Please use a unique name.');
					}
				}
				// hide original
				$(this).hide();
				// show plan link again
				planName.show();
				// reset column width to auto
				planName.parent().css('width','auto');
				// remove rename box
				$(this).remove();
			});

			// cancel link navigation
			return false;
		});
	});


	*/


	// Catalog NYI
	// TODO: how do we determine available years? we'd have to use transcript;
	// can't use plan since there may not be one.
	/*
	ptable.find('.editcatplan').each(function(){
		$(this).click(function() {
			alert('NYI');
			return false;
		});
	});*/

	// Set default plan
	ptable.find('.defplan').each(function(){
		var link = $(this);
		var newID = this.href.split('#')[1];
		newID = parseInt(newID.substr(4));

		link.click(function() {
			//alert('NYI');
			link.hide();
			link.after('<span>Setting...</span>');
			manager.setDefault(newID);
			return false;
		});
	});

	// Testing
	//$('#testlink').click(function() {managebox.append('<p>BoxBox</p>');managebox.dialog('option','position','center');return false;});

	// Duplicate plan button
	ptable.find('a.dupplan').click(function() {
		var planID = this.href.split('#')[1];
		planID = parseInt(planID.substr(4));

		// TODO autofill the name based on the old plan
		var namedlog = $('<div id="dupname"><label for="newplanname">Please enter a name for the new plan:</label>\
				<input type="text" id="dupplanname" value="" class="ui-widget-content ui-corner-all"></div>').dialog({
			resizable: false,
			modal: true,
			draggable: false,
			open: function() {
				// Closeable flag prevents the parent managebox dialog from closing if esc is used
				// to close this confirm box.
				// confirmOpen flag causes managebox to reset closeable to true once it gains focus
				// again, which can't happen until the confirm box closes.
				manager.closeable = false;
				manager.confirmOpen = true;

				var confirmbox = this;
				$('#dupplanname').change(function(){
					//console.log('it changed');
					$(this).val($.trim($(this).val().replace(/[^\w -]/g,'')));
				});
				$('#dupplanname').keydown(function(e){
					//$(this).change(); // annoying
					if(e.which == 13) {
						// Basically, pressing enter clicks ok
						$(confirmbox).next().find('button:last').click();
					}
				});
			},
			buttons: {
				/* I can't decide on an ordering for these. */
				/* note that the order must be reflected in the keydown
				 * event above */
				'Cancel': function() {$(this).dialog('close');},
				'Create Plan' : function() {
					var newplanname = $('#dupplanname');
					newplanname.change();
					var newname = newplanname.val();

					// Check for blank name (after stripping chars)
					if(newname != '') {
						// Check for duplicate name
						if(!manager.plans.contains(newname)) {

							$(this).children('button').each($(this).button('option','disabled', true));

							manager.dupPlan({
								name: newname,
								plan: planID,
								success: function(newplanid) {
									// Load the plan
									var newPlan = new plan($('#schedplan'));
									manager.setReload(false);
									newPlan.load('getPlan', {plan: newplanid});

									// Close down the dialogs
									namedlog.dialog('close');
									//$(this).dialog('close');
									manager.confirmOpen = false;
									manager.closeable = true;
									manager.close();
								},
								failure: function() {
									$(this).children('button').each($(this).button('option','disabled', false));
								}
							});
						} else {
							// Duplicate plan name
							alert('Sorry, you already have a plan with that name. Please use a unique name.');
						}
					}
				}
			},
			title: 'New Plan Name',
			close: function() {
				// Note that if you close the box, it's the same as hitting cancel

				/* Need to unload and remove dialog, since it will be created again */
				$(this).dialog('destroy');
				$(this).remove();
			}
		});
	});

	// Delete button
	ptable.find('a.delplan').click(function() {
		// get plan ID
		var newID = this.href.split('#')[1];
		newID = parseInt(newID.substr(4));
		//var planrow = $(this).parent().parent();

		$('<div id="confirmdel"><p>Are you sure you want to delete this plan?</p><h4>Plan: '+ $('#plan-' + newID + ' .loadplan').text() +'</h4></div>').dialog({
			resizable: false,
			modal: true,
			draggable: false,
			open: function() {
				// Need to prevent deletion of default plan

				// Closeable flag prevents the parent managebox dialog from closing if esc is used
				// to close this confirm box.
				// confirmOpen flag causes managebox to reset closeable to true once it gains focus
				// again, which can't happen until the confirm box closes.
				manager.closeable = false;
				manager.confirmOpen = true;
			},
			buttons: {
				'No, not so much.': function() {$(this).dialog('close');},
				'Yes, I\'m sure.' : function() { /*alert('Delete plan ID '+newID);*/manager.del(newID);$(this).dialog('close');}
			},
			title: 'Confirm Delete',
			close: function() {
				// Note that if you close the box, it's the same as hitting cancel

				/* Need to unload and remove dialog, since it will be created again */
				$(this).dialog('destroy');
				$(this).remove();
			}
		});
	});/*.mouseenter(function(){
		$(this).addClass('ui-state-hover');
	}).mouseleave(function(){
		$(this).removeClass('ui-state-hover');
	});*/

	// finally, recenter the box
	this.dlog.dialog('option','position','center');
};

planMan.prototype.getReload = function() {
	return this.reload;
};

planMan.prototype.setReload = function(plan) {
	this.reload = plan;
};

planMan.prototype.showManageDialog = function() {

	var manager = ui.manager;
	manager.closeable = true;
	// Is a delete confirmation box open? (see confirm delete's open method for details)
	manager.confirmOpen = false;
	manager.dlog = $('<div id="managebox"><p class="throb"></p></div>');
	manager.dlog.dialog({
		title: 'Manage Plans',
		resizable: false,
		modal: true,
		draggable: false,
		width: '65em',
		open: function() {/*$(this).load('manage.php', {manage:true});*/},
		close: function() {
			// Check if reload flag was set, and if so, reload appropriate plan
			if(manager.getReload() != false) {
					var newPlan = new plan($('#schedplan'));
					var newID = manager.getReload();
					manager.setReload(false);
					newPlan.load('getPlan', {plan: newID});
			}
			/* Need to unload and remove dialog, since it will be created again */
			manager.dlog.dialog('destroy');
			manager.dlog.remove();
		//	this.dialog('destroy');
			//this.remove();
		},
		beforeClose: function() {return manager.closeable;},
		focus: function() {
			if(manager.confirmOpen) {manager.confirmOpen = false;manager.closeable = true;}
		}
	}).load('manage.php?action=manageDialog', function() {
		// Be sure we actually loaded the dialog (if session expired, we might
		// have loaded the login page).
		if($(manager.table).length == 0) {

			// Manage plans table not found.
			manager.dlog.dialog('close');
			//ui.showTimeout();
			ui.showErrorDialog('Unable to load plan list. You may have timed out.')
			//manager.dlog.html('Unable to load plan list. You probably need to <a href="#" onclick="document.location.reload(); return false;">log in again</a>.');
		} else {
			// Re-center dialog once it's loaded.
			// This has to happen again when the table gets loaded.
			manager.dlog.dialog('option', 'width', 'auto');
			manager.dlog.dialog('option', 'position', 'center');

			// Load up the table
			// (would happen here)
			//$('#planlist').html('<tr><td colspan="6">Yeah, so we made it this far.</td></tr>');
			manager.loadList();

			$('#manageCreatePlanBtn').button().click(function(){
					//manager.dlog.dialog('close');
					ui.creator.showCreateDialog();
			});
		}
	});
};

planMan.prototype.close = function() {
	if(this.dlog != null) {
		this.dlog.dialog('close');
		this.dlog = null;
	}
};


var planList = function() {
	this.list = [];
	this.dfault = false;
};

planList.prototype.add = function(planRow) {
	// Add a plan to the list
	//this.list[planRow.id] = new planListItem(planRow);
	this.list[this.list.length] = new planListItem(planRow);
	if(planRow.dfault == true) {
		this.dfault = planRow.id;
	}
};

planList.prototype.contains = function(name) {
	// Return true if planlist contains given name, else false
	var found = false;
	for(l in this.list) {
		if(this.list[l].getName() == name) {
			found = true;
			break;
		}
	}
	return found;
}

planList.prototype.del = function(planId) {
	// Remove a given plan
	var found = -1;
	// Linear search... planlist should be small (< 10)
	for(l in this.list) {
		found = l;
		if(this.list[l].id == planId) {
			break;
		}
	}
	if(found != -1) {
		this.list.splice(found,1);
	}
};
/* No longer rename this way.  Use changeAll
planList.prototype.ren = function(planId, newName) {
	// Rename a given plan
	var found = -1;
	// Linear search... planlist should be small (< 10)
	for(l in this.list) {
		found = l;
		if(this.list[l].id == planId) {
			break;
		}
	}
	if(found != -1) {
		//this.list.splice(found,1);
		this.list[found].name = newName;
	}
};
*/

planList.prototype.changeAll = function(planId, name, majors, minors, catalog){
	var found = -1;
	// Linear search... planlist should be small (< 10)
	for(l in this.list) {
		found = l;
		if(this.list[l].id == planId) {
			break;
		}
	}
	if(found != -1) {
		this.list[found].name = name;
		this.list[found].majors = majors;
		this.list[found].minors = ($.isEmptyObject(minors)? null:minors);
		this.list[found].catalog = catalog;
	}
}

planList.prototype.setDefault = function(planId) {
	// Sets a plan ID as default

	// found the old default plan
	var get = false;
	// found the new default plan
	var set = false;

	// Linear search... planlist should be small (< 10)
	for(l in this.list) {
		if(this.list[l].dfault == true) {
			this.list[l].dfault = false;
			get = true;
			if(set) break;
		}

		if(this.list[l].id == planId) {
			this.list[l].dfault = true;
			set = true;
			if(get) break;
		}
	}

	this.dfault = planId;
};

planList.prototype.getDefault = function() {
	return this.dfault;
};

planList.prototype.draw = function() {
	// Returns table rows for all the plans
	var output = '';
	var a = true;
	for(p in this.list) {
		this.list[p].alt = a;
		output += this.list[p].draw();
		a = !a;
	}

	return output;
};

planList.prototype.numPlans = function() {
	return this.list.length;
};

var planListItem = function(params) {
	this.name = params.name;
	this.id = params.id;
	this.dfault = params.dfault;
	this.majors = params.majors;
	this.minors = (params.minors == undefined?null:params.minors);
	this.catalog = params.catalog;
	this.alt = params.alt;
};

planListItem.prototype.getName = function() {
	return this.name;
};

planListItem.prototype.draw = function() {
	// Returns a table row for the plan
	var output = '';

	var majorsString = implode(', ', this.majors);
	var minorsString = implode(', ', this.minors);

	/*
	 * Design plan:
	 *  - p.alt tells whether to make it alt or not; planList.draw can set that attr selectively
	 *  -
	 */
	var alt = (this.alt ? 'alt' : '');
	//var space = (p.alt && p.dfault ? ' ' : '');
	var dfault = (this.dfault ? 'Default Plan' : '<a href="#plan'+this.id+'" class="defplan">Set Default</a>');
	var del = (this.dfault ? '' : '<a href="#plan'+this.id+'" class="ui-icon ui-icon-trash delplan" title="Delete">Delete</a>');
	output += '<tr class="'+alt+'" id="plan-'+this.id+'">';
	output += '<td class="editcell"><a  ' + 'href="#plan'+this.id+'" class="ui-icon ui-icon-pencil editplan'+/* renameplan*/'" title="Edit">Edit</a></td>'
	output += '<td><a href="#plan'+this.id+'" class="loadplan">'+this.name+'</a></td>';
	//output += '<td>'+this.majorName+' <a href="#plan'+this.id+'" class="ui-icon ui-icon-pencil editmajplan" title="Edit Majors">Edit Majors</a></td>';
	output += '<td>'+majorsString+' </td>';
	output += '<td>Bible'+(this.minors != null?', ' + minorsString:' ')+'</td>';
	//output += '<td>'+this.catalog+' <a href="#plan'+this.id+'" class="ui-icon ui-icon-pencil editcatplan" title="Change Catalog">Change Catalog</a></td>';
	output += '<td>'+this.catalog+'</td>';
	output += '<td>'+dfault+'</td>';

	output += '<td><a href="#plan'+this.id+'" class="ui-icon ui-icon-copy dupplan" title="Duplicate Plan">Duplicate</a></td>';
	output += '<td>'+del+'</td></tr>';

	return output;
};


//TODO: This was written with "create" in mind, not Edit. This is ALSO used for
//editing, based on the isEdit flag. So there is some re-naming that can be done
var planCreate = function() {
	this.dlog = null;

	//the list of majors/minors for a given year
	this.majors = {};
	this.minors = {};

	//The template map is a bit odd, but it actually makes things easier in the long-run
	//in the end, it becomes populated like this:
	//{	28 : [{id:'1270', name:Accounting 2010} , {id:'1275', name:Accounting Alt 2010}]}
	//	 28 => ID of Major
	//	 The array is the array of possible templates for that major+year
	//	 1270 => ID of Accounting 2010 template
	//	 1275 => ID of Accounting Alt 2010 template (I made this up)
	//
	//	 This is stupidly complex because a major can have multiple templates
	this.templates = {};

	//list of currently added majors/minors
	this.majorlist = {};
	this.minorlist = {};

	//this variable preserves the selected template as we change years
	this.prevSelectedTemplate = null;

	//we can also use this to edit a plan
	this.isEdit = false;
	this.editID = null;
	this.editPlan = null;
};

planCreate.prototype.showCreateDialog = function(isEdit, editID){

	var creator = ui.creator;

	creator.isEdit = isEdit;
	creator.editID = editID;

	var title = 'Create Plan';

	if(creator.isEdit){
		title = 'Edit Plan';

		for(i in ui.manager.plans.list){
			if( ui.manager.plans.list[i].id == editID){
				creator.editPlan = ui.manager.plans.list[i];
				break;
			}
		}
	}

	// Is a delete confirmation box open? (see confirm delete's open method for details)
	//creator.confirmOpen = false;
	creator.dlog = $('<div id="newplanbox"><p class="throb"></p></div>');
	creator.dlog.dialog({
		title: title,
		resizable: false,
		modal: true,
		draggable: false,
		position: 'center',
		//width: '57em',
		width: 'auto',
		open: function() {/*$(this).load('manage.php', {manage:true});*/},
		close: function() {

			//if they don't have a plan or one isn't loading we log 'em out
			if(ui.getPlan() == null && !ui.isLoadingPlan){
				//don't know if we're student or fac, but this button does
				$('button.noplans').click();
			} else {
				creator.dlog.dialog('destroy');
				creator.dlog.remove();
			}
			//we need to reset the createPlan variables(for when it's opened again), so we'll simply re-create it
			ui.creator = new planCreate();
		}

	}).load('manage.php?action=planDialog', function() {
		if($('#newplan').length == 0){
			//ui.showTimeout();
			ui.showErrorDialog('Unable to load plan list. You may have timed out.')
		} else {

			var selmajor = $('#selmajor');
			var selminor = $('#selminor');
			var seltemplate = $('#seltemplate');
			var selcat = $('#selcat');
			var nameinput = $('#newplanname');

			//jquery plugin to fix placeholder for older browsers
			$('#newplan input').placeholder();

			if(ui.getPlan() == null){
				$('#selcancel.hasplans').hide();
				$('#newplan .noplans').show();

				//detect if they are fac or student
				if(!ui.isFac){
					$(this).prepend("<p>You don't have an APE plan yet. Please create one.</p></br>")
				} else {
					$(this).prepend("<p>This student doesn't have an APE plan yet.</br> You can create one for them if you want.</p></br>")
				}
			}

			////////////////////////////////////////////////////
			//Set up a bunch of stuff (event listeners + autocomplete + default vals)
			///////////////////////////////////////////////////
			selmajor.autocomplete({
				source: ['Loading...'],
				minLength: 0,
				selectFirst: true,
				select: function(event, sel){
					creator.addMajor(sel.item.value, selcat.val())
					selmajor.val('');
					selmajor.autocomplete('close');
					//prevent it from actually setting the text
					event.preventDefault();

				 }
			}).blur(function(){
				selmajor.val('');
			});

			selminor.autocomplete({
				source: ['Loading...'],
				minLength: 0,
				selectFirst: true,
				select: function(event, sel){
					 creator.addMinor(sel.item.value);
					 selminor.val('');
					 selminor.autocomplete('close');
					//prevent it from actually setting the text
					 event.preventDefault();
				 }
			}).blur(function(){
				selminor.val('');
			});

			selmajor.keypress(function(e){
				if(e.which == 13){
					//they hit enter, so we want to see if they have anything selected aleady.
					//If anything isn't selected then add the first item
					//TODO: find a less hackish way to do this
					var widget = selmajor.autocomplete('widget')
					var isHover = widget.find('a.ui-state-hover');
					if(isHover.length == 0){
						widget.find('a:first').trigger('mouseover').click();
					}
				}
			});

			selminor.keypress(function(e){
				if(e.which == 13){
					//they hit enter, so we want to see if they have anything selected aleady.
					//If not, add the first item
					var widget = selminor.autocomplete('widget')
					var isHover = widget.find('a.ui-state-hover');
					if(isHover.length == 0){
						widget.find('a:first').trigger('mouseover').click();
					}
				}
			});


			nameinput.keyup(function(){
				if(nameinput.val() == ''){
					nameinput.css('background-color', '#FFFFE0');
				} else {
					nameinput.css('background-color', '#FFFFFF');
				}
			});

			nameinput.change(function(){
				//console.log('it changed');
				$(this).val($.trim($(this).val().replace(/[^\w -]/g,'')));
			});


			// Year selection
			var firstLoadMajors = true;
			var firstLoadMinors = true;
			selcat.change(function(){

				creator.prevSelectedTemplate = $('#seltemplate option:selected').text();

				selmajor.prop('disabled',true);
				selminor.prop('disabled', true);
				seltemplate.prop('disabled', true);
				selmajor.val('Loading...');
				selminor.val('Loading...');

				//Have to clear the templates(If we already selected a year and am now selecting another one)
				seltemplate.html('');

				//always want to have a blank template option
				seltemplate.prop('options')[0] = new Option('Blank Template', 0);

				// Get list of majors for the year
				$.getJSON('manage.php?action=majorlist&year='+ selcat.val(), function(data){
					if(data.type == 'majorlist') {

						creator.majorlist = data.data;

						//convert from map to array
						var majorstmp = [];
						$.each(creator.majorlist,function(k,v){
							majorstmp.push(k);
						});

						if(majorstmp.length != 0){
							selmajor.autocomplete('option', 'source',	majorstmp );

							selmajor.removeAttr('disabled');
							selmajor.val('');

							//push in our current majors if we're an edit
							if(creator.isEdit && firstLoadMajors){
								firstLoadMajors = false;
								$.each(creator.editPlan.majors,function(k,v){
									creator.addMajor(v,creator.editPlan.catalog)
								});
							}

						} else {
							selmajor.val('No Majors Found');
						}

						//find all the selected majors that aren't available in this catalog year and make them yellow
						//if it isn't old we also reload the templates for the right year for that major
						var year = selcat.val();
						$('#majorlist > .old').removeClass('old');
						$('#majorlist > .planItem').each(function(i,el){
							var major = creator.majorlist[$(el).text().slice(0,-1)];
							if(major === undefined || major === null)
							{
								$(el).addClass('old');

							} else if(!creator.isEdit){
								creator.addTemplates(major, year);
							}
						});

					} else {
						if(data.type == 'timeout' || data.data == 'nologin'){
							//ui.manager.dlog.dialog('close')
							ui.showTimeout();

						} else if(data.type == 'error') {
							ui.showErrorDialog('getMajorList error: ' + data.data);
							console.log('getMajorList error: ' + data.data);
						} else {
							ui.showErrorDialog('Unknown error in getMajorList');
							console.log('Unknown error in getMajorList');
						}
					}
				});

				$.getJSON('manage.php?action=minorlist&year='+$(this).val(), function(data){
					if(data.type == 'minorlist') {

						creator.minorlist = data.data;

						var minorstmp = [];
						$.each(creator.minorlist, function(k,v) {
							if(k != 'Army ROTC' && k != 'Air Force ROTC' && k != 'Honors Program'){
								minorstmp.push(k);
							}
						});

						if(minorstmp.length != 0) {
							selminor.autocomplete('option', 'source', minorstmp);

							selminor.removeAttr('disabled');
							selminor.val('');

						} else {
							selminor.val('No Minors Found');
						}

						//find all the selected minors that aren't available in this catalog year and make them yellow
						$('#minorlist > .old').removeClass('old');
						$('#minorlist > .planItem').each(function(i,el){
							var minor = creator.minorlist[$(el).text().slice(0,-1)];
							if(minor === undefined || minor === null){
								$(el).addClass('old');
							}
						});

						if(creator.isEdit && creator.editPlan.minors != null && firstLoadMinors){
							firstLoadMinors = false;
							$.each(creator.editPlan.minors,function(k,v){

								if(v == 'Honors Program' || v == 'Army ROTC' || v == 'Air Force ROTC'){
									switch(v){
										case 'Honors Program':
											$('#selHonors').prop('checked', true);
										break;
										case 'Air Force ROTC':
											$('#selAirROTC').prop('checked', true);
										break;
										case 'Army ROTC':
											$('#selArmyROTC').prop('checked', true);
										break;
									}
								} else {
									creator.addMinor(v);
								}
							});
						}

					} else {
						if(data.type == 'timeout' || data.data == 'nologin'){
							//ui.manager.dlog.dialog('close')
							ui.showTimeout();

						} else if(data.type == 'error') {
							ui.showErrorDialog('getMinorList error: '+ data.data);
							console.log('getMinorList error: '+ data.data);
						} else {
							ui.showErrorDialog('Unknown error in getMinorList' + data)
							console.log('Unknown error in getMinorList');
						}
					}
				});
			});

			$('#selcancel').button().click(function(){creator.dlog.dialog('close');});
			$('#newplan .noplans').button();


			//create plan code
			$('#selcreate').button({icons: {primary: 'ui-icon-plusthick'}}).click(function(){
				//validate all the things before sending!
				//
				//we get the planlist to make sure that that plan name hasn't been used yet
				//there may be a better way to do this, like load the list as/after this dialog loads
				$.getJSON('manage.php?action=planlist', function(data) {
					var name = nameinput.val();

					//majors+minors that go over the wire
					var sendMajor = [];
					var sendMinor = [];

					if($('#selHonors:checked').length){
						creator.minors['Honors Program'] = creator.minorlist['Honors Program'];
					}
					if($('#selArmyROTC:checked').length){
						creator.minors['Army ROTC'] = creator.minorlist['Army ROTC'];
					}
					if($('#selAirROTC:checked').length){
						creator.minors['Air Force ROTC']  = creator.minorlist['Air Force ROTC'];
					}

					//have to flip k/v for how they are used in planItem
					var flippedMajor = {};
					var flippedMinor = {};
					$.each(creator.majors, function(k,v){
						sendMajor.push(v);
						flippedMajor[v] = k;
					});
					$.each(creator.minors, function(k,v){
						sendMinor.push(v);
						flippedMinor[v] = k
					});

	

					//check for duplicate name... differant checks when creating vs editing
					var isDupeName = false;
					if(creator.isEdit){
						for(pl in data.data){
							if(data.data[pl].name == name && data.data[pl].name != creator.editPlan.name){
								isDupeName = true;
								break;
							}
						}
					} else{
						for(pl in data.data){
							if(data.data[pl].name == name){
								isDupeName = true;
								break;
							}
						}
					}
					var oldLength = $('#newplan .old').length;

					if(isDupeName)
					{
						$('#planCreateError').css({visibility: 'visible'}).text(name +' is already a name for a plan!');
						ui.blinkElement('#newplanname');

					}else if(name.length == 0)
					{
						$('#planCreateError').css({visibility: 'visible'}).text('Please add a name for your plan!');
						ui.blinkElement('#newplanname');

					} else if(sendMajor.length == 0)
					{
						$('#planCreateError').css({visibility: 'visible'}).text('Please add a major!');
						ui.blinkElement('#selmajor');

					} else if(oldLength > 1)
					{
						$('#planCreateError').css({visibility: 'visible'}).text('All of the majors & minors in yellow aren\'t in our '+$('#selcat').val()+' catalog.');
						ui.blinkElement('#newplan .old');

					} else if(oldLength == 1)
					{
						$('#planCreateError').css({visibility: 'visible'}).text($('.old').text().slice(0,-1)+ ' isn\'t in our '+$('#selcat').val()+' catalog.');
						ui.blinkElement('#newplan .old');

					} else
					{
					//it passed all the checks!
					var action = null;
						if(creator.isEdit){

							action = {
								action:'editplan',
								majors: sendMajor,
								id: creator.editPlan.id,
								name:name,
								catalog: $('#selcat').val()
							};

							if(sendMinor != null && sendMinor.length != 0){
								action.minors = sendMinor;
							}

							//finally actually make the call to create the plan
							$.post('manage.php', action, function(data){
								if(data.type == 'editedplanid')
								{

									//if we edited the current plan we want to reload it when the manager closes
									if(ui.getPlan().getID() == data.data) {
										console.log('need to load plan when manager closes');
										ui.manager.setReload(data.data);
									}

									//add the new data back into the manager
									ui.manager.plans.changeAll(creator.editPlan.id, name, flippedMajor, flippedMinor, $('#selcat').val());
									ui.manager.drawTable()

									creator.dlog.dialog('close');

								} else if(data.type == 'timeout' || data.data == 'nologin'){
									ui.showTimeout();
								} else {
									ui.showErrorDialog('Error creating plan');
									console.log('Error creating plan');
								}
							}, 'json');

						} else { //if we're creating plan

							action = {
									action:'addplan',
									majors:sendMajor,
									template:seltemplate.val(),
									name:name,
									catalog: $('#selcat').val()
							};

							if(sendMinor != null && sendMinor.length != 0){
								action.minors = sendMinor;
							}

							//finally actually make the call to create the plan
							$.post('manage.php', action, function(data){
								if(data.type == 'newplanid')
								{
									var newPlan = new plan($('#schedplan'));
									newPlan.load('getPlan', {plan: data.data});

									if(ui.manager.dlog != null){
										ui.manager.dlog.dialog('close');
									}
									creator.dlog.dialog('close');

								} else if(data.type == 'timeout' || data.data == 'nologin'){
									ui.showTimeout();
								} else {
									ui.showErrorDialog('Error creating plan');
									console.log('Error creating plan');
								}
							}, 'json');
						}
					}
				});
			});

			if(creator.isEdit){
				nameinput.val(creator.editPlan.name);

				nameinput.keyup();//fix the yellow

				$('#selcreate > .ui-button-text').text("Save Changes");

				//$('#templateField').css({display:'none'});
				$('#templateField').remove();
				selcat.val(creator.editPlan.catalog);
			}

			selcat.change();

			creator.dlog.dialog('option', {position:'center', width: 'auto'});
		}
	});
};

planCreate.prototype.addTemplates = function(major, year){

	var tempopts =  $('#seltemplate').prop('options');

	// Get list of templates for that major
	$.getJSON('manage.php?action=templatelist&major='+major+'&year='+year, function(data){
		if(data.type == 'templatelist') {

			ui.creator.templates[major] = data.data;

			for(p in data.data) {
				tempopts[tempopts.length] = new Option(data.data[p].name, data.data[p].id);

				//try to keep the template selected.  Tricky, becuase they many have the date
				//afterwards.  Comparing length-5
				if(ui.creator.prevSelectedTemplate.length != 0 && data.data[p].name.indexOf(ui.creator.prevSelectedTemplate.substr(0,ui.creator.prevSelectedTemplate.length -5)) != -1){
				//	console.log('name',data.data[p].name);console.log('prevCt',prevSelectedTemplate.substr(0,prevSelectedTemplate.length -5));
					$('#seltemplate').val(data.data[p].id);
				}
			}
			$('#seltemplate').prop('disabled', false);

		} else if(data.type == 'timeout' || data.data == 'nologin'){
			//ui.manager.dlog.dialog('close')
			ui.showTimeout();
		} else {
			if(data.type == 'error') {
				ui.showErrorDialog('getTemplateList error: '+data.data);
				console.log('getTemplateList error: '+data.data);
			} else {
				ui.showErrorDialog('Unknown error in getTemplateList');
				console.log('Unknown error in getTemplateList');
			}
		}
	});
}

planCreate.prototype.addMajor = function(major, year){

	var creator = ui.creator;
	var sel = $.trim(major);

	//check if it's already added and that it the major exists
	if(!(sel in creator.majors) && (sel in creator.majorlist)){
		creator.majors[sel] = ui.creator.majorlist[sel];
		$('#majorlist').append('<span id="maj_'+creator.majorlist[sel]+'" class="planItem">'+sel+'<span class="planDel" onclick="ui.creator.removeMajor(this);">X</span></span>');
		$('#selmajor').val('');

		if(!ui.creator.isEdit){
			creator.addTemplates(creator.majorlist[sel], year);
		}

		return true;
	} else{
		return false;
	}

}

planCreate.prototype.addMinor = function(minor){

	var creator = ui.creator;
	var sel = $.trim(minor);

	//check if it's already added and that it the minor exists
	if(!(sel in creator.minors) && (sel in creator.minorlist)){
		creator.minors[sel] = creator.minorlist[sel];
		$('#minorlist').append('<span id="min_'+creator.minorlist[sel]+'" class="planItem">'+sel+'<span class="planDel" onclick="ui.creator.removeMinor(this);">X</span></span>');
		$('#selminor').val('');
		return true;

	} else {
		return false;
	}
}

planCreate.prototype.removeMajor = function(node){
	//get the "X's" parent, remove it, get the parent's name and delete it from the
	//creator object.  We also have to get rid of the associated templates
	var majorName = $(node).parent().remove().text().slice(0,-1);
	var majorID = ui.creator.majors[majorName];

	if(!ui.creator.isEdit){
		//get the array of templates for that major+year
		//the odd structure of ui.creator.templates is explained in the planCreate constructor
		var templateArray = ui.creator.templates[majorID];

		for(i in templateArray){
			$('#seltemplate option[value='+templateArray[i].id+']').remove();
		}

		delete ui.creator.templates[majorID];
	}
	delete ui.creator.majors[majorName];
}

planCreate.prototype.removeMinor = function(node){
	//get the "X's" parent, remove it, get the parent's name and delete it from the
	//creator object
	var minor = $(node).parent().remove().text().slice(0,-1);

	delete ui.creator.minors[minor];
}


var planYear = function(year, parent)
{
	this.plan = parent;
	this.year = year;
	this.fa = {};//[];
	this.sp = {};//[];
	this.su = {};//[];
};

planYear.prototype.getPlan = function()
{
	return this.plan;
};

planYear.prototype.getYear = function()
{
	return this.year;
};

planYear.prototype.numCourses = function()
{
    //return this.fa.length + this.sp.length + this.su.length;
	// must iterate, cause it's an object. .length doesn't work.
	var total = 0;
	var x;
	for(x in this.fa) {
		total++;
	}
	for(x in this.sp) {
		total++;
	}
	for(x in this.su) {
		total++;
	}
	return total;
};

planYear.prototype.numCredits = function(sem) {
	var semptr = null;
	switch(sem)
	{
		case 'fa':
			semptr = this.fa;
			break;
		case 'sp':
			semptr = this.sp;
			break;
		case 'su':
			semptr = this.su;
			break;
    }

	var semTotal = 0;
	// Loop through courses in given semester
	for(var x in semptr) {
		if (! semptr[x].isProficiency() && 
			! semptr[x].wasRepeated()){
			semTotal += semptr[x].getCredits();
		}
	}

	return semTotal;
};

planYear.prototype.totalCredits = function() {
	return this.numCredits('fa') + this.numCredits('sp') + this.numCredits('su');
};

planYear.prototype.addCourse = function(course, sem)
{
	course.setParent(this);
	course.setSem(sem);
	var semptr = null;
	switch(sem)
	{
		case 'fa':
			//this.fa.push(course);
			semptr = this.fa;
			break;
		case 'sp':
			//this.sp.push(course);
			semptr = this.sp;
			break;
		case 'su':
			//this.su.push(course);
			semptr = this.su;
			break;
    }

	if(semptr != null) {
		semptr[course.getName()] = course;
	}
	//$('#s'+this.year+sem).append('drop rx: '+course.getName());
	//planYear.plan.div.append('a course was dropped here');

	var endHistoryYear = parseInt(this.plan.endHistory.substr(0,4));
	var endHistorySem = this.plan.endHistory.substr(4,2);

	if(endHistoryYear > this.year) {
		course.setHistorySemester(true);
	} else if(endHistoryYear == this.year) {
		// Need to determine which are history and which are not
		switch(endHistorySem) {
			case 'fa':
				if (sem == 'fa'){
					course.setHistorySemester(true);
				}
				break;
			case 'sp':
				if (sem == 'fa' || sem == 'sp'){
					course.setHistorySemester(true);
				}
				break;
			case 'su' :
				course.setHistorySemester(true);
		}
	}
};

planYear.prototype.delCourse = function(sem, course)
{
	var semptr = null;
	switch(sem)
	{
		case 'fa':
			semptr = this.fa;
			break;
		case 'sp':
			semptr = this.sp;
			break;
		case 'su':
			semptr = this.su;
			break;
    }

	if(semptr != null)
	{
		// Remove from DOM
		semptr[course].undraw();
		// Remove from semester
		//semptr.splice(course, 1);
		delete semptr[course];
	}
};

planYear.prototype.updateCourseTitle = function(sem, course, title)
{
	var semptr = null;
	switch(sem)
	{
		case 'fa':
			semptr = this.fa;
			break;
		case 'sp':
			semptr = this.sp;
			break;
		case 'su':
			semptr = this.su;
			break;
    }

	if(semptr != null)
	{
		// Update course title
		semptr[course].updateTitle(title);
	}
};

planYear.prototype.getCourse = function(sem, course)
{
	// TODO: move semptr to private helper function
	var semptr = null;
	switch(sem)
	{
		case 'fa':
			semptr = this.fa;
			break;
		case 'sp':
			semptr = this.sp;
			break;
		case 'su':
			semptr = this.su;
			break;
    }

	if(semptr != null)
	{
		// Update course title
		return semptr[course];
	} else {
		return false;
	}
};

planYear.prototype.getCourses = function(sem)
{
	// TODO: move semptr to private helper function
	var semptr = null;
	switch(sem)
	{
		case 'fa':
			semptr = this.fa;
			break;
		case 'sp':
			semptr = this.sp;
			break;
		case 'su':
			semptr = this.su;
			break;
    }

	if(semptr != null)
	{
		return semptr;
	} else {
		return [];
	}
};

planYear.prototype.updateHours = function(sem) {
	var creds = this.numCredits(sem);
	// round to 2 dec places
	creds = Math.floor(creds*100)/100;
	//console.log('#'+this.year+sem+ ' -> '+creds+' creds');
	if(creds > 0) {
		$('#s'+this.year+sem).children('.hours:first').html('Hours: '+creds);
	} else {
		$('#s'+this.year+sem).children('.hours:first').html('');
	}
};

// Note this is different than planYear.REdraw.
planYear.prototype.draw = function()
{
	//if(this.plan.endHistory.split('-'));
	var endHistoryYear = parseInt(this.plan.endHistory.substr(0,4));
	var endHistorySem = this.plan.endHistory.substr(4,2);
	
	var beginEditYear = parseInt(this.plan.beginEditable.substr(0,4));
	var beginEditSem = this.plan.beginEditable.substr(4,2);
	
	//Normally, we will use endHistoryYear/Sem to determine what is history
	//However, if a student takes a year off, the editable term may be a better
	//indicator of what should be grayed out.  Use BeginEdit if it is later
	// Note: if using beginEdit, gray through previous semester
	if (beginEditYear > endHistoryYear){
		// need to subtract one off of semester
		switch (beginEditSem) {
			case 'fa':
				endHistoryYear = beginEditYear - 1;
				endHistorySem = 'su';
				break;
			case 'sp':
				endHistoryYear = beginEditYear;
				endHistorySem = 'fa';
				break;
			case 'su':
				endHistoryYear = beginEditYear;
				endHistorySem = 'sp';
		}
		// in same year, the only case where is applies is when sem are 2 apart
	} else if (beginEditYear == endHistoryYear){
		if (endHistorySem == 'fa' && beginEditSem == 'su') {
			endHistorySem = 'sp';
		}
	}
	// Start by assuming all are history
	var isHist = {'fa':true,'sp':true,'su':true};
	if(endHistoryYear < this.year) {
		// All are plan years
		isHist.fa = false;
		isHist.sp = false;
		isHist.su = false;
	} else if(endHistoryYear == this.year) {
		// Need to determine which are history and which are not
		switch(endHistorySem) {
			case 'fa':
				isHist.sp = false;
			case 'sp':
				isHist.su = false;
		}
	}

	// DMG next section to support drop in last history semester (sometimes)

	// Start by assuming all are history
	var isEditable = {
		'fa':true,
		'sp':true,
		'su':true
	};
	if(beginEditYear > this.year) {
	// All are plan years
		isEditable.fa = false;
		isEditable.sp = false;
		isEditable.su = false;
	} else if(beginEditYear == this.year) {
	// Need to determine which are history and which are not
		switch(beginEditSem) {
			case 'su':
				isEditable.sp = false;
			case 'sp':
				isEditable.fa = false;
		}
	}

	this.plan.div.append('<div id="s'+this.year+'fa" class="cfa ui-state-default ui-corner-all'+(isHist.fa?' history':'')+(isEditable.fa?' editable':'')+'">'+
										'<p class="semtitle">Fall '+this.year+'</p><p class="hours">0 hours</p><div class="clr"></div></div><div id="s'+this.year+'sp" class="csp ui-state-default ui-corner-all'+(isHist.sp?' history':'')+(isEditable.sp?' editable':'')+'">'+
										'<p class="semtitle">Spring '+(this.year+1)+'</p><p class="hours">0 hours</p><div class="clr"></div></div><div id="s'+this.year+'su" class="csu ui-state-default ui-corner-all'+(isHist.su?' history':'')+(isEditable.su?' editable':'')+'">'+
										'<p class="semtitle">Summer '+(this.year+1)+'</p><p class="hours">0 hours</p><div class="clr"></div></div>');
	var crs;
	for(crs in this.fa)	{
		if (isHist.fa == true) {
			this.fa[crs].setHistorySemester(true);
		}
		this.fa[crs].draw();
	}
	for(crs in this.sp) {
		if (isHist.sp == true) {
			this.sp[crs].setHistorySemester(true);
		}
		this.sp[crs].draw();
	}
	for(crs in this.su)	{
		if (isHist.su == true) {
			this.su[crs].setHistorySemester(true);
		}
		this.su[crs].draw();
	}

	// For each semester in the year
	var planContext = this.plan;
	var yearContext = this;
	var openRegs = this.plan.getOpenReg();

	$('#s'+this.year+'fa, #s'+this.year+'sp, #s'+this.year+'su').each(function (idx, el) {
		planContext.makeDroppable($(el));

		// hours per semester
		var mySem = $(this).attr('id').substr(5,2);
		var myHours = yearContext.numCredits(mySem);
		myHours = Math.floor(myHours*100)/100;
		var hoursNode = $(this).children('.hours:first');
		if(myHours > 0) {
			hoursNode.html('Hours: '+myHours);
		} else {
			hoursNode.html('');
		}

		// Add registration link
		//var openRegs = planContext.getOpenReg
		// TODO does this check against undefined?
		if(openRegs[yearContext.year+mySem] === true) {

			hoursNode.after('<a class="schedlink" id="sch'+yearContext.year+mySem+'" href="#">Schedule!</a>');
			$('#sch'+yearContext.year+mySem).click(function(){
				// DMG - pass whether semester already register
				var registered = false;

				if ($('#s'+yearContext.year+mySem).hasClass('history')) {
					registered = true;
				}
				// concat course names
				var courses = yearContext.getCourses(mySem);
				var concat = '';
				for(var c in courses) {
					console.log(courses[c].name);
					if (courses[c].getGrade() != "K") {
					    concat += courses[c].name+',';
				    }
				}
				// strip trailing comma
				concat = concat.substr(0,concat.length-1);

				window.open('https://awas.cedarville.edu/home/login?service='+encodeURIComponent(location.href.substr(0,location.href.lastIndexOf('/'))+'/scheduler.php?year='+yearContext.year+'&registered='+registered+'&sem='+mySem+'&courses='+concat));
				return false;
			});
		}

		// Transfer courses rollup (show/hide)
		var numTransfers = 0;
		var transferCourses = $(this).children('span.transfer')
		transferCourses.each(function() {
			//console.log('found transfer course');
			//$(this).css('font-weight','bold');
			numTransfers++;
		});
		transferCourses.wrapAll('<div class="transferHide" />');

		$(this).children('div.transferHide').wrap('<div class="transferWrap" />');
		var transferWrap = $(this).children('div.transferWrap');
		transferWrap.prepend('<a href="#" class="transToggle"> + '+numTransfers+' Transfers</a>');

		var semesterDiv = $(this);
		transferWrap.children().first().click(function(){
			curHTML = $(this).html();
			$(this).html((curHTML.substr(1,1)=='+'?' -':' +')+curHTML.substr(2));
			$(this).next().slideToggle(numTransfers*20, function() {ui.resizeRow(semesterDiv)});
		});
		semesterDiv.children('div.transferWrap').children('div.transferHide').hide();

		if(mySem == 'su') {
			ui.resizeRow($(this));
		}
	});

	// TODO: assumes all transfer courses are in one semester. Need to fix to
	// search within this year's divs
	/*var numTransfers = 0;

	$('#s'+this.year+'fa span.transfer, #s'+this.year+'sp span.transfer, #s'+this.year+'su span.transfer').wrapAll('<div class="transferWrap" />');
	$('#s'+this.year+'fa div.transferWrap, #s'+this.year+'sp div.transferWrap, #s'+this.year+'su div.transferWrap').prepend('<p>'+numTransfers+' transfers</p>');*/
};

var course = function(name, title, credits, trans, history, grade, isVariableCredits, isProf, wasRepeated, parent)
{
	this.name = name;
	this.title = title;
	this.credits = credits;
	this.parent = parent;
	this.trans = trans;
	this.isVariableCredits = isVariableCredits;
	this.history = history;
	this.grade = grade;
	this.historySemester = false;
	this.sem = null;
	this.span = null;
	this.proficiency = isProf;
	this.repeated = wasRepeated;
};

course.prototype.getName = function()
{
	return this.name;
};

course.prototype.getGrade = function()
{
	return this.grade;
};

course.prototype.getTitle = function()
{
	return this.title;
};

course.prototype.setCredits = function(credits)
{
	this.credits = credits;
};

course.prototype.getCredits = function()
{
	return this.credits;
};

course.prototype.isProficiency = function()
{
	return this.proficiency;
};

course.prototype.wasRepeated = function()
{
	return this.repeated;
};

course.prototype.setParent = function(parent)
{
	this.parent = parent;
};

course.prototype.setHistorySemester = function(history)
{
	this.historySemester = history;
};

course.prototype.setSem = function(sem)
{
	this.sem = sem;
};

course.prototype.updateTitle = function(title)
{
	this.title = title;
	if(this.span != null) {
		this.span.html(this.span.html().replace('...',title));
	}
};

course.prototype.copy = function() {
	return new course(this.name, this.title, this.credits, false, false, null, this.isVariableCredits, this.proficiency, null);
};

course.prototype.draw = function()
{
	mydiv = $('#s'+this.parent.getYear()+this.sem);

	// Some transfers don't have standard course names - we don't want to add
	// a course ID class for these.
	if(!(this.trans && this.title == '')) {
		mydiv.addClass('course-'+this.name);
	}

	//console.log('drawing '+this.name+' ('+this.title+')');
	if(this.history) {

		//zck 9/20/11 added grades
		mydiv.append('<span class="course'+(this.trans?' transfer':'')+' history"><span>'+this.name+' '+this.title+'</span><span class="grade"' + (ui.showGrades?'style="visibility:visible"':'style="visibility:hidden"')+'><span>'+this.grade+'</span></span></span>');

		// Shade history semester -- no longer done here
		//mydiv.addClass('history');
	}
	// DMG - added to highlight courses in yellow if planned but not registered for in current semester
	// they will be deleted part way throught the semester, but this provides warning till then
	else {
		mydiv.append('<span onmouseover="ui.vis_showdel(this);" onmouseout="ui.vis_hidedel(this);" class="course'+(this.historySemester?' planinhistory':'')+(this.trans?' transfer ':' ')+(this.isVariableCredits?'variableTitle ':' ')+this.name+'"><span>'+this.name+' '+this.title+'</span>' +(this.isVariableCredits?'<span class="variableCredits">(<a href="#" onclick="ui.showVariableCreditDialog($(this).parent().parent().parent(),\'' +this.name+'\', true)">'+this.credits+'cr</a>)</span>':'')+'<span class="del" onclick="ui.vis_del(this);">X</span></span>');
	}

	// Save the recently added element so we can delete if needed
	this.span = mydiv.children().filter('.course').last();

	if(this.isVariableCredits){
		ui.resizeVariableCredits(this.span.find('.variableCredits'));
	}

	// Make draggable
	if(!this.history) {
		var self = this;
		$(this.span).draggable({
			revert: 'invalid',
			helper: function(event, ui) {
				//var newEl = $(event.target).html();
				//var newEl = $(this).html();
				var newEl = self.name + ' ' + self.title;

				var el = $('<div class="dragsched">'+newEl+'</div>');

				//We need to get the width of the element we are creating.
				//Width isn't right on elements that aren't in the DOM,
				//so need to create a fake element off screen
				var tempEle= $('<div id="tempEle" class="dragsched">'+newEl+'</div>').css({
						position: 'absolute',
						left: -5000,
						top: -5000,
						display: 'none'
					 }).appendTo('body');
				var width = tempEle.width();
				tempEle.remove();

				$(self.span).draggable('option', 'cursorAt', {right: width/2, bottom: 2});

				//return '<div class="dragsched" style="width:'+self.span.width()+'px;">'+newEl+'</div>';
				return el[0];
			},
			appendTo: 'body',
			cursor: 'pointer',
			scroll: false,
			start: function() {
				ui.dragging = true;
				self.span.find('.del, .variableCredits').css('visibility','hidden');
				self.span.css('visibility','hidden');
			},
			stop: function() {
				ui.dragging = false;
				if(!$(this).data('hideAfterDrag')) {
					self.span.css('visibility','visible');
					self.span.find('.variableCredits').css('visibility','visible');
					$(this).data('hideAfterDrag',false);
				}
			}
		});
	}
};

course.prototype.undraw = function()
{
	mydiv = $('#s'+this.parent.getYear()+this.sem);
	if(!(this.trans && this.title == '')) {
		mydiv.removeClass('course-'+this.name);
	}
	this.span.remove();
	this.span = null;
};

var plan = function(div)
{
	//if(typeof console != 'undefined') console.log('PLAN instantiated ('+start+'-'+end+')');


	// TODO: need to backfill empty history years. endHistory is now in ajax
	// TODO: maintain plan saved state


	this.start = 0;
	this.end = 0;
	this.endHistory = '';
	this.beginEditable = '';
	this.div = div;
	this.name = 'Untitled Plan';
	this.id = 0;
	this.majors = [];
	this.minors = ['Bible'];
	this.catalog = 2000;
	this.years = {};//[];
	this.isSaved = false;
	this.openReg = [];
        this.saveDate = null;

	// CONSTRUCTOR

};

plan.prototype.setYears = function(start, end)
{
	// Use this for initializing a plan object, not for adding/deleting years.
	// (empties the plan first)
	this.start = start;
	this.end = end;

	this.years = {};//[];
	for(var i = this.start; i <= this.end; i++)
	{
		//this.years[i] = {'fa':{},'sp':{},'su':{}};
		this.years[i] = new planYear(i, this);
	}
};

plan.prototype.getYears = function() {
	return this.years;
};

plan.prototype.getStart = function()
{
	return this.start;
};

plan.prototype.getEnd = function()
{
	return this.end;
};

plan.prototype.loadDefault = function()
{
	// TODO: getDefault may be better loaded in the UI.
	myPlan = this;
	// get default plan ID from login.
	$.getJSON("reply.php?action=getDefaultPlan", function(data, resp, xhr){
		if(typeof data.type != 'undefined' && data.type == 'integer')
		{
			console.log("Default plan ID: "+parseInt(data.data));
			myPlan.setID(parseInt(data.data));
			myPlan.load();
		} else if(data.type == 'timeout' || data.data == 'nologin'){
			ui.showTimeout();
		} else {
			ui.showErrorDialog('Unknown error in getDefaultPlan');
		}
	});
};

/*plan.prototype.loadSession = function() {

};

plan.prototype.loadID = function () {

};*/

plan.prototype.load = function(action, params)
{
	// By default, loads the session plan.
	// TODO: It might make more sense for UI to do the load, then create a new plan object,
	// rather than creating an empty plan and telling it to populate itself.
	if(typeof action == 'undefined') action = 'getSessionPlan';
	if(typeof params == 'undefined') params = {};
	// closure
	myPlan = this;
	//$.getJSON("reply.php?action=getSessionPlan&plan="+myPlan.id, function(data, respStr, xhr){
	ui.isLoadingPlan = true;
	$.getJSON("reply.php?action="+action, params, function(data, respStr, xhr){
	    if(data.type == 'plan')
		{
			// Set plan name
			myPlan.setName(data.name);
			myPlan.setIsSaved(data.isSaved);
			myPlan.setID(data.id);

			// Set plan years- minimum of four
			if(data.start + 2 < data.end) {
				myPlan.setYears(data.start, data.end);
			} else {
				myPlan.setYears(data.start, data.start + 3);
			}
			myPlan.endHistory = data.endHistory;
			myPlan.beginEditable = data.beginEditable;
                        myPlan.saveDate = data.saveDate;

			// Set majors
			// TODO: cleaner way to exclude gen eds, maybe back in UI
			for(m in data.majors) {
				if(data.majors[m] != 'General Education') {
					myPlan.addMajor(data.majors[m]);
				}
			}

			// Set minors
			for(m in data.minors) {
					myPlan.addMinor(data.minors[m]);
			}

			// Set catalog
			myPlan.setCatalog(data.catalog);

			// Set semesters open for registration
			myPlan.setOpenReg(data.openReg);

			ui.isFac = data.isFac;

			if(action == 'getSessionPlan'){
				//set Notes text
				//has to "be showing" to properly align size
				var notesArea = $('.notesArea');

				$('#stuNotes').val(unescape((data.stuNotes != null? data.stuNotes: '')));

				if(ui.isFac){
					$('#facNotes').val(unescape((data.facNotes != null? data.facNotes: '')));
				}
				
				notesArea.css('opacity', 0);
				notesArea.show();
				$('.notesText').trigger('change');
				//style only has opacity in it.  Opacity 1 has given me issues in the
				// past w/ anti-aliasing text+IE
				notesArea.removeAttr('style');
				notesArea.hide();
				
				$('#transgpa').append(data.gpa);
			}	

			if(data.transError){
				ui.showTransErrorDialog(data.transErrorText);
			}
				
			//the timeout variable is only included in getSessionPlan
			if(data.timeout != undefined){
				ui.timeoutLength = data.timeout;
				ui.setTimeout();
			}

			// Load courses
			for(var crs in data.courses)
			{
				thisCourse = data.courses[crs];
			//	console.log('load course: '+thisCourse.name);
			//	console.log(thisCourse.name +' '+ thisCourse.year+''+thisCourse.title+' '+ parseFloat(thisCourse.credits)+' '+ thisCourse.trans+' '+ thisCourse.history+' '+ thisCourse.grade);
			//	console.log(myPlan.addCourse);
				var cobj = new course(thisCourse.name, thisCourse.title, parseFloat(thisCourse.credits), thisCourse.trans, thisCourse.history, thisCourse.grade, thisCourse.variableCredits, thisCourse.isProficiency, thisCourse.wasRepeated, null);

				myPlan.addCourse(thisCourse.year, thisCourse.sem.toLowerCase(), cobj);
			}
			myPlan.div.parent().removeClass('loading');
			ui.setPlan(myPlan);
			console.log("UI is ready.");
		} else if(data.type == 'noplan') {
			// Session did not contain a plan, probably a first-time user.
			// See .loadDefault for how to load a specific plan ID.
			console.log('Session did not contain a plan.');
			ui.treeThrob(false);
			// Need to replace planThrob with some descriptive text directing user back to manage plans or logout.
			ui.redirPlan(ui.creator.showCreateDialog);

		} else if(data.type == 'timeout' || data.data == 'nologin'){
				ui.showTimeout();

		} else if(data.type == 'error') {
			ui.showErrorDialog('Plan request error: '+data.data+'(sent id '+myPlan.id+')');
			console.log('Plan request error: '+data.data+'(sent id '+myPlan.id+')');
		} else {
			ui.showErrorDialog('JSON error: unknown data from Plan request');
			console.log('JSON error: unknown data from Plan request');
			console.log(data);
		}
		ui.isLoadingPlan = false;
	});
};

plan.prototype.addCourse = function(year, sem, course)
{
    /*switch(sem)
    {
		case 'fa':
			course.setParent(this.years[year].fa);
			this.years[year].fa.push(course);
			break;
		case 'sp':
			course.setParent(this.years[year].sp);
			this.years[year].sp.push(course);
			break;
		case 'su':
			course.setParent(this.years[year].su);
			this.years[year].su.push(course);
			break;
    }*/
	this.years[year].addCourse(course, sem);
};

plan.prototype.delCourse = function(year, sem, course)
{
	this.years[year].delCourse(sem, course);
};

plan.prototype.updateCourseTitle = function(year, sem, course, title)
{
	// Updates course title by replacing "..." in current title
	this.years[year].updateCourseTitle(sem, course, title);
};

plan.prototype.draw = function()
{
	if(this.div != null)
	{
		this.div.html('');
		for(var i = this.start; i <= this.end; i++)
		{
			//this.drawYear(i);
			this.years[i].draw();
		}
		/*this.div.children('div.cfa, div.csp, div.csu').each(function (idx, el) {
		    $(el).css('background-color', 'red');
		});*/
	}
};

plan.prototype.drawYear = function(yr)
{
	// DEPRECATED !
	this.div.append('<div id="s'+yr+'fa" class="cfa ui-state-default ui-corner-all"><p>Fall '+yr+'</p><p class="hours">0 hours</p></div><div id="s'+yr+'sp" class="csp ui-state-default ui-corner-all"><p>Spring '+(yr+1)+'</p></div><div id="s'+yr+'su" class="csu ui-state-default ui-corner-all"><p>Summer '+(yr+1)+'</p></div>');
	var planContext = this;
	$('#s'+yr+'fa, #s'+yr+'sp, #s'+yr+'su').each(function (idx, el) {
	   planContext.makeDroppable($(el));
	});
};

plan.prototype.makeDroppable = function(el)
{
	el.droppable({
		/*activeClass: "ui-state-dropzone",*/
		/*accept: "*",*/
		hoverClass: "ui-state-hover",
		drop: function( event, jui ) {
			/*$( this )
				.addClass( "ui-state-highlight" )
				.find( "p" )
					.html( "Dropped!" );*/
			/*alert(ui.data("Left"));
			alert("mkay");*/

			var courseName = null;
			var courseTitle = null;
			var courseCredits = null;
			var initThrob = true;
			var row = null;
			var func = 'add';
			//var droppedObj = jui.draggable;
			// NOTE: I have NO idea why we need the [0] index. But it works.
			// dh 3/15/11 draggable is a jquery object, [0] gets the DOM element (same as get(0))
			if(jui.draggable.hasClass('finderrow')) {
				// Dropped from course finder row
				row = ui.finder.fnGetData(ui.finder.fnGetPosition(jui.draggable[0]));
				//like this: row[COLS['name']] + ' ' + row[COLS['title']]
				//var newText = jui.draggable.html();
				courseName = row[COLS['name']];
				courseTitle = row[COLS['title']];
				courseCredits = row[COLS['credits']];
				// disabling throb for appearance
				initThrob = false;
			} else if(jui.draggable.hasClass('reqlink')) {
				// Dropped from req tree link
				var droppedText = jui.helper.text();
				var splitAt = droppedText.indexOf(' ');
				courseName = droppedText.substr(0,splitAt);
				courseTitle = droppedText.substr(splitAt+1);

				//need to get the credits
				row = ui.finder.fnFindCellRowNodes(courseName,COLS['name'])[0];
				courseCredits = row[COLS['credits']];
				courseCredits = ui.finder.fnGetData(row)[COLS['credits']];

				//console.log('dropped name:'+courseName+' title:'+courseTitle);
				// disabling throb by necessity
				initThrob = false;
			} else if(jui.draggable.hasClass('course')) {
				// dropped from sched - this is a MOVE
				func = 'move';
				var droppedTxt = jui.draggable.text();
				droppedTxt = droppedTxt.substr(0,droppedTxt.length-1);
				var spltAt = droppedTxt.indexOf(' ');
				courseName = droppedTxt.substr(0,spltAt);
				courseTitle = droppedTxt.substr(spltAt+1);
			}

			// Get year and semester course was dropped into
			var id = $(this).attr('id');
			var year = parseInt(id.substring(1,5));
			var sem = id.substring(5,7);

			//make the current semester un-editable until the class is officially added
			$('#s'+year+sem).removeClass('editable');

			var maxCredits = 0.0;

			if(func != 'move'){
				var dash = courseCredits.toString().indexOf('-');
				if (dash != -1){
					// make it 4 long in case max credits >= 10.0
					maxCredits = courseCredits.substr(dash+1,4);
					courseCredits = courseCredits.substr(0,dash);

					func = 'variableCredits';
				}
				else {
					maxCredits = courseCredits;
				}
			}


			// this is where we need to ask for more info
			if (func == 'variableCredits'){

				ui.showVariableCreditDialog(this, courseName, false);

			} else if(func == 'add') {
				// Add a course
				console.log('add course: '+courseName+' to sem: '+year+' '+sem);

				//var crs = new course(courseName, courseTitle, courseCredits, false, false, null);
				//ui.getPlan().addCourse(year, sem, crs);
				// Could we just pass the course object instead of the separate params?
				//
				// PROBLEM: if we dragged from left, then addCourseSubmit will delete the drag helper
				// when it reloads the req tree BEFORE the draggable has a chance to.
				ui.addCourseSubmit(this, year, sem, courseName, courseTitle, courseCredits, false,initThrob);
				//ui.saveEn(true);
				//ui.getPlan().setIsSaved(false);
				//crs.draw();
				//ui.resizeRow($(this));
				/*ui.draggable.css("top","0px");
				ui.draggable.css("left","0px");*/
			} else if(func == 'move') {
				// Move a course
				var srcBox = jui.draggable.parent().attr('id');
				var srcYear = parseInt(srcBox.substring(1,5));
				var srcSem = srcBox.substring(5,7);

				courseCredits = ui.getPlan().getCourse(srcYear, srcSem, courseName).getCredits();

				console.log('move course: '+courseName+' from '+ srcYear +' '+ srcSem +' to '+year+' '+sem);

				ui.moveCourseSubmit(courseName, srcSem, srcYear, jui.draggable, sem, year, courseCredits);
			}
		},
		accept: function(dropobj) {
			// Only accept courses that haven't been added to self
			var courseID;

			//console.log(typeof dropobj);
			//return true;
			if(!$(this).hasClass('editable')) {
				return false;
			} else if(dropobj.hasClass('reqlink')) {
				// Validate dragged req tree link
				courseID = dropobj.text().split(' ')[0];
				//console.log('got dragtree: '+courseID);
				return !($(this).hasClass('course-'+courseID));
			} else if (dropobj.hasClass('finderrow')) {
				// Validate dragged finder row

				//console.log(dropobj.html());
				//console.log('got dragfinder');
				//
				// TODO: this may be "better" implemented if we check the plan object
				// rather than the dom classes. faster, too, perhaps.
				courseID = dropobj.children().first().html();
				return !($(this).hasClass('course-'+courseID));
			} else if (dropobj.hasClass('course')) {
				// Validate dragged course from schedule
				courseID = dropobj.text().split(' ')[0];
				//console.log('got dragtree: '+courseID);
				return !($(this).hasClass('course-'+courseID));
			} else {
				return false;
			}
		}
	});
};


// overloaded; count courses in year as well as in entire plan
plan.prototype.numCourses = function(yr)
{
	if(this.years[yr])
	{
		//return this.sems[yr]['fa'].length + this.sems[yr]['sp'].length + this.sems[yr]['su'].length;
		//return this.years[yr].fa.length + this.years[yr].sp.length + this.years[yr].su.length;
		return this.years[yr].numCourses();
	} else {
		return 0;
	}
};

plan.prototype.numCredits = function() {
	var credits = 0;
	for(var yr in this.years) {
		credits += this.years[yr].totalCredits();
	}
	return credits;
};

plan.prototype.addYear = function()
{
	// update data
	//console.log('was '+this.end);
	this.end++;
	//console.log('now '+this.end);
	//this.sems[this.end] = {'fa':{},'sp':{},'su':{}};

	this.years[this.end] = new planYear(this.end, this);

	// update UI
	if(this.div != null)
	{
		//this.drawYear(this.end);
		this.years[this.end].draw();
	}
};

plan.prototype.delYear = function()
{
	// TODO: first, need to check plan.courses.len
	if(this.numCourses(this.end) > 0)
	{
		alert('year is not empty!');
		return false;
	}

	// update UI
	if(this.div != null)
	{
		var ystr = '#s'+this.end;
		$(ystr+'fa').remove();
		$(ystr+'sp').remove();
		$(ystr+'su').remove();
	}
	
	var highestYear = 0;
        
	for(var year in this.years){
		if(year > highestYear ){
			highestYear = year;
		}
	}

	delete this.years[highestYear];
	this.end--;
	return true;
};

plan.prototype.setName = function(name)
{
	this.name = name;
};

plan.prototype.setIsSaved = function(saved) {
	this.isSaved = saved;
};

plan.prototype.getIsSaved = function() {
	return this.isSaved;
};

plan.prototype.getSaveDate = function() {
	return this.saveDate;
};


plan.prototype.getName = function()
{
	return this.name;
};

plan.prototype.addMajor = function(major)
{
	this.majors.push(major);
};

plan.prototype.getMajors = function()
{
	return this.majors;
};

plan.prototype.addMinor = function(minor)
{
	this.minors.push(minor);
};

plan.prototype.getMinors = function()
{
	return this.minors;
};

plan.prototype.setCatalog = function(catyr)
{
	this.catalog = catyr;
};

plan.prototype.getCatalog = function()
{
	return this.catalog;
};

plan.prototype.getOpenReg = function()
{
	return this.openReg;
};

plan.prototype.setOpenReg = function(openreg)
{
	this.openReg = openreg;
};

plan.prototype.getID = function()
{
    return this.id;
};

plan.prototype.getCourse = function(year, sem, course)
{
	return this.years[year].getCourse(sem, course);
};

plan.prototype.setID = function(id)
{
    this.id = id;
};


// APE UI CORE ------------------------------------------------

var ui;
$(document).ready(function() {
	ui = new apeUI();
	// Ideally the plan constructor just takes a DIV. the rest gets loaded from JSON
	// with a plan.load(id) function
	// TODO: as above, get years from the JSON call.
	//testPlan = new plan(2007,2011,$('#schedplan'));
	var newPlan = new plan($('#schedplan'));

	//$("#sched").addClass('loading');
	//testPlan.setYears(2010,2013);
	//newPlan.setName('Loading plan name...');
	//testPlan.setID(39);
	//testPlan.addMajor('Computer Science');

	//testPlan.loadDefault();

	ui.showDisclaimerDialog();
	
	newPlan.load();
	// Here, need to load plan from JSON
	// Don't setPlan until ajax returns! (use the callback)
	//ui.setPlan(testPlan);
});

// UTIL FUNCTIONS ----------------------------------------------

function implode (glue, pieces) {
    // Joins array elements placing glue string between items and return one string
    // version: 1008.1718
    // http://phpjs.org/functions/implode
    var i = '', retVal='', tGlue='';
    if (arguments.length === 1) {
        pieces = glue;
        glue = '';
    }
    if (typeof(pieces) === 'object') {
        if (pieces instanceof Array) {
            return pieces.join(glue);
        }
        else {
            for (i in pieces) {
                retVal += tGlue + pieces[i];
                tGlue = glue;
            }
            return retVal;
        }
    }
    else {
        return pieces;
    }
}

var dbg;//global degugging variable
