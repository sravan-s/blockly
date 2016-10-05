Blockly.JavaScript.variables = [];
Blockly.JavaScript.extractPhase = '';
Blockly.JavaScript.translatePhase = '';
Blockly.JavaScript.storePhase = '';

Blockly.JavaScript['extractor'] = function(block) {
  var value_line = Blockly.JavaScript.valueToCode(block, 'line', Blockly.JavaScript.ORDER_ATOMIC);
  var value_file = Blockly.JavaScript.valueToCode(block, 'file', Blockly.JavaScript.ORDER_ATOMIC);
  Blockly.JavaScript.variables.push('protected Marker line;\n');
  Blockly.JavaScript.variables.push('protected Marker fileName;\n');
  if(value_line!= undefined || value_line != '') {
    code += value_line;
  }
  if(value_file!= undefined || value_file != '') {
    code += value_file;
  }
  Blockly.JavaScript.extractPhase = code;
  return code;
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
  var value_next_marker = Blockly.JavaScript.valueToCode(block, 'next_marker', Blockly.JavaScript.ORDER_ATOMIC);
  var chars = text_delim.split('');
  var ascii = 'token_';
  chars.forEach(function(c) {
    ascii += c.charCodeAt(0);
  });
  if (block.parentBlock_.type == 'extractor') {
    code =  'm' + variable_marker + " = line.splitAndGetMarker(data, '" + ascii + "', '+number_get+', mf);\n " +value_next_marker;
  } else {
    code = 'm' + variable_marker + " =" + 'm' + block.parentBlock_.getFieldValue('VAR') + ".splitAndGetMarker(data, '"+ ascii + "', '+number_get+', mf);\n";
  }
  Blockly.JavaScript.variables.push('protected Marker ' + variable_marker + ';\n');
  Blockly.JavaScript.variables.push('protected byte[] ' + text_delim + ';\n');
  // var code = '.splitAndGetMarker(data, '+ ascii+', '+number_get+', mf);\n ';
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};


Blockly.JavaScript['transform'] = function(block) {
  var statements_name = Blockly.JavaScript.statementToCode(block, 'NAME');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['store'] = function(block) {
  var dropdown_operation = block.getFieldValue('operation');
  var text_path = block.getFieldValue('path');
  var value_list_to_store = Blockly.JavaScript.valueToCode(block, 'list_to_store', Blockly.JavaScript.ORDER_ATOMIC);
  var checkbox_headers = block.getFieldValue('headers') == 'TRUE';
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};
Blockly.JavaScript.generateBinary = function(block) {
  var variable_m1 = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('m1'), Blockly.Variables.NAME_TYPE);
  var dropdown_operation = block.getFieldValue('operation');
  var variable_m2 = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('m2'), Blockly.Variables.NAME_TYPE);
  var variable_result = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('result'), Blockly.Variables.NAME_TYPE);
  var value_child = Blockly.JavaScript.valueToCode(block, 'child', Blockly.JavaScript.ORDER_ATOMIC);
  code = dropdown_operation.replace('$1',variable_result)
  .replace('$2',variable_m1)
  .replace('$3',variable_m2)
  +'\n';
  // var code = '...;\n';
  return code;
};

Blockly.JavaScript.generateUnary = function(block) {
  var dropdown_operation = block.getFieldValue('operation');
  var variable_m1 = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('m1'), Blockly.Variables.NAME_TYPE);
  var variable_result = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('result'), Blockly.Variables.NAME_TYPE);
  var value_child = Blockly.JavaScript.valueToCode(block, 'child', Blockly.JavaScript.ORDER_ATOMIC);
  code = dropdown_operation.replace('$1',variable_result)
  .replace('$2',variable_m1)
   +'\n';
  return code;
};


Blockly.JavaScript['tp_constant'] = function(block) {
  var text_constant = block.getFieldValue('constant');
  var dropdown_name = block.getFieldValue('NAME');
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
