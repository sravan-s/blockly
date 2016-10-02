Blockly.Blocks['line_extractor'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("From line extract")
        .appendField(new Blockly.FieldTextInput("1"), "get")
        .appendField("nd, element delimited by")
        .appendField(new Blockly.FieldTextInput("|"), "delim");
    this.appendDummyInput()
        .appendField("and is of type")
        .appendField(new Blockly.FieldDropdown([
            ["String", "string"],
            ["Date", "date"],
            ["Number", "number"],
            ["Double", "double"]]), "data_type");
    this.appendStatementInput("NAME")
        .setCheck("Marker");
    this.setInputsInline(true);
    this.setOutput(true, "Marker");
    this.setColour(120);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['file_name_extractor'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("From file name extract")
        .appendField(new Blockly.FieldTextInput("1"), "get")
        .appendField("nd, element delimited by")
        .appendField(new Blockly.FieldTextInput("|"), "delim");
    this.appendDummyInput()
        .appendField("and is of type")
        .appendField(new Blockly.FieldDropdown([
            ["String", "string"],
            ["Date", "date"],
            ["Number", "number"],
            ["Double", "double"]]), "data_type");
    this.appendStatementInput("NAME")
        .setCheck("Marker");
    this.setInputsInline(true);
    this.setOutput(true, "Marker");
    this.setColour(180);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['field_extractor'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("from token above extract")
        .appendField(new Blockly.FieldTextInput("1"), "get")
        .appendField("nd, element delimited by")
        .appendField(new Blockly.FieldTextInput("|"), "delim");
    this.appendDummyInput()
        .appendField("and is of type")
        .appendField(new Blockly.FieldDropdown([
            ["String", "string"],
            ["Date", "date"],
            ["Number", "number"],
            ["Double", "double"]]), "data_type");
    this.appendStatementInput("NAME")
        .setCheck("Marker")
        .setAlign(Blockly.ALIGN_RIGHT);
    this.setInputsInline(true);
    this.setPreviousStatement(true, "Marker");
    this.setColour(135);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};