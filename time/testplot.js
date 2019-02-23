var length = 0;

/*-----------*----*-----------*/
/* Creates the plot using     */
/* plot.ly                    */
/*-----------*----*-----------*/
function dplot(points) {

  file_count += 1;

  //calculate times based on points
	var totaltimes = calc_total_time(points);
	time_table(totaltimes);
  var shape_arrays = shape_trace();

  var myPlot = document.getElementById('myDiv'),
    d3 = Plotly.d3,
    N = 1025,
    x = get_points('x', points),
    y = get_points('y', points),
    z = get_points('z', points),

    data = [{
      x: x,
      y: y,
      z: z,
      type: 'scatter3d',
      mode: 'markers',
      name: '2014',
      marker: {
        color: 'rgba(200, 50, 100, .7)',
        size: 5
      }
    }/*, {
      x: shape_arrays[0],
      y: shape_arrays[1],
      z: shape_arrays[2],

      type: 'scatter3d',
      mode: 'lines',
      opacity: 1.0,
      line: {
        width: 2,
        color: 'blue',
        colorscale: 'Viridis'
      }
    }*/];
  layout = {
    hovermode: 'closest',
    title: '<b>Sample Points</b> <br> click on a point to display data',
    width: 600,
    height: 600,
    showlegend: false,


    xaxis: {
      zeroline: false,
      title: 'Value A',
			backgroundcolor: 'rgba(12, 229, 68, .5)'
    },
    yaxis: {
      zeroline: false,
      title: 'Value B'
    }
  };

  //actually create new plot
  Plotly.newPlot('myDiv', data, layout);

  //when a point on the plot is clicked
  myPlot.on('plotly_click',
    function(data)
		{
      //create data table
			populate_table(data, points, totaltimes);
    });

}

/*-----------*----*-----------*/
/* Finds a point in points    */
/*-----------*----*-----------*/
function find_points(data, points) {
  var point = data.points[0];
  for (i = 0; i < points.length; i++) {
    if (point.x == points[i].x) {
      if (point.y == points[i].y) {
        if (point.z == points[i].z) {
          return points[i]
        }
      }
    }
  }
}

/*-----------*----*-----------*/
/* Get points whether x,y or  */
/* z                          */
/*-----------*----*-----------*/
function get_points(ax, points) {

  var a = [];
  for (i = 0; i < points.length; i++) {
    a.push((points[i])[ax]);
  }

  return a;
}

/*-----------*----*-----------*/
/* Add data to individual     */
/* point table                */
/*-----------*----*-----------*/
function populate_table(data, points, totaltimes)
{
	var rowcount = $("#count-data tr").length;
	console.log(rowcount);

	var point = find_points(data, points); //find correct point

	var table = document.getElementById("count-data");

	table.style = "display: visible;"; //make the table visible

  //if the table's rows don't exist
	if (rowcount <= 1)
	{
		table = table.getElementsByTagName('tbody')[0];

		var newrow = table.insertRow(table.rows.length);
		var newrow2 = table.insertRow(table.rows.length);


		var d1 = newrow.insertCell(0);
		var d2 = newrow2.insertCell(0);

		var timcell1 = newrow.insertCell(1);
		var timcell2 = newrow2.insertCell(1);

		var pl1 = newrow.insertCell(2);
		var pl2 = newrow2.insertCell(2);

		d1.innerHTML = "Direction 1";
		d2.innerHTML = "Direction 2";

		timcell1.innerHTML = point.tD1;
		timcell2.innerHTML = point.tD2;

		pl1.innerHTML = point.plD1;
		pl2.innerHTML = point.plD23;

 	}
	else
	{
		table.rows[1].cells[1].innerHTML = point.tD1;
		table.rows[2].cells[1].innerHTML = point.tD2;

		table.rows[1].cells[2].innerHTML = point.plD1;
		table.rows[2].cells[2].innerHTML = point.plD23;

		console.log(table.rows[2].cells[2].innerHTML);
		console.log(point.plD23);
	}


}

/*-----------*----*-----------*/
/* Create total time table    */
/*-----------*----*-----------*/
function time_table(totaltimes)
{
		var table = document.getElementById("time-data");
		var rowcount = $("#time-data tr").length;

		if (rowcount <= 1)
		{
			table = table.getElementsByTagName('tbody')[0];
			var newrow = table.insertRow(table.rows.length);
			var newrow2 = table.insertRow(table.rows.length);

			var d1 = newrow.insertCell(0);
			var d2 = newrow2.insertCell(0);

			var timcell1 = newrow.insertCell(1);
			var timcell2 = newrow2.insertCell(1);

			d1.innerHTML = "Direction 1";
			d2.innerHTML = "Direction 2";

			timcell1.innerHTML = totaltimes[0];
			timcell2.innerHTML = totaltimes[1];

		}
		else
		{
			table.rows[1].cells[1].innerHTML = totaltimes[0];
			table.rows[2].cells[1].innerHTML = totaltimes[1];
		}
}

function find_smallest(want)
{
  var val = get_points(want, points);
  var small = val[0];
  for(i = 0; i < val.length; i++)
  {
    if (parseFloat(small) > parseFloat(val[i]))
    {

      small = val[i];


    }
  }
  return parseFloat(small) - Math.sign(parseFloat(small)) * parseFloat(small) ;
}

function find_largest(want)
{
  var val = get_points(want, points);
  var big = val[0];
  for(i = 0; i < val.length; i++)
  {
    if (parseFloat(big )< parseFloat(val[i]))
    {
      big = val[i];
    }
  }
  return parseFloat(big) + parseFloat(big);
}

function create_point_array(x_small, x_big, y_small, y_big, z_small, z_big)
{

  var x_array = [x_big, x_big, x_big, x_big, x_small, x_small, x_small, x_small];
  var y_array = [y_small, y_small, y_big, y_big, y_small, y_big, y_big, y_small];
  var z_array = [z_big, z_small, z_small, z_big, z_big, z_big, z_small, z_small];

  var x_use = [x_array[0], x_array[1], x_array[2], x_array[3], x_array[0], x_array[4], x_array[5], x_array[3], x_array[2], x_array[6], x_array[5], x_array[6], x_array[7], x_array[4], x_array[7], x_array[1]];
  var y_use = [y_array[0], y_array[1], y_array[2], y_array[3], y_array[0], y_array[4], y_array[5], y_array[3], y_array[2], y_array[6], y_array[5], y_array[6], y_array[7], y_array[4], y_array[7], y_array[1]];
  var z_use = [z_array[0], z_array[1], z_array[2], z_array[3], z_array[0], z_array[4], z_array[5], z_array[3], z_array[2], z_array[6], z_array[5], z_array[6], z_array[7], z_array[4], z_array[7], z_array[1]];


  return [x_use, y_use, z_use];
}

function shape_trace()
{
  var y_small = find_smallest('y');
  var y_big = find_largest('y');

  var z_small = find_smallest('z');
  var z_big = find_largest('z');

  var half = thickness/2;

  var p_ar = create_point_array(-half, half, y_small, y_big, z_small, z_big);
  console.log(p_ar);
  return p_ar;

}
