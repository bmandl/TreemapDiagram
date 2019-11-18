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
var colors = [
    "#fdb664",
    "#0030ac",
    "#65cc00",
    "#ef6cff",
    "#008400",
    "#ff4ed7",
    "#004900",
    "#ca0000",
    "#00ffff",
    "#a80027",
    "#00deff",
    "#760000",
    "#00d2ff",
    "#660000",
    "#ffe36b",
    "#003e97",
    "#ffca81",
    "#0063a0",
    "#1d3e08",
    "#004859"
];

var colorScale = d3.scaleOrdinal(colors);
//.range(d3.scaleSequential(d3.interpolatePiYG));

var legend = d3.select("body").append("svg")
    .attr("id", "legend")
    .attr("width", 500);

var legendWidth = 500;
const LEGEND_OFFSET = 10;
const LEGEND_RECT_SIZE = 15;
const LEGEND_H_SPACING = 150;
const LEGEND_V_SPACING = 10;
const LEGEND_TEXT_X_OFFSET = 3;
const LEGEND_TEXT_Y_OFFSET = -2;
var legendElemsPerRow = Math.floor(legendWidth / LEGEND_H_SPACING);

d3.json(dataset).then(data => {

    var root = d3.hierarchy(data).sum(d => d.value);
    d3.treemap()
        .size([width, height])
        .paddingInner(1)
        (root);

    var categories = root.leaves().map(nodes => nodes.data.category);
    categories = categories.filter((category, index, self) => self.indexOf(category) === index);

    colorScale.domain(root.data.children.map(d => d.name));

    var cell = svg.selectAll("g")
        .data(root.leaves())
        .enter().append("g")
        .attr("class", "group")
        .attr("transform", d => `translate(${d.x0},${d.y0})`);

    cell.append("rect")
        .attr("class", "tile")
        .attr('width', d => d.x1 - d.x0)
        .attr('height', d => d.y1 - d.y0)
        .attr("data-name", d => d.data.name)
        .attr("data-category", d => d.data.category)
        .attr("data-value", d => d.data.value)
        .style("stroke", "black")
        .style("fill", d => colorScale(d.data.category))

    cell.append("text")
        .attr('class', 'tile-text')
        .selectAll("tspan")
        .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
        .enter().append("tspan")
        .attr("x", 4)
        .attr("y", (d, i) => 13 + i * 10)
        .text(d => d);

    var legendElem = legend
        .append("g")
        .attr("transform", `translate(60,${LEGEND_OFFSET})`)
        .selectAll("g")
        .data(categories)
        .enter().append("g")
        .attr("transform", (d, i) => {
            return `translate(${((i % legendElemsPerRow) * LEGEND_H_SPACING)},
            ${((Math.floor(i / legendElemsPerRow)) * LEGEND_RECT_SIZE +
                    (LEGEND_V_SPACING * (Math.floor(i / legendElemsPerRow))))})`;
        });

    legendElem.append("rect")
        .attr('width', LEGEND_RECT_SIZE)
        .attr('height', LEGEND_RECT_SIZE)
        .attr('class', 'legend-item')
        .attr('fill', d => colorScale(d));

    legendElem.append("text")
        .attr('x', LEGEND_RECT_SIZE + LEGEND_TEXT_X_OFFSET)
        .attr('y', LEGEND_RECT_SIZE + LEGEND_TEXT_Y_OFFSET)
        .text(d => d);
});