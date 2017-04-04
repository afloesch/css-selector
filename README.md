# css-selector

Generating unique css selectors is hard. Css-selector makes it easy.

We found other modules were perfectly reliable when generating selectors for content on a website we controlled, but found them lacking when trying to generate reliable css selectors on others' websites. Id and class attributes are the defacto way of generating a selector to an element, but they are also the most commonly adjusted attributes by developers, making them extremely fragile as css selectors. There are just too many dynamic elements in building an html page today for a single selector to work very reliably.

Css-selector works around this difficulty by returning an array of selectors for an element, with up to three different results, that are all guaranteed to be unique for the given html element. If a particular selector result is not unique then it is thrown out.

Making it trivial to pass the entire array of selectors to `document.querySelector` for the correct element on the page.

## Getting Started

```shell
bower install --save css-selector
```

Add the script to your page.

```html
<script src="bower_components/css-selector/index.min.js"></script>
```

Now get a set of selectors for an element. Css-selector extends the HTMLElement object with the getSelectors method.

```javascript
// create test element
var element = document.createElement('DIV');
document.body.appendChild(element);

// get the selectors
var selectors = element.getSelectors();
```

To retrieve that same element just pass the entire array of selectors.

```javascript
var sameElement = document.querySelector(selectors);
```

## AMD



## Common JS

If you are using Common JS module format and bundling for the browser (like with browserify) then you can require the module.

```javascript
var cssSelector = require('css-selector');

// get the selectors
var selectors = element.getSelectors();
// or
var selectors = cssSelector(element);
```
