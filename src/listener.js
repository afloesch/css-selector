require('./main');
var calls = 0;
var sanitized = [];

// wait 50ms before sending the result to ensure that any click events which are generated
// on multiple elements for the same click only send one result
function shouldSend(selectors, callback) {
  calls++;
  sanitized.push(selectors);
  // if there weren't any previous click events then set the current event as the previous
  setTimeout(function () {
    if(calls > 1) {
      sanitized.shift();
      calls--;
    } else {

      callback(sanitized[0]);
      sanitized = [];
      calls = 0;
    }
  }, 50);
}

HTMLElement.prototype.catchSingleEventSelectors = function(type, callback) {
  this.addEventListener(type, function(e) {
    shouldSend(e.target.getSelectors(null, true), function(selectors) {
      callback(e, selectors);
    });
  });
}

HTMLElement.prototype.catchSingleEventSelector = function(type, callback) {
  this.addEventListener(type, function(e) {
    shouldSend(e.target.getSelector(null, true), function(selectors) {
      callback(e, selectors);
    });
  });
}

SVGSVGElement.prototype.catchSingleEventSelectors = function(type, callback) {
  this.addEventListener(type, function(e) {
    shouldSend(e.target.getSelectors(null, true), function(selectors) {
      callback(e, selectors);
    });
  });
}

SVGSVGElement.prototype.catchSingleEventSelector = function(type, callback) {
  this.addEventListener(type, function(e) {
    shouldSend(e.target.getSelector(null, true), function(selectors) {
      callback(e, selectors);
    });
  });
}
