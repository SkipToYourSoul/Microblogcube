/**
 * Created with JetBrains WebStorm. User: Administrator Date: 13-7-30 Time:
 * 下午10:13 To change this template use File | Settings | File Templates.
 */

/**
 * 总是只能选择一条微博的转发树进行显示。
 */
/*
 * sigmal.js 实现微博传播图效果
 */var Set = {
	createNew : function() {
		var map = {};
		map.length = 0;
		map.key = null;
		map.add = function(mid) {
			this.length = this.length + 1;
			this[mid] = 1;
			if (this.key == null)
				this.key = mid;
		};
		map.del = function(mid) {
			this.length = this.length - 1;
			delete this[mid];
		};

		map.contains = function(mid) {
			return this.hasOwnProperty(mid);
		};
		map.isEmpty = function() {
			return this.length == 0;
		};
		map.keySet = function() {
			var set = [];
			for ( var key in this) {
				if (typeof this[key] != "function" && key != "length"
						&& key != "key") {
					set.push(key);
				}
			}
			return set;
		};
		return map;
	}
};

/**
 * 配置数据
 */
var ftable_data_server = config.get('ftable_data_server', '')
var figure_data_server = config.get('figure_data_server', '')
var sigInst = null;
var gData;
var isRunning = false;
var timeData;
var nodeId = Set.createNew();
var edgeId = new Array();

var colorArr = [ 'rgb(238,0,0)',/* red2 */
'rgb(255,255,0)',/* Yellow1 */
'rgb(187,255,255)', /* PaleTurquoise1 */
'rgb(255,160,122)', /* LightSalmon1 */
'rgb(238,216,174)', 'rgb(173,216,230)', 'rgb(175,238,238)', 'rgb(0,255,255)'/* Cyan1 */
];
var timeScale = 3600; /* 1 min */
var control = null;

var hasThisWeibo = true; // 用来决定点击微博是添加或是删除传播树

/*
 * function drawVisulization() 从meta表里找出事件id所在的具体数据表，转入findTable()函数中处理
 */
function drawVisulization() {
	var url = ftable_data_server + "?key=" + config.get("edge_index_key", "")
			+ "&typed=false&sql=";
	var queryText = 'SELECT DocId, key FROM '
			+ config.get("edge_index_docid", "") + ' WHERE EventID = '
			+ eventId;
	// var queryText = 'SELECT tableId FROM
	// 1_JXKqAV-ugCFGp548AV4ygYtBeKDxekVowTcv2M WHERE start <= '+ eventId + '
	// AND end <= ' + eventId;
	$.jsonp({
		url : url + queryText,
		callbackParameter : "callback",
		cache : true,
		success : findTable
	});
}

/*
 * function findTable() 获得具体的传播数据并传入handleJqueryData()函数中处理
 */
function findTable(mydata) {
	var row = mydata.rows[0];
	var url = ftable_data_server + "?key=" + row[1] + "&typed=false&sql=";
	var queryText = 'SELECT Retweetee,Retweeter,Time,RTMid FROM ' + row[0]
			+ ' WHERE RTMid = ' + preMid/* selWeibo.keySet()[len-1] */
			+ ';';
	$.jsonp({
		url : url + queryText,
		callbackParameter : "callback",
		cache : true,
		success : handleJqueryData
	});
}

/*
 * scaleSize() 返回的是点的size
 */
function scaleSize(min, cur) {
	if (Math.log(cur - min) < 1)
		return 1;
	return Math.log(cur - min);
}

/*
 * chooseColor() 根据点的时间选择其颜色
 */
function chooseColor(min, cur) {
	var gap = Math.log((cur - min) / timeScale + 1);
	gap = Math.floor(gap);
	return colorArr[gap % colorArr.length];
}

/*
 * getPubTime() 获得当前点的时间
 */
function getPubTime(node, defTime) {
	if (node.hasOwnProperty('time')) {
		return node['time'];
	}
	return defTime;
}

/*
 * drawControl() 画control拖动条
 */
function drawControl(Data) {
	// ControlWrapper
	if (control != null)
		$("filter_div").empty();

	control = new google.visualization.ControlWrapper({
		'controlType' : 'ChartRangeFilter',
		'containerId' : 'filter_div',
		'options' : {
			'filterColumnIndex' : 0,
			'ui' : {
				// 'chartType': 'LineChart',
				'snapToData' : true,
				'chartOptions' : {
					'chartArea' : {
						top : 5,
						left : 20,
						'width' : '95%',
						'height' : '40%'
					}
				},
				// 'state': {'range': {'start': new Date(2011, 4, 4), 'end':
				// new
				// Date(2011, 4, 5)}},
				'minRangeSize' : 60
			}
		// end ui
		},// end option
		'dataTable' : Data,
	// 'state': {'range': {'start': new Date(2011, 4, 4), 'end': new
	// Date(2012,
	// 4, 5)}}
	});

	control.draw(Data);
	google.visualization.events.addListener(control, 'statechange', function() {
		var state = control.getState();
		// 选择范围触发的处理函数
		range(state.range.start, state.range.end);
	});
}

