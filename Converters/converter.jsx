﻿/******************************************************************************
	Copyright 2019, AssisTech, Indian Institute of Technology, Delhi 
	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with this program.  If not, see <https://www.gnu.org/licenses/>. 
*******************************************************************************/
setupEssentials(); 
function main() {
	// for each applicable source font name/style to target name/style mapping
	for (var i = 0; i < iitd.fonts.length; i++) {
		// convert the byte sequence to unicode sequence
		convertToUnicode.apply(null, iitd.fonts[i]);
	}
	// reorder the characters to their logically correct positions
	reorderChars();
}

// utility functions for lookup and filtering not available in ID javascript
function setupEssentials() {
	if (typeof Array.prototype.indexOf != "function") {
		Array.prototype.indexOf = function (el) {
			for(var i = 0; i < this.length; i++) if(el === this[i]) return i;
			return -1;
		}
	}
	if (typeof Array.prototype.filter != "function") {
		Array.prototype.filter = function (func) {
			var a = [];
			for(var i = 0; i < this.length; i++) {
				if (func(this[i])) {
					a.push(this[i]);
				}
			}		
			return a;
		}
	}
}

// convert from a source font name/style to target font name/style using the glyphToCharMap which is a 2-D array
function convertToUnicode(srcFont, srcStyle, glyphToCharMap, tgtFont, tgtStyle, scalingFactor) {
	// TODO: log remaining unconverted text in known fonts
	function change(ptSize) {
		try {
			app.findGrepPreferences.appliedFont = srcFont;      
			app.findGrepPreferences.fontStyle = srcStyle;
			app.findGrepPreferences.findWhat = glyphToCharMap[j][0];
			//app.findGrepPreferences.pointSize = ptSize;
			app.changeGrepPreferences.appliedFont = tgtFont;
			app.changeGrepPreferences.fontStyle = tgtStyle;
			app.changeGrepPreferences.changeTo = glyphToCharMap[j][1];
			app.changeGrepPreferences.appliedLanguage = 'Hindi (India)'; // TODO externalize this
			//app.changeGrepPreferences.pointSize = Math.round(ptSize*scalingFactor);
			app.changeGrepPreferences.composer = "Adobe World-Ready Paragraph Composer";
			app.activeDocument.changeGrep();
		} catch(e) {
			alert(srcFont + ", " + tgtFont + j + ": " + e.message);
		}
	};
	app.findChangeGrepOptions.includeFootnotes = true;    
	app.findChangeGrepOptions.includeHiddenLayers = true;    
	app.findChangeGrepOptions.includeLockedLayersForFind = true;    
	app.findChangeGrepOptions.includeLockedStoriesForFind = true;    
	app.findChangeGrepOptions.includeMasterPages = true;
	app.findGrepPreferences = app.changeGrepPreferences = NothingEnum.NOTHING;
	for (var j = 0; j < glyphToCharMap.length; j++) {
		change(0);
	}
	// clear settings so the last lookup doesn't interfere with fut'ure searches
	app.findTextPreferences = NothingEnum.NOTHING;
	app.changeTextPreferences = NothingEnum.NOTHING;  
} // end of convertToUnicode function

