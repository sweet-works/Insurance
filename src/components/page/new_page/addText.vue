<template>
    <div class="box">
        <ul ref="rightHand" v-show="rightHand" class="rightHand">
            <li
                v-for="(i,index) in list"
                :value="i.value"
                :key="index"
                @click="addParent(i.value)"
            >{{i.label}}</li>
        </ul>
        <p class="title" @click="lineShow">如果:</p>
        <div v-for="item in dataModel" v-show="item.lineShow" :key="item.lineId">
            <div class="lines">
                <div
                    class="suibian"
                    v-for="data in item.lineData"
                    :key="data.seq"
                    @contextmenu.prevent="rightClick(item.lineId, data.seq, $event)"
                >
                    <el-select
                        v-model="data.factorValue"
                        :placeholder="data.placeHolder"
                        value-key="item.lineId + '_'+ data.seq"
                        v-if="(data.inputBoxType === 'SELECT' &&  getShow(item.lineId, data.seq)) || data.factorCode==='rule_and_or'"
                    >
                        <el-option
                            v-for="item in data.factorData"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                    <span
                        style="maxWidth:50px; textAlign:center"
                        v-if="data.inputBoxType === 'STRING' &&  getShow(item.lineId, data.seq)"
                    >{{data.factorValue}}</span>
                    <el-input
                        v-model="data.factorValue"
                        :placeholder="data.placeHolder"
                        v-if="data.inputBoxType === 'INPUT' &&  getShow(item.lineId, data.seq)"
                    ></el-input>
                </div>
                <i class="el-icon-circle-close" @click="removeLine(item.lineId)"></i>
            </div>
        </div>
        <i class="el-icon-plus" v-show="show" @click="addLine"></i>
        <el-button type="info" @click="submit">提交</el-button>
        <!-- <h1>{{ mm }}</h1> -->
        <h4>那么: </h4>
        <!-- here need 绑定对应字段 拼接到报文里 -->
        <div>
            <el-select
                v-model="data.factorValue"
                :placeholder="data.placeHolder"
                value-key="item.lineId + '_'+ data.seq"
                v-if="(data.inputBoxType === 'SELECT' &&  getShow(item.lineId, data.seq)) || data.factorCode==='rule_and_or'"
            >
                <el-option
                    v-for="item in data.factorData"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                ></el-option>
            </el-select>
            <el-input
                v-model="result"
                :placeholder="data.placeHolder"
                v-if="data.inputBoxType === 'INPUT' &&  getShow(item.lineId, data.seq)"
            ></el-input>
            <el-select
                v-model="data.factorValue"
                :placeholder="data.placeHolder"
                value-key="item.lineId + '_'+ data.seq"
                v-if="(data.inputBoxType === 'SELECT' &&  getShow(item.lineId, data.seq)) || data.factorCode==='rule_and_or'"
            >
                <el-option
                    v-for="item in data.factorData"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                ></el-option>
            </el-select>
        </div>
    </div>
