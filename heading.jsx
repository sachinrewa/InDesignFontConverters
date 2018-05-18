﻿// object model initialisations
var avg_font_size = apply_on_text_elements(averager);

// all texts bigger than avg_font_size
var headings      = apply_on_text_elements(style_creator);

// headings_for_level is a 2D array which contains 6 rows -
// one for each heading level. And each row will contain the
// paragraph objects corresponding to that level
var headings_for_level = new Array(6);
for (var i = 0; i < 6; i++) {
  headings_for_level[i] = new Array();
}

// assuming the first word/text frame is the title and hence h1
headings_for_level[0].push(headings[0]);
headings[0].level = 0;
for (var i = 1; headings[i]!=null; i++) {  
  if (headings[i].size < headings[i-1].size) {                                  // smaller than previous
    headings[i].level = headings[i-1].level + 1;
  } else if ((headings[i].size > headings[i-1].size && headings[i-1].level == 0)// bigger than previous but previous already h1
  || (headings[i].size == headings[i-1].size)                                   // same as previous
  || (headings[i].size < headings[i-1].size && headings[i-1].level == 5)) {     // smaller than previous but previous already h5
    headings[i].level = headings[i-1].level;    
  } else {                                                                      // look for the right heading level
    var k = headings[i-1].level;
    while(k > 0 && headings[i].size >= headings_for_level[k][headings_for_level[k].length-1].size)
      k--;          
    headings[i].level = k+1;
  }
  headings_for_level[headings[i].level].push(headings[i]);
  write_to_file("\nAssiging " + headings[i].text.contents + " to level " + headings[i].level);
}

for (var i=0;i<6;i++) { //apply_on_text_elements over the rows in headings_for_level
  for (var j=0; j<headings_for_level[i].length;j++) { //apply_on_text_elements over alll elemets of one row
    headings_for_level[i][j].text.appliedParagraphStyle = app.documents[0].paragraphStyles.item (headings_for_level[i][j].style.name); //apply the custom paragraph style created to the paragraph
    //according to the heading level of the paragraph, assign an export tag to the custom style created for each respective paragraph
    var h = app.documents[0].paragraphStyles.itemByName(headings_for_level[i][j].style.name);
    h.styleExportTagMaps.add({exportType: "EPUB", exportTag: "h"+(i+1), exportClass: "", exportAttributes: ""});
    h.styleExportTagMaps.add({exportType: "PDF", exportTag: "H"+(i+1), exportClass: "", exportAttributes: ""});
  }
}

function apply_on_text_elements(fun) {
  var o = fun();    
  var stories = app.activeDocument.stories.everyItem().getElements();

  for (var i = 0; i < stories.length; i++) {
    var textStyleRanges = stories[i].textStyleRanges.everyItem().getElements();
    
    for (var j = 0; j < textStyleRanges.length; j++) {
      var myText = textStyleRanges[j];   
      write_to_file(myText.contents + "\n");
      o.fun(myText)      
    }  
  }
  return o.val();
}

function averager() {
  var count = 0;
  var sum = 0;
  return {
    fun: function(myText) {
            sum = sum+myText.pointSize;
            count = count+1;
         },
    val: function() {
            return sum/count;
         }
  }
}

function style_creator() {
  var headings = new Array();
  return {
    fun: function(myText) {
            if (myText.pointSize > avg_font_size) {  // distinguish between non heading and heading text by using the average
              // create an object having the paragraph text, its size, heading number, and a new custom style which is different for each paragraph, and given the various style parameters to maintain formatting
              
              var styleName = "autogenerated_" + headings.length.toString()
              write_to_file(myText.contents + " (name): " + styleName);
              write_to_file(myText.contents + " (fontStyle): " + myText.fontStyle);
              headings.push({ text : myText ,
                              size : myText.pointSize ,
                              level : 0 ,
                              style : app.documents[0].paragraphStyles.add({ name : styleName,
                                                                  spaceAfter : myText.spaceAfter ,
                                                                  appliedFont : myText.appliedFont,
                                                                  fontFamily : myText.appliedFont.fontFamily,
                                                                  spaceBefore : myText.spaceBefore ,
                                                                  fontStyle : myText.fontStyle ,
                                                                  pointSize : myText.pointSize ,
                                                                  fillColor : myText.fillColor ,
                                                                  alignToBaseline : myText.alignToBaseline ,
                                                                  digitsType : myText.digitsType ,
                                                                  index : myText.index ,
                                                                  leftIndent : myText.leftIndent ,
                                                                  paragraphDirection : myText.paragraphDirection ,
                                                                  position : myText.position ,
                                                                  parent : myText.parent ,
                                                                  properties : myText.properties ,
                                                                  startParagraph : myText.startParagraph ,
                                                                  underline : myText.underline ,
                                                                  underlineColor : myText.underlineColor ,
                                                                  underlineType : myText.underlineType ,
                                                                  underlineWeight : myText.underlineWeight ,
                                                                  justification : myText.justification
                })
              });
              //write_to_file("headings[" + (headings.length-1) + "]: (" + myText.contents + "), " + myText.pointSize);
            }
    },

    val: function() {
     return headings;
    }
  }
}

function write_to_file(text) {
  var file = new File("~/Desktop/heading.txt");
  file.encoding = "UTF-8";
  if (file.exists) {
    file.open("e");
    file.seek(0, 2);
  }
  else {
    file.open("w");
  }
  file.write(text);
  file.close();
}