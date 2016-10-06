Blockly.Tp = {};
Blockly.Tp.dataType = '[["String", "string"], ["Date", "date"], ["Number", "number"]]';
Blockly.Tp.variableDateTypeMap = {};
Blockly.Tp.variableMap = {};

Blockly.Tp.pushVariableToMap = function(variable) {

};
Blockly.Tp.getVariableFromMap = function(vaiableName) {

};
Blockly.Tp.replaceVaribleInMap = function() {

}

var blockObj = function(obj) {
    obj.renameVar = function(oldName, newName) {
        if (Blockly.Names.equals(oldName, this.getFieldValue('VAR'))) {
            this.setFieldValue(newName, 'VAR');
        }
    }
    obj.getVars = function() {
        return [this.getFieldValue('VAR')];
    }

};


Blockly.Blocks["extractor"] = {
    init: function() {
        this.appendValueInput("line")
            .setCheck(['field_extractor', 'Array'])
            .appendField("Extract from line");
        this.appendValueInput("file")
            .setCheck(["field_extractor","Array"])
            .appendField("Extract from file name");
        this.setInputsInline(false);
        this.setNextStatement("transform");
        this.setColour(20);
        this.setTooltip("");
        this.setHelpUrl("http://www.example.com/");
    },
    validate: function() {
        var lines = this.getInputTargetBlock('line');
        var files = this.getInputTargetBlock('file');
        if (!lines && !files) {
            this.setWarningText('Append atleast one extraction or transformation');
            return false;
        }
        this.setWarningText(null);
        return true;
    },
    onchange: function(e) {
        console.log('ex', e);
        this.validate();
    }
};

Blockly.Blocks["field_extractor"] = {
    init: function() {
        this.appendDummyInput()
            .appendField("token delimited by")
            .appendField(new Blockly.FieldTextInput(""), "delim")
            .appendField("extract ")
            // .appendField(new Blockly.FieldNumber(''), "get")
            // .appendField(new Blockly.FieldVariable(''), "get")
            .appendField(new Blockly.FieldTextInput(''), "get")
            .appendField("nd column of type")
            .appendField(new Blockly.FieldDropdown(JSON.parse(Blockly.Tp.dataType)), "operation")
            .appendField(" & is named as")
            .appendField(new Blockly.FieldVariable(""), "VAR");
        this.appendValueInput("next_marker")
            .setCheck("field_extractor");
        this.setInputsInline(false);
        this.setOutput(true, "field_extractor");
        this.setColour(20);
        this.setTooltip("");
        this.setHelpUrl("http://www.example.com/");
        blockObj(this);
    },
    onchange: function(e) {

        if (!this.workspace || e.blockId == this.id) {
            return;
        }

        if (e.type == 'change') {
            var varType = this.getFieldValue('operation');
            var variable = this.getFieldValue('VAR');
            if (e.name == 'VAR') {
                if (variable.charAt(0) == '_') {
                    var mainWorkspace = Blockly.getMainWorkspace();
                    var newBlock = mainWorkspace.newBlock('binary');
                    newBlock.initSvg();
                    newBlock.render();
                    //  cretaebinay
                    // set deafaut as var
                    // append to translator
                } else {
                    // create varaible => deafutlt
                    // append to store
                }
                if (Blockly.Tp.variableDateTypeMap[variable]) {
                    this.setWarningText('Use unique variable names');
                    return false;
                }
                Blockly.Tp.variableDateTypeMap[e.newValue] = varType;
                if (e.oldValue) {
                    delete Blockly.Tp.variableDateTypeMap[e.oldValue];
                }
            } else if (e.name == 'operation') {
                Blockly.Tp.variableDateTypeMap[variable] = e.newValue;
            }
        }

        // Blockly.Tp.variableMap[this.getFieldValue("VAR")] = this.getFieldValue("operation");
        this.getFieldValue('VAR');
        this.getFieldValue('operation');
        this.validate();
    },

    validate: function() {
        var _isError = [];
        var number_get = this.getFieldValue('get');
        var text_delim = this.getFieldValue('delim');
        var variable_marker = this.getFieldValue('VAR');
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
    },
    validate: function() {
        var location = this.getFieldValue('path');
        if (location == '') {
            this.setWarningText('Select a location');
            return false;
        }
        this.setWarningText(null);
        return true;
    },
    onchange: function() {
        this.validate();
    }
};

Blockly.Blocks["unary"] = {
    OPERATIONS: {
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
            .appendField(new Blockly.FieldDropdown([
                []
            ]), "operation")
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
        var dataType = Blockly.Tp.variableMap[m1];
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
        if (!this.workspace || e.blockId == this.id) {
            return;
        }
        if (changeEvent.type === "ui") {
            var m1 = this.getFieldValue("m1");
            var dataType = Blockly.Tp.variableMap[m1];
            var op = this.getFieldValue("operation");
            var options = this.getDropDown(); // The new options you want to have
            var drop = this.getField("operation");
            drop.setText(" "); // set the actual text
            drop.setValue(" "); // set the actual value
            drop.menuGenerator_ = options;
        }
        this.validate();
    },
    validate: function() {
        var m1 = this.getFieldValue('m1');
        var operation = this.getFieldValue('operation');
        var result = this.getFieldValue('result');
        if (m1 == '' || operation == '' || result == '') {
            this.setWarningText('Fill all fields');
            return false;
        }
        this.setWarningText(null);
        return true;
    }

};

