/**
 * Created with JetBrains WebStorm. User: Administrator Date: 13-9-25 Time:
 * 下午12:17 To change this template use File | Settings | File Templates.
 */

/*
 * cluster.js 实现用户关系聚类图效果
 */

var Graph = {
	createNew : function() {
		var graph = {};

		graph.nodeAdj = {};
		graph.nodeNum = 0; // cache the node size
		graph.nodeWeight = {};
		graph.nodeSelfWeight = {};
		graph.edges = {};
		graph.edgeNum = 0; // cache the edge num, exclude self loops
		graph.totalWeight = 0;
		graph.addEdge = function(id, start, end, weight) {
			if (this.existEdge(start, end))
				return
			this.totalWeight += weight;
			if (start == end) {
				this.nodeSelfWeight[start] = weight;
				this.insertNode(start, weight);
			} else {
				this.edgeNum++;
				this.edges[id] = [ id, start, end, weight ];
				this.installNodeEdge(start, id, end, weight);
				this.installNodeEdge(end, id, start, weight);
			}
		}
		graph.existEdge = function(start, end) {
			if (this.nodeAdj.hasOwnProperty(start)
					&& this.nodeAdj[start].hasOwnProperty(end))
				return true;
			return false;
		}
		graph.insertNode = function(node, w) {
			if (!this.nodeAdj.hasOwnProperty(node)) {
				this.nodeAdj[node] = {};
				this.nodeNum++;
				this.nodeWeight[node] = 0.0;
			}
			this.nodeWeight[node] += w;
		}
		graph.installNodeEdge = function(node, edgeID, end, weight) {
			this.insertNode(node, 0);
			if (!this.nodeAdj[node].hasOwnProperty(end)) {
				this.nodeAdj[node][end] = edgeID;
				this.nodeWeight[node] += weight;
			}
		}
		graph.getSelfWeight = function(node) {
			if (this.nodeSelfWeight.hasOwnProperty(node))
				return this.nodeSelfWeight[node];
			else
				return 0.0;
		}
		graph.getTotalWeight = function() {
			return this.totalWeight;
		}
		graph.nodeArr = function() {
			var temp = [];
			for ( var key in this.nodeAdj)
				temp.push(key);
			return temp;
		}
		/*
		 * 直接返回nodeAdj?这样可以避免一个loop
		 */
		graph.nodes = function() {
			/*
			 * modify: xiafan var temp = []; for(var key in this.nodeAdj)
			 * temp.push(key); return temp;
			 */
			return this.nodeAdj;
		}
		// 修改了输出格式，之后注意 nei_node -> edge
		graph.neighbours = function(node) {
			var neighbour = {};
			for ( var key in this.nodeAdj[node]) {
				temp = this.nodeAdj[node][key];
				neighbour[key] = temp;
			}
			return neighbour;
		}
		graph.neighWeight = function(node) {
			return this.nodeWeight[node];
		}
		graph.getEdge = function(id) {
			return this.edges[id];
		}
		graph.nodeSize = function() {
			/*
			 * var count = 0; for(n in this.nodeAdj){
			 * if(this.nodeAdj.hasOwnProperty(n)) count++; } return count;
			 */
			return this.nodeNum;
		}
		graph.edgeSize = function() {
			/*
			 * var count = 0; for(n in this.edges){
			 * if(this.edges.hasOwnProperty(n)) count++; } return count;
			 */
			return this.edgeNum;
		}

		return graph;
	}
};

