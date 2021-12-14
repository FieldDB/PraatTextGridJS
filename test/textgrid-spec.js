'use strict';

var textgrid = require("../lib/textgrid.js").TextGrid;
var fs = require("fs");
/*
  ======== A Handy Little Jasmine Reference ========
https://github.com/pivotal/jasmine/wiki/Matchers

  Spec matchers:
    expect(x).toEqual(y); compares objects or primitives x and y and passes if they are equivalent
    expect(x).toBe(y); compares objects or primitives x and y and passes if they are the same object
    expect(x).toMatch(pattern); compares x to string or regular expression pattern and passes if they match
    expect(x).toBeDefined(); passes if x is not undefined
    expect(x).toBeUndefined(); passes if x is undefined
    expect(x).toBeNull(); passes if x is null
    expect(x).toBeTruthy(); passes if x evaluates to true
    expect(x).toBeFalsy(); passes if x evaluates to false
    expect(x).toContain(y); passes if array or string x contains y
    expect(x).toBeLessThan(y); passes if x is less than y
    expect(x).toBeGreaterThan(y); passes if x is greater than y
    expect(function(){fn();}).toThrow(e); passes if function fn throws exception e when executed

    Every matcher"s criteria can be inverted by prepending .not:
    expect(x).not.toEqual(y); compares objects or primitives x and y and passes if they are not equivalent

    Custom matchers help to document the intent of your specs, and can help to remove code duplication in your specs.
    beforeEach(function() {
      this.addMatchers({

        toBeLessThan: function(expected) {
          var actual = this.actual;
          var notText = this.isNot ? " not" : ";

          this.message = function () {
            return "Expected " + actual + notText + " to be less than " + expected;
          }

          return actual < expected;
        }

      });
    });

*/
// these are all unit tests
// I'm unsure what a number of them do beyond the description given in the it function, since I don't know what each individual function within the tests do. I will avoid comments on these until I learn more.
describe("lib/textgrid", function() {

  it("should init", function() {
    expect(textgrid.init).toBeDefined();
  });

  it("should read sample data", function() {
    var sampleUtterancesTextGrid = fs.readFileSync(__dirname + "/../data/sampleUtterances.TextGrid", {
      encoding: "UTF-8"
    });
    expect(sampleUtterancesTextGrid).toBeDefined();
  });

  it("should convert sampleUtterancesTextGrid textgrid into json", function() {
    var sampleUtterancesTextGrid = fs.readFileSync(__dirname + "/../data/sampleUtterances.TextGrid", {
      encoding: "UTF-8"
    });
    var json = textgrid.textgridToJSON(sampleUtterancesTextGrid);
    // console.log(JSON.stringify(json, null, 2));
    expect(typeof json).toBe("object");
    for (var itemIndex = 0; itemIndex < json.items.length; itemIndex++) {
      console.log("Sanity check for tier " + itemIndex);
      if (json.items[itemIndex].points) {
        expect(json.items[itemIndex].points.length).toEqual(json.items[itemIndex].points_size);
      }
      if (json.items[itemIndex].intervals) {
        expect(json.items[itemIndex].intervals.length).toEqual(json.items[itemIndex].intervals_size);
      }
    }
  }); // Symon: This tests json generation by ensuring that the items in the json object = the number of items in the textgrid file. 
  
  it("should discover IGT relationships between aligned tiers", function() {
    var sampleUtterancesTextGrid = fs.readFileSync(__dirname + "/../data/sample_elan.TextGrid", {
      encoding: "UTF-8"
    });
    var json = textgrid.textgridToIGT(sampleUtterancesTextGrid);
    expect(typeof json).toBe("object");
    // console.log(JSON.stringify(json.intervalsByXmin, null, 2));
    expect(typeof json.intervalsByXmin).toBe("object");
    expect(typeof json.intervalsByText).toBe("object");
    expect(json.isIGTNestedOrAlignedOrBySpeaker.probablyAligned).toBeTruthy();
//Symon: it seems that the first argument of the any "it" function gives a description of each test. 
  });

  it("should discover speakers in Elan exported tiers", function() {
    var sampleUtterancesTextGrid = fs.readFileSync(__dirname + "/../data/sample_elan.TextGrid", {
      encoding: "UTF-8"
    });
    var json = textgrid.textgridToIGT(sampleUtterancesTextGrid);
    // console.log(JSON.stringify(json, null, 2));
    expect(json.isIGTNestedOrAlignedOrBySpeaker.probablyBySpeaker).toBeTruthy();
  });

  it("should discover be possible to get start and end times for segments in", function() {
    var sampleUtterancesTextGrid = fs.readFileSync(__dirname + "/../data/sampleNested.TextGrid", {
      encoding: "UTF-8"
    });
    var json = textgrid.textgridToIGT(sampleUtterancesTextGrid);
    // console.log(JSON.stringify(json, null, 2));
    expect(typeof json).toBe("object");
    console.log(JSON.stringify(json.isIGTNestedOrAlignedOrBySpeaker, null, 2));

  });

  it("should discover not IGT relationships between speaker tiers", function() {
    var sampleMultipleSpeakersTiers = fs.readFileSync(__dirname + "/../data/sampleMultipleSpeakers.TextGrid", {
      encoding: "UTF-8"
    });
    var json = textgrid.textgridToIGT(sampleMultipleSpeakersTiers, "speakersaretiernames");
    // console.log(JSON.stringify(json, null, 2));
    expect(typeof json).toBe("object");
    console.log(json.items.length);
    console.log(JSON.stringify(json.isIGTNestedOrAlignedOrBySpeaker, null, 2));
    expect(json.isIGTNestedOrAlignedOrBySpeaker.probablyAligned).toBeFalsy();
    expect(json.isIGTNestedOrAlignedOrBySpeaker.probablyBySpeaker).toBeTruthy();

  });


  it("should accept multiple TextGrids from different files with optionally inserted file names", function() {
    var sampleMultipleTextGrids = "\n\nFile name = sampleMultipleSpeakers\n" + fs.readFileSync(__dirname + "/../data/sampleMultipleSpeakers.TextGrid", {
      encoding: "UTF-8"
    });
    sampleMultipleTextGrids = sampleMultipleTextGrids + "\n\n" + fs.readFileSync(__dirname + "/../data/sample_elan.TextGrid", {
      encoding: "UTF-8"
    });
    sampleMultipleTextGrids = sampleMultipleTextGrids + "\n\nFile name = sampleNested\n" + fs.readFileSync(__dirname + "/../data/sampleNested.TextGrid", {
      encoding: "UTF-8"
    });
    var json = textgrid.textgridToIGT(sampleMultipleTextGrids);
    // console.log(JSON.stringify(json, null, 2));
    expect(typeof json).toBe("object");
    console.log(json.items.length);
    expect(json.items.length).toEqual(16);
    expect(json.items[0].fileName).toEqual("sampleMultipleSpeakers");
    expect(json.items[2].fileName).toEqual("Unknown");
    // console.log(JSON.stringify(json.items[json.items.length-1].fileName, null, 2));
    expect(json.items[json.items.length - 1].fileName).toEqual("sampleNested");
    expect(json.fileNames).toEqual([ 'sampleMultipleSpeakers', 'sampleNested' ]);
  });

  it("should put the filename as the text of an interval if there is only 1 or two intervals and the interval text is utterance", function() {
    var sampleEmptyTextGrid = "\n\nFile name = sampleEmpty\n" + fs.readFileSync(__dirname + "/../data/sampleEmpty.TextGrid", {
      encoding: "UTF-8"
    });
    var json = textgrid.textgridToIGT(sampleEmptyTextGrid);
    // console.log(JSON.stringify(json, null, 2));
    expect(typeof json).toBe("object");
    // console.log(json.items.length);
    expect(json.items.length).toEqual(1);
    expect(json.items[0].intervals[0].text).toEqual("sampleEmpty");
  });

  xit("should create one interval if there were no intervals in the TextGrid", function() {
    var sampleEmptyTextGrid = fs.readFileSync(__dirname + "/../data/sampleEmpty.TextGrid", {
      encoding: "UTF-8"
    });
    var json = textgrid.textgridToIGT(sampleEmptyTextGrid);
    // console.log(JSON.stringify(json, null, 2));
    expect(typeof json).toBe("object");
    console.log(json.items.length);
    expect(json.items.length).toEqual(1);
  });
});
