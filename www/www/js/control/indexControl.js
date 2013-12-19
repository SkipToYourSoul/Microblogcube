var months = ["2009", "2010", "2011", "2012", "2013"];
var BigTime,SmallTime;
$(document).ready(function(){
  $("#date_slider").dateRangeSlider({
	bounds:{
		min:new Date(2009,0,1),
		max:new Date(2013,11,31)
	},
	arrows:true,
	defaultValues:{
		min:new Date(2011,0,1),
		max:new Date(2013,0,1)
	},
	/*
	valueLabels:"change",
	delayOut:4000,
	durationIn:1000,
	durationOut:1000,
	enabled:true,
	/*
	formatter:function(val){
		var days = val.getDate();
		var month = val.getMonth()+1;
		var year = val.getFullYear();
		return days+"/"+month+"/"+year;
	},
	*/
	range:{
		min:{weeks: 1},
		max:{years: 3}
	},
	scales: [{
      first: function(value){ return value; },
      end: function(value) {return value; },
      next: function(value){
        var next = new Date(value);
        return new Date(next.setYear(value.getFullYear() + 1));
      },
      label: function(value){
        return months[value.getFullYear()-2009];
      },
      format: function(tickContainer, tickStart, tickEnd){
        tickContainer.addClass("myCustomClass");
      }
    }],
	step:{
		days: 1
	},
	//wheelMode:"scroll",
	//wheelSpeed: 1,
  });

  	var testTime = new Date(2012,9,2);
  
	$("#date_slider").bind("userValuesChanged", function(e, data){
		console.log("Something moved. min: " + data.values.min + " max: " + data.values.max);
		//$("#date_slider").dateRangeSlider("disable");
		var dateValues = $("#date_slider").dateRangeSlider("values");

		BigTime = dateValues.max;
		SmallTime = dateValues.min;

		console.log(dateValues.min.toString() + "fuck you ! " + dateValues.max.toString());
		handleDataByControl();
	});
	
	$("#recoverButton").click(function(){
		$("#date_slider").dateRangeSlider("enable");
	});
	$("#lockButton").click(function(){
		$("#date_slider").dateRangeSlider("disable");
	});
	$("#zoomInButton").click(function(){
		//$("#date_slider").dateRangeSlider("zoomIn", 7);
		$("#date_slider").dateRangeSlider("values",new Date(2010,0,1),new Date(2010,11,31));
		var dateValues = $("#date_slider").dateRangeSlider("values");
		BigTime = dateValues.max;
		SmallTime = dateValues.min;
		handleDataByControl();
	});
	$("#zoomOutButton").click(function(){
		//$("#date_slider").dateRangeSlider("zoomOut", 7);
		$("#date_slider").dateRangeSlider("values",new Date(2011,0,1),new Date(2011,11,31));
		var dateValues = $("#date_slider").dateRangeSlider("values");
		BigTime = dateValues.max;
		SmallTime = dateValues.min;
		handleDataByControl();
	});
});



function handleDataByControl() {
	var url = "https://www.googleapis.com/fusiontables/v1/query?key=AIzaSyD05csCTRNM5I7CYHkbxCeQJF0UKRs1bVA&typed=false&sql=";
	var queryText = 'SELECT EventId, Title, Information, Hot,ImgA,EventTime FROM 1hB2u2DZ_sJV1Zg_xHYy9Gdy9R-mlkQ96g30hrYk order by Hot DESC';
	$.post(url+queryText,{},updateEventByControl);
}

function updateEventByControl(data) {
	var eventList = "";
	for (var idx in data.rows){
		var row = data.rows[idx];

		if(IsBig(row[5],SmallTime)&&IsSmall(row[5],BigTime)){

		eventList += "<div class='brief'><div class='brief_title'>";
		eventList+="<a href=\"event1_1.html?eventId="+row[0]+"\">";
		eventList+="<h2>"+row[1]+"</h2></a></div>";
		eventList+="<div class='brief_img'>";
		eventList+="<a href=\"event1_1.html?eventId="+row[0]+"\">";
		eventList+="<img src=\""+row[4]+"\" alt=\""+row[1]+"\" border=0 width=280 height=210></a></div>";
		eventList+="<div class='brief_hot'><div class='hot_name'>";
		eventList+="<p>事件热度</p></div>";
		eventList+="<div class='hot_bar'>";
		eventList+="<div class=\"hot_fill\" style=\"width:"+ parseInt(row[3]) +"px\" onmouseover=\"this.style.backgroundColor='blue'\" onmouseout=\"this.style.backgroundColor='cornflowerblue'\">";
		eventList+="</div></div></div>";
		eventList+="<div class='brief_info'>";
		eventList+="<div class='brief_maininfo'>";
		eventList+="<a href=\"event1_1.html?eventId="+row[0]+"\"><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+row[2]+"</p></a></div>";
		eventList+="<div class='brief_more'>";
		eventList+="<a href=\"event1_1.html?eventId="+ row[0] +"\"><p>更多></p></a>";
		eventList+="</div></div></div>";

		}
    }
    $("#main_info").html(eventList);
}

function IsBig(a,b) {
	var year = a[0]*1000+a[1]*100+a[2]*10+a[3]*1;
	var month = a[5]*10+a[6]*1;
	var day = a[8]*10+a[9]*1;

	if(year>b.getFullYear()){
		return true;
	}
	else if(year==b.getFullYear()){
		if(month>b.getMonth()){
			return true;
		}
		else if(month==b.getMonth()){
			if(day>=b.getDate())
				return true;
			else
				return false;
		}
		else{
			return false;
		}
	}
	else{
		return false;
	}
}

function IsSmall(a,b) {
	var year = a[0]*1000+a[1]*100+a[2]*10+a[3]*1;
	var month = a[5]*10+a[6]*1;
	var day = a[8]*10+a[9]*1;

	if(year<b.getFullYear()){
		return true;
	}
	else if(year==b.getFullYear()){
		if(month<b.getMonth()){
			return true;
		}
		else if(month==b.getMonth()){
			if(day<=b.getDate())
				return true;
			else
				return false;
		}
		else{
			return false;
		}
	}
	else{
		return false;
	}
}

