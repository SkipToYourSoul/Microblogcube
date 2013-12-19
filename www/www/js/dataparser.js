function parseDate(sData) {
	return new Date(sData);
}

function parseString(sData) {
	return sData;
}

// 类型->解析函数的映射
var parsers = {
	"number" : parseInt,
	"datetime" : parseDate,
	"string" : parseString
};

/*
 * args: jsonData:google返回的数据 columns:[类型，列名]数组 return: DataTable类型
 */
function dTableToArray(dataTable) {
	var data = []
	for ( var i = 0; i < dataTable.getNumberOfRows(); i++) {
		var row = [];
		for ( var j = 0; j < dataTable.getNumberOfColumns(); j++) {
			row.push(dataTable.getValue(i, j));
		}
		data.push(row);
	}
	return data;
}

/*
 * args: jsonData:google返回的数据 columns:[类型，列名]数组 return: DataTable类型
 */
function parseData(jsonData, columns) {
	var data = new google.visualization.DataTable();
	for ( var idx in columns) {
		data.addColumn(columns[idx][0], columns[idx][1]);
	}
	for ( var idx in jsonData.rows) {
		var row = jsonData.rows[idx];
		var newRow = [];
		for ( var cIdx in columns) {
			newRow.push(parsers[columns[cIdx][0]](row[cIdx]));
		}
		data.addRow(newRow);
	}
	return data;
}

/*
 * args: jsonData:google返回的数据 columns:[类型，列名]数组 return: DataTable类型
 */
function parseAndTransData(jsonData, columns, transMap) {
	var data = new google.visualization.DataTable();
	for ( var idx in columns) {
		data.addColumn(columns[idx][0], columns[idx][1]);
	}
	for ( var idx in jsonData.rows) {
		var row = jsonData.rows[idx];
		var newRow = [];
		for ( var cIdx in columns) {
			var datum = parsers[columns[cIdx][0]](row[cIdx]);
			if (transMap.hasOwnProperty(datum))
				newRow.push(transMap[datum]);
			else
				newRow.push(datum);
		}
		data.addRow(newRow);
	}
	return data;
}