Blockly.Blocks['lookup'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Lookup type")
            .appendField(new Blockly.FieldDropdown([
                ["longest prefix", "lp"],
                ["key-value", "map"],
                ["Number", "number"]
            ]), "operation")
            .appendField("specify data source")
            .appendField(new Blockly.FieldTextInput("default"), "path");
        this.appendDummyInput()
            .appendField("Pick key")
            .appendField(new Blockly.FieldVariable("item"), "var_key")
            .appendField("   value called as")
            .appendField(new Blockly.FieldVariable("item"), "var_value")
            .appendField(" and is of type")
            .appendField(new Blockly.FieldDropdown(JSON.parse(Blockly.Tp.dataType)), "type");

        //.appendField(new Blockly.FieldDropdown(Blockly.Blocks.dataType), "data_type");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(345);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
        blockObj(this);
    },
    onchange: function() {
        if (!this.workspace || e.blockId == this.id) {
            return;
        }
        this.validate();
    },
    validate: function() {
        var m1 = this.getFieldValue('m1');
        var operation = this.getFieldValue('operation');
        var path = this.getFieldValue('path');
        var var_key = this.getFieldValue('var_key');
        var var_value = this.getFieldValue('var_value');
        var type = this.getFieldValue('type');
    }
};

Blockly.Blocks['output_field'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldVariable(""), "NAME");
    this.setOutput(true, null);
    this.setColour(330);
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
            .appendField(new Blockly.FieldDropdown([
                ["String", "OPTIONNAME"],
                ["Number", "OPTIONNAME"],
                ["Date", "OPTIONNAME"]
            ]), "NAME")
            .appendField("save as")
            .appendField(new Blockly.FieldTextInput("default"), "VAR");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(230);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
        blockObj(this);
    }
};

