/**
 * Created with JetBrains WebStorm. User: Tong Date: 13-8-1 Time: 下午1:51 To
 * change this template use File | Settings | File Templates.
 */
var key = config.get("primary_store_key", "");
google.load('visualization', '1.1', {
	packages : [ 'corechart', 'controls' ]
});
google.setOnLoadCallback(drawChart);
function drawChart() {
	drawDashboard();
	setWeibo();
	selKeyword();
}

var ftable_data_server = config.get('ftable_data_server', '')
var figure_data_server = config.get('figure_data_server', '')

function drawDashboard() {
	var queryText = 'SELECT Time, Count, Mood FROM 1I73fPA6pwIH8QX57IDijMHOI43oB7Nj3MKT2TSg where eventId = '
			+ eventId + ' and Time> \'2011-6-1\' order by Time';
	var query = new google.visualization.Query(ftable_data_server + '?key='
			+ key + '&typed=false&sql=' + queryText);
	// Send the query with a callback function.
	var url = ftable_data_server + "?key=" + key + "&typed=false&sql=";
	$.jsonp({
		url : url + queryText,
		callbackParameter : "callback",
		cache : true,
		success : handleQueryResponse
	});
}

function handleQueryResponse(jdata) {
	// prepare the data

	var data = parseData(jdata, [ [ 'datetime', '时间' ], [ 'number', '数量' ],
			[ 'string', '心情' ] ]);

	finally_data = new google.visualization.DataTable();
	finally_data.addColumn('date', 'Date');
	finally_data.addColumn('number', '悲伤');
	finally_data.addColumn('number', '愤怒');
	finally_data.addColumn('number', '惊奇');
	finally_data.addColumn('number', '恐惧');
	finally_data.addColumn('number', '快乐');

	for ( var i = 0; i < data.getNumberOfRows(); i++) {
		if (data.getValue(i, 2) == '悲伤') {
			finally_data.addRow([ data.getValue(i, 0), data.getValue(i, 1), 0,
					0, 0, 0 ]);
		}
		if (data.getValue(i, 2) == '愤怒') {
			finally_data.addRow([ data.getValue(i, 0), 0, data.getValue(i, 1),
					0, 0, 0 ]);
		}
		if (data.getValue(i, 2) == '惊奇') {
			finally_data.addRow([ data.getValue(i, 0), 0, 0,
					data.getValue(i, 1), 0, 0 ]);
		}
		if (data.getValue(i, 2) == '恐惧') {
			finally_data.addRow([ data.getValue(i, 0), 0, 0, 0,
					data.getValue(i, 1), 0 ]);
		}
		if (data.getValue(i, 2) == '快乐') {
			finally_data.addRow([ data.getValue(i, 0), 0, 0, 0, 0,
					data.getValue(i, 1) ]);
		}
	}

	// alert(data.K.length);
	draw();

}// end drawDashboard

function draw() {
	// dashboard
	var dashboard = new google.visualization.Dashboard(document
			.getElementById('moodline'));
	// ControlWrapper
	var control = new google.visualization.ControlWrapper({
		'controlType' : 'ChartRangeFilter',
		'containerId' : 'moodline_filter',
		'options' : {
			'filterColumnIndex' : 0,
			'ui' : {
				'chartType' : 'LineChart',
				'snapToData' : true,
				'chartOptions' : {
					'chartArea' : {
						left : 50,
						'width' : '90%',
						'height' : '90%'
					},
					'hAxis' : {
						'baselineColor' : 'none',
						'textPosition' : 'in',
						'textStyle' : {
							'fontSize' : '12'
						}
					},
					'enableInteractivity' : true
				},
				'chartView' : {
					'columns' : [ 0, 1 ]
				},
				'minRangeSize' : 86400000
			}
		// end ui
		}
	// end option
	// 'state': {'range': {'start': new Date(2011, 6, 26), 'end': new
	// Date(2012, 5, 27)}}
	});
	// ChartWrapper
	var chart = new google.visualization.ChartWrapper({
		'chartType' : 'LineChart',
		'containerId' : 'moodline_chart',
		'options' : {
			'chartArea' : {
				top : 30,
				left : 50,
				'height' : '80%',
				'width' : '90%'
			},
			// 'title':'eventTimeSeries_GUOMeimei',
			'titlePosition' : 'in',
			'tooltip' : {
				'showColorCode' : false
			},
			// curveType: "function", //线段光滑
			'legend' : {
				'position' : 'top',
				'alignment' : 'start',
				'textStyle' : {
					fontSize : 12,
					fontName : 'shit',
					color : 'black'
				}
			}, // end legend
			'focusTarget' : 'datum',
			'fontSize' : '12',
			'lineWidth' : 1,
			'pointSize' : 2,
			// 'reverseCategories': false,
			'series' : {
				0 : {
					color : 'blue',
					visibleInLegend : true
				},
				1 : {
					color : 'red',
					visibleInLegend : true
				}
			}, // 每一条线属性的设置
			'hAxis' : {
				'slantedText' : false, // 倾斜字体
				'baselineColor' : 'black',
				'direction' : '1',
				// 'format': 'yyyy.MM.dd' ,
				'gridlines' : {
					color : 'none'
				},
				'minorGridlines' : {}, // 次要刻度
				'logScale' : false,
				'textPosition' : 'in',
				/*
				 * 'title' : 'Date', 'titleTextStyle' :{color: 'red'}
				 */
				'allowContainerBoundaryTextCufoff' : true,
				'maxAlternation' : 1, // text最大重叠层数
				'interpolateNulls' : false
			},// end of hAxis
			'vAxis' : {
				/* 'viewWindow': {'min': 0, 'max': 60000} */
				'gridlines' : {
					count : 5
				},
				'allowContainerBoundaryTextCufoff' : true
			}
		// end of vAxis
		}
	// end option
	});
	dashboard.bind(control, chart);
	dashboard.draw(finally_data);
}

