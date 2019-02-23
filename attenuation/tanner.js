
//Support Functions//

var cur_elements = [];

/*-----------*----*-----------*/
/* Lowers the first letter of */
/* a string                   */
/*-----------*----*-----------*/
function jsLcfirst(mystring)
{
    return mystring.charAt(0).toLowerCase() + mystring.slice(1);
}

/*-----------*----*-----------*/
/* Capitalizes the first      */
/* letter of a string         */
/*-----------*----*-----------*/
function jsUcfirst(mystring)
{
    return mystring.charAt(0).toUpperCase() + mystring.slice(1);
}

/*-----------*----*-----------*/
/* Reveals hidden divs        */
/*-----------*----*-----------*/
function toggle_show(id)
{
  var x = document.getElementById(id)

  x.style.display = "block"
}

/*-----------*----*-----------*/
/* Calculates the total       */
/* number of mols in the      */
/* system                     */
/*-----------*----*-----------*/
function get_total_mols(elements)
{
  var total_mols = 0;
  for (var i = 0; i < elements.length; i++)
  {
    total_mols += elements[i].vars.mols;
  }
  return parseFloat(total_mols.toFixed(4));
}

/*-----------*----*-----------*/
/* Calculates the total       */
/* weight fraction of the     */
/* system                     */
/*-----------*----*-----------*/
function get_total_wt_fraction()
{
  var twf = 0;
  for (var i = 0; i < cur_elements.length; i++)
  {
    twf += cur_elements[i].vars.wt_fraction;
  }
  return parseFloat(twf.toFixed(4));
}

/*-----------*----*-----------*/
/* Calculates the totals      */
/* for the linear coefficient */
/*-----------*----*-----------*/
function get_total_coef(elements)
{
  tot_abo_coef = 0;
  tot_sco_coef = 0;

  for (var i = 0; i < elements.length; i++)
  {
    tot_abo_coef += elements[i].vars.labo;
    tot_sco_coef += elements[i].vars.lsco;

  }

  total_coef = (tot_abo_coef + tot_sco_coef).toFixed(4);
  return [tot_abo_coef.toFixed(4), tot_sco_coef.toFixed(4), total_coef];
}

/*-----------*----*-----------*/
/* Updates the flexible       */
/* values in each element     */
/*-----------*----*-----------*/
function update(total_mols, density, elements)
{
  for (var i = 0; i < elements.length; i++)
  {
    elements[i].vars.density = density;
    elements[i].get_wt_fraction(elements[i].vars, total_mols);
    elements[i].vars.labo = elements[i].calc_lc(elements[i].vars, elements[i].vars.asigA);
    elements[i].vars.lsco = elements[i].calc_lc(elements[i].vars, elements[i].vars.asigS);

  }
}

/*-----------*----*-----------*/
/* Splits the Formula into    */
/* different in_elements      */
/*-----------*----*-----------*/
function parseFormula(form)
{
  var sing_string = "";
  var sing_elements = [];

  for (i = 0; i != form.length; i++)
  {

    if ((isNaN(parseInt(form.charAt(i))) != true) || (form.charAt(i) == (form.charAt(i)).toLowerCase())) //if it is a number
    {
      if (isNaN(parseInt(form.charAt(i+1))) == true) //if next isnt' a number
      {
        sing_string += form.charAt(i);
        sing_elements.push(sing_string);
        sing_string = "";
      }
      else
      {
        sing_string += form.charAt(i);
      }
    }
    else if (i == form.length -1)
    {
      sing_string += form.charAt(i);
      sing_elements.push(sing_string);
      sing_string = "";
    }
    else
    {
      sing_string += form.charAt(i);
    }
  }

  return sing_elements;

}

/*-----------*----*-----------*/
/* separates the element from */
/* its molar fraction         */
/*-----------*----*-----------*/
function parseElement(el)
{
  if (isNaN(parseInt(el.slice(-1))) != true) //checks if number
  {
    var frac_string = "";
    while (isNaN(parseInt(el.slice(-1))) != true) //while still number
    {
      frac_string += el.slice(-1);   //create a string contianing reversed num
      el = el.slice(0,-1) //rest of the string
    }
    var name = el; //sets variables
    var splitstring = frac_string.split("")
    var number = (splitstring.reverse()).join("")

  }
  else
  {
    var name = el; //sets variables
    var number = 1;
  }

  return [name, number] //returns array containing both values
}
//end of parse element


/*-----------*----*-----------*/
/* checks element is in all   */
/* of the objects             */
/*-----------*----*-----------*/
function check_all(name)
{
  if (name in sigA)
  {
    if (name in apB_sigA)
    {
      if (name in apB_sigS)
      {
        if (name in masses)
        {
          if (name in fin_col)
          {
            return true;
          }
        }
      }
    }
  }
  else
  {
    return false; //returns false if it isn't
  }

}
//end of check_all

