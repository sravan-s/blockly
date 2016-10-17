Blockly.Tp = {};
Blockly.Tp.dataType = '[["String", "string"], ["Date", "date"], ["Number", "number"]]';
Blockly.Tp.variableDateTypeMap = {i:'string'};
Blockly.Tp.variableMap = {};

// Connects blocks to transform
Blockly.Tp._connectMeToTransform = function(block) {
    var transformInputLists = Blockly.Tp.transform_.inputList;
    block.previousConnection.connect(transformInputLists[transformInputLists.length - 1].connection);
}

Blockly.Tp.Counter = {
    count: 0,
    factories: [],
    getNewVar: function(type) {
        var prefix = type ? type : 'var_';
        this.count++;
        return prefix + this.count;
    }
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

Blockly.Blocks['transform'] = {
    init: function() {
        this.itemCount_ = 1;
        this.appendDummyInput()
            .appendField("Translate");
        // this.appendStatementInput("NAME")
        //     .setCheck(null);
        this.appendValueInput('next_marker_' + this.itemCount_)
            .setCheck(['binary', 'unary', 'tp_controls_if']);
        this.setInputsInline(false);
        this.setPreviousStatement(true, "extractor");
        this.setNextStatement(true, "store");
        this.setColour(180);
        this.setTooltip("");
        this.setHelpUrl("http://www.example.com/");
        Blockly.Tp.transform_ = this;
    },

    mutationToDom: function() {
        var container = document.createElement('mutation');
        container.setAttribute('items', this.itemCount_);
        return container;
    },

    domToMutation: function(xmlElement) {
        this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
        this.updateShape_();
    },

    updateShape_: function() {
        // Delete everything.
        if (this.getInput('EMPTY')) {
            this.removeInput('EMPTY');
        } else {
            var i = 0;
            while (this.getInput('next_marker_' + i)) {
                this.removeInput('next_marker_' + i);
                i++;
            }
        }
        // Rebuild block.
        if (this.itemCount_ == 0) {
            this.appendValueInput('next_marker_' + i);
        } else {
            for (var i = 0; i < this.itemCount_; i++) {
                var input = this.appendValueInput('next_marker_' + i);
            }
        }
    }
};

Blockly.Blocks["store"] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Pick storage")
            .appendField(new Blockly.FieldDropdown([
                ["Hdfs", "Hdfs"],
                ["Local", "Local"]
            ]), "operation");
            // .appendDummyInput(null)
            // .appendField("location")
        //     .appendField(new Blockly.FieldTextInput(""), "path");
        this.appendDummyInput()
            .appendField("Use variable names as header")
            .appendField(new Blockly.FieldCheckbox("TRUE"), "headers");
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setColour(345);
        this.setTooltip("");
        this.setMutator(new Blockly.Mutator(['lists_create_with_item']));
        this.setHelpUrl("http://www.example.com/");
        Blockly.Tp.store_ = this;
        this.itemCount_ = 2;
        this.updateShape_();
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
    },
    decompose: function(workspace) {
        var containerBlock = workspace.newBlock('lists_create_with_container');
        containerBlock.initSvg();
        var connection = containerBlock.getInput('STACK').connection;
        for (var i = 0; i < this.itemCount_; i++) {
            var itemBlock = workspace.newBlock('lists_create_with_item');
            itemBlock.initSvg();
            connection.connect(itemBlock.previousConnection);
            connection = itemBlock.nextConnection;
        }
        return containerBlock;
    },
    mutationToDom: function() {
        var container = document.createElement('mutation');
        container.setAttribute('items', this.itemCount_);
        return container;
    },
    domToMutation: function(xmlElement) {
        this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
        this.updateShape_();
    },
    compose: function(containerBlock) {
        var itemBlock = containerBlock.getInputTargetBlock('STACK');
        // Count number of inputs.
        var connections = [];
        while (itemBlock) {
            connections.push(itemBlock.valueConnection_);
            itemBlock = itemBlock.nextConnection && itemBlock.nextConnection.targetBlock();
        }
        this.itemCount_ = connections.length;
        this.updateShape_();
        // Reconnect any child blocks.
        for (var i = 0; i < this.itemCount_; i++) {
            if (connections[i]) {
                this.getInput('ADD' + i).connection.connect(connections[i]);
            }
        }
    },
    updateShape_: function() {
        // Delete everything.
        if (this.getInput('EMPTY')) {
            this.removeInput('EMPTY');
        } else {
            var i = 0;
            while (this.getInput('ADD' + i)) {
                this.removeInput('ADD' + i);
                i++;
            }
        }
        // Rebuild block.
        if (this.itemCount_ == 0) {
            this.appendDummyInput('EMPTY')
                .appendField(Blockly.Msg.LISTS_CREATE_EMPTY_TITLE);
        } else {
            for (var i = 0; i < this.itemCount_; i++) {
                var input = this.appendValueInput('ADD' + i);
                // if (i == 0) {
                //     input.appendField(Blockly.Msg.LISTS_CREATE_WITH_INPUT_WITH);
                // }
            }
        }
    },
    appendNewVar: function(connection) {
        this.itemCount_++;
        this.updateShape_();
        this.getInput('ADD' + (this.itemCount_ - 1)).connection.connect(connection);
    }
};

