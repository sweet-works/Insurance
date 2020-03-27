<!--
 * @Autor: yaojie
 * @Date: 2020-03-27 14:03:12
 * @LastEditors: yaojie
 * @LastEditTime: 2020-03-27 18:07:18
 * @Description: 
 -->
<template>
    <div>
        <div class="line">
            <InputList 
                v-for="item in data"
                :key="item.factorCode"
                :data='item' 
                :options="getValue(item.factorCode)"
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
            data:[
                {
                    seq: 1,
                    factorCode: 'rule_and_or', 
                    factorValue: 'and', 
                    inputBoxType: 'SELECT', 
                    placeHolder: '请输入',
                }
            ],
            dataModel: [
                {
                    lineId: COUNT,
                    lineShow: true,
                    lineData: [
                        {
                            factorCode: 'rule_and_or', // key值 字段
                            defaultValue: 'or', // 默认值
                            factorValue: 'and', // value
                            inputBoxType: 'SELECT', // 是输入框，还是选择
                            isDisplay: 'YES', // 是否显示
                            isRequired: 'YES', // 是否必录
                            placeHolder: '请输入',
                            seq: 1, //排序 可以做id
                        },
                        {
                            factorCode: 'rule_holder', // key值 可以做id
                            defaultValue: '', // 默认值
                            factorValue: '', // value
                            inputBoxType: 'SELECT', // 是输入框，还是选择框
                            isDisplay: 'YES', // 是否显示
                            isRequired: 'YES', // 是否必录
                            placeHolder: '请选择对象',
                            seq: 2 //排序
                        },
                        {
                            factorCode: 'rule_of', // key值 可以做id
                            defaultValue: '的', // 默认值
                            factorValue: '', // value
                            inputBoxType: 'SELECT', // 是输入框，还是选择框
                            isDisplay: 'YES', // 是否显示
                            isRequired: 'YES', // 是否必录
                            placeHolder: '的',
                            seq: 3 //排序
                        },
                        {
                            factorCode: 'rule_operator', // key值 可以做id
                            defaultValue: '', // 默认值
                            factorValue: '', // value
                            inputBoxType: 'SELECT', // 是输入框，还是选择框
                            isDisplay: 'YES', // 是否显示
                            isRequired: 'YES', // 是否必录
                            placeHolder: ' 请选择操作符',
                            seq: 4 //排序
                        },
                        {
                            factorCode: 'rule_operator', // key值 可以做id
                            defaultValue: '', // 默认值
                            factorValue: '', // value
                            inputBoxType: 'INPUT', // 是输入框，还是选择框
                            isDisplay: 'YES', // 是否显示
                            isRequired: 'YES', // 是否必录
                            placeHolder: ' 请输入值',
                            seq: 5 //排序
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
            input: ''
        };
    },
    methods: {
        onChange(v) {
            console.log(v);
        },
        getValue: (key) => {
            if(key === 'rule_and_or'){
                return SelectData.AND_OR_DATA
            } else {
                return this.options;
            }
        }
    }
};
</script>

<style scoped>
.el-input {
    display: inline-block;
    width: 200px;
}
.line{
    display: flex;
}
</style>