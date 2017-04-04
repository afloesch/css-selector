//var calls = 0;
//var sanitized = [];
var attributes = [
  "name",
  "src",
  "id",
  "type",
  "action",
  "for",
  "alt",
  "data-tl-id",
  "data-id",
  "aria-label"
];

// check that selector is unique and matches the given html element
function testSelector(element, selector) {
  var check = document.querySelectorAll(selector);

  if(check.length && check.length === 1 && check[0] === element) {
    return true;
  }

  return false;
}

// check if element is an anchor tag and generate a unique selector for that case
function checkForLink(element) {
  var link = element.getAttribute('href');
  if(link) {

    if(link === "#") {
      return null;
    }

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

  if(attribs.indexOf("id") > -1) {
    attribs.splice(attribs.indexOf("id"), attribs.indexOf("id") + 1);
  }

  for(var i = 0; i < attribs.length; i++) {

    var attr = element.getAttribute(attribs[i]);

    if(attr) {
      selector = element.tagName + "[" + attribs[i] + "='" + attr + "']";
      break;
    }
  }

  return selector;
}

// try to generate a unique selector for an html element based off of the set
// attributes to parse
function checkForUniqueAttributeSelector(element) {
  var selector = null;

  for(var i = 0; i < attributes.length; i++) {

    var attr = element.getAttribute(attributes[i]);

    if(attr) {
      var s = element.tagName + "[" + attributes[i] + "='" + attr + "']";
    }

    if(s && testSelector(element, s)) {
      selector = element.tagName + "[" + attributes[i] + "='" + attr + "']";
      break;
    }
  }

  return selector;
}

// check if the element given is inside a button or anchor tag
function checkForBetterParent(element) {
  var e = element;

  while(e.parentElement) {
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
function walkDom(element) {
  var e = element;
  var string = "";

  while(e) {

    if(e.tagName === "BODY") {
      string = "BODY" + string;
      e = null;
      break;
    }

    var attr = checkForAttribute(e, attributes);

    if(attr) {
      string = attr + string;
    } else {
      string = e.tagName + string;
    }

    if(e.parentElement && e.parentElement.childElementCount > 1) {

      var children = Array.prototype.slice.call(e.parentElement.children);
      var index = children.indexOf(e);
      string = string.replace(e.tagName, ":nth-child(" + (index + 1) + ")");
    }

    if(e.parentElement && e.parentElement.tagName !== "HTML") {
      string = " > " + string;
      e = e.parentElement;
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
function getSelectors(element/*, callback*/) {
  var selectors = [];
  var item = element;
  item = checkForBetterParent(item);
  var anchor = checkForLink(item);
  var attr = checkForUniqueAttributeSelector(item);
  var css = walkDom(item);

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

HTMLElement.prototype.getSelectors = function() {
  return getSelectors(this);
}

module.exports = getSelectors;
