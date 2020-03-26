<template>
    <div class="box">
        <ul ref="rightHand" v-show="rightHand" class="rightHand" @click="addParentTap">
            <li v-for="(i,index) in list" :value="i.value" :key="index">{{i.label}}</li>
        </ul>
        <p class="title">如果:</p>
        <div v-for="item in dataModel" v-show="item.lineShow" :key="item.lineId">
            <div class="box_fir">
                <div
                    v-for="data in item.lineData"
                    :key="data.seq"
                    @contextmenu.prevent="rightClick(item.lineId, data.seq, $event)"
                >
                    <el-select
                        v-model="data.factorValue"
                        :placeholder="data.placeHolder"
                        v-if="data.inputBoxType === 'SELECT'"
                    >
                        <el-option
                            v-for="item in data.factorData"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                    <span v-if="data.inputBoxType === 'STRING'">{{data.factorValue}}</span>
                    <el-input
                        v-model="data.factorValue"
                        :placeholder="data.placeHolder"
                        v-if="data.inputBoxType === 'INPUT'"
                    ></el-input>
                </div>
                <i class="el-icon-circle-close" @click="cl_close(item.lineId)"></i>
            </div>
        </div>
        <i class="el-icon-plus" v-show="show" @click="add"></i>
        <el-button type="info" @click="submit">提交</el-button>
    </div>