var Community = {
	createNew : function(graph, min_modularity, minC, maxLevel) {
		var comm = {};

		comm.g = graph;
		comm.min_modularity = min_modularity;
		comm.minC = minC;
		comm.maxLevel = maxLevel;
		comm.n2c = {};
		comm.tot = {};
		comm.inw = {};
		comm.neigh_weight = {};
		comm.neigh_last = 0;
		comm.neigh_pos = {};

		comm.clone=function(){
			var ret = Community.createNew(this.g, this.min_modularity, this.minC, this.maxLevel);
			$.extend(ret.n2c, this.n2c);
			$.extend(ret.tot, this.tot);
			$.extend(ret.inw, this.inw);
			$.extend(ret.neigh_weight, this.neigh_weight);
			$.extend(ret.neigh_last, this.neigh_last);
			$.extend(ret.neigh_pos, this.neigh_pos);
			return ret;
		}
		comm.init_comm = function() {
			for ( var key in this.g.nodes()) {
				// var node = this.g.nodes()[key];
				var node = key;
				this.n2c[node] = node;
				this.tot[node] = this.g.neighWeight(node);
				this.inw[node] = this.g.getSelfWeight(node);
				this.neigh_weight[node] = -1;
			}
		}
		comm.modularity_gain = function(node, comm, dnodecomm, w_degree) {
			var totc = this.tot[comm];
			m2 = this.g.getTotalWeight() * 2;
			return dnodecomm - totc * w_degree / (m2);
		}
		comm.remove = function(node, comm, dnodecomm) {
			this.tot[comm] -= this.g.neighWeight(node);
			this.inw[comm] -= 2 * dnodecomm + this.g.getSelfWeight(node);
			this.n2c[node] = -1;
		}
		comm.insert = function(node, comm, dnodecomm) {
			this.tot[comm] += this.g.neighWeight(node);
			this.inw[comm] += 2 * dnodecomm + this.g.getSelfWeight(node);
			this.n2c[node] = comm;
		}
		comm.modularity = function() {
			var q = 0;
			m2 = this.g.getTotalWeight() * 2;
			for ( var key in this.g.nodes()) {
				// var node = this.g.nodes()[key];
				var node = key;
				if (this.tot[node] > 0)
					q += this.inw[node] / m2 - (this.tot[node] / m2)
							* (this.tot[node] / m2);
			}
			return q;
		}
		comm.neigh_comm = function(node) {
			for ( var i = 0; i < this.neigh_last; i++)
				this.neigh_weight[this.neigh_pos[i]] = -1;
			this.neigh_last = 0;
			this.neigh_pos[0] = this.n2c[node];
			this.neigh_weight[this.neigh_pos[0]] = 0;
			this.neigh_last = 1;
			var neighbour = this.g.neighbours(node);
			for ( var key in neighbour) {
				edge = this.g.getEdge(neighbour[key]);
				neigh_comm = this.n2c[key];
				neigh_w = edge[3];
				if (neighbour[key] != node) {
					if (this.neigh_weight[neigh_comm] == -1) {
						this.neigh_weight[neigh_comm] = 0;
						this.neigh_pos[this.neigh_last] = neigh_comm;
						this.neigh_last += 1;
					}
					this.neigh_weight[neigh_comm] += neigh_w;
				}
			}
		}
		comm.oneLevel = function() {
			var improvement = false;
			var nb_moves = 0;
			var nb_pass_done = 0;
			var new_mod = this.modularity();
			var size = this.g.nodeSize();

			var random_order = [];
			for ( var key in this.g.nodes()) {
				// var node = this.g.nodes()[key];
				var node = key;
				random_order.push(node);
			}

			// 对node列表进行随机排列，算法变成了随机算法。
			for ( var i = 0; i < size; i++) {
				var random_pos = Math.floor(Math.random() * (size - i - 1)) + i;
				var tmp = random_order[i];
				random_order[i] = random_order[random_pos];
				random_order[random_pos] = tmp;
			}
			var cont = true;
			while (cont) {
				var cur_mod = new_mod;
				nb_moves = 0;
				nb_pass_done += 1;
				for ( var node_tmp = 0; node_tmp < size; node_tmp++) {
					var node = random_order[node_tmp];
					var node_comm = this.n2c[node];
					var w_degree = this.g.neighWeight(node);
					this.neigh_comm(node);
					this.remove(node, node_comm, this.neigh_weight[node_comm]);
					var best_comm = node_comm;
					var best_nblinks = 0;
					var best_increase = 0;
					for ( var i = 0; i < this.neigh_last; i++) {
						var increase = this.modularity_gain(node,
								this.neigh_pos[i],
								this.neigh_weight[this.neigh_pos[i]], w_degree);
						if (increase > best_increase) {
							best_comm = this.neigh_pos[i];
							best_nblinks = this.neigh_weight[this.neigh_pos[i]];
							best_increase = increase;
						}
					}
					var test_mod = this.modularity();
					this.insert(node, best_comm, best_nblinks);
					if (best_comm != node_comm)
						nb_moves += 1;
				}
				new_mod = this.modularity();
				if (nb_moves > 0)
					improvement = true;
				if (improvement && (new_mod - cur_mod) > this.min_modularity)
					cont = true;
				else
					cont = false;
			}
			return improvement;
		}
		comm.printCommunity = function() {
			var temp = {};
			for ( var key in this.g.nodes()) {
				// var node = this.g.nodes()[key];
				var node = key;
				temp[node] = this.n2c[node];
			}
		}
		comm.getNextCommTask = function(edgeCount) {
			var newEdgeMap = {};
			for ( var key in this.g.nodes()) {
				// var node = this.g.nodes()[key];
				var node = key;
				var neighbour = this.g.neighbours(node);
				for ( var edgePair in neighbour) {
					var edge = this.g.getEdge(neighbour[edgePair]);
					var oCluster = this.n2c[edgePair];
					var newNode = [ this.n2c[node], oCluster ];
					if (newEdgeMap.hasOwnProperty(newNode))
						newEdgeMap[newNode] += edge[3];
					else
						newEdgeMap[newNode] = edge[3];
				}
			}
			var graph = Graph.createNew();
			var i = edgeCount + 1;
			for ( var key in newEdgeMap) {
				var start = "";
				var end = "";
				var count;
				for ( var i = 0; i < key.length; i++) {
					if (key[i] == ',')
						count = i;
				}
				start = key.substring(0, count);
				end = key.substring(count + 1, 1000);
				var weight = newEdgeMap[key];
				graph.addEdge(i, start, end, weight);
				i++;
			}
			var com = Community.createNew(graph, this.min_modularity,
					this.minC, this.maxLevel);
			return com;
		}
		comm.clusterSize = function() {
			var cluster = {};
			for ( var node in this.n2c) {
				var clus = this.n2c[node];
				if (!cluster.hasOwnProperty(clus))
					cluster[clus] = 1;
			}
			var count = 0;
			for ( var key in cluster) {
				count++;
			}
			return count;
		}
		comm.startCluster = function() {
			this.init_comm();
			this.oneLevel();
			
			var edgeCount = 0;
			var curTask = this;
			var i = 1;
			var minCom = curTask.clone();
			var minGap = Math.abs(curTask.clusterSize() - this.minC);
			while (minGap > 2 && i++ < 5) {
				curTask.init_comm();
				curTask.oneLevel();
				var gap = Math.abs(curTask.clusterSize() - this.minC);
				if (gap < minGap){
					minCom = curTask.clone();
					minGap = gap;
				}
			}
			
			var cMapChain = [];
			curTask=minCom;
			this.n2c = minCom.n2c;
			cMapChain.push(minCom.n2c);
			
			while (curTask.clusterSize() > this.minC && i < this.maxLevel) {
				curTask.printCommunity();
				edgeCount += this.g.edgeSize();
				curTask = curTask.getNextCommTask(edgeCount);
				curTask.init_comm();
				curTask.oneLevel();
				var gap = Math.abs(curTask.clusterSize() - this.minC);
				if (gap > minGap){
					break;
				}
				cMapChain.push(curTask.n2c);
				i++;
			}
			
			
			var lastMap = cMapChain.pop();
			while (cMapChain.length > 0) {
				var topMap = lastMap;
				lastMap = cMapChain.pop();
				for ( var key in lastMap) {
					if (topMap.hasOwnProperty(lastMap[key]))
						lastMap[key] = topMap[lastMap[key]];
				}
			}
			return lastMap;
			// nodeToComm = lastMap;
			// curTask.printCommunity();
		}

		return comm;
	}
};

