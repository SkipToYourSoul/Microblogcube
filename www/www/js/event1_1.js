/**
 * Created with JetBrains WebStorm.
 * User: Tong
 * Date: 13-8-1
 * Time: 下午12:25
 * To change this template use File | Settings | File Templates.
 */
var key = config.get("primary_store_key","");

google.load('visualization', '1.1', {packages: ['corechart', 'controls']});
google.setOnLoadCallback(drawChart);
function drawChart() {
    drawDashboard();
    get_concern_chart();
    get_publish_chart();
    get_client_chart();
    get_collect_chart();
    get_clientType_chart();
    get_sex_chart();
    get_fans_chart();
    drawEventBrief();
}

ftable_data_server=config.get('ftable_data_server','')
figure_data_server=config.get('figure_data_server','')
function drawEventBrief(){
    var queryText = "SELECT Title, Information,Link,ImgB FROM " +config.get('brief_info',"")+ " where EventId = "+ eventId;
    var url = ftable_data_server+"?key="+key+"&typed=false&sql=";
    // Send the query with a callback function.
    $.jsonp({url:url+queryText, callbackParameter: "callback",cache: true,success: handleBriefData});
}

function handleBriefData(jsonData){
    var brief = "";
    for (var idx in jsonData.rows){
	var row = jsonData.rows[idx];
	brief+='<div id="brief" class="small_block" style="padding:-1;margin:-1;border:#d9d9d9 1px solid;">';
	brief+='<h4 style="padding:5px 5px 0 5px;margin:0;" >事件简介</h4>';
        brief+=' <p style="padding:5px;margin:0;font-size:14px;font-family: \'微软雅黑\';">';
	brief+='<img src="'+row[3]+'" onError="this.src=\'img/default.gif\';" width=200 height=150 border=0 align="left" style="margin:5px" />';
	brief+=row[1]+'<p style="padding:5px;margin:0;font-size:14px;font-family: \'微软雅黑\';">';
	brief+='参见:<a style="padding:0;margin:0;font-size:14px;font-family: \'微软雅黑\';color:black;font-weight:bold;"'; 
	brief+="href='"+row[2]+"'>"+row[0]+"(wiki)</a></p></p> </div> </div>"
    }
    $("#chart_small").html(brief);
}

function drawDashboard(){
    var queryText = 'SELECT Time,AllTweet as \'所有微博\',RTTweet as \'转发微博\',OriTweet as \'原创微博\' FROM 1vNgA_oawB1ysdMpjPi8QdDxeU1crEhZMUJ1JzbI where eventId = '+eventId+' and Time> \'2011-1-1\' order by Time';
    var query = new google.visualization.Query(figure_data_server+'?key='+key+'&tq='  + queryText);
    var url = ftable_data_server+"?key="+key+"&typed=false&sql=";

	// Send the query with a callback function.
    $.jsonp({url:url+queryText, callbackParameter: "callback",cache: true,success: handleJqueryData});
}

function handleJqueryData(jdata) {
   
    var data = parseData(jdata,[['datetime','时间'],['number','所有微博'],['number','转发微博'],['number','原创微博']]);
	
    var dashboard = new google.visualization.Dashboard(document.getElementById('processdure'));
    //ControlWrapper
    var control = new google.visualization.ControlWrapper({
        'controlType': 'ChartRangeFilter',
        'containerId': 'processdure_filter',
        'options': {
            'filterColumnIndex': 0 ,
            'ui': {
                'chartType': 'LineChart',
                'snapToData': true,
                'chartOptions': {
                    'chartArea': {left:50,'width': '90%','height': '90%'},
                    'hAxis': {
                        'baselineColor': 'none',
                        'textPosition' : 'in' ,
                        'textStyle' :{'fontSize':'12'}
                    },
                    'enableInteractivity': true
                },
                'chartView': {
                    'columns': [0, 1, 2, 3]
                },
                'minRangeSize': 86400000
            }//end ui
        }//end option
        //'state': {'range': {'start': new Date(2011, 6, 26), 'end': new Date(2012, 5, 27)}}
    });
    //ChartWrapper
    var chart = new google.visualization.ChartWrapper({
        'chartType': 'LineChart',
        'containerId': 'processdure_chart',
        'options': {
            'chartArea': {top:30,left:50,'height': '80%' , 'width': '90%'},
            //'title':'eventTimeSeries_GUOMeimei',
            'titlePosition' : 'in',
            'tooltip':{
                'showColorCode': false
            },
            //curveType: "function",  //线段光滑
            'legend': {
                'position': 'top',
                'alignment': 'start',
                'textStyle': {fontSize:12,fontName:'shit',color:'black'}
            },     //end legend
            'focusTarget': 'datum',
            'fontSize': '12',
            'lineWidth': 1,
            'pointSize': 2,
            //'reverseCategories': false,
            'series':{0:{color: 'blue', visibleInLegend: true}, 1:{color: 'red', visibleInLegend: true}},      //每一条线属性的设置
            'hAxis': {
                'slantedText': false,       //倾斜字体
                'baselineColor': 'black',
                'direction': '1' ,
                // 'format': 'yyyy.MM.dd' ,
                'gridlines': {color: 'none'},
                'minorGridlines' :{},       //次要刻度
                'logScale' : false,
                'textPosition': 'in',
                /*'title' : 'Date',
                 'titleTextStyle' :{color: 'red'} */
                'allowContainerBoundaryTextCufoff': true,
                'maxAlternation' : 1,    //text最大重叠层数
                'interpolateNulls' : false
            },//end of hAxis
            'vAxis': {
                /* 'viewWindow': {'min': 0, 'max': 60000} */
                'gridlines': {count: 5},
                'allowContainerBoundaryTextCufoff' : true
            } //end of vAxis
        }//end option
    });
    google.visualization.events.addListener(chart, 'onmouseover', onmouseover);
    dashboard.bind(control,chart);
    dashboard.draw(data);
}//end drawDashboard

