# textgrid

A small library which can parse TextGrid into json and json into TextGrid

## Getting Started
### On the server
Install the module with: `npm install textgrid`

```javascript
var textgrid = require('textgrid');
textgrid.init(); // "init"
```

### In the browser
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/OpenSourceFieldlinguistics/PraatTextGridJS/master/dist/textgrid.min.js
[max]: https://raw.github.com/OpenSourceFieldlinguistics/PraatTextGridJS/master/dist/textgrid.js

In your web page:

```html
<script src="dist/textgrid.min.js"></script>
<script>
init(); // "init"
</script>
```

In your code, you can attach textgrid's methods to any object.

```html
<script>
var exports = Bocoup.utils;
</script>
<script src="dist/textgrid.min.js"></script>
<script>
Bocoup.utils.init(); // "init"
</script>
```

## Documentation
_(Coming soon)_

## Examples
_(Coming soon)_

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

_Also, please don't edit files in the "dist" subdirectory as they are generated via Grunt. You'll find source code in the "lib" subdirectory!_

## Release History
_(Nothing yet)_

## License
Copyright (c) 2014 OpenSourceFieldLinguistics Contribs  
Licensed under the Apache 2.0 license.
