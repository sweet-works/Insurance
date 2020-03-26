<template>
    <div>
        <div v-show="if_bl" v-for="data in dataModel" :key="data.id">
            <el-select v-model="data.key" placeholder="请选择1" v-if="data.type === 'select'">
                <el-option
                    v-for="item in `${data.data}`"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                ></el-option>
            </el-select>
            <span @click="cl_de" v-if="data.type === 'text'">{{data.data}}</span>
            <el-input v-model="inputValue1" placeholder="请输入内容" v-if="data.type === 'input'"></el-input>
        </div>
        <i class="el-icon-circle-close" @click="cl_close"></i>
    </div>
</template>

<script>
export default {};
</script>

<style>
</style>