var map;
var China = new google.maps.LatLng(37.3174, 103.9746);
var America = new google.maps.LatLng(37.09024,-95.712891);

var ShangHai,BeiJing,ChongQing,TianJing;
var HeBei,ShanXi,LiaoNing,HeiLongjiang,JiangSu,ZheJiang,AnHui,FuJian,JiangXi,ShanDong,HeNan,HuBei,HuNan,GuangDong,HaiNan,SiChuan,GuiZhou,YunNan,SanXi,GanSu,QingHai;
var TaiWan,XiangGang;
var MeiGuo,London,LiBiya,AiJi,Japan,ChaoXuan,BaJst,Korea,French,RuiDian,FeiLvb;
var ZhongGuo,Internet,MeiGonghe,DiaoYudao,HuangYandao;

var markSH,markBJ,markCQ,markTJ;
var mark1,mark2,mark3,mark4,mark5,mark6,mark7,mark8,mark9,mark10,mark11,mark12,mark13,mark14,mark15,mark16,mark17,mark18,mark19,mark20,mark21;
var markTW,markXG;
var markA,markB,markC,markD,markE,markF,markG,markH,markI,markJ,markK;
var Mark1,Mark2,Mark3,Mark4,Mark5;  

var currentLocation;

function backToChina(controlDiv,map) {
	controlDiv.style.padding = '5px';
	
	var controlUI = document.createElement('div');
	controlUI.style.backgroundColor = 'white';
	controlUI.style.borderStyle = 'solid';
	controlUI.style.borderWidth = '2px';
	controlUI.style.cursor = 'pointer';
	controlUI.style.textAlign = 'center';
	controlUI.title = 'Click to set the map to China';
	controlDiv.appendChild(controlUI);
	
	var controlText = document.createElement('div');
	controlText.style.fontFamily = 'Arial,sans-serif';
	controlText.style.fontSize = '12px';
	controlText.style.paddingLeft = '4px';
	controlText.style.paddingRight = '4px';
	controlText.innerHTML = '<b>To China</b>';
	controlUI.appendChild(controlText);
	
	google.maps.event.addDomListener(controlUI,'click',function(){
		map.setCenter(China);
	})
}

function backToAmerica(controlDiv,map) {
	controlDiv.style.padding = '5px';
	
	var controlUI = document.createElement('div');
	controlUI.style.backgroundColor = 'white';
	controlUI.style.borderStyle = 'solid';
	controlUI.style.borderWidth = '2px';
	controlUI.style.cursor = 'pointer';
	controlUI.style.textAlign = 'center';
	controlUI.title = 'Click to set the map to America';
	controlDiv.appendChild(controlUI);
	
	var controlText = document.createElement('div');
	controlText.style.fontFamily = 'Arial,sans-serif';
	controlText.style.fontSize = '12px';
	controlText.style.paddingLeft = '4px';
	controlText.style.paddingRight = '4px';
	controlText.innerHTML = '<b>To America</b>';
	controlUI.appendChild(controlText);
	
	google.maps.event.addDomListener(controlUI,'click',function(){
		map.setCenter(America);
	})
}

function HomeControl(controlDiv,map,home) {
	var control = this;
	control.home_ = home;
	controlDiv.style.padding = '5px';
	var goHomeUI = document.createElement('div');
	goHomeUI.style.backgroundColor = 'white';
	goHomeUI.style.borderStyle = 'solid';
	goHomeUI.style.borderWidth = '2px';
	goHomeUI.style.cursor = 'pointer';
	goHomeUI.style.textAlign = 'center';
	goHomeUI.title = 'Click to set the map to Home';
	controlDiv.appendChild(goHomeUI);
	var goHomeText = document.createElement('div');
	goHomeText.style.fontFamily = 'Arial,sans-serif';
	goHomeText.style.fontSize = '12px';
	goHomeText.style.paddingLeft = '4px';
	goHomeText.style.paddingRight = '4px';
	goHomeText.innerHTML = '<b>Home</b>';
	goHomeUI.appendChild(goHomeText);
	var setHomeUI = document.createElement('div');
	setHomeUI.style.backgroundColor = 'white';
	setHomeUI.style.borderStyle = 'solid';
	setHomeUI.style.borderWidth = '2px';
	setHomeUI.style.cursor = 'pointer';
	setHomeUI.style.textAlign = 'center';
	setHomeUI.title = 'Click to set Home to the current center';
	controlDiv.appendChild(setHomeUI);
	var setHomeText = document.createElement('div');
	setHomeText.style.fontFamily = 'Arial,sans-serif';
	setHomeText.style.fontSize = '12px';
	setHomeText.style.paddingLeft = '4px';
	setHomeText.style.paddingRight = '4px';
	setHomeText.innerHTML = '<b>Set Home</b>';
	setHomeUI.appendChild(setHomeText);
	google.maps.event.addDomListener(goHomeUI, 'click', function() {
		var currentHome = control.getHome();
		map.setCenter(currentHome);
	});
	google.maps.event.addDomListener(setHomeUI, 'click', function() {
		var newHome = map.getCenter();
		control.setHome(newHome);
	});
}
HomeControl.prototype.home_ = null;
HomeControl.prototype.getHome = function() {
  return this.home_;
}
HomeControl.prototype.setHome = function(home) {
  this.home_ = home;
}

function initialize() {
	var mapOptions = {
		zoom: 4,
		center: China,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		scaleControl: true,
		zoomControl: true,
		zoomControlOptions:{
			style: google.maps.ZoomControlStyle.DEFAULT
		}
	};
	map = new google.maps.Map(document.getElementById('map_canvas'),
		mapOptions);
	
	positionAndEvent();
	
	var chinaControlDiv = document.createElement('div');
	var chinaControl = new backToChina(chinaControlDiv,map);
	map.controls[google.maps.ControlPosition.RIGHT_TOP].push(chinaControlDiv);
	var AmericaControlDiv = document.createElement('div');
	var AmericaControl = new backToAmerica(chinaControlDiv,map);
	map.controls[google.maps.ControlPosition.RIGHT_TOP].push(AmericaControlDiv);
	
	var homeControlDiv = document.createElement('div');
	var homeControl = new HomeControl(homeControlDiv, map, China);
	map.controls[google.maps.ControlPosition.RIGHT_TOP].push(homeControlDiv);
	
} // end initialize();