</template>
<script>
import SelectData from './json/index';
let COUNT = 0; // 计数
const DATA = [
    {
        factorCode: 'rule_and_or', // key值 字段
        defaultValue: 'or', // 默认值
        factorValue: 'and', // value
        inputBoxType: 'SELECT', // 是输入框，还是选择
        isDisplay: 'YES', // 是否显示
        isRequired: 'YES', // 是否必录
        placeHolder: '请选择',
        seq: 1, //排序 可以做id
        factorData: SelectData.AND_OR_DATA
    },
    {
        // factorCode: 'rule_holder', // key值 可以做id
        factorCode: 'rule_attr1', // key值 可以做id
        defaultValue: '', // 默认值
        factorValue: '', // value
        inputBoxType: 'SELECT', // 是输入框，还是选择框
        isDisplay: 'YES', // 是否显示
        isRequired: 'YES', // 是否必录
        placeHolder: '请选择对象',
        factorData: SelectData.HODER_DATA,
        seq: 2 //排序
    },
    {
        // factorCode: 'rule_of', // key值 可以做id
        factorCode: 'rule_attr2', // key值 可以做id
        defaultValue: '的', // 默认值
        factorValue: '', // value
        inputBoxType: 'SELECT', // 是输入框，还是选择框
        isDisplay: 'YES', // 是否显示
        isRequired: 'YES', // 是否必录
        placeHolder: '的',
        factorData: SelectData.DE_DATA,
        seq: 3 //排序
    },
    {
        // factorCode: 'rule_operator', // key值 可以做id
        factorCode: 'rule_operator', // key值 可以做id
        defaultValue: '', // 默认值
        factorValue: '', // value
        inputBoxType: 'SELECT', // 是输入框，还是选择框
        isDisplay: 'YES', // 是否显示
        isRequired: 'YES', // 是否必录
        placeHolder: ' 请选择操作符',
        factorData: SelectData.OPERATOR_DATA,
        seq: 4 //排序
    },
    {
        factorCode: 'rule_input', // key值 可以做id
        defaultValue: '', // 默认值
        factorValue: '', // value
        inputBoxType: 'INPUT', // 是输入框，还是选择框
        isDisplay: 'YES', // 是否显示
        isRequired: 'YES', // 是否必录
        placeHolder: ' 请输入值',
        seq: 5 //排序
    }
];
export default {
    data() {
        return {
            rightHand: false, // 右键下拉框显示与隐藏
            show: true, //增加按钮显示与隐藏
            list: SelectData.LIST_DATA, //右键下拉框数据
            IdObject: {}, //存选中的line id 和 点击 id
            dataModel: [],
            mm: ''
        };
    },
    mounted() {
        let that = this;
        document.addEventListener('click', e => {
            if (that.$refs.rightHand && !that.$refs.rightHand.contains(e.target)) {
                that.rightHand = false; //这句话的意思是点击其他区域关闭（也可以根据自己需求写触发事件）
            }
        });
        // 回显测试
    //     let testDatas = [{
    //         "lineId": 1,
    //         "lineShow": true,
    //         "lineData": [{
    //             "factorCode": "rule_and_or",
    //             "factorValue": "and",
    //             "inputBoxType": "SELECT",
    //             "seq": 1
    //         }, {
    //             "factorCode": "rule_attr1",
    //             "factorValue": "agent",
    //             "inputBoxType": "SELECT",
    //             "seq": 2
    //         }, {
    //             "factorCode": "rule_attr2",
    //             "factorValue": "1",
    //             "inputBoxType": "SELECT",
    //             "seq": 3
    //         }, {
    //             "factorCode": "rule_operator",
    //             "factorValue": "than",
    //             "inputBoxType": "SELECT",
    //             "seq": 4
    //         }, {
    //             "factorCode": "rule_input",
    //             "factorValue": "5500",
    //             "inputBoxType": "INPUT",
    //             "seq": 5
    //         }]
    //     }, {
    //         "lineId": 2,
    //         "lineShow": true,
    //         "lineData": [{
    //             "factorCode": "rule_and_or",
    //             "factorValue": "and",
    //             "inputBoxType": "SELECT",
    //             "seq": 1
    //         }, {
    //             "factorCode": "rule_paren",
    //             "factorValue": "(",
    //             "inputBoxType": "STRING",
    //             "seq": 2
    //         }, {
    //             "factorCode": "rule_attr1",
    //             "factorValue": "perInsurance",
    //             "inputBoxType": "SELECT",
    //             "seq": 3
    //         }, {
    //             "factorCode": "rule_attr2",
    //             "factorValue": "1",
    //             "inputBoxType": "SELECT",
    //             "seq": 4
    //         }, {
    //             "factorCode": "rule_operator",
    //             "factorValue": "in",
    //             "inputBoxType": "SELECT",
    //             "seq": 5
    //         }, {
    //             "factorCode": "rule_input",
    //             "factorValue": "55，66",
    //             "inputBoxType": "INPUT",
    //             "seq": 6
    //         }, {
    //             "factorCode": "rule_and_or",
    //             "factorValue": "and",
    //             "inputBoxType": "SELECT",
    //             "seq": 7
    //         }, {
    //             "factorCode": "rule_attr1",
    //             "factorValue": "applicant",
    //             "inputBoxType": "SELECT",
    //             "seq": 8
    //         }, {
    //             "factorCode": "rule_attr2",
    //             "factorValue": "2",
    //             "inputBoxType": "SELECT",
    //             "seq": 9
    //         }, {
    //             "factorCode": "rule_operator",
    //             "factorValue": "in",
    //             "inputBoxType": "SELECT",
    //             "seq": 10
    //         }, {
    //             "factorCode": "rule_input",
    //             "factorValue": "43634，5345",
    //             "inputBoxType": "INPUT",
    //             "seq": 11
    //         }, {
    //             "factorCode": "rule_paren",
    //             "factorValue": ")",
    //             "inputBoxType": "STRING",
    //             "seq": 12
    //         }]
    //     }]
    // // 处理testDatas 回显数据
    // this.valueToLabel(testDatas)
    // sessionStorage.setItem('data', JSON.stringify(testDatas));
    // this.dataModel = JSON.parse(sessionStorage.getItem('data'))
    },
    methods: {
        getShow(lineId, keyid) {
            let bl = false;
            this.dataModel.map(item => {
                if (item.lineId === lineId) {
                    let data = item.lineData;
                    data.map(itm => {
                        if (itm.seq == keyid - 1) {
                            if (!itm.factorValue) {
                                bl = false;
                            } else {
                                bl = true;
                            }
                        }
                    });
                }
            });
            return bl;
        },
        // 删除一行
        removeLine(lineId) {
            let newArr = this.dataModel.filter(ite => ite.lineId !== lineId);
            this.dataModel.map(item => {
                if (item.lineId === lineId) {
                    this.dataModel = newArr;
                }
            });
        },
        // 增加一行
        addLine() {
            let length = this.dataModel.length;
            let data= JSON.parse(JSON.stringify(DATA))
            COUNT++;
            let dataModel = {
                lineId: COUNT,
                lineShow: true,
                lineData: data
            };
            this.dataModel.push(dataModel);
        },
        // 右键
        rightClick(lineId, keyid, e) {
            let boundData = e.target.getBoundingClientRect();
            let ul = document.querySelector('.rightHand');
            let contentBox = document.querySelector('.content-box');
            let top = e.clientY - contentBox.offsetTop - e.offsetY - 10 + 'PX';
            let left = e.clientX - contentBox.offsetLeft - e.offsetX - 10 + 'PX';
            ul.style.left = left;
            ul.style.top = top;
            ul.style.width = boundData.width - 2 + 'px';
            this.rightHand = true;
            this.IdObject = { lineId, keyid };
        },
        // 添加右键下拉框选中数据
        addParent(val) {
            let leftOrRight = 'right';
            let oper = val;
            let newData = [];
            let { lineId, keyid } = this.IdObject;
            let datas = this.dataModel.filter(item => item.lineId === lineId)[0].lineData;
            if (oper == '(') {
                leftOrRight = 'left';
            } else {
                leftOrRight = 'right';
            }
            let keys = ['andOr'];
            let model = {
                factorCode: 'rule_paren', // key值 可以做id
                defaultValue: oper, // 默认值
                factorValue: oper, // value
                inputBoxType: 'STRING', // 是输入框，还是选择框
                isDisplay: 'YES', // 是否显示
                isRequired: 'YES', // 是否必录
                factorData: '',
                seq: keyid //排序,
            };
            for (let i = 0; i < datas.length; i++) {
                if (datas[i].seq == keyid) {
                    if (leftOrRight === 'left') {
                        newData.push(model, datas[i]); // 加前边
                    } else {
                        if (keys.includes(oper)) {
                            console.log(this.dataModel);
                            let newAddDatas= JSON.parse(JSON.stringify(DATA));
                            newData.push(datas[i])
                            for (let j=0;j<newAddDatas.length;j++){
                                newAddDatas[j].seq=keyid+j;
                                newAddDatas[j].factorValue=""
                                newData.push(newAddDatas[j])
                            }
                        } else {
                            newData.push(datas[i], model);
                        }
                    }
                } else {
                    newData.push(datas[i]);
                }
            }
            for (let index in newData) {
                newData[index].seq = Number(index) + 1;
            }
            this.dataModel.filter(item => item.lineId === lineId)[0].lineData = newData;
            this.rightHand = false;
        },
        // 由label查value
        labelToValue(data, label) {
            let ite = data.filter(item => item.label === label)[0];
            return ite.value;
        },
        // 由value查label
        valueToLabel(data, value) {
            // let ite = data.filter(item => item.value === value)[0];
            let ite = data.filter((item,index)=> {
                item.lineData.map((item_01)=>{
                    Object.values(SelectData).filter((item_02) => {
                        item_02.filter((ite) => {
                            if (ite.value === item_01.factorValue) {
                                // 改变factorValue的原始数据为label
                                if (item_01.factorValue === '(' || item_01.factorValue === ')') {
                                    item_01.factorValue = item_01.factorValue
                                } else {
                                    item_01.factorValue = ite.label
                                }
                            }
                        })
                    })
                })
            })[0];
        },
        // v-show
        lineShow() {
            this.dataModel.map(item => {
                item.lineShow = !item.lineShow;
            });
        },
        submit() {
            let postData = this.dataModel
            postData.map((item_post_01) => {
                item_post_01.lineData.map((item_post_02) => {
                    delete(item_post_02['defaultValue'])
                    delete(item_post_02['isDisplay'])
                    delete(item_post_02['isRequired'])
                    delete(item_post_02['placeHolder'])
                    delete(item_post_02['factorData'])
                    let lineData = item_post_02
                    this.result_json = {
                        "releCode": '8390128',
                        "result": "再保意外>550万需再保呈报",
                        "uwlevel": "A",
                        "lines": postData
                    }
                })
                // console.log(this.result_json)
            })
            // let data = this.dataModel;
            // sessionStorage.setItem('data', JSON.stringify(data));
            // console.log(data);
            // this.mm = JSON.parse(sessionStorage.getItem('data'))
        },
        closeMenu() {
            this.rightHand = false;
        }
    }
};
</script>

<style scoped style="scss">
.box {
    position: relative;
}
.el-icon-plus,
.el-icon-circle-close {
    color: blue;
    font-size: 35px;
}
.el-input {
    width: 200px;
}
.title {
    font-size: 24px;
    color: blue;
}
.lines {
    display: flex;
    flex-wrap: wrap;
}
.lines .suibian{
    flex: 1;
    min-width: 215px;
}
.zhanwei {
    width: 48px;
}
.rightHand {
    min-width: 100px;
    /* height: 40px; */
    position: absolute;
    z-index: 9999;
    border: solid 1px #ccc;
    background-color: #409eff;
    color: #fff;
    /* background: pink */
}
ul > li {
    list-style: none;
}
</style>