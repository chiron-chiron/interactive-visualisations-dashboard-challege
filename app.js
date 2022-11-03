// Fetch the JSON data and console log it
function dropmenu() {
    d3.json("samepls.json").then((incomingData) => {
        var data = incomingData;
        console.log(data)
        var name = data.names;
        var selDataset = d3.select("#selDataset");
        name.forEach((name) => {
            selDataset.append("option").text(name).property("value", name);
        })
    })
};


// Demographic info
function demoInfo(id) {
    d3.json("samples").then((incomingData) => {
        var data = incomingData;
        var metadata = data.metadata;
        var metadataFilter = metadata.filter(x => x.id == id);
        var metadataPanel = d3.select("#sample-metadata");
        metadataPanel.html("");
        metadataFilter.forEach((info) => {
            Object.entries(info).forEach(([key, value]) => {
                metadataPanel.append("p").text(`${key}:${value}`)
            })
        })
    })
};


// Barchart
function barchart(id) {
    d3.json("samples.json").then((incomingData) => {
        var data = incomingData;
        var sample = data.samples;
        var sampleFilter = sample.filter(x => x.id == id)[0];
        var otuIds = sampleFilter.otu_ids.slice(0, 10).reverse()
        var otusIdsString = otusIds.map(x => `OTU ${x}`)
        var otuFreq = sampleFilter.sample_values.slice(0, 10).reverse()
        var otuLabels = sampleFilter.otu_labels.slice(0, 10).reverse()
        var barData = [{
            x: otuFreq,
            y: otusIdsString,
            text: otuLabels,
            type: "bar",
            orientation: "h"
        }];
        var layout = {
            margin: {t: 70, l: 120}
        };
        Plotly.newPlot("bar", barData, layout)
    })
}


// Bubblechart
function bubblechart(id) {
    d3.json("samples.json").then((incomingData) => {
        var data = incomingData;
        var sample = data.samples;
        var sampleFilter = sample.filter(x => x.id == id)[0];
        var otuIds = sampleFilter.otu_ids
        var otuFreq = sampleFilter.sample_values
        var otuLabels = sampleFilter.otu_labels
        var bubbleData = [{
            x: otuIds,
            y: otuFreq,
            text: otuLabels,
            mode: "markers",
            marker: {
                color: otuIds,
                size: otuFreq,
                sizeref: 1.9
            }
        }];
        var layout = {
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
            autosize: true
        };
        Plotly.newPlot("bubble", bubbleData, layout);
    })
}

var defaultId = 940

function init() {
    dropdown();
    demoInfo(defaultId);
    barchart(defaultId);
    bubblechart(defaultId);
    gauge(defaultId);
}

init()

function optionChanged(id) {
    demoInfo(id);
    barchart(id);
    bubblechart(id);
    gauge(id);
}