/*
 * handleJqueryData() 数据处理主要函数 在该函数中对传播数据进行处理并根据sigmaJS的规则将点和边添加
 */
function handleJqueryData(data) {
	var timeAgg = new Object();
	gData = data;
	// draw the notes and edges
	var nodes = new Object();
	var minTime = new Date(2020, 1, 1);
	var edgeCount = 0;
	var nodeCount = 0;

	for ( var idx in data.rows) { // 遍历所有点，处理data数据
		row = data.rows[idx]; // 点的数据，包括source,target,time
		if (nodes.hasOwnProperty(row[0])) // 统计当前点是否有传播出去的消息，即source的数目
			nodes[row[0]]['count'] = nodes[row[0]]['count'] + 1
		else {
			nodes[row[0]] = {};
			nodes[row[0]]['count'] = 1;
		}
		var pubTime = new Date(row[2]); // 找到时间最早的点，将其时间存入minTime
		if (minTime > pubTime) {
			minTime = pubTime;
		}
		if (nodes.hasOwnProperty(row[1]) == false) // 找到当前source的target，并将它们的count设置为1
		{ // 若该target不再传播，即为叶子节点
			nodes[row[1]] = {};
			nodes[row[1]]['count'] = 1;
			nodes[row[1]]['time'] = pubTime.getTime() / 1000; // 最初的节点，即节点0是没有时间的
		}
		// 统计每个时间上的微博数
		if (timeAgg.hasOwnProperty(pubTime)) {
			timeAgg[pubTime] = timeAgg[pubTime] + 1;
		} else {
			timeAgg[pubTime] = 1;
		}
	} // end for

	// 对时间进行排序
	var sortedTime = [];
	for ( var time in timeAgg) {
		sortedTime.push(time);
	}

	sortedTime.sort(function(a, b) {
		var tA = new Date(a);
		var tB = new Date(b);
		return tA.getTime() - tB.getTime();
	});

	// 构造dataTable，用于controlWrapper提供数据
	timeData = new google.visualization.DataTable();
	// Declare columns
	timeData.addColumn('datetime', '日期');
	timeData.addColumn('number', '微博数');

	for ( var idx in sortedTime) {
		var time = sortedTime[idx];
		if (typeof timeAgg[time] != "function") {
			timeData.addRow([ new Date(time), timeAgg[time] ]);
		}
	}
	drawControl(timeData);

	for ( var key in nodes) { // 根据处理好的数据添加node
		var nodeSize = nodes[key]['count'];
		var node = {
			label : key,
			size : scaleSize(0, nodeSize),
			x : Math.random(),
			y : Math.random(),
			color : chooseColor(minTime.getTime() / 1000, getPubTime(
					nodes[key], minTime.getTime() / 1000))
		};
		sigInst.addNode(key, node);
		nodeCount++;
		if (!nodeId.contains(sigInst.getNodes(key).id))
			nodeId.add(sigInst.getNodes(key).id);
	}

	for ( var i = 0; i < data.rows.length; i++) {
		var edge = {
			id : edgeCount,
			sourceID : data.rows[i][0],
			targetID : data.rows[i][1],
			label : i,
			attributes : []
		};
		sigInst.addEdge(edgeCount, data.rows[i][0], data.rows[i][1]);
		// edgeId[currentRow].push(edgeCount);
		edgeCount++;
	}
	isRunning = true;
	document.getElementById('stop-layout').childNodes[0].nodeValue = 'Stop Layout';
	sigInst.startForceAtlas2();
} // end handleJqueryData