Blockly.Blocks["unary"] = {
    OPERATIONS: {
        tpDate: {
            unary: [
                ["convertDate", "$1 = tpDate.convertDate(m$2.getData() == null ? data: m$2.getData(), m$2, MarkerFactory, m$3);||Marker"],
            ]
        },
        tpString: {
            unary: [
                ["toLowerCase", "$1 = tpString.toLowerCase(m$2.getData() == null ? data: m$2.getData(), m$2, mf);||Marker"],
                ["toTitleCase", "$1 = tpString.toTitleCase(m$2.getData() == null ? data: m$2.getData(), m$2, mf);||Marker"],
                ["toUpperCase", "$1 = tpString.toUpperCase(m$2.getData() == null ? data: m$2.getData(), m$2, mf);||Marker"],
                ["isNull", "$1 = tpString.isNull(m$2.getData() == null ? data: m$2.getData(), m$2, mf);||boolean"],
                ["length", "$1 = tpString.length(m$2.getData() == null ? data: m$2.getData(), m$2, mf);||Marker"],
                ["rTrim", "$1 = tpString.rTrim(m$2.getData() == null ? data: m$2.getData(), m$2, mf);||Marker"],
                ["lTrim", "$1 = tpString.lTrim(m$2.getData() == null ? data: m$2.getData(), m$2, mf);||Marker"],
                ["trim", "$1 = tpString.trim(m$2.getData() == null ? data: m$2.getData(), m$2, mf);||Marker"]
            ]
        },
        tpMath: {
            unary: [
                ["abs", "$1 =tpMath.abs(m$2.getData() == null ? data: m$2.getData(), m$2, mf);||Marker"],
                ["ceil", "$1 =tpMath.ceil(m$2.getData() == null ? data: m$2.getData(), m$2, mf);||Marker"],
                ["round", "$1 =tpMath.round(m$2.getData() == null ? data: m$2.getData(), integer, m$2, mf);||Marker"],
                ["floor", "$1 =tpMath.floor(m$2.getData() == null ? data: m$2.getData(), m$2, mf);||Marker"],
                ["isNumber", "$1 =tpMath.isNumber(m$2.getData() == null ? data: m$2.getData(), m$2, mf);||boolean"],
                ["extractDecimalFractionPart", "$1 =tpMath.extractDecimalFractionPart(m$2.getData() == null ? data: m$2.getData(), m$2, mf);||Marker"],
                ["extractDecimalIntegerPart", "$1 =tpMath.extractDecimalIntegerPart(m$2.getData() == null ? data: m$2.getData(), m$2, mf);||Marker"],
                ["toMarker", "$1 =tpMath.toMarker(m$2 , mf);||Marker"],
                ["toMarker", "$1 =tpMath.toMarker(m$2, mf);||Marker"]
            ]
        },
        tpLogic: {
            unary: [
                ["not", "$1 = tpLogic.not(m$2)||boolean"]
            ]
        }
    },
    init: function() {
        var _variables = bbm.getLastVariables();
        this.appendDummyInput()
            .appendField(new Blockly.FieldVariable(_variables[0]), "m1")
            .appendField(new Blockly.FieldDropdown([
                []
            ]), "operation")
            .appendField(" & is named as")
            .appendField(new Blockly.FieldVariable(Blockly.Tp.Counter.getNewVar()), "VAR");
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#006400");
        this.setTooltip("");
        this.setHelpUrl("http://www.example.com/");
        this.setOutput(true, "unary");
        // Blockly.Tp._connectMeToTransform(this);
    },
    setDropdown: function(dataType) {
        var _list;
        var drop = this.getField("operation");
        switch (dataType) {
            case 'string':
                _list = this.OPERATIONS.tpString.unary;
                break;
            case 'number':
                _list = this.OPERATIONS.tpMath.unary;
                break;
            case 'date':
                _list = this.OPERATIONS.tpDate.unary;
                break;
            default:
                _list = this.OPERATIONS.tpLogic.unary;
        }
        drop.menuGenerator_ = _list;
    },
    onchange: function(changeEvent) {
        if (changeEvent.blockId != this.id) {
            return;
        }
    },
    validate: function() {
        var m1 = this.getFieldValue('m1');
        var operation = this.getFieldValue('operation');
        var result = this.getFieldValue('VAR');
        if (m1 == '' || operation == '' || result == '' || operation == ' ') {
            this.setWarningText('Fill all fields');
            return false;
        }
        this.setWarningText(null);
        return true;
    }
};

