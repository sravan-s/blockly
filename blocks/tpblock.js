Blockly.Blocks['extractor'] = {
  init: function() {
    this.appendValueInput("line")
        .setCheck("field_extractor")
        .appendField("Extract from line");
    this.appendValueInput("file")
        .setCheck("field_extractor")
        .appendField("Extract from file name");
    this.setInputsInline(false);
    this.setNextStatement(true, "transform");
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
        .setCheck("field_extractor");
    this.setInputsInline(false);
    this.setOutput(true, "field_extractor");
    this.setColour(20);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['transform'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Translate");
    this.appendStatementInput("NAME")
        .setCheck(null);
    this.setInputsInline(false);
    this.setPreviousStatement(true, "extractor");
    this.setNextStatement(true, "store");
    this.setColour(180);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['store'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Pick storage")
        .appendField(new Blockly.FieldDropdown([["hdfs", "hdfs"], 
            ["local", "local"]]), "operation")
        .appendField("location")
        .appendField(new Blockly.FieldTextInput("default"), "path");
    this.appendValueInput("list_to_store")
        .setCheck(null);
    this.appendDummyInput()
        .appendField("Use variable names as header")
        .appendField(new Blockly.FieldCheckbox("TRUE"), "headers");
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setColour(345);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks.getTransform = function(type){
    var string_color = 345;
    var string_binary_op = [["merge", "merge"],["contains","contains"]];
    var string_binary_check = ["binary_string_transform", "unary_string_transform"];
    var string_unary_op = [["isNull", "isNull"],["length","length"]];
    var string_unary_check = ["unary_string_transform"];

    var math_color = 245;
    var math_binary_op = [["add", "add"],["contains","contains"]];
    var math_binary_check = ["binary_string_transform", "unary_string_transform"];
    var math_unary_op = [["isNull", "isNull"],["length","length"]];
    var math_unary_check = ["unary_string_transform"];

    var date_color = 145;
    var date_binary_op = [["After", "After"],["contains","contains"]];
    var date_binary_check = ["binary_string_transform", "unary_string_transform"];
    var date_unary_op = [["isNull", "isNull"],["length","length"]];
    var date_unary_check = ["unary_string_transform"];

    var logic_color = 45;
    var logic_binary_op = [["And", "And"],["contains","contains"]];
    var logic_binary_check = ["binary_string_transform", "unary_string_transform"];
    var logic_unary_op = [["isNull", "isNull"],["length","length"]];
    var logic_unary_check = ["unary_string_transform"];


    var ops;
    var check;
    var color ;

    switch(type){
        case 'string_binary':
            console.log('string_binary');
            ops = string_binary_op;
            check = string_binary_check;
            color = string_color;
        break;
        case 'string_unary':
            console.log('string_unary');
            color = string_color;
            ops = string_unary_op;
            check = string_unary_check;
        break;

        case 'math_binary':
            console.log('math_binary');
            ops = math_binary_op;
            check = math_binary_check;
            color = math_color;
        break;
        case 'math_unary':
            console.log('math_unary');
            color = math_color;
            ops = math_unary_op;
            check = math_unary_check;
        break;

        case 'date_binary':
            console.log('date_binary');
            ops = date_binary_op;
            check = date_binary_check;
            color = date_color;
        break;
        case 'date_unary':
            console.log('date_unary');
            color = date_color;
            ops = date_unary_op;
            check = date_unary_check;
        break;

        case 'logic_binary':
            console.log('logic_binary');
            ops = logic_binary_op;
            check = logic_binary_check;
            color = logic_color;
        break;
        case 'logic_unary':
            console.log('logic_unary');
            color = logic_color;
            ops = logic_unary_op;
            check = logic_unary_check;
        break;
    }
    console.log(type +":color:"+(type.indexOf('binary') === -1));
    return (type.indexOf('binary') !== -1)?
    {
         init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldVariable("item"), "m1")
            .appendField(new Blockly.FieldDropdown(ops), "operation")
            .appendField(new Blockly.FieldVariable("item"), "m2")
            .appendField(" & is named as")
            .appendField(new Blockly.FieldVariable("item"), "result");
        this.appendValueInput("child")
            .setCheck(check);
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(color);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
      }
    }
    :
    {
       init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown(ops), "operation")
            .appendField(new Blockly.FieldVariable("item"), "m1")
            .appendField(" & is named as")
            .appendField(new Blockly.FieldVariable("item"), "result");
        this.appendValueInput("child")
            .setCheck(check);
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(color);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
      }
    };
}

Blockly.Blocks['binary_string_transform'] = Blockly.Blocks.getTransform("string_binary");
Blockly.Blocks['unary_string_transform'] = Blockly.Blocks.getTransform("string_unary");
Blockly.Blocks['binary_math_transform'] = Blockly.Blocks.getTransform("math_binary");
Blockly.Blocks['unary_math_transform'] = Blockly.Blocks.getTransform("math_unary");
Blockly.Blocks['binary_date_transform'] = Blockly.Blocks.getTransform("date_binary");
Blockly.Blocks['unary_date_transform'] = Blockly.Blocks.getTransform("date_unary");
Blockly.Blocks['binary_logic_transform'] = Blockly.Blocks.getTransform("logic_binary");
Blockly.Blocks['unary_logic_transform'] = Blockly.Blocks.getTransform("logic_unary");
