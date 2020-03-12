const COLORS = [
  "#69c0d1",
  "#75c257",
  "#d9d93b",
  "#f77519",
  "#f72b19"
  ]

const FEELING = [
  "1",
  "2",
  "3",
  "4",
  "5"
]

const m = {
    width: 800,
    height: 600
}

d3.json('globalgeo.json').then(function(geoData) {

    d3.csv('SYMPTOM_MOCK_DATA.csv').then(function(data) {

      let pain = "All";
      let symptom = "All";

        // set the scale of the map
        const albersProj = d3.geoAlbers()
          .scale(200)
          .rotate([74.0060, 0])
          .center([10, 50])
            .translate([m.width/2, m.height/2]);

        // plot the locations on the map
        let point = data[0]
        let arr = [ point['location_long'] , point['location_lat'] ]
        let scaled = albersProj(arr)

        //
        const geoPath = d3.geoPath()
          .projection(albersProj)

        plot = d3.select("#plot")
          .append("svg")
            .attr("id", "plotArea")
            .attr("width", m.width)
            .attr("height", m.height)


        activateDropdowns();
        plotPoints(data, geoData);

   function plotPoints(pointData, geoData) {

     record = pointData[1];
     console.log("First Symptom " + record.symptom);

      currPlot = d3.select("#currentPlot")
      currPlot.remove();
      plot = d3.select("#plotArea")

      var color = d3.scaleOrdinal()
      .domain(FEELING)
      .range(COLORS)

      plot.append('svg')
        .attr("id", "currentPlot")

      currPlot = d3.select("#currentPlot")

      currPlot.selectAll('path')
        .attr("id", "plotPath")
        .data(geoData.features)
        .enter()
        .append('path')
            .attr('fill', '#ccc')
            .attr('d', geoPath)


        currPlot.selectAll('.circle')
         .data(pointData)
         .enter()
         .append('circle')
             .attr('cx', function(d) {
                 let scaledPoints = albersProj([d['location_long'], d['location_lat']])
                 return scaledPoints[0]
             })
             .attr('cy', function(d) {
                 let scaledPoints = albersProj([d['location_long'], d['location_lat']])
                 return scaledPoints[1]
             })
             .attr('r', 5)
             .style("fill", function (d) { return color(d.general_feeling) } )
             .on( "click", function(){
               d3.select(this)
                 .attr('r', 15)
                 .attr("opacity",1)
                 .transition()
                 .duration( 3000 )
                 .attr( "cx", m.width * Math.round( Math.random() ) )
                 .attr( "cy", m.height * Math.round( Math.random() ) )
                 .attr( "opacity", 0 )
                 .on("end",function(){
                   d3.select(this).remove();
                 })
             })
         }

         function activateDropdowns() {

           d3.select("#pain-levels").on("change", function() {

             pain = this.options[this.selectedIndex].value;
             console.log("Pain = " + pain);

             if (pain == "All" && symptom == "All"){
               displayData = data;
               plotPoints(displayData, geoData);
             } else if (pain == "All") {
               displayData =  data.filter(function(d) {
                   tempData = (d.symptom == symptom)
                   console.log("Temp Data =  " + tempData[1]);
                   return d.symptom == symptom
               })
               plotPoints(displayData, geoData);
             } else if (symptom == "All") {
               displayData =  data.filter(function(d) {
                   return d.general_feeling == pain
               })
               plotPoints(displayData, geoData);
             } else {
               displayData =  data.filter(function(d) {
                   return (d.symptom == symptom && d.general_feeling == pain)
               })
               plotPoints(displayData, geoData);
             }
           })


           d3.select("#symp").on("change", function() {
             symptom = this.options[this.selectedIndex].value;
             if (pain == "All" && symptom == "All"){
               displayData = data;
               plotPoints(displayData, geoData);
             } else if (pain == "All") {
               displayData =  data.filter(function(d) {
                   return d.symptom == symptom
               })
               plotPoints(displayData, geoData);
             } else if (symptom == "All") {
               displayData =  data.filter(function(d) {
                   return d.general_feeling == pain
               })
               plotPoints(displayData, geoData);
             } else {
               displayData =  data.filter(function(d) {
                   return (d.symptom == symptom && d.general_feeling == pain)
               })
               plotPoints(displayData, geoData);
             }
             plotPoints(displayData, geoData);
           })


         }
  })
})