Blockly.Blocks['lookup'] = {
    init: function() {
        var _variables = bbm.getLastVariables();
        var dummyInput = new Blockly.FieldTextInput(Date.now());
        dummyInput.setVisible(false);
        this.appendDummyInput()
            .appendField(dummyInput,"var")
            .appendField("Lookup type")
            .appendField(new Blockly.FieldDropdown([
                ["Search", "Search"],
                ["PrefixLookupIgnoreCase", "PrefixLookupIgnoreCase"],
                ["PrefixLookup", "PrefixLookup"],
                ["MatchKey", "MatchKey"]
            ]), "operation")
            .appendField("specify data source")
            .appendField(new Blockly.FieldTextInput("default"), "path");
        this.appendDummyInput()
            .appendField("Pick key")
            .appendField(new Blockly.FieldVariable(_variables[0]), "var_key")
            .appendField("   value called as")
            .appendField(new Blockly.FieldVariable(Blockly.Tp.Counter.getNewVar()), "VAR")
            .appendField(" and is of type")
            .appendField(new Blockly.FieldDropdown(JSON.parse(Blockly.Tp.dataType)), "operation");

        //.appendField(new Blockly.FieldDropdown(Blockly.Blocks.dataType), "data_type");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(345);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
        blockObj(this);
    },
    onchange: function(e) {
        if (!this.workspace || e.blockId != this.id) {
            return;
        }
        if(e.type=='create'){
            // var drop = this.getField("VAR");
            // var options = [];
            // drop.setText(" "); // set the actual text
            // drop.setValue(" "); // set the actual value
            // options.push(Blockly.Msg.NEW_VARIABLE);
            // drop.menuGenerator_ = [options];
        }
        this.validate();
    },
    validate: function() {
        var m1 = this.getFieldValue('m1');
        var operation = this.getFieldValue('operation');
        var path = this.getFieldValue('path');
        var var_key = this.getFieldValue('var_key');
        var var_value = this.getFieldValue('VAR');
        var type = this.getFieldValue('type');
    }
};

Blockly.Blocks['output_field'] = {
  init: function() {
    var _variables = bbm.getLastVariables();
    this.appendDummyInput()
        .appendField(new Blockly.FieldVariable(_variables[0]), "VAR");
    this.setOutput(true, null);
    this.setColour(330);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  },
};

