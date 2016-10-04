Blockly.Msg.dataType = '[["String", "string"], ["Date", "date"], ["Number", "number"]]';
Blockly.variableDateTypeMap = {};
Blockly.variableMap = {};
Blockly.Blocks["extractor"] = {
    init: function() {
        this.appendValueInput("line")
            .setCheck("field_extractor")
            .appendField("Extract from line");
        this.appendValueInput("file")
            .setCheck("field_extractor")
            .appendField("Extract from file name");
        this.setInputsInline(false);
        this.setNextStatement("transform");
        this.setColour(20);
        this.setTooltip("");
        this.setHelpUrl("http://www.example.com/");
    }
};


Blockly.Blocks["field_extractor"] = {
    init: function() {
        this.appendDummyInput()
            .appendField("extract ")
            // .appendField(new Blockly.FieldNumber(''), "get")
            // .appendField(new Blockly.FieldVariable(''), "get")
            .appendField(new Blockly.FieldTextInput('1'), "get")
            .appendField("nd  token delimited by")
            .appendField(new Blockly.FieldTextInput(""), "delim")
            .appendField("is of type")
            .appendField(new Blockly.FieldDropdown(JSON.parse(Blockly.Msg.dataType)), "operation")
            .appendField(" & is named as")
            .appendField(new Blockly.FieldVariable(""), "marker");
        this.appendValueInput("next_marker")
            .setCheck("field_extractor");
        this.setInputsInline(false);
        this.setOutput(true, "field_extractor");
        this.setColour(20);
        this.setTooltip("");
        this.setHelpUrl("http://www.example.com/");
    },
    onchange: function() {
        if (!this.workspace) {
            return;
        }
        Blockly.variableMap[this.getFieldValue("marker")] = this.getFieldValue("operation");
        this.getFieldValue('marker');
        this.getFieldValue('operation');
    }

};

Blockly.Blocks["transform"] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Translate");
        this.appendStatementInput("NAME")
            .setCheck(null);
        this.setInputsInline(false);
        this.setPreviousStatement(true, "extractor");
        this.setNextStatement(true, "store");
        this.setColour(180);
        this.setTooltip("");
        this.setHelpUrl("http://www.example.com/");
    }
};

Blockly.Blocks["store"] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Pick storage")
            .appendField(new Blockly.FieldDropdown([
                ["hdfs", "hdfs"],
                ["local", "local"]
            ]), "operation")
            .appendField("location")
            .appendField(new Blockly.FieldTextInput(""), "path");
        this.appendValueInput("list_to_store")
            .setCheck(null);
        this.appendDummyInput()
            .appendField("Use variable names as header")
            .appendField(new Blockly.FieldCheckbox("TRUE"), "headers");
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setColour(345);
        this.setTooltip("");
        this.setHelpUrl("http://www.example.com/");
    }
};

Blockly.Blocks["unary"] = {
    OPERATIONS : {
        tpDate: {
            unary: [
                ["convertDate", "tpDate.convertDate(data1, m1, MarkerFactory, str2);"],
            ]
        },
        tpString: {
            unary: [
                ["toLowerCase", "tpString.toLowerCase(data1, m1, mf);"],
                ["toTitleCase", "tpString.toTitleCase(data1, m1, mf);"],
                ["toUpperCase", "tpString.toUpperCase(data1, m1, mf);"],
                ["isNull", "tpString.isNull(data1, m1, mf);"],
                ["length", "tpString.length(data1, m1, mf);"],
                ["rTrim", "tpString.rTrim(data1, m1, mf);"],
                ["lTrim", "tpString.lTrim(data1, m1, mf);"],
                ["trim", "tpString.trim(data1, m1, mf);"]
            ]
        },
        tpMath: {
            unary: [
                ["abs", "tpMath.abs(data1, m1, mf);"],
                ["ceil", "tpMath.ceil(data1, m1, mf);"],
                ["round", "tpMath.round(data1, integer, m1, mf);"],
                ["floor", "tpMath.floor(data1, m1, mf);"],
                ["isNumber", "tpMath.isNumber(data1, m1, mf);"],
                ["extractDecimalFractionPart", "tpMath.extractDecimalFractionPart(data1, m1, mf);"],
                ["extractDecimalIntegerPart", "tpMath.extractDecimalIntegerPart(data1, m1, mf);"],
                ["toMarker", "tpMath.toMarker(doubleVal , mf);"],
                ["toMarker", "tpMath.toMarker(long, mf);"]
            ]
        },
        tpLogic: {
            unary: [
                ["not", "tpLogic.not(bool)"]
            ]
        }
    },
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldVariable(""), "m1")
            .appendField(new Blockly.FieldDropdown([[]]), "operation")
            .appendField(" & is named as")
            .appendField(new Blockly.FieldVariable(""), "result");
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#006400");
        this.setTooltip("");
        this.setHelpUrl("http://www.example.com/");
    },
     getDropDown: function() {
        var superSet = JSON.parse(Blockly.Msg.dataType);
        var m1 = this.getFieldValue("m1");
        var dataType = Blockly.variableMap[m1];
        switch (dataType) {
            case 'string':
                return this.OPERATIONS.tpString.unary;
                break;
            case 'number':
                return this.OPERATIONS.tpMath.unary;
                break;
            case 'date':
                return this.OPERATIONS.tpDate.unary;
                break;
            default:
                return this.OPERATIONS.tpLogic.unary;

        }
    },
    onchange: function(changeEvent) {
        if (!this.workspace) {
            return;
        }
        if(changeEvent.type === "ui") {
        var m1 = this.getFieldValue("m1");
        var dataType = Blockly.variableMap[m1];
        var op = this.getFieldValue("operation");
        var options = this.getDropDown(); // The new options you want to have
        var drop = this.getField("operation");
        drop.setText(" "); // set the actual text
        drop.setValue(" "); // set the actual value
        drop.menuGenerator_ = options;
    }
    }

};

