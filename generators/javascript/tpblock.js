Blockly.JavaScript['line_extractor'] = function(block) {
  var text_get = block.getFieldValue('get');
  var text_delim = block.getFieldValue('delim');
  var dropdown_data_type = block.getFieldValue('data_type');
  var statements_name = Blockly.JavaScript.statementToCode(block, 'NAME');
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['file_name_extractor'] = function(block) {
  var text_get = block.getFieldValue('get');
  var text_delim = block.getFieldValue('delim');
  var dropdown_data_type = block.getFieldValue('data_type');
  var statements_name = Blockly.JavaScript.statementToCode(block, 'NAME');
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['field_extractor'] = function(block) {
  var text_get = block.getFieldValue('get');
  var text_delim = block.getFieldValue('delim');
  var dropdown_data_type = block.getFieldValue('data_type');
  var statements_name = Blockly.JavaScript.statementToCode(block, 'NAME');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['string_binary_transform'] = function(block) {
  var value_m1 = Blockly.JavaScript.valueToCode(block, 'm1', Blockly.JavaScript.ORDER_ATOMIC);
  var dropdown_operation = block.getFieldValue('operation');
  var value_m2 = Blockly.JavaScript.valueToCode(block, 'm2', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['string_unary_transform'] = function(block) {
  var dropdown_operation = block.getFieldValue('operation');
  var value_m1 = Blockly.JavaScript.valueToCode(block, 'm1', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['math_binary_transform'] = function(block) {
  var value_m1 = Blockly.JavaScript.valueToCode(block, 'm1', Blockly.JavaScript.ORDER_ATOMIC);
  var dropdown_operation = block.getFieldValue('operation');
  var value_m2 = Blockly.JavaScript.valueToCode(block, 'm2', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['math_unary_transform'] = function(block) {
  var dropdown_operation = block.getFieldValue('operation');
  var value_m1 = Blockly.JavaScript.valueToCode(block, 'm1', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};


Blockly.JavaScript['date_binary_transform'] = function(block) {
  var value_m1 = Blockly.JavaScript.valueToCode(block, 'm1', Blockly.JavaScript.ORDER_ATOMIC);
  var dropdown_operation = block.getFieldValue('operation');
  var value_m2 = Blockly.JavaScript.valueToCode(block, 'm2', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['date_unary_transform'] = function(block) {
  var dropdown_operation = block.getFieldValue('operation');
  var value_m1 = Blockly.JavaScript.valueToCode(block, 'm1', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['logic_binary_transform'] = function(block) {
  var value_m1 = Blockly.JavaScript.valueToCode(block, 'm1', Blockly.JavaScript.ORDER_ATOMIC);
  var dropdown_operation = block.getFieldValue('operation');
  var value_m2 = Blockly.JavaScript.valueToCode(block, 'm2', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['logic_unary_transform'] = function(block) {
  var dropdown_operation = block.getFieldValue('operation');
  var value_m1 = Blockly.JavaScript.valueToCode(block, 'm1', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};