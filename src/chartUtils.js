import { select as d3Select } from "d3-selection";
import { COLORS } from "./utilities";

export const DARK_GREY  = COLORS.darkGrey;
export const LIGHT_GREY = COLORS.lightGrey;
const FONT_SIZE = "12px";

export const buildChartFrame = function buildChartFrame(
  el,
  { rightAxis, leftAxis, bottomAxis, monthAxis, weekAxis },
  { height, width, margin, graphWidth, graphHeight, xWidth, yLabel }
) {
  let svg = d3Select(el)
    .append("svg")
      .attr("height", height)
      .attr("width", width)
    .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // right axis with tick marks
  svg.append("g")
    .attr("class", "y axis right-axis")
    .attr("transform", `translate(${graphWidth}, 0)`)
    .call(g => {
      g.call(rightAxis);
      g.select(".domain")
        .attr("stroke", DARK_GREY);
      g.selectAll(".tick line")
        .attr("stroke", LIGHT_GREY);
      g.select(".tick line:first-child")
        .attr("stroke", DARK_GREY);
      g.select(".tick line:last-child")
        .attr("stroke", DARK_GREY);
      g.selectAll(".tick text").remove();
    });

  svg.append("g")
    .attr("class", "x axis week-axis")
    .call(g => {
      g.call(weekAxis);
      g.select(".domain")
        .attr("stroke", DARK_GREY);
      g.selectAll(".tick line")
        .attr("stroke", COLORS.lightestGrey)
        .attr("transform", `translate(${xWidth/2}, 0)`);
      g.selectAll(".tick text").remove();
    });

  // left axis with labels
  svg
    .append("g")
      .attr("class", "y axis left-axis")
      .attr("transform", "translate(0, 0)")
      .call(g => {
        g.call(leftAxis);
        g.select(".domain")
          .attr("stroke", DARK_GREY);
        g.selectAll(".tick text")
          .attr("fill", DARK_GREY)
          .style("fontSize", FONT_SIZE);
        // console.log(g);
        // let fText = g.select(".tick text").nodes();
        // let last = fText[]
        // console.log(fText);
        // fText.text(`${yLabel} ${fText.text()}`);
      })
    .append("text")
      .attr("class", "label")
      .attr("x", -20)
      .attr("y", 4)
      .attr("fill", DARK_GREY)
      .style("fontSize", FONT_SIZE)
      .style("text-anchor", "end")
      .text(yLabel);

  // bottom primary axis
  svg.append("g")
    .attr("class", "x axis bottom-axis")
    .attr("transform", `translate(0, ${graphHeight})`)
    .call(g => {
      g.call(bottomAxis);
      g.select(".domain")
        .attr("stroke", DARK_GREY);
      g.selectAll(".tick text")
        .attr("fill", DARK_GREY)
        .style("text-anchor", "middle")
        .style("fontSize", FONT_SIZE);
    });

  // bottom month axis
  svg.append("g")
    .attr("class", "x axis month-axis")
    .attr("transform", `translate(${xWidth/2}, ${graphHeight})`)
    .call(g => {
      g.call(monthAxis);
      g.select(".domain").remove();
      g.selectAll(".tick text")
        .attr("fill", DARK_GREY)
        .style("fontSize", FONT_SIZE);
    });

  return svg;
};

export const finalizeChart = function finalizeChart(svg, { firstDate, lastSync, xScale, width, height }){
  if (lastSync) {
    svg.append("g")
      .attr("class", "missing-data")
      .append("rect")
      .attr("height", height)
      .attr("width", width - xScale(lastSync))
      .attr("transform", `translate(${xScale(lastSync)}, 0)`)
      .attr("fill", "#9B9B9B")
      .attr("fill-opacity", "0.4");
  }

  if (firstDate) {
    const prehistoryWidth = xScale(firstDate);

    let prehistory = svg.append("g")
      .attr("class", "missing-data");

    prehistory.append("rect")
      .attr("height", height - 1)
      .attr("width", prehistoryWidth - 1)
      .attr("transform", "translate(1,1)")
      .attr("fill", "#FFF")
      .attr("fill-opacity", "1");

    prehistory.append("line")
      .attr("class", "history-start")
      .attr("x1", 0)
      .attr("x2", 0)
      .attr("y1", height)
      .attr("y2", 0)
      .attr("transform", `translate(${prehistoryWidth},0)`)
      .attr("stroke-width", 2)
      .attr("stroke", "#20C3F3")
      .attr("fill", "none");

    prehistory.append("line")
      .attr("class", "history-start")
      .attr("x1", 0)
      .attr("x2", 0)
      .attr("y1", height)
      .attr("y2", 0)
      .attr("transform", `translate(${prehistoryWidth},0)`)
      .attr("stroke-width", 2)
      .attr("stroke", "#20C3F3")
      .attr("fill", "none");

    // prehistory.append("line")
    //   .attr("class", "axis-overlay")
    //   .attr("x1", 0)
    //   .attr("x2", prehistoryWidth)
    //   .attr("y1", height+1)
    //   .attr("y2", height+1)
    //   .attr("stroke-width", 1)
    //   .attr("stroke", DARK_GREY)
    //   .attr("fill", "none");
  }
};