function onmouseover(e){
    alert(e.row, e.column);
}

function get_concern_chart()
{
    var queryText = 'SELECT FriendsCount,UserCount FROM 1mr1zAVHURUl6ilGTt-ulm3ON8mE9rmE3qHkc61w WHERE EventId='+eventId+' ORDER BY FriendsCount ';
    var query = new google.visualization.Query(figure_data_server+'?key='+key+'&tq='  + queryText);
    // Send the query with a callback function.
	var url = ftable_data_server+"?key="+key+"&typed=false&sql=";
    $.jsonp({url:url+queryText, callbackParameter: "callback",cache: true,success: draw_concern_chart});
}


function draw_concern_chart(jdata)
{
    var data = parseData(jdata,[['number','粉丝数量'],['number','用户数量']]);

    var options = {
        hAxis: { minValue: 0, maxValue: 50,gridlines:{color:'#FFFFFF',count:10}},
        vAxis: { minValue: 0, maxValue: 15,gridlines:{color:'#FFFFFF',count:10}},
        chartArea:{height:'75%', width:'100%',left:50},
        colors:['red','#004411'],
        legend: 'none',
        height:'100%',
        width:'100%'

    };

    var chart = new google.visualization.ScatterChart(document.getElementById('concern_chart'));
    chart.draw(data, options);
}


function get_publish_chart()
{
    var queryText = 'SELECT StatusCount,Count FROM 1khHNsYcYBjIKT_6E7BZifAHXPIVoJgb7nOSZ0Es WHERE EventId='+eventId+' ORDER BY StatusCount ';
    var query = new google.visualization.Query(figure_data_server+'?key='+key+'&tq='  + queryText);
    // Send the query with a callback function.
	var url = ftable_data_server+"?key="+key+"&typed=false&sql=";
    $.jsonp({url:url+queryText, callbackParameter: "callback",cache: true,success: draw_publish_chart});
	
}

function draw_publish_chart(jdata)
{
    var data = parseData(jdata,[['number','微博数量'],['number','数量']]);

    var options = {
        hAxis: { minValue: 0, maxValue: 50,gridlines:{color:'#FFFFFF',count:10}},
        vAxis: { minValue: 0, maxValue: 15,gridlines:{color:'#FFFFFF',count:10}},
        chartArea:{height:'75%', width:'100%',left:50},
        legend: 'none',
        height:'100%',
        width:'100%'


    };

    var chart = new google.visualization.ScatterChart(document.getElementById('publish_chart'));
    chart.draw(data, options);
}


function get_collect_chart()
{
    var queryText = 'SELECT FavoritesCount,UserCount FROM 1EG9NmyyAYobGuCa2oWApfNfyx_cv9L82mkz9QVo WHERE EventId='+eventId+' ORDER BY FavoritesCount ';
    var query = new google.visualization.Query(figure_data_server+'?key='+key+'&tq='  + queryText);
    // Send the query with a callback function.
	var url = ftable_data_server+"?key="+key+"&typed=false&sql=";
    $.jsonp({url:url+queryText, callbackParameter: "callback",cache: true,success: draw_collect_chart});
	
}


