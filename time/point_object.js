
/*-----------*----*-----------*/
/* Definition of each point   */
/* instantiation              */
/*-----------*----*-----------*/
function point(x, y, z, thickness)
{
  this.x = x;
  this.y = y;
  this.z  = z;

  this.plD1 = calc_pl(thickness, 1, x);
  this.plD23 = calc_pl(thickness, 2, y);

  this.tD1 = Math.ceil(calc_time(this.plD1));
  this.tD2 = Math.ceil(calc_time(this.plD23));

  //calculates the path length
  function calc_pl(thickness, dir, x)
  {
    if (dir == 1)
    {
      var multiplier = Math.abs( x - thickness/2);
      var pl = (2/(Math.sqrt(2)) * multiplier).toFixed(2);
      return pl;
    }
    else if (dir == 2)
    {
      var pl = (2/(Math.sqrt(2)) * thickness).toFixed(2);
      return pl;
    }
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
