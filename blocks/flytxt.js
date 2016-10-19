Blockly.Blocks['flytxt'] = {
  init: function() {
    this.appendValueInput("lineName")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Extract from file line");
    this.appendValueInput("fileName")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Extract from file name");
    this.appendStatementInput("transform")
        .setCheck(null)
        .appendField("Apply transformation")
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendValueInput("store_stream")
        .setCheck(null)
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("to stream");
    this.appendValueInput("store_batch")
        .setCheck(null)
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("to")
        .appendField(new Blockly.FieldDropdown([ 
            ["Hdfs", "Hdfs"], 
            ["Local", "LocalFile"] 
        ]), "operation")
        // this.appendDummyInput() 
            .appendField("save headers") 
            .appendField(new Blockly.FieldCheckbox("TRUE"), "headers"); 

    this.setInputsInline(false);
    this.setColour(290);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};