Blockly.Blocks['tp_constant'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Define ")
            .appendField(new Blockly.FieldTextInput("default"), "value")
            .appendField("as")
            .appendField(new Blockly.FieldDropdown([
                ["String", "string"],
                ["Number", "number"],
                ["Date", "date"]
            ]), "operation")
            .appendField("save as")
            .appendField(new Blockly.FieldTextInput("default"), "VAR");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(230);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
        blockObj(this);
        // connects automatically to translate
        // Blockly.Tp._connectMeToTransform(this);
    },
    onchange: function(changeEvent) {
        if (!this.workspace || changeEvent.blockId != this.id) {
            return;
        }
        var _var = this.getFieldValue('VAR');
        var _type = this.getFieldValue('NAME');
        // Change type is change
        if (changeEvent.type == 'change') {
            // If rename => delete previous entry
            if (changeEvent.name == 'VAR') {
                // Duplicate entry
                if (Blockly.Tp.variableDateTypeMap[_var]) {
                    this.setWarningText('Duplicate variable name');
                    return false;
                } else {
                    // delte old entry
                    delete Blockly.Tp.variableDateTypeMap[changeEvent.oldValue];
                }
            }
            // set new values
            Blockly.Tp.variableDateTypeMap[_var] = _type;
            this.setWarningText(null);
        }
    }
};

