<template>
    <div class="box">
        <div>
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
                            class="sel"
                            :placeholder="data.placeHolder"
                            value-key="item.lineId + '_'+ data.seq"
                            v-if="(data.inputBoxType === 'SELECT' &&  getShow(item.lineId, data.seq)) || (data.factorCode ==='rule_and_or' || Number(data.seq) === Number(1))"
                        >
                            <el-option
                                v-for="item in data.factorData"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                        <span
                            style="position:relative; top:6px;"
                            v-if="data.inputBoxType === 'STRING' &&  getShow(item.lineId, data.seq)"
                        >{{data.factorValue}}</span>
                        <el-input
                            v-model="data.factorValue"
                            :placeholder="data.placeHolder"
                            v-if="data.inputBoxType === 'INPUT' &&  getShow(item.lineId, data.seq)"
                            readonly
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
            <el-select
                v-model="self_core_value"
                placeholder="请选择"
                @change="selfCodeTap"
            >
                <el-option
                    v-for="item in self_core"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                ></el-option>
            </el-select>
        </div>
        <div class="baseBox">
            <el-button type="info" @click="decisionTap">生成决策表</el-button>
            <el-button type="info" @click="addRow">增加一行</el-button>
            <el-button type="info" @click="deleteRow">删除选中行</el-button>
            <!-- table -->
            <el-table
                border
                :data="tableData"
                style="width: 100%"
                v-show="table_show"
                :row-class-name="tableRowClassName"
                @selection-change="rowClick"
                @row-click="table_row_click">
                <el-table-column
                    type="index"
                    width="50"
                >
                </el-table-column>
                <el-table-column
                    type="selection"
                    width="55">
                </el-table-column>
                <el-table-column
                v-for="(item,index) in col_name"
                :label="item.value"
                :key="index"
                prop="id"
                width="180">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row[item.key]" type="text"/>
                    </template>
                </el-table-column>
                <el-table-column
                    label="自核结论"
                    width="180"
                    prop="result">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.result" type="text"/>
                    </template>
                </el-table-column>
                <el-table-column
                    label="转人工核保级别"
                    width="180"
                    prop="uwlevel">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.uwlevel" type="text"/>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
