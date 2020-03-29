<template>
    <div class="box">
        <ul
            ref="addParentheses"
            v-show="addParentheses"
            class="addParentheses"
            @click="addParentTap"
        >
            <li v-for="(i,index) in list" :key="index">{{i}}</li>
        </ul>
        <p class="title" @click="cl_if">如果:</p>
        <div v-for="item in dataModel" v-show="show" :key="item.id">
            <div class="box_fir">
                <div class="title zhanwei">{{item.title}}</div>
                <!-- 占位 -->
                <div
                    v-show="item.show"
                    v-for="data in item.data"
                    :key="data.id"
                    @contextmenu.prevent="rightClick(item.id, data.id, $event)"
                >
                    <el-select
                        v-model="data.value"
                        :placeholder="data.placeholder"
                        v-if="(data.type === 'select') && getShow(item.id, data.id) || data.key === 'select_if'"
                    >
                        <el-option
                            v-for="item in getData(data.key)"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                    <span
                        @click="cl_de(item.id, data.id)"
                        v-if="data.type === 'text' && getShow(item.id, data.id)|| data.key === 'kuohao'"
                    >{{data.content}}</span>
                    <el-input
                        v-model="data.value"
                        :placeholder="data.placeholder"
                        v-if="data.type === 'input' && getShow(item.id, data.id)"
                    ></el-input>
                </div>
                <i class="el-icon-circle-close" @click="cl_close(item.id)"></i>
            </div>
        </div>
        <i class="el-icon-plus" v-show="show" @click="add"></i>
        <p class="title">那么:
        <!-- 自核结果 -->
            <el-select
                v-model="self_verification"
                placeholder="请选择"
                style="margin-bottom: 14px; margin-left: 10px"
            >
                <el-option
                    v-for="item in options4"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                ></el-option>
            </el-select>
        </p>
        <div>
        结果: <el-input v-model="result" style="margin-bottom: 14px; margin-left: 30px"></el-input><br/>
        转人工核保级别: 
            <el-select
                v-model="uwlevel"
                placeholder="请选择"
                style="margin-bottom: 14px; margin-left: 10px"
            >
                <el-option
                    v-for="item in level_option"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                ></el-option>
            </el-select>
        </div>
        <el-button type="info" @click="submit">提交</el-button>
        <!-- <h1 class="title">{{ content }}</h1> -->
        <h1 class="title">{{ dataModel }}</h1>
    </div>