function reorderChars() {
	var changeTo = [
		// indesign find/change text treats ' and ` as 
		// TODO - externalize these
		"्ा" ,   "" ,
		"्ρा" ,   "ρ" ,
		"़्ा" ,   "़" ,
		"़्ो" ,   "़े" ,
		"्ौ" ,    "़ै" ,
		"ाै" , "ौ" ,
		"ाे" , "ो" ,
		"ाॆ", "ॆ",
		"ाॅ" , "ॉ" ,
		"अा", "आ",
		"अौ" , "औ" ,
		"अो" , "ओ" ,
		"आॅ" , "ऑ",
		"आॆ", "ऒ",
		
		// nothing irrelevant separates parts of क, फ
		'व([Ρρ़्ाुूेैोौॊॉीृंँ]*)η', 'क$1',
		'व़([Ρρ्ाुूेैोौॊॉीृंँ]*)η', 'क़$1',
		'प([Ρρ्ाुूेैोौॊॉींँ]*)η', 'फ$1',
		'प़([Ρρ्ाुूेैोौॊॉींँ]*)η', 'फ़$1',
		'उ([Ρρ़ाुूेैोौॊॉींँ]*)η', 'ऊ$1',
		'र([़ंँ]*)η', 'रु$1',
    
		// vowel signs and vowel modifiers go to end
		'([कखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह]़?)([ाुूेैोौॊॉीृंँ]*)Ρ' , '$1्र$2' ,

		// vowel modifiers after vowel signs
		'([ंँ])([्ाुूेैोौॊॉीृ]+)' , '$2$1' ,

		// nukta before vowel signs
		'([्ाुूेैोौॊॉीृ]+)़' , '़$1' ,
		
		// remove duplicate vowel modifiers
		'ंं*' , 'ं' ,
    
		'ε(([कखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह]़?्)*[कखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह]़?)ρμ' , 'र्$1िं',
		'ερμ(([कखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह]़?्)*[कखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह]़?)' , 'र्$1िं',
		'ερ(([कखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह]़?्)*[कखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह]़?)' , 'र्$1ि',
		'ε(([कखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह]़?्)*[कखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह]़?)ρ' , 'र्$1ि',
		'εμ(([कखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह]़?्)*[कखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह]़?)' , '$1िं',
		'ε(([कखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह]़?्)*[कखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह]़?)' , '$1ि',
		'(([कखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह]़?्)*[कखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह]़?[ाुूेैोौॊॉीृ]?)ρ[μं]' , 'र्$1ं',
		'(([कखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह]़?्)*[कखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह]़?[ाुूेैोौॊॉीृ]?)[μं]ρ' , 'र्$1ं',
		'(([कखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह]़?्)*[कखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह]़?[ाुूेैोौॊॉीृ]?)ρ' , 'र्$1' ,
		'इρ[μं]' , 'ईं',
		'इρ', 'ई',
		
		// replace by nukta containing counterparts as the font handles them better
		'ऩ',	'\\x{0929}',
		'ऱ',	'\\x{0931}',
		'ऴ',	'\\x{0934}',
		'क़',	'\\x{0958}',
		'ख़',	'\\x{0959}',
		'ग़',	'\\x{095A}',
		'ज़',	'\\x{095B}',
		'ड़',	'\\x{095C}',
		'ढ़',	'\\x{095D}',
		'फ़',	'\\x{095E}',
		'य़',	'\\x{095F}',
	];
	app.findGrepPreferences = app.changeGrepPreferences = NothingEnum.NOTHING;
	app.findChangeGrepOptions.includeMasterPages = true;
	app.findChangeGrepOptions.includeFootnotes = true;    
	app.findChangeGrepOptions.includeHiddenLayers = true;    
	app.findChangeGrepOptions.includeLockedLayersForFind = true;    
	app.findChangeGrepOptions.includeLockedStoriesForFind = true;    

	for (var i = 0; i < changeTo.length; i += 2) {    
		app.findGrepPreferences.findWhat = changeTo[i];
		app.changeGrepPreferences.changeTo = changeTo[i+1];
		app.activeDocument.changeGrep();
	}
}

// read a file containing tab separated values and return it as a 2-d array
function read_tsv(filepath) {
	var ifile = new File(filepath);    
	ifile.encoding = 'UTF-8';
	var a = [];
	if(!ifile.exists) {
		alert("Could not open " + filepath + " for reading");
	}
	ifile.open("r");
	while (!ifile.eof) {
		var words = ifile.readln().split("\t");
		a.push(words.filter(function(e) {return e != ''})); 
	}
	ifile.close();
	return a;
}
// TODO: convert each word to greek letter and back to remove tracked chars	
// TODO: find Nukta char words and replace by themselves using intermediate chars

var iitd = {};
// read all the font mappings
iitd.fonts = read_tsv(app.activeScript.path + "/fonts.tsv");

// but skip those that are not present in the document
iitd.fonts = iitd.fonts.filter(function(e) {
	var docFonts = app.activeDocument.fonts;
	for (var i = 0; i < docFonts.count(); i++) {
		if (docFonts[i].fontFamily == e[0]) {
			return true;
		}
	}
	return false;
});

// the above loop just read the name of the file containing byte to unicode mappings. actually load the file here.
for (var i = 0; i < iitd.fonts.length; i++) {
	var filename = iitd.fonts[i][2];
	var firstname = iitd.fonts[i][2].split('.')[0];
	iitd[firstname] = read_tsv(app.activeScript.path + "/" + filename);
	iitd.fonts[i][2] = iitd[firstname];
}
main();