function draw_collect_chart(jdata)
{
    var data = parseData(jdata,[['number','关注数量'],['number','用户数量']]);

    var options = {
        hAxis: {gridlines:{color:'#FFFFFF',count:10}},
        vAxis: {gridlines:{color:'#FFFFFF',count:10}},
        chartArea:{height:'75%', width:'100%',left:50},
        legend: 'none',
        height:'100%',
        width:'100%'


    };

    var chart = new google.visualization.ScatterChart(document.getElementById('collect_chart'));
    chart.draw(data, options);
}


function get_client_chart()
{
    var queryText = 'SELECT Platform,Count FROM 1IzqocbPFqi-e9I244SoWQamnvDhIsliEx8lSYEk WHERE EventId='+eventId+' ';
    var query = new google.visualization.Query(figure_data_server+'?key='+key+'&tq='  + queryText);
    // Send the query with a callback function.
    var url = ftable_data_server+"?key="+key+"&typed=false&sql=";
    $.jsonp({url:url+queryText, callbackParameter: "callback",cache: true,success: draw_client_chart});
}


function draw_client_chart(jdata)
{
    var data = parseData(jdata,[['string','平台'],['number','数量']]);

    var options = {
        chartArea:{width:'90%',
            height:'90%'

        },
        legend:{position: 'none',alignment:'center'} ,
        pieSliceText:'label',
        tooltip:{text:'数量'}
    };
    var chart = new google.visualization.PieChart(document.getElementById('client_chart'));
    chart.draw(data, options);
}


function get_clientType_chart()
{
    var queryText = 'SELECT IsV,UserCount FROM 17SkDFXP1LBp7WgAOLDRVF2CS_44GjWot1MsaZv4 WHERE EventId='+eventId+' ';
    var query = new google.visualization.Query(figure_data_server+'?key='+key+'&tq='  + queryText);
    // Send the query with a callback function.
	var url = ftable_data_server+"?key="+key+"&typed=false&sql=";
    $.jsonp({url:url+queryText, callbackParameter: "callback",cache: true,success: draw_clientType_chart});
}

function draw_clientType_chart(jdata)
{
    var data = parseAndTransData(jdata,[['string','用户类型'],['number','用户数量']],{"TRUE":"VIP用户","FALSE":"普通用户"});

    var options = {
        chartArea:{width:'90%',
            height:'90%'

        },
        legend:{position: 'none',alignment:'center'} ,
        pieSliceText:'label',
        tooltip:{text:'value'}
    };
    var chart = new google.visualization.PieChart(document.getElementById('clientType_chart'));
    chart.draw(data, options);
}

function get_sex_chart()
{
    var queryText = 'SELECT Gender,UserCount FROM 1NB3xk5qEOdMLlr0xWKZ13H802V_6iQ4WMcTQHMM WHERE EventId='+eventId+' ';
    var query = new google.visualization.Query(figure_data_server+'?key='+key+'&tq='  + queryText);
    // Send the query with a callback function.
	var url = ftable_data_server+"?key="+key+"&typed=false&sql=";
    $.jsonp({url:url+queryText, callbackParameter: "callback",cache: true,success: draw_sex_chart});
	
}
function draw_sex_chart(jdata)
{	
    var data = parseAndTransData(jdata,[['string','性别'],['number','用户数']],{"f":"女性","m":"男性"});
    var options = {
        chartArea:{width:'90%',
            height:'90%'

        },
        legend:{position: 'none',alignment:'center'} ,
        pieSliceText:'label',
        tooltip:{text:'value'}
    };
    var chart = new google.visualization.PieChart(document.getElementById('sex_chart'));
    chart.draw(data, options);
}

function get_fans_chart()
{
    var queryText = 'SELECT FollowersCount,UserCount FROM 1WG4bzcxG_28twUEJu1fRexdYZIoTvu5CHoNF_vM WHERE EventId='+eventId+' ';
    var query = new google.visualization.Query(figure_data_server+'?key='+key+'&tq='  + queryText);
    // Send the query with a callback function.
	var url = ftable_data_server+"?key="+key+"&typed=false&sql=";
	$.jsonp({url:url+queryText, callbackParameter: "callback",cache: true,success: draw_fans_chart});
	
}
function draw_fans_chart(jdata)
{
    var data = parseData(jdata,[['number','粉丝数'],['number','用户数量']]); ;

    var options = {
        hAxis: { minValue: 0, maxValue: 50,gridlines:{color:'#FFFFFF',count:10}},
        vAxis: { minValue: 0, maxValue: 15,gridlines:{color:'#FFFFFF',count:10}},
        chartArea:{height:'75%', width:'100%',left:50},
        colors:['red','#004411'],
        legend: 'none',
        height:'100%',
        width:'100%'

    };

    var chart = new google.visualization.ScatterChart(document.getElementById('fans_chart'));
    chart.draw(data, options);
}
