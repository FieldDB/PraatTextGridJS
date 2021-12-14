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
//Dummy test, does nothing. 
describe("lib/textgrid", function() {


  it("Should load SampleInput.json", function() {
    var sampleUtterancesTextGrid = fs.readFileSync(__dirname + "/SampleInput.json", {
      encoding: "UTF-8"
    });
   expect(sampleUtterancesTextGrid).toBeDefined() 
  }); // Symon: This tests json generation by ensuring that the items in the json object = the number of items in the textgrid file. 
  
  it("Should produce a textgrid", function() {
    var AudioIntervalsjson = fs.readFileSync(__dirname + "/SampleInput.json", {
      encoding: "UTF-8"
    });
     var AudioIntervalstextgrid = fs.readFileSync(__dirname + "/SampleOutput.TextGrid", {
      encoding: "UTF-8"
    });
//    expect(AudioIntervalsjson).toEqual(AudioIntervalstextgrid) 
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
