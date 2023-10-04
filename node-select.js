/*
Hay 3 estados: 
new: cuando no hay aumentacion
remove: cuando se puede update y remove
developing: cuando se esta modificando

*/
chrome.storage.local.get(["updates", "widgets"], function(items){
//	setTimeout(function(){debugger;
		var infoWithUpdatedWidgets = new Array();
		if(items.updates != "undefined" && items.widgets != "undefined"){
				for(var i = 0; i < items.updates.length; i++){
					for(var j = 0; j < items.widgets.length; j++){
						 debugger;
						if(items.widgets[j].href == document.location.href){
							$(document.body).append("<div id='wm_loadingPannel' class='wm_initialButton2' style='display: none'><span class='wm_loadingtext'>Loading</span></div>");
							$("#wm_loadingPannel")[0].style.display="table";
						}
					}
				}
		}
});

let stateAugmentation = "new";
let previousStateAugmentation;
let actualizableWidgets = new Array();
$( document ).ready(function() {
	//document.body.style.border = "5px solid red";

	$(document.body).append("<span id='father' class='wm_node wm_father' title='father'><i class='arrow up'></i></span>");
	$(document.body).append("<span id='son' class='wm_node wm_son' title='son'><i class='arrow down'></i></span>");
	$(document.body).append("<span id='left_bro' class='wm_node wm_left' title='left brother'><i class='arrow left'></i></span>");
	$(document.body).append("<span id='right_bro' class='wm_node wm_right' title='right brother'><i class='arrow right'></i></span>");
	$(document.body).append("<span id='wm_closenode' class='wm_node wm_closeVentana wm_close' title='close'>X</span>");
	//$(document.body).append("<span id='wm_updatenode' class='wm_node wm_closeVentana wm_close' title='update'></span>");
	$(document.body).append("<div id='wm_topcorner' class='wm_topcorner' style='display: none'>+</div>");
	$(document.body).append("<span id='wm_copyButton' class='wm_node2 wm_closeVentanaCopy wm_close' title='copy'>COPY</span>");
	$(document.body).append("<div id='wm_newButton' class='wm_initialButton' style='display: none'><span class='wm_newButtonSpan'>NEW</span></div>");
	$(document.body).append("<div id='wm_updateButton' class='wm_initialButton' style='display: none'><span class='wm_newButtonSpan'>UPDATE</span></div>");
	$(document.body).append("<div id='wm_removeButton' class='wm_initialButton' style='display: none'><span class='wm_newButtonSpan'>REMOVE</span></div>");
	$(document.body).append("<div id='wm_cancelButton' class='wm_initialButton' style='display: none'><span class='wm_newButtonSpan'>CANCEL</span></div>");
	$(document.body).append("<div id='wm_saveButton' class='wm_initialButton' style='display: none'><span class='wm_newButtonSpan'>SAVE</span></div>");
	$(document.body).append("<div id='wm_mineButton' class='wm_initialButton' style='display: none'><span class='wm_newButtonSpan'>MINEIT</span></div>");
	$(document.body).append("<div id='wm_widgetPannel' class='wm_initialButton2' style='display: none'></div>");
//	$(document.body).append("<div id='wm_loadingPannel' class='wm_initialButton2' style='display: none'><span class='wm_loadingtext'>Loading</span></div>");
	$(document.body).append("<div id='wm_copyNameButton' class='wm_initialButton2 wm_noselectable' style='display: none'><div id='wm_centeringInputButtons'><p class='wm_noselectable'> Insert a name:</p><input type='text' id='wm_fname' class='wm_noselectable'><br><button id='wm_acceptbutton' class='wm_noselectable'>Accept</button><button id='wm_cancelbutton' class='wm_noselectable'>Cancel</button></div></div>");
	
/*	$(document.body).append("<span id='fatherm' class='wm_nodem wm_fatherm' title='father'><i class='arrowm upm'></i></span>");
	$(document.body).append("<span id='sonm' class='wm_nodem wm_sonm' title='son'><i class='arrowm downm'></i></span>");
	$(document.body).append("<span id='left_brom' class='wm_nodem wm_leftm' title='left brother'><i class='arrowm leftm'></i></span>");
	$(document.body).append("<span id='right_brom' class='wm_nodem wm_rightm' title='right brother'><i class='arrowm rightm'></i></span>");
	$(document.body).append("<span id='ok_button_move' class='wm_nodem wm_okm' title='OK'>OK!</span>");*/
    
    $("a").attr("wm_disabled", "disabled");
	
	$("a").on("click", function(event){
		if ($(this).attr("wm_disabled")==="disabled") {
    		event.preventDefault();
    	}
	});

	activarMenu();
/*	let listofWidgets;
	chrome.storage.local.get("widgets", function(itemswi){
		listofWidgets = itemswi;
	});*/
	chrome.storage.local.get(["updates", "widgets"], function(items){
//	setTimeout(function(){debugger;
		var infoWithUpdatedWidgets = new Array();
		if(items.updates != "undefined" && items.widgets != "undefined"){
				for(var i = 0; i < items.updates.length; i++){
					for(var j = 0; j < items.widgets.length; j++){
						 debugger;
						if(items.widgets[j].href == document.location.href){
							$("#wm_loadingPannel")[0].style.display="table";
							if(items.widgets[j].numero == items.updates[i]){
								var node = document.evaluate(items.widgets[j].xpath, document.body, null, XPathResult.ANY_TYPE, null).iterateNext();
								try{
									var html = flo.getStyledNode(node);
								}catch(e){
									var html = '<div class="wm_alert"><strong>Warning!</strong> Element not found</div>';
								}
								infoWithUpdatedWidgets.push({html:html, pos:items.updates[i]});
								items.updates.splice(i,1);
								chrome.storage.local.set({"widgetsUpdated":infoWithUpdatedWidgets, "updates":items.updates},function (){
									self.close();
								});
							}
						}
						}
					}
				} 
//		}, 3000);
	});
	chrome.storage.local.get("augmentation", function(items){debugger;
		if(Object.keys(items).length!=0){
			for(var i=0; i<items.augmentation.todas.length; i++){
				if(window.location.href == items.augmentation.todas[i].url){
					stateAugmentation="remove";
					moveRemoveActionsNodes=items.augmentation.todas[i].actions;
					for(var j=0; j<items.augmentation.todas[i].actions.length; j++){
						if(items.augmentation.todas[i].actions[j][0]=="move"){
							moverNodo(items.augmentation.todas[i].actions[j][1], items.augmentation.todas[i].actions[j][2]);
						}else if(items.augmentation.todas[i].actions[j][0]=="remove"){
							quitarNodo(items.augmentation.todas[i].actions[j][1]);
						}else if(items.augmentation.todas[i].actions[j][0]=="widget" && !items.augmentation.todas[i].actions[j][3]){debugger;
							meterNodo(items.augmentation.todas[i].actions[j][1],items.augmentation.todas[i].actions[j][2]);
						}else if(items.augmentation.todas[i].actions[j][0]=="widget" && items.augmentation.todas[i].actions[j][3]){
							meterNodo(items.augmentation.todas[i].actions[j][1],items.augmentation.todas[i].actions[j][2]);
							var pos = $(items.augmentation.todas[i].actions[j][2])[0].getAttribute("wm_hrefxpath");
							actualizableWidgets.push(pos);
						}
					}
					meterNodoUpdate();
				}
			}
		}
		//console.log(items);		
	});
	actualizarNodoUpdate();
});

