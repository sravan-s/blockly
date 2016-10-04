Blockly.JavaScript['extractor'] = function(block) {
  var value_line = Blockly.JavaScript.valueToCode(block, 'line', Blockly.JavaScript.ORDER_ATOMIC);
  var value_file = Blockly.JavaScript.valueToCode(block, 'file', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['field_extractor'] = function(block) {
  var number_get = block.getFieldValue('get');
  var text_delim = block.getFieldValue('delim');
  var dropdown_operation = block.getFieldValue('operation');
  var variable_marker = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('marker'), Blockly.Variables.NAME_TYPE);
  var value_next_marker = Blockly.JavaScript.valueToCode(block, 'next_marker', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
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