function setWeibo() {
	var queryText = 'SELECT Mid,Text,Uid,Uname,IsV FROM 1qZRnsuiJ_iaUaNSn_rNFTZLLrzA2lIUCQOJeauk where EventId = '
			+ eventId + ' AND Mood=\'厌恶\'  ORDER BY Uid desc LIMIT 10';
	var query = new google.visualization.Query(figure_data_server + '?tq='
			+ queryText);
	// Send the query with a callback function.
	var url = ftable_data_server + "?key=" + key + "&typed=false&sql=";
	query.send(WeibohandleQueryResponse);
}

function WeibohandleQueryResponse(response) {
	jData = dataTableAdapter(response.getDataTable());

	var hml = "";
	for (i = 0; i < jData.rows.length; i++) {
		var row = jData.rows[i];
		hml += "<div class='weibo'>";
		hml += "<p class='user_name'>";
		hml += "<a href='http://weibo.com/u/" + row[2] + "'>";
		hml += "@" + row[3] + "</a>";
		if (row[4] == 'true' || row[4] == true) {
			hml += "<img src='img/mingren.gif'/>";
		}
		hml += "&nbsp;say:</p>";
		var myReg = new RegExp("http://t.cn/\\w*");
		var newstr = row[1];
		var execStr = myReg.exec(newstr);
		var str = newstr.replace(myReg, function(a) {
			return "<a href='" + a + "'>" + a + "</a>";
		});
		hml += "<p class='weibo_info'>&nbsp;&nbsp;" + str + "</p></div>";

	}
	$("#chart_small").html($("#chart_small").html() + hml);
}

function selKeyword() {
	var queryText = 'SELECT Term,sum(TF_IDF) FROM '
			+ config.get('tf_idf_docid', '') + ' where EventID = ' + eventId
			+ ' group by Term order by sum(TF_IDF) desc;';
	var query = new google.visualization.Query(figure_data_server + '?tq='
			+ queryText);
	// Send the query with a callback function.
	var url = ftable_data_server + "?key=" + config.get('tf_idf_key', '')
			+ "&typed=false&sql=";
	query.send(drawKWCloud);
}

function transKWData(dataTable) {

}
/**
 * Created with JetBrains WebStorm. User: Tong Date: 13-8-5 Time: 下午6:18 To
 * change this template use File | Settings | File Templates.
 */
var fill = d3.scale.category20();
function cloudScale(freq, min, range) {
	return (70 / range) * (freq - min) + 10;
}
var angle = [ 0, 90 ];
function drawKWCloud(response) {
	var jData = dTableToArray(response.getDataTable());
	var min = jData[jData.length - 1][1];
	var range = jData[0][1] - min;
	if (range == 0)
		range = min;
	var fontSize = d3.scale.log().range([ 10, 200 ]);
	d3.layout.cloud().size([ 654, 400 ]).words(jData.map(function(d) {
		return {
			text : d[0],
			size : cloudScale(d[1], min, range)
		};
	})).padding(5).rotate(function() {
		// return ~~(Math.random() * 2) * (Math.random() * 180 - 90);
		var idx = Math.floor(Math.random() + 0.3);
		return ~~(angle[idx]);
	}).font("Impact").fontSize(function(d) {
		return d.size;
	}).on("end", draw_cloud).start();
}
/**
 * 云图关键词的搜索功能，使用百度搜索
 */
function kwsearch() {
	window.open("http://news.baidu.com/ns?cl=2&rn=20&tn=news&word="
			+ $("#keyword:text").get(0).value + "&ie=utf-8");
}
function draw_cloud(words) {
	d3.select("#cloud_chart").append("svg").attr("width", 654).attr("height",
			400).append("g").attr("transform", "translate(327,200)").selectAll(
			"text").data(words).enter().append("text").style("font-size",
			function(d) {
				return d.size + "px";
			}).style("font-family", "Impact").style("fill", function(d, i) {
		return fill(i);
	}).attr("text-anchor", "middle").attr("transform", function(d) {
		return "translate(" + [ d.x, d.y ] + ")rotate(" + d.rotate + ")";
	}).text(function(d) {
		return d.text;
	}).on("click", function(d) {
		$("#keyword:text").val(function(n, c) {
			return d.text;
		});
	});
}
