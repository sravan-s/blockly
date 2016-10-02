Blockly.Blocks['extractor'] = {
  init: function() {
    this.appendValueInput("line")
        .setCheck("line_extractor")
        .appendField("Extract from line");
    this.appendValueInput("file")
        .setCheck("file_name_extractor")
        .appendField("Extract from file name");
    this.setInputsInline(false);
    this.setNextStatement(true, null);
    this.setColour(20);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['line_extractor'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("extract from line")
        .appendField(new Blockly.FieldNumber(0), "get")
        .appendField("nd  token delimited by")
        .appendField(new Blockly.FieldTextInput("|"), "delim")
        .appendField("is of type")
        .appendField(new Blockly.FieldDropdown([["String", "string"], ["Date", "date"], ["Number", "number"]]), "operation")
        .appendField(" & is named as")
        .appendField(new Blockly.FieldVariable("item"), "marker");
    this.appendValueInput("next_marker")
        .setCheck("Marker");
    this.setInputsInline(false);
    this.setPreviousStatement(true, "Marker");
    this.setNextStatement(true, "Marker");
    this.setColour(20);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['file_name_extractor'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("extract from line")
        .appendField(new Blockly.FieldNumber(0), "get")
        .appendField("nd  token delimited by")
        .appendField(new Blockly.FieldTextInput("|"), "delim")
        .appendField("is of type")
        .appendField(new Blockly.FieldDropdown([["String", "string"], ["Date", "date"], ["Number", "number"]]), "operation")
        .appendField(" & is named as")
        .appendField(new Blockly.FieldVariable("item"), "marker");
    this.appendValueInput("next_marker")
        .setCheck("Marker");
    this.setInputsInline(false);
    this.setPreviousStatement(true, "Marker");
    this.setNextStatement(true, "Marker");
    this.setColour(20);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};


Blockly.Blocks['field_extractor'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("extract ")
        .appendField(new Blockly.FieldNumber(0), "get")
        .appendField("nd  token delimited by")
        .appendField(new Blockly.FieldTextInput("|"), "delim")
        .appendField("is of type")
        .appendField(new Blockly.FieldDropdown([["String", "string"], ["Date", "date"], ["Number", "number"]]), "operation")
        .appendField(" & is named as")
        .appendField(new Blockly.FieldVariable("item"), "marker");
    this.appendValueInput("next_marker")
        .setCheck("Marker");
    this.setInputsInline(false);
    this.setOutput(true, "Marker");
    this.setColour(20);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['transform'] = {
  init: function() {
    this.appendStatementInput("NAME")
        .setCheck(null);
    this.setInputsInline(false);
    this.setNextStatement(true, "store");
    this.setColour(20);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['store'] = {
  init: function() {
    this.appendStatementInput("NAME")
        .setCheck(null);
    this.setInputsInline(false);
    this.setNextStatement(false);
    this.setColour(20);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['binary_string_operator'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldVariable("item"), "m1")
        .appendField(new Blockly.FieldDropdown([["option", "OPTIONNAME"], ["option", "OPTIONNAME"], ["option", "OPTIONNAME"]]), "operator")
        .appendField(new Blockly.FieldVariable("item"), "m2")
        .appendField(" named as ")
        .appendField(new Blockly.FieldVariable("item"), "result");
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(20);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['unary_string_operator'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["option", "OPTIONNAME"], ["option", "OPTIONNAME"], ["option", "OPTIONNAME"]]), "operator")
        .appendField(new Blockly.FieldVariable("item"), "m1")
        .appendField(" named as ")
        .appendField(new Blockly.FieldVariable("item"), "result");
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(20);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};
