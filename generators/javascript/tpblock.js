Blockly.JavaScript.variables = [];
Blockly.JavaScript['extractor'] = function(block) {
  var value_line = Blockly.JavaScript.valueToCode(block, 'line', Blockly.JavaScript.ORDER_ATOMIC);
  var value_file = Blockly.JavaScript.valueToCode(block, 'file', Blockly.JavaScript.ORDER_ATOMIC);
  Blockly.JavaScript.variables.push('protected Marker line;\n');
  Blockly.JavaScript.variables.push('protected Marker fileName;\n');
  if(value_line!= undefined || value_line != '') {
    value_line = 'line.' + value_line;
  }
  if(value_file!= undefined || value_file != '') {
    value_file = 'fileName.' + value_file;
  }
  var code = value_line + value_file;
  return code;
};

Blockly.JavaScript['field_extractor'] = function(block) {
  var number_get = block.getFieldValue('get');
  var text_delim = block.getFieldValue('delim');
  var dropdown_operation = block.getFieldValue('operation');
  var variable_marker = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('marker'), Blockly.Variables.NAME_TYPE);
  var value_next_marker = Blockly.JavaScript.valueToCode(block, 'next_marker', Blockly.JavaScript.ORDER_ATOMIC);
  var chars = text_delim.split('');
  var ascii = 'token_';
  chars.forEach(function(c) {
    ascii += c.charCodeAt(0);
  });
  if (block.parentBlock_.type == 'extractor') {
    code = value_next_marker +  'm'+variable_marker +" = .splitAndGetMarker(data, '+ ascii+', '+number_get+', mf);\n ';" ;
    // code = 'm'+variable_marker +" = fileName.splitAndGetMarker(data, '+ ascii+', '+number_get+', mf);\n ';"
  }else{
    code = 'm'+block.parentBlock_.getFieldValue('marker') +" = line.splitAndGetMarker(data, '+ ascii+', '+number_get+', mf);\n ';"
  }
  Blockly.JavaScript.variables.push('protected Marker '+variable_marker+ ';\n');
  Blockly.JavaScript.variables.push('protected byte[] '+text_delim+ ';\n');
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
Blockly.JavaScript.generateBinary= function(block){
  var variable_m1 = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('m1'), Blockly.Variables.NAME_TYPE);
  var dropdown_operation = block.getFieldValue('operation');
  var variable_m2 = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('m2'), Blockly.Variables.NAME_TYPE);
  var variable_result = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('result'), Blockly.Variables.NAME_TYPE);
  var value_child = Blockly.JavaScript.valueToCode(block, 'child', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript.generateUnary= function(block){
   var dropdown_operation = block.getFieldValue('operation');
  var variable_m1 = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('m1'), Blockly.Variables.NAME_TYPE);
  var variable_result = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('result'), Blockly.Variables.NAME_TYPE);
  var value_child = Blockly.JavaScript.valueToCode(block, 'child', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['binary_string_transform'] = Blockly.JavaScript.generateBinary;
Blockly.JavaScript['unary_string_transform'] = Blockly.JavaScript.generateUnary;

Blockly.JavaScript['binary_math_transform'] = Blockly.JavaScript.generateBinary;
Blockly.JavaScript['unary_math_transform'] = Blockly.JavaScript.generateUnary;

Blockly.JavaScript['binary_date_transform'] = Blockly.JavaScript.generateBinary;
Blockly.JavaScript['unary_date_transform'] = Blockly.JavaScript.generateUnary;

Blockly.JavaScript['binary_logic_transform'] = Blockly.JavaScript.generateBinary;
Blockly.JavaScript['unary_logic_transform'] = Blockly.JavaScript.generateUnary;
