//nodejs file system package
var fs = require('fs');
'use strict';


function TextGridCreator() {


//	var file = __dirname + '/data/sample.json';

	this.init = function() {
		return "init";
	};


	this.contains = function (a, key) {
		for (var i = 0; i < a.length; i++) {
			if (a[i].key === key) {
				return i;
			}
		}
		return 0;
	};

	/* output a Pratt TextGrid 
	*/
	this.printInterval = function(wstream, obj) {

		wstream.write("File type = " + obj[0].key + "\n");
		wstream.write("Object class = \"TextGrid\"\n");
		wstream.write("xmin = %d\n", obj[0].value.audioVideo.startTime);
		wstream.write("xmax = %d\n", obj[0].value.audioVideo.endTime);
		wstream.write("tiers? <exists>\n");
		wstream.write("size = 1\n");
		wstream.write("item[]:\n");
		
		wstream.write("\titem[1]:\n");
		
		wstream.write("\t\tclass =\"TextTier\"\n");
		wstream.write("\t\tname = \"" + obj[0].value.utterance + "\"\n");
		wstream.write("\t\txmin = " + obj[0].value.audioVideo.startTime + "\n");
		wstream.write("\t\txmax = " + obj[0].value.audioVideo.endTime + "\n");
		wstream.write("\t\t\points: size = " + obj.length + "\n");
		
		// loop through the set of utterances
		for (i = 0; i < obj.length; i++) {
			this.printPoint(wstream, i+1, obj[i].value.audioVideo);
		}
		
		wstream.write("\n\n");
	};

	this.printPoint = function(wstream, index, obj) {

			wstream.write("\t\t\tpoints [" + index + "]: \n");
			wstream.write("\t\t\t\tnumber = " + obj.endTime + "\n");
			wstream.write("\t\t\t\tmark = " + index + "\n");
	};

	this.processFile = function(fileName) {
		
		var mthis = this;
		
		var wstream = fs.createWriteStream(fileName + ".tg");
		
		fs.readFile(fileName, 'utf8', function (err, data) {
			if (err) {
				console.log('Error opening file : ' + fileName + ' with error ' + err);
				return;
			}
			 
			  // i'm expecting a bunch of intervals encoded as json
			myobjects = JSON.parse(data);
			  
			var uniques = new Array();
			var u = 0;
			var objects = myobjects.rows;
			//loop through list of file objects and create an array of unique objects as defined by the filename
			for (i = 0; i < objects.length; i++) {
				var element = objects[i];
				var key = element.key;
				var idx = mthis.contains(uniques, key);
				if (idx == 0) {
					var list = new Array();
					list.push(element);
					uniques.push({ 'key' : key, 'value': list });
					console.dir(key);
					u++;
				}
				else {
					var list = uniques[idx].value;
					list.push(element);
				}
			}
			  
			//console.dir("uniques = " + u);
			//loop through the set of unique files and print a textgrid interval			  
			for (var i = 0; i < uniques.length; i++) {
					mthis.printInterval(wstream, uniques[i].value);
			//		console.dir(uniques[i].key);
			}
		})
	};
}


var tgc = new TextGridCreator();
tgc.processFile(__dirname + "/data/sample.json"); 