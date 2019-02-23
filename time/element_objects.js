

//Element Object and Associated Functions//

var avagadro = 6.02213 * (Math.pow(10, 23));;
var not_num = 1 * (Math.pow(10, -24));

function element(element, name, number, density, tmol)
{
  this.vars = new Object();
  this.vars.element = element;
  this.vars.name = name;
  this.vars.number = number;
  this.vars.density = parseFloat(density);

  this.vars.p_names = ["Element", "Density", "True Absorbtion Coefficient",
                      "Scattering Absorbtion Coefficient", "Big Sigma A", "Sigma A", "Sigma S",
                      "Mass", "Mols", "Big Sigma S", "Thermal Neutrons (ABO)", "Thermal Neutrons (SCO)"];

  this.per_calc = per_calc;
  this.output_vars = output_vars;
  this.get_wt_fraction = get_wt_fraction;
  this.calc_lc = calc_lc;

  this.sep = parseElement(this.vars.element);

  set_vars(this.vars); //this.vars[bA, baA, baS, mass, mols]
  per_calc(this.vars);

  if (tmol == 0)
  {
    get_wt_fraction(this.vars, this.vars.mols);
  }
  else {

    get_wt_fraction(this.vars, tmol);

  }

  this.vars.labo = calc_lc(this.vars, this.vars.asigA);
  this.vars.lsco = calc_lc(this.vars, this.vars.asigS);
  //________________________End of Constructor _________________________________

  //______________________________Functions_____________________________________

  //moved check_element and parseElement, need to update constructor
  //functions accordingly


  /*-----------*----*-----------*/
  /* Sets variables with values */
  /* from the my_objects file   */
  /*-----------*----*-----------*/
  function set_vars(vars)
  {
      vars.bsigA = sigA[vars.name];
      vars.asigA = apB_sigA[vars.name];
      vars.asigS = apB_sigS[vars.name];
      vars.mass = masses[vars.name];
      vars.mols = vars.mass * vars.number;
    //  return [bsigA, asigA, asigS, mass, mols];

  }
  // end of set set_vars

  /*-----------*----*-----------*/
  /* Performs calculations for  */
  /*    - BigSig S              */
  /*    - Thermal Neutrons ABO  */
  /*    - Therman Neutrons SCO  */
  /*-----------*----*-----------*/
  function per_calc(vars)
  {
    vars.bsigS = parseFloat((1 * vars.asigS).toFixed(4));
    vars.tn_ABO = parseFloat((vars.asigA / vars.mass).toFixed(4));
    vars.tn_SCO = parseFloat((vars.bsigS / vars.mass).toFixed(4));

  }
  //end of percalc

  /*-----------*----*-----------*/
  /* Displays the information   */
  /* for each element           */
  /*-----------*----*-----------*/
  function output_vars(vars, y, z)
  {
    mystring = ""; mystring2 = "";

    var count = 0;
    var el = document.getElementById("el");
    var den = document.getElementById("el2");

    toggle_show("title_col1");
    toggle_show("title_col2");
    toggle_show("totals_title");


    for(item in vars)
    {
      switch(item)
      {
        case "element":
          el.innerHTML = vars.p_names[0] + ": " + jsUcfirst(element);
          break

        case "density":
          den.innerHTML = vars.p_names[1] + ": " + vars[item];
          break

        case "labo":
          mystring += (vars.p_names[2] + ": " + vars[item] + "<br />");
          break;

        case "lsco":
          mystring2 += (vars.p_names[3] + ": " + vars[item] + "<br />");
          break;

        case "asigA":
          mystring += (vars.p_names[5] + ": " + vars[item] + "<br />");
          mystring2 += (vars.p_names[5] + ": " + vars[item] + "<br />");
          break;

        case "bsigA":
          mystring2 += (vars.p_names[4] + ": " + vars[item] + "<br />");
          break;

        case "asigS":
          mystring2 += (vars.p_names[6] + ": " + vars[item] + "<br />");
          break;

        case "mass":
          mystring2 += (vars.p_names[7] + ": " + vars[item] + "<br />");
          mystring += (vars.p_names[7] + ": " + vars[item] + "<br />");
          break;

        case "mols":
          mystring2 += (vars.p_names[8] + ": " + vars[item] + "<br />");
          mystring += (vars.p_names[8] + ": " + vars[item] + "<br />");
          break;

        case "bsigS":
          mystring2 += (vars.p_names[9] + ": " + vars[item] + "<br />");
          break;

        case "tn_SCO":
          mystring2 += (vars.p_names[11] + ": " + vars[item] + "<br />");
          break;

        case "tn_ABO":
          mystring += (vars.p_names[10] + ": " + vars[item] + "<br />");
          break;
      }
      count += 1;
    }
    y.innerHTML = mystring;
    z.innerHTML = mystring2;
  }
  //end of output_vars

  /*-----------*----*-----------*/
  /* Performs calculations for  */
  /* the Linear Coefficient     */
  /*-----------*----*-----------*/
  function calc_lc(vars, sig)
  {
    front = (vars.density * vars.wt_fraction ) / vars.mass;
    back = avagadro * sig * not_num;
    return parseFloat((front * back).toFixed(4));
  }

  /*-----------*----*-----------*/
  /* Performs calculations      */
  /* and returns the Weight     */
  /* Fraction                   */
  /*-----------*----*-----------*/
  function get_wt_fraction(vars, total_mols)
  {

    vars.wt_fraction = parseFloat((vars.mols/total_mols).toFixed(4));
    return vars.wt_fraction;
  }


}



function formula(sing_elements, density, tmol)
{
  var formula_elements = [];

  for( i = 0; i < sing_elements.length; i++)
  {
    var lower_el = jsLcfirst(sing_elements[i]); //going to need this
    var sep = parseElement(lower_el);
    var ent_element = new element(lower_el, sep[0], sep[1], density, tmol);
    formula_elements.push(ent_element);
  }

  return formula_elements;

}
