

function get_fractions()
{
  var fractions = [];
  var i = 0;
  while (i <= 1)
  {
    fractions.push(i);
    i = parseFloat((i+.025).toFixed(3));
  }
  return fractions;
}

function get_thickness()
{
  var thickness = [];
  var i = 0;

  while (i <= 100)
  {
    thickness.push(i);
    i += 2.50;
  }
  console.log(thickness);
  return thickness;
}


function calculate_points(total, thickness)
{
  var points = [];

  for(i = 0; i <= thickness.length; i++)
  {
    var point = parseFloat(Math.exp((-total) * .1 * thickness[i]).toFixed(4)) * 100;
    points.push(point);
  }
  console.log(points);
  return points;

}

function create_graph(total)
{
    var thickness = get_thickness();
    var points = calculate_points(total, thickness);

    var trace1 =
    {
      x: thickness,
      y: points,
      type: 'scatter'
    };
    var layout =
    {
      autosize: false,
      width: 500,
      height: 500,
      title: 'User Attenuation Calculation',

      xaxis: {
        title: 'Sample Thickness (mm)'
      },

      yaxis: {
        title: 'Transmission Flux/ Incident Flux'
      },

      margin: {
       l: 50,
       r: 50,
       b: 100,
       t: 100,
       pad: 4
     }
   };
    var data = [trace1];
    Plotly.newPlot('element_cluster', data, layout);
}
