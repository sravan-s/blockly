Blockly.JavaScript['flytxt'] = function(block) {
  var value_line = Blockly.JavaScript.valueToCode(block, 'lineName', Blockly.JavaScript.ORDER_ATOMIC);
  var value_file = Blockly.JavaScript.valueToCode(block, 'fileName', Blockly.JavaScript.ORDER_ATOMIC);
  var value_transform = Blockly.JavaScript.statementToCode(block, 'transform',Blockly.JavaScript.ORDER_ATOMIC);
  var value_store_stream = Blockly.JavaScript.valueToCode(block, 'store_stream', Blockly.JavaScript.ORDER_ATOMIC);
  var value_store_batch = Blockly.JavaScript.valueToCode(block, 'store_batch', Blockly.JavaScript.ORDER_ATOMIC);
  // Blockly.JavaScript.variables.push('protected final Marker line  = new Marker();\n');
  // Blockly.JavaScript.variables.push('protected String currentFileName;\n');
  var code ='';
  if(value_line !== "") {
    code += value_line.replace(/\$\$/g, "line");
  }
  if(value_file !== "") {
    code += value_file.replace(/\$\$/g, "fileName");
  }
  Blockly.JavaScript.extractPhase = code;
  // check if trnaform has children
  if(value_transform){
    Blockly.JavaScript.translatePhase = value_transform;
  }

  if(value_store_stream){
    Blockly.JavaScript.storePhase += value_store_stream+'\n';
  }

  if(value_store_batch){
    storeBatch(block);
  }

  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};
Blockly.JavaScript['lists_create_with'] = function(block) {
  var code ='';
  block.inputList.forEach(function(input){
    if(input.connection && input.connection.targetConnection){
      var getChildCode = Blockly.JavaScript.valueToCode(block, input.name, Blockly.JavaScript.ORDER_ATOMIC);
      code+=getChildCode;
    }
  });
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
}
Blockly.JavaScript['lists_create_with_extract'] = function(block) {
  var code ='';
  block.inputList.forEach(function(input){
    if(input.connection && input.connection.targetConnection){
      var getChildCode = Blockly.JavaScript.valueToCode(block, input.name, Blockly.JavaScript.ORDER_ATOMIC);
      code+=getChildCode;
    }
  });
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
}
Blockly.JavaScript['lists_create_with_stream'] = function(block) {
  var code ='';
  block.inputList.forEach(function(input){
    if(input.connection && input.connection.targetConnection){
      var getChildCode = Blockly.JavaScript.valueToCode(block, input.name, Blockly.JavaScript.ORDER_ATOMIC);
      code+=getChildCode;
    }
  });
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
}
Blockly.JavaScript['lists_create_with_batch'] = function(block) {
  var code ='';
  block.inputList.forEach(function(input){
    if(input.connection && input.connection.targetConnection){
      var getChildCode = Blockly.JavaScript.valueToCode(block, input.name, Blockly.JavaScript.ORDER_ATOMIC);
      code+=getChildCode;
    }
  });
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
}

