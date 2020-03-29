<template>
    <div  @contextmenu.prevent="rightClick(lineId,data.seq,$event)">
        <el-select
            clearable 
            v-if="data.inputBoxType === 'SELECT'"
            v-model="data.factorValue" 
            placeholder="请选择"
            @change="((val) => {onChange(val, data.factorCode,lineId,data.seq)})"
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
            v-model="data.factorValue"
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
    props:['data','lineId','options','onChange','rightClick'],
    data() {
        return {
            title: 'inputList',
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