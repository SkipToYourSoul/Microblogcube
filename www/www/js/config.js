/**
 * 先于其它文件加载
 */
var Map = {
	newInstance : function() {
		var map = {};
		map.length = 0;

		map.contains = function(mid) {
			return this.hasOwnProperty(mid);
		};

		map.put = function(key, value) {
			if (this.contains(key) == false)
				this.length = this.length + 1;
			this[key] = value;
			return this;
		};

		map.get = function(key, defValue) {
			if (this.contains(key))
				return this[key];
			else
				return defValue;
		};

		map.del = function(mid) {
			if (this.contains(key) == true) {
				this.length = this.length - 1;
				delete this[mid];
			}
		};

		map.isEmpty = function() {
			return this.length == 0;
		};

		map.keySet = function() {
			var set = [];
			for ( var key in this) {
				if (typeof this[key] != "function" && key != "length") {
					set.push(key);
				}
			}
			return set;
		};
		return map;
	}
};

/**
 * 默认的得到的是online的配置
 */
var Config = {
	Build : function() {
		var map = Map.newInstance();
		// map.put("edge_index_key", "AIzaSyDkbrUMUcTVEcuYGJX4apLqBy-ErgvfZxQ");
		// map.put("edge_index_docid","1wL2b2iODMny04mHsJt8algY2UlgNNyOoXIMhXiY");
		//map.put("edge_index_key", "AIzaSyD4THRF43kJ711SEbMoh8mE3a3gTkG7GVg");
		//map.put("edge_index_docid", "1tvszwnJQL0qrb1ewZ9YXrL9e5XWNS6faMeoTTPo");
		map.put("edge_index_key", "AIzaSyD4THRF43kJ711SEbMoh8mE3a3gTkG7GVg");
		map.put("edge_index_docid", "1QiPIGO8ft7-x_raEz-mf6Lv43YD5HI5qKPUur2A");
		
		map.put('brief_info', "1hB2u2DZ_sJV1Zg_xHYy9Gdy9R-mlkQ96g30hrYk");
		map.put("brief_key", "AIzaSyD4THRF43kJ711SEbMoh8mE3a3gTkG7GVg");
		map.put("primary_store_key", "AIzaSyD4THRF43kJ711SEbMoh8mE3a3gTkG7GVg");

		map.put("tf_idf_docid", "1pPig4kobCIVM_joCEF36XI2_AVzketNb；EcIcSMY");
		map.put("tf_idf__key", "AIzaSyCY3WWuJ9Q45KQ9OkiTLBbSro43cIwJhG0");

		// 国外访问
		// 新浪微博的授权url,根据后台url更改
		/*
		 * map.put("userinfo_server", "http://sinaoauth1.appspot.com/");
		 * map.put("figure_data_server",
		 * "http://www.google.com/fusiontables/gvizdata");
		 * map.put('ftable_data_server',
		 * "https://www.googleapis.com/fusiontables/v1/query")
		 * map.put('search_server', "http://mcubesearchapi.appspot.com/search")
		 */
		// 国内访问
		map.put("figure_data_server",
				"http://database.ecnu.edu.cn/microblogcube/proxy/gqldata");
		map.put('ftable_data_server',
				"http://database.ecnu.edu.cn/microblogcube/proxy/gvizdata")
		map.put('search_server',
				"http://database.ecnu.edu.cn/microblogcube/proxy/search")
		map
				.put("userinfo_server",
						"http://database.ecnu.edu.cn/microblogcube/proxy/");

		// 供测试
		//map.put("figure_data_server", "http://127.0.0.1:10000/gqldata");
		//map.put('ftable_data_server', "http://127.0.0.1:10000/gvizdata")
		//map.put('search_server', "http://127.0.0.1:10000/search")
		//map.put("userinfo_server", "http://127.0.0.1:10000/");
		return map;
	}
}

var onlineConfig = Config.Build();
var config = onlineConfig;
var debugConfig = null;

function initConfig() {
	debugConfig = Config.Build().put("edge_index_key",
			"AIzaSyDk6XfOEFi5h0zJkNDUkk7qaIHg5_PcVHs").put('brief_info',
			"1hB2u2DZ_sJV1Zg_xHYy9Gdy9R-mlkQ96g30hrYk").put('userinfo_server',
			"http://localhost:11080/");
	config = debugConfig;
}
// initConfig();

// var key="AIzaSyAN-bJ7UqH36Zdwgp9QAFENpeglLdUt3yk" ;
// var key = "AIzaSyCshqrYM9iJdFQyMK2cjrIAyF2QbyIWz_w";
