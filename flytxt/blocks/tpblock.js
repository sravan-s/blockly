Blockly.Tp = {};
Blockly.Tp.dataType = '[["String", "string"], ["Date", "date"], ["Number", "number"]]';
Blockly.Tp.variableDateTypeMap = {i:'string'};
Blockly.Tp.variableMap = {};

// Connects blocks to transform
Blockly.Tp._connectMeToTransform = function(block) {
    function _connect(child, parent) {
        if (parent.nextConnection.targetConnection) {
            _connect(child, parent.nextConnection.targetConnection.sourceBlock_);
        } else {
            bbm.attachBlock(child, parent);
        }
    }
    var _transformInput = bbm._flytxt.getInput('transform');
    if (_transformInput.connection.targetBlock()) {
        _connect(block, _transformInput.connection.targetBlock()); // Connect block to children
    } else { // No children
        block.previousConnection.connect(_transformInput.connection)
    }
}

Blockly.Tp.Counter = {
    count: 0,
    factories: [],
    getNewVar: function(type) {
        var prefix = type ? type : '__temp';
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

Blockly.Blocks["dynamic"] = {
    OPERATIONS: {
        tpDate: {
            data: [
                ["after","after"],
                ["before","before"],
                ["differenceInMillis","differenceInMillis"],
                ["convertDate","convertDate"]
            ]
        },
        tpString: {
            data: [
                ["contains","contains"],
                ["containsIgnoreCase","containsIgnoreCase"],
                ["endsWith","endsWith"],
                ["endsWithIgnore","endsWithIgnore"],
                ["extractLeading","extractLeading"],
                ["extractTrailing","extractTrailing"],
                ["indexOf","indexOf"],
                ["indexOfIgnoreCase","indexOfIgnoreCase"],
                ["merge","merge"],
                ["startsWith","startsWith"],
                ["toLowerCase","toLowerCase"],
                ["toTitleCase","toTitleCase"],
                ["toUpperCase","toUpperCase"],
                ["isNull","isNull"],
                ["length","length"],
                ["rTrim","rTrim"],
                ["lTrim","lTrim"],
                ["trim","trim"]
            ]
        },
        tpMath: {
            data: [
                ["addDouble","addDouble"],
                ["addLong","addLong"],
                ["eq","eq"],
                ["greaterEqThan","greaterEqThan"],
                ["greaterThan","greaterThan"],
                ["lessEqThan","lessEqThan"],
                ["lessThan","lessThan"],
                ["max","max"],
                ["min","min"],
                ["subDouble","subDouble"],
                ["subLong","subLong"],
                ["abs","abs"],
                ["ceil","ceil"],
                ["round","round"],
                ["floor","floor"],
                ["isNumber","isNumber"],
                ["extractDecimalFractionPart","extractDecimalFractionPart"],
                ["extractDecimalIntegerPart","extractDecimalIntegerPart"],
                ["toMarker","toMarker"],
                ["toMarker","toMarker"]
            ]
        },
        tpLogic: {
            data: [
                ["and","and"],
                ["or","or"],
                ["not","not"]
            ]
        }
    },
    init: function() {
        var _variables = bbm.getLastVariables();
        var dummyInput = new Blockly.FieldVariable(_variables[0]);
            dummyInput.setVisible(false);
        this.appendDummyInput()
            .appendField(new Blockly.FieldVariable(_variables[0]), "m1")
            .appendField(new Blockly.FieldDropdown([
                []
            ]), "operation")
            .appendField(dummyInput, "m2")
            .appendField(" & is named as")
            .appendField(new Blockly.FieldVariable(Blockly.Tp.Counter.getNewVar()), "VAR");
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#006400");
        this.setTooltip("");
        this.setHelpUrl("http://www.example.com/");
    },
    mutationToDom: function() {
        var container = document.createElement('mutation');
        container.setAttribute('operation', this.getFieldValue('operation'));
        return container;
    },

    domToMutation: function(xmlElement) {
        this.checkOperation = bbm.Consts.TEST_OPERATIONS[xmlElement.getAttribute('operation')];
        this.getOperationType(this.checkOperation);
        this.setDropdown();
    },

    setDropdown: function(dataType) {
        var _list;
        var drop = this.getField("operation");
        switch (dataType) {
            case 'string':
                _list = this.OPERATIONS.tpString.data;
                break;
            case 'number':
                _list = this.OPERATIONS.tpMath.data;
                break;
            case 'date':
                _list = this.OPERATIONS.tpDate.data;
                break;
            default:
                _list = this.OPERATIONS.tpLogic.data;
        }
        drop.menuGenerator_ = _list;
    },
    updateField: function(type){
        if(type =='binary'){
            this.getField('m2').setVisible(true)
        }else{
            this.getField('m2').setVisible(false)
        }
        this.render();
    },
    onchange: function(changeEvent) {
        this._asyncValidate();
        if (changeEvent.blockId != this.id) {
            return;
        }
        if (changeEvent.type === "change" && changeEvent.name == 'operation') {
            var drop = bbm.Consts.DYNAMIC_OPERATIONS[this.getFieldValue('operation')];
            this.getOperationType(drop);
        }
    },
    getOperationType: function(text){
        var dropType = text.split('||')[2];
            if(dropType){
                this.updateField(dropType);
            }
    },
    validate: function() {
        var m1 = this.getFieldValue('m1');
        var operation = this.getFieldValue('operation');
        var result = this.getFieldValue('VAR');
        if (m1 == '' || operation == '' || result == '' || operation == ' ' || !operation) {
            this.setWarningText('Fill all fields');
            return false;
        }
        this.setWarningText(null);
        return true;
    },
    _asyncValidate: function() {
        bbm.debounce(this.validate, 600);
    },
    afterInit: function() {
        Blockly.Tp._connectMeToTransform(this);
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
            .appendField("located @")
            .appendField(new Blockly.FieldTextInput("path"), "path");
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
        this.validate();
    },
    validate: function() {
        var m1 = this.getFieldValue('m1');
        var operation = this.getFieldValue('operation');
        var path = this.getFieldValue('path');
        var var_key = this.getFieldValue('var_key');
        var var_value = this.getFieldValue('VAR');
        var type = this.getFieldValue('type');
    },
    afterInit: function() {
        Blockly.Tp._connectMeToTransform(this);
    }
};

Blockly.Blocks['output_field'] = {
  init: function() {
    var _variables = bbm.getLastVariables();
    this.appendDummyInput()
        .appendField(new Blockly.FieldVariable(_variables[0]), "VAR")
    this.setOutput(true, 'output_field');
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
    },
    afterInit: function() {
        Blockly.Tp._connectMeToTransform(this);
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
    },
    afterInit: function() {
        Blockly.Tp._connectMeToTransform(this);
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
                bbm.renderBlock(bbm.Consts.BLOCKS.DELIMITER);
            }
        }, {
            enabled: true,
            text: "Field Extractor",
            // callback: CreateFieldExtractor
            callback: function() {
                // e is from Blockly.WorkspaceSvg.prototype.showContextMenu_
                console.log(e);
                bbm.renderBlock('field_extractor', {
                    x: e.clientX,
                    y: e.clientY
                });
            }
        }, 
        {
            enabled: true,
            text: "Dynamic Operator",
            // callback: CreateUnaryOperator
            callback: function() {
                bbm.renderBlock('dynamic');
            }
        },
         {
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
                bbm.renderBlock('controls_if', {
                    x: e.clientX,
                    y: e.clientY
                });
                bbm.renderBlock('test', {
                    x: e.clientX+10,
                    y: e.clientY
                });
            }
        }, {
            enabled: true,
            text: "Pipe",
            // callback: CreateLogic
            callback: function() {
                bbm.renderBlock('lists_create_with');
            }
        },{
            enabled: true,
            text: "event",
            // callback: CreateLogic
            callback: function() {
                bbm.renderBlock('event_field', {
                    x: e.clientX,
                    y: e.clientY
                });
            }
        },
        {
            enabled: true,
            text: "test",
            // callback: CreateLogic
            callback: function() {
                bbm.renderBlock('test', {
                    x: e.clientX,
                    y: e.clientY
                });
            }
        },
        {
            enabled: true,
            text: "ternary",
            // callback: CreateLogic
            callback: function() {
                bbm.renderBlock('ternary', {
                    x: e.clientX,
                    y: e.clientY
                });
            }
        }, {
            enabled: true,
            text: "Variable",
            // callback: CreateLogic
            callback: function() {
                bbm.renderBlock('output_field', {
                    x: e.clientX,
                    y: e.clientY
                });
            }
        },
        {
            enabled: true,
            text: "Check",
            // callback: CreateLogic
            callback: function() {
                bbm.renderBlock('lists_create_with_stream', {
                    x: e.clientX,
                    y: e.clientY
                });
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

Blockly.Blocks['event_field'] = {

  init:function(){
    var _variables = bbm.getLastVariables();
        this.appendDummyInput()

            .appendField("Subscriber")
            .appendField(new Blockly.FieldVariable(_variables[0]), "m1");
        this.appendDummyInput()
            .appendField("Circle")
            .appendField(new Blockly.FieldVariable(_variables[0]), "m2");
        this.appendDummyInput()
            .appendField("Event Data Type")
            .appendField(new Blockly.FieldDropdown([
                 ["AGG_AND_TIME", "AGG_AND_TIME"],
                 ["AGG_ONLY", "AGG_ONLY"],
                 ["TIME_ONLY", "TIME_ONLY"],
                 ["DEFAULT_STATEFULL", "DEFAULT_STATEFULL"],
                 ["STATELESS", "STATELESS"]
            ]), "dataType")
        this.appendDummyInput()
            .appendField("Event Field Type")
            .appendField(new Blockly.FieldDropdown([
                 ["SECONDS", "SECONDS"],
                 ["COUNT", "COUNT"],
                 ["AMOUNT", "AMOUNT"],
                 ["DATE", "DATE"],
                 ["NAME", "NAME"]
            ]), "fieldType")
        this.appendDummyInput()
            .appendField("Event Aggragation Type")
            .appendField(new Blockly.FieldCheckbox("TRUE"), "aggragation")
        this.appendDummyInput()
            .appendField("Statefull")
            .appendField(new Blockly.FieldCheckbox("FALSE"), "statefull")
        this.appendDummyInput()
            .appendField("Pass through")
            .appendField(new Blockly.FieldCheckbox("FALSE"), "passthrough")

        this.appendDummyInput()
            .appendField("Time")
            .appendField(new Blockly.FieldVariable(_variables[0]), "m5")
        this.appendDummyInput()
            .appendField("Event ID")
            .appendField(new Blockly.FieldTextInput(""), "m6");
            // .appendField(new Blockly.FieldVariable(_variables[0]), "m6")
        this.appendDummyInput()
            .appendField("Old Value")
            .appendField(new Blockly.FieldVariable(_variables[0]), "m3")
        this.appendDummyInput()
            .appendField("New Value")
            .appendField(new Blockly.FieldVariable(_variables[0]), "m4")
        this.appendDummyInput()
            .appendField(" & is named as eventName")
            .appendField(new Blockly.FieldVariable(Blockly.Tp.Counter.getNewVar()), "VAR");
        this.appendDummyInput()
        this.setOutput(true, "event_field");
        this.setInputsInline(false);
        this.setColour("#006400");
        this.setTooltip("");
        this.setHelpUrl("http://www.example.com/");
  },

  renameVar: function(oldName, newName) {
    if (Blockly.Names.equals(oldName, this.getFieldValue('VAR'))) {
      this.setFieldValue(newName, 'VAR');
    }
  },
  getVars: function() {
    return [this.getFieldValue('VAR')];
  },
  validate: function() {
    var _name = this.getFieldValue('NAME');
    if (_name == '' || _name == ' ') {
      this.setWarningText('field missing');
      return false;
    }
    this.setWarningText(null);
    return true;
  }
};

Blockly.Msg.LISTS_CREATE_WITH_INPUT_WITH = ' ';
