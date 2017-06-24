function showNext(data,url1){
  var spreadsheet=SpreadsheetApp.openByUrl(url1);
  var range=spreadsheet.getRange("A2").getValue();
  var row=spreadsheet.getRange("A"+Math.round(range*1)).getValue();
  if(row=="")   {var rows = spreadsheet.getRange("A"+Math.round(range*1)).setValue(data); 
                     spreadsheet.getRange("A2").setValue(Math.round((range*1)+1));}
}
function fetchData(url){
  var spreadsheet=SpreadsheetApp.openByUrl(url);
  var temp=spreadsheet.getRange("A2").getValue();
  var rows = spreadsheet.getRange('A'+Math.round(temp*1)+":D"+Math.round(temp*1)).getValues();
  var row = rows[0][0]+"~"+rows[0][2]+"~"+rows[0][3];
  var data=row.split('~'); 
  data.push((temp*1)-2);
  if(data[0]==""){return data;}
  else if(data[0]=="end"){spreadsheet.getRange("B2").setValue("completed"); return 0;}
  else spreadsheet.getRange("A2").setValue(Math.round((temp*1)+1));
}

function doGet(){
  var html=HtmlService.createHtmlOutputFromFile("source");
  html.setTitle("Technology Tagger");
  return html;
}

function getHistory(){
  var temp=PropertiesService.getUserProperties().getProperty("History");
  if(temp)
    return temp;
  else
    return "No Suggestions Yet !";
}
function store(data){
 //PropertiesService.getUserProperties().deleteAllProperties();
 var temp=PropertiesService.getUserProperties().getProperty("History");
  if (!temp)
    PropertiesService.getUserProperties().setProperty("History",data);
  else if((temp.indexOf(data))== -1)
  PropertiesService.getUserProperties().setProperty("History",temp+","+data);
}

function generate(data,url,concent){
  var keywords;
  if(data.indexOf(',')) keywords=data.split(',');
  else keywords[0]=data;
  var spreadsheet=SpreadsheetApp.openByUrl(url);
  var temp=spreadsheet.getRange("B2").getValue();
  if((concent==1)||(temp)){
    for(var i=0;i<keywords.length;i++){
    
      var app = SpreadsheetApp.create(keywords[i]);
      var doc= DocumentApp.create(keywords[i]);
      
      var headerStyle = {};
      headerStyle[DocumentApp.Attribute.BACKGROUND_COLOR] = '#336600';
      headerStyle[DocumentApp.Attribute.BOLD] = true;
      headerStyle[DocumentApp.Attribute.FOREGROUND_COLOR] = '#FFFFFF';
      
      var cellStyle = {};
      cellStyle[DocumentApp.Attribute.BOLD] = false;
      cellStyle[DocumentApp.Attribute.FOREGROUND_COLOR] = '#000000';

      
      doc.addHeader().setText("Technologies related to "+keywords[i]+" --- Report ");    
      var table=doc.getBody().appendTable();
      var row=table.appendTableRow();
      var head1=row.appendTableCell("Post");
      head1.setAttributes(headerStyle);
      var head2=row.appendTableCell("Link");
      head2.setAttributes(headerStyle);
      var rows = spreadsheet.getDataRange().getNumRows();
      var data= spreadsheet.getRange("A3:AA"+rows).getValues();
      var head=spreadsheet.getRange("A1:AA2").getValues();
      app.getRange("A1:AA2").setValues(head);
      app.getRange("A2").setValue("3");
      app.getRange("B2").setValue("");
      var pos=3;
      for(var j=0;j<rows-2;j++)
      {
        var string=data[j][0];
        if(!string)       {         break;        }
        if((string.indexOf(keywords[i]))!=-1)
        {
          var single=spreadsheet.getRange("B"+(j+3)+":AA"+(j+3)).getValues();
          app.getRange("B"+pos+":AA"+pos).setValues(single);
          pos++;
          var row1=table.appendTableRow();
          row1.appendTableCell(single[0][2]);
          row1.appendTableCell(single[0][1]).setLinkUrl(single[0][1]);
          row1.setAttributes(cellStyle);
         
        }
      }
      doc.saveAndClose();
    }
    return "Report Generated";
  }
  else
     return "The document is partially tagged! Do you still wish to continue?";
}

