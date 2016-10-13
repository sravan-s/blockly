Blockly.Blocks.Manager = {
    datatype: '[["String", "string"], ["Date", "date"], ["Number", "number"]]',
    workspaceContainer: {},
    init: function() {
        // To add existing workspace to allBlocks
        debugger;
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
                if (this.root.children.indexOf(id) == -1) {
                    this.root.children.push(id);
                }
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
        if (event.internal !== undefined) {
            //ignore
            return;
        }
        var block = this.ws.getBlockById(event.blockId);
        if (!block && event.type == 'move') {
            this.allBlocks.delNode(event.blockId);
            return;
        }
        switch (event.type) {
            case Blockly.Events.CHANGE:
                // Rename of variable
                if (event.name == 'VAR' && event.newValue != event.oldValue) {
                    this.allBlocks.root[event.blockId].variableName = event.newValue;
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
                // Delimiter
                if (block.type == 'delimiter') {
                    this.allBlocks.addNode(block, event.blockId);
                }
                // Output variable
                if (block.type == 'output_field') {
                    // should type matter initally?
                    var _type = undefined;
                    this.allBlocks.addNode(block, event.blockId, _type, block.getFieldValue('VAR'));
                }
                // field extractor
                if (block.type == 'field_extractor') {
                    this.allBlocks.addNode(block, event.blockId, block.getFieldValue('operation'), block.getFieldValue('VAR'));
                }
                // constant
                if (block.type == 'tp_constant') {
                    this.allBlocks.addNode(block, event.blockId, block.getFieldValue('operation'), block.getFieldValue('VAR'));
                }
                // unary
                if (block.type == 'unary') {
                    this.allBlocks.addNode(block, event.blockId, undefined, block.getFieldValue('VAR'));
                }
                // binary
                if (block.type == 'binary') {
                    this.allBlocks.addNode(block, event.blockId, undefined, block.getFieldValue('VAR'))
                }
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
