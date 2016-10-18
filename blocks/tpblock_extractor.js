Blockly.Blocks['field_extractor'] = {
  init: function() {
    this.appendValueInput("NAME")
      .setCheck("field_extractor")
      .appendField("get col#")
      .appendField(new Blockly.FieldTextInput("1"), "NAME")
      .appendField("as")
      .appendField(new Blockly.FieldDropdown(JSON.parse(Blockly.Tp.dataType)), "operation")
      .appendField("named as")
      .appendField(new Blockly.FieldVariable(Blockly.Tp.Counter.getNewVar()), "VAR")
      .setCheck(['Array']);
    this.setInputsInline(false);
    this.setOutput(true, "field_extractor");
    this.setColour(20);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  },
  onchange: function(e) {
    var self = this;
    if (!this.workspace || e.blockId != this.id) {
      return;
    }
    // if (e.type == 'move') {
    //   var opConn = this.outputConnection;
    //   if (opConn && opConn.targetConnection && opConn.targetConnection.sourceBlock_.type == 'delimiter') {
    //     opConn.targetConnection.sourceBlock_.appendEmptyInput();
    //   }
    // }
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

Blockly.Blocks["delimiter"] = {
  /**
   * Block for creating a list with any number of elements of any type.
   * @this Blockly.Block
   */
  init: function() {
    this.itemCount_ = 1;
    this.appendDummyInput()
      .appendField("delimiter")
      .appendField(new Blockly.FieldTextInput(""), "delim");
    this.setColour(Blockly.Blocks.lists.HUE);
    this.appendValueInput('next_marker_' + this.itemCount_);
    this.setOutput(true, 'Array');
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
  removeEmptyInput: function() {
      // debugger;
      var emptyConnections = [];
      var inputList = this.inputList;
      inputList.forEach(function(item){
          if(item.connection && !item.connection.targetConnection){
              this.removeInput(item.name);
          }

      }.bind(this));
      // for (var i = 0; i < (inputList.length-1); i++) {
      //     if(inputList[i].connection && !inputList[i].connection.targetConnection){
      //         this.removeInput(inputList[i].name);
      //     }
      // }
      
  },
  appendEmptyInput: function() {
    // loop through all lines
    for (var i = 0; i < (this.itemCount_ + 1); i++) {
      var input = this.getInput('next_marker_' + i);
      // if there is a free input with this name
      // break from loop
      if (input && !input.connection.targetBlock()) {
        return false;
      }
    }
    // If there are no empty inputs, create one
    this.appendValueInput('next_marker_' + this.itemCount_);
    this.itemCount_ += 1;
    this.mutationToDom();
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
  },

  // call abck after init
  afterInit: function() {
    // if no free inputs, create one
    // this.appendEmptyInput();
    // renderBlock('field_extractor');
  },
  validate: function() {
    if (this.getFieldValue('delim') == '') {
      this.setWarningText('field missing');
      return false;
    }
    this.setWarningText(null);
    return true;
  }
}

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
    Blockly.Tp.extractor_ = this;
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
    this.validate();
  }
};