Blockly.Blocks["binary"] = {
    OPERATIONS : {
        tpDate: {
            binary: [
                ["after", "tpDate.after(data1, m1, data2, m2);"],
                ["before", "tpDate.before(data1, m1, data2, m2);"],
                ["differenceInMillis", "tpDate.differenceInMillis(data1, m1, data2, m2);"]
            ]
        },
        tpString: {
            binary: [
                ["contains", "tpString.contains(data1, m1, data2, m1, mf);"],
                ["containsIgnoreCase", "tpString.containsIgnoreCase(data1, m1, data2, m1, mf);"],
                ["endsWith", "tpString.endsWith(data1, m1, data2, m1, mf);"],
                ["endsWithIgnore", "tpString.endsWithIgnore(data1, m1, data2, m1, mf);"],
                ["extractLeading", "tpString.extractLeading(data1, m1, integer, mf);"],
                ["extractTrailing", "tpString.extractTrailing(data1, m1, integer, mf);"],
                ["indexOf", "tpString.indexOf(data1, m1, data2, m1, mf);"],
                ["indexOIgnoreCase", "tpString.indexOIgnoreCase(data1, m1, data2, m1, mf);"],
                ["merge", "tpString.merge(data1, m1, data2, m1, mf);"],
                ["startsWith", "tpString.startsWith(data1, m1, data2, m2);"]
            ]
        },
        tpMath: {
            binary: [
                ["addDouble", "tpMath.addDouble(data1, m1, data2, m1, mf);"],
                ["addLong", "tpMath.addLong(data1, m1, data2, m1, mf);"],
                ["eq", "tpMath.eq(data1, m1, data2, m1, mf);"],
                ["greaterEqThan", "tpMath.greaterEqThan(data1, m1, data2, m1, mf);"],
                ["greaterThan", "tpMath.greaterThan(data1, m1, data2, m1, mf);"],
                ["lessEqThan", "tpMath.lessEqThan(data1, m1, data2, m1, mf);"],
                ["lessThan", "tpMath.lessThan(data1, m1, data2, m1, mf);"],
                ["max", "tpMath.max(data1, m1, data2, m1, mf);"],
                ["min", "tpMath.min(data1, m1, data2, m1, mf);"],
                ["subDouble", "tpMath.subDouble(data1, m1, data2, m1, mf);"],
                ["subLong", "tpMath.subLong(data1, m1, data2, m1, mf);"]
            ]
        },
        tpLogic: {
            binary: [
                ["and", "tpLogic.and(bool, bool)"],
                ["or", "tpLogic.or(bool, bool)"]
            ]
        }
    },
    init: function() {

        this.appendDummyInput('binaryOp')
            .appendField(new Blockly.FieldVariable(""), "m1")
            .appendField(new Blockly.FieldDropdown([[]]), "operation")
            .appendField(new Blockly.FieldVariable(""), "m2")
            .appendField(" & is named as")
            .appendField(new Blockly.FieldVariable(""), "result");
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#006400");
        this.setTooltip("");
        this.setHelpUrl("http://www.example.com/");
    },

    getDropDown: function(m1) {
        var superSet = JSON.parse(Blockly.Msg.dataType);
        var dataType = Blockly.variableMap[m1];
        switch (dataType) {
            case 'string':
                return this.OPERATIONS.tpString.binary;
                break;
            case 'number':
                return this.OPERATIONS.tpMath.binary;
                break;
            case 'date':
                return this.OPERATIONS.tpDate.binary;
                break;
            default:
                return this.OPERATIONS.tpLogic.binary;

        }
    },

    
    onchange: function(changeEvent) {
        if(changeEvent.type === "ui") {
        var m1 = this.getFieldValue("m1");
        var dataType = Blockly.variableMap[m1];
        var op = this.getFieldValue("operation");
        var options = this.getDropDown(m1); // The new options you want to have
        var drop = this.getField("operation");
        drop.setText(" "); // set the actual text
        drop.setValue(" "); // set the actual value
        drop.menuGenerator_ = options;
    }
       /* if(changeEvent.type === "ui")
        if (!this.workspace) {
            return;
        }
        var m1Field = this.getFieldValue("m1");
        var binaryOp = Blockly.variableMap[m1Field] === 'string';
        if (binaryOp) {
            this.updateShape_binary(binaryOp,m1Field);
        }
    },
    updateShape_binary: function(binaryOp,m1Field) {
    var inputExists = this.getInput('binaryOp');
    if (binaryOp) {
      if (!inputExists) {
        this.appendDummyInput('binaryOp')
            .appendField(new Blockly.FieldVariable(""), "m1")
            .appendField(new Blockly.FieldDropdown(getDropDown(m1Field)), "operation")
            .appendField(" & is named as")
            .appendField(new Blockly.FieldVariable(""), "result");
        this.setInputsInline(false);
        
      }
    } else if (inputExists) {
      this.removeInput('binaryOp');
    }*/
  },

};