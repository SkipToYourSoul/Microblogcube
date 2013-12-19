/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 13-7-30
 * Time: 下午10:13
 * To change this template use File | Settings | File Templates.
 */
//google.setOnLoadCallback(drawVisualization);
var sigInst = null;
var gData;
var isRunning = true;
var timeData;
var edgeCount = 0;


//响应函数，获取得到google的数据，并根据这些数据画图
function handleQueryResponse(data) {
    if (response.isError()) {
        alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
        return;
    }
    var data = response.getDataTable();
}

var Map = {
    createNew: function() {
        var map = {};
        map.length=0;
        map.add=function(mid, value){
	    if (this.hasOwnProperty(mid) == false) {
		this.length = this.length +1;
	    }
	    this[mid]=value;
        };
	
	/*
	 * return: true if deleted. false if instance is still greater than 1
	 */
        map.del=function(mid) {
       	    if (this.hasOwnProperty(mid)) {
		delete this[mid];
		this.length = this.length - 1;
	    }
        };

	map.get=function(mid){
	      if (this.hasOwnProperty(mid)) {
		  return this[mid];
	      }else {
		  return null;
	      }
	};
	
        map.contains=function(mid){
            return this.hasOwnProperty(mid);
        };

        map.isEmpty=function(){
            return this.length == 0;
        };
	
        map.keySet=function(){
            var set =[];
            for (var key in this){
                if(typeof this[key]!="function" && key != "length"){
                    set.push(key);
                }
            }
            return set;
        };
	return map;
    }
}
var Set={
    createNew: function() {
        var set = {'map':Map.createNew()};
        set.add=function(mid){
            if (this.map.contains(mid) == false) {
		this[mid]=0;
	    }
	    this.map.add(mid, this.map[mid]+1);
        };
	
	/*
	 * return: true if deleted. false if instance is still greater than 1
	 */
        set.del=function(mid) {
       	    if (this.map.contains(mid)) {
		this.map[mid]=this.map[mid]-1;
		if (this.map[mid] == 0) {
		    this.map.del(mid);
		    return true;
		}
		return false;
	    }
	    return true;
        };

        set.contains=function(mid){
            return this.map.contains(mid);
        };

        set.isEmpty=function(){
            return this.map.isEmpty();
        };
        set.keySet=function(){
            return this.map.Keyset();
        };
	set.toInString=function(){
	    var ret = '(';
	    var keySet = this.keySet();
	    for (var i in keySet){
		if (i == 0) {
		    ret += keySet[i];
		} else {
		    ret += "," + keySet[i];
		}
	    }
	    ret += ")";
	    return ret;
	};
        return set;
    }
};


var visualizedWeibo = Set.createNew();
var visualizedNodeSet= Set.createNew();
/*
* rtMid 向 sigmal.js的(Edge,timeAgg)的Mapping,类似于缓存
*/
var rtMid2GraphMap = Map.createNew();
var selWeibo= Set.createNew();
var serverMeta ={};

function drawVisulization(){
    var url = "https://www.googleapis.com/fusiontables/v1/query?key="+key+"&typed=false&sql=";
    var queryText = 'SELECT tableId FROM 1_JXKqAV-ugCFGp548AV4ygYtBeKDxekVowTcv2M WHERE eventId = '+ eventId;
    $.post(url+queryText,{},findTable);
}

function findTable(mydata){
    var row = mydata.rows[0];
    var url = "https://www.googleapis.com/fusiontables/v1/query?key="+key+"&typed=false&sql=";
    /*if(selWeibo.keySet().length==1)
        var queryText = 'SELECT Retweetee,Retweeter,Time FROM '+row[0]+' WHERE RTMid IN ('+selWeibo.keySet()[0]+')';
    if(selWeibo.keySet().length==2)
        var queryText = 'SELECT Retweetee,Retweeter,Time FROM '+row[0]+' WHERE RTMid IN ('+selWeibo.keySet()[0]+','+selWeibo.keySet()[1]+')';
*/
    var len = selWeibo.keySet().length;
    var queryText = 'SELECT RTMid, Retweetee,Retweeter,Time FROM '+row[0]+' WHERE RTMid IN ' + selWeibo.toInString();

    $.post(url+queryText, { },handleJqueryData);
}

function handleJqueryData(data){
    //首先为每颗转发树够着边集
    for (var i = 0; i < data.rows.length; i++){
	var row = data.rows[i];
        var edge = {id: edgeCount, sourceID: data.rows[i][0], targetID: data.rows[i][1], label: i, attributes:[]};
	if (rtMid2GraphMap.contains(row[0])){
	    //sigInst.addEdge(edge.id, edge.sourceID,edge.targetID,edge);
	    rtMid2GraphMap.edgeSet.add(edge);
	    
            edgeCount++;
	} else {
	    rtMid2GraphMap.add(row[0], {'edgeSet':Set.createNew(),'TimeAgg':Map.createNew()});
	}
	
       
    }
}

