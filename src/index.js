import * as d3 from "d3";
import './style.css';

const dataset = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json"

var margin = { top: 10, right: 10, bottom: 10, left: 10 },
    width = 1200 - margin.left - margin.right,
    height = 580 - margin.top - margin.bottom;


const title = d3.select("body").append("div")
    .attr("class", "title");
title.append("h1")
    .attr("id", "title")
    .text("Kickstarter funding");
title.append("h2")
    .attr("id", "description")
    .text("Top 100 kickstarter fundings grouped by category");

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
/*.append("g")
.attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");*/

d3.json(dataset).then(data => {

    var root = d3.hierarchy(data).sum(d => d.value);
    d3.treemap()
        .size([width, height])
        .paddingInner(1)
        (root);

    var cell = svg.selectAll("g")
        .data(root.leaves())
        .enter().append("g")
        .attr("class", "group")
        .attr("transform", function (d) { return "translate(" + d.x0 + "," + d.y0 + ")"; });

    cell.append("rect")
        .attr("class", "tile")
        .attr('width', d => d.x1 - d.x0)
        .attr('height', d => d.y1 - d.y0)
        .attr("data-name", d => d.data.name)
        .attr("data-category", d => d.data.category)
        .attr("data-value", d => d.data.value)
        .style("stroke", "black")
        .style("fill", "slateblue")

    cell.append("text")
        .attr('class', 'tile-text')
        .selectAll("tspan")
        .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
        .enter().append("tspan")
        .attr("x", 4)
        .attr("y", (d, i) => 13 + i * 10)
        .text(d => d);
});