function actualizarNodoUpdate(){debugger;
chrome.storage.onChanged.addListener(function (changes, namespace) {debugger;
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {debugger;
		if(changes.widgetsUpdated != "undefined"){
			for(var i = 0; i < changes.widgetsUpdated.newValue.length; i++){
					if(changes.widgetsUpdated.newValue[i].html != null){
						$('[wm_hrefxpath='+changes.widgetsUpdated.newValue[i].pos+']')[0].innerHTML = changes.widgetsUpdated.newValue[i].html;
						changes.widgetsUpdated.newValue[i].html = null;
					}
				}
				if(comprobarTodosInsertados(changes.widgetsUpdated.newValue)){
					chrome.storage.local.set({"widgetsUpdated":changes.widgetsUpdated.newValue},function (){debugger;
					});
				}
		}
  }
});
}

function comprobarTodosInsertados(lista){
	var todos = true;
	for(var i = 0; i < lista.length; i++){
		if(lista[i].html != null){
			todos = false;
		}
	}
	return todos;
}

function meterNodo(xpath, html){
	var node = document.evaluate(xpath, document.body, null, XPathResult.ANY_TYPE, null).iterateNext();
	html = html.replace('wm_widgetInserted','wm_widgetInsertedExecution');
	html = html.replace('wm_updateElement','wm_updateElemented');
	node.parentNode.insertBefore($(html)[0], node.nextElementSibling);
}

function meterNodoUpdate(){
	chrome.storage.local.set({"updates": actualizableWidgets}, function() {
		chrome.storage.local.get("widgets", function(items){
			for(var i = 0; i < items.widgets.length; i++){debugger;
				for(var j = 0; j < actualizableWidgets.length; j++){
					if(items.widgets[i].numero == actualizableWidgets[j]){
						window.open(items.widgets[i].href, '_blank');
					}
				}
			}			
		});
	});
	//var node = document.evaluate(xpath, document.body, null, XPathResult.ANY_TYPE, null).iterateNext();
/*window.open("https://stackoverflow.com/questions/4907843/open-a-url-in-a-new-tab-and-not-a-new-window", '_blank');
  window.open(document.location.href, '_blank');
  try{
	self.close();
  }catch(e){
	  console.log(e);
  }*/
/*  chrome.storage.local.get("widgets", function(items){
		for(var i = 0; i < items.widgets.length; i++){debugger;
			if(items.widgets[i].numero == pos){
				window.open(items.widgets[i].href, '_blank');
			}
		} 
	});*/
}

