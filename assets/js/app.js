// @TODO: YOUR CODE HERE!
var svgWidth = 1000;
var svgHeight = 600;

var margin = {
  top: 20,
  right: 40,
  bottom: 85,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";

var chosenYAxis = "obesity";

// function used for updating x-scale var upon click on axis label
function xScale(Data, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(Data, d => d[chosenXAxis]) * 0.8,
        d3.max(Data, d => d[chosenXAxis]) * 1.2
      ])
      .range([0, width]);
  
    return xLinearScale;
  
}

function yScale(Data, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(Data, d => d[chosenYAxis]) * 0.8,
        d3.max(Data, d => d[chosenYAxis]) * 1.2
      ])
      .range([height, 0]);
  
    return yLinearScale;
  
  }
  
// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  }

  function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    return yAxis;
  }

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]))
      .attr("cy", d => newYScale(d[chosenYAxis]));
  
    return circlesGroup;
  }

function renderAbbr(abbrGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {

  abbrGroup.transition()
      .duration(1000)
      .attr("x", d => newXScale(d[chosenXAxis]))
      .attr("y", d => newYScale(d[chosenYAxis]));
  
    return abbrGroup;
  }


// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

    if (chosenXAxis === "poverty") {
      var xlabel = "Poverty:";
    }
    else if (chosenXAxis === "age"){
      var xlabel = "Age:";
    }
    else if (chosenXAxis === "income"){
        var xlabel = "Income"
    }
    
    if (chosenYAxis === "obesity") {
        var ylabel = "Obesity:";
    }
    else if (chosenYAxis === "healthcare"){
        var ylabel = "Healthcare:";
    }
    else if (chosenYAxis =="smokes"){
        var ylabel = "Smokes"
    }
  
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([80, -60])
      .html(function(d) {
        return (`State: ${d.state} <br>${xlabel} ${d[chosenXAxis]}<br>${ylabel} ${d[chosenYAxis]}`);
      });
  
    circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
  
    return circlesGroup;
  }  

var url = "https://raw.githubusercontent.com/the-Coding-Boot-Camp-at-UT/UTAUS201810DATA2/master/16_D3/Homework/Instructions/StarterCode/assets/data/data.csv?token=Aoe_wBo3V3i6Izz2kSSFNKlowXjs9OXDks5chE7CwA%3D%3D"

d3.csv(url)
  .then(function(Data) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    // parse data
    Data.forEach(function(data) {
      data.poverty =+data.poverty;
      data.obesity = +data.obesity;
      data.age = +data.age;
      data.income = +data.income;
      data.smokes =+data.smokes;
      data.healthcare = +data.healthcare;
    });


    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = xScale(Data, chosenXAxis);
    var yLinearScale = yScale(Data, chosenYAxis);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

        // append x axis
    var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

        // append x axis
    var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .call(leftAxis);

    // Step 5: Create Circles
    // ==============================
      var circlesGroup = chartGroup.selectAll("circle")
      .data(Data)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d[chosenXAxis]))
      .attr("cy", d => yLinearScale(d[chosenYAxis]))
      .attr("r", "20")
      .classed("stateCircle", true)
      .attr("opacity", ".3")
      .attr("stroke-width", "1");

      var abbrGroup = chartGroup.selectAll(".text")
      .data(Data)
      .enter()
      .append("text")
      .attr("x", d => xLinearScale(d[chosenXAxis]) *0.995)
      .attr("y", d => yLinearScale(d[chosenYAxis]))
      .text(d=>(d.abbr))
      .classed("stateText", true)
      .attr("font-size", "10px");

    //   // Create group for  2 x- axis labels
  var xlabelsGroup = chartGroup.append("g")
  .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var povertyLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("Poverty");

    var ageLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age");

    var incomeLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Income");

    // append y axis
    var ylabelsGroup = chartGroup.append("g")
    
    var obesitylabel= ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("value", "obesity")
    .classed("active", true)
    .text("Obesity");

    var healthcarelabel= ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 20 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("value", "healthcare")
    .classed("inactive", true)
    .text("Healthcare");

    var smokeslabel= ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 40 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("value", "smokes")
    .classed("inactive", true)
    .text("Smokes");

    // Step 7: Create tooltip in the chart
    // ==============================
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    // x axis labels event listener
xlabelsGroup.selectAll("text")
.on("click", function() {
  // get value of selection
  var value = d3.select(this).attr("value");
  if (value !== chosenXAxis) {

    // replaces chosenXaxis with value
    chosenXAxis = value;


    // updates x,y scale for new data
    xLinearScale = xScale(Data, chosenXAxis);

    // updates x axis with transition
    xAxis = renderXAxes(xLinearScale, xAxis);

    // updates circles with new x values
    circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

    abbrGroup = renderAbbr(abbrGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis)

    // updates tooltips with new info
    circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    // changes classes to change bold text
    if (chosenXAxis === "poverty") {
      povertyLabel
        .classed("active", true)
        .classed("inactive", false);
      ageLabel
        .classed("active", false)
        .classed("inactive", true);
      incomeLabel
        .classed("active", false)
        .classed("inactive", true);
    }
    else if (chosenXAxis === "age") {
        povertyLabel
          .classed("active", false)
          .classed("inactive", true);
        ageLabel
          .classed("active", true)
          .classed("inactive", false);
        incomeLabel
          .classed("active", false)
          .classed("inactive", true);
        }
    else if (chosenXAxis === "income") {
        povertyLabel
            .classed("active", false)
            .classed("inactive", true);
        ageLabel
            .classed("active", false)
            .classed("inactive", true);
        incomeLabel
            .classed("active", true)
            .classed("inactive", false);
        }

  }
});

// x axis labels event listener
ylabelsGroup.selectAll("text")
.on("click", function() {
  // get value of selection
  var value = d3.select(this).attr("value");
  if (value !== chosenYAxis) {

    // replaces chosenXaxis with value
    chosenYAxis = value;


    // updates x,y scale for new data
    yLinearScale = yScale(Data, chosenYAxis);

    // updates x axis with transition
    yAxis = renderYAxes(yLinearScale, yAxis);

    // updates circles with new x values
    circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

    abbrGroup = renderAbbr(abbrGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

    // updates tooltips with new info
    circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenYAxis === "obesity") {
            obesitylabel
              .classed("active", true)
              .classed("inactive", false);
            smokeslabel
              .classed("active", false)
              .classed("inactive", true);
            healthcarelabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else if (chosenYAxis === "smokes") {
              obesitylabel
                .classed("active", false)
                .classed("inactive", true);
              smokeslabel
                .classed("active", true)
                .classed("inactive", false);
              healthcarelabel
                .classed("active", false)
                .classed("inactive", true);
              }
          else if (chosenYAxis === "healthcare") {
              obesitylabel
                  .classed("active", false)
                  .classed("inactive", true);
              smokeslabel
                  .classed("active", false)
                  .classed("inactive", true);
              healthcarelabel
                  .classed("active", true)
                  .classed("inactive", false);
              }
        }
    });

});




  