//设置大小和颜色
function scaleSize(min, cur){
    if (Math.log(cur - min) < 1)
        return 1;
    return Math.log(cur - min);
}  //end scaleSize
var colorArr = ['rgb(238,0,0)',/*red2*/
                'rgb(255,255,0)',/*Yellow1*/
                'rgb(187,255,255)', /*PaleTurquoise1*/
                'rgb(255,160,122)', /*LightSalmon1*/
                'rgb(238,216,174)',
                'rgb(173,216,230)',
                'rgb(175,238,238)',
                'rgb(0,255,255)'/*Cyan1*/];
var timeScale=3600; //1 min
function chooseColor(min, cur) {
    var gap = Math.log((cur - min)/timeScale + 1);
    gap = Math.floor(gap);
    return colorArr[gap%colorArr.length];
}
function getPubTime(node, defTime){
    if (node.hasOwnProperty('time')){
        return node['time'];
    }
    return defTime;
}

var control = null;

function drawControl(Data) {
    //ControlWrapper
    control = new google.visualization.ControlWrapper({
        'controlType': 'ChartRangeFilter',
        'containerId': 'filter_div',
        'options': {
            'filterColumnIndex': 0 ,
            'ui': {
                //'chartType': 'LineChart',
                'snapToData': true,
                'chartOptions': {
                    'chartArea': {top:5,left:20,'width': '95%','height': '40%'}
                },
                //'state': {'range': {'start': new Date(2011, 4, 4), 'end': new Date(2011, 4, 5)}},
                'minRangeSize': 60
            }//end ui
        },//end option
        'dataTable':Data,
         //'state': {'range': {'start': new Date(2011, 4, 4), 'end': new Date(2012, 4, 5)}}
    });


    //google.visualization.events.addListener(control,'statechange',controlTest);

    //dashboard.bind(control,chart);
    //dashboard.draw(data);
    control.draw(Data);
    google.visualization.events.addListener(control, 'statechange', function () {
        var state = control.getState();
        var row;
        var columnIndices = [0];
        //选择范围触发的处理函数
        range(state.range.start, state.range.end);
    });
    //google.visualization.events.addListener(chart,'select',chartTest);
}//end drawDashboard

//处理从jquery传入的数据
function handleJqueryData(data){
    gData = data;
//    draw the notes and edges
    var nodes = new Object();
    var timeAgg = new Object();
    var minTime = new Date(2020,1,1);

    for (var idx in data.rows){                              //遍历所有点，处理data数据
        row = data.rows[idx];                                 //点的数据，包括source,target,time
        //rt number
        if (nodes.hasOwnProperty(row[0]))                                   //统计当前点是否有传播出去的消息，即source的数目
            nodes[row[0]]['count']= nodes[row[0]]['count']+1
        else {
            nodes[row[0]]={};
            nodes[row[0]]['count']=1;
        }

        var pubTime = new Date(row[2]);                                     //找到时间最早的点，将其时间存入minTime
        if (minTime > pubTime) {
            minTime =  pubTime;
        }

        if (nodes.hasOwnProperty(row[1]) == false)                          //找到当前source的target，并将它们的count设置为1
        {                                                                     //若该target不再传播，即为叶子节点
            nodes[row[1]]={};
            nodes[row[1]]['count']=1;
            nodes[row[1]]['time']=pubTime.getTime()/1000;                    //最初的节点，即节点0是没有时间的
        }
         //统计每个时间上的微博数
          if (timeAgg.hasOwnProperty(pubTime)){
              timeAgg[pubTime] = timeAgg[pubTime]+1;
          } else {
              timeAgg[pubTime] = 1;
          }
    } //end for

    //对时间进行排序 
    var sortedTime = [];
    for (var time in timeAgg){
	sortedTime.push(time);
    } 
    
    sortedTime.sort(function(a,b)
		    {
			var tA = new Date(a);
			var tB = new Date(b);
			return tA.getTime() - tB.getTime();});

    //构造dataTable，用于controlWrapper提供数据
    timeData = new google.visualization.DataTable();
    // Declare columns
    timeData.addColumn('datetime', '日期');
    timeData.addColumn('number', '微博数');

    for (var idx in sortedTime) {
	var time = sortedTime[idx];
        if(typeof timeAgg[time]!="function"){
         timeData.addRow([new Date(time), timeAgg[time]]);
        }
    }
    drawControl(timeData);

        for (var key in nodes){                                                        //根据处理好的数据添加node
        var nodeSize = nodes[key]['count'];
        var node =  {label:key, size:scaleSize(0,nodeSize),
            x:Math.random(),
            y: Math.random(),
            attributes:[],
            color:chooseColor(minTime.getTime()/1000, getPubTime(nodes[key],minTime.getTime()/1000))};
sigInst.addNode(key, node);
}

    for (var i = 0; i < data.rows.length; i++){
        var edge = {id: edgeCount, sourceID: data.rows[i][0], targetID: data.rows[i][1], label: i, attributes:[]};
        sigInst.addEdge(edgeCount, data.rows[i][0], data.rows[i][1],edge);
        edgeCount++;
    }
    sigInst.startForceAtlas2();



    //处理button功能
    document.getElementById('stop-layout').addEventListener('click',function(){
        if(isRunning){
            isRunning = false;
            sigInst.stopForceAtlas2();
            document.getElementById('stop-layout').childNodes[0].nodeValue = 'Start Layout';

            //event function
            sigInst.bind('overnodes',function(event){
                if(isRunning == false){
                var nodes = event.content;
                var neighbors = {};
                sigInst.iterEdges(function(e){
                    if(nodes.indexOf(e.source)>=0 || nodes.indexOf(e.target)>=0){              //找到该点相邻的边
                        neighbors[e.source] = 1;                                              //标记处该点相邻的点，这里e.source或者e.target为相邻点id
                        neighbors[e.target] = 1;
                    }
                }).iterNodes(function(n){
                        if(!neighbors[n.id]){
                            n.hidden = 1;                                                     //隐藏非相邻的点
                        }else{
                            n.hidden = 0;
                        }
                    }).draw(2,2,2);  }
            }).bind('outnodes',function(){
                    if(isRunning==false){
                    sigInst.iterEdges(function(e){
                        e.hidden = 0;
                    }).iterNodes(function(n){
                            n.hidden = 0;
                        }).draw(2,2,2);  }
                })
            //end event

        }else{
            isRunning = true;
            sigInst.startForceAtlas2();
            document.getElementById('stop-layout').childNodes[0].nodeValue = 'Stop Layout';
        }
    },true);
    document.getElementById('rescale-graph').addEventListener('click',function(){
        sigInst.position(0,0,1).draw();
    },true);

} // end handle