var moveRemoveActionsNodes = new Array();
let continuarAfterCopying = true;
function activarMenu(){
	document.getElementById('wm_newButton').onclick = function(e){
		if(stateAugmentation=="new"){
			stateAugmentation="developing";
			desaparecerBotonesMenu();
			desactivarMenuButtons();
			start();
			deleteNode();
			draganddrop();
			addWidgetButtonPannel();
			addWidgetButtons();
		//	actualizarWidget();
		}
	};
	document.getElementById('wm_updateButton').onclick = function(e){
		if(stateAugmentation=="remove"){
			stateAugmentation="developing";
			desaparecerBotonesMenu();
			desactivarMenuButtons();
			start();
			deleteNode();
			draganddrop();
			addWidgetButtonPannel();
			addWidgetButtons();
			activarWidgets();
		}
	};
	document.getElementById('wm_removeButton').onclick = function(e){
		if(stateAugmentation=="remove"){
			desaparecerBotonesMenu();
			desactivarMenuButtons();
			eliminarAugmentacion();
		}
	};
	document.getElementById('wm_cancelButton').onclick = function(e){
		desaparecerBotonesMenu();
		desactivarMenuButtons();
		if(stateAugmentation=="developing"){
			start();
		}else if(stateAugmentation=="mining"){
			startMining();
		}
	};
	document.getElementById('wm_saveButton').onclick = function(e){
		if(stateAugmentation=="developing"){
			saveChangesButton();
		}
	};
	document.getElementById('wm_mineButton').onclick = function(e){
		if(stateAugmentation=="new" || stateAugmentation=="remove"){
			desaparecerBotonesMenu();
			desactivarMenuButtons();
			previousStateAugmentation = stateAugmentation;
			stateAugmentation="mining";
			mine();
		}
	};
	document.getElementById('wm_copyButton').onclick = function(e){
		if(stateAugmentation=="mining"){
			desaparecerBotonesMenu();
			desactivarMenuButtons();
			continuarAfterCopying = false;
			makeTheCopy();
		}
	};
	document.ondblclick = function(e){
		$("#wm_newButton").removeClass("wm_disableButton");
		$("#wm_mineButton").removeClass("wm_disableButton");
		$("#wm_removeButton").removeClass("wm_disableButton");
		$("#wm_cancelButton").removeClass("wm_disableButton");
		$("#wm_saveButton").removeClass("wm_disableButton");
		$("#wm_updateButton").removeClass("wm_disableButton");
		if(stateAugmentation=="new"){
			$("#wm_newButton")[0].style.display="table";
			$("#wm_mineButton")[0].style.display="table";
			$("#wm_removeButton")[0].style.display="table";
			$("#wm_removeButton").addClass("wm_disableButton");
			$("#wm_cancelButton")[0].style.display="table";
			//$("#wm_saveButton")[0].style.display="table";
			$("#wm_saveButton").addClass("wm_disableButton");
		}else if(stateAugmentation=="remove"){
			$("#wm_updateButton")[0].style.display="table"
			$("#wm_removeButton")[0].style.display="table";
			$("#wm_cancelButton")[0].style.display="table";
			//$("#wm_saveButton")[0].style.display="table";
			$("#wm_saveButton").addClass("wm_disableButton");
			$("#wm_mineButton")[0].style.display="table";
		}else if(stateAugmentation=="developing"){
			$("#wm_newButton")[0].style.display="table";
			$("#wm_newButton").addClass("wm_disableButton");
			$("#wm_removeButton")[0].style.display="table";
			$("#wm_removeButton").addClass("wm_disableButton");
			$("#wm_cancelButton")[0].style.display="table";
			$("#wm_saveButton")[0].style.display="table";
			$("#wm_mineButton").addClass("wm_disableButton");
		}
		else if(stateAugmentation=="mining"){
			$("#wm_newButton")[0].style.display="table";
			$("#wm_newButton").addClass("wm_disableButton");
			$("#wm_removeButton")[0].style.display="table";
			$("#wm_removeButton").addClass("wm_disableButton");
			$("#wm_cancelButton")[0].style.display="table";
			$("#wm_saveButton")[0].style.display="table";
			$("#wm_saveButton").addClass("wm_disableButton");
			$("#wm_mineButton").addClass("wm_disableButton");
		}
		$(document).off("click");

	};
}

function activarWidgets(){
	for(var i = 0; i<$('.wm_widgetInsertedExecution').length; i++){debugger;
		$('.wm_widgetInsertedExecution')[i].appendChild($("<span class='wm_nodewidget wm_closeVentana wm_close' title='close'>X</span><span class='wm_updatenode wm_closeVentana wm_close'>Update</span>")[0]);
		$('.wm_widgetInsertedExecution')[i].setAttribute("draggable", "true");
		if($($('.wm_widgetInsertedExecution')[i]).hasClass("wm_updateElemented")){
			$('.wm_widgetInsertedExecution')[i].appendChild($("<span class='wm_updatenode wm_closeVentana wm_close'>Constant</span>")[0]);
			$('.wm_widgetInsertedExecution')[i].classList.add('wm_updateElement');
			$('.wm_widgetInsertedExecution')[i].classList.remove('wm_updateElemented');
		}else{
			$('.wm_widgetInsertedExecution')[i].appendChild($("<span class='wm_updatenode wm_closeVentana wm_close'>Update</span>")[0]);
		}
	}
	while($('.wm_widgetInsertedExecution').length > 0){
		$('.wm_widgetInsertedExecution')[0].classList.add('wm_widgetInserted');
		$('.wm_widgetInsertedExecution')[0].classList.remove('wm_widgetInsertedExecution');
	}
	activarEliminarWidgets();
	activarEliminarUpdates();
}

function addWidgetButtonPannel(){
	$("#wm_topcorner")[0].style.display="table";
	$("#wm_topcorner").click(function(e){
		if($("#wm_topcorner")[0].textContent == "+"){
			$("#wm_topcorner")[0].textContent = "-";
			$("#wm_widgetPannel")[0].style.display="table";
		}else{
			$("#wm_topcorner")[0].textContent = "+";
			$("#wm_widgetPannel")[0].style.display="none";
		}
	});
}

