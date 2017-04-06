describe('testSelector', function() {
  it('Match the selectors found with the test element created.', function() {

    var element = document.createElement('BUTTON');
    element.type = "submit";
    document.body.lastElementChild.appendChild(element);

    var selectors = element.getSelectors();

    var test = testSelector(element, selectors);

    assert(test === true, 'Failed properly matched selector!');
  });
});

describe('getLinkSelector', function() {
  it('Generate selector with full href attrib.', function() {
    var element = document.createElement('A');
    element.setAttribute('href', '/some/path/to/page');
    document.body.appendChild(element);

    var selector = element.getSelector();

    assert(selector === "A[href='/some/path/to/page']", "Failed to create href link!");
  });

  it('Generate selector with contains href attrib.', function() {
    var element = document.createElement('A');
    element.setAttribute('href', '/some/path/to/page?param=test');
    document.body.appendChild(element);

    var selector = element.getSelector();

    assert(selector === "A[href*='/some/path/to/page']", "Failed to create a contains href link!");
  });

  it('Return the child element.', function() {
    var element = document.querySelector('body > button[name="btn"] > span');

    var selectors = element.getSelectors(null, false);

    assert(selectors.indexOf("BUTTON[name='btn'] > SPAN") > -1, "Did not grab the child span!");
  });

  it('Return the parent link or button.', function() {
    var element = document.querySelector('body > button[name="btn"] > span');

    var selectors = element.getSelectors(null, true);

    assert(selectors.indexOf("BUTTON[name='btn']") > -1, "Did not grab parent button!");
  });
});
