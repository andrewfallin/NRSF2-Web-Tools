var tracecount = 0;

function gather_points() {
  startx = parseInt(document.getElementById('startx').value);
  starty = parseInt(document.getElementById('starty').value);
  startz = parseInt(document.getElementById('startz').value);

  stopx = parseInt(document.getElementById('stopx').value);
  stopy = parseInt(document.getElementById('stopy').value);
  stopz = parseInt(document.getElementById('stopz').value);

  stepx = parseInt(document.getElementById('stepx').value);
  stepy = parseInt(document.getElementById('stepy').value);
  stepz = parseInt(document.getElementById('stepz').value);

  sss_array = [startx, starty, startz, stopx, stopy, stopz, stepx, stepy, stepz];

  x_points = [];
  y_points = [];
  z_points = [];
  csv_points = [];

  if (isNaN(startx) == true || isNaN(starty) == true || isNaN(startz) == true || isNaN(stopx) == true ||
    isNaN(stopz) == true || isNaN(stopy) == true || isNaN(stepx) == true || isNaN(stepy) == true || isNaN(stepz) == true) {
    alert("Values can only be Numbers.");
  } else {
    for (i = startx; i <= stopx; i += stepx) {
      //alert("Inside I loop");


      for (j = starty; j <= stopy; j += stepy) {
        //alert("Inside J loop");

        for (k = startz; k <= stopz; k += stepz) {
          x_points.push(i);
          y_points.push(j);
          z_points.push(k);
          csv_points.push(i + ',' + j + ',' + k);
          //console.log(csv_points);
          if (stepz == 0) {
            break;
          }
        }
        if (stepy == 0) {
          break;
        }
      }
      if (stepx == 0) {
        break;
      }
    }

    val_array = csv_points;
    //pplot(x_points, y_points, z_points);
    var x_array = compile_val(0);
    var y_array = compile_val(1);
    var z_array = compile_val(2);

    total_vals.push(val_array);
    //create points calc point data
    points = [];

    points = create_points();

    total_points.push(points);

    //plot points
    if (tracecount == 0) {
      dplot(points);

    } else {
      x = get_points('x', points);
      y = get_points('y', points);
      z = get_points('z', points);

      Plotly.addTraces('myDiv', {
        x: x,
        y: y,
        z: z,
        type: 'scatter3d',
        mode: 'markers',
        marker: {
          size: 5
        }
      });

    }
    var totaltimes = calc_total_time();
    time_table(totaltimes);
    trace_table(document.getElementById('myDiv').data, sss_array);


    tracecount += 1;
  }
  //dplot(newpoints);

}

function export_CSV() {
  let csvContent = "data:text/csv;charset=utf-8,X,Y,Z,Time X (sec),Time Y (sec),Time Z (sec)\n";
  total_points.forEach(function(point_array) {
    for (i = 0; i < point_array.length; i++) {
      var row = point_array[i].x + "," + point_array[i].y + "," + point_array[i].z + "," + point_array[i].t_X + "," + point_array[i].t_Y + "," + point_array[i].t_Z + "," + "\n";
      csvContent += row;
    }
  });
  var encodedUri = encodeURI(csvContent);
  window.open(encodedUri);
}
