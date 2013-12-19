/**
 * Created with JetBrains WebStorm.
 * User: Tong
 * Date: 13-8-5
 * Time: 下午6:18
 * To change this template use File | Settings | File Templates.
 */
var fill = d3.scale.category20();

function f() {
    var fontSize = d3.scale.log().range([10, 200]);
    d3.layout.cloud().size([654, 400])
        .words([
            ["事故",0.281],["高铁",0.19],["王勇平",0.1],
            ["铁道部",0.19],["责任",0.241],
            ["伊伊",0.173],["王勇平",0.173],
            ["善后处理",0.173],["温州",0.1],
            ["锤砸",0.108],["发言人",0.1],["质量",0.1],["京沪",0.1],["搜救",0.1]
            ,["掩埋",0.1],["调度",0.1],["追尾",0.1]
            ,["搜救",0.1],["瞒报",0.1],["雷电",0.1]
            ,["司机",0.1],["系统故障",0.1]].map(function(d) {
                return {text: d[0], size: d[1]*150};
            }))
        .padding(5)
        .rotate(function() { return ~~(Math.random() * 2) *(Math.random()*180-90); })
        .font("Impact")
        .fontSize(function(d) { return d.size; })
        .on("end", draw_cloud)
        .start();
}

function draw_cloud(words) {
    d3.select("#cloud_chart").append("svg")
        .attr("width", 654)
        .attr("height", 400)
        .append("g")
        .attr("transform", "translate(327,200)")
        .selectAll("text")
        .data(words)
        .enter().append("text")
        .style("font-size", function(d) { return d.size + "px"; })
        .style("font-family", "Impact")
        .style("fill", function(d, i) { return fill(i); })
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) { return d.text; })
        .on("click", function(d) {
            $("#keyword:text").val(function(n,c){
                return d.text;
            });
        });
}
