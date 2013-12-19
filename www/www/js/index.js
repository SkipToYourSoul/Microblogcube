//var key="AIzaSyAN-bJ7UqH36Zdwgp9QAFENpeglLdUt3yk" ;
var maxEvent = 30;
var ftable_data_server = config.get('ftable_data_server', '')
var figure_data_server = config.get('figure_data_server', '')
var searchServer = config.get('search_server', "")

google.load('visualization', '1.1', {
	packages : [ 'corechart', 'controls' ]
});
function listEvent() {
	if (params.hasOwnProperty('q') == false) {
		var fakeData = {
			"r" : ""
		}
		gListEvent(fakeData);
	} else {
		// 包含一个查询
		$.jsonp({
			url : searchServer + "?op=s&text=" + params['q'],
			callbackParameter : "callback",
			cache : true,
			success : handleSearchData
		});
		// $.getJSON(searchServer + "?op=s&text=" + params['q'] + "&callback=?",
		// {},handleSearchData)
	}
}

function handleSearchData(data) {
	gListEvent(data);
}
// 随机的选择K条结果
function gListEvent(ids) {
	var queryText = "SELECT EventId, Title, Information, Hot,ImgA FROM  "
			+ config.get('brief_info', "");
	if (ids['r'].length > 0) {
		queryText += " WHERE EventId in (" + ids['r'] + ") ORDER BY Hot desc";
	} else {
		queryText += " ORDER BY Hot desc offset "
				+ Math.floor((maxEvent - Math.random() * maxEvent))
				+ " limit 6;";
	}
	gQueryEvent(queryText);
}
var figure_data_server = config.get('figure_data_server', '')
function gQueryEvent(sql) {
	var query = new google.visualization.Query(figure_data_server + '?key='
			+ config.get("brief_key", "") + '&tq=' + sql);
	// Send the query with a callback function.
	query.send(handleGQueryData);
}

function handleGQueryData(response) {
	var eventList = "";
	var dataTable = response.getDataTable();
	/*
	 * for (i =0;i <dataTable.getNumberOfRows();i++){ var row = []; for (j = 0;
	 * j < dataTable.getNumberOfColumns(); j++){
	 * row.push(dataTable.getValue(i,j)); }
	 * 
	 * eventList += "<div class='brief'><div class='brief_title'>";
	 * eventList+="<a href=\"event1_1.html?eventId="+row[0]+"\">"; eventList+="<h2>"+row[1]+"</h2></a></div>";
	 * eventList+="<div class='brief_img'>"; eventList+="<a
	 * href=\"event1_1.html?eventId="+row[0]+"\">"; eventList+="<img
	 * src=\"img/brief1.png\" alt=\""+row[1]+"\" border=0 width=280 height=210></a></div>";
	 * //start of brief_hot eventList+="<div class='brief_hot'><div
	 * class='hot_name'>"; eventList+="<p>事件热度</p></div>"; eventList+="<div
	 * class='hot_bar'>"; eventList+="<div class=\"hot_fill\" style=\"width:"+
	 * parseInt(row[3]) +"px\" onmouseover=\"this.style.backgroundColor='blue'\"
	 * onmouseout=\"this.style.backgroundColor='cornflowerblue'\">";
	 * eventList+="</div></div></div>"; eventList+="<div
	 * class='brief_info'>"; //简洁 eventList+="<div class='brief_maininfo'>";
	 * eventList+="<a href=\"event1_1.html?eventId="+row[0]+"\"><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+row[2]+"</p></a></div>";
	 * eventList+="<div class='brief_more'>"; eventList+="<a
	 * href=\"event1_1.html?eventId="+ row[0] +"\"><p>更多></p></a>";
	 * eventList+="</div></div></div>"; } $("#main_info").html(eventList);
	 */
	jData = dataTableAdapter(dataTable);
	handleJQueryData(jData);

}

function jListEvent() {
	var queryText = "SELECT EventId, Title, Information, Hot,ImgA FROM "
			+ config.get('brief_info', "") + " order by Hot offset "
			+ Math.floor((maxEvent - Math.random() * maxEvent)) + " limit 6;";
	var url = ftable_data_server + "?key=" + config.get("brief_key", "")
			+ "&typed=false&sql=";
	// Send the query with a callback function.
	$.post(url + queryText, {}, handleJQueryData);
}

function handleJQueryData(jsonData) {
	var eventList = "";
	for ( var idx in jsonData.rows) {
		var row = jsonData.rows[idx];
		eventList += "<div class='brief'><div class='brief_title'>";
		eventList += "<a href=\"event1_1.html?eventId=" + row[0] + "\">";
		eventList += "<h2>" + row[1] + "</h2></a></div>";
		eventList += "<div class='brief_img'>";
		eventList += "<a href=\"event1_1.html?eventId=" + row[0] + "\">";
		eventList += "<img src=\"" + row[4] + "\" alt=\"" + row[1]
				+ "\" border=0 width=280 height=210></a></div>";
		// start of brief_hot
		eventList += "<div class='brief_hot'><div class='hot_name'>";
		eventList += "<p>事件热度</p></div>";
		eventList += "<div class='hot_bar'>";
		eventList += "<div class=\"hot_fill\" style=\"width:"
				+ parseInt(row[3])
				+ "px\" onmouseover=\"this.style.backgroundColor='blue'\" onmouseout=\"this.style.backgroundColor='cornflowerblue'\">";
		eventList += "</div></div></div>";
		eventList += "<div class='brief_info'>";
		// 简洁
		eventList += "<div class='brief_maininfo'>";
		eventList += "<a href=\"event1_1.html?eventId=" + row[0]
				+ "\"><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + row[2]
				+ "</p></a></div>";
		eventList += "<div class='brief_more'>";
		eventList += "<a href=\"event1_1.html?eventId=" + row[0]
				+ "\"><p>更多></p></a>";
		eventList += "</div></div></div>";
	}
	$("#main_info").html(eventList);
}

if (document.addEventListener) {
	document.addEventListener('DOMContentLoaded', listEvent, false);
} else {
	window.onload = listEvent;
}