Blockly.JavaScript['output_field'] = function(block) {
  var code = block.getFieldValue('VAR') || null;
  // TODO: Assemble JavaScript into code variable.
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['delimiter'] = function(block) {
  if (!block.validate()) {
    return false;
  }
  var text_delim = block.getFieldValue('delim');
  var chars = text_delim.split('');
  var ascii = 'token_';
  var code;
  chars.forEach(function(c) {
    ascii += c.charCodeAt(0);
  });
  var escapeMatch = text_delim.match(/(\\t|\\b|\\n|\\r|\\f|\'|\"|\\)/g);
  if(escapeMatch){ text_delim = '\\'+text_delim}

  var token = 'private byte[] ' + ascii + '= "'+text_delim+'".getBytes();\n';
  var childCol = [];
  var childVar = [];
  var childCode = [];
  block.inputList.forEach(function(input){
    if(input.connection && input.connection.targetConnection){
      var getChildCode = Blockly.JavaScript.valueToCode(block, input.name, Blockly.JavaScript.ORDER_ATOMIC);
      getChildCode = getChildCode.split('|$|');
      childVar.push('m'+getChildCode[0])
      childCol.push(getChildCode[1]);
      childCode.push(getChildCode[2]);
    }
  })
    childCol = childCol.join(',');
    childVar = childVar.length > 0 ? ','+childVar.join(',') : '';
    code = '$$.splitAndGetMarkers(data,'+ascii+',new int[]{'+childCol+'},mf'+childVar+');\n';
    code+=childCode.join('');
  if (Blockly.JavaScript.variables.indexOf(token) == -1) {
    Blockly.JavaScript.variables.push(token);
  }
  return [code, Blockly.JavaScript.ORDER_ATOMIC];

};

Blockly.JavaScript['field_extractor'] = function(block) {
  if (!block.validate) {
    return false;
  }
  var number_get = block.getFieldValue('NAME');
  var code;
  var dropdown_operation = block.getFieldValue('operation');
  var variable_marker = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  //this shouldnot be 'f'
  // and should be unique
  var childCode = Blockly.JavaScript.valueToCode(block, 'next_marker', Blockly.JavaScript.ORDER_ATOMIC);
  childCode = childCode.replace("$$", 'm'+variable_marker);

  // var currBlockCode = "$$.splitAndGetMarker(data,[$],int[]{1,2}"+number_get+', mf);\n';
  // code = currBlockCode + childCode;
  code= variable_marker+'|$|'+number_get+'|$|'+childCode;

  Blockly.JavaScript.initFunctions.push('m'+variable_marker+' = mf.create(0, 0);\n');

  var marker = 'private Marker m' + variable_marker + ';\n';
  if (Blockly.JavaScript.variables.indexOf(marker) == -1) {
    Blockly.JavaScript.variables.push(marker);
  }
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['transform'] = function(block) {
  var statements_name = Blockly.JavaScript.statementToCode(block, 'NAME');
  // TODO: Assemble JavaScript into code variable.
  var code = statements_name;
  Blockly.JavaScript.translatePhase = code;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['binary'] = function(block) {
  var variable_m1 = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('m1'), Blockly.Variables.NAME_TYPE);
  var dropdown_operation = block.getFieldValue('operation');
  var variable_m2 = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('m2'), Blockly.Variables.NAME_TYPE);
  var variable_result = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  var value_child = Blockly.JavaScript.valueToCode(block, 'child', Blockly.JavaScript.ORDER_ATOMIC);
  var splitCode = dropdown_operation.split('||');
  Blockly.JavaScript.variables.push('private '+splitCode[1]+' m'+variable_result+';\n');
  var code = splitCode[0].replace(/\$1/g,'m'+variable_result)
  .replace(/\$2/g,variable_m1)
  .replace(/\$3/g,variable_m2)
  +'\n';
  return code;
};

Blockly.JavaScript['unary'] = function(block) {
  var dropdown_operation = block.getFieldValue('operation');
  var variable_m1 = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('m1'), Blockly.Variables.NAME_TYPE);
  var variable_result = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  var value_child = Blockly.JavaScript.valueToCode(block, 'child', Blockly.JavaScript.ORDER_ATOMIC);
  var splitCode = dropdown_operation.split('||');
  Blockly.JavaScript.variables.push('private '+splitCode[1]+' m'+variable_result+';\n');

  var code = splitCode[0].replace(/\$1/g,'m'+variable_result)
  .replace(/\$2/g,variable_m1)
   +'\n';
  return code;
};

Blockly.JavaScript['dynamic'] = function(block) { 
  var dropdown_operation = bbm.Consts.DYNAMIC_OPERATIONS[block.getFieldValue('operation')]; 
  var variable_m1 = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('m1'), Blockly.Variables.NAME_TYPE); 
  var variable_m2 = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('m2'), Blockly.Variables.NAME_TYPE); 
  var variable_result = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE); 
  var value_child = Blockly.JavaScript.valueToCode(block, 'child', Blockly.JavaScript.ORDER_ATOMIC); 
  var splitCode = dropdown_operation.split('||');
  Blockly.JavaScript.variables.push('private '+splitCode[1]+' m'+variable_result+';\n'); 
 
  var code = splitCode[0].replace(/\$1/g,'m'+variable_result) 
  .replace(/\$2/g,variable_m1) 
  .replace(/\$3/g,variable_m2) 
   +'\n'; 
  return code; 
};

