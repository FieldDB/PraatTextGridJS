[![Build Status](https://travis-ci.org/OpenSourceFieldlinguistics/PraatTextGridJS.png)](https://travis-ci.org/OpenSourceFieldlinguistics/PraatTextGridJS)
# textgrid

A small library which can parse TextGrid into json and json into TextGrid

## Getting Started
### On the server
Install the module with: `npm install textgrid --save`

```javascript
var textgrid = require('textgrid');
textgrid.init(); // "init"
```

### In the browser

Install the module with: `bower install textgrid --save` or,
 
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/OpenSourceFieldlinguistics/PraatTextGridJS/master/dist/textgrid.min.js
[max]: https://raw.github.com/OpenSourceFieldlinguistics/PraatTextGridJS/master/dist/textgrid.js

In your web app:

```html
<script src="bower_components/textgrid/dist/textgrid.min.js"></script>
<script>
  var textgridAsJson = TextGrid.textgridToIGT(originalTextGridAsText);
</script>
```

In your code, you can attach textgrid's methods to any object.

```html
<script>
var exports = Bocoup.utils;
</script>
<script src="bower_components/textgrid/dist/textgrid.min.js"></script>
<script>
var textgridAsJson = Bocoup.utils.textgridToIGT(originalTextGridAsText); // "init"
</script>
```

An example of what you can do with the result.

```js
var textgrid = TextGrid.textgridToIGT(text);
if (textgrid.isIGTNestedOrAlignedOrBySpeaker.probablyAligned) {
	for (itemIndex in textgrid.intervalsByXmin) {
		if (!textgrid.intervalsByXmin.hasOwnProperty(itemIndex)) {
			continue;
		}
		if (textgrid.intervalsByXmin[itemIndex]) {
			row = {};
			for (intervalIndex = 0; intervalIndex < textgrid.intervalsByXmin[itemIndex].length; intervalIndex++) {
				interval = textgrid.intervalsByXmin[itemIndex][intervalIndex];
				row.startTime = row.startTime ? row.startTime : interval.xmin;
				row.endTime = row.endTime ? row.endTime : interval.xmax;
				row.utterance = row.utterance ? row.utterance : interval.text.trim();
				row.modality = "spoken";
				row.tier = interval.tierName;
				row.speakers = interval.speaker;
				row.audioFileName = interval.fileName || audioFileName;
				row.CheckedWithConsultant = interval.speaker;
				consultants.push(row.speakers);
				row[interval.tierName] = interval.text;
				header.push(interval.tierName);
			}
			matrix.push(row);
		}
	}
} else {
	for (itemIndex in textgrid.intervalsByXmin) {
		if (!textgrid.intervalsByXmin.hasOwnProperty(itemIndex)) {
			continue;
		}
		if (textgrid.intervalsByXmin[itemIndex]) {
			for (intervalIndex = 0; intervalIndex < textgrid.intervalsByXmin[itemIndex].length; intervalIndex++) {
				row = {};
				interval = textgrid.intervalsByXmin[itemIndex][intervalIndex];
				row.startTime = row.startTime ? row.startTime : interval.xmin;
				row.endTime = row.endTime ? row.endTime : interval.xmax;
				row.utterance = row.utterance ? row.utterance : interval.text.trim();
				row.modality = "spoken";
				row.tier = interval.tierName;
				row.speakers = interval.speaker;
				row.audioFileName = interval.fileName || audioFileName;
				row.CheckedWithConsultant = interval.speaker;
				consultants.push(row.speakers);
				row[interval.tierName] = interval.text;
				header.push(interval.tierName);
				matrix.push(row);
			}
		}
	}
}

```

## Documentation
http://opensourcefieldlinguistics.github.io/FieldDB/

## Examples
See tests directory for more ways to use the library

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

_The "dist" subdirectory files are generated via Grunt. You'll find source code in the "lib" subdirectory!_

## Release History
* v1.102.3 April 22 2014 Long audio import support 
* v2.2.0 April 22 2014 Support for multiple small files each corresponding to an utterance 


## License
Copyright (c) 2014 OpenSourceFieldLinguistics Contribs  
Licensed under the Apache 2.0 license.
