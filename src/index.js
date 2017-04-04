//var calls = 0;
//var sanitized = [];
var attributes = [];

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
function checkForAttribute(element) {
  var selector = null;
  var attribs = Array.from(attributes);

  // remove id from the check if it is set. you might not agree with this at first
  // glance, but by removing this we ensure that the getIndexSelector check returns
  // a selector that works with dynamic ids from the server.
  if(attribs.indexOf("id") > -1) {
    attribs.splice(attribs.indexOf("id"), attribs.indexOf("id") + 1);
  }

  for(var i = 0; i < attribs.length; i++) {

    var attr = element.getAttribute(attribs[i]);

    // if the attribute is found create a selector for it and break the loop and
    // return it
    if(attr) {
      selector = element.tagName + "[" + attribs[i] + "='" + attr + "']";
      break;
    }
  }

  return selector;
}

// try to generate a unique selector for an html element based off of the set
// attributes
function getUniqueAttributeSelector(element) {
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

// walk up the DOM from the element node given, until the BODY is reached, and return
// a css selector from the journey
function getIndexSelector(element) {
  var e = element;
  var string = "";

  while(e) {

    // if there is an attribute of interest on the node then create a selector
    var attr = checkForAttribute(e, attributes);

    if(attr) {
      string = attr + string;
    } else {
      string = e.tagName + string;
    }

    // if the element has a parent, and that parent has other children then change
    // the selector to :nth-child and select the element by index position
    if(e.parentElement && e.parentElement.childElementCount > 1) {
      var children = Array.prototype.slice.call(e.parentElement.children);
      var index = children.indexOf(e);
      string = string.replace(e.tagName, ":nth-child(" + (index + 1) + ")");
    }

    // if the element has a parent element then continue the loop
    if(e.parentElement && e.parentElement.tagName !== "BODY") {
      string = " > " + string;
      e = e.parentElement;
    } else if (e.parentElement && e.parentElement.tagName === "BODY") {
      string = "BODY > " + string;
      e = null;
      break;
    } else {
      e = null;
    }
  }

  return string;
}

// wait 50ms before sending the result to ensure that any click events which are generated
// on multiple elements for the same click
/*function shouldSend(element, selectors, callback) {
  calls++;
  sanitized.push(selectors);
  // if there weren't any previous click events then set the current event as the previous
  setTimeout(function () {
    if(calls > 1) {
      sanitized.shift();
      calls--;
    } else {

      var filtered = sanitized[0].filter(function (s) {
        if(s.toLowerCase().match('input') ||
          s.toLowerCase().match('button') ||
          s.toLowerCase().match('href') ||
          s.match('SELECT') ||
          s.match(' A') ||
          s.match('A\\[')) {
          return true;
        }
        return false;
      });

      if(filtered && filtered.length && filtered.length > 0) {
        callback(filtered);
      } else {
        callback(sanitized[0]);
      }

      sanitized = [];
      calls = 0;
    }
  }, 50);
}*/

// get a selector for the given element
function getSelectors(element, customAttributes, preferLink) {

  var selectors = [];
  var item = element;
  var anchor;
  var attr;
  var css;

  attributes = [
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

  anchor = getLinkSelector(item);
  attr = getUniqueAttributeSelector(item);
  css = getIndexSelector(item);

  if(anchor) {
    selectors.push(anchor);
  }

  if(attr) {
    selectors.push(attr);
  }

  if(css && selectors.indexOf(css) < 0) {
    selectors.push(css);
  }

  if(selectors.length === 0) {

    /*if (typeof callback === "function") {
      callback('could not generate selector!', null);
    }

    return Promise.reject('could not generate selector!');*/

    return null;

  } else {

    /*shouldSend(item, selectors, function (result) {

      if (typeof callback === "function") {
        callback(null, result);
      }

      return Promise.resolve(result);
    });*/

    return selectors;
  }
}

HTMLElement.prototype.getSelectors = function(attributes, link) {
  return getSelectors(this, attributes, link);
}

module.exports = getSelectors;