Blockly.JavaScript['event_field'] = function(block) {
  var subscriber = 'm'+block.getFieldValue('m1');
  var circle = 'm'+block.getFieldValue('m2');
  var dataType = bbm.Consts.STREAM_EVENT_OPERATIONS[block.getFieldValue('dataType')];
  var fieldType = block.getFieldValue('fieldType');
  var aggregateType = block.getFieldValue('aggragation');
  var statefull = block.getFieldValue('statefull');
  var passthrough = block.getFieldValue('passthrough');
  var timeIndex = 'm'+block.getFieldValue('m5');
  var eventID = 'm'+block.getFieldValue('m6');
  var oldValue = 'm'+block.getFieldValue('m3');
  var newValue = 'm'+block.getFieldValue('m4');
  var eventName = 'm'+block.getFieldValue('VAR');

  Blockly.JavaScript.variables.push('private Store streamStore = new StreamStore("/tmp/test");\n'); 
  Blockly.JavaScript.variables.push('private Marker '+eventName+';\n');
  Blockly.JavaScript.variables.push('private Marker statefull = '+bbm.Consts.MARKER_CHECK[statefull]+';\n');
  Blockly.JavaScript.variables.push('private Marker aggregatable = '+bbm.Consts.MARKER_CHECK[aggregateType]+';\n');
  Blockly.JavaScript.variables.push('private Marker '+timeIndex+';\n');
  Blockly.JavaScript.variables.push('private Marker '+eventID+';\n');
  Blockly.JavaScript.variables.push('private Marker passthrough = '+bbm.Consts.MARKER_CHECK[passthrough]+';\n');
  Blockly.JavaScript.variables.push('private Marker eventType = mf.createImmutable("'+dataType+'".getBytes(), 0, '+(dataType.length-1)+');\n');
  Blockly.JavaScript.variables.push('private Marker fieldType = mf.createImmutable("'+fieldType+'".getBytes(), 0, '+(fieldType.length-1)+');\n');

  var code ='streamStore.save(data,"",eventType,fieldType,'+eventName+',statefull,aggregatable,'+timeIndex+','+newValue+','+oldValue+','+eventID+',passthrough);\n';
  return [code, Blockly.JavaScript.ORDER_ATOMIC];; 
}; 


Blockly.JavaScript['tp_constant'] = function(block) {
  var text_constant = block.getFieldValue('constant');
  var save_var = block.getFieldValue('VAR');
  var code;
  Blockly.JavaScript.variables.push('private Marker m'+save_var+';\n');
  code = 'm'+save_var+' = mf.createImmutable("'+text_constant+'".getBytes(),0,"'+text_constant+'".getBytes().length);\n';
  Blockly.JavaScript.initFunctions.push(code);
  return '';
};

Blockly.JavaScript['lookup'] = function(block) {
  var get_var = block.getFieldValue('var');
  var lookup_type = block.getFieldValue('operation');
  var data_source = block.getFieldValue('path');
  var keyName = block.getFieldValue('var_key');
  var valueName = block.getFieldValue('VAR');
  var code='';
  Blockly.JavaScript.variables.push('private Lookup m'+get_var+' = new '+lookup_type+'("'+data_source+'");\n');
  Blockly.JavaScript.variables.push('private Marker m'+valueName+';\n');
  Blockly.JavaScript.initFunctions.push('m'+get_var+'.bake();\n')
  code += 'm'+valueName+' = m'+get_var+'.get(m'+keyName+'.getData() == null ? data: m'+keyName+'.getData())';
  // code += 'm'+valueName+' = m'+get_var+'.get(m'+keyName+'.getBytes());\n';
  return code;
}
Blockly.JavaScript['test'] = function(block) {
  var m1 = block.getFieldValue('m1');
  var m2 = block.getFieldValue('m2');
  var dropdown_operation = bbm.Consts.TEST_OPERATIONS[block.getFieldValue('operation')];
  var code = dropdown_operation.replace(/\$1/g,'m'+m1) 
  .replace(/\$2/g,'m'+m2) 
  .replace(/\$3/g,null) 
   +'\n'; 

  // var code ='m'+m1+'.toString(data).contains(m'+m2+'.toString(data))';
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
}


function storeBatch(block) {
  var get_Storage = block.getFieldValue('operation');
  var header_check = block.getFieldValue('headers');
  var getItemCount = block.itemCount_;
  var code ='';
  var childCode = Blockly.JavaScript.valueToCode(block, 'store_batch', Blockly.JavaScript.ORDER_ATOMIC);
  var mapCode = childCode.split(',');
  mapCode = mapCode.map(function(item){
    return 'm'+item
  });

  if(header_check==='TRUE'){
    Blockly.JavaScript.initFunctions.push('store.set("TestScript");\n');
  }
  Blockly.JavaScript.variables.push('private Store store = new '+get_Storage+'Store(outputFolder,"'+childCode+'");\n');

  Blockly.JavaScript.storePhase += 'store.save(data, fileName.toString(), '+mapCode.join(',')+');\n';
  // Blockly.JavaScript.storePhase = 'store.save(data, currentFileName '+code+');\n';
  return '';
}
