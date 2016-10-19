Blockly.Blocks["ternary"] = {
    OPERATIONS: {
        tpDate: {
            data: [
                ["after", "$1 = tpDate.after(m$2.getData() == null ? data: m$2.getData(), m$2, m$3.getData() == null ? data: m$3.getData(), m$3);||boolean||binary"],
                ["before", "$1 = tpDate.before(m$2.getData() == null ? data: m$2.getData(), m$2, m$3.getData() == null ? data: m$3.getData(), m$3);||boolean||binary"],
            ]
        },
        tpString: {
            data: [
                ["contains", "$1 = tpString.contains(m$2.getData() == null ? data: m$2.getData(), m$2, m$3.getData() == null ? data: m$3.getData(), m$3, mf);||boolean||binary"],
                ["containsIgnoreCase", "$1 = tpString.containsIgnoreCase(m$2.getData() == null ? data: m$2.getData(), m$2, m$3.getData() == null ? data: m$3.getData(), m$3, mf);||boolean||binary"],
                ["endsWith", "$1 = tpString.endsWith(m$2.getData() == null ? data: m$2.getData(), m$2, m$3.getData() == null ? data: m$3.getData(), m$3, mf);||boolean||binary"],
                ["endsWithIgnore", "$1 = tpString.endsWithIgnore(m$2.getData() == null ? data: m$2.getData(), m$2, m$3.getData() == null ? data: m$3.getData(), m$3, mf);||boolean||binary"],
                ["startsWith", "$1 = tpString.startsWith(m$2.getData() == null ? data: m$2.getData(), m$2, m$3.getData() == null ? data: m$3.getData(), m$3);||boolean||binary"],
            ]
        },
        tpMath: {
            data: [
                ["eq", "$1 = tpMath.eq(m$2.getData() == null ? data: m$2.getData(), m$2, m$3.getData() == null ? data: m$3.getData(), m$3, mf);||boolean||binary"],
                ["greaterEqThan", "$1 = tpMath.greaterEqThan(m$2.getData() == null ? data: m$2.getData(), m$2, m$3.getData() == null ? data: m$3.getData(), m$3, mf);||boolean||binary"],
                ["greaterThan", "$1 = tpMath.greaterThan(m$2.getData() == null ? data: m$2.getData(), m$2, m$3.getData() == null ? data: m$3.getData(), m$3, mf);||boolean||binary"],
                ["lessEqThan", "$1 = tpMath.lessEqThan(m$2.getData() == null ? data: m$2.getData(), m$2, m$3.getData() == null ? data: m$3.getData(), m$3, mf);||boolean||binary"],
                ["lessThan", "$1 = tpMath.lessThan(m$2.getData() == null ? data: m$2.getData(), m$2, m$3.getData() == null ? data: m$3.getData(), m$3, mf);||boolean||binary"],
            ]
        }
    },
    init: function() {
        this.appendValueInput("ternary")
            .setCheck("Boolean");
        this.appendValueInput("n1")
            .setCheck("variable")
            .appendField("?");
        this.appendDummyInput()
            .appendField(":");
        this.appendValueInput("n2")
            .setCheck("variable");
        this.appendDummyInput()
            .appendField("called as")
            .appendField(new Blockly.FieldVariable("item"), "VAR");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(290);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    },
    getDropDown: function() {
        var superSet = JSON.parse(Blockly.Tp.dataType);
        var m1 = this.getFieldValue("m1");
        var dataType = Blockly.Tp.variableDateTypeMap[m1];
        switch (dataType) {
            case 'string':
                return this.OPERATIONS.tpString.data;
                break;
            case 'number':
                return this.OPERATIONS.tpMath.data;
                break;
            case 'date':
                return this.OPERATIONS.tpDate.data;
                break;
            default:
                return this.OPERATIONS.tpLogic.data;
        }
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
    updateField: function(type) {
        if (type == 'binary') {
            this.getField('m2').setVisible(true)
        } else {
            this.getField('m2').setVisible(false)
        }
        this.render();
    },
    onchange: function(changeEvent) {
        if (changeEvent.blockId != this.id) {
            return;
        }
        if (changeEvent.type === "change" && changeEvent.name == 'm1') {
            var m1 = this.getFieldValue("m1");
            var options = this.getDropDown(m1); // The new options you want to have
            var drop = this.getField("operation");
            drop.setText(" "); // set the actual text
            drop.setValue(" "); // set the actual value
            drop.menuGenerator_ = options;
        }
        if (changeEvent.type === "change" && changeEvent.name == 'operation') {
            var drop = this.getField("operation");
            var dropType = drop.value_.split('||')[2];
            if (dropType) {
                this.updateField(dropType);
            }
        }
        this.validate();
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
    },
    afterInit: function() {
        Blockly.Tp._connectMeToTransform(this);
    }
};
