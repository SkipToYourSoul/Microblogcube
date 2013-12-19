function dataTableAdapter(dataTable){
    var ret={"rows":[]};
    for (i =0;i <dataTable.getNumberOfRows();i++){
	var row = [];
	for (j = 0; j < dataTable.getNumberOfColumns(); j++){
	    row.push(dataTable.getValue(i,j));
	}
	ret.rows.push(row);
    }
    return ret;
}