var ftable_data_server=config.get('ftable_data_server','')
var sigInst = null;

// 用户信息对象
/**
 * 可能的字段： imgUrl friendcount followerscount ... ---------- datastate:
 * 社交网络爬取状态，crawling,crawled lastCrawlSate: date; 上一次爬取时间
 */
var userInfo = {
	"crawl" : "uncrawled"
};
var langMap={};
function initLang(){
	var language_en_us = "en-us";  
	var language_zh_cn = "zh-cn";  
	// currentLang = navigator.language;
	currentLang= "zh-cn"; 
	// if(!currentLang)
	  // currentLang = navigator.browserLanguage;
	if(currentLang.toLowerCase() == language_zh_cn)  
	{  
		langMap = ClusterPanel.zn; 
	}  
	else  
	{ 
		langMap = ClusterPanel.en; 	
	}  
	
	$("input#sbtn").val(langMap.header_search);
	$("title").html(langMap.title);
	$("p#panel").html(langMap.title);
	$("input#stop-layout").val(langMap.control_stoplayout);
	$("input#rescale-graph").val(langMap.control_centering);
	$("input#detect").val(langMap.control_cluster);
	$("label#control_cnum").html(langMap.control_cnum);
	
	$("input#account_logout").val(langMap.account_logout);
	
	$("div#uinfo_header").html(langMap.uinfo_header);
	$("div#uinfo_content").html(langMap.uinfo_content);
	$("div#cluster_header").html(langMap.cluster_header);
	//$("div#cloud_title").html(langMap.cloud_title);
	//$("label#keyword_label").html(langMap.keyword_label);
	//$("input#cloud_go").val(langMap.cloud_go);
}
function init() {
	initLang();
	$("a#signin").attr('href',config.get('userinfo_server','')+"account/signin");
	$("input#logout").click(logout);
	sigInst = sigma.init(document.getElementById('sigma-example'))
			.drawingProperties({
				defaultLabelColor : 'black',
				defaultLabelSize : 14,
				defaultLabelBGColor : '#FFFAF0',
				defaultLabelHoverColor : 'red',
				labelThreshold : 6,
				defaultEdgeType : 'line'
			}).graphProperties({
				minNodeSize : 1,
				maxNodeSize : 10,
				minEdgeSize : 1,
				maxEdgeSize : 1,
				sideMargin : 10
			}).mouseProperties({
				maxRatio : 32
			});
	handlebutton();
	if (params.hasOwnProperty('login') && params['login']=='true') {
		displayUserInfo();
	}
	// test();
}