import SelectData from './json/index';
// import axios from 'axios'
import qs from 'qs'
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
            artificial_Underwriting:[
                { value: 'a', label: "A" },
                { value: 'b', label: "B" }
            ],
            self_core: [
                { value: 'pass', label: "自核通过" },
                { value: 'notPass', label: "自核不通过" }
            ],
            self_core_value: '', // 人工核保
            result_value: '',  
            artificial_Underwriting_value: '',
            resVal: false,
            artVal: false,
            http: 'http://localhost:9900',
            table_show: false,
            table_col_name: '',
            col_name: [],
            col_middle: '',
            col_middle02: '',
            col_name_english: [],
            col_name_chinese: [],
            tableData: [],
            indexs: [],
            scope_rowData01: '',
            scope_rowData02: '',
            scope_rowData03: '',
            row_data_value: []
        };
    },
    updated(){
        if (document.getElementsByClassName('sel')[0]) {
            document.getElementsByClassName('sel')[0].style.visibility="hidden";
        }
    },
    mounted() {
        let that = this;
        document.addEventListener('click', e => {
            if (that.$refs.rightHand && !that.$refs.rightHand.contains(e.target)) {
                that.rightHand = false; //点击其他区域关闭
            }
        });
        // 回显测试
        // let a = JSON.parse(sessionStorage.getItem('result_json'))
        // let testDatas = a.lines
        // // console.log(testDatas)  // 报文
        // this.valueToLabel(testDatas)
        // this.dataModel = testDatas
        // 回显接口测试
        // axios.get(`${this.http}/drl_get`).then((data) => {
        //     console.log(data)
        // })
    },
    methods: {
        // table row
        table_row_click (row) {
            // console.log(row)
            this.row_data_value = []
            this.row_data_value.push(row)
            this.row_data_value.map((item) => {
                console.log(item);
                delete(item['index'])
                delete(item['id'])
                // delete(item['uwlevel'])
                // delete(item['result'])
                console.log(item);
                // if (Object.keys(item) !== [] && Object.values(item) !== []) {
                //     console.log(Object.keys(item));
                //     console.log(Object.values(item));
                //     let obj = {
                //         key: Object.keys(item),
                //         value: Object.values(item)
                //     }
                //     console.log(obj);
                // }
            })
            // console.log(this.row_data_value);
        },
        // 赋值索引
        tableRowClassName ({row, rowIndex}) {
            row.index = rowIndex;
        },
        // 点击行获取索引
        rowClick(row) {
            this.indexs = [];
            for(let i=0;i<row.length;i++) {
                this.indexs.push(row[i].index);
            }
            // console.log(this.indexs);
        },
        // 增加行
        addRow() {
            this.tableData.push({
                "uwlevel": this.tableData.length,
                "result": this.tableData.length
            });
//             console.log(this.tableData)
        },
        // 删除表格行
        deleteRow() {
            for(let i=this.indexs.length-1;i>=0;i--) {
                console.log(this.indexs[i]);
                this.tableData.splice(this.indexs[i],1)
             }
        },
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
            let ite = data.filter((item,index)=> {
                item.lineData.map((item_01)=>{
                    if (item_01.factorCode === 'rule_and_or') {
                        item_01.factorData = SelectData.AND_OR_DATA
                    } else if (item_01.factorCode === 'rule_attr1') {
                        item_01.factorData = SelectData.HODER_DATA
                    } else if (item_01.factorCode === 'rule_attr2') {
                        item_01.factorData = SelectData.DE_DATA
                    } else if (item_01.factorCode === 'rule_operator') {
                        item_01.factorData = SelectData.OPERATOR_DATA
                    } else if (item_01.factorCode === 'rule_input') {
                        item_01.factorData = SelectData.LIST_DATA
                    }
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
            // dataModel 是渲染页面的完整数据，遍历后是传给后端的最终报文
            let postData = this.dataModel
            postData.map((item_post_01) => {
                item_post_01.lineData.map((item_post_02) => {
                    delete(item_post_02['defaultValue'])
                    delete(item_post_02['isDisplay'])
                    delete(item_post_02['isRequired'])
                    delete(item_post_02['placeHolder'])
                    delete(item_post_02['factorData'])
                    let lineData = item_post_02
                    if (this.self_core_valueself_ === 'a') {
                        this.art_val = 'A'
                    } else if (this.self_core_valueself_ === 'b') {
                        this.art_val = 'B'
                    } else {
                        this.art_val = ""
                    }
                    this.result_json = {
                        "ruleCode": '8390128',
                        "result": this.result_value,
                        "uwlevel": this.art_val,
                        "data": this.tableColName,
                        "lines": postData
                    }
                })
            })
            // 把报文存到session
            console.log(this.result_json)
            // sessionStorage.setItem('result_json', JSON.stringify(this.result_json))
            // axios({
            //     url: `${this.http}/drl_new`,
            //     method: 'post',
            //     data:this.result_json
            // }).then((data) => {
            //     console.log(data)
            // })
        },
        closeMenu() {
            this.rightHand = false;
        },
        selfCodeTap() {
            // console.log(this.self_core_value)
            if (this.self_core_value === "notPass") {
                // console.log(3213)
                this.artVal = true,
                this.resVal = true
            } else {
                this.artVal = false,
                this.resVal = false
            }
        },
        // 决策表
        decisionTap() {
            this.table_show = true
            let arr =[], a = []
            // console.log(this.dataModel)
            for (let i = 0; i < this.dataModel.length; i++) {
                arr.push(this.dataModel[i].lineData);
            }
                this.col_name = []
                this.col_name_english = []
                this.col_name_chinese = []
                for (let i = 0; i < arr.length; i++) {
                    a = arr[i];
                    for (let j = 0; j < a.length; j++) { 
                        if (a[j].factorValue === '') {
                            Object.values(SelectData).map((item_01) => {
                                item_01.map((item_02) => {
                                    if (item_02.value === a[j-3].factorValue) {
                                        this.col_middle = item_02.label // 中文
                                        this.col_middle02 = item_02.value  // 英文
                                    } else if (item_02.value === a[j-2].factorValue) {
                                        this.col_middle += item_02.label // 中文
                                        this.col_middle02 += '.' + item_02.value  // 英文
                                        this.col_name_chinese.push(this.col_middle)
                                        this.col_name_english.push(this.col_middle02)
                                    }
                                })
                            })
                        }
                    }
                }
                for (let a =0; a < this.col_name_english.length; a++) {
                    for(let e = a+1; e < this.col_name_english.length; e++) {
                        if(this.col_name_english[e]===this.col_name_english[a]) {
                            this.col_name_english[e] += '-'+ e
                        }
                    }
                    for (let b = 0;b < this.col_name_chinese.length; b++) {
                        if( b===a ) {
                            this.col_name.push(
                                {
                                    key: this.col_name_english[a],
                                    value: this.col_name_chinese[b]
                                }
                            )
                        }
                    }
                }
            // console.log(this.col_name)
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
    margin: 0 4px;
    /* flex: 1; */
    /* min-width: 215px; */
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
}
ul > li {
    list-style: none;
}
/* TODO baseBox */
.baseBox {
    margin-top: 20px;
}
</style>