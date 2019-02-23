

var file_count = 0;
var val_array = [];
var xDimension = 0;
var yDimension = 0;
var zDimension = 0;
var theta = 45;
//var points = [];
var total_points = [];
var total_vals = [];


/*-----------*----*-----------*/
/* Sets dimensions when        */
/* entered     								*/
/*-----------*----*-----------*/
function set_dimensions()
{
	var output = document.getElementById("thick");
  xDimension = parseFloat(document.getElementById("xD").value);
	yDimension = parseFloat(document.getElementById("yD").value);
	zDimension = parseFloat(document.getElementById("zD").value);
	theta = ((parseFloat(document.getElementById("t_theta").value)/2) * Math.PI)/180;

	if (file_count >= 1)
	{
		update_plot();
	}
	//makes sure entered is a number
	if ((isNaN(xDimension) == true) || (isNaN(yDimension) == true) || (isNaN(zDimension) == true) || (isNaN(theta) == true))
	{
		xDimension = 0;
		yDimension = 0;
		zDimension = 0;
		theta = 0;
		alert("Dimensions and 2theta must be numbers!");
	}
	//display xDimension
	output.innerHTML = "<b>X: </b>" + xDimension + " <b>Y: </b>" + yDimension + "<b> Z: </b>" + zDimension;
}

/*-----------*----*-----------*/
/* Creates an array based off */
/* certain index              */
/*-----------*----*-----------*/
function compile_val(dir)
{
  var dir_array = [];
  for (i = 0; i < val_array.length; i++)
  {
		//split line based of comma
    var point_array = val_array[i].split(",");
		//add value at index to dir array
    dir_array.push(point_array[dir]);
  }
  return dir_array;
}

/*-----------*----*-----------*/
/* Creates points and performs*/
/* calculations for each.     */
/* Points added to point array*/
/*-----------*----*-----------*/
function create_points()
{
	var bounds = false;
	var new_pointsAr = [];
  for (i = 0; i < val_array.length; i++)
  {
    var indice = val_array[i].split(",");

		//if desired point within xDimension bounds
		//should it be or equal to?
		if ((Math.abs(parseInt(indice[0])) <= xDimension) && (Math.abs(parseInt(indice[1])) <= yDimension) && (Math.abs(parseInt(indice[2])) <= zDimension))
		{
				//calls point constructor
			  var new_point = new point(indice[0], indice[1], indice[2]);
				//adds new point to array
				new_pointsAr.push(new_point);
		}
		else
		{
			bounds = true;
		}

  }
	//give alert that some points were not displayed
	if (bounds == true)
	{
		alert("Points outside of dimensions were not displayed")
	}
	return new_pointsAr;
}

/*-----------*----*-----------*/
/* Allows buttons to be       */
/* clicked by enter key       */
/*-----------*----*-----------*/
function make_enter(Iid, Bid)
{
	var mybuttons = document.getElementById(Iid);
	mybuttons.addEventListener("keyup", function(event)
	{
		event.preventDefault();
		if (event.keyCode === 13)
		{
			document.getElementById(Bid).click();
		}
	})
}

/*-----------*----*-----------*/
/* Sums the count times for   */
/* each direction, returns    */
/* array of both total times  */
/*-----------*----*-----------*/
function calc_total_time()
{
	var total_count_time1 = 0;
	var total_count_time2 = 0;
	var total_count_time3 = 0;

	for (j = 0; j < total_points.length; j++)
	{
		var points = total_points[j];
		for(i = 0; i < points.length; i++)
		{
			total_count_time1 += points[i].t_X;
			total_count_time2 += points[i].t_Y;
			total_count_time3 += points[i].t_Z;
		}
	}

	var dir1 = ((parseFloat(total_count_time1)) / 3600).toFixed(2);
	var dir2 = ((parseFloat(total_count_time2)) / 3600).toFixed(2);
	var dir3 = ((parseFloat(total_count_time3)) / 3600).toFixed(2);

	var time_array = [dir1, dir2, dir3];
	//create_table(time_array);
	return time_array;
}