var timeerId = null;
/**
 * 数据爬取相关函数
 */

/**
 * 以jsonp协议进行通信
 */
function jsonpQ(url, func){
	// var url = "http://localhost:11080/userinfo/datastate";
	xhr = $.ajax({
		"url" : url,
		"async" : false,
		"dataType" : "jsonp",
		callbackParameter: "callback",
		"success" : function(json) {
			func(json);
		},
	});
}

function logoutReply(json){
	if (json.state=="err"){
		alert(json.result.error);
	} else {
		userInfo = {
				"crawl" : "uncrawled"
			};
		$("#uinfo_content").html(langMap.uinfo_content);
	}
}

function logout(){
	var url = config.get('userinfo_server',"")+"account/logout";
	jsonpQ(url, logoutReply);	
}


var crawlTimer=null;


var count = 0;
/**
 * 检查爬取状态的服务器回调函数
 * 
 * @param json
 */
function checkCrawlState_i(json){
	if (json.state=="ok") {
		// var preState = userInfo['crawl'];
		userInfo['crawl'] = json.result.dataState;
		if (userInfo['crawl']=='uncrawled'){
			alert(langMap.crawl_crawling);
			var url = config.get('userinfo_server',"")+"crawl";
			userInfo['crawl']="crawling";
			jsonpQ(url, crawlReply);
		} else if (userInfo['crawl']=='crawling') {
			if (timeerId == null) {
				// 前台界面想用户显示当前正在爬取数据
				timeerId = window.setInterval(displayCrawlState, 10000); // 60秒检查一次状态
			}
		} else if (userInfo['crawl']=='crawled') {
			if (crawlTimer != null){
				  window.clearInterval(crawlTimer);
				  crawlTimer=null;
			}
			displayCrawlState();
			if (!userInfo.hasOwnProperty('uid')){
				displayUserInfo();
			}
			if (isRunning == true)
				return;
			if (G == null) {
				querySocialSubGraphData();
			} else {
				stopLayout();
				deleteNodes();
				drawComm_intern(G);
			}
		}
	}	else {
		userInfo['crawl'] = "crawling";
		alert(json.result.error);
	}
}
var timmerId = null;
function displayCrawlState() {
	count++;
	count = count % 36;
	if (userInfo['crawl'] == "crawled") {
		if (timmerId != null) {
			window.clearInterval(timeerId);
			timeerId=null;
		}
		$("#datastate").html(langMap.crawl_crawled);
	} else if(userInfo['crawl'] == "crawling"){
		html = langMap.crawl_crawling;
		for (i = 0; i < count; i++)
			html += ".";
		$("#datastate").html(html);
	} else {
		// 爬取数据
	}
}
/**
 * 调用爬取数据接口的回调函数
 * 
 * @param json
 */
