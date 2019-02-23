

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
