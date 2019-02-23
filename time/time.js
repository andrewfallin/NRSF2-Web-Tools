
var is_file = false;

/*-----------*----*-----------*/
/* Performs file operation    */
/* when entered 		          */
/*-----------*----*-----------*/
var file_count = 0;
;( function ( document, window, index )
{
	var inputs = document.querySelectorAll( '.inputfile' );
	Array.prototype.forEach.call( inputs, function( input )
	{
		var label	 = input.nextElementSibling,
			labelVal = label.innerHTML;

		input.addEventListener( 'change', function( e )
		{
			var fileName = '';
			if( this.files && this.files.length > 1 )
				fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
			else
				fileName = e.target.value.split( '\\' ).pop();

			if( fileName )
				label.querySelector( 'span' ).innerHTML = fileName;
			else
				label.innerHTML = labelVal;

		});

		// Firefox bug fix
		input.addEventListener( 'focus', function(){ input.classList.add( 'has-focus' ); });
		input.addEventListener( 'blur', function(){ input.classList.remove( 'has-focus' ); });

	});
}( document, window, 0 ));

var val_array = [];
var thickness = 0;
var points = [];

/*-----------*----*-----------*/
/* Handles selecting a file   */
/*-----------*----*-----------*/
function handleFileSelect(evt) {
   var files = evt.target.files; // FileList object

   // Loop through the FileList and render image files as thumbnails.
   for (var i = 0, f; f = files[i]; i++) {

     //Only process csv files.
     if (!f.type.match('.csv')) {
       alert("Please Enter a CSV File");
       continue;
     }

     var reader = new FileReader();

     // Closure to capture the file information.
     reader.onload = (function(theFile) {
       return function(e) {
         // Render thumbnail.
         var span = document.createElement('span');

         val_array = e.target.result.split("\n");
				 console.log(val_array);
         var x_array = compile_val(0);
         var y_array = compile_val(1);
         var z_array = compile_val(2);

				 //new file entered, clear plot and point array
				 if (file_count >= 1) {

			     Plotly.purge('myDiv')
					 points = [];
			   }

				 //create points calc point data
         create_points();

				 //plot points
         dplot(points);
				 points = [];

         document.getElementById('list').insertBefore(span, null);

				 is_file = true;
	 			file_count = file_count + 1;

       };
     })(f);

     // Read in the image file as a data URL.
     reader.readAsText(f);

   }

 }
    document.getElementById('file').addEventListener('change', handleFileSelect, false);

/*-----------*----*-----------*/
/* Sets thickness when        */
/* entered     								*/
/*-----------*----*-----------*/
function set_thickness()
{
	var output = document.getElementById("thick");
  thickness = parseFloat(document.getElementById("thickness").value);

	if (file_count >= 1)
	{
		update_plot();
	}
	//makes sure entered is a number
	if (isNaN(thickness) == true)
	{
		thickness = 0;
		alert("Thickness must be a number!");
	}
	//display thickness
	output.innerHTML = thickness + "  mm";
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
  for (i = 0; i < val_array.length; i++)
  {
    var indice = val_array[i].split(",");

		//if desired point within thickness bounds
		if ((Math.abs(parseInt(indice[0])) < thickness/2))
		{
				//calls point constructor
			  var new_point = new point(indice[0], indice[1], indice[2], thickness);
				//adds new point to array
				points.push(new_point);
		}
		else
		{
			bounds = true;
		}

  }
	//give alert that some points were not displayed
	if (bounds == true)
	{
		alert("Points out of thickness bounds were not displayed")
	}
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
function calc_total_time(points)
{
	var total_count_time1 = 0;
	var total_count_time2 = 0;
	for(i = 0; i < points.length; i++)
	{
		total_count_time1 += points[i].tD1;
		total_count_time2 += points[i].tD2;
	}

	var dir1 = ((parseFloat(total_count_time1)) / 3600).toFixed(2);
	var dir2 = ((parseFloat(total_count_time2)) / 3600).toFixed(2);
	var time_array = [dir1, dir2];
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
	Plotly.purge('myDiv');
	points = [];

	create_points();

	dplot(points);
  var rowcount = $("#count-data tr").length;

	if (rowcount > 1)
	{
		table.rows[1].cells[1].innerHTML = "";
		table.rows[2].cells[1].innerHTML = "";

		table.rows[1].cells[2].innerHTML = "";
		table.rows[2].cells[2].innerHTML = "";

	}

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
        return '<b class="title1">Thickness</b><div class="content1">Thickness of the material in mm.</div><b class="title2">Enter Time</b><div class="content2">Enter a Normalized Count Rate and 3 guage volumes. Incident Height (IH), Incident Width (IW), and Diffraction (D) define Intstrument Slits. A Time scalar will be calculated and displayed.</div>';
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
make_enter('thickness', 'thick_button');
make_enter('TLA', 'lin_button');
make_enter('num5', 'submit_button');
make_enter('num4', 'submit_button');
make_enter('time', 'time-button');
