const SelectData = {
    AND_OR_DATA: [
        {value: 'and',label: '并且'},
        {value: 'or',label: '或者'}
    ],
    HODER_DATA:[
        {value: '1',label: '个人保单'},
        {value: '2',label: '代理人'},
        {value: '3',label: '投保人'},
        {value: '4',label: '险种'},
        {value: '5',label: '主险'},
        {value: '6',label: '受益人'},
        {value: '7',label: '另一附加险'},
        {value: '8',label: '附加险'},
    ],
    DE_DATA:[
         {value: '1',label: '的问题件代码是否为简单'},
         {value: '2',label: '的本单总费用型医疗险风险保额'},
         {value: '3',label: '的本单高端费用型医疗险风险保额'},
         {value: '4',label: '的本单津贴型医疗险风险保额'},
         {value: '5',label: '的本单普通费用型医疗险风险保额'},
         {value: '6',label: '的本单重疾险风险保额'},
         {value: '7',label: '的本单寿险风险保额'},
         {value: '8',label: '的自保互保标记'},
         {value: '9',label: '的风险测评问卷是否存在'},
         {value: '10',label: '的风险特别提示是否存在'},
         {value: '11',label: '的预警信息'},
         {value: '12',label: '的管理机构差异化核保等级'},
         {value: '13',label: '的自核日期'},
         {value: '14',label: '的银行代理机构销售资质是否合格'},
         {value: '15',label: '的银行代理机构资格证书号码是否重复'},
         {value: '16',label: '的管理机构百团标记'},
         {value: '17',label: '的客户尽职调查问卷'},
         {value: '18',label: '的套餐标记'},
         {value: '19',label: '的可疑交易标记'},
         {value: '20',label: '的保单保费'},
         {value: '21',label: '的电子投保申请确认书扫描标记'},
         {value: '22',label: '的印刷号'},
         {value: '23',label: '的前置核保资料标记'},
    ],
    OPERATOR_DATA:[
         {value: 'null',label: '是空'},
         {value: 'unnull',label: '不是空'},
         {value: 'in',label: '是以下之一'},
         {value: 'unin',label: '不是以下之一'},
         {value: 'yes',label: '是'},
         {value: 'no',label: '不是'},
         {value: 'endyes',label: '的结尾是'},
         {value: 'startyes',label: '的开头是'},
         {value: 'length',label: '的长度是'},
    ],
    LIST_DATA:[
         {value: '(',label: "增加'('"},
         {value: ')',label: "增加')'"},
         {value: 'andOr',label: "增加'并且'或'或者'"}
    ]
}
export default SelectData;