function crawlReply(json){
	if (json.state=="ok"){
		userInfo['crawl'] ="crawling";
		if (crawlTimer == null){
			crawlTimer = window.setInterval(function (){
				var url=config.get('userinfo_server',"")+"userinfo/datastate"; 
				jsonpQ(url,checkCrawlState_i);}, 60000);
			
		}
		if (timeerId == null) {
			// 前台界面想用户显示当前正在爬取数据
			timeerId = window.setInterval(displayCrawlState, 10000); // 60秒检查一次状态
		}
	}else {
		alert(json.result.error);
		userInfo['crawl'] ="uncrawled";
		if (timmerId != null) {
			window.clearInterval(timeerId);
			timeerId=null;
		}
		if (crawlTimer != null) {
			window.clearInterval(crawlTimer);
			crawlTimer=null;
		}
	}
	displayCrawlState();
}
/**
 * 相应服务器返回的用户信息
 * 
 * @param json
 */
function displayUserInfo_i(json){
	if (json.state=="ok") {
		userInfo['uid'] = json.result.id;
		userInfo['uname'] = json.result.name;
		userInfo['imgUrl'] = json.result.avatar_hd;
	}else {
		alert(json.result.error);
		return;
	}
	
	var html = "<img src='" + userInfo['imgUrl']+"' style='width:50px;height:50px'/>" ;
	html +=userInfo['uname'] + "<br/>";
	if (json.result.verified){
		html +="验证用户："+json.result.verified_reason +"<br/>";
	}
	$("#uinfo_content").html(html);
}

function displayUserInfo() {
	var url = config.get('userinfo_server',"")+"userinfo/userinfo";
	jsonpQ(url, displayUserInfo_i);	
}

var isRunning = false;
function stopLayout() {
	isRunning = false;
	sigInst.stopForceAtlas2();
	document.getElementById('stop-layout').value = langMap.control_startlayout;
}
function startLayout() {
	isRunning = true;
	sigInst.startForceAtlas2();
	document.getElementById('stop-layout').value = langMap.control_stoplayout;
}
function handlebutton() {
	document.getElementById('stop-layout').addEventListener('click',
			function() {
				if (isRunning) {
					stopLayout();
				} else {
					startLayout();
				}
			}, true);
	document.getElementById('rescale-graph').addEventListener('click',
			function() {
				sigInst.position(0, 0, 1).draw();
			}, true);
}

var nodeId = null;
/*
 * deleteNodes() 删除转发树函数
 */