</template>
<script>
let COUNT = 0; // 计数
export default {
    data() {
        return {
            self_verification: '', // 自核select结果
            show: true,
            addParentheses: false,
            list:["增加'('","增加')'","增加'并且'","增加'或者'"],
            IdObject:{}, //存放id
            top: 0,
            left: 0,
            content: {},
            dataModel: [],
            lastResult: {},
            ruleCode: '',
            result: '',
            rulech: '',
            statement: '',
            boms: '',
            uwlevel: '',
            bomInsured: [
                {
                    value: 'bomInsured',
                    label: '被保人'
                },
                {
                    value: 'bomInsured2',
                    label: '险种'
                }
            ],
            options2: [
                {
                    value : 'reAccRiskAmnt',
                    label: '再保意外险风险保额'
                },
                {
                    value: '险种类别',
                    label: '险种类别'
                },
                {
                    value: '险种编码',
                    label: '险种编码'
                }
            ],
            options3: [
                {
                    value: '>',
                    label: '大于 '
                },
                {
                    value: 'in',
                    label: '是以下的其中之一'
                },
                {
                    value: 'not in',
                    label: '不是以下的其中之一'
                }
            ],
            options4: [
                {
                    value: '自核通过',
                    label: '自核通过 '
                },
                {
                    value: '自核不通过',
                    label: '自核不通过'
                }
            ],
            level_option: [
                {
                    value: 'A',
                    label: 'A '
                },
                {
                    value: 'B',
                    label: 'B'
                }
            ]
        };
    },
    mounted(){
        let SessData = sessionStorage.getItem('data')
        this.dataModel = SessData ? JSON.parse(SessData) : []
        let that =this;
        document.addEventListener('click',e=>{
            if(!that.$refs.addParentheses.contains(e.target)){
                that.addParentheses=false //这句话的意思是点击其他区域关闭（也可以根据自己需求写触发事件）
            }
        })
    },
    methods: {
        getData(key) {
            return key === 'select_if' ? this.bomInsured : key === 'select_02' ? this.options2 : key === 'select_03' ? this.options3 : [];
        },
        getShow(id, keyid) {
            let keyArr = ['select_if'];
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
            return bl;
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
            let boundData= e.target.getBoundingClientRect();
            let ul = document.querySelector('.addParentheses');
            let contentBox= document.querySelector('.content-box');
            // console.log(contentBox.offsetTop, 'box.offsetTop')
            // console.log(contentBox.offsetLeft, 'box.offsetLeft')
            let top = e.clientY - contentBox.offsetTop-e.offsetY-10+'PX';
            let left= e.clientX - contentBox.offsetLeft-e.offsetX-10+'PX'
            ul.style.left=left;
            ul.style.top=top;
            ul.style.width= boundData.width-2+ 'px';
            this.addParentheses = true;
            this.IdObject={id,keyid}
        },
        // 添加括号
        addParent(id, keyid, oper,leftOrRight) {
            let newData = [];
            let datas = this.dataModel.filter(item => item.id === id)[0].data;
            let left = { id: datas.length + 1, type: 'text', content: oper, key: 'kuohao', value: '' };
            let and =  { id: datas.length + 2, type: 'select', key: 'select_if', value: '', placeholder: '请选择' }
            let and2 = { id: datas.length + 3, type: 'text', content: '的', key: 'text_de', value: '' }
            let and3 = { id: datas.length + 4, type: 'select', data: this.options2, key: 'select_02', value: '', placeholder: '请选择' }
            let and4 = { id: datas.length + 5, type: 'select', data: this.options2, key: 'select_03', value: '', placeholder: '请选择符号' }
            let and5 = { id: datas.length + 6, type: 'input', data: this.options3, key: 'input_01', value: '', placeholder: '请输入内容' }
            for (let i = 0; i < datas.length; i++) {
                if (datas[i].id == keyid) {
                    if(leftOrRight === 'left'){
                        newData.push(left, datas[i]); // 加前边
                    } else if (leftOrRight === 'right'){
                        if(oper === '并且'){
                            newData.push(datas[i],left,and,and2,and3,and4,and5); // 加后边
                        } else {
                            newData.push(datas[i],left); // 加后边
                        }
                    }
                } else {
                    newData.push(datas[i]);
                }
            }
            this.dataModel.filter(item => item.id === id)[0].data = newData;
            this.addParentheses = false;
        },
        addParentTap(e) {
            let content = e.target.innerHTML;
            let list=this.list;
            let oper='';
            let leftOrRight = 'left';
           switch(content) {
                case list[0]:
                    oper = '(';
                    break;
                case list[1]:
                    oper = ')';
                    break;
                case list[2]:
                    oper = '并且';
                    break;
                case list[3]:
                    oper = '或者';
                    break;
                default:
                    break;
            } 
            if(oper === ")"){
                leftOrRight = 'right'
            }
            if(oper === "并且" || oper === "或者"){
                leftOrRight = 'right'
            }
            let {id, keyid} = this.IdObject;
            if(!oper)return;
            this.addParent(id, keyid, oper, leftOrRight)
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
            sessionStorage.setItem('data',JSON.stringify(data));
            console.log(data);
            let strs = 'if,';
            data.map(item => {
                let str = '';
                item.data.map(ite => {
                    str += ite.value;
                });
                str += '&&,';
                strs += str;
                // console.log(strs)
                // console.log(strs.slice(0,-3))
                this.rulech = strs.slice(0,-3)
            });
            this.ruleCode = '00000000000000001255'
            let content = {
                ruleCode:  this.ruleCode,
                result: this.result,
                rulech: this.rulech,
                statement: this.statement,
                boms: this.boms,
                uwlevel: this.uwlevel
            }
            this.content = content
            console.log(content)
            console.log(this.dataModel)
        },
        closeMenu() {
            this.addParentheses = false;
        }
    }
};
</script>

<style scoped style="scss">
.box{
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
.addParentheses {
    min-width: 100px;
    /* height: 40px; */
    position: absolute;
    z-index: 9999;
    border: solid 1px #ccc;
    background-color: #409EFF;
    color: #fff;
    /* background: pink */
}
ul > li {
    list-style: none;
}
</style>