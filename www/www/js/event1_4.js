/**
 * Created with JetBrains WebStorm. User: Tong Date: 13-8-2 Time: 上午10:22 To
 * change this template use File | Settings | File Templates.
 */
var key = config.get("primary_store_key", "");
google.load('visualization', '1.1', {
	'packages' : [ 'geochart', 'controls', "corechart" ]
});

google.setOnLoadCallback(drawChart);

var ftable_data_server = config.get('ftable_data_server', '')
var figure_data_server = config.get('figure_data_server', '')

var finally_data;
var finally_data2;

/*
 * drawChart() 入口函数
 */
function drawChart() {
	drawMap();
	getData();
	// getData2();
	SetWeibo();
}
/*
 * drawMap() 准备第一个图，地域图的数据
 */
function drawMap() {

	var queryText = 'SELECT Location, UserCount FROM 1kEIFY7bfBVXMyONR2AevWJVlIE3BKwPF82HmQNg where EventId = '
			+ eventId + '';
	// Send the query with a callback function.
	var url = ftable_data_server + "?key=" + key + "&typed=false&sql=";
	$.jsonp({
		url : url + queryText,
		callbackParameter : "callback",
		cache : true,
		success : handleQueryResponse1
	});
}

/*
 * handleQueryResponse1() 用drawMap中的数据画图
 */
function handleQueryResponse1(jdata) {
	var visualization;
	var data = parseData(jdata, [ [ 'string', '位置' ], [ 'number', '用户统计' ] ]);
	var options = {
		region : '030',
		displayMode : 'markers',
		colorAxis : {
			colors : [ 'green', 'red' ]
		}
	};
	visualization = new google.visualization.GeoChart(document
			.getElementById('map_chart'));
	visualization.draw(data, options);
}
var tab1Drawed = false;
/*
 * getData() 从fusiontable上获取转发量分布图的数据
 */
function getData() {
	if (tab1Drawed)
		return;
	tab1Drawed = true;
	var queryText = 'SELECT Location, Male, Female FROM 1kEIFY7bfBVXMyONR2AevWJVlIE3BKwPF82HmQNg where EventId = '
			+ eventId + '';
	var url = ftable_data_server + "?key=" + key + "&typed=false&sql=";
	$.jsonp({
		url : url + queryText,
		callbackParameter : "callback",
		cache : true,
		success : handleQueryResponse
	});
}

/*
 * handleQueryResponse() 将转发量分布图的数据转化成想要的格式
 */
function handleQueryResponse(jdata) {
	var data1;
	data1 = parseData(jdata, [ [ 'string', '位置' ], [ 'number', '男' ],
			[ 'number', '女' ] ]);
	finally_data = new google.visualization.DataTable();
	finally_data.addColumn('string', 'Location');
	finally_data.addColumn('number', '男');
	finally_data.addColumn('number', '女');
	for ( var i = 0; i < data1.getNumberOfRows(); i++) {
		finally_data.addRow([ data1.getValue(i, 0), data1.getValue(i, 1),
				data1.getValue(i, 2) ]);
	}
	drawVisualization()
}
var dashboard1 = null;
/*
 * drawVisualization() 画转发量分布图
 */
function drawVisualization() {
	// Define a category picker control for the Gender column
	var categoryPicker = new google.visualization.ControlWrapper({
		'controlType' : 'CategoryFilter',
		'containerId' : 'bar_control',
		'options' : {
			'filterColumnLabel' : 'Location',
			// 'useFormattedValue':true
			'ui' : {
				'labelStacking' : 'vertical',
				'allowTyping' : false,
				'allowMultiple' : true,
				'label' : '地区选择:'
			}
		}
	});
	// Define a Pie chart
	var pie = new google.visualization.ChartWrapper({
		'chartType' : 'BarChart',
		'containerId' : 'bar_chart',
		'options' : {
			// isStacked:true,
			'width' : '100%',
			'height' : '100%',
			'legend' : 'right',
			'title' : '微博转发男女比例图',
			'chartArea' : {
				'left' : 50,
				'top' : 50,
				'right' : 0,
				'bottom' : 10,
				'width' : "75%",
				'height' : '85%'
			}
		}
	});
	dashboard1 = new google.visualization.Dashboard(document
			.getElementById('bar'));
	dashboard1.bind(categoryPicker, pie).draw(finally_data);
}

