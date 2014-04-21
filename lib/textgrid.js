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

	TextGrid.textgridToJSON = function(textgrid, assumeTiersAreSpeakers) {
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
			fileName = "Unknown",
			key,
			value,
			text;

		// console.log("File length " + lines.length);
		while (lines.length > 0) {
			line = lines.shift();
			/* keys at the file level */
			if (!line) {
				line = lines.shift();
				if (!line) {
					if (currentItem) {
						currentItem.fileName = fileName;
						json.items.push(currentItem);
					}
					currentItem = null;
					fileName = "Unknown"; /* reset filename if there is are two empty lines */
					console.log("Reset filename if there is are two empty lines");
				}
			} else if (line.search(/ /) !== 0) {
				pieces = line.split(" = ");
				if (pieces.length === 2) {
					key = pieces[0].trim().replace(/ /g, "_");
					value = pieces[1].trim().replace(/"/g, "");
					json[key] = value;
					if (key === "File_name") {
						fileName = value + "";
						console.log(" Found a file name " + fileName);
					}
				}
			} else {
				/* either point or interval introducers, or keys for items */
				if (line.search(/\[[\0-9]+\]/) !== -1) {
					pieces = line.split("[");
					type = pieces[0].trim();
					if (type === "item") {
						console.log("  Found an item for " + fileName);
						if (currentItem) {
							currentItem.fileName = fileName;
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
		if (currentItem) {
			currentItem.fileName = fileName;
			json.items.push(currentItem);
		}
		return json;
	};

	TextGrid.textgridToIGT = function(textgrid, assumeTiersAreSpeakers) {
		return this.jsonToIGT(this.textgridToJSON(textgrid, assumeTiersAreSpeakers), assumeTiersAreSpeakers);
	};

	TextGrid.jsonToIGT = function(json, assumeTiersAreSpeakers) {
		var tiersByLength = {};
		json.intervalsByXmin = {};
		json.intervalsByText = {};
		var itemIndex;
		var intervalIndex;
		var xmin,
			xmax,
			key,
			interval,
			fileName,
			text,
			length,
			probablyFromElanWithSpeakerEncodedInTierName = false,
			probablyFromElanWithSpeakerEncodedInTierNameCount = 0;

		var maximizeFindingTextInAudio = /[ #?!'".,\/\(\)\*\#0-9-]/g;
		var tierNames = json.items.map(function(tier) {
			if (tier.name.indexOf("@") > -1 /* probably elan tiers */ ) {
				tier.speaker = tier.name.substring(tier.name.indexOf("@") + 1).trim();
				tier.name = tier.name.substring(0, tier.name.indexOf("@")).trim();
				probablyFromElanWithSpeakerEncodedInTierNameCount++;
			}
			if (assumeTiersAreSpeakers) {
				tier.speaker = tier.name;
			}
			if (tier.name === "silences") {
				tier.name = "utterances";
			}
			return tier.name;
		});
		// console.log(tierNames);
		if (tierNames.length - probablyFromElanWithSpeakerEncodedInTierNameCount == 0) {
			probablyFromElanWithSpeakerEncodedInTierName = true;
		}
		if (!json || !json.items) {
			return json;
		}
		for (itemIndex = 0; itemIndex < json.items.length; itemIndex++) {
			tiersByLength[json.items[itemIndex].name] = json.items[itemIndex].intervals_size || json.items[itemIndex].points_size;
			if (json.items[itemIndex].intervals) {
				for (intervalIndex = 0; intervalIndex < json.items[itemIndex].intervals.length; intervalIndex++) {
					xmin = this.marginForConsideringIntervalsMatching(json.items[itemIndex].intervals[intervalIndex].xmin);
					xmax = this.marginForConsideringIntervalsMatching(json.items[itemIndex].intervals[intervalIndex].xmax);
					interval = json.items[itemIndex].intervals[intervalIndex];
					interval.fileName = json.items[itemIndex].fileName;
					interval.tierName = json.items[itemIndex].name;
					interval.speaker = json.items[itemIndex].speaker;
					key = xmin + ":" + xmax;
					json.intervalsByXmin[key] = json.intervalsByXmin[key] || [];
					json.intervalsByXmin[key].push(interval);

					text = interval.text ? interval.text.trim().toLocaleLowerCase().replace(maximizeFindingTextInAudio, "") : "";
					if (text) {
						json.intervalsByText[text] = json.intervalsByText[text] || [];
						length = json.intervalsByText[text].length;
						json.intervalsByText[text][length] = interval;
					}

					//json.intervalsByXmin[key].push({
					//text: interval.text,
					//tierName: tierName
					//});

					//json.intervalsByXmin[xmin + ":" + xmax].push({
					//tierName: interval.text 
					//});
				}
			}
		}
		// this.printIGT(json.intervalsByXmin);
		json.probablyFromElanWithSpeakerEncodedInTierName = probablyFromElanWithSpeakerEncodedInTierName;
		json.isIGTNestedOrAlignedOrBySpeaker = this.isIGTNestedOrAlignedOrBySpeaker(json);
		return json;
	};

	TextGrid.isIGTNestedOrAlignedOrBySpeaker = function(json) {
		var intervals = json.intervalsByXmin;
		var histogram = {},
			bin,
			intervalKey,
			totalPotentialIGTIntervals = 0,
			probablyBySpeaker = false,
			probablyAligned = false;

		for (var tier in json.items) {
			if (json.items.hasOwnProperty(tier) && json.items[tier].speaker) {
				probablyBySpeaker = true;
			}
		}

		for (intervalKey in intervals) {
			histogram[intervals[intervalKey].length] = histogram[intervals[intervalKey].length] ? histogram[intervals[intervalKey].length] + 1 : 1;
			totalPotentialIGTIntervals++;
		}
		/* Normalize the histogram */
		for (bin in histogram) {
			histogram[bin] = histogram[bin] / totalPotentialIGTIntervals;
			if (bin > 1 && histogram[bin] > 0.10) {
				probablyAligned = true;
			}
			// console.log(histogram[bin]);
		}
		// console.log(histogram);
		// console.log("probably aligned " + probablyAligned);

		return {
			histogram: histogram,
			probablyAligned: probablyAligned,
			probablyBySpeaker: probablyBySpeaker
		};
	};

	TextGrid.marginForConsideringIntervalsMatching = function(value, optionalMillisecond) {
		if (optionalMillisecond) {
			optionalMillisecond = 100 / optionalMillisecond;
		} else {
			optionalMillisecond = 100 / 20;
		}
		return (Math.round(value * optionalMillisecond) / optionalMillisecond).toFixed(2);
	};

	TextGrid.printIGT = function(igtIntervalsJSON) {
		for (var interval in igtIntervalsJSON) {
			console.log(interval);
			if (igtIntervalsJSON.hasOwnProperty(interval)) {
				console.log(igtIntervalsJSON[interval].map(function(interval) {
					return interval.xmin + "," + interval.xmax + "," + interval.text;
				}));
			}
		}
	};

	exports.TextGrid = TextGrid;

}(typeof exports === "object" && exports || this));