function addWidgetButtons(){
	chrome.storage.local.get("widgets", function(items){
		$("#wm_widgetPannel").append("<br>");
		for(var i = 0; i < items.widgets.length; i++){debugger;
			$("#wm_widgetPannel").append( "<div> <span class='wm_closebtn' wm_widgetButtonTotalValueDelete='"+items.widgets[i].numero+"'>&times;</span> <button class='wm_widgetButton' wm_widgetButtonValue='"+i+"' wm_widgetButtonTotalValue='"+items.widgets[i].numero+"' style=' background-color: #008CBA; width: 25%; overflow: hidden;'>"+items.widgets[i].name+"</button></div>" );
		} 
		activarListenerBotones();
		activarEliminarBotones();
	});
}

var widgetPosGlobal = -1;
function activarListenerBotones(){
	$('.wm_widgetButton').click(function(e){
		$("#wm_topcorner")[0].textContent = "+";
		$("#wm_widgetPannel")[0].style.display="none";
		widgetPosGlobal = e.target.getAttribute('wm_widgetButtonValue');
	});
}

function activarEliminarBotones(){
	$('.wm_closebtn').click(function(e){
		chrome.storage.local.get("widgets", function(items){
			var posRemove = $(e.target)[0].getAttribute("wm_widgetButtonTotalValueDelete");
			e.target.parentNode.remove();
			for(var i = 0; i < items.widgets.length; i++){
				if(items.widgets[i].numero == posRemove){
					items.widgets.splice(i,1);
				}
			}
			chrome.storage.local.set({"widgets": items.widgets}, function() {
			});
			debugger;
		});
	});
}

function eliminarAugmentacion(){
	chrome.storage.local.get("augmentation", function(items){
		for(var i=0; i<items.augmentation.todas.length; i++){
				if(window.location.href == items.augmentation.todas[i].url){
					items.augmentation.todas.splice(i, 1);
					var lista = items.augmentation.todas;
				}
			}
		chrome.storage.local.set({
			augmentation:  {todas: lista}
		});
		window.location.reload(true);
	});
}

function desactivarMenuButtons(){
	$('#wm_newButton').off("click");
	$('#wm_mineButton').off("click");
	$('#wm_updateButton').off("click");
	$('#wm_removeButton').off("click");
	$('#wm_cancelButton').off("click");
	$('#wm_saveButton').off("click");
}

function desaparecerBotonesMenu(){
	$("#wm_newButton")[0].style.display="none";
	$("#wm_mineButton")[0].style.display="none"
	$("#wm_updateButton")[0].style.display="none";
	$("#wm_removeButton")[0].style.display="none";
	$("#wm_cancelButton")[0].style.display="none";
	$("#wm_saveButton")[0].style.display="none";
	//start();
}

function mine(){
	startMining();
}

function makeTheCopy(){
	$("#wm_copyNameButton")[0].style.display="table";
	$("#wm_copyButton")[0].style.display="none";
	makeTheCopyAccept();
	makeTheCopyCancel();
}

function makeTheCopyCancel(){
	$('#wm_cancelbutton').click(function(e){
		continuarAfterCopying = false;
		$("#wm_copyNameButton")[0].style.display="none";
		$("#wm_copyButton")[0].style.display="block";
		$('#wm_cancelbutton').off("click");
		$('#wm_acceptbutton').off("click");
	});
}

function makeTheCopyAccept(){
	$('#wm_acceptbutton').click(function(e){
		$('#wm_cancelbutton').off("click");
		$('#wm_acceptbutton').off("click");
		stateAugmentation=previousStateAugmentation;
	chrome.storage.local.get("widgets", function(items){debugger;
		var xpath=minimizeXPath(generateXPath($(".ws_direccion")[0],document.documentElement,null,{showId:true}),document.documentElement).join("");
		var href = document.location.href;
		var domain = document.location.hostname;
		var name = $('#wm_fname')[0].value;
		if(name==""){
			name = domain;
		}
		try{
			var nodoCopia = $(".ws_direccion")[0];
			$(".ws_direccion").removeClass( "ws_direccion" );
			var html = flo.getStyledNode(nodoCopia);
		}catch(err){
			var html = null;
		}
		if(Object.keys(items).length==0){
			var lista = new Array();
			lista.push({name:name, xpath:xpath, href:href, domain:domain, html:html, numero:0});
		}else{
			var numero = items.widgets[items.widgets.length-1].numero+1;
			var lista = items.widgets;
			lista.push({name:name, xpath:xpath, href:href, domain:domain, html:html, numero:numero});
		}
		chrome.storage.local.set({"widgets":lista},function (){
			window.location.reload(true);
		});
	});
	});		
	
}

var unavezMining = true;
function startMining(){
	prepareForClick();
 	$(document).click(function(e){
 		e.preventDefault();
        e.stopPropagation();
		if(continuarAfterCopying){
			updateNewTargetMining(e.target);
		}else{
			continuarAfterCopying = true;
		}
		if(unavezMining){
			desactivardraganddrop();
			draganddrop();
			unavezMining = false;
		}
    });
}

let lastTargetMining = null;