/*-----------*----*-----------*/
/* Checks if the enetered     */
/* element is in the list of  */
/* instantiated elements      */
/*-----------*----*-----------*/
function check_entered(name)
{
  for (var i = 0; i < cur_elements.length; i++)
  {
    if(cur_elements[i].vars.element == name)
    {
      return true;
    }
  }
  return false;
}

var tmol = 0;

function html_output(element, coef_array)
{
  var y = document.getElementById("element_col1");
  var z = document.getElementById("element_col2");
  var tot = document.getElementById("tots");

  element.output_vars(element.vars, y, z);
  console.log(cur_elements);

  total_string = "Total Mols: " + tmol + "<br />" +
                 "Element Weight Fraction: " + element.vars.wt_fraction + "<br />" +
                 "Total True Absorbtion: " + coef_array[0] + "<br />" +
                 "Total Scattering Absorbtion: " + coef_array[1] + "<br />" +
                 "Total Linear Absorbtion Coefficient: "+ coef_array[2] + "<br />";

  tot.innerHTML = total_string;
}

function clear_this()
{
  tmol = 0;
  cur_elements = [];
  var y = document.getElementById("element_col1");
  var z = document.getElementById("element_col2");
  var x = document.getElementById("totals_title");
  var xx = document.getElementById("title_col1");
  var yy = document.getElementById("title_col2");
  var zz = document.getElementById("tots");

  x.style.display = 'none';
  y.style.display = 'none';
  z.style.display = 'none';
  xx.style.display = 'none';
  yy.style.display = 'none';
  zz.style.display = 'none';

  Plotly.deleteTraces('element_cluster', 0);
}

function unclear()
{
  var y = document.getElementById("element_col1");
  var z = document.getElementById("element_col2");
  var x = document.getElementById("totals_title");
  var xx = document.getElementById("title_col1");
  var yy = document.getElementById("title_col2");
  var zz = document.getElementById("tots");

  x.style.display = 'block';
  y.style.display = 'block';
  z.style.display = 'block';
  xx.style.display = 'block';
  yy.style.display = 'block';
  zz.style.display = 'block';
}

/*-----------*----*-----------*/
/* Called when it is a        */
/* formula                    */
/*-----------*----*-----------*/
function formula_output(sing_elements, density)
{
  var formula_elements = new formula(sing_elements, density, tmol);

  tmol = get_total_mols(formula_elements);

  for (i = 0; i <= formula_elements.length; i++)
  {
      update(tmol, density, formula_elements);
  }

  var coef_array = get_total_coef(formula_elements);

  //html_output(formula_elements[0], coef_array);
  var loc = document.getElementById("tmol");
  loc.innerHTML = coef_array[2];


  //maybe output the first element,
    //  have a button for both elements up at the top of the
    //  page and allow for the toggling between the two

  console.log(cur_elements);
  console.log(formula_elements);
  return coef_array;
}

/*-----------*----*-----------*/
/* Called when it is a single */
/* element                    */
/*-----------*----*-----------*/
function element_output(sing_elements, density)
{

  //parse the elemen
  var lower_el = jsLcfirst(sing_elements[0]); //going to need this
  var sep = parseElement(lower_el);
  var ent_element = new element(lower_el, sep[0], sep[1], density, tmol);

  //else call formula Constructor

  var in_elements = check_entered(lower_el);
  if (in_elements == false)
  {
    cur_elements.push(ent_element);
    tmol =  get_total_mols(cur_elements);
  }

  if (cur_elements.length >= 1)
  {
    update(tmol, density, cur_elements);

  }

  //var tweight = get_total_wt_fraction(); I don't think that this is needed anymore
  var coef_array = get_total_coef(cur_elements);

  //html_output(ent_element, coef_array);
  var loc = document.getElementById("tmol");
  loc.innerHTML = total_lin_abs;

  return coef_array;
}

var total_lin_abs = 0;

function set_total_lin()
{
  var val = document.getElementById("TLA");
  total_lin_abs = parseFloat(val.value);
}

function object_handler()
{
  var el = document.getElementById("num4").value;
  var density = document.getElementById("num5").value;

  var sing_elements = parseFormula(el);
  console.log(sing_elements);
  //unclear();
  el = jsLcfirst(el); //going to need this

  //checks everything

  var check = true;

  for (i = 0; i < sing_elements.length; i++)
  {
    var lower_el = jsLcfirst(sing_elements[i]); //going to need this
    var sep1 = parseElement(lower_el);
    console.log(sep1[0]);
    check = check_all(sep1[0]);
    if (check == false)
    {
      break;
    }
  }

  if (check == true)
  {
    if (sing_elements.length == 1)
    {
      var coef_array = element_output(sing_elements, density);
    }
    else
    {
      var coef_array = formula_output(sing_elements, density);
    }
    total_lin_abs = coef_array[2];
    //create_graph(coef_array[2]);
  }
  else
  {
    alert("Error: Enter a Valid Element!");
  }
}