function stopLayout() {
	if (isRunning) {
		isRunning = false;
		sigInst.stopForceAtlas2();
		document.getElementById('stop-layout').childNodes[0].nodeValue = 'Start Layout';

		// event function
		sigInst.bind(
				'overnodes',
				function(event) {
					if (isRunning == false) {
						var nodes = event.content;
						var neighbors = {};
						sigInst.iterEdges(
								function(e) {
									if (nodes.indexOf(e.source) >= 0
											|| nodes.indexOf(e.target) >= 0) { // 找到该点相邻的边
										neighbors[e.source] = 1; // 标记处该点相邻的点，这里e.source或者e.target为相邻点id
										neighbors[e.target] = 1;
									}
								}).iterNodes(function(n) {
							if (!neighbors[n.id]) {
								n.hidden = 1; // 隐藏非相邻的点
							} else {
								n.hidden = 0;
							}
						}).draw(2, 2, 2);
					}
				}).bind('outnodes', function() {
			if (isRunning == false) {
				sigInst.iterEdges(function(e) {
					e.hidden = 0;
				}).iterNodes(function(n) {
					n.hidden = 0;
				}).draw(2, 2, 2);
			}
		})
		// end event
	} else {
		isRunning = true;
		sigInst.startForceAtlas2();
		document.getElementById('stop-layout').childNodes[0].nodeValue = 'Stop Layout';
	}
}
/*
 * handlebutton() 处理按钮功能
 */
function handlebutton() {
	document.getElementById('stop-layout').addEventListener('click',
			stopLayout, true);
	document.getElementById('rescale-graph').addEventListener('click',
			function() {
				sigInst.position(0, 0, 1).draw();
			}, true);
}

/*
 * range() 根据control上的两个时间节点显示相应的在该时间范围里的点
 */
function range(start, end) {
	var a = new Object();
	sigInst.iterNodes(function(n) {
		n.hidden = 0;
	});
	for ( var x in gData.rows) {
		row = gData.rows[x];
		var myDate = new Date(row[2]);
		if (myDate < start || myDate > end) {
			a[row[1]] = 1;
		}
	}
	sigInst.iterNodes(function(n) {
		if (a.hasOwnProperty(n.id)) {
			n.hidden = 1;
		}
	});
	if (isRunning == true)
		sigInst.startForceAtlas2();
	else
		sigInst.draw(2, 2, 2);
}

/*
 * init() 程序的入口 初始化函数，初始化sigInst
 */
function init() {
	// Instanciate sigma.js and customize it :
	sigInst = sigma.init(document.getElementById('sigma-example'))
			.drawingProperties({
				defaultLabelColor : 'white',
				defaultLabelSize : 14,
				defaultLabelBGColor : '#fff',
				defaultLabelHoverColor : 'red',
				labelThreshold : 6,
				defaultEdgeType : 'line'
			}).graphProperties({
				minNodeSize : 0.5,
				maxNodeSize : 5,
				minEdgeSize : 1,
				maxEdgeSize : 1,
				sideMargin : 10
			}).mouseProperties({
				maxRatio : 32
			// 能放大的最大比例
			});
	SetWeibo();
	handlebutton();
} // end function

/*
 * SetWeibo() 查询微博内容的数据
 */
function SetWeibo() {
	var queryText = 'SELECT Mid,Text,Uid,Uname,IsV FROM 1TojNpEQ0fqifhMQNANxr9AZefABTFanxJv-Hw5U where EventId = '
			+ eventId + '  ORDER BY Uid DESC LIMIT 10';
	var query = new google.visualization.Query(figure_data_server + '?tq='
			+ queryText);
	// Send the query with a callback function.
	query.send(WeibohandleQueryResponse);
}

/*
 * WeibohandleQueryResponse() 动态生成微博
 */
function WeibohandleQueryResponse(response) {
	var data = response.getDataTable();
	weiboChosenMid = data.getValue(0, 0);
	var hml = "";
	for (i = 0; i < 7 & i < data.getNumberOfRows(); i++) {
		// edgeId[i] = new Array();
		// edgeId[i].push(data.getValue(i,0));}
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
		hml += "<p class='weibo_info' onclick='weiboChosen("
				+ data.getValue(i, 0) + ");' mid='" + data.getValue(i, 0)
				+ "'>&nbsp;&nbsp;" + str + "</p></div>";
	}
	$("#chart_small").html($("#chart_small").html() + hml);
	weiboChosen(weiboChosenMid);
	// drawVisulization();
}

var preMid = null;
/*
 * weiboChosen() 选择微博函数
 */
function weiboChosen(selMid) {
	if (preMid == selMid)
		return;
	if (preMid != null) {
		if (isRunning)
			stopLayout();
		$("div.weibo p[mid=" + preMid + "]").parent().css("background-color",
				"#f7f6f6");
	}
	preMid = selMid;
	$("div.weibo p[mid=" + preMid + "]").parent().css("background-color",
			"#FFFFF0");
	// alert(content);

	deleteNodes();
	drawVisulization(preMid);
}

/*
 * deleteNodes() 删除转发树函数
 */
function deleteNodes() {
	var keys = nodeId.keySet();
	for ( var x in keys) {
		sigInst.dropNode(keys[x]);
	}
	nodeId = Set.createNew();
}