function updateNewTargetMining(element){;
	//console.log(element);
	if($(element).hasClass("ws_direccion")){
		prepareForClick();
	}else{
		if(!($(element).hasClass("wm_node") || $(element).hasClass("arrow") || $(element).hasClass("wm_noselectable"))){
			lastTargetMining = element;
		//	$(".ws_direccion").removeAttr("draggable");
			$(".ws_direccion").removeClass("ws_direccion");
			$(element).addClass("ws_direccion");
		//	$(element)[0].setAttribute("draggable", "true");
			updateButtonsPosition(element);
		}else{
			if(lastTargetMining!=null){
				if($(element).hasClass("left")){
					updateNewTargetMining(lastTargetMining.previousElementSibling);
				}else if($(element).hasClass("right")){
					updateNewTargetMining(lastTargetMining.nextElementSibling);
				}else if($(element).hasClass("up")){
					updateNewTargetMining(lastTargetMining.parentNode);
				}else if($(element).hasClass("down")){
					updateNewTargetMining(lastTargetMining.firstElementChild);
				}
			}
		}
	}
}

function saveChangesButton(){
	chrome.storage.local.get("augmentation", function(items){debugger;
		var metido = false;
		if(Object.keys(items).length==0){
			var lista = new Array();
			meterWidgetsExternos();
			lista.push({actions:moveRemoveActionsNodes, url: window.location.href });
		}else{
			for(var i=0; i<items.augmentation.todas.length; i++){
				if(window.location.href == items.augmentation.todas[i].url){
					metido = true;
					removePreviousWidgetsExternos();
					meterWidgetsExternos();
					items.augmentation.todas[i].actions=moveRemoveActionsNodes;
					var lista = items.augmentation.todas;
				}
			}
			if(!metido){
				var lista = items.augmentation.todas;
				meterWidgetsExternos();
				lista.push({actions:moveRemoveActionsNodes, url: window.location.href });
			}
		}
		chrome.storage.local.set({
			augmentation:  {todas: lista}
		});
		window.location.reload(true);
	});		
}

function removePreviousWidgetsExternos(){
	for(var i = 0; i < moveRemoveActionsNodes.length; i++){
		if(moveRemoveActionsNodes[i][0]=="widget"){
			moveRemoveActionsNodes.splice(i, 1);
			i--;
		}
	}
}

function meterWidgetsExternos(){
	for(var i=0; i<$('[wm_widgetInsertedValue]').length; i++){
		$('[wm_widgetInsertedValue]')[i].setAttribute("draggable", "false");
		var xpathDocument=minimizeXPath(generateXPath($('[wm_widgetInsertedValue]')[i].previousElementSibling,document.documentElement,null,{showId:true}),document.documentElement).join(""); //hermano previo
		debugger;
		if($('[wm_widgetInsertedValue]')[i].children[3].textContent == "Update"){
			var html = $('[wm_widgetInsertedValue]')[i].outerHTML.replace('<span class="wm_nodewidget wm_closeVentana wm_close" title="close">X</span><span class="wm_updatenode wm_closeVentana wm_close">Update</span>','');
		}else{
			var html = $('[wm_widgetInsertedValue]')[i].outerHTML.replace('<span class="wm_nodewidget wm_closeVentana wm_close" title="close">X</span><span class="wm_updatenode wm_closeVentana wm_close">Constant</span>','');
		}
		debugger;
		var aux = new Array();
		aux.push("widget");
		aux.push(xpathDocument);
		var update = $($('[wm_widgetInsertedValue]')[i]).hasClass("wm_updateElement");
		aux.push(html);
		aux.push(update);
		moveRemoveActionsNodes.push(aux);
	}
}

function quitarNodo(xpath){
	var node = document.evaluate(xpath, document.body, null, XPathResult.ANY_TYPE, null).iterateNext();
	node.parentNode.removeChild( node );
}

function moverNodo(from, to){
	var nodeFrom = document.evaluate(from, document.body, null, XPathResult.ANY_TYPE, null).iterateNext();
	nodeFrom.parentNode.removeChild( nodeFrom );
	var nodeTo = document.evaluate(to, document.body, null, XPathResult.ANY_TYPE, null).iterateNext();
	nodeTo.appendChild(nodeFrom);
}

var dragged;
var dragover;
function draganddrop(){
	//if (window.orientation == 'undefined'){
		//desktopBrowser();
	//}else{
		mobileBrowser();
//	}
}

//getEventListeners(document)
function desactivardraganddrop(){
	if(dragged!=undefined){
		dragged.removeEventListener("dragstart", function(){});
		dragged.removeEventListener("drag", function(){});
		dragged.removeEventListener("dragover", function(){});
		dragged.removeEventListener("dragenter", function(){});
		dragged.removeEventListener("dragleave", function(){});
		dragged.removeEventListener("dragend", function(){});
	}
}
var posX;
var posY;
$("body").mouseover(function(e) {
					posX = e.pageX;
					posY = e.pageY;
				});
           

