// Experimental, to safe push array
Array.prototype.$$safePush$$ = function(value) {
    if (this.indexOf(value) == -1) {
        this.push(value);
        return true;
    }
    return false;
}

Blockly.Blocks.Manager = {
    datatype: '[["String", "string"], ["Date", "date"], ["Number", "number"]]',
    workspaceContainer: {},
    init: function() {
        // To add existing workspace to allBlocks
        var _blocks = this.ws.getAllBlocks();
        _blocks.forEach(function(block) {
            // main blocks
            if (block.type == 'extractor' || block.type == 'store' || block.type == 'transform') {
                this.allBlocks.addNode(block, block.id);
            } else {
                this.allBlocks.addNode(block, block.id, block.getFieldValue('operation'), block.getFieldValue('VAR'), block.getParent());
            }
        }.bind(this));
    },
    ws: {},
    changeListeners: [],
    allBlocks: {
        root: {
            children: []
        },
        delNode: function(id) {
            var me = this;
            var node = this.root[id];
            if (!node) {
                return;
            }
            delete this.root[id];
            // deletes from all nodes
            this.traverseNodes(function(ds) {
                if (ds.children.indexOf(node.id) != -1) {
                    ds.children.splice(ds.children.indexOf(node.id), 1);
                }
            });
            // deletes from root
            this.root.children.some(function(child, index) {
                if (child == id) {
                    this.root.children.splice(index, 1);
                    return true;
                }
            }.bind(this));
            // cleanup root
            for (var key in this.root) {
                if (key != 'children') {
                    if (!bbm.ws.getBlockById(key)) {
                        delete this.root[key];
                        this.traverseNodes(function(ds) {
                            if (ds.children.indexOf(key) != -1) {
                                ds.children.splice(ds.children.indexOf(key), 1);
                            }
                        });
                        // to remove any unknown dependencies
                    }
                }
            }
            return this.root;
        },
        dettachChild: function(child, parent) {
            this.root[parent.id].children.splice(child.id, 1);
            this.root[child.id].parent = null;
        },
        addNode: function(obj, id, dataType, variableName, parent) {
            if (parent === undefined) {
                this.root.children.$$safePush$$(id);
                // if (this.root.children.indexOf(id) == -1) {
                //     this.root.children.push(id);
                // }
            } else {
                this.root[parent.id].children.push(id);
            }
            this.root[id] = {
                'id': id,
                'obj': obj,
                'dataType': dataType,
                'variableName': variableName,
                'parent': [parent], // since we are taking semantic realtion bwtween nodes
                // a block could have mutiple parents
                'children': []
            };
            return this.root[id];
        },
        getParent: function(child) {
            return this.root[child.id].parent;
        },
        changeDatatype: function(id, olddatatype, newdatatype) {
            if (oldtype === newtype) return;
            if (this.root[id].datatype === olddatatype) {
                this.root[id].datatype = newdatatype;
            }
            this.children.forEach(function(child) {
                if (this.root[child]) {
                    this.root[child].obj.setWarningText('Parent variable changed');
                }
            }.bind(this));
            return this.root[id].children;
        },
        variableNameChange: function(id, oldName, newName) {
            if (oldName === newName) return;
            if (this.root[id].variableName === oldName) {
                this.root[id].variableName = newName;
            }
            return this.root[id].children;
        },
        getSupportedOperands: function(dataType) {
            var result = [];
            var key;
            if (!dataType) {
                for (key in this.root) {
                    try {
                        result.push(this.root[key].id);
                    } catch (e) {}
                }
            } else {
                for (key in this.root) {
                    try {
                        if (this.root[key].dataType === dataType) {
                            result.push(this.root[key].id);
                        }
                    } catch (e) {}
                }
            }
            return result;
        },
        attachChild: function(child, parent) {
            if (!parent.children || parent.children.length == undefined) {
                parent.children = [];
            } else if (parent.children.indexOf(child.id) != -1) { // to handle reattaching to same parent
                return parent;
            }
            parent.children.push(child.id);
            return parent;
        },
        // traverses all nodes and execute given callback on each
        traverseNodes: function(cb) {
            var _dataStore = this.root;
            for (var _key in _dataStore) {
                if (_key != 'children') {
                    cb.call(this, _dataStore[_key]);
                }
            }
        }
    },
    changeListener: function(event) {
        var me = this;
        if (event.internal !== undefined) {
            //ignore
            return;
        }

        var block = this.ws.getBlockById(event.blockId);
        var _mutatedBlock = this.allBlocks.root[event.blockId];

        if (!block && event.type == 'move') {
            this.allBlocks.delNode(event.blockId);
            return;
        }
        switch (event.type) {
            case Blockly.Events.CHANGE:
                // Rename of variable
                if (event.name == 'VAR' && event.newValue != event.oldValue) {
                    _mutatedBlock.variableName = event.newValue;
                    if (block.type == 'unary' || block.type == 'binary') {
                        var _renameFlag = null;
                        this.allBlocks.traverseNodes(function(b) {
                            if (b.variableName == _mutatedBlock.variableName && b.id != event.blockId) {
                                _renameFlag = 'Cannot use this variable';
                            }
                        });
                        block.setWarningText(_renameFlag);
                    }
                }
                // change in first operator
                if (event.name == 'm1') {
                    var _newM1 = event.newValue;
                    this.allBlocks.traverseNodes(function(b) {
                        if (b.variableName == _newM1 && b.dataType) {
                            block.setDropdown(b.dataType);
                        }
                    });
                }
                // change in data type
                if (event.name == 'operation') {
                    var _newOperation;
                    var _prevOperation;
                    if (_mutatedBlock.type != 'field_extractor') {
                        // type is operator
                    } else {
                        _newOperation = event.newValue;
                        _prevOperation = event.oldValue;
                    }
                    _mutatedBlock.dataType = event.newValue;
                    if (_newOperation == 'date') {
                        var _dateBlock;
                        // creates new date_format block
                        _mutatedBlock.children.some(function(child) {
                            if (this.allBlocks.root[child].obj.type == 'tp_date_format') {
                                this.allBlocks.root[child].obj.setWarningText(null);
                                _dateBlock = this.allBlocks.root[child];
                            }
                        }.bind(this));
                        if (!_dateBlock) {
                            var _newChild = this.renderBlock('tp_date_format');
                            _newChild.setFieldValue(block.getFieldValue('VAR'), 'VAR');
                            _mutatedBlock.children.$$safePush$$(_newChild.id);
                            Blockly.Tp._connectMeToTransform(_newChild);
                        }
                    }
                    if (_prevOperation == 'date') {
                        _mutatedBlock.children.some(function(child) {
                            if (this.allBlocks.root[child].obj.type == 'tp_date_format') {
                                var _dateToDelete = this.ws.getBlockById(child);
                                _dateToDelete.setWarningText('Parent datatype changed');
                                return true;
                            }
                        }.bind(this));
                    }
                    this.allBlocks.traverseNodes(function(b) {
                        if ((b.obj.getFieldValue('m1') == block.getFieldValue('VAR') || b.obj.getFieldValue('m2') == block.getFieldValue('VAR')) && b.id != _mutatedBlock.id) {
                            b.obj.setDropdown(_newOperation);
                            b.obj.setWarningText('Please choose a diffrent operation');
                        }
                    });
                }
                switch (event.element) {
                    case 'comment':
                        break;
                    case 'field':
                        break;
                    case 'collapsed':
                        break;
                    case 'disabled':
                        break;
                    case 'inline':
                        break;
                    case 'mutate':
                        break;
                }
                break;
            case Blockly.Events.CREATE:
                // To Do: optimize creation process if to switch, abstract common properties
                debugger;
                switch (block.type) {
                    case 'delimiter':
                        this.allBlocks.addNode(block, event.blockId);
                        break;
                    case 'output_field':
                        this.allBlocks.addNode(block, event.blockId, undefined, block.getFieldValue('VAR'));
                        break;
                    case 'field_extractor':
                        this.allBlocks.addNode(block, event.blockId, block.getFieldValue('operation'), block.getFieldValue('VAR'));
                        break;
                    case 'tp_constant':
                        this.allBlocks.addNode(block, event.blockId, block.getFieldValue('operation'), block.getFieldValue('VAR'));
                        break;
                    case 'unary':
                        this.allBlocks.addNode(block, event.blockId, undefined, block.getFieldValue('VAR'));
                        break;
                    case 'binary':
                        this.allBlocks.addNode(block, event.blockId, undefined, block.getFieldValue('VAR'));
                        break;
                    case 'lookup':
                        this.allBlocks.addNode(block, event.blockId, block.getFieldValue('operation'), block.getFieldValue('VAR'));
                        break;
                    case 'tp_date_format':
                        this.allBlocks.addNode(block, event.blockId, undefined, block.getFieldValue('VAR'));
                }       break;
                break;
            case Blockly.Events.DELETE:
                this.allBlocks.delNode(event.blockId);
                //TODO del all children recursively
                break;
            case Blockly.Events.MOVE:
                block = this.ws.getBlockById(event.blockId);
                // Excludes extractor/transform/store
                if (block.type == 'extractor' || block.type == 'transform' || block.type == 'store') {
                    return false;
                }
                if (event.newParentId) {//attached
                    // this element was previosuly attached to root
                    if (!event.oldParentId) {
                        var _rootIndex = this.allBlocks.root.children.indexOf(event.blockId);
                        // removes from root's child list
                        if (_rootIndex != -1) {
                            this.allBlocks.root.children.splice(_rootIndex, 1);
                        }
                    }
                    var blockP = this.ws.getBlockById(event.newParentId);
                    this.allBlocks.attachChild(this.allBlocks.root[event.blockId], this.allBlocks.root[blockP.id]);
                    if (blockP.type == 'delimiter') {
                        blockP.appendEmptyInput();
                    }
                    //TODO create new block  & add it to either transform block or store
                } else {
                    // Field extractor and delimiter are physically related to it's parents
                    // So removes links from parent and children
                    if (block.type == 'field_extractor' || block.type == 'delimiter') {
                        this.allBlocks.traverseNodes(function(b) {
                            var _indexOfChild  = b.children.indexOf(event.blockId);
                            if ( _indexOfChild != -1) {
                                b.children.splice(_indexOfChild, 1);
                                me.allBlocks.root[event.blockId].parent = [];
                                me.allBlocks.root.children.$$safePush$$(event.blockId);
                            }
                        });
                    }
                    var c = this.allBlocks.getParent(block);
                    if (c) {
                        // if (c.type == 'delimiter') {

                        // }
                        // var operation = block.getFieldValue('operation');
                        // this.allBlocks.dettachChild(block, this.allBlocks.root[]);
                        // this.allBlocks.addNode(block, block.id, operation, block.getFieldValue('VAR'), null);
                    }
                }
                break;
            case Blockly.Events.UI:
                break;
        }
    },
    registerChangeEvent: function(block, type) {

    },
    unRegisterChangeEvent: function(block, type) {

    },
    attachBlock: function(child, parent) {
        this._executeEvent({
            type: "move",
            blockId: child.id,
            newParentId: parent.id,
            internal: true,
            toJson: function() {
                return {
                    type: "move",
                    blockId: child.id,
                    newParentId: parent.id
                };
            }
        });
    },
    deattachBlock: function(child, parent) {
        this._executeEvent({
            type: "move",
            blockId: child.id,
            newParentId: parent.id,
            internal: true,
            toJson: function() {
                return {
                    type: "move",
                    blockId: child.id,
             //       newParentId: parent.id
                };
            }
        });
    },
    getSupportedOperands: function(block) {
        return this.allBlocks.getSupportedOperands((block === undefined)? null : block.getDataType);
    },
    getSupportedOperators: function(block) {
        return block.getSupportedOperators();
    },
    getSupportedDataTypes: function(block) {
        return this.dataType;
    },
    // gets list of previously created variables
    getLastVariables: function() {
        var _varList = bbm.ws.variableList;
        var _len = _varList.length;
        return [_varList[_len - 1], _varList[_len-2] ? _varList[_len - 2] : _varList[_len - 1]];
    },
    renderBlock: function (id) {
        var mainWorkspace = Blockly.getMainWorkspace();
        var newBlock = mainWorkspace.newBlock(id);
        newBlock.initSvg();
        mainWorkspace.render();
        // meathod to call after block is rendered
        // more lke an initcalback
        if (newBlock.afterInit) {
            newBlock.afterInit();
        }
        return newBlock;
    },
    _dataTypeChanged: function(block, olddatatype, newdatatype){
        this.allBlocks.changeDatatype(block.id, olddatatype, newdatatype);
    },
    _executeEvent: function(event) {
        Blockly.Events.fromJson(event.toJson(), bbm.ws)
            .run(true);
    }
};
var bbm = Blockly.Blocks.Manager;
Blockly.Blocks.Manager.ws = Blockly.getMainWorkspace();
//Blockly.Blocks.Manager.workspaceContainer = Blockly.inject('workspaceDiv', {});
Blockly.getMainWorkspace().addChangeListener(Blockly.Blocks.Manager.changeListener.bind(bbm));
bbm.init();