</template>
<script>
import SelectData from './json/index';
let COUNT = 0; // 计数
export default {
    data() {
        return {
            rightHand: false, // 右键下拉框显示与隐藏
            show: true, //增加按钮显示与隐藏
            list: SelectData.LIST_DATA, //右键下拉框数据
            IdObject: {}, //存选中的line id 和 点击 id
            andOr: {
                factorCode: 'rule_and_or', // key值 可以做id
                defaultValue: 'or', // 默认值
                factorValue: 'and', // value
                inputBoxType: 'SELECT', // 是输入框，还是选择框
                getValueType: 'GET_SERVE', //获取数据的类型 或者 枚举
                isDisplay: 'YES', // 是否显示
                isReadonly: 'NO', // 是否读写
                isRequired: 'YES', // 是否必录
                maxValueLength: 28, // 最大最小长度
                minValueLength: 0,
                placeHolder: '请输入',
                seq: 1, //排序,
                factorData: SelectData.AND_OR_DATA
            },
            dataModel: [
                {
                    lineId: 1,
                    lineShow: true,
                    lineData: [
                        {
                            factorCode: 'rule_and_or', // key值 可以做id
                            defaultValue: 'or', // 默认值
                            factorValue: 'and', // value
                            inputBoxType: 'SELECT', // 是输入框，还是选择框
                            getValueType: 'GET_SERVE', //获取数据的类型 或者 枚举
                            isDisplay: 'YES', // 是否显示
                            isReadonly: 'NO', // 是否读写
                            isRequired: 'YES', // 是否必录
                            maxValueLength: 28, // 最大最小长度
                            minValueLength: 0,
                            placeHolder: '请输入',
                            seq: 1, //排序,
                            factorData: SelectData.AND_OR_DATA
                        },
                        {
                            factorCode: 'rule_holder', // key值 可以做id
                            defaultValue: '', // 默认值
                            factorValue: '', // value
                            inputBoxType: 'SELECT', // 是输入框，还是选择框
                            getValueType: 'GET_SERVE', //获取数据的类型 或者 枚举
                            isDisplay: 'YES', // 是否显示
                            isReadonly: 'NO', // 是否读写
                            isRequired: 'YES', // 是否必录
                            maxValueLength: 28, // 最大最小长度
                            minValueLength: 0,
                            placeHolder: '请选择对象',
                            factorData: SelectData.HODER_DATA,
                            seq: 2 //排序
                        },
                        {
                            factorCode: 'rule_of', // key值 可以做id
                            defaultValue: '的', // 默认值
                            factorValue: '', // value
                            inputBoxType: 'SELECT', // 是输入框，还是选择框
                            getValueType: 'GET_SERVE', //获取数据的类型 或者 枚举
                            isDisplay: 'YES', // 是否显示
                            isReadonly: 'NO', // 是否读写
                            isRequired: 'YES', // 是否必录
                            maxValueLength: 28, // 最大最小长度
                            minValueLength: 0,
                            placeHolder: '的',
                            factorData: SelectData.DE_DATA,
                            seq: 3 //排序
                        },
                        {
                            factorCode: 'rule_operator', // key值 可以做id
                            defaultValue: '', // 默认值
                            factorValue: '', // value
                            inputBoxType: 'SELECT', // 是输入框，还是选择框
                            getValueType: 'GET_SERVE', //获取数据的类型 或者 枚举
                            isDisplay: 'YES', // 是否显示
                            isReadonly: 'NO', // 是否读写
                            isRequired: 'YES', // 是否必录
                            maxValueLength: 28, // 最大最小长度
                            minValueLength: 0,
                            placeHolder: ' 请选择操作符',
                            factorData: SelectData.OPERATOR_DATA,
                            seq: 4 //排序
                        },
                        {
                            factorCode: 'rule_operator', // key值 可以做id
                            defaultValue: '', // 默认值
                            factorValue: '', // value
                            inputBoxType: 'INPUT', // 是输入框，还是选择框
                            getValueType: 'GET_SERVE', //获取数据的类型 或者 枚举
                            isDisplay: 'YES', // 是否显示
                            isReadonly: 'NO', // 是否读写
                            isRequired: 'YES', // 是否必录
                            maxValueLength: 28, // 最大最小长度
                            minValueLength: 0,
                            placeHolder: ' 请输入值',
                            seq: 5 //排序
                        }
                    ]
                }
            ]
        };
    },
    mounted() {
        // let SessData = sessionStorage.getItem('data');
        // this.dataModel = SessData ? JSON.parse(SessData) : [];
        let that = this;
        document.addEventListener('click', e => {
            if (!that.$refs.rightHand.contains(e.target)) {
                that.rightHand = false; //这句话的意思是点击其他区域关闭（也可以根据自己需求写触发事件）
            }
        });
    },
    methods: {
        getShow(id, keyid) {
            let bl = false;
            this.dataModel.map(item => {
                if (item.id === id) {
                    let data = item.data;
                    data.map(itm => {
                        if (itm.id == keyid - 1) {
                            if (!itm.value) {
                                bl = false;
                            } else {
                                bl = true;
                            }
                        }
                    });
                }
            });
            return true;
        },
        // v-show
        cl_if() {
            this.dataModel.map(item => {
                item.show = !item.show;
            });
            this.show = !this.show;
            // console.log(this.dataModel);
        },
        // 关闭
        cl_close(id) {
            let length = this.dataModel.length;
            let newArr = this.dataModel.filter(ite => ite.id !== id);
            this.dataModel.map(item => {
                if (item.id === id) {
                    this.dataModel = newArr;
                }
            });
        },
        // change事件 - 的
        tap() {
            this.if_de = true;
        },
        cl_de(id, keyid) {
            this.dataModel.map(item => {
                if (item.id === id) {
                    let data = item.data;
                    data.map(itm => {
                        if (itm.id === keyid && itm.type === 'text') {
                            itm.value = itm.content === '的' ? '.' : itm.content === '并且' ? '&&' : itm.content;
                        }
                    });
                }
            });
        },
        // 右键
        rightClick(id, keyid, e) {
            let boundData = e.target.getBoundingClientRect();
            let ul = document.querySelector('.rightHand');
            let contentBox = document.querySelector('.content-box');
            let top = e.clientY - contentBox.offsetTop - e.offsetY - 10 + 'PX';
            let left = e.clientX - contentBox.offsetLeft - e.offsetX - 10 + 'PX';
            ul.style.left = left;
            ul.style.top = top;
            ul.style.width = boundData.width - 2 + 'px';
            this.rightHand = true;
            this.IdObject = { lineId: id, keyid };
        },
        // 添加右键下拉框选中数据
        addParent(oper, leftOrRight) {
            let { lineId, keyid } = this.IdObject;
            let newData = [];
            let datas = this.dataModel.filter(item => item.lineId === lineId)[0].lineData;
            console.log(datas);
            // let left = { id: datas.length + 1, type: 'text', content: oper, key: 'kuohao', value: '' };
            // let and =  { id: datas.length + 2, type: 'select', key: 'select_if', value: '', placeholder: '请选择' }
            // let and2 = { id: datas.length + 3, type: 'text', content: '的', key: 'text_de', value: '' }
            // let and3 = { id: datas.length + 4, type: 'select', data: this.options2, key: 'select_02', value: '', placeholder: '请选择' }
            // let and4 = { id: datas.length + 5, type: 'select', data: this.options2, key: 'select_03', value: '', placeholder: '请选择符号' }
            // let and5 = { id: datas.length + 6, type: 'input', data: this.options3, key: 'input_01', value: '', placeholder: '请输入内容' }
            // for (let i = 0; i < datas.length; i++) {
            //     if (datas[i].id == keyid) {
            //         if(leftOrRight === 'left'){
            //             newData.push(left, datas[i]); // 加前边
            //         } else if (leftOrRight === 'right'){
            //             if(oper === '并且'){
            //                 newData.push(datas[i],left,and,and2,and3,and4,and5); // 加后边
            //             } else {
            //                 newData.push(datas[i],left); // 加后边
            //             }
            //         }
            //     } else {
            //         newData.push(datas[i]);
            //     }
            // }
            let keys = ['andOr'];
            let model = {
                factorCode: 'text', // key值 可以做id
                defaultValue: oper, // 默认值
                factorValue: oper, // value
                inputBoxType: 'STRING', // 是输入框，还是选择框
                getValueType: 'GET_SERVE', //获取数据的类型 或者 枚举
                isDisplay: 'YES', // 是否显示
                isReadonly: 'NO', // 是否读写
                isRequired: 'YES', // 是否必录
                maxValueLength: 28, // 最大最小长度
                minValueLength: 0,
                seq: keyid //排序,
            };
            for (let i = 0; i < datas.length; i++) {
                if (datas[i].seq == keyid) {
                    if (leftOrRight === 'left') {
                        newData.push(model, datas[i]); // 加前边
                    } else {
                        if (keys.includes(oper)) {
                            newData.push(datas[i])
                            for(let i in this.dataModel){
                                newData.push(this.dataModel[i])
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
                newData[index].seq = index + 1;
            }
            console.log(newData);
            this.dataModel.filter(item => item.lineId === lineId)[0].lineData = newData;
            this.rightHand = false;
        },
        // 由label查value
        labelToValue(data, label) {
            console.log(data, label);
            let ite = data.filter(item => item.label === label)[0];
            return ite.value;
        },
        // 由value查label
        valueToLabel(data, value) {
            let ite = data.filter(item => item.value === value)[0];
            return ite.label;
        },
        addParentTap(e) {
            let content = e.target.innerHTML;
            let oper = this.labelToValue(this.list, content);
            let leftOrRight = 'right';
            if (oper == '（') {
                leftOrRight = 'left';
            } else {
                leftOrRight = 'right';
            }
            this.addParent(oper, leftOrRight);
        },
        add() {
            let length = this.dataModel.length;
            COUNT++;
            let dataModel = {
                id: COUNT,
                show: true,
                title: length > 0 ? '并且' : '',
                data: [
                    { id: 1, type: 'select', key: 'select_if', value: '', placeholder: '请选择' },
                    { id: 2, type: 'text', content: '的', key: 'text_de', value: '' },
                    { id: 3, type: 'select', data: this.options2, key: 'select_02', value: '', placeholder: '请选择' },
                    { id: 4, type: 'select', data: this.options2, key: 'select_03', value: '', placeholder: '请选择符号' },
                    { id: 5, type: 'input', data: this.options3, key: 'input_01', value: '', placeholder: '请输入内容' }
                ]
            };
            this.dataModel.push(dataModel);
        },
        submit() {
            let data = this.dataModel;
            sessionStorage.setItem('data', JSON.stringify(data));
            console.log(data);
            // let strs = 'if,';
            // data.map(item => {
            //     let str = '';
            //     item.data.map(ite => {
            //         str += ite.value;
            //     });
            //     str += '&&,';
            //     strs += str;
            //     console.log(strs);
            //     console.log(strs.slice(0, -3));
            //     this.rulech = strs.slice(0, -3);
            // });
            // this.ruleCode = '00000000000000001255';
            // let content = {
            //     ruleCode: this.ruleCode,
            //     result: this.result,
            //     rulech: this.rulech,
            //     statement: this.statement,
            //     boms: this.boms,
            //     uwlevel: this.uwlevel
            // };
            // this.content = content;
        },
        // openMenu(e) {
        //     const menuMinWidth = 105
        //     const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
        //     const offsetWidth = this.$el.offsetWidth // container width
        //     const maxLeft = offsetWidth - menuMinWidth // left boundary
        //     const left = e.clientX - offsetLeft // 15: margin right

        //     if (left > maxLeft) {
        //         this.left = maxLeft
        //     } else {
        //         this.left = left
        //     }

        //     this.top = e.clientY - 60 // fix 位置bug
        //     this.visible = true
        // },
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
.box_fir {
    display: flex;
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