/*-----------*----*-----------*/
/* Clears plot and points     */
/* array, creates new points, */
/* updates table with new     */
/* times                      */
/*-----------*----*-----------*/
function update_plot()
{
	var table = document.getElementById('count-data');
	table.style = "display: none;";
	Plotly.purge('myDiv');
	tracecount = 0;
	total_points = [];
	total_vals.forEach(function(point_array)
  {
		val_array = []

    for(i = 0; i < point_array.length; i++)
    {
      var point = point_array[i];
    	val_array.push(point);
    }
		var points = create_points();
		total_points.push(points);

		if (tracecount == 0){
	    dplot(points);
			tracecount += 1;
	  }
	  else {
	    x = get_points('x', points);
	    y = get_points('y', points);
	    z = get_points('z', points);

	    Plotly.addTraces('myDiv', {x: x, y: y, z:z, type: 'scatter3d', mode: 'markers',marker: {
	      size: 5
	    }});
			tracecount += 1;

	  }
		var totaltimes = calc_total_time();
		console.log(totaltimes);
		time_table(totaltimes);
  });


	//TOTAL POINTS?



}

/*-----------*----*-----------*/
/* Determines which dropdown  */
/* was clicked                */
/*-----------*----*-----------*/
var button_id = '';
$("button").click(function() {
	if (this.id == 'g1' || this.id == 'g2' || this.id == 'g3')
	{
		button_id = this.id;

	}
})

/*-----------*----*-----------*/
/* Changes html text to       */
/* Users selection            */
/*-----------*----*-----------*/
function time_dropdown(value)
{
	var t_button = document.getElementById(button_id);
	t_button.innerHTML = value;
}

/*-----------*----*-----------*/
/* Calculates time scalar     */
/*-----------*----*-----------*/

function calc_arb_time()
{
	//user input is normalized count rate (counts/s/GV),
	var t = parseFloat(document.getElementById('time').value);

	var g1 = parseFloat(document.getElementById('g1').innerHTML);
	var g2 = parseFloat(document.getElementById('g2').innerHTML);
	var g3 = parseFloat(document.getElementById('g3').innerHTML);

	var arbtime = parseInt(300. / ( t * (g1 * g2 * g3)));

	document.getElementById('ti').innerHTML = arbtime + " sec";

	//if more than one file, update the plot
	if (file_count >= 1)
	{
		update_plot();
	}

	return arbtime;
}


/*-----------*----*-----------*/
/* Deals with info popovers   */
/*-----------*----*-----------*/
$(document).ready(function(){
    $('[data-toggle="popover"]').popover();
});

// Popover Data *--->
$('#timepop').popover({
    placement: 'right',
    html: true,
    content: function() {
        return '<b class="title2">Enter Time</b><div class="content2">Enter a Timer Per Point and 3 guage volumes. A Time scalar will be calculated and displayed.</div>';
    },
});

$('#abspop').popover({
    placement: 'right',
    html: true,
    content: function() {
        return '<b class="title1">Enter Linear Absorbtion</b><div class="content1">Enter known linear absorbtion</div><b class="title2">Enter Formula</b><div><i class="note">Linear Absorbtion is Unknown</i></div><div class="content2">Enter a formula and density. Linear Abosorbtion will be calculated and displayed.</div>';
    },
});

$('#filepop').popover({
    placement: 'right',
    html: true,
    content: function() {
        return '<b class="title1">Choose a File</b><div class="content1">Upload a CSV file of data points</div>';
    },
});

$('#dimpop').popover({
    placement: 'right',
    html: true,
    content: function() {
        return '<b class="title1">Dimensions</b><div class="content1">Enter the sample\'s X, Y, and Z dimensions in millimeters. Enter the two theta degrees.</div>';
    },
});

$('#ssspop').popover({
    placement: 'right',
    html: true,
    content: function() {
        return '<b class="title1">Point Generation</b><div class="content1">For each X, Y, Z, enter prefered starting and stopping points, then enter the steps between each point.</div>';
    },
});

$('#csvpop').popover({
    placement: 'right',
    html: true,
    content: function() {
        return '<b class="title1">Export CSV</b><div class="content1">Export generated points to a Comma Separted Value (CSV) file.</div>';
    },
});
//end of popover data <---*

/*-----------*----*-----------*/
/* When the body is clicked   */
/* hide the popover   		    */
/*-----------*----*-----------*/
$('body').on('click', function (e) {
    $('[data-toggle="popover"]').each(function () {
        //the 'is' for buttons that trigger popups
        //the 'has' for icons within a button that triggers a popup
        if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
            $(this).popover('hide');
        }
    });

});


//make specific buttons enter
//make_enter('xDimension', 'thick_button');
make_enter('TLA', 'lin_button');
make_enter('num5', 'submit_button');
make_enter('num4', 'submit_button');
make_enter('time', 'time-button');