Blockly.Blocks["binary"] = {
    OPERATIONS: {
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
            .appendField(new Blockly.FieldDropdown([
                []
            ]), "operation")
            .appendField(new Blockly.FieldVariable(""), "m2")
            .appendField(" & is named as")
            .appendField(new Blockly.FieldVariable(""), "VAR");
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#006400");
        this.setTooltip("");
        this.setHelpUrl("http://www.example.com/");
        blockObj(this);
    },

    getDropDown: function(m1) {
        var superSet = JSON.parse(Blockly.Tp.dataType);
        var dataType = Blockly.Tp.variableDateTypeMap[m1];
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
        if (!this.workspace || e.blockId == this.id) {
            return;
        }
        if (changeEvent.type === "change" && changeEvent.name == 'm1') {
            var m1 = this.getFieldValue("m1");
            var dataType = Blockly.Tp.variableMap[m1];
            var op = this.getFieldValue("operation");
            var options = this.getDropDown(m1); // The new options you want to have
            var drop = this.getField("operation");
            drop.setText(" "); // set the actual text
            drop.setValue(" "); // set the actual value
            drop.menuGenerator_ = options;
        }
        this.validate();
        /* if(changeEvent.type === "ui")
        if (!this.workspace) {
            return;
        }
        var m1Field = this.getFieldValue("m1");
        var binaryOp = Blockly.Tp.variableMap[m1Field] === 'string';
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
    validate: function() {
        var m1 = this.getFieldValue('m1');
        var m2 = this.getFieldValue('m2');
        var operation = this.getFieldValue('operation');
        var result = this.getFieldValue('VAR');
        if (m1 == '' || operation == '' || result == '' || m2 == '') {
            this.setWarningText('Fill all fields');
            return false;
        }
        this.setWarningText(null);
        return true;
    }

};

Blockly.FieldVariable.dropdownCreate = function() {
    if (this.sourceBlock_ && this.sourceBlock_.workspace) {
        var variableList =
            Blockly.Variables.allVariables(this.sourceBlock_.workspace);
    } else {
        var variableList = [];
    }
    // Ensure that the currently selected variable is an option.
    var name = this.getText();
    if (name && variableList.indexOf(name) == -1) {
        variableList.push(name);
    }
    variableList.sort(goog.string.caseInsensitiveCompare);
    variableList.push(Blockly.Msg.RENAME_VARIABLE);
    variableList.push(Blockly.Msg.NEW_VARIABLE);
    if (this.name && this.name != 'VAR') {
        variableList.splice(-2, 2);
    }
    // Variables are not language-specific, use the name as both the user-facing
    // text and the internal representation.
    var options = [];
    for (var x = 0; x < variableList.length; x++) {
        options[x] = [variableList[x], variableList[x]];
    }
    return options;
};

function renderBlock(id) {
    var mainWorkspace = Blockly.getMainWorkspace();
    var newBlock = mainWorkspace.newBlock(id);
    newBlock.initSvg();
    mainWorkspace.render();
    return newBlock;
}


Blockly.WorkspaceSvg.prototype.showContextMenu_ = function(e) {
    if (this.options.readOnly || this.isFlyout) {
        return;
    }
    var menuOptions = [];
    var topBlocks = this.getTopBlocks(true);
    // Option to clean up blocks.
    var cleanOption = {};
    cleanOption.text = Blockly.Msg.CLEAN_UP;
    cleanOption.enabled = topBlocks.length > 1;
    cleanOption.callback = this.cleanUp_.bind(this);
    menuOptions.push(cleanOption);

    // Add a little animation to collapsing and expanding.
    var DELAY = 10;
    if (this.options.collapse) {
        var hasCollapsedBlocks = false;
        var hasExpandedBlocks = false;
        for (var i = 0; i < topBlocks.length; i++) {
            var block = topBlocks[i];
            while (block) {
                if (block.isCollapsed()) {
                    hasCollapsedBlocks = true;
                } else {
                    hasExpandedBlocks = true;
                }
                block = block.getNextBlock();
            }
        }

        /*
         * Option to collapse or expand top blocks
         * @param {boolean} shouldCollapse Whether a block should collapse.
         * @private
         */
        var toggleOption = function(shouldCollapse) {
            var ms = 0;
            for (var i = 0; i < topBlocks.length; i++) {
                var block = topBlocks[i];
                while (block) {
                    setTimeout(block.setCollapsed.bind(block, shouldCollapse), ms);
                    block = block.getNextBlock();
                    ms += DELAY;
                }
            }
        };

        // Option to collapse top blocks.
        var collapseOption = {
            enabled: hasExpandedBlocks
        };
        collapseOption.text = Blockly.Msg.COLLAPSE_ALL;
        collapseOption.callback = function() {
            toggleOption(true);
        };
        menuOptions.push(collapseOption);

        // Option to expand top blocks.
        var expandOption = {
            enabled: hasCollapsedBlocks
        };
        expandOption.text = Blockly.Msg.EXPAND_ALL;
        expandOption.callback = function() {
            toggleOption(false);
        };
        menuOptions.push(expandOption);
    }

    // Option to delete all blocks.
    // Count the number of blocks that are deletable.
    var deleteList = [];

    function addDeletableBlocks(block) {
        if (block.isDeletable()) {
            deleteList = deleteList.concat(block.getDescendants());
        } else {
            var children = block.getChildren();
            for (var i = 0; i < children.length; i++) {
                addDeletableBlocks(children[i]);
            }
        }
    }
    for (var i = 0; i < topBlocks.length; i++) {
        addDeletableBlocks(topBlocks[i]);
    }
    var deleteOption = {
        text: deleteList.length <= 1 ? Blockly.Msg.DELETE_BLOCK : Blockly.Msg.DELETE_X_BLOCKS.replace('%1', String(deleteList.length)),
        enabled: deleteList.length > 0,
        callback: function() {
            if (deleteList.length < 2 ||
                window.confirm(Blockly.Msg.DELETE_ALL_BLOCKS.replace('%1',
                    String(deleteList.length)))) {
                deleteNext();
            }
        }
    };


    function deleteNext() {
        var block = deleteList.shift();
        if (block) {
            if (block.workspace) {
                block.dispose(false, true);
                setTimeout(deleteNext, DELAY);
            } else {
                deleteNext();
            }
        }
    }

    function addWorkspaceOptions() {
        var obj = [{
            enabled: true,
            text: "Field Extractor",
            // callback: CreateFieldExtractor
            callback: function() {
                renderBlock('field_extractor');
            }
        }, {
            enabled: true,
            text: "Binary Operator",
            // callback: CreateBinaryOperator
            callback: function() {
                renderBlock('binary');
            }
        }, {
            enabled: true,
            text: "Unary Operator",
            // callback: CreateUnaryOperator
            callback: function() {
                renderBlock('unary');
            }
        }, {
            enabled: true,
            text: "Lookup",
            // callback: CreateLookupOperator
            callback: function() {
                renderBlock('lookup');
            }
        }, {
            enabled: true,
            text: "Add Constants",
            // callback: CreateConstants
            callback: function() {
                renderBlock('tp_constant');
            }
        }, {
            enabled: true,
            text: "Logic Control-if",
            // callback: CreateLogic
            callback: function() {
                renderBlock('controls_if');
            }
        }, {
            enabled: true,
            text: "Pipe",
            // callback: CreateLogic
            callback: function() {
                renderBlock('lists_create_with');
            }
        }, {
            enabled: true,
            text: "Variable",
            // callback: CreateLogic
            callback: function() {
                renderBlock('output_field');
            }
        }];
        obj.forEach(function(item) {
            menuOptions.push(item);
        });
    }
    addWorkspaceOptions();
    menuOptions.push(deleteOption);


    Blockly.ContextMenu.show(e, menuOptions, this.RTL);
};

Blockly.Msg.LISTS_CREATE_WITH_INPUT_WITH = 'Splitter';
