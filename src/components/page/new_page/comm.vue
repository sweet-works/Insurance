<!--
 * @Autor: yaojie
 * @Date: 2020-03-27 14:03:12
 * @LastEditors: yaojie
 * @LastEditTime: 2020-03-30 00:02:38
 * @Description: 
 -->
<template>
    <div class="box">
        <ul ref="rightHand" v-show="rightHand" class="rightHand">
            <li
                v-for="(i,index) in list"
                :value="i.value"
                :key="index"
                @click="addParentTap(i.label)"
            >{{i.label}}</li>
        </ul>
        <div class="line" v-for="lines in dataModel" :key="lines.lineId">
            <InputList
                v-for="item in lines.lineData"
                :key="item.factorCode"
                :data="item"
                :lineId="lines.lineId"
                :options="getValue(item.factorCode)"
                :onChange="onChange"
                :rightClick="rightClick"
            />
            <!-- <el-select v-model="value" clearable placeholder="请选择" @change="onChange">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            ></el-option>
        </el-select>
        <el-select v-show="value" clearable v-model="value2" placeholder="请选择" @change="onChange">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            ></el-option>
        </el-select>
            <el-input v-show="value2" v-model="input" placeholder="请输入内容" clearable></el-input>-->
        </div>
    </div>
</template>

<script>
import InputList from './comm/inputList';
import SelectData from './json/index';
let COUNT = 0;

export default {
    components: {
        InputList
    },
    data() {
        return {
            bl: true,
            limit: 2,
            dataModel: [
                {
                    lineId: COUNT,
                    lineShow: true,
                    lineData: [
                        {
                            seq: 1,
                            factorCode: 'rule_and_or',
                            factorValue: '',
                            inputBoxType: 'SELECT',
                            placeHolder: '请输入'
                        }
                    ]
                }
            ],
            options: [
                {
                    value: '1',
                    label: '黄金糕'
                },
                {
                    value: '2',
                    label: '双皮奶'
                },
                {
                    value: '3',
                    label: '蚵仔煎'
                },
                {
                    value: '4',
                    label: '龙须面'
                },
                {
                    value: '5',
                    label: '北京烤鸭'
                }
            ],
            value: '',
            value2: '',
            input: '',

            list: SelectData.LIST_DATA, //右键下拉框数据
            rightHand: false, //
            IdObject: {}, //
            addParentheses: false
        };
    },
    mounted() {
        let that = this;
        document.addEventListener('click', e => {
            if (!that.$refs.addParentheses.contains(e.target)) {
                that.addParentheses = false; //这句话的意思是点击其他区域关闭（也可以根据自己需求写触发事件）
            }
        });
    },
    methods: {
        onChange(val, key, lineId, seq) {
            console.log(val, key, lineId, seq);
            let data = this.dataModel.filter(item => item.lineId === lineId)[0].lineData;
            let newData = JSON.parse(JSON.stringify(data));
            let length = Number(data.length);
            if (key === 'rule_and_or' && val) {
                let obj = {
                    seq: length + 1,
                    factorCode: 'rule_holder',
                    factorValue: '',
                    inputBoxType: 'SELECT',
                    placeHolder: '请选择对象'
                };
                newData[length] = obj;
                this.dataModel.filter(item => item.lineId === lineId)[0].lineData = newData;
            } else if (key === 'rule_holder' && val) {
                let obj = {
                    seq: length + 1,
                    factorCode: 'rule_of',
                    factorValue: '',
                    inputBoxType: 'SELECT',
                    placeHolder: ''
                };
                newData[length] = obj;
                this.dataModel.filter(item => item.lineId === lineId)[0].lineData = newData;
            } else if (key === 'rule_of' && val) {
                let obj = {
                    seq: length + 1,
                    factorCode: 'rule_operator',
                    factorValue: '',
                    inputBoxType: 'SELECT',
                    placeHolder: ''
                };
                newData[length] = obj;
                this.dataModel.filter(item => item.lineId === lineId)[0].lineData = newData;
            } else if (key === 'rule_operator' && val) {
                let obj = {
                    seq: length + 1,
                    factorCode: 'rule_input',
                    factorValue: '',
                    inputBoxType: 'INPUT',
                    placeHolder: ''
                };
                newData[length] = obj;
                this.dataModel.filter(item => item.lineId === lineId)[0].lineData = newData;
            }
        },
        getValue(key) {
            if (key === 'rule_and_or') {
                return SelectData.AND_OR_DATA;
            } else if (key === 'rule_holder') {
                return SelectData.HODER_DATA;
            } else if (key === 'rule_of') {
                return SelectData.DE_DATA;
            } else {
                return this.options;
            }
        },
        // 由label查value
        labelToValue(data, label) {
            let ite = data.filter(item => item.label === label)[0];
            return ite.value;
        },
        // 由value查label
        valueToLabel(data, value) {
            let ite = data.filter(item => item.value === value)[0];
            return ite.label;
        },
        // 右键
        rightClick(lineId, seq, e) {
            let boundData = e.target.getBoundingClientRect();
            let ul = document.querySelector('.rightHand');
            let contentBox = document.querySelector('.content-box');
            let top = e.clientY - contentBox.offsetTop - e.offsetY - 10 + 'PX';
            let left = e.clientX - contentBox.offsetLeft - e.offsetX - 10 + 'PX';
            ul.style.left = left;
            ul.style.top = top;
            ul.style.width = boundData.width - 2 + 'px';
            this.rightHand = true;
            console.log(lineId, seq, e);
            this.IdObject = { lineId, seq };
        },
        addParentTap(val) {
            let oper = this.labelToValue(this.list, val);
            let leftOrRight = 'right';
            if (oper == '（') {
                leftOrRight = 'left';
            } else {
                leftOrRight = 'right';
            }
            this.addParent(oper, leftOrRight);
        },
        // 添加右键下拉框选中数据
        addParent(oper, leftOrRight) {
            let { lineId, seq } = this.IdObject;
            let newData = [];
            let datas = this.dataModel.filter(item => item.lineId === lineId)[0].lineData;
            console.log(oper, leftOrRight);
            console.log(lineId, seq);
            let keys = ['andOr'];
            let model = {
                factorCode: 'text', // key值 可以做id
                defaultValue: oper, // 默认值
                factorValue: oper, // value
                inputBoxType: 'STRING', // 是输入框，还是选择框
                isDisplay: 'YES', // 是否显示
                isRequired: 'YES', // 是否必录
                seq: keyid //排序,
            };
        }
    }
};
</script>

<style scoped>
.box {
    position: relative;
}
.el-input {
    display: inline-block;
    width: 200px;
}
.line {
    display: flex;
}
.rightHand {
    min-width: 100px;
    position: absolute;
    z-index: 9999;
    border: solid 1px #ccc;
    background-color: #409eff;
    color: #fff;
}
ul > li {
    list-style: none;
}
</style>