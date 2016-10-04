Blockly.Tp = {};
Blockly.Tp.dataType = '[["String", "string"], ["Date", "date"], ["Number", "number"]]';
Blockly.Tp.variableDateTypeMap = {};
Blockly.variableMap = {};

Blockly.Tp.replaceVaribleInMap = function(oldVar, newVar) {

}

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
            .appendField(new Blockly.FieldTextInput(''), "get")
            .appendField("nd  token delimited by")
            .appendField(new Blockly.FieldTextInput(""), "delim")
            .appendField("is of type")
            .appendField(new Blockly.FieldDropdown(JSON.parse(Blockly.Tp.dataType)), "operation")
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
    onchange: function(e) {
        if (!this.workspace) {
            return;
        }
        if (e.type == 'change') {
            var varType = this.getFieldValue('operation');
            var variable = this.getFieldValue('marker');
            if (e.name == 'marker') {
                Blockly.Tp.variableDateTypeMap[e.newValue] = varType;
                if (e.oldValue) {
                    delete Blockly.Tp.variableDateTypeMap[e.oldValue];
                }
            } else if (e.name == 'operation') {
                Blockly.Tp.variableDateTypeMap[variable] = e.newValue;
            }
        }
        Blockly.variableMap[this.getFieldValue("marker")] = this.getFieldValue("operation");
        this.validate();
    },
    validate: function() {
        var _isError = [];
        var number_get = this.getFieldValue('get');
        var text_delim = this.getFieldValue('delim');
        var variable_marker = this.getFieldValue('marker');
        if (number_get == '') {
            _isError.push('Give a token ordinal');
        } else {
            number_get = +number_get;
            if (!Number.isInteger(number_get)) {
                _isError.push('Token ordinal should be a number');
            }
        }
        if (text_delim == '') {
            _isError.push('Text delimiter missing');
        }
        if (variable_marker.charAt(0) == 'f') {
            _isError.push('Variable names cannot be "f"');
        }
        if (_isError.length) {
            this.setWarningText(_isError.join('\n'));
            return false;
        } else {
            this.setWarningText(null);
            return true;
        }
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
                ["convertDate", "$1 = tpDate.convertDate(data1, $2, MarkerFactory, $3);"],
            ]
        },
        tpString: {
            unary: [
                ["toLowerCase", "$1 = tpString.toLowerCase(data1, $2, mf);"],
                ["toTitleCase", "$1 = tpString.toTitleCase(data1, $2, mf);"],
                ["toUpperCase", "$1 = tpString.toUpperCase(data1, $2, mf);"],
                ["isNull", "$1 = tpString.isNull(data1, $2, mf);"],
                ["length", "$1 = tpString.length(data1, $2, mf);"],
                ["rTrim", "$1 = tpString.rTrim(data1, $2, mf);"],
                ["lTrim", "$1 = tpString.lTrim(data1, $2, mf);"],
                ["trim", "$1 = tpString.trim(data1, $2, mf);"]
            ]
        },
        tpMath: {
            unary: [
                ["abs", "$1 =tpMath.abs(data1, $2, mf);"],
                ["ceil", "$1 =tpMath.ceil(data1, $2, mf);"],
                ["round", "$1 =tpMath.round(data1, integer, $2, mf);"],
                ["floor", "$1 =tpMath.floor(data1, $2, mf);"],
                ["isNumber", "$1 =tpMath.isNumber(data1, $2, mf);"],
                ["extractDecimalFractionPart", "$1 =tpMath.extractDecimalFractionPart(data1, $2, mf);"],
                ["extractDecimalIntegerPart", "$1 =tpMath.extractDecimalIntegerPart(data1, $2, mf);"],
                ["toMarker", "$1 =tpMath.toMarker($2 , mf);"],
                ["toMarker", "$1 =tpMath.toMarker($2, mf);"]
            ]
        },
        tpLogic: {
            unary: [
                ["not", "$1 = tpLogic.not($2)"]
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
        var superSet = JSON.parse(Blockly.Tp.dataType);
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

Blockly.Blocks['lookup'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Lookup type")
        .appendField(new Blockly.FieldDropdown([
            ["longest prefix", "lp"],
            ["key-value", "map"],
            ["Number", "number"]]), "operation")
        .appendField("specify data source")
        .appendField(new Blockly.FieldTextInput("default"), "path");
    this.appendDummyInput()
        .appendField("Pick key")
        .appendField(new Blockly.FieldVariable("item"), "var_key")
        .appendField("   value called as")
        .appendField(new Blockly.FieldVariable("item"), "var_value")
        .appendField(" and is of type")
        .appendField(new Blockly.FieldVariable(""), "result");

        //.appendField(new Blockly.FieldDropdown(Blockly.Blocks.dataType), "data_type");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(345);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['tp_constant'] = {       
  init: function() {
    this.appendDummyInput()
        .appendField("Define ")
        .appendField(new Blockly.FieldTextInput("default"), "constant")
        .appendField("as")
        .appendField(new Blockly.FieldDropdown([["String", "OPTIONNAME"], ["Number", "OPTIONNAME"], ["Date", "OPTIONNAME"]]), "NAME")
        .appendField("save as")
        .appendField(new Blockly.FieldTextInput("default"), "constant-name");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks["binary"] = {
    OPERATIONS : {
        tpDate: {
            binary: [
                ["after", "$1 = tpDate.after(data1, $2, data2, $3);"],
                ["before", "$1 = tpDate.before(data1, $2, data2, $3);"],
                ["differenceInMillis", "$1 = tpDate.differenceInMillis(data1, $2, data2, $3);"]
            ]
        },
        tpString: {
            binary: [
                ["contains", "$1 = tpString.contains(data1, $2, data2, $3, mf);"],
                ["containsIgnoreCase", "$1 = tpString.containsIgnoreCase(data1, $2, data2, $3, mf);"],
                ["endsWith", "$1 = tpString.endsWith(data1, $2, data2, $3, mf);"],
                ["endsWithIgnore", "$1 = tpString.endsWithIgnore(data1, $2, data2, $3, mf);"],
                ["extractLeading", "$1 = tpString.extractLeading(data1, $1, integer, mf);"],
                ["extractTrailing", "$1 = tpString.extractTrailing(data1, $1, integer, mf);"],
                ["indexOf", "$1 = tpString.indexOf(data1, $2, data2, $3, mf);"],
                ["indexOIgnoreCase", "$1 = tpString.indexOIgnoreCase(data1, $2, data2, $3, mf);"],
                ["merge", "$1 = tpString.merge(data1, $2, data2, $3, mf);"],
                ["startsWith", "$1 = tpString.startsWith(data1, $2, data2, $3);"]
            ]
        },
        tpMath: {
            binary: [
                ["addDouble", "$1 = tpMath.addDouble(data1, $2, data2, $3, mf);"],
                ["addLong", "$1 = tpMath.addLong(data1, $2, data2, $3, mf);"],
                ["eq", "$1 = tpMath.eq(data1, $2, data2, $3, mf);"],
                ["greaterEqThan", "$1 = tpMath.greaterEqThan(data1, $2, data2, $3, mf);"],
                ["greaterThan", "$1 = tpMath.greaterThan(data1, $2, data2, $3, mf);"],
                ["lessEqThan", "$1 = tpMath.lessEqThan(data1, $2, data2, $3, mf);"],
                ["lessThan", "$1 = tpMath.lessThan(data1, $2, data2, $3, mf);"],
                ["max", "$1 = tpMath.max(data1, $2, data2, $3, mf);"],
                ["min", "$1 = tpMath.min(data1, $2, data2, $3, mf);"],
                ["subDouble", "$1 = tpMath.subDouble(data1, $2, data2, $3, mf);"],
                ["subLong", "$1 = tpMath.subLong(data1, $2, data2, $3, mf);"]
            ]
        },
        tpLogic: {
            binary: [
                ["and", "$1 = tpLogic.and($2, $3)"],
                ["or", "$1 = tpLogic.or($2, $3)"]
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
        var superSet = JSON.parse(Blockly.Tp.dataType);
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