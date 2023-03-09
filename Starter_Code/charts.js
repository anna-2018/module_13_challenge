function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
   
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Deliverable 1: 1. Create the buildChart function.
function buildCharts(sample) {
  // Deliverable 1: 2. Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);

    // Deliverable 1: 3. Create a variable that holds the samples array. 
    var sampleData = data.samples;

    // Deliverable 1: 4. Create a variable that filters the samples for the object with the desired sample number.
    var chartArray = sampleData.filter(sampleObj => sampleObj.id == sample);

    // Deliverable 1: 5. Create a variable that holds the first sample in the array.
    var firstArraySample = chartArray[0];

    // Deliverable 1: 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var ids = firstArraySample.otu_ids;
    var labels = firstArraySample.otu_labels;
    var sampleValues = firstArraySample.sample_values;


    // Deliverable 1: 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order 
    // so the otu_ids with the most bacteria are last. 
    var yticks = ids.slice(0,10).map(OTU => "OTU" + OTU).reverse();

    // Deliverable 1: 8. Create the trace for the bar chart. 
    var trace = {
      type: "bar",
      text: labels.slice(0,10).reverse(),
      x: sampleValues.slice(0,10).reverse(),
      y: yticks,
      orientation: 'h'
    };
    var barData = [trace];

    // Deliverable 1: 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "<b>Top 10 Bacteria Cultures Found</b>",
      width: 460, 
      height: 400, 
    };

    // Deliverable 1: 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot('bar',barData, barLayout);


    // Deliverable 2: 1. Create the trace for the bubble chart.
    var trace2 = {
      x: ids,
      y: sampleValues,
      mode: 'markers',
      hovertext: labels,
      marker: {
        color: ids,
        size: sampleValues,
        colorscale: "blue"
      }
    };
    var bubbleData = [trace2];

    // Deliverable 2: 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "<b>Bacteria Cultures Per Sample</b>",
      xaxis:{title: "OTU ID"},
      hovermode: 'closest',
      width:1145
    };

    // Deliverable 2: 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble',bubbleData, bubbleLayout);


   
    // Deliverable 3: 1. Create a variable that filters the metadata array for the object with the desired sample number.
        
    // Deliverable 3: 2. Create a variable that holds the first sample in the metadata array.

    // Deliverable 3: 3. Create a variable that holds the washing frequency.

    // Deliverable 3: 4. Create the trace for the gauge chart.
    
    // Deliverable 3: 5. Create the layout for the gauge chart.

    // Deliverable 3: 6. Use Plotly to plot the gauge data and layout.
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var wFreq = result.wfreq;

   
    var trace3 = {
      
      type: "indicator",
      mode: "gauge+number",
      value: wFreq,
		  title: { text: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week"},
      gauge: {
        axis: {range: [0,10],tickwidth: 1, tickcolor: "black"},
        bar: {color: "white"},
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "green" },
          { range: [8, 10], color: "darkgreen" },
        ],
      }
       }
    var gaugeData = [trace3];
  
    var gaugeLayout = { 
      width: 400, 
      height: 400, 
      margin: { t: 0, b: 0 } };

    Plotly.newPlot('gauge', gaugeData, gaugeLayout);


  });
}
