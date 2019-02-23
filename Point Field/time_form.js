//Support Functions//

/*-----------*----*-----------*/
/* Lowers the first letter of */
/* a string                   */
/*-----------*----*-----------*/
function jsLcfirst(mystring) {
  return mystring.charAt(0).toLowerCase() + mystring.slice(1);
}

/*-----------*----*-----------*/
/* Capitalizes the first      */
/* letter of a string         */
/*-----------*----*-----------*/
function jsUcfirst(mystring) {
  return mystring.charAt(0).toUpperCase() + mystring.slice(1);
}

/*-----------*----*-----------*/
/* Calculates the total       */
/* number of mols in the      */
/* system                     */
/*-----------*----*-----------*/
function get_total_mols(elements) {
  var total_mols = 0;
  for (var i = 0; i < elements.length; i++) {
    total_mols += elements[i].vars.mols;
  }
  return parseFloat(total_mols.toFixed(4));
}


/*-----------*----*-----------*/
/* Calculates the totals      */
/* for the linear coefficient */
/*-----------*----*-----------*/
function get_total_coef(elements) {
  tot_abo_coef = 0;
  tot_sco_coef = 0;

  for (var i = 0; i < elements.length; i++) {
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
function update(total_mols, density, elements) {
  for (var i = 0; i < elements.length; i++) {
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
function parseFormula(form) {
  var sing_string = "";
  var sing_elements = [];

  for (i = 0; i != form.length; i++) {

    if (form.charAt(i) != " ") {

      if ((isNaN(parseInt(form.charAt(i))) != true) || (form.charAt(i) == (form.charAt(i)).toLowerCase())) //if it is a number
      {
        if (isNaN(parseInt(form.charAt(i + 1))) == true) //if next isnt' a number
        {
          sing_string += form.charAt(i);
          sing_elements.push(sing_string);
          sing_string = "";


        } else {
          sing_string += form.charAt(i);
        }

      } else if (i == form.length - 1) {
        sing_string += form.charAt(i);
        sing_elements.push(sing_string);
        sing_string = "";

      } else {
        if ((form.charAt(i + 1) == (form.charAt(i + 1).toUpperCase()))) {
          if (isNaN(parseInt(form.charAt(i + 1))) == true) //if next isnt' a number
          {
            sing_string += form.charAt(i);
            sing_elements.push(sing_string);
            sing_string = "";
          } else {
            sing_string += form.charAt(i);
          }
        } else {
          sing_string += form.charAt(i);
        }
      }
    }
  }
  return sing_elements;

}

/*-----------*----*-----------*/
/* separates the  from */
/* its molar fraction         */
/*-----------*----*-----------*/
function parseElement(el) {
  if (isNaN(parseInt(el.slice(-1))) != true) //checks if number
  {
    var frac_string = "";
    while (isNaN(parseInt(el.slice(-1))) != true) //while still number
    {
      frac_string += el.slice(-1); //create a string contianing reversed num
      el = el.slice(0, -1) //rest of the string
    }
    var name = el; //sets variables
    var splitstring = frac_string.split("")
    var number = (splitstring.reverse()).join("")

  } else {
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
function check_all(name) {
  if (name in sigA) {
    if (name in apB_sigA) {
      if (name in apB_sigS) {
        if (name in masses) {
          if (name in fin_col) {
            return true;
          }
        }
      }
    }
  } else {
    return false; //returns false if it isn't
  }

}
//end of check_all

var tmol = 0;

/*-----------*----*-----------*/
/* Splits the Formula into    */
/* different in_elements      */
/*-----------*----*-----------*/
function clear_this(divid) {
  tmol = 0;
  formula_elements = [];

  Plotly.deleteTraces(divid, 0);
}


/*-----------*----*-----------*/
/* Called when it is a        */
/* formula                    */
/*-----------*----*-----------*/
function formula_output(sing_elements, density) {
  var formula_elements = new formula(sing_elements, density, tmol);

  tmol = get_total_mols(formula_elements);

  for (i = 0; i <= formula_elements.length; i++) {
    update(tmol, density, formula_elements);
  }
  var coef_array = get_total_coef(formula_elements);

  var loc = document.getElementById("tmol");
  loc.innerHTML = coef_array[2];

  return coef_array;
}

var total_lin_abs = 0;

/*-----------*----*-----------*/
/* Sets linear absorption     */
/* when "enter linear         */
/* absorption" button is      */
/* clicked                    */
/*-----------*----*-----------*/
function set_lin(lin) {
  total_lin_abs = lin;
  var loc = document.getElementById("tmol");
  loc.innerHTML = total_lin_abs;

  if (file_count >= 1) { //checks to see if it is the first file entered
    update_plot();
  }

}


/*-----------*----*-----------*/
/* Handles when a formula is  */
/* entered                     */
/*-----------*----*-----------*/
function object_handler() {

  var form = document.getElementById("num4").value;
  var density = document.getElementById("num5").value;
  total_lin_abs = 0;
  var sing_elements = parseFormula(form);
  alert(sing_elements);

  form = jsLcfirst(form); //going to need this

  //checks everything
  var check = false;

  for (i = 0; i < sing_elements.length; i++) {

    var lower_form = jsLcfirst(sing_elements[i]);
    var sep1 = parseElement(lower_form);

    check = check_all(sep1[0]);

    if (check == false) {
      break;
    }
  }

  if (check == true) {

    var coef_array = formula_output(sing_elements, density);

    set_lin(coef_array[2])

  } else {
    alert("Error: Enter a Valid Element!");
  }

}