var tab2Drawed = false;
/*
 * getData2() 从fusiontable上获取zscore图的数据
 */
function getData2() {
	if (tab2Drawed)
		return;
	tab2Drawed = true;
	var queryText = 'SELECT Location, Z_score FROM 1KU6gomT2TyjBoxmPBEf2PnOH_PSIibuKRrV7180 where EventId = '
			+ eventId + '';
	var url = ftable_data_server + "?key=" + key + "&typed=false&sql=";
	$.jsonp({
		url : url + queryText,
		callbackParameter : "callback",
		cache : true,
		success : handleQueryResponse2
	});
}

/*
 * handleQueryResponse2() 将zscore图的数据转化成想要的格式
 */
function handleQueryResponse2(jdata) {
	var data1;
	for ( var i = 0; i < jdata.rows.length; i++)
		jdata.rows[i][1] *= 100000000000000000;

	data1 = parseData(jdata, [ [ 'string', '位置' ], [ 'number', 'Z_score' ] ]);
	finally_data2 = new google.visualization.DataTable();
	finally_data2.addColumn('string', 'Location');
	finally_data2.addColumn('number', 'Z_score');
	for ( var i = 0; i < data1.getNumberOfRows(); i++) {
		finally_data2.addRow([ data1.getValue(i, 0),
				data1.getValue(i, 1) / 100000000000000000 ]);
	}
	drawVisualization2()
}

var dashBoard = null;
/*
 * drawVisualization2() 画zscore图
 */
function drawVisualization2() {
	var categoryPicker = new google.visualization.ControlWrapper({
		'controlType' : 'CategoryFilter',
		'containerId' : 'bar_control2',
		'options' : {
			'filterColumnLabel' : 'Location',
			// 'useFormattedValue':true
			'ui' : {
				'labelStacking' : 'vertical',
				'allowTyping' : false,
				'allowMultiple' : true,
				'label' : '地区选择:'
			}
		}
	});
	var pie = new google.visualization.ChartWrapper({
		'chartType' : 'BarChart',
		'containerId' : 'bar_chart2',
		'options' : {
			width : '100%',
			height : '100%',
			legend : 'top',
			// title : 'Z_score',
			chartArea : {
				'left' : 50,
				'top' : 50,
				'right' : 0,
				'bottom' : 10,
				width : "80%",
				height : '85%'
			}
		}
	});
	dashBoard = new google.visualization.Dashboard(document
			.getElementById('bar2'));
	dashBoard.bind(categoryPicker, pie).draw(finally_data2);
}

/*
 * SetWeibo() 获取微博数据
 */
function SetWeibo() {
	var queryText = 'SELECT Mid,Text,Uid,Uname,IsV FROM 1TojNpEQ0fqifhMQNANxr9AZefABTFanxJv-Hw5U where EventId = '
			+ eventId + '  ORDER BY Time DESC LIMIT 20';
	var query = new google.visualization.Query(figure_data_server + '?tq='
			+ queryText);
	// Send the query with a callback function.
	query.send(WeibohandleQueryResponse);
}

/*
 * 显示微博
 */
function WeibohandleQueryResponse(response) {
	var hml = "";
	var data = response.getDataTable();
	for (i = 0; i < 12; i++) {
		hml += "<div class='weibo'>";
		hml += "<p class='user_name'>";
		hml += "<a href='http://weibo.com/u/" + data.getValue(i, 2) + "'>";
		hml += "@" + data.getValue(i, 3) + "</a>";
		if (data.getValue(i, 4) == 'true') {
			hml += "<img src='img/mingren.gif'/>";
		}
		hml += "&nbsp;say:</p>";
		var myReg = new RegExp("http://t.cn/\\w*");
		var newstr = data.getValue(i, 1);
		var execStr = myReg.exec(newstr);
		var str = newstr.replace(myReg, function(a) {
			return "<a href='" + a + "'>" + a + "</a>";
		});
		hml += "<p class='weibo_info'>&nbsp;&nbsp;" + str + "</p></div>";

	}
	$("#chart_small").html($("#chart_small").html() + hml);
}

var tabDrawFunc = {
	0 : getData,
	1 : getData2
};