function mobileBrowser(){
	if(document.getElementsByClassName("ws_direccion")[0] !== undefined){
			addEvent(document, 'dragstart', function (e) {
                e.dataTransfer.effectAllowed = 'copyLink';
				dragged = e.target;
             //   console.log('setting data: ' + this.id);
                e.dataTransfer.setData('Text', this.id); // required otherwise doesn't work
            });

            addEvent(document, 'drag', function (e) {
               //$('html,body').scrollTop(0);
			   
			   //document.getElementById("midcontentadcontainer").scrollHeight
			 });
			 
			 addEvent(document, 'dragover', function (e) {
				 if(window.screen.height/5 > e.screenY){
					 $('html,body').scrollTop(window.scrollY-5);
				 }
				 if(window.screen.height*8/10 < e.screenY){
					 $('html,body').scrollTop(window.scrollY+5);
				 }
           //    console.log("posY"+posY);
			//   console.log("screenY"+e.screenY);
            });
			
			 addEvent(document, 'dragenter', function (e) {
				dragover = e.target;
				posY = e.pageY
				 if(!dragged.contains(dragover)){
					e.target.style.background = "purple";
				 }
            });
			
			 addEvent(document, 'dragleave', function (e) {
                e.target.style.background = "";
            });

            addEvent(document, 'dragend', function (e) {
				  e.preventDefault();
				  if(!dragged.contains(dragover)){
					  if(e.target.classList.contains('ws_direccion')){
						  var aux = new Array();
						  aux.push("move");
						  var xpathDocumentFrom=minimizeXPath(generateXPath($(".ws_direccion")[0],document.documentElement,null,{showId:true}),document.documentElement).join("");
						  aux.push(xpathDocumentFrom);
						  $(".ws_direccion").removeAttr("draggable");
						  dragover.style.background = "";
						  dragover.appendChild( dragged );
						  var xpathDocumentTo=minimizeXPath(generateXPath(dragged.parentNode,document.documentElement,null,{showId:true}),document.documentElement).join("");
						  aux.push(xpathDocumentTo);
						  moveRemoveActionsNodes.push(aux);
					  }else{
						  dragover.appendChild( dragged );
					  }
				  }
				  prepareForClick();
            });

	}
}

function desktopBrowser(){
	document.addEventListener("drag", function( event ) {

  }, false);

  document.addEventListener("dragstart", function( event ) {
      dragged = event.target;
  }, false);

  document.addEventListener("dragend", function( event ) {
  
  }, false);

  document.addEventListener("dragover", function( event ) {
      event.preventDefault();
  }, false);

  document.addEventListener("dragenter", function( event ) {
      event.target.style.background = "purple";
  }, false);

  document.addEventListener("dragleave", function( event ) {
      event.target.style.background = "";
  }, false);

  document.addEventListener("drop", function( event ) {
      event.preventDefault();
	  if(event.target!=dragged){
		  var aux = new Array();
		  aux.push("move");
		  var xpathDocumentFrom=minimizeXPath(generateXPath($(".ws_direccion")[0],document.documentElement,null,{showId:true}),document.documentElement).join("");
		  aux.push(xpathDocumentFrom);
		  $(".ws_direccion").removeAttr("draggable");
	//	  $(".ws_direccion").addClass("ws_direccionm");
		  event.target.style.background = "";
		 // dragged.classList.add("wm_movedNode");
		 // dragged.parentNode.removeChild( dragged );
		  event.target.appendChild( dragged );
		  var xpathDocumentTo=minimizeXPath(generateXPath(dragged.parentNode,document.documentElement,null,{showId:true}),document.documentElement).join("");
		  aux.push(xpathDocumentTo);
		  moveRemoveActionsNodes.push(aux);
	  }
	  prepareForClick();
//	  $(document).off("click");
//	  startForMovement(dragged);
  }, false);
}

//document.evaluate(removedNodes[0], document.body, null, XPathResult.ANY_TYPE, null).iterateNext();

function deleteNode(){
    document.getElementById('wm_closenode').onclick = function(e){
		var aux = new Array();
		aux.push("remove");
		var xpathDocument=minimizeXPath(generateXPath($(".ws_direccion")[0],document.documentElement,null,{showId:true}),document.documentElement).join("");
        aux.push(xpathDocument);
		$(".ws_direccion").removeAttr("draggable");
        lastTarget.classList.add("wm_removedNode");
		moveRemoveActionsNodes.push(aux);
		//OJO!!! AQUI ELIMINO NODO. SI HACEMOS UN CTRL+Z HABRÍA QUE QUITAR ESTA LÍNEA Y SE OCULTARÍA MEDIANTE CSS. ESTO HARÍA QUE LAS FLECHAS DE MOVIMIENTO SALTEN EL ELEMENTO OCULTO EN LA FUNCION updateNewTarget Y updateButtonsPosition.
		$(".ws_direccion")[0].parentNode.removeChild( $(".ws_direccion")[0] );
		e.preventDefault();
        e.stopPropagation();
		prepareForClick();
    };
}

function prepareForClick(){
	lastTarget = null;
	$(".ws_direccion").removeClass("ws_direccion");
	$(".wm_node").css("display","none");
}
var unavez = true;
var widgetInsertedValue = 0;
function start(){
	prepareForClick();
 	$(document).click(function(e){
		if(widgetPosGlobal == -1){
			e.preventDefault();
			e.stopPropagation();
			updateNewTarget(e.target);
			if(unavez){
				desactivardraganddrop();
				draganddrop();
				unavez = false;
			}
		}else{
			chrome.storage.local.get("widgets", function(items){debugger;
				if(!($(e.target).hasClass("wm_node") || $(e.target).hasClass("wm_closebtn") || $(e.target).hasClass("arrow") || $(e.target).hasClass("wm_widgetButton") || $(e.target).hasClass("wm_topcorner"))){
					if(!$(e.target).hasClass("wm_widgetButton")){
						if(!hasclassChildren(e.target)){
							if(!hasClassParents(e.target, "wm_widgetInserted")){
								$(e.target).after("<div wm_hrefxpath='"+items.widgets[widgetPosGlobal].numero+"' class='wm_widgetInserted' wm_widgetInsertedValue='"+widgetInsertedValue+"' draggable='true'>"+items.widgets[widgetPosGlobal].html+"<span class='wm_nodewidget wm_closeVentana wm_close' title='close'>X</span><span class='wm_updatenode wm_closeVentana wm_close'>Update</span></div>");
								$(".wm_nodewidget").off("click");
								$(".wm_updatenode").off("click");
								activarEliminarWidgets();
								activarEliminarUpdates();
								widgetPosGlobal = -1;
								widgetInsertedValue++;
							}
						}
					}
				}
			});
		}
    });
}