Blockly.Blocks["binary"] = {
    OPERATIONS: {
        tpDate: {
            binary: [
                ["after", "$1 = tpDate.after(m$2.getData() == null ? data: m$2.getData(), m$2, m$3.getData() == null ? data: m$3.getData(), m$3);||boolean"],
                ["before", "$1 = tpDate.before(m$2.getData() == null ? data: m$2.getData(), m$2, m$3.getData() == null ? data: m$3.getData(), m$3);||boolean"],
                ["differenceInMillis", "$1 = tpDate.differenceInMillis(m$2.getData() == null ? data: m$2.getData(), m$2, m$3.getData() == null ? data: m$3.getData(), m$3);||Marker"]
            ]
        },
        tpString: {
            binary: [
                ["contains", "$1 = tpString.contains(m$2.getData() == null ? data: m$2.getData(), m$2, m$3.getData() == null ? data: m$3.getData(), m$3, mf);||boolean"],
                ["containsIgnoreCase", "$1 = tpString.containsIgnoreCase(m$2.getData() == null ? data: m$2.getData(), m$2, m$3.getData() == null ? data: m$3.getData(), m$3, mf);||boolean"],
                ["endsWith", "$1 = tpString.endsWith(m$2.getData() == null ? data: m$2.getData(), m$2, m$3.getData() == null ? data: m$3.getData(), m$3, mf);||boolean"],
                ["endsWithIgnore", "$1 = tpString.endsWithIgnore(m$2.getData() == null ? data: m$2.getData(), m$2, m$3.getData() == null ? data: m$3.getData(), m$3, mf);||boolean"],
                ["extractLeading", "$1 = tpString.extractLeading(m$2.getData() == null ? data: m$2.getData(), $1, integer, mf);||Marker"],
                ["extractTrailing", "$1 = tpString.extractTrailing(m$2.getData() == null ? data: m$2.getData(), $1, integer, mf);||Marker"],
                ["indexOf", "$1 = tpString.indexOf(m$2.getData() == null ? data: m$2.getData(), m$2, m$3.getData() == null ? data: m$3.getData(), m$3, mf);||Marker"],
                ["indexOIgnoreCase", "$1 = tpString.indexOIgnoreCase(m$2.getData() == null ? data: m$2.getData(), m$2, m$3.getData() == null ? data: m$3.getData(), m$3, mf);||Marker"],
                ["merge", "$1 = tpString.merge(m$2.getData() == null ? data: m$2.getData(), m$2, m$3.getData() == null ? data: m$3.getData(), m$3, mf);||Marker"],
                ["startsWith", "$1 = tpString.startsWith(m$2.getData() == null ? data: m$2.getData(), m$2, m$3.getData() == null ? data: m$3.getData(), m$3);||boolean"]
            ]
        },
        tpMath: {
            binary: [
                ["addDouble", "$1 = tpMath.addDouble(m$2.getData() == null ? data: m$2.getData(), m$2, m$3.getData() == null ? data: m$3.getData(), m$3, mf);||Marker"],
                ["addLong", "$1 = tpMath.addLong(m$2.getData() == null ? data: m$2.getData(), m$2, m$3.getData() == null ? data: m$3.getData(), m$3, mf);||Marker"],
                ["eq", "$1 = tpMath.eq(m$2.getData() == null ? data: m$2.getData(), m$2, m$3.getData() == null ? data: m$3.getData(), m$3, mf);||boolean"],
                ["greaterEqThan", "$1 = tpMath.greaterEqThan(m$2.getData() == null ? data: m$2.getData(), m$2, m$3.getData() == null ? data: m$3.getData(), m$3, mf);||boolean"],
                ["greaterThan", "$1 = tpMath.greaterThan(m$2.getData() == null ? data: m$2.getData(), m$2, m$3.getData() == null ? data: m$3.getData(), m$3, mf);||boolean"],
                ["lessEqThan", "$1 = tpMath.lessEqThan(m$2.getData() == null ? data: m$2.getData(), m$2, m$3.getData() == null ? data: m$3.getData(), m$3, mf);||boolean"],
                ["lessThan", "$1 = tpMath.lessThan(m$2.getData() == null ? data: m$2.getData(), m$2, m$3.getData() == null ? data: m$3.getData(), m$3, mf);||boolean"],
                ["max", "$1 = tpMath.max(m$2.getData() == null ? data: m$2.getData(), m$2, m$3.getData() == null ? data: m$3.getData(), m$3, mf);||Marker"],
                ["min", "$1 = tpMath.min(m$2.getData() == null ? data: m$2.getData(), m$2, m$3.getData() == null ? data: m$3.getData(), m$3, mf);||Marker"],
                ["subDouble", "$1 = tpMath.subDouble(m$2.getData() == null ? data: m$2.getData(), m$2, m$3.getData() == null ? data: m$3.getData(), m$3, mf);||Marker"],
                ["subLong", "$1 = tpMath.subLong(m$2.getData() == null ? data: m$2.getData(), m$2, m$3.getData() == null ? data: m$3.getData(), m$3, mf);||Marker"]
            ]
        },
        tpLogic: {
            binary: [
                ["and", "$1 = tpLogic.and(m$2, m$3);||Marker"],
                ["or", "$1 = tpLogic.or(m$2, m$3);||Marker"]
            ]
        }
    },
    init: function() {
        var _variables = bbm.getLastVariables();
        this.appendDummyInput('binaryOp')
            .appendField(new Blockly.FieldVariable(_variables[0]), "m1")
            .appendField(new Blockly.FieldDropdown([
                []
            ]), "operation")
            .appendField(new Blockly.FieldVariable(_variables[1]), "m2")
            .appendField(" & is named as")
            .appendField(new Blockly.FieldVariable(Blockly.Tp.Counter.getNewVar()), "VAR");
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#006400");
        this.setTooltip("");
        this.setHelpUrl("http://www.example.com/");
        blockObj(this);
        this.setOutput(true, "binary");
        // Blockly.Tp._connectMeToTransform(this);
    },

    setDropdown: function(type) {
        var _list;
        switch (type) {
            case 'string':
                _list = this.OPERATIONS.tpString.binary;
                break;
            case 'number':
                _list = this.OPERATIONS.tpMath.binary;
                break;
            case 'date':
                _list = this.OPERATIONS.tpDate.binary;
                break;
            default:
                _list = this.OPERATIONS.tpLogic.binary;
        }
        var drop = this.getField("operation");
        drop.menuGenerator_ = _list;
    },

    onchange: function(changeEvent) {
        if (!this.workspace || changeEvent.blockId != this.id) {
            return;
        }
        if (changeEvent.type === "change" && changeEvent.name == 'm1') {
        }
        // this.validate();
    },

    validate: function() {
        var m1 = this.getFieldValue('m1');
        var m2 = this.getFieldValue('m2');
        var operation = this.getFieldValue('operation');
        var result = this.getFieldValue('VAR');
        if (m1 == '' || operation == ' ' || result == '' || m2 == '' || operation == '') {
            this.setWarningText('Fill all fields');
            return false;
        }
        this.setWarningText(null);
        return true;
    }
};

