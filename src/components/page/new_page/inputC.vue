<template>
    <div>
        <!-- <h1 class="if" @click="cl_if">如果:</h1> -->
        <div v-show="if_input">
            <el-select v-model="value" placeholder="请选择">
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    @change="tap"
                ></el-option>
            </el-select>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            if_input: false,
            options: [
                {
                    value: '选项1',
                    label: '被保人'
                },
                {
                    value: '选项2',
                    label: '代理人'
                }
            ],
            value: ''
        };
    }
};
</script>

<style scoped>
.el-icon-plus,
.el-icon-circle-close {
    color: blue;
    font-size: 35px;
}
.if {
    color: blue;
}
</style>