function activarEliminarWidgets(){
	$(".wm_nodewidget").click(function(e){
		e.target.parentNode.remove();
	});
}

function activarEliminarUpdates(){
	$(".wm_updatenode").click(function(e){
		if($(e.target.parentNode).hasClass("wm_updateElement")){
			$(e.target.parentNode).removeClass( "wm_updateElement" )
			e.target.textContent = "Update";
		}else{
			$(e.target.parentNode).addClass("wm_updateElement");
			e.target.textContent = "Constant";
		}
		debugger;
	});
}

function startForMovement(nodo){
	prepareForClick();
    //updateNewTargetMovement(nodo);
	lastTargetm = nodo;
	updateButtonsPositionMovement(nodo);
	$(document).click(function(e){
 		e.preventDefault();
        e.stopPropagation();
       	updateNewTargetMovement(e.target);
    });
}

let lastTarget = null;
let lastTargetm = null;

function updateNewTarget(element){
	//console.log(element);
	if($(element).hasClass("ws_direccion")){
		prepareForClick();
	}else{
		if(!($(element).hasClass("wm_node") || $(element).hasClass("wm_closebtn") || $(element).hasClass("wm_widgetInserted") || $(element).hasClass("wm_initialButton2") || $(element).hasClass("wm_closewidget") || $(element).hasClass("arrow") || $(element).hasClass("wm_widgetButton") || $(element).hasClass("wm_topcorner"))){
			if(!hasClassParents(element, "wm_widgetInserted")){
				if(!hasclassChildren(element)){
					lastTarget = element;
					$(".ws_direccion").removeAttr("draggable");
					$(".ws_direccion").removeClass("ws_direccion");
					$(element).addClass("ws_direccion");
					$(element)[0].setAttribute("draggable", "true");
					updateButtonsPosition(element);
				}
			}
		}else{
			if(lastTarget!=null){
				if($(element).hasClass("left")){
					updateNewTarget(lastTarget.previousElementSibling);
				}else if($(element).hasClass("right")){
					updateNewTarget(lastTarget.nextElementSibling);
				}else if($(element).hasClass("up")){
					updateNewTarget(lastTarget.parentNode);
				}else if($(element).hasClass("down")){
					updateNewTarget(lastTarget.firstElementChild);
				}
			}
		}
	}
}

function hasclassChildren(element){
	var encontrado = false;
	if(element != null){
		for(var i = 0; i < $(".wm_widgetInserted").length; i++){
			if(element.contains($(".wm_widgetInserted")[i])){
				encontrado = true;
			}
		}
	}
	return encontrado;
}

function hasClassParents(element, className) {
  do {
    if (element.classList && element.classList.contains(className)) {
      return true;
    }
    element = element.parentNode;
  } while (element);
  return false;
}

/*function updateNewTargetMovement(element){
	//console.log(element);
//	if($(element).hasClass("ws_direccionm")){
//		prepareForClick();
//	}else{
		if(!($(element).hasClass("wm_nodem") || $(element).hasClass("arrowm"))){
			//lastTargetm = element;
			//$(".ws_direccion").removeAttr("draggable");
			//$(".ws_direccion").removeClass("ws_direccion");
			//$(element).addClass("ws_direccion");
			//$(element)[0].setAttribute("draggable", "true");
			updateButtonsPositionMovement(element);
		}else{
			if(lastTargetm!=null){
				if($(element).hasClass("leftm")){
					lastTargetm.previousElementSibling.insertBefore( lastTargetm, undefined );
				}else if($(element).hasClass("rightm")){
					lastTargetm.nextElementSibling.appendChild( lastTargetm );
				}else if($(element).hasClass("upm")){
					lastTargetm.parentNode.appendChild( lastTargetm );
				}else if($(element).hasClass("downm")){
					lastTargetm.firstElementChild.appendChild( lastTargetm );
				}
			}
		}
//	}
}*/