//范围显示函数
function range(start,end){
    var a = new Object();
    sigInst.iterNodes(function(n){
        n.hidden = 0;
    })
    for(var x in gData.rows){
        row = gData.rows[x];
        var myDate = new Date(row[2]);
        if(myDate<start||myDate>end){
             a[row[1]] = 1;
            }
        }
    sigInst.iterNodes(function(n){
        if(a.hasOwnProperty(n.id)){
            n.hidden = 1;
        }
    })
    if(isRunning==true)
        sigInst.startForceAtlas2();
    else
        sigInst.draw(2,2,2);
    //isRunning = true;
}

//初始化函数，初始化sigInst
function init() {
    // Instanciate sigma.js and customize it :
    sigInst = sigma.init(document.getElementById('sigma-example')).drawingProperties({
        defaultLabelColor: 'white',
        defaultLabelSize: 14,
        defaultLabelBGColor: '#fff',
        defaultLabelHoverColor: 'red',
        labelThreshold: 6,
        defaultEdgeType: 'line',
	defaultEdgeColor: 'source'
    }).graphProperties({
            minNodeSize: 0.5,
            maxNodeSize: 5,
            minEdgeSize: 1,
            maxEdgeSize: 1,
            sideMargin: 10
        }).mouseProperties({
            maxRatio: 32         //能放大的最大比例
        });
    SetWeibo();
} //end function


function SetWeibo(){
    var queryText = 'SELECT Mid,Text,Uid,Uname,IsV FROM 1TojNpEQ0fqifhMQNANxr9AZefABTFanxJv-Hw5U where EventId = '+eventId+'  ORDER BY Uid DESC LIMIT 10';
    var query = new google.visualization.Query('http://www.google.com/fusiontables/gvizdata?tq='  + queryText);
    // Send the query with a callback function.
    query.send(WeibohandleQueryResponse);
}
function WeibohandleQueryResponse(response) {
    var hml="";
    for (i =0;i<7 & i < response.g.K.length;i++){
	if (selWeibo.isEmpty()){
	    selWeibo.add(response.g.K[i].c[0].v);
	}

	hml+="<div class='weibo'>" ;
        hml+="<p class='user_name'>" ;
        hml+="<a href='http://weibo.com/u/"+ response.g.K[i].c[2].v+"'>";
        hml+="@"+ response.g.K[i].c[3].v+"</a>";
        if( response.g.K[i].c[4].v=='true'){
            hml+="<img src='img/mingren.gif'/>" ;
        }
        hml+="&nbsp;say:</p>";
        var myReg=new RegExp("http://t.cn/\\w*");
        var newstr= response.g.K[i].c[1].v ;
        var execStr = myReg.exec(newstr);
        var str=newstr.replace(myReg,function(a){ return "<a href='"+a+"'>"+a+"</a>";}) ;
        hml+="<p class='weibo_info' onclick='weiboChosen(this);' mid='"+ response.g.K[i].c[0].v+"'>&nbsp;&nbsp;"+str+"</p></div>";

    }
    $("#chart_small").html( $("#chart_small").html()+hml) ;
    drawVisulization();
}

function weiboChosen(param){
    if (selWeibo.contains($(param).attr('mid'))){
	selWeibo.del($(param).attr('mid'));
    } else {
	selWeibo.add($(param).attr('mid'));
    }
    var content="";
    for (var idx  in selWeibo.keySet()){
	content+=selWeibo.keySet()[idx] +" | ";
    }
    alert(content);

    /*sigInst = null;
    sigInst.draw(2,2,2);
    init();*/
    if(isRunning)
        drawVisulization();
}
