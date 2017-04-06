# css-selector-tools

Generating unique css selectors is hard. Css-selector-tools makes it easy.

We found other modules were perfectly reliable when generating selectors for content on a website we controlled, but found them lacking when trying to generate reliable css selectors on others' websites. Id and class attributes are the defacto way of generating a selector to an element, but they are also the most commonly adjusted attributes by developers, making them extremely fragile as css selectors. There are just too many dynamic elements in building an html page today for a single selector to work very reliably.

Css-selector-tools works around this difficulty by returning an array of selectors for an element, each with a different strategy for addressing the element, in order of their strength.

If a particular selector result is not unique, and not the element passed, then it is thrown out.

## Getting Started

Checkout this simple [JSFiddle example](https://jsfiddle.net/89fcwe67/4/)

```shell
bower install --save css-selector-tools
```

```shell
npm install --save css-selector-tools
```

Add the script to your page.

```html
<script src="bower_components/css-selector-tools/index.min.js"></script>
```

Create a test element.

```javascript
// create test element
var element = document.createElement('DIV');
document.body.appendChild(element);
```

Now get a set of selectors for the element. Css-selector-tools extends the [HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement) object with the getSelectors method.

### Get array of selectors

```javascript
var selectors = element.getSelectors();
```

### Get single selector

```javascript
var selector = element.getSelector();
```

## Documentation

### getSelectors  &  getSelector

```javascript
HTMLElement.getSelectors(
  customAttributes,
  preferLink
);
```

```javascript
HTMLElement.getSelector(
  customAttributes,
  preferLink
);
```

| Param | Type | Description |
|-------|------|-------------|
| customAttributes | Array | Pass an array of custom html attributes which will replace the options specified below.|
| preferLink | Boolean | This is a convenience option for cases where the element is nested inside an anchor or button element. It's not uncommon for anchor tags to have further nested structures, and if preferLink is set to `true` then css-selector-tools will return a selector for any parent link or button found. This is useful when dynamically generating selectors from user click events.|

Default css-selector html attributes:

```javascript
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
```

### catchSingleEvent

This is a helper method for adding event listeners to elements, which solves a problem with two click events being sent from the browser for the same user click. For example, when clicking on a label that is on top of an input that is dynamically moved with js. These helper listeners will only return the final event that came in from the same user event.

```javascript
HTMLElement.catchSingleEvent(
  type,
  callback
);
```

| Param | Type | Description |
|-------|------|-------------|
| type | String | The kind of event to listen for. [HTML Events](https://developer.mozilla.org/en-US/docs/Web/Events) |
| callback | Function | The callback function to call when an event is caught. Passed to the callback is the event object. |

Here is an example implementation which will catch any click events that are on, or bubble up to, the body:

```javascript
document.body.catchSingleEvent('click', function(e) {

  if (!e.isTrusted) return;

  console.log(e.target.getSelectors());
});
```

## AMD

Css-selector is in UMD format, so AMD modules are supported.

```javascript
define('myModule', ['css-selector-tools'], function (cssS) {

    var element = document.createElement('DIV');
    document.body.appendChild(element);

    var selectors = css.getSelectors(element);

    return selectors;
});
```

## Common JS

If you are using Common JS module format and bundling for the browser (like with browserify) then you can require the module.

```javascript
var css = require('css-selector-tools');
var selectors = css.getSelectors(element);

// or

require('css-selector-tools');
var selectors = element.getSelectors();
```