function deleteNodes() {
	if (nodeId == null) {
		nodeId = [];
		sigInst.iterNodes(function(n) {
			nodeId.push(n.id);
		});
	}
	for ( var x in nodeId) {
		sigInst.dropNode(nodeId[x]);
	}
}

var G = null;
/**
 * 聚类按钮触发的动作
 */
function drawComm() {
	// if (!isCrawlCompleted())
	// return;
	if (G == null){
		var url = config.get('userinfo_server',"")+"userinfo/datastate";
		jsonpQ(url, checkCrawlState_i);	
	} else {
		if (isRunning)
			return;
		stopLayout();
		deleteNodes();
		drawComm_intern(G);
	}
}

/**
 * 查询数据函数，以后也许需要换接口
 */
function querySocialSubGraphData1() {
	var url = ftable_data_server+"?key=AIzaSyD05csCTRNM5I7CYHkbxCeQJF0UKRs1bVA&typed=false&sql=";
	var queryText = 'SELECT Source,Target FROM 1WznT0oM51Mmf1Pr2wjXxuES9Pw4Cg2B7M3F0G-w';
	$.getJSON(url + queryText, {}, handleSocialSubGraphData);
}

function querySocialSubGraphData2() {
	jsonpQ(url = config.get('userinfo_server',"")+"userinfo/socialgraph", handleSocialSubGraphData2);
}
function handleSocialSubGraphData2(data){
	if (data.state== "ok")
		handleSocialSubGraphData(data.result);
	else {
		alert("query social subgraph fails; reason:"+data.result.error);
	}
}
function querySocialSubGraphData() {
	querySocialSubGraphData2();
}

function handleSocialSubGraphData(data) {
	G = Graph.createNew();
	var count = 1;
	for ( var idx in data.rows) {
		row = data.rows[idx];
		G.addEdge(count, row[0], row[1], 1);
		count++;
	}
	drawComm_intern(G);
}
function productRange(a,b) {
  var product=a,i=a;
 
  while (i++<b) {
    product*=i;
  }
  return product;
}
	 
function combinations(n,k) {
  if (n==k) {
    return 1;
  } else {
    k=Math.max(k,n-k);
    return productRange(k+1,n)/productRange(1,n-k);
  }
}
var clusterArr = null;
var clusters = [];
function drawClusters() {
	cInternEdgeNum={};
	for (var id in G.edges){
		edge = G.edges[id];
		startC = nodeToComm[edge[1]];
		endC = nodeToComm[edge[2]];
		if (startC == endC){
			if (cInternEdgeNum.hasOwnProperty(startC))
				cInternEdgeNum[startC]+=edge[3];
			else
				cInternEdgeNum[startC]=edge[3]+0.0;
		}
	}
	cNodeNum={}
	for (var node in G.nodes()){
		cluster = nodeToComm[node];
		if (cNodeNum.hasOwnProperty(cluster))
			cNodeNum[cluster]+=1;
		else
			cNodeNum[cluster]=1;
	}
	
	var hml = "<div class='sp_item'><input type= 'button' value='"+langMap.cluster_all+"' onclick='chooseCluster(this)'/><br/></div>";
	for (i = 0; i < clusterArr.length; i++) {
		cluster = clusterArr[i];
		oCluster=transClusterMap[cluster];
		expectNum=combinations(cNodeNum[oCluster],2);
		hml += "<div class = 'sp_item'><input type= 'button' value='"
				+ cluster
				+ "' onclick='chooseCluster(this)' style='background:"
				+ clusters[i]['color']+";'/><label>|"+
				(cInternEdgeNum[oCluster]/expectNum)
				+"</label><br/></div>";
	}
	$("div#clusters").html(hml);
}

var nodeToComm = {};

/*
 * add by Liye
 */
var colorArray = ['rgb(255,255,0)','rgb(0,255,0)','rgb(0,0,255)','rgb(255,0,0)',
					'rgb(160,32,140)','rgb(0,139,139)','rgb(255,52,179)','rgb(255,69,0)','rgb(139,105,105)','rgb(100,105,105)'];