Blockly.Blocks['tp_date_format'] = {
   init: function() {
       this.appendDummyInput()
           .appendField('Date, ')
           .appendField('', 'VAR')
           .appendField('is formatted as')
           .appendField(new Blockly.FieldTextInput('dd-mm-yyyy'), 'dateFormat');
       this.setPreviousStatement(true);
       this.setNextStatement(true);
       this.setColour(230);
       this.setTooltip('');
       this.setHelpUrl('http://www.example.com/');
       blockObj(this);
       // connects automatically to translate
   }
};

Blockly.Blocks['tp_controls_if'] = {
  /**
   * Block for if/elseif/else condition.
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl(Blockly.Msg.CONTROLS_IF_HELPURL);
    this.setColour(Blockly.Blocks.logic.HUE);
    this.appendValueInput('IF0')
        .setCheck('Boolean')
        .appendField(Blockly.Msg.CONTROLS_IF_MSG_IF);
    this.appendStatementInput('DO0')
        .appendField(Blockly.Msg.CONTROLS_IF_MSG_THEN);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setMutator(new Blockly.Mutator(['controls_if_elseif',
                                         'controls_if_else']));
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function() {
      if (!thisBlock.elseifCount_ && !thisBlock.elseCount_) {
        return Blockly.Msg.CONTROLS_IF_TOOLTIP_1;
      } else if (!thisBlock.elseifCount_ && thisBlock.elseCount_) {
        return Blockly.Msg.CONTROLS_IF_TOOLTIP_2;
      } else if (thisBlock.elseifCount_ && !thisBlock.elseCount_) {
        return Blockly.Msg.CONTROLS_IF_TOOLTIP_3;
      } else if (thisBlock.elseifCount_ && thisBlock.elseCount_) {
        return Blockly.Msg.CONTROLS_IF_TOOLTIP_4;
      }
      return '';
    });
    this.elseifCount_ = 0;
    this.elseCount_ = 0;
    this.setOutput(true, "tp_controls_if");
  },
  /**
   * Create XML to represent the number of else-if and else inputs.
   * @return {Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function() {
    if (!this.elseifCount_ && !this.elseCount_) {
      return null;
    }
    var container = document.createElement('mutation');
    if (this.elseifCount_) {
      container.setAttribute('elseif', this.elseifCount_);
    }
    if (this.elseCount_) {
      container.setAttribute('else', 1);
    }
    return container;
  },
  /**
   * Parse XML to restore the else-if and else inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function(xmlElement) {
    this.elseifCount_ = parseInt(xmlElement.getAttribute('elseif'), 10) || 0;
    this.elseCount_ = parseInt(xmlElement.getAttribute('else'), 10) || 0;
    this.updateShape_();
  },
  /**
   * Populate the mutator's dialog with this block's components.
   * @param {!Blockly.Workspace} workspace Mutator's workspace.
   * @return {!Blockly.Block} Root block in mutator.
   * @this Blockly.Block
   */
  decompose: function(workspace) {
    var containerBlock = workspace.newBlock('controls_if_if');
    containerBlock.initSvg();
    var connection = containerBlock.nextConnection;
    for (var i = 1; i <= this.elseifCount_; i++) {
      var elseifBlock = workspace.newBlock('controls_if_elseif');
      elseifBlock.initSvg();
      connection.connect(elseifBlock.previousConnection);
      connection = elseifBlock.nextConnection;
    }
    if (this.elseCount_) {
      var elseBlock = workspace.newBlock('controls_if_else');
      elseBlock.initSvg();
      connection.connect(elseBlock.previousConnection);
    }
    return containerBlock;
  },
  /**
   * Reconfigure this block based on the mutator dialog's components.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  compose: function(containerBlock) {
    var clauseBlock = containerBlock.nextConnection.targetBlock();
    // Count number of inputs.
    this.elseifCount_ = 0;
    this.elseCount_ = 0;
    var valueConnections = [null];
    var statementConnections = [null];
    var elseStatementConnection = null;
    while (clauseBlock) {
      switch (clauseBlock.type) {
        case 'controls_if_elseif':
          this.elseifCount_++;
          valueConnections.push(clauseBlock.valueConnection_);
          statementConnections.push(clauseBlock.statementConnection_);
          break;
        case 'controls_if_else':
          this.elseCount_++;
          elseStatementConnection = clauseBlock.statementConnection_;
          break;
        default:
          throw 'Unknown block type.';
      }
      clauseBlock = clauseBlock.nextConnection &&
          clauseBlock.nextConnection.targetBlock();
    }
    this.updateShape_();
    // Reconnect any child blocks.
    for (var i = 1; i <= this.elseifCount_; i++) {
      Blockly.Mutator.reconnect(valueConnections[i], this, 'IF' + i);
      Blockly.Mutator.reconnect(statementConnections[i], this, 'DO' + i);
    }
    Blockly.Mutator.reconnect(elseStatementConnection, this, 'ELSE');
  },
  /**
   * Store pointers to any connected child blocks.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  saveConnections: function(containerBlock) {
    var clauseBlock = containerBlock.nextConnection.targetBlock();
    var i = 1;
    while (clauseBlock) {
      switch (clauseBlock.type) {
        case 'controls_if_elseif':
          var inputIf = this.getInput('IF' + i);
          var inputDo = this.getInput('DO' + i);
          clauseBlock.valueConnection_ =
              inputIf && inputIf.connection.targetConnection;
          clauseBlock.statementConnection_ =
              inputDo && inputDo.connection.targetConnection;
          i++;
          break;
        case 'controls_if_else':
          var inputDo = this.getInput('ELSE');
          clauseBlock.statementConnection_ =
              inputDo && inputDo.connection.targetConnection;
          break;
        default:
          throw 'Unknown block type.';
      }
      clauseBlock = clauseBlock.nextConnection &&
          clauseBlock.nextConnection.targetBlock();
    }
  },
  /**
   * Modify this block to have the correct number of inputs.
   * @private
   * @this Blockly.Block
   */
  updateShape_: function() {
    // Delete everything.
    if (this.getInput('ELSE')) {
      this.removeInput('ELSE');
    }
    var i = 1;
    while (this.getInput('IF' + i)) {
      this.removeInput('IF' + i);
      this.removeInput('DO' + i);
      i++;
    }
    // Rebuild block.
    for (var i = 1; i <= this.elseifCount_; i++) {
      this.appendValueInput('IF' + i)
          .setCheck('Boolean')
          .appendField(Blockly.Msg.CONTROLS_IF_MSG_ELSEIF);
      this.appendStatementInput('DO' + i)
          .appendField(Blockly.Msg.CONTROLS_IF_MSG_THEN);
    }
    if (this.elseCount_) {
      this.appendStatementInput('ELSE')
          .appendField(Blockly.Msg.CONTROLS_IF_MSG_ELSE);
    }
  }
};