function updateButtonsPosition(element){
	/* reposition buttons and disable not needed ones */
	let offsetTop = getOffsetTop(element);
	let offsetLeft = getOffsetLeft(element);
	$(".wm_node").css("display","block");
	if(!hasclassChildren(element.parentNode)){
		$("#father").css("display",(element.parentNode!==null)?"block":"none").css("top",(offsetTop - 20) + "px").css("left",offsetLeft).css("width",element.offsetWidth);
	}else{
		$("#father").css("display","none")
	}
	if(!hasclassChildren(element)){
		$("#son").css("display",(element.firstElementChild!==null)?"block":"none").css("top",(offsetTop + element.offsetHeight) + "px").css("left",offsetLeft).css("width",element.offsetWidth);
	}else{
		$("#son").css("display","none")
	}
	if(!hasclassChildren(element.previousElementSibling)){
		$("#left_bro").css("display",(element.previousElementSibling!==null)?"block":"none").css("top",(offsetTop + element.offsetHeight/2) + "px").css("left",(offsetLeft-50)+"px").css("width","50px");
	}
	else{
		$("#left_bro").css("display","none")
	}
	if(!hasclassChildren(element.nextElementSibling)){
		$("#right_bro").css("display",(element.nextElementSibling!==null)?"block":"none").css("top",(offsetTop + element.offsetHeight/2) + "px").css("left",(offsetLeft+element.offsetWidth)+"px").css("width","50px");
	}
	else{
		$("#right_bro").css("display","none")
	}
	if(stateAugmentation!="mining"){
		$("#wm_closenode").css("display","block").css("top",(offsetTop)+3 + "px").css("left",(offsetLeft+element.offsetWidth-35)+"px").css("width","25px");
	}
	if(stateAugmentation=="mining"){
		if($(element).text()!="MINEIT"){
			$("#wm_copyButton").css("display","block").css("top",(offsetTop-9+element.offsetHeight/2) + "px").css("left",(offsetLeft-12+element.offsetWidth/2)+"px").css("width","25px").css("height","18px");
		}
	}
}

/*function updateButtonsPositionMovement(element){
	let offsetTop = getOffsetTop(element);
	let offsetLeft = getOffsetLeft(element);
	$(".wm_nodem").css("display","block");
	$("#fatherm").css("display",(element.parentNode!==null)?"block":"none").css("top",(offsetTop - 20) + "px").css("left",offsetLeft).css("width",element.offsetWidth);
	$("#sonm").css("display",(element.firstElementChild!==null)?"block":"none").css("top",(offsetTop + element.offsetHeight) + "px").css("left",offsetLeft).css("width",element.offsetWidth);
	$("#left_brom").css("display",(element.previousElementSibling!==null)?"block":"none").css("top",(offsetTop + element.offsetHeight/2) + "px").css("left",(offsetLeft-50)+"px").css("width","50px");
	$("#right_brom").css("display",(element.nextElementSibling!==null)?"block":"none").css("top",(offsetTop + element.offsetHeight/2) + "px").css("left",(offsetLeft+element.offsetWidth)+"px").css("width","50px");
	$("#ok_button_move").css("display","block").css("top",offsetTop + "px").css("left",offsetLeft+"px").css("width",element.offsetWidth).css("height", element.offsetHeight);
}*/

const getOffsetTop = element => {
  let offsetTop = 0;
  while(element) {
    offsetTop += element.offsetTop;
    element = element.offsetParent;
  }
  return offsetTop;
}

const getOffsetLeft = element => {
  let offsetLeft = 0;
  while(element) {
    offsetLeft += element.offsetLeft;
    element = element.offsetParent;
  }
  return offsetLeft;
}

function actualizarWidget(){
	//$.ajax({url: "https://www.tvguia.es/", success: function(result){debugger;
	//	$("#div1").html(result);
	//}});
//	var req = new XMLHttpRequest();
//req.open('GET', 'http://www.mozilla.org/', false);debugger;
//req.send(null);
//if (req.status == 200)
 // dump(req.responseText);
 /* $(document).ready(function(){
   
 $('.tip_container').load("https://www.tutorialspoint.com/How-to-load-external-HTML-into-a-div-using-jQuery", function(response, status, xhr) {debugger;
	alert( "Load was performed." );

	});
});*/
/*var itemId = 12345;
var url = "https://www.tutorialspoint.com/How-to-load-external-HTML-into-a-div-using-jQuery";
fetch(url)
  .then(response => response.text())
  .then(text => console.log(text))
  .then(price => sendResponse(price))
  .catch(error => alert( "Load was performed." ));
  debugger;*/
//   var tabActual = $('.nav-tabs .active'); //este te da la info del tab actual, ahora habria que volver a mantener el focus en el
 //  let tabInfo = await browser.tabs.get(info.tabId);
 // let handle = window.open("https://stackoverflow.com/questions/4907843/open-a-url-in-a-new-tab-and-not-a-new-window", '_blank');
 // window.opener.focus(); debugger;
 // tabActual.focus();

 // handle.blur();
// var url = "https://stackoverflow.com/questions/958997/frame-buster-buster-buster-code-needed";
	// var iframe=$("<iframe>").attr({src:url,scrolling:"no", sandbox:"allow-same-origin", referrerpolicy:"no-referrer"});debugger;
//	 iframe[0].setAttribute("sandbox", "allow-same-origin");
//	 iframe.css({width:586,height:26037,top:50,left:164,border:"0px",overflow:"hidden"});
/*	 $('body').append(iframe);
	 iframe[0].addEventListener("load",function(e){debugger;
		try{
	 		var nodeNew=iframe[0].contentWindow.document.evaluate('//*[@id="question"]/div[2]/div[2]/div[1]/p[1]', iframe[0].contentWindow.document.body, null, XPathResult.ANY_TYPE, null).iterateNext();
	 	}catch(error){
	 		var nodeNew=null;
	 	}	
	 });*/
	 debugger;
  window.open("https://stackoverflow.com/questions/4907843/open-a-url-in-a-new-tab-and-not-a-new-window", '_blank');
  window.open(document.location.href, '_blank');
  try{
	self.close();
  }catch(e){
	  console.log(e);
  }
}