/**
 * p = (alpha-1)(x)^(-alpha) choosing alpha = 2 p = (x)^(-2)
 * 
 * @param node
 * @returns {Number}
 */
function changeNodeSize(node) {
	var countOfFans = G.nodeWeight[node];
	// var size = Math.log(countOfFans)/ Math.LN10;
	// var p =1- Math.pow(countOfFans, -2);
	var size = (countOfFans-2)/100 +0.1;
	if (size > 1)
		size = 1;
	return size;
	/*
	 * var size = p*5+1; if(size==1) size = 1; return size/2;
	 */
}

var transClusterMap={};
function addjustClusterArr() {
	var temp = {};
	var max = 0;
	var maxArr;
	for ( var i = 0; i < clusterArr.length; i++) {
		for(var key in nodeToComm){
			if(clusterArr[i] == nodeToComm[key])
				temp[key] = 1;
		}
		for(var key in temp){
			if(G.nodeWeight[key]>max){
				max = G.nodeWeight[key];
				maxArr = key;
			}
		}
		transClusterMap[maxArr]=clusterArr[i] ;
		clusterArr[i] = maxArr;
	
		temp = {};
		max = 0;
	}
}

/**
 * 根据graph数据进行聚类，然后调用可视化工具展示
 * 
 * @param data
 *            graph数据
 */
function drawComm_intern(data) {
	min_cut_num= parseInt($("input#min_cut_num").val())
	c = Community.createNew(data, 0.01, min_cut_num, 10);
	nodeToComm = c.startCluster();

	// start drawing
	var N = data.nodeSize();
	var E = data.edgeSize();
	var C = c.clusterSize();
	clusters = [];
	
	for ( var i = 0; i < C; i++) {
		if(i < 10){
			clusters.push({
				'id' : i,
				'nodes' : [],
				'color' : colorArray[i]
			});
		}
		else{
			clusters.push({
				'id' : i,
				'nodes' : [],
				'color' : 'rgb(' + Math.round(Math.random() * 256) + ','
						+ Math.round(Math.random() * 256) + ','
						+ Math.round(Math.random() * 256) + ')'
			});
		}
	}
	// hanle the cluster
	var nodeToCluster = {};
	clusterArr = [];
	var temp = 0;
	var cc;
	for ( var key in nodeToComm) {
		for ( var i = 0; i < clusterArr.length; i++) {
			if (clusterArr[i] == nodeToComm[key])
				temp = 1;
			if (nodeToComm[key] == clusterArr[i])
				cc = i;
		}

		if (temp == 0) {
			clusterArr.push(nodeToComm[key]);
			nodeToCluster[key] = clusterArr.length - 1;
		} else {
			nodeToCluster[key] = cc;
			temp = 0;
		}
	}
	
	/*
	 * add by ly
	 */
	addjustClusterArr();

	// add node and edge
	var nodeArr = data.nodeArr();
	for ( var i = 0; i < N; i++) {
		var nodeCluster = nodeToCluster[nodeArr[i]];
		var cluster = clusters[nodeCluster];
		sigInst.addNode(nodeArr[i], {
			'x' : Math.random(),
			'y' : Math.random(),
			'size' : changeNodeSize(nodeArr[i]),
			'color' : cluster['color'],
			'cluster' : cluster['id']
		});
		cluster.nodes.push('node' + nodeArr[i]);
	}
	for ( var id in data.edges) {
		sigInst.addEdge(data.edges[id][0], G.edges[id][1], G.edges[id][2]);
	}
	if (isRunning == false)
		startLayout();
	drawClusters();
}

var curCluster=null;
/**
 * 用户通过cluster按钮选择一个cluster,sigInst显示相应的cluster子图
 * 
 * @param button
 */