// Overrides currrent context menu
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
    cleanOption.callback = this.cleanUp;
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
            text: "Delimiter",
            // callback: CreateFieldExtractor
            callback: function() {
                bbm.renderBlock('delimiter');
            }
        }, {
            enabled: true,
            text: "Field Extractor",
            // callback: CreateFieldExtractor
            callback: function() {
                bbm.renderBlock('field_extractor');
            }
        }, {
            enabled: true,
            text: "Binary Operator",
            // callback: CreateBinaryOperator
            callback: function() {
                bbm.renderBlock('binary');
            }
        }, {
            enabled: true,
            text: "Unary Operator",
            // callback: CreateUnaryOperator
            callback: function() {
                bbm.renderBlock('unary');
            }
        }, {
            enabled: true,
            text: "Lookup",
            // callback: CreateLookupOperator
            callback: function() {
                bbm.renderBlock('lookup');
            }
        }, {
            enabled: true,
            text: "Add Constants",
            // callback: CreateConstants
            callback: function() {
                bbm.renderBlock('tp_constant');
            }
        }, {
            enabled: true,
            text: "Logic Control-if",
            // callback: CreateLogic
            callback: function() {
                bbm.renderBlock('tp_controls_if');
            }
        }, {
            enabled: true,
            text: "Pipe",
            // callback: CreateLogic
            callback: function() {
                bbm.renderBlock('lists_create_with');
            }
        }, {
            enabled: true,
            text: "Variable",
            // callback: CreateLogic
            callback: function() {
                bbm.renderBlock('output_field');
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
