/*
 * textgrid
 * https://github.com/OpenSourceFieldlinguistics/PraatTextGridJS
 *
 * Copyright (c) 2014 OpenSourceFieldLinguistics Contribs
 * Licensed under the Apache 2.0 license.
 */

(function(exports) {

	'use strict';

	var TextGrid = {

	};

	TextGrid.init = function() {
		return "init";
	};


	var createAnObject = function(lines) {
		var json = {},
			pieces,
			key,
			value;

		for (var lineIndex = 0; lineIndex < lines.length; lineIndex++) {
			pieces = lines[lineIndex].split(" = ");
			key = pieces[0].trim().replace(/ /g, "_");
			value = pieces[1].trim().replace(/"/g, "");
			json[key] = value;
		}
		return json;
	};

	TextGrid.textgrid2JSON = function(textgrid) {
		var lines = textgrid.split("\n"),
			json = {
				items: []
			},
			line,
			lineIndex,
			pieces,
			items = [],
			currentItem = null,
			type,
			key,
			value;

		while (lines.length > 0) {
			line = lines.shift();
			/* keys at the file level */
			if (line.search(/ /) != 0) {
				pieces = line.split(" = ");
				if (pieces.length === 2) {
					key = pieces[0].trim().replace(/ /g, "_");
					value = pieces[1].trim().replace(/"/g, "");
					json[key] = value;
				}
			} else {
				/* either point or interval introducers, or keys for items */
				if (line.search(/\[[\0-9]+\]/) != -1) {
					pieces = line.split("[");
					type = pieces[0].trim();
					if (type === "item") {
						if (currentItem) {
							json.items.push(currentItem);
						}
						currentItem = {};
					} else if (type === "points") {
						var p = createAnObject([lines.shift(), lines.shift()]);
						currentItem[type] = currentItem[type] || [];
						currentItem[type].push(p);
					} else if (type === "intervals") {
						var interval = createAnObject([lines.shift(), lines.shift(), lines.shift()]);
						currentItem[type] = currentItem[type] || [];
						currentItem[type].push(interval);
					}
				} else {
					pieces = line.split(" = ");
					if (pieces.length === 2) {
						key = pieces[0].trim().replace(/ /g, "_");
						value = pieces[1].trim().replace(/"/g, "");
						if (key.indexOf(":_size") > -1) {
							key = key.replace(":_", "_");
							value = parseInt(value, 10);
						}
						currentItem[key] = value;
					}
				}
			}
		}
		json.items.push(currentItem);
		return json;
	};

	exports.TextGrid = TextGrid;

}(typeof exports === "object" && exports || this));
