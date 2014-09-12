define(["jquery", "text!./lms-OptionList.css"], 
function($, cssContent) {'use strict';
	$("<style>").html(cssContent).appendTo("head");
	return {
		initialProperties : {
			version: 1.0,
			qListObjectDef : {
				qShowAlternatives : true,
				qFrequencyMode : "V",
				qInitialDataFetch : [{
					qWidth : 2,
					qHeight : 50
				}]
			},
			lbltxt : "Select Option: ",
			fixed : true,
			width : 25,
			percent : true,
			selectionMode : "QUICK"
		},
		definition : {
			type : "items",
			component : "accordion",
			items : {
				width : {
					type : "items",
					label : "Width and Selections",
					items : {
						lbltxt : {
							ref : "lbltxt",
							label : "Prefix Field",
							type : "string"
						},
						fixed : {
							ref : "fixed",
							label : "Fixed width",
							type : "boolean",
							defaultValue : true
						},
						width : {
							ref : "width",
							label : "Width",
							type : "number",
							defaultValue : 20,
							show : function(data) {
								return data.fixed;
							}
						},
						percent : {
							ref : "percent",
							type : "boolean",
							label : "Unit",
							component : "switch",
							defaultValue : true,
							options : [{
								value : true,
								label : "Percent"
							}, {
								value : false,
								label : "Pixels"
							}],
							show : function(data) {
								return data.fixed;
							}
						},
						selection : {
							type : "string",
							component : "dropdown",
							label : "Selection mode",
							ref : "selectionMode",
							options : [{
								value : "NO",
								label : "No selections"
							}, {
								value : "CONFIRM",
								label : "Confirm selections"
							}, {
								value : "QUICK",
								label : "Quick selection"
							}]
						}
					}
				},
				dimension : {
					type : "items",
					translation : "properties.dimension",
					ref : "qListObjectDef",
					min : 1,
					max : 1,
					items : {
						label : {
							type : "string",
							ref : "qListObjectDef.qDef.qFieldLabels.0",
							translation : "properties.label",
							show : true
						},
						libraryId : {
							type : "string",
							component : "library-item",
							libraryItemType : "dimension",
							ref : "qListObjectDef.qLibraryId",
							translation : "properties.dimension",
							show : function(data) {
								return data.qListObjectDef && data.qListObjectDef.qLibraryId;
							}
						},
						field : {
							type : "string",
							expression : "always",
							expressionType : "dimension",
							ref : "qListObjectDef.qDef.qFieldDefs.0",
							translation : "properties.field",
							show : function(data) {
								return data.qListObjectDef && !data.qListObjectDef.qLibraryId;
							}
						}
					}
				},
				settings : {
					uses : "settings"
				}
			}
		},
		snapshot : {
			canTakeSnapshot : true
		},
		paint : function($element, layout) {
			var self = this;
			var html = '';
			var space = '&nbsp&nbsp&nbsp';		

			//Set style text regarding fixed width (or not)
			var style;
			if(layout.fixed) {
				style = 'style="width:' + layout.width + (layout.percent ? '%' : 'px') + ';"';
			} else {
				style = '';
			}


			html += '<span style="font-family:Arial; font-size:130%;">'

			//Label should be pulled from the lbltxt field, but doesnt seem to be working right now.
			//This needs to be fixed so that the label can be edited or set to blank if required
			//----------------------------------------------------------------------------------------
			//alert(layout.lbltxt);
			html += "Select Option: " + space ;

			
			//Render the List of Options based on the assigned field
			//==========================================================
			html += "<ul>";
			this.backendApi.eachDataRow(function(rownum, row) {
				html += '<li ' + style + ' class="data state' + row[0].qState + '" data-value="' + row[0].qElemNumber + '">&nbsp' 
				//show checkboxes only in Qlick select Mode
				//-----------------------------------------
				if(layout.selectionMode === "QUICK") {
					if(row[0].qState=='S'){
						html += '<input type="checkbox" checked>&nbsp<span style="font-family:Arial; font-size:100%; font-weight:bold">'
					}
					else{
						html += '<input type="checkbox" >&nbsp<span style="font-family:Arial; font-size:100%;">'
					}
				}
				html += row[0].qText + space;
				html += '</span>'
				html += '</li>';
			});
			html += "</ul>";
			$element.html(html);

			html += '</span>';


			//Apply selections to the Option List
			//==========================================================
			if(this.selectionsEnabled && layout.selectionMode !== "NO") {
				$element.find('li').on('qv-activate', function() {
					if(this.hasAttribute("data-value")) {
						var value = parseInt(this.getAttribute("data-value"), 10), dim = 0;
						if(layout.selectionMode === "CONFIRM") {
							self.selectValues(dim, [value], true);
							$(this).toggleClass("selected");
						} else {
							//use only one of the two following lines to recognise the selection
							//-------------------------------------------------------------------
							//self.backendApi.selectValues(dim, [value], true);	//allows multiple selections in the field
							self.backendApi.selectValues(dim, [value], false);	//allows single selection in the field
							
							//select first value if nothing is selected
							//hmmn, not sure how to do this
						}
					}
				});
			}
		}
	};
});
