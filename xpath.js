function walkUp(node, depth, maxDepth, aSentinel, aDefaultNS, kwds)
{//xpath absoluto
    var strArray = [];
    if(!node) return "";
    if(node==aSentinel) return ["."];
    if((node.parentNode) && (depth < maxDepth)) {
        var res = walkUp(node.parentNode, depth + 1, maxDepth, aSentinel, aDefaultNS, kwds);
        strArray = strArray.concat(res);
    }

    switch (node.nodeType) {
        case 1/*Node.ELEMENT_NODE*/:{
                var nname = node.localName;
                var conditions = [];
                var hasid = false;
                if (kwds['showClass'] && node.hasAttribute('class')) conditions.push("@class='"+node.getAttribute('class')+"'");
                if (kwds['showId'] && node.hasAttribute('id')) {
                    conditions.push("@id='"+node.getAttribute('id')+"'");
                    hasid = true;
                }
                    
                //not identified by id?
                if(!hasid){
                    var index = siblingIndex(node);
                    //more than one sibling?
                    if (index) {
                        //are there also other conditions?
                        if (conditions.length>0) conditions.push('position()='+index);
                        else conditions.push(index);
                    }
    
                }
                if (kwds['showNS']){
                    if(node.prefix) nname=node.prefix+":"+nname;
                    else if (aDefaultNS) nname="default:"+nname;
                }
                if (kwds['toLowercase']) nname=nname.toLowerCase();
                var tmp= "/"+nname;
                
                if(conditions.length>0){
                    tmp+="[";
                    for(var i=0;i<conditions.length; i++){
                        if (i>0) tmp+=' and ';
                        tmp+=conditions[i];
                    }
                    tmp+="]";
                }
                strArray[strArray.length]=tmp;
                break;
            }
        case 9/*Node.DOCUMENT_NODE*/:{
            break;
        }
        case 3/*Node.TEXT_NODE*/:{
            var tmp = '/text()';
            var index = siblingIndex(node);
            if (index) tmp+="["+index+"]";
            strArray[strArray.length]=tmp;
            break;
        }
    }
    return strArray;            
}

function siblingIndex(aNode){
    var siblings = aNode.parentNode.childNodes;
    var allCount = 0;
    var position;
    
    if (aNode.nodeType==1/*Node.ELEMENT_NODE*/){
        var name = aNode.nodeName;
        for (var i=0; i<siblings.length; i++){
            var node = siblings.item(i);
            if (node.nodeType==1/*Node.ELEMENT_NODE*/){
                if (node.nodeName == name) allCount++; 
                if (node == aNode) position = allCount;
            }
        }
    }
    else if (aNode.nodeType==3/*Node.TEXT_NODE*/){
        for (var i=0; i<siblings.length; i++){
            var node = siblings.item(i);
            if (node.nodeType==3/*Node.TEXT_NODE*/){
                allCount++;
                if (node == aNode) position = allCount;
            }
        }
    }
    
    if (allCount>1) return position;
    return null;
}

function generateXPath(aNode, aSentinel, aDefaultNS, kwds){
    return walkUp(aNode,0,99, aSentinel, aDefaultNS, kwds);
}

function xPathResToArr(xres){
 var nodes=[]; 
 for(var elem=xres.iterateNext();elem!=null;elem=xres.iterateNext()){
  nodes[nodes.length]=elem;
 } 
 return nodes;
}

function sameArray(arrA, arrB){
 var ok=arrA.length==arrB.length;
 var i=0;
 for(i=0;i<arrA.length&&ok;i++){
  ok=arrA[i]==arrB[i];
 }
 return ok;
}

function extractConditions(part){
 var res="[]";
 var matches=/\/([a-zA-Z]*)(\[[^\]]*\])?$/.exec(part);
 if(matches&&matches[2]){
  res=matches[2];
 }
 return res;
}

function hasId(xpath){
 return extractConditions(xpath).indexOf("@id")>-1;
}

function trimFromLastIdToEnd(xpath){
 var i=xpath.length-1;
 var end=0;
 for(;i>-1&&end==0;i--){
  var part=xpath[i];
  if(hasId(part)){
   end=i;
  }
 }
 if(end==1){end=0;}
 xpath=xpath.slice(end);
 if(end>0){
  xpath=[".","/"].concat(xpath);
 }
 return xpath;
}

function trimElementsNotRelevant(xpath,tester,node){
 var myDoc=node.ownerDocument?node.ownerDocument:node;
 var i=1;
 var res=xpath.slice(0);
 var elemsI=xPathResToArr(myDoc.evaluate(res.join(""), node, null, XPathResult.ANY_TYPE, null)); 
 for(i=1;i<res.length;i++){
  if(res[i]!="/"&&tester(res[i])){
   var tmp=res.slice(0);
   var rem=0;
   if(tmp[i-1]=="/"||tmp[i+1]=="/"){
    if(i==(tmp.length-1)||(tmp[i-1]=="/"&&tmp[i+1]=="/")){
     tmp.splice(i-1,2);   
     rem=2;       
    }else{
     tmp.splice(i,1);
     rem=1; 
    }  
   }else if(i==(tmp.length-1)){
    tmp.splice(i,1); 
    rem=1;  
   }else{
    tmp[i]="/";
    rem=0;
   }
   try{
   var elemsA=xPathResToArr(myDoc.evaluate(tmp.join(""), node, null, XPathResult.ANY_TYPE, null));
   }catch(e){alert(res+'\n'+tmp+'\n'+i);}
   if(sameArray(elemsI,elemsA)){
    res=tmp;
    i=i-rem;
   }
   
  }
 }

 return res;
}

function minimizeXPath(xpath,node){
 var myDoc=node.ownerDocument?node.ownerDocument:node;
 var res=xpath;
 var tmp;
 var elemsA;
 var elemsIni=xPathResToArr(myDoc.evaluate(res.join(""), node, null, XPathResult.ANY_TYPE, null));

 tmp=trimFromLastIdToEnd(res); 
 elemsA=xPathResToArr(myDoc.evaluate(tmp.join(""), node, null, XPathResult.ANY_TYPE, null));
 if(sameArray(elemsIni,elemsA)){
  res=tmp;  
 }

 tmp=trimElementsNotRelevant(res,function(node){return extractConditions(node).indexOf("@")==-1},node); 
 elemsA=xPathResToArr(myDoc.evaluate(tmp.join(""), node, null, XPathResult.ANY_TYPE, null));
 if(sameArray(elemsIni,elemsA)){
  res=tmp;
 }

 tmp=trimElementsNotRelevant(res,function(node){return true;},node);
 elemsA=xPathResToArr(myDoc.evaluate(tmp.join(""), node, null, XPathResult.ANY_TYPE, null));
 if(sameArray(elemsIni,elemsA)){
  res=tmp;
 }
 
 if(res.length>1&&res[1]!="/"){
  res.splice(1,0,"/");
 }
 return res;
}