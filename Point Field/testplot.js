var length = 0;
var G_data;
/*-----------*----*-----------*/
/* Creates the plot using     */
/* plot.ly                    */
/*-----------*----*-----------*/
function dplot(points) {

  file_count = 2;

  //calculate times based on points
	var totaltimes = calc_total_time();
	time_table(totaltimes);
  var shape_arrays = shape_trace();


  var myPlot = document.getElementById('myDiv'),
    d3 = Plotly.d3,
    N = 1025,
    x = get_points('x', points),
    y = get_points('y', points),
    z = get_points('z', points),

    data = [{
      x: shape_arrays[0],
      y: shape_arrays[1],
      z: shape_arrays[2],

      type: 'scatter3d',
      mode: 'lines',
      opacity: 1.0,
			showlegend: false,
			hoverinfo:"none",
			name: 'shape',
      line: {
        width: 2,
        color: 'blue',
        colorscale: 'Viridis'
      }
		}, {
      x: x,
      y: y,
      z: z,
      type: 'scatter3d',
      mode: 'markers',
      marker: {
        color: 'rgba(200, 50, 100, .7)',
        size: 5
      }
    }
    ];
  layout = {
    hovermode: 'closest',
    title: '<b>Sample Points</b> <br> click on a point to display data',
    width: 600,
    height: 600,
    showlegend: true,


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

	console.log(data);
  //actually create new plot
  Plotly.newPlot('myDiv', data, layout);

  //when a point on the plot is clicked
  myPlot.on('plotly_click',
    function(data)
		{
      //create data table
			if (data.points[0].fullData.name != "shape"){
			populate_table(data, points, totaltimes);}
    });

}

/*-----------*----*-----------*/
/* Finds a point in points    */
/*-----------*----*-----------*/
function find_points(data, points) {
	for (j = 0; j < total_points.length; j++){

		var trace_array = total_points[j];
		var point = data.points[0];

	  for (i = 0; i < trace_array.length; i++) {
	    if (point.x == trace_array[i].x) {
	      if (point.y == trace_array[i].y) {
	        if (point.z == trace_array[i].z) {
	          return trace_array[i]
	        }
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
	console.log(data);
	var point = find_points(data, points); //find correct point

	var table = document.getElementById("count-data");

	table.style = "display: visible;"; //make the table visible
  //if the table's rows don't exist
	if (rowcount <= 1)
	{
		table = table.getElementsByTagName('tbody')[0];

		var newrow = table.insertRow(table.rows.length);
		var newrow2 = table.insertRow(table.rows.length);
    var newrow3 = table.insertRow(table.rows.length);


		var d1 = newrow.insertCell(0);
		var d2 = newrow2.insertCell(0);
    var d3 = newrow3.insertCell(0);


		var timcell1 = newrow.insertCell(1);
		var timcell2 = newrow2.insertCell(1);
    var timcell3 = newrow3.insertCell(1);


		var pl1 = newrow.insertCell(2);
		var pl2 = newrow2.insertCell(2);
    var pl3 = newrow3.insertCell(2);


		d1.innerHTML = "X Dimension";
		d2.innerHTML = "Y Dimension";
    d3.innerHTML = "Z Dimension";


		timcell1.innerHTML = point.t_X;
		timcell2.innerHTML = point.t_Y;
    timcell3.innerHTML = point.t_Z;


		pl1.innerHTML = point.pl_X;
		pl2.innerHTML = point.pl_Y;
    pl3.innerHTML = point.pl_Z;




 	}
	else
	{
		table.rows[1].cells[1].innerHTML = point.t_X;
		table.rows[2].cells[1].innerHTML = point.t_Y;
    table.rows[3].cells[1].innerHTML = point.t_Z;


		table.rows[1].cells[2].innerHTML = point.pl_X;
		table.rows[2].cells[2].innerHTML = point.pl_Y;
    table.rows[3].cells[2].innerHTML = point.pl_Z;

	}


}

function trace_table(data, array)
{
	var table = document.getElementById("trace_tab");

		table = table.getElementsByTagName('tbody')[0];

		var newrow = table.insertRow(table.rows.length);

		var d1 = newrow.insertCell(0);


		var x_vals = newrow.insertCell(1);
		var y_vals = newrow.insertCell(1);
		var z_vals = newrow.insertCell(1);

		var button_cell = newrow.insertCell(4);


		d1.innerHTML = "Trace " + (data.length - 1);

		x_vals.innerHTML = ("<b> Start X: </b>" + array[0] + "<b> Stop X: </b>" + array[3] + "<b> Step X: </b>" + array[6]);
		y_vals.innerHTML = ("<b> Start Y: </b>" + array[1] + "<b> Stop Y: </b>" + array[4] + "<b> Step Y: </b>" + array[7]);
		z_vals.innerHTML = ("<b> Start Z: </b>" + array[2] + "<b> Stop Z: </b>" + array[5] + "<b> Step Z: </b>" + array[8]);

		//<a href="#" id="abspop" data-toggle="popover" ><i class="fas fa-info-circle fa-lg" id="time-info"></i></a>

		var trash = document.createElement("p");
		var id = "trash_button" + (data.length-1);
		trash.setAttribute("id", id);
		trash.setAttribute("class", "btn btn-default");
		trash.setAttribute("onclick", "delet_trace(this.id)"); //add delete fucntion
		trash.innerHTML= '<i class="fas fa-trash-alt"></i>';
		button_cell.setAttribute("id", trash.id);
		button_cell.appendChild(trash);


}

function delet_trace(button_id)
{
	var table = document.getElementById("trace_tab");
	var i_table = document.getElementById("count-data");

	var button = document.getElementById(button_id);
	var row = button.parentNode.rowIndex;

	for(i = row; i < table.rows.length - 1; i++)
	{

		table.rows[i + 1].cells[0].innerHTML = "Trace " + i;
	}

	total_vals.splice(row-1, 1);
	total_points.splice(row-1, 1);

	table.deleteRow(row);
	Plotly.deleteTraces('myDiv', row);

	var totaltimes = calc_total_time();
	time_table(totaltimes);

	if (table.rows.length == 1)
	{
		i_table.style = "display: none;"; //make the table visible

	}
	//docuement.getElementById("trace_tab").deleteRow(row_num);
	//Plotly.deleteTraces('myDiv', row_num);
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
			var newrow3 = table.insertRow(table.rows.length);


			var d1 = newrow.insertCell(0);
			var d2 = newrow2.insertCell(0);
			var d3 = newrow3.insertCell(0);


			var timcell1 = newrow.insertCell(1);
			var timcell2 = newrow2.insertCell(1);
			var timcell3 = newrow3.insertCell(1);

			d1.innerHTML = "X Direction";
			d2.innerHTML = "Y Direction";
			d3.innerHTML = "Z Direction";



			timcell1.innerHTML = totaltimes[0];
			timcell2.innerHTML = totaltimes[1];
			timcell3.innerHTML = totaltimes[2];



		}
		else
		{
			table.rows[1].cells[1].innerHTML = totaltimes[0];
			table.rows[2].cells[1].innerHTML = totaltimes[1];
			table.rows[3].cells[1].innerHTML = totaltimes[2];

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

  var half = xDimension;

  var p_ar = create_point_array(0, half, 0, yDimension, 0, zDimension);
  return p_ar;

}