function positionAndEvent(){
	ShangHai = new google.maps.LatLng(31.230393, 121.473704);
	BeiJing = new google.maps.LatLng(39.90403, 116.407526);
	ChongQing = new google.maps.LatLng(29.56301,106.551557);
	TianJing = new google.maps.LatLng(39.084158,117.200983);
	
	HeBei = new google.maps.LatLng(38.037057,114.468665);
	ShanXi = new google.maps.LatLng(37.873532,112.562398);
	LiaoNing = new google.maps.LatLng(41.835441,123.42944);
	HeiLongjiang = new google.maps.LatLng(45.742347,126.661669);
	JiangSu = new google.maps.LatLng(32.061707,118.763232);
	ZheJiang = new google.maps.LatLng(30.267447,120.152792);
	AnHui = new google.maps.LatLng(31.861184,117.284923);
	FuJian = new google.maps.LatLng(26.100782,119.295146);
	JiangXi = new google.maps.LatLng(28.674363,115.908733);
	ShanDong = new google.maps.LatLng(36.66853,117.020359);
	HeNan = new google.maps.LatLng(34.765515,113.753602);
	HuBei = new google.maps.LatLng(30.546498,114.341862);
	HuNan = new google.maps.LatLng(28.112444,112.98381);
	GuangDong = new google.maps.LatLng(23.132191,113.266531);
	HaiNan = new google.maps.LatLng(20.017378,110.349229);
	SiChuan = new google.maps.LatLng(30.651652,104.075931);
	GuiZhou = new google.maps.LatLng(26.598194,106.70741);
	YunNan = new google.maps.LatLng(25.045806,102.710002);
	SanXi = new google.maps.LatLng(34.265472,108.954239);
	GanSu = new google.maps.LatLng(36.059421,103.826308);
	QingHai = new google.maps.LatLng(36.620901,101.780199);
	
	TaiWan = new google.maps.LatLng(23.69781,120.966515);
	XiangGang = new google.maps.LatLng(22.396428,114.109497);

	MeiGuo = new google.maps.LatLng(37.09024,-95.712891);
	London = new google.maps.LatLng(51.5112139,-0.1198244);
	LiBiya = new google.maps.LatLng(26.3351,17.228331);
	AiJi = new google.maps.LatLng(26.820553,30.802498);
	Japan = new google.maps.LatLng(36.204824,138.252924);
	ChaoXuan = new google.maps.LatLng(40.339852,127.510093);
	BaJst = new google.maps.LatLng(30.375321,69.345116);
	Korea = new google.maps.LatLng(35.907757,127.766922);
	French = new google.maps.LatLng(46.227638,2.213749);
	RuiDian = new google.maps.LatLng(60.128161,18.643501);
	FeiLvb = new google.maps.LatLng(12.879721,121.774017);

	ZhongGuo = new google.maps.LatLng(33,90);
	Internet = new google.maps.LatLng(37,90);
	MeiGonghe = new google.maps.LatLng(11.565,104.9411111);
	DiaoYudao = new google.maps.LatLng(25.7451456,123.4805506);
	HuangYandao = new google.maps.LatLng(15.218083,117.722882);
	
	var image = 'img/image/mark7.png';
	var image1 = 'img/image/china.png';
	var image2 = 'img/image/web.png';

	//上海
	setTimeout(function(){
		markerSH = new google.maps.Marker({
		position: ShangHai,
		map: map,
		//title: 'ShangHai',
		icon: image,
		animation: google.maps.Animation.DROP
		});
		var contentSH = '<div>'+
					'<h1>上海</h1>'+
					'<div>'+
					'<p><b>在上海</b>，你可以查看到以下事件:</p>'+
					'<p>上海11.15大火</p>'+
					'<p>上海地铁十号线追尾</p>'+
					'<p>上海染色馒头事件</p>'+
					'<p>etc.</p>'+
					'</div></div>';
		var infowindowSH = new google.maps.InfoWindow({
		content:contentSH,
		maxWidth: 200
		});
		google.maps.event.addListener(markerSH,'mouseover',function(){
			infowindowSH.open(map,markerSH);
		});
		google.maps.event.addListener(markerSH,'mouseout',function(){
			infowindowSH.close();
		});
		google.maps.event.addListener(markerSH,'click',function(){
			markerSH.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function(){
				markerSH.setAnimation(null);
			},2800);
				
			//handle the data
			currentLocation = "'上海'";
			handleDataByMap();
		});
	},200);
	
	//北京
	setTimeout(function(){
		markerBJ = new google.maps.Marker({
		position: BeiJing,
		map: map,
		icon: image,
		animation: google.maps.Animation.DROP
		});
		var contentBJ = '<div>'+
					'<h1>北京</h1>'+
					'<div>'+
					'<p><b>在北京</b>，你可以查看到以下事件:</p>'+
					'<p>北京7.21暴雨</p>'+
					'<p>北京治堵</p>'+
					'<p>北京车牌摇号</p>'+
					'<p>etc.</p>'+
					'</div></div>';
		var infowindowBJ = new google.maps.InfoWindow({
		content:contentBJ,
		maxWidth: 200
		});
		google.maps.event.addListener(markerBJ,'mouseover',function(){
			infowindowBJ.open(map,markerBJ);
		});
		google.maps.event.addListener(markerBJ,'mouseout',function(){
			infowindowBJ.close();
		});
		google.maps.event.addListener(markerBJ,'click',function(){
			markerBJ.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function(){
				markerBJ.setAnimation(null);
			},2800);
				
			//handle the data
			currentLocation = "'北京'";
			handleDataByMap();
		});
	},200);
	
	//重庆
	setTimeout(function(){
		markerCQ = new google.maps.Marker({
		position: ChongQing,
		map: map,
		//title: 'ChongQing',
		icon: image,
		animation: google.maps.Animation.DROP
		});
		var contentCQ = '<div>'+
					'<h1>重庆</h1>'+
					'<div>'+
					'<p><b>在重庆</b>，你可以查看到以下事件:</p>'+
					'<p>周克华抢劫案</p>'+
					'<p>王立军事件</p>'+
					'<p>重庆不雅视频</p>'+
					'<p>etc.</p>'+
					'</div></div>';
		var infowindowCQ = new google.maps.InfoWindow({
		content:contentCQ,
		maxWidth: 200
		});
		google.maps.event.addListener(markerCQ,'mouseover',function(){
			infowindowCQ.open(map,markerCQ);
		});
		google.maps.event.addListener(markerCQ,'mouseout',function(){
			infowindowCQ.close();
		});
		google.maps.event.addListener(markerCQ,'click',function(){
			markerCQ.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function(){
				markerCQ.setAnimation(null);
			},2800);
				
			//handle the data
			currentLocation = "'重庆'";
			handleDataByMap();
		});
	},200);
	
	//天津
	setTimeout(function(){
		markerTJ = new google.maps.Marker({
		position: TianJing,
		map: map,
		title: 'TianJing',
		icon: image,
		animation: google.maps.Animation.DROP
		});
		var contentTJ = '<div>'+
					'<h1>天津</h1>'+
					'<div>'+
					'<p><b>在天津</b>，你可以查看到以下事件:</p>'+
					'<p>天津蓟县大火</p>'+
					'</div></div>';
		var infowindowTJ = new google.maps.InfoWindow({
		content:contentTJ,
		maxWidth: 200
		});
		google.maps.event.addListener(markerTJ,'mouseover',function(){
			infowindowTJ.open(map,markerTJ);
		});
		google.maps.event.addListener(markerTJ,'mouseout',function(){
			infowindowTJ.close();
		});
		google.maps.event.addListener(markerTJ,'click',function(){
			markerTJ.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function(){
				markerTJ.setAnimation(null);
			},2800);
				
			//handle the data
			currentLocation = "'天津'";
			handleDataByMap();
		});
	},200);
	
	//河北
	setTimeout(function(){
		marker1 = new google.maps.Marker({
		position: HeBei,
		map: map,
		icon: image,
		animation: google.maps.Animation.DROP
		});
		var content1 = '<div>'+
					'<h1>河北</h1>'+
					'<div>'+
					'<p><b>在河北</b>，你可以查看到以下事件:</p>'+
					'<p>毒胶囊事件</p>'+
					'<p>李刚事件</p>'+
					'<p>渤海海湾田溢油事故</p>'+
					'<p>etc.</p>'+
					'</div></div>';
		var infowindow1 = new google.maps.InfoWindow({
		content:content1,
		maxWidth: 200
		});
		google.maps.event.addListener(marker1,'mouseover',function(){
			infowindow1.open(map,marker1);
		});
		google.maps.event.addListener(marker1,'mouseout',function(){
			infowindow1.close();
		});
		google.maps.event.addListener(marker1,'click',function(){
			marker1.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function(){
				marker1.setAnimation(null);
			},2800);
				
			//handle the data
			currentLocation = "'河北'";
			handleDataByMap();
		});
	},400);

	//山西
	setTimeout(function(){
		marker2 = new google.maps.Marker({
		position: ShanXi,
		map: map,
		icon: image,
		animation: google.maps.Animation.DROP
		});
		var content2 = '<div>'+
					'<h1>山西</h1>'+
					'<div>'+
					'<p><b>在山西</b>，你可以查看到以下事件:</p>'+
					'<p>山西疫苗问题</p>'+
					'<p>速成鸡事件</p>'+
					'<p>申纪兰事件</p>'+
					'<p>etc.</p>'+
					'</div></div>';
		var infowindow2 = new google.maps.InfoWindow({
		content:content2,
		maxWidth: 200
		});
		google.maps.event.addListener(marker2,'mouseover',function(){
			infowindow2.open(map,marker2);
		});
		google.maps.event.addListener(marker2,'mouseout',function(){
			infowindow2.close();
		});
		google.maps.event.addListener(marker2,'click',function(){
			marker2.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function(){
				marker2.setAnimation(null);
			},2800);
				
			//handle the data
			currentLocation = "'山西'";
			handleDataByMap();
		});
	},400);

	//辽宁
	setTimeout(function(){
		marker3 = new google.maps.Marker({
		position: LiaoNing,
		map: map,
		icon: image,
		animation: google.maps.Animation.DROP
		});
		var content3 = '<div>'+
					'<h1>辽宁</h1>'+
					'<div>'+
					'<p><b>在辽宁</b>，你可以查看到以下事件:</p>'+
					'<p>夏俊峰案</p>'+
					'<p>辽宁号航空母舰</p>'+
					'<p>盘锦拆迁抢劫案</p>'+
					'<p>etc.</p>'+
					'</div></div>';
		var infowindow3 = new google.maps.InfoWindow({
		content:content3,
		maxWidth: 200
		});
		google.maps.event.addListener(marker3,'mouseover',function(){
			infowindow3.open(map,marker3);
		});
		google.maps.event.addListener(marker3,'mouseout',function(){
			infowindow3.close();
		});
		google.maps.event.addListener(marker3,'click',function(){
			marker3.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function(){
				marker3.setAnimation(null);
			},2800);
				
			//handle the data
			currentLocation = "'辽宁'";
			handleDataByMap();
		});
	},400);

	//黑龙江
	setTimeout(function(){
		marker4 = new google.maps.Marker({
		position: HeiLongjiang,
		map: map,
		icon: image,
		animation: google.maps.Animation.DROP
		});
		var content4 = '<div>'+
					'<h1>黑龙江</h1>'+
					'<div>'+
					'<p><b>在黑龙江</b>，你可以查看到以下事件:</p>'+
					'<p>哈尔滨阳明滩大桥坍塌</p>'+
					'<p>最美教师张丽莉</p>'+
					'<p>哈医大血案</p>'+
					'<p>etc.</p>'+
					'</div></div>';
		var infowindow4 = new google.maps.InfoWindow({
		content:content4,
		maxWidth: 200
		});
		google.maps.event.addListener(marker4,'mouseover',function(){
			infowindow4.open(map,marker4);
		});
		google.maps.event.addListener(marker4,'mouseout',function(){
			infowindow4.close();
		});
		google.maps.event.addListener(marker4,'click',function(){
			marker4.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function(){
				marker4.setAnimation(null);
			},2800);
				
			//handle the data
			currentLocation = "'黑龙江'";
			handleDataByMap();
		});
	},400);

	//江苏
	setTimeout(function(){
		marker5 = new google.maps.Marker({
		position: JiangSu,
		map: map,
		icon: image,
		animation: google.maps.Animation.DROP
		});
		var content5 = '<div>'+
					'<h1>江苏</h1>'+
					'<div>'+
					'<p><b>在江苏</b>，你可以查看到以下事件:</p>'+
					'<p>彭宇案</p>'+
					'<p>江苏校车事故</p>'+
					'<p>苏州建筑秋裤遭吐槽</p>'+
					'<p>etc.</p>'+
					'</div></div>';
		var infowindow5 = new google.maps.InfoWindow({
		content:content5,
		maxWidth: 200
		});
		google.maps.event.addListener(marker5,'mouseover',function(){
			infowindow5.open(map,marker5);
		});
		google.maps.event.addListener(marker5,'mouseout',function(){
			infowindow5.close();
		});
		google.maps.event.addListener(marker5,'click',function(){
			marker5.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function(){
				marker5.setAnimation(null);
			},2800);
				
			//handle the data
			currentLocation = "'江苏'";
			handleDataByMap();
		});
	},400);

	//浙江
	setTimeout(function(){
		marker6 = new google.maps.Marker({
		position: ZheJiang,
		map: map,
		icon: image,
		animation: google.maps.Animation.DROP
		});
		var content6 = '<div>'+
					'<h1>浙江</h1>'+
					'<div>'+
					'<p><b>在浙江</b>，你可以查看到以下事件:</p>'+
					'<p>温州动车事故</p>'+
					'<p>钱云会事件</p>'+
					'<p>吴英案</p>'+
					'<p>etc.</p>'+
					'</div></div>';
		var infowindow6 = new google.maps.InfoWindow({
		content:content6,
		maxWidth: 200
		});
		google.maps.event.addListener(marker6,'mouseover',function(){
			infowindow6.open(map,marker6);
		});
		google.maps.event.addListener(marker6,'mouseout',function(){
			infowindow6.close();
		});
		google.maps.event.addListener(marker6,'click',function(){
			marker6.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function(){
				marker6.setAnimation(null);
			},2800);
				
			//handle the data
			currentLocation = "'浙江'";
			handleDataByMap();
		});
	},600);

	//安徽
	setTimeout(function(){
		marker7 = new google.maps.Marker({
		position: AnHui,
		map: map,
		icon: image,
		animation: google.maps.Animation.DROP
		});
		var content7 = '<div>'+
					'<h1>安徽</h1>'+
					'<div>'+
					'<p><b>在安徽</b>，你可以查看到以下事件:</p>'+
					'<p>陶汝坤毁容门</p>'+
					'</div></div>';
		var infowindow7 = new google.maps.InfoWindow({
		content:content7,
		maxWidth: 200
		});
		google.maps.event.addListener(marker7,'mouseover',function(){
			infowindow7.open(map,marker7);
		});
		google.maps.event.addListener(marker7,'mouseout',function(){
			infowindow7.close();
		});
		google.maps.event.addListener(marker7,'click',function(){
			marker7.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function(){
				marker7.setAnimation(null);
			},2800);
				
			//handle the data
			currentLocation = "'安徽'";
			handleDataByMap();
		});
	},600);

	//福建
	setTimeout(function(){
		marker8 = new google.maps.Marker({
		position: FuJian,
		map: map,
		icon: image,
		animation: google.maps.Animation.DROP
		});
		var content8 = '<div>'+
					'<h1>福建</h1>'+
					'<div>'+
					'<p><b>在福建</b>，你可以查看到以下事件:</p>'+
					'<p>活熊取胆</p>'+
					'<p>赖昌星事件</p>'+
					'</div></div>';
		var infowindow8 = new google.maps.InfoWindow({
		content:content8,
		maxWidth: 200
		});
		google.maps.event.addListener(marker8,'mouseover',function(){
			infowindow8.open(map,marker8);
		});
		google.maps.event.addListener(marker8,'mouseout',function(){
			infowindow8.close();
		});
		google.maps.event.addListener(marker8,'click',function(){
			marker8.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function(){
				marker8.setAnimation(null);
			},2800);
				
			//handle the data
			currentLocation = "'福建'";
			handleDataByMap();
		});
	},600);

	//江西
	setTimeout(function(){
		marker9 = new google.maps.Marker({
		position: JiangXi,
		map: map,
		icon: image,
		animation: google.maps.Animation.DROP
		});
		var content9 = '<div>'+
					'<h1>江西</h1>'+
					'<div>'+
					'<p><b>在江西</b>，你可以查看到以下事件:</p>'+
					'<p>钱明奇事件</p>'+
					'<p>最美司机吴斌</p>'+
					'<p>南昌大桥百人自杀</p>'+
					'<p>etc.</p>'+
					'</div></div>';
		var infowindow9 = new google.maps.InfoWindow({
		content:content9,
		maxWidth: 200
		});
		google.maps.event.addListener(marker9,'mouseover',function(){
			infowindow9.open(map,marker9);
		});
		google.maps.event.addListener(marker9,'mouseout',function(){
			infowindow9.close();
		});
		google.maps.event.addListener(marker9,'click',function(){
			marker9.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function(){
				marker9.setAnimation(null);
			},2800);
				
			//handle the data
			currentLocation = "'江西'";
			handleDataByMap();
		});
	},600);

	//山东
	setTimeout(function(){
		marker10 = new google.maps.Marker({
		position: ShanDong,
		map: map,
		icon: image,
		animation: google.maps.Animation.DROP
		});
		var content10 = '<div>'+
					'<h1>山东</h1>'+
					'<div>'+
					'<p><b>在山东</b>，你可以查看到以下事件:</p>'+
					'<p>少年被充气泵塞肛门穿孔</p>'+
					'<p>菜农自杀</p>'+
					'<p>泰安袭警察</p>'+
					'<p>etc.</p>'+
					'</div></div>';
		var infowindow10 = new google.maps.InfoWindow({
		content:content10,
		maxWidth: 200
		});
		google.maps.event.addListener(marker10,'mouseover',function(){
			infowindow10.open(map,marker10);
		});
		google.maps.event.addListener(marker10,'mouseout',function(){
			infowindow10.close();
		});
		google.maps.event.addListener(marker10,'click',function(){
			marker10.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function(){
				marker10.setAnimation(null);
			},2800);
				
			//handle the data
			currentLocation = "'山东'";
			handleDataByMap();
		});
	},600);

	//河南
	setTimeout(function(){
		marker11 = new google.maps.Marker({
		position: HeNan,
		map: map,
		icon: image,
		animation: google.maps.Animation.DROP
		});
		var content11 = '<div>'+
					'<h1>河南</h1>'+
					'<div>'+
					'<p><b>在河南</b>，你可以查看到以下事件:</p>'+
					'<p>河南周口平坟</p>'+
					'<p>天价过路费</p>'+
					'<p>河南性奴案</p>'+
					'<p>etc.</p>'+
					'</div></div>';
		var infowindow11 = new google.maps.InfoWindow({
		content:content11,
		maxWidth: 200
		});
		google.maps.event.addListener(marker11,'mouseover',function(){
			infowindow11.open(map,marker11);
		});
		google.maps.event.addListener(marker11,'mouseout',function(){
			infowindow11.close();
		});
		google.maps.event.addListener(marker11,'click',function(){
			marker11.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function(){
				marker11.setAnimation(null);
			},2800);
				
			//handle the data
			currentLocation = "'河南'";
			handleDataByMap();
		});
	},800);

	//湖北
	setTimeout(function(){
		marker12 = new google.maps.Marker({
		position: HuBei,
		map: map,
		icon: image,
		animation: google.maps.Animation.DROP
		});
		var content12 = '<div>'+
					'<h1>湖北</h1>'+
					'<div>'+
					'<p><b>在湖北</b>，你可以查看到以下事件:</p>'+
					'<p>徐武事件</p>'+
					'<p>麻城自带课桌上学</p>'+
					'<p>日本游客丢自行车</p>'+
					'<p>etc.</p>'+
					'</div></div>';
		var infowindow12 = new google.maps.InfoWindow({
		content:content12,
		maxWidth: 200
		});
		google.maps.event.addListener(marker12,'mouseover',function(){
			infowindow12.open(map,marker12);
		});
		google.maps.event.addListener(marker12,'mouseout',function(){
			infowindow12.close();
		});
		google.maps.event.addListener(marker12,'click',function(){
			marker12.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function(){
				marker12.setAnimation(null);
			},2800);
				
			//handle the data
			currentLocation = "'湖北'";
			handleDataByMap();
		});
	},800);

	//湖南
	setTimeout(function(){
		marker13 = new google.maps.Marker({
		position: HuNan,
		map: map,
		icon: image,
		animation: google.maps.Animation.DROP
		});
		var content13 = '<div>'+
					'<h1>湖南</h1>'+
					'<div>'+
					'<p><b>在湖南</b>，你可以查看到以下事件:</p>'+
					'<p>切糕事件</p>'+
					'<p>黄金大米</p>'+
					'<p>湖南高考提前收卷</p>'+
					'<p>etc.</p>'+
					'</div></div>';
		var infowindow13 = new google.maps.InfoWindow({
		content:content13,
		maxWidth: 200
		});
		google.maps.event.addListener(marker13,'mouseover',function(){
			infowindow13.open(map,marker13);
		});
		google.maps.event.addListener(marker13,'mouseout',function(){
			infowindow13.close();
		});
		google.maps.event.addListener(marker13,'click',function(){
			marker13.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function(){
				marker13.setAnimation(null);
			},2800);
				
			//handle the data
			currentLocation = "'湖南'";
			handleDataByMap();
		});
	},800);

	//广东
	setTimeout(function(){
		marker14 = new google.maps.Marker({
		position: GuangDong,
		map: map,
		icon: image,
		animation: google.maps.Animation.DROP
		});
		var content14 = '<div>'+
					'<h1>广东</h1>'+
					'<div>'+
					'<p><b>在广东</b>，你可以查看到以下事件:</p>'+
					'<p>乌坎事件</p>'+
					'<p>王老吉商标之争</p>'+
					'<p>南航空姐被打事件</p>'+
					'<p>etc.</p>'+
					'</div></div>';
		var infowindow14 = new google.maps.InfoWindow({
		content:content14,
		maxWidth: 200
		});
		google.maps.event.addListener(marker14,'mouseover',function(){
			infowindow14.open(map,marker14);
		});
		google.maps.event.addListener(marker14,'mouseout',function(){
			infowindow14.close();
		});
		google.maps.event.addListener(marker14,'click',function(){
			marker14.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function(){
				marker14.setAnimation(null);
			},2800);
				
			//handle the data
			currentLocation = "'广东'";
			handleDataByMap();
		});
	},800);

	//海南
	setTimeout(function(){
		marker15 = new google.maps.Marker({
		position: HaiNan,
		map: map,
		icon: image,
		animation: google.maps.Animation.DROP
		});
		var content15 = '<div>'+
					'<h1>海南</h1>'+
					'<div>'+
					'<p><b>在海南</b>，你可以查看到以下事件:</p>'+
					'<p>三亚宰客</p>'+
					'</div></div>';
		var infowindow15 = new google.maps.InfoWindow({
		content:content15,
		maxWidth: 200
		});
		google.maps.event.addListener(marker15,'mouseover',function(){
			infowindow15.open(map,marker15);
		});
		google.maps.event.addListener(marker15,'mouseout',function(){
			infowindow15.close();
		});
		google.maps.event.addListener(marker15,'click',function(){
			marker15.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function(){
				marker15.setAnimation(null);
			},2800);
				
			//handle the data
			currentLocation = "'海南'";
			handleDataByMap();
		});
	},800);

	//四川
	setTimeout(function(){
		marker16 = new google.maps.Marker({
		position: SiChuan,
		map: map,
		icon: image,
		animation: google.maps.Animation.DROP
		});
		var content16 = '<div>'+
					'<h1>四川</h1>'+
					'<div>'+
					'<p><b>在四川</b>，你可以查看到以下事件:</p>'+
					'<p>什邡事件</p>'+
					'<p>成都富士康爆炸</p>'+
					'<p>会理领导照PS事件</p>'+
					'<p>etc.</p>'+
					'</div></div>';
		var infowindow16 = new google.maps.InfoWindow({
		content:content16,
		maxWidth: 200
		});
		google.maps.event.addListener(marker16,'mouseover',function(){
			infowindow16.open(map,marker16);
		});
		google.maps.event.addListener(marker16,'mouseout',function(){
			infowindow16.close();
		});
		google.maps.event.addListener(marker16,'click',function(){
			marker16.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function(){
				marker16.setAnimation(null);
			},2800);
				
			//handle the data
			currentLocation = "'四川'";
			handleDataByMap();
		});
	},1000);

	//贵州
	setTimeout(function(){
		marker17 = new google.maps.Marker({
		position: GuiZhou,
		map: map,
		icon: image,
		animation: google.maps.Animation.DROP
		});
		var content17 = '<div>'+
					'<h1>贵州</h1>'+
					'<div>'+
					'<p><b>在贵州</b>，你可以查看到以下事件:</p>'+
					'<p>尤美美事件</p>'+
					'<p>毕节五儿童之死</p>'+
					'</div></div>';
		var infowindow17 = new google.maps.InfoWindow({
		content:content17,
		maxWidth: 200
		});
		google.maps.event.addListener(marker17,'mouseover',function(){
			infowindow17.open(map,marker17);
		});
		google.maps.event.addListener(marker17,'mouseout',function(){
			infowindow17.close();
		});
		google.maps.event.addListener(marker17,'click',function(){
			marker17.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function(){
				marker17.setAnimation(null);
			},2800);
				
			//handle the data
			currentLocation = "'贵州'";
			handleDataByMap();
		});
	},1000);

	//云南
	setTimeout(function(){
		marker18 = new google.maps.Marker({
		position: YunNan,
		map: map,
		icon: image,
		animation: google.maps.Animation.DROP
		});
		var content18 = '<div>'+
					'<h1>云南</h1>'+
					'<div>'+
					'<p><b>在云南</b>，你可以查看到以下事件:</p>'+
					'<p>彝良地震</p>'+
					'<p>云南地震</p>'+
					'<p>李昌奎事件</p>'+
					'<p>etc.</p>'+
					'</div></div>';
		var infowindow18 = new google.maps.InfoWindow({
		content:content18,
		maxWidth: 200
		});
		google.maps.event.addListener(marker18,'mouseover',function(){
			infowindow18.open(map,marker18);
		});
		google.maps.event.addListener(marker18,'mouseout',function(){
			infowindow18.close();
		});
		google.maps.event.addListener(marker18,'click',function(){
			marker18.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function(){
				marker18.setAnimation(null);
			},2800);
				
			//handle the data
			currentLocation = "'云南'";
			handleDataByMap();
		});
	},1000);

	//陕西
	setTimeout(function(){
		marker19 = new google.maps.Marker({
		position: SanXi,
		map: map,
		icon: image,
		animation: google.maps.Animation.DROP
		});
		var content19 = '<div>'+
					'<h1>陕西</h1>'+
					'<div>'+
					'<p><b>在陕西</b>，你可以查看到以下事件:</p>'+
					'<p>药家鑫事件</p>'+
					'<p>微笑表叔</p>'+
					'<p>陕西孕妇遭引产</p>'+
					'<p>etc.</p>'+
					'</div></div>';
		var infowindow19 = new google.maps.InfoWindow({
		content:content19,
		maxWidth: 200
		});
		google.maps.event.addListener(marker19,'mouseover',function(){
			infowindow19.open(map,marker19);
		});
		google.maps.event.addListener(marker19,'mouseout',function(){
			infowindow19.close();
		});
		google.maps.event.addListener(marker19,'click',function(){
			marker19.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function(){
				marker19.setAnimation(null);
			},2800);
				
			//handle the data
			currentLocation = "'陕西'";
			handleDataByMap();
		});
	},1000);

	//甘肃
	setTimeout(function(){
		marker20 = new google.maps.Marker({
		position: GanSu,
		map: map,
		icon: image,
		animation: google.maps.Animation.DROP
		});
		var content20 = '<div>'+
					'<h1>甘肃</h1>'+
					'<div>'+
					'<p><b>在甘肃</b>，你可以查看到以下事件:</p>'+
					'<p>神州九号</p>'+
					'<p>神州八号</p>'+
					'<p>甘肃校车事故</p>'+
					'<p>etc.</p>'+
					'</div></div>';
		var infowindow20 = new google.maps.InfoWindow({
		content:content20,
		maxWidth: 200
		});
		google.maps.event.addListener(marker20,'mouseover',function(){
			infowindow20.open(map,marker20);
		});
		google.maps.event.addListener(marker20,'mouseout',function(){
			infowindow20.close();
		});
		google.maps.event.addListener(marker20,'click',function(){
			marker20.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function(){
				marker20.setAnimation(null);
			},2800);
				
			//handle the data
			currentLocation = "'甘肃'";
			handleDataByMap();
		});
	},1000);

	//青海
	setTimeout(function(){
		marker21= new google.maps.Marker({
		position: QingHai,
		map: map,
		icon: image,
		animation: google.maps.Animation.DROP
		});
		var content21= '<div>'+
					'<h1>青海</h1>'+
					'<div>'+
					'<p><b>在青海</b>，你可以查看到以下事件:</p>'+
					'<p>玉树地震</p>'+
					'</div></div>';
		var infowindow21 = new google.maps.InfoWindow({
		content:content21,
		maxWidth: 200
		});
		google.maps.event.addListener(marker21,'mouseover',function(){
			infowindow21.open(map,marker21);
		});
		google.maps.event.addListener(marker21,'mouseout',function(){
			infowindow21.close();
		});
		google.maps.event.addListener(marker21,'click',function(){
			marker21.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function(){
				marker21.setAnimation(null);
			},2800);
				
			//handle the data
			currentLocation = "'青海'";
			handleDataByMap();
		});
	},1200);

	//台湾
	setTimeout(function(){
		markerTW = new google.maps.Marker({
		position: TaiWan,
		map: map,
		icon: image,
		animation: google.maps.Animation.DROP
		});
		var contentTW= '<div>'+
					'<h1>台湾</h1>'+
					'<div>'+
					'<p><b>在台湾</b>，你可以查看到以下事件:</p>'+
					'<p>台湾塑化剂</p>'+
					'<p>大S汪小菲大婚</p>'+
					'<p>张兰改国籍</p>'+
					'<p>etc.</p>'+
					'</div></div>';
		var infowindowTW = new google.maps.InfoWindow({
		content:contentTW,
		maxWidth: 200
		});
		google.maps.event.addListener(markerTW,'mouseover',function(){
			infowindowTW.open(map,markerTW);
		});
		google.maps.event.addListener(markerTW,'mouseout',function(){
			infowindowTW.close();
		});
		google.maps.event.addListener(markerTW,'click',function(){
			markerTW.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function(){
				markerTW.setAnimation(null);
			},2800);
				
			//handle the data
			currentLocation = "'台湾'";
			handleDataByMap();
		});
	},1200);

	//香港
	setTimeout(function(){
		markerXG = new google.maps.Marker({
		position: XiangGang,
		map: map,
		icon: image,
		animation: google.maps.Animation.DROP
		});
		var contentXG= '<div>'+
					'<h1>香港</h1>'+
					'<div>'+
					'<p><b>在香港</b>，你可以查看到以下事件:</p>'+
					'<p>狼爸教育</p>'+
					'</div></div>';
		var infowindowXG = new google.maps.InfoWindow({
		content:contentXG,
		maxWidth: 200
		});
		google.maps.event.addListener(markerXG,'mouseover',function(){
			infowindowXG.open(map,markerXG);
		});
		google.maps.event.addListener(markerXG,'mouseout',function(){
			infowindowXG.close();
		});
		google.maps.event.addListener(markerXG,'click',function(){
			markerXG.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function(){
				markerXG.setAnimation(null);
			},2800);
				
			//handle the data
			currentLocation = "'香港'";
			handleDataByMap();
		});
	},1200);

	//美国
	setTimeout(function(){
		markerA = new google.maps.Marker({
		position: MeiGuo,
		map: map,
		icon: image,
		animation: google.maps.Animation.DROP
		});
		var contentA= '<div>'+
					'<h1>美国</h1>'+
					'<div>'+
					'<p><b>这些事件发生在美国</b></p>'+
					'<p>乔布斯逝世</p>'+
					'<p>美国大选</p>'+
					'<p>习近平访美</p>'+
					'</div></div>';
		var infowindowA = new google.maps.InfoWindow({
		content:contentA,
		maxWidth: 200
		});
		google.maps.event.addListener(markerA,'mouseover',function(){
			infowindowA.open(map,markerA);
		});
		google.maps.event.addListener(markerA,'mouseout',function(){
			infowindowA.close();
		});
		google.maps.event.addListener(markerA,'click',function(){
			markerA.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function(){
				markerA.setAnimation(null);
			},2800);
				
			//handle the data
			currentLocation = "'美国'";
			handleDataByMap();
		});
	},1400);

	//伦敦
	setTimeout(function(){
		markerB = new google.maps.Marker({
		position: London,
		map: map,
		icon: image,
		animation: google.maps.Animation.DROP
		});
		var contentB= '<div>'+
					'<h1>伦敦</h1>'+
					'<div>'+
					'<p><b>这些事件发生在伦敦</b></p>'+
					'<p>伦敦奥运会</p>'+
					'</div></div>';
		var infowindowB = new google.maps.InfoWindow({
		content:contentB,
		maxWidth: 200
		});
		google.maps.event.addListener(markerB,'mouseover',function(){
			infowindowB.open(map,markerB);
		});
		google.maps.event.addListener(markerB,'mouseout',function(){
			infowindowB.close();
		});
		google.maps.event.addListener(markerB,'click',function(){
			markerB.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function(){
				markerB.setAnimation(null);
			},2800);
				
			//handle the data
			currentLocation = "'伦敦'";
			handleDataByMap();
		});
	},1400);

	//利比亚
	setTimeout(function(){
		markerC = new google.maps.Marker({
		position: LiBiya,
		map: map,
		icon: image,
		animation: google.maps.Animation.DROP
		});
		var contentC= '<div>'+
					'<h1>利比亚</h1>'+
					'<div>'+
					'<p><b>这些事件发生在利比亚</b></p>'+
					'<p>利比亚战争</p>'+
					'<p>卡扎菲身亡</p>'+
					'</div></div>';
		var infowindowC = new google.maps.InfoWindow({
		content:contentC,
		maxWidth: 200
		});
		google.maps.event.addListener(markerC,'mouseover',function(){
			infowindowC.open(map,markerC);
		});
		google.maps.event.addListener(markerC,'mouseout',function(){
			infowindowC.close();
		});
		google.maps.event.addListener(markerC,'click',function(){
			markerC.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function(){
				markerC.setAnimation(null);
			},2800);
				
			//handle the data
			currentLocation = "'利比亚'";
			handleDataByMap();
		});
	},1400);

	//埃及
	setTimeout(function(){
		markerD = new google.maps.Marker({
		position: AiJi,
		map: map,
		icon: image,
		animation: google.maps.Animation.DROP
		});
		var contentD= '<div>'+
					'<h1>埃及<h1>'+
					'<div>'+
					'<p><b>这些事件发生在埃及b></p>'+
					'<p>埃及骚乱</p>'+
					'</div></div>';
		var infowindowD = new google.maps.InfoWindow({
		content:contentD,
		maxWidth: 200
		});
		google.maps.event.addListener(markerD,'mouseover',function(){
			infowindowD.open(map,markerD);
		});
		google.maps.event.addListener(markerD,'mouseout',function(){
			infowindowD.close();
		});
		google.maps.event.addListener(markerD,'click',function(){
			markerD.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function(){
				markerD.setAnimation(null);
			},2800);
				
			//handle the data
			currentLocation = "'埃及'";
			handleDataByMap();
		});
	},1400);

	//日本
	setTimeout(function(){
		markerE = new google.maps.Marker({
		position: Japan,
		map: map,
		icon: image,
		animation: google.maps.Animation.DROP
		});
		var contentE= '<div>'+
					'<h1>日本</h1>'+
					'<div>'+
					'<p><b>这些事件发生在日本</b></p>'+
					'<p>安倍晋三当选日本总统</p>'+
					'<p>日本地震</p>'+
					'</div></div>';
		var infowindowE = new google.maps.InfoWindow({
		content:contentE,
		maxWidth: 200
		});
		google.maps.event.addListener(markerE,'mouseover',function(){
			infowindowE.open(map,markerE);
		});
		google.maps.event.addListener(markerE,'mouseout',function(){
			infowindowE.close();
		});
		google.maps.event.addListener(markerE,'click',function(){
			markerE.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function(){
				markerE.setAnimation(null);
			},2800);
				
			//handle the data
			currentLocation = "'日本'";
			handleDataByMap();
		});
	},1400);

	//朝鲜
	setTimeout(function(){
		markerF = new google.maps.Marker({
		position: ChaoXuan,
		map: map,
		icon: image,
		animation: google.maps.Animation.DROP
		});
		var contentF= '<div>'+
					'<h1>朝鲜</h1>'+
					'<div>'+
					'<p><b>这些事件发生在朝鲜</b></p>'+
					'<p>朝鲜扣押中国渔船</p>'+
					'<p>金正日逝世</p>'+
					'</div></div>';
		var infowindowF = new google.maps.InfoWindow({
		content:contentF,
		maxWidth: 200
		});
		google.maps.event.addListener(markerF,'mouseover',function(){
			infowindowF.open(map,markerF);
		});
		google.maps.event.addListener(markerF,'mouseout',function(){
			infowindowF.close();
		});
		google.maps.event.addListener(markerF,'click',function(){
			markerF.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function(){
				markerF.setAnimation(null);
			},2800);
				
			//handle the data
			currentLocation = "'朝鲜'";
			handleDataByMap();
		});
	},1400);

	//巴基斯坦
	setTimeout(function(){
		markerG = new google.maps.Marker({
		position: BaJst,
		map: map,
		icon: image,
		animation: google.maps.Animation.DROP
		});
		var contentG= '<div>'+
					'<h1>巴基斯坦</h1>'+
					'<div>'+
					'<p><b>这些事件发生在巴基斯坦</b></p>'+
					'<p>本拉登身亡</p>'+
					'</div></div>';
		var infowindowG = new google.maps.InfoWindow({
		content:contentG,
		maxWidth: 200
		});
		google.maps.event.addListener(markerG,'mouseover',function(){
			infowindowG.open(map,markerG);
		});
		google.maps.event.addListener(markerG,'mouseout',function(){
			infowindowG.close();
		});
		google.maps.event.addListener(markerG,'click',function(){
			markerG.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function(){
				markerG.setAnimation(null);
			},2800);
				
			//handle the data
			currentLocation = "'巴基斯坦'";
			handleDataByMap();
		});
	},1400);

	//韩国
	setTimeout(function(){
		markerH = new google.maps.Marker({
		position: Korea,
		map: map,
		icon: image,
		animation: google.maps.Animation.DROP
		});
		var contentH= '<div>'+
					'<h1>韩国</h1>'+
					'<div>'+
					'<p><b>这些事件发生在韩国</b></p>'+
					'<p>朴槿惠当选韩国总统</p>'+
					'</div></div>';
		var infowindowH = new google.maps.InfoWindow({
		content:contentH,
		maxWidth: 200
		});
		google.maps.event.addListener(markerH,'mouseover',function(){
			infowindowH.open(map,markerH);
		});
		google.maps.event.addListener(markerH,'mouseout',function(){
			infowindowH.close();
		});
		google.maps.event.addListener(markerH,'click',function(){
			markerH.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function(){
				markerH.setAnimation(null);
			},2800);
				
			//handle the data
			currentLocation = "'韩国'";
			handleDataByMap();
		});
	},1400);

	//法国
	setTimeout(function(){
		markerI = new google.maps.Marker({
		position: French,
		map: map,
		icon: image,
		animation: google.maps.Animation.DROP
		});
		var contentI= '<div>'+
					'<h1>法国</h1>'+
					'<div>'+
					'<p><b>这些事件发生在法国</b></p>'+
					'<p>李娜法网决赛</p>'+
					'</div></div>';
		var infowindowI = new google.maps.InfoWindow({
		content:contentI,
		maxWidth: 200
		});
		google.maps.event.addListener(markerI,'mouseover',function(){
			infowindowI.open(map,markerI);
		});
		google.maps.event.addListener(markerI,'mouseout',function(){
			infowindowI.close();
		});
		google.maps.event.addListener(markerI,'click',function(){
			markerI.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function(){
				markerI.setAnimation(null);
			},2800);
				
			//handle the data
			currentLocation = "'法国'";
			handleDataByMap();
		});
	},1400);

	//瑞典
	setTimeout(function(){
		markerJ = new google.maps.Marker({
		position: RuiDian,
		map: map,
		icon: image,
		animation: google.maps.Animation.DROP
		});
		var contentJ= '<div>'+
					'<h1>瑞典</h1>'+
					'<div>'+
					'<p><b>这些事件发生在瑞典</b></p>'+
					'<p>莫言获诺贝尔文学奖</p>'+
					'</div></div>';
		var infowindowJ = new google.maps.InfoWindow({
		content:contentJ,
		maxWidth: 200
		});
		google.maps.event.addListener(markerJ,'mouseover',function(){
			infowindowJ.open(map,markerJ);
		});
		google.maps.event.addListener(markerJ,'mouseout',function(){
			infowindowJ.close();
		});
		google.maps.event.addListener(markerJ,'click',function(){
			markerJ.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function(){
				markerJ.setAnimation(null);
			},2800);
				
			//handle the data
			currentLocation = "'瑞典'";
			handleDataByMap();
		});
	},1400);

	//菲律宾
	setTimeout(function(){
		markerK = new google.maps.Marker({
		position: FeiLvb,
		map: map,
		icon: image,
		animation: google.maps.Animation.DROP
		});
		var contentK= '<div>'+
					'<h1>菲律宾</h1>'+
					'<div>'+
					'<p><b>这些事件发生在菲律宾</b></p>'+
					'<p>菲律宾人质事件</p>'+
					'</div></div>';
		var infowindowK = new google.maps.InfoWindow({
		content:contentK,
		maxWidth: 200
		});
		google.maps.event.addListener(markerK,'mouseover',function(){
			infowindowK.open(map,markerK);
		});
		google.maps.event.addListener(markerK,'mouseout',function(){
			infowindowK.close();
		});
		google.maps.event.addListener(markerK,'click',function(){
			markerK.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function(){
				markerK.setAnimation(null);
			},2800);
				
			//handle the data
			currentLocation = "'菲律宾'";
			handleDataByMap();
		});
	},1400);

	//中国
	setTimeout(function(){
		Mark1 = new google.maps.Marker({
			position: ZhongGuo,
			map: map,
			icon: image1,
			animation: google.maps.Animation.DROP
		});
		var Content1= '<div>'+
					'<h1>这些事件发生在中国各地</h1>'+
					'<div>'+
					'<p>十八大召开</p>'+
					'<p>两会召开</p>'+
					'<p>城管打人系列事件</p>'+
					'<p>etc.</p>'+
					'</div></div>';
		var Infowindow1 = new google.maps.InfoWindow({
		content:Content1,
		maxWidth: 200
		});
		google.maps.event.addListener(Mark1,'mouseover',function(){
			Infowindow1.open(map,Mark1);
		});
		google.maps.event.addListener(Mark1,'mouseout',function(){
			Infowindow1.close();
		});
		google.maps.event.addListener(Mark1,'click',function(){
			Mark1.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function(){
				Mark1.setAnimation(null);
			},2800);
			currentLocation = "'中国'";
			handleDataByMap();
		});
	},1600);

	//互联网
	setTimeout(function(){
		Mark2 = new google.maps.Marker({
			position: Internet,
			map: map,
			icon: image2,
			animation: google.maps.Animation.DROP
		});
		var Content2= '<div>'+
					'<h1>这些事件发生在互联网上</h1>'+
					'<div>'+
					'<p>郭美美事件</p>'+
					'<p>方舟子VS韩寒</p>'+
					'<p>微博打拐解救儿童</p>'+
					'<p>etc.</p>'+
					'</div></div>';
		var Infowindow2 = new google.maps.InfoWindow({
		content:Content2,
		maxWidth: 200
		});
		google.maps.event.addListener(Mark2,'mouseover',function(){
			Infowindow2.open(map,Mark2);
		});
		google.maps.event.addListener(Mark2,'mouseout',function(){
			Infowindow2.close();
		});
		google.maps.event.addListener(Mark2,'click',function(){
			Mark2.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function(){
				Mark2.setAnimation(null);
			},2800);
			currentLocation = "'互联网'";
			handleDataByMap();
		});
	},1600);

	setTimeout(function(){
		Mark3 = new google.maps.Marker({
			position: MeiGonghe,
			map: map,
			icon: image,
			title: '湄公河金三角',
			animation: google.maps.Animation.DROP
		});
		google.maps.event.addListener(Mark3,'click',function(){
			Mark3.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function(){
				Mark3.setAnimation(null);
			},2800);
			currentLocation = "'湄公河金三角'";
			handleDataByMap();
		});
	},1600);
	setTimeout(function(){
		Mark4 = new google.maps.Marker({
			position: DiaoYudao,
			map: map,
			icon: image,
			title: '钓鱼岛',
			animation: google.maps.Animation.DROP
		});
		google.maps.event.addListener(Mark4,'click',function(){
			Mark4.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function(){
				Mark4.setAnimation(null);
			},2800);
			currentLocation = "'钓鱼岛'";
			handleDataByMap();
		});
	},1600);
	setTimeout(function(){
		Mark5 = new google.maps.Marker({
			position: HuangYandao,
			map: map,
			icon: image,
			title: '黄岩岛',
			animation: google.maps.Animation.DROP
		});
		google.maps.event.addListener(Mark5,'click',function(){
			Mark5.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function(){
				Mark5.setAnimation(null);
			},2800);
			currentLocation = "'黄岩岛'";
			handleDataByMap();
		});
	},1600);


}//end positionAndEvent()

function handleDataByMap() {
	var url = "https://www.googleapis.com/fusiontables/v1/query?key=AIzaSyD05csCTRNM5I7CYHkbxCeQJF0UKRs1bVA&typed=false&sql=";
	var queryText = "SELECT EventId, Title, Information, Hot,ImgA FROM 1hB2u2DZ_sJV1Zg_xHYy9Gdy9R-mlkQ96g30hrYk where EventLocation = "+currentLocation+" ORDER BY Hot DESC";
	$.post(url+queryText,{},updateEventByMap);
}

function updateEventByMap(data) {
	var eventList = "";
	for (var idx in data.rows){
		var row = data.rows[idx];
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
    $("#main_info").html(eventList);
}

google.maps.event.addDomListener(window, 'load', initialize);