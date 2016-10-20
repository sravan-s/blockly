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
            if (block.type == bbm.Consts.BLOCKS.FLYTXT) {
                this._flytxt = block;
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
            // Deleting a node could have unknown side effects
            // Delete event won't fired for blocks that are physically attached to block
            // So, should remove all dead nodes
            _deletedNodes = id ? [id] : [];
            // creates a list of delted nodes
            this.traverseNodes(function(node, nodeId) {
                var _physicalBlock = bbm.ws.getBlockById(nodeId);
                if (!_physicalBlock) {
                    _deletedNodes.$$safePush$$(nodeId);
                }
            });
            // function to remove children
            function removeChildIfPresent(node) {
                this.traverseNodes(function(item) {
                    var _childIndex = item.children.indexOf(node);
                    if (_childIndex != -1) {
                        item.children.splice(_childIndex, 1);
                    }
                });
            };

            _deletedNodes.forEach(removeChildIfPresent.bind(this));
        },
        dettachChild: function(child, parent) {
            this.root[parent.id].children.splice(child.id, 1);
            this.root[child.id].parent = null;
        },
        addNode: function(obj, id, dataType, variableName, parent) {
            if (parent === undefined || parent == null) {
                this.root.children.$$safePush$$(id);
            } else {
                this.root[parent.id].children.push(id);
            }
            this.root[id] = {
                'id': id,
                'obj': obj,
                'dataType': dataType,
                'variableName': variableName,
                'parent': parent ? [parent]: [], // since we are taking semantic realtion bwtween nodes
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
                parent.children.$$safePush$$(child.id);
                child.parent.push(parent.obj);
            }
            return parent;
        },
        // traverses all nodes and execute given callback on each
        traverseNodes: function(cb) {
            var _dataStore = this.root;
            for (var _key in _dataStore) {
                if (_key != 'children') {
                    cb.call(this, _dataStore[_key], _key);
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
        var _productBlock;

        if (!block && event.type == 'move') {
            this.allBlocks.delNode(event.blockId);
            return;
        }
        // functions are debounced to reduce the rolling effect of various actions
        switch (event.type) {
            case Blockly.Events.CHANGE:
                this.debounce(this.changeEvents(block, event), 200);
                break;
            case Blockly.Events.CREATE:
                this.debounce(this.createEvents(block, event), 200);
                break;
            case Blockly.Events.DELETE:
                this.debounce(this.deleteEvents(block, event), 200);
                break;
            case Blockly.Events.MOVE:
                this.debounce(this.moveEvents(block, event), 200);
                break;
            case Blockly.Events.UI:
                break;
        }
    },
    changeEvents: function(block, event){
        var _mutatedBlock = this.allBlocks.root[event.blockId];
        var _productBlock;
        // Rename of variable
        if (event.name == 'VAR' && event.newValue != event.oldValue && _mutatedBlock.obj.type != 'output_field') {
            var _renameFlag = false
            this.allBlocks.traverseNodes(function(node) {
                if (node.variableName == event.oldValue && node.obj.type == 'output_field') {
                    _renameFlag = true;
                }
            });
            if (_renameFlag) {
                return false;
            }
            if (event.oldValue.startsWith('__temp') && !event.newValue.startsWith('__temp')) { // is selecting a name for current block
                if (event.newValue.startsWith('_')) {
                    // Insert if there isn't a variable with current name
                    _productBlock = bbm.renderBlock('dynamic');
                } else {
                    _productBlock = bbm.renderBlock('output_field');
                    // attach to store
                }
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
            if (_mutatedBlock && _mutatedBlock.obj.type != 'field_extractor') {
                // type is operator
                var _newOpType = event.newValue.split('||')[1];
                _mutatedBlock.dataType = _newOpType;
                if (_newOpType != 'binary') {
                    var _m1 = _mutatedBlock.obj.getFieldValue('m1');
                    // type of new variable is type of m1
                    this.allBlocks.traverseNodes(function(b) {
                        if (b.variableName == _m1 && b.dataType) {
                            _mutatedBlock.dataType = b.dataType;
                        }
                    });
                }
                // debugger;
            } else {
                _newOperation = event.newValue;
                _prevOperation = event.oldValue;
                _mutatedBlock.dataType = event.newValue;
            }
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
    },
    createEvents: function(block,event){
        var _mutatedBlock = this.allBlocks.root[event.blockId];
        switch (block.type) {
            case bbm.Consts.BLOCKS.FLYTXT:
            case 'lists_create_with':
            case 'delimiter':
                this.allBlocks.addNode(block, event.blockId);
                break;
            case 'output_field':
                this.allBlocks.addNode(block, event.blockId, undefined, block.getFieldValue('VAR'));
                break;
            case 'test':
                this.allBlocks.addNode(block, event.blockId, undefined, block.getFieldValue('VAR'));
                break;
            case 'ternary':
                this.allBlocks.addNode(block, event.blockId, undefined, block.getFieldValue('VAR'));
                break;
            case 'field_extractor':
                this.allBlocks.addNode(block, event.blockId, block.getFieldValue('operation'), block.getFieldValue('VAR'));
                break;
            case 'tp_constant':
                this.allBlocks.addNode(block, event.blockId, block.getFieldValue('operation'), block.getFieldValue('VAR'));
                break;
            case 'dynamic':
            case 'unary':
            case 'binary':
                this.allBlocks.addNode(block, event.blockId, undefined, block.getFieldValue('VAR'));
                break;
            case 'lookup':
                this.allBlocks.addNode(block, event.blockId, block.getFieldValue('operation'), block.getFieldValue('VAR'));
                break;
            case 'tp_date_format':
                this.allBlocks.addNode(block, event.blockId, undefined, block.getFieldValue('VAR'));
                break;
            case 'event_field':
                this.allBlocks.addNode(block, event.blockId, undefined, block.getFieldValue('VAR'));
                break;
        }
        // To set dropdown
        if (block.getFieldValue('m1')) {
            var _m1Type = this.getType(block.getFieldValue('m1'));
            block.setDropdown(_m1Type);
        }
    },
    deleteEvents: function(block,event){
        this.allBlocks.delNode(event.blockId);
    },
    moveEvents: function(block,event){
        var me = this;
        var _mutatedBlock = this.allBlocks.root[event.blockId];
        // Excludes extractor/transform/store
        if (block.type == bbm.Consts.BLOCKS.FLYTXT) {
            return false;
        }
        if (event.newParentId) {//attached
            // this element was previosuly attached to root
            var blockP = this.ws.getBlockById(event.newParentId);
            if (!event.oldParentId) {
                var _rootIndex = this.allBlocks.root.children.indexOf(event.blockId);
                // removes from root's child list
                if (_rootIndex != -1) {
                    this.allBlocks.root.children.splice(_rootIndex, 1);
                }
                this.allBlocks.root[event.newParentId].children.$$safePush$$(event.blockId);
                // _mutatedBlock.parent.push(blockP);
            }
            this.allBlocks.attachChild(this.allBlocks.root[event.blockId], this.allBlocks.root[blockP.id]);
            if (blockP.type == 'delimiter'|| blockP.type=='stream' || blockP.type=='batch') {
                blockP.appendEmptyInput();
            }
            //TODO create new block  & add it to either transform block or store
        } else {
            // check if detached element has a preious parent element
            var parentBlock = _mutatedBlock.parent[0];
            if(parentBlock && parentBlock.removeEmptyInput){
                setTimeout(function(){
                    parentBlock.removeEmptyInput();
                },100);
            }
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
    // To return the type of a variable
    getType: function(variable) {
        var _type;
        this.allBlocks.traverseNodes(function(node) {
            if (node.variableName == variable && node.dataType) {
                _type = node.dataType;
            }
        });
        return _type;
    },
    // position => {x: 20, y: 50}
    moveBlock: function(block, position) {
        this._executeEvent({
            type: "move",
            blockId: block.id,
            internal: true,
            toJson: function() {
                return {
                    type: 'move',
                    blockId: block.id,
                    newCoordinate: position.x + ',' + position.y
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
        var _varList = bbm.ws.variableList || ['__temp__0', '__temp__1'];
        var _len = _varList.length;
        return [_varList[_len - 1], _varList[_len-2] ? _varList[_len - 2] : _varList[_len - 1]];
    },
    renderBlock: function (id, position) {
        var mainWorkspace = Blockly.getMainWorkspace();
        var newBlock = mainWorkspace.newBlock(id);
        newBlock.initSvg();
        mainWorkspace.render();
        if (position) {
            this.moveBlock(newBlock, position);
        }
        // meathod to call after block is rendered
        // more lke an initcalback
        if (newBlock.afterInit) {
            newBlock.afterInit();
        }
        return newBlock;
    },

    // https://davidwalsh.name/javascript-debounce-function
    debounce: function (func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
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
