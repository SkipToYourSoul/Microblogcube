/**
 * Created with JetBrains WebStorm.
 * User: LijingYe
 * Date: 13-7-31
 * Time: 下午8:58
 * To change this template use File | Settings | File Templates.
 */

var id2HtmlMap = {"nav_emo":"event1_3.html?eventId=",
		  "nav_info":"event1_1.html?eventId=",
		  "nav_trans":"event1_2.html?eventId=",
		  "nav_map":"event1_4.html?eventId="};

$(document).ready(function(){
    $(".nav_element").each(function(){
        var filename="img/"+$(this).attr('id')+".jpg";
        $(this).find('a').find('img').attr('src',filename);
	var id = $(this).attr('id');
	if (id2HtmlMap.hasOwnProperty(id)) {
	    $(this).find('a').attr('href', id2HtmlMap[id]+eventId)
	}
    });
    $(".nav_selected").each(function(){
        var filename="img/"+$(this).attr('id')+"_selected.jpg";
        $(this).find('a').attr('href',"#");
	var id = $(this).attr('id');
	$(this).find('a').attr('href', id2HtmlMap[id]+eventId)
        $(this).find('a').find('img').attr('src',filename);
    });

    $(".nav_element").mouseover(
        function(){
            var filename=$(this).attr('id');
            filename="img/"+filename+"_selected.jpg";
            $(this).find('a').find('img').attr('src',filename);
        });
    $(".nav_element").mouseout(
        function(){
            var filename=$(this).attr('id');
            filename="img/"+filename+".jpg";
            $(this).find('a').find('img').attr('src',filename);
        });
});
