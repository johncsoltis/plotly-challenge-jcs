function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    var sample_metadata = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    sample_metadata.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    d3.json("/metadata/" + sample).then((sampleMetadata) => {
      
      Object.entries(sampleMetadata).forEach(function([key, value]) {
        sample_metadata
          .append("p")
          .text(`${key} : ${value}`)
      }); 
    });
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = `/samples/${sample}`;
  d3.json(url).then(function (response){
    var x_value = response["otu_ids"];
    var y_value = response["sample_values"];
    var size_value = response["sample_values"];
    var label = response["otu_labels"];
    // @TODO: Build a Bubble Chart using the sample data
    var trace1 = {
      x: x_value,
      y: y_value,
      mode:"markers", 
      marker:{
        size: size_value,
        color: x_value,
        labels: label,
        type: 'scatter',
        opacity: 0.35
      }
    };

    var data1 = [trace1];

    var layout = {
      title: 'Belly Button Biology Scatter',
      xaxis: { title: 'OTU ID' },
      showlegend: false
    };
    Plotly.newPlot("bubble", data1, layout); 

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var data = [{
      values: size_value.splice(0, 10),
      labels: x_value.splice(0, 10),
      text: y_value.splice(0,10),
      type: 'pie'
    }];
    var layout = {
      title: 'Belly Button Biology Pie',}
    Plotly.newPlot('pie', data, layout);
  });
  }
  

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
