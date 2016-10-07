

Blockly.JavaScript['extractor'] = function(block) {
  var value_line = Blockly.JavaScript.valueToCode(block, 'line', Blockly.JavaScript.ORDER_ATOMIC);
  var value_file = Blockly.JavaScript.valueToCode(block, 'file', Blockly.JavaScript.ORDER_ATOMIC);
  Blockly.JavaScript.variables.push('protected Marker line;\n');
  Blockly.JavaScript.variables.push('protected Marker fileName;\n');
  var code ='';
  if(value_line !== "") {
    code += value_line.replace('$$', "line");
  }
  if(value_file !== "") {
    code += value_file.replace('$$', "fileName");
  }
  Blockly.JavaScript.extractPhase = code;
  // console.log('extractor',code)
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['output_field'] = function(block) {
  var variable_name = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('NAME'), Blockly.Variables.NAME_TYPE);
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};


Blockly.JavaScript['field_extractor'] = function(block) {
  if (!block.validate) {
    return false;
  }
  var number_get = block.getFieldValue('get');
  var text_delim = block.getFieldValue('delim');

  var dropdown_operation = block.getFieldValue('operation');
  var variable_marker = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  //this shouldnot be 'f'
  // and should be unique
  var childCode = Blockly.JavaScript.valueToCode(block, 'next_marker', Blockly.JavaScript.ORDER_ATOMIC);
  childCode = childCode.replace("$$", 'm'+variable_marker);
  var chars = text_delim.split('');
  var ascii = 'token_';
  var code;
  chars.forEach(function(c) {
    ascii += c.charCodeAt(0);
  });
  var currBlockCode = "m" + variable_marker + " = $$.splitAndGetMarker(data, " + ascii + ","+number_get+', mf);\n';
  code = currBlockCode + childCode;
  
  var escapeMatch = text_delim.match(/(\\t|\\b|\\n|\\r|\\f|\'|\"|\\)/g);
  if(escapeMatch){ text_delim = '\\'+text_delim}
  Blockly.JavaScript.variables.push('protected Marker m' + variable_marker + ';\n');
  Blockly.JavaScript.variables.push('protected byte[] ' + ascii + '= new String("'+text_delim+'").getBytes();\n');
  // var code = '.splitAndGetMarker(data, '+ ascii+', '+number_get+', mf);\n ';
  // console.log('field_extractor',code);
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};


Blockly.JavaScript['transform'] = function(block) {
  var statements_name = Blockly.JavaScript.statementToCode(block, 'NAME');
  // TODO: Assemble JavaScript into code variable.
  var code = statements_name;
  Blockly.JavaScript.translatePhase = code;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['store'] = function(block) {
  var dropdown_operation = block.getFieldValue('operation');
  var text_path = block.getFieldValue('path');
  var value_list_to_store = Blockly.JavaScript.valueToCode(block, 'list_to_store', Blockly.JavaScript.ORDER_ATOMIC);
  var checkbox_headers = block.getFieldValue('headers') == 'TRUE';
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};
Blockly.JavaScript['binary'] = function(block) {
  var variable_m1 = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('m1'), Blockly.Variables.NAME_TYPE);
  var dropdown_operation = block.getFieldValue('operation');
  var variable_m2 = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('m2'), Blockly.Variables.NAME_TYPE);
  var variable_result = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  var value_child = Blockly.JavaScript.valueToCode(block, 'child', Blockly.JavaScript.ORDER_ATOMIC);
  var code = dropdown_operation.replace('$1',variable_result)
  .replace('$2',variable_m1)
  .replace('$3',variable_m2)
  +'\n';
  return code;
};

Blockly.JavaScript['unary'] = function(block) {
  var dropdown_operation = block.getFieldValue('operation');
  var variable_m1 = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('m1'), Blockly.Variables.NAME_TYPE);
  var variable_result = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('result'), Blockly.Variables.NAME_TYPE);
  var value_child = Blockly.JavaScript.valueToCode(block, 'child', Blockly.JavaScript.ORDER_ATOMIC);
  var code = dropdown_operation.replace('$1',variable_result)
  .replace('$2',variable_m1)
   +'\n';
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};


Blockly.JavaScript['tp_constant'] = function(block) {
  var text_constant = block.getFieldValue('constant');
  var dropdown_name = block.getFieldValue('NAME');
  var code;
  switch (dropdown_name) {
    case String:
      code = "protected String c_" + text_constant + ' = "' + text_constant + '";\n';
      break

    case Long:
      code = "protected long c_" + text_constant + ' = ' + text_constant + ';\n';
      break;

    case Double:
      code = "protected double c_" + text_constant + ' = ' + text_constant + ';\n';
      break;
  }
  
  return code;
};

Blockly.JavaScript['lists_create_with'] = function(block) {
  var code='';
  var parentVar;
  if(block.getParent().type =='extractor'){
    
    var newBlock = block.getParent();
    var value_line = Blockly.JavaScript.valueToCode(newBlock, 'line', Blockly.JavaScript.ORDER_ATOMIC);
    var value_file = Blockly.JavaScript.valueToCode(newBlock, 'file', Blockly.JavaScript.ORDER_ATOMIC);
    if(value_line!==''){
      parentVar ="line";  
    }
    if(value_file!==''){
      parentVar ="fileName";  
    }
    
  }else if(block.getParent().type =='field_extractor'){
    parentVar= 'm'+block.getParent().getFieldValue("VAR");
  }else{
    parentVar ="Store TODO";
  }
  for (var n = 0; n < block.itemCount_; n++) {
    var str = Blockly.JavaScript.valueToCode(block, 'ADD'+n,0)|| undefined;
    if(str){
      str = str.replace("$$", parentVar);
      code +=  str+"\n";
    }
  }
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};