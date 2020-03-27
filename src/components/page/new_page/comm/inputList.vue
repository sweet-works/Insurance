<template>
    <div>
        <!-- <div>{{title}}</div> -->
        <el-select
            clearable 
            v-if="data.inputBoxType === 'SELECT'"
            v-model="value" 
            placeholder="请选择"
          >
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            ></el-option>
        </el-select>
        <el-input 
            clearable
            v-else-if="data.inputBoxType === 'INPUT'"
            v-model="input"
            placeholder="请输入内容"
        ></el-input>
        <span
            v-else-if="data.inputBoxType === 'STRING'"
        >{{data.factorValue}}</span>
        <!-- <el-button type="danger" plain @click="add">危险按钮</el-button> -->
    </div>
</template>

<script>
export default {
    props:['data','options'],
    data() {
        return {
            title: 'inputList',
             options2: [
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
        add() {
            console.log(this.data)
        }
    }
};
</script>

<style scoped>
.el-input {
    display: inline-block;
    width: 200px;
}
</style>