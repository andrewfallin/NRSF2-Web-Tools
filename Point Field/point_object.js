
/*-----------*----*-----------*/
/* Definition of each point   */
/* instantiation              */
/*-----------*----*-----------*/
function point(x, y, z)
{
  this.x = x; //also delta lows
  this.y = y;
  this.z  = z;

  this.dX_top = xDimension - this.x;
  this.dY_top = yDimension - this.y;
  this.dZ_top = zDimension - this.z;

  this.pl_X = parseFloat(calc_pl(this.dY_top, this.dX_top, this.y, theta));
  this.pl_Y = parseFloat(calc_pl(this.dX_top, this.dY_top, this.x, theta));
  this.pl_Z = Math.min(calc_pl(this.dX_top, this.dZ_top, this.x, theta),calc_pl(this.dY_top, this.dZ_top, this.y, theta));


  this.t_X = Math.ceil(calc_time(this.pl_X));
  this.t_Y = Math.ceil(calc_time(this.pl_Y));
  this.t_Z = Math.ceil(calc_time(this.pl_Z));


  //calculates the path length
  function calc_pl(coor_1, coor_2, coor_3, theta)
  {
    var L1 = Math.min((coor_1/Math.cos(theta)),(coor_2/Math.sin(theta)));
    var L2 = Math.min((coor_3/Math.cos(theta)),(coor_2/Math.sin(theta)));
    var pl = (L1 + L2).toFixed(2);
    return pl;

  }

  //calculates the point time
  function calc_time(pl)
  {
    var arbitrary_time = parseFloat(document.getElementById('ti').innerHTML);
    //calc_arb_time()
    var denominator = Math.exp((-total_lin_abs*0.1)*pl);
    return parseFloat((arbitrary_time/denominator).toFixed(2));

  }
}