function chooseCluster(button) {
	if (isRunning) {
		return;
	}

	curCluster = button.value;
	if (curCluster == langMap.cluster_all) {
		sigInst.iterNodes(function(n) {
			n.hidden = 0;
		}).draw(2, 2, 2);
		return;
	}

	var cIdx = 0;
	for (; cIdx < clusterArr.length; cIdx++) {
		if (clusterArr[cIdx] == curCluster)
			break;
	}
	sigInst.iterNodes(function(n) {
		if (n.attr['cluster'] != cIdx)
			n.hidden = 1;
		else
			n.hidden = 0;
	}).draw(2, 2, 2);
	// drawCluserCloud(curCluster);
}

/*
 * function selHomeTimeline() { drawKWCloud(); }
 * 
 * var fill = d3.scale.category20(); function cloudScale(freq, min, range) {
 * return (70 / range) * (freq - min) + 10; } var angle=[0,90]; function
 * drawKWCloud(response) { var jData = dTableToArray(response.getDataTable());
 * var min = jData[jData.length - 1][1]; var range = jData[0][1] - min; if
 * (range == 0) range = min; var fontSize = d3.scale.log().range([ 10, 200 ]);
 * d3.layout.cloud().size([ 654, 400 ]).words(jData.map(function(d) { return {
 * text : d[0], size : cloudScale(d[1], min, range) };
 * })).padding(5).rotate(function() { // return ~~(Math.random() * 2) *
 * (Math.random() * 180 - 90); var idx = Math.abs(Math.random()%2); return
 * ~~(angle[idx]); }).font("Impact").fontSize(function(d) { return d.size;
 * }).on("end", draw_cloud).start(); } /** 云图关键词的搜索功能，使用百度搜索
 */
/*
 * function kwsearch() {
 * window.open("http://news.baidu.com/ns?cl=2&rn=20&tn=news&word=" +
 * $("#keyword:text").get(0).value + "&ie=utf-8"); } function draw_cloud(words) {
 * d3.select("#cloud_chart").append("svg").attr("width", 654).attr("height",
 * 400).append("g").attr("transform", "translate(327,200)").selectAll(
 * "text").data(words).enter().append("text").style("font-size", function(d) {
 * return d.size + "px"; }).style("font-family", "Impact").style("fill",
 * function(d, i) { return fill(i); }).attr("text-anchor",
 * "middle").attr("transform", function(d) { return "translate(" + [ d.x, d.y ] +
 * ")rotate(" + d.rotate + ")"; }).text(function(d) { return d.text;
 * }).on("click", function(d) { $("#keyword:text").val(function(n, c) { return
 * d.text; }); }); }
 */
// for test
var g = Graph.createNew();
var c;
function test() {
	g.addEdge(1, 0, 2, 1);
	g.addEdge(2, 0, 3, 1);
	g.addEdge(3, 0, 4, 1);
	g.addEdge(4, 0, 5, 1);
	g.addEdge(5, 1, 2, 1);
	g.addEdge(6, 1, 4, 1);
	g.addEdge(7, 1, 7, 1);
	g.addEdge(8, 2, 4, 1);
	g.addEdge(9, 2, 5, 1);
	g.addEdge(10, 3, 7, 1);
	g.addEdge(11, 4, 10, 1);
	g.addEdge(12, 5, 7, 1);
	g.addEdge(13, 5, 11, 1);
	g.addEdge(14, 6, 7, 1);
	g.addEdge(15, 6, 11, 1);
	g.addEdge(16, 8, 9, 1);
	g.addEdge(17, 8, 10, 1);
	g.addEdge(18, 8, 11, 1);
	g.addEdge(19, 8, 14, 1);
	g.addEdge(20, 8, 15, 1);
	g.addEdge(21, 9, 12, 1);
	g.addEdge(22, 9, 14, 1);
	g.addEdge(23, 10, 11, 1);
	g.addEdge(24, 10, 12, 1);
	g.addEdge(25, 10, 13, 1);
	g.addEdge(26, 10, 14, 1);
	g.addEdge(27, 11, 13, 1);
	G = g;
	drawComm();
}
