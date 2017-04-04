// check that selector is unique and matches the given html element
function testSelector(element, selector) {
  var check = document.querySelectorAll(selector);

  if(check.length && check.length === 1 && check[0] === element) {
    return true;
  }

  return false;
}

// check if element is an anchor tag and generate a unique selector for that case
function getLinkSelector(element) {
  var link = element.getAttribute('href');

  if(link) {

    // these kinds of js links make for bad selectors
    if(link === "#") {
      return null;
    }

    // cutout any query string params from the link and create a "contains" selector
    if(link.match('\\?')) {
      var parts = link.split('?', 1);
      return element.tagName + "[href*='" + parts[0] + "']"
    } else {
      return element.tagName + "[href='" + link + "']";
    }
  }

  return null;
}

// check for identifying attributes on html element
function checkForAttribute(element, attributes) {
  var selector = null;

  for(var i = 0; i < attributes.length; i++) {

    var attr = element.getAttribute(attributes[i]);

    // if the attribute is found create a selector for it and break the loop and
    // return it
    if(attr) {
      selector = element.tagName + "[" + attributes[i] + "='" + attr + "']";
      break;
    }
  }

  return selector;
}

// try to generate a unique selector for an html element based off of the set
// attributes
function getUniqueAttributeSelector(element, attributes) {
  var selector = null;

  for(var i = 0; i < attributes.length; i++) {

    var attr = element.getAttribute(attributes[i]);

    // if the attribute is found create a selector for it
    if(attr) {
      var s = element.tagName + "[" + attributes[i] + "='" + attr + "']";
    }

    // if there's a selector and it's unique then break the loop and return it
    if(s && testSelector(element, s)) {
      selector = element.tagName + "[" + attributes[i] + "='" + attr + "']";
      break;
    }
  }

  return selector;
}

// check if the element given is inside a button or anchor tag and return the
// link element if there is one
function checkForBetterParent(element) {
  var e = element;

  // walk up the element parent nodes looking for any known link elements
  while(e.parentElement) {
    // if a known link element is found then break the loop and return that element
    if(e.parentElement.tagName === "BUTTON" || e.parentElement.tagName === "A") {
      element = e.parentElement;
      break;
    }
    e = e.parentElement;
  }

  return element;
}

function getIndexPosition(element) {
  var index = 1;
  var e = element;

  while(e.previousElementSibling) {
    index++;
    e = e.previousElementSibling;
  }

  return index;
}

// walk up the DOM from the element node given, until the BODY is reached, and return
// a css selector from the journey
function getCssSelector(element, attributes) {
  var e = element;
  var string = "";

  while(e) {

    // if there is an attribute of interest on the node then create a selector
    var attrSelector = checkForAttribute(e, attributes);

    if(attrSelector) {
      string = attrSelector + string;
    } else {
      var index = getIndexPosition(e);
      if (index > 1) {
        string = e.tagName + ":nth-child(" + index + ")" + string;
      } else {
        string = e.tagName + string;
      }
    }

    if (testSelector(element, string)) {
      e = null;
      break;
    }

    // if the element has a parent element then continue the loop
    if(e.parentElement &&
       e.parentElement.tagName !== "BODY" &&
       e.parentElement.tagName !== "HTML") {
      string = " > " + string;
      e = e.parentElement;
    } else if (e.parentElement && e.parentElement.tagName === "BODY") {
      string = "BODY > " + string;
      e = null;
      break;
    } else if (e.parentElement && e.parentElement.tagName === "HTML") {
      string = "HTML > " + string;
      e = null;
      break;
    } else {
      e = null;
    }
  }

  return string;
}

// get a selector for the given element
function getSelectors(element, multi, customAttributes, preferLink) {

  var selectors = [];
  var item = element;
  var attributes = [
    "name",
    "id",
    "type",
    "action",
    "for",
    "src",
    "alt",
    "data-tl-id",
    "data-id",
    "aria-label"
  ];

  if (customAttributes && Array.isArray(customAttributes)) {
    attributes = customAttributes;
  }

  if (preferLink) {
    item = checkForBetterParent(item);
  }

  var anchorSelector = getLinkSelector(item);
  var attrSelector = getUniqueAttributeSelector(item, attributes);
  var cssSelector1 = getCssSelector(item, attributes);
  var cssSelector2 = getCssSelector(item, []);
  var cssSelector3 = getCssSelector(item, ["id", "name"]);

  if(anchorSelector) {
    selectors.push(anchorSelector);
  }

  if(attrSelector) {
    selectors.push(attrSelector);
  }

  if(cssSelector1 && selectors.indexOf(cssSelector1) < 0) {
    selectors.push(cssSelector1);
  }

  if(cssSelector2 && selectors.indexOf(cssSelector2) < 0) {
    selectors.push(cssSelector2);
  }

  if(cssSelector3 && selectors.indexOf(cssSelector3) < 0) {
    selectors.push(cssSelector3);
  }

  if (!multi) return selectors[0];

  return selectors;
}

HTMLElement.prototype.getSelectors = function(attributes, link) {
  return getSelectors(this, true, attributes, link);
}

HTMLElement.prototype.getSelector = function(attributes, link) {
  return getSelectors(this, false, attributes, link);
}

SVGSVGElement.prototype.getSelectors = function(attributes, link) {
  return getSelectors(this, true, attributes, link);
}

SVGSVGElement.prototype.getSelector = function(attributes, link) {
  return getSelectors(this, false, attributes, link);
}

module.exports = getSelectors;
