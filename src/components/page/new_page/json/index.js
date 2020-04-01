/*
 * @Autor: fengming
 * @Date: 2020-03-30 09:40:59
 * @LastEditors: fengming
 * @LastEditTime: 2020-04-01 11:07:07
 * @Description: 
 */
const SelectData = {
    AND_OR_DATA: [
        { value: 'and', label: '并且' },
        { value: 'or', label: '或者' }
    ],
    HODER_DATA: [
        { value: 'insured', label: '个人保单' },
        { value: 'agent', label: '代理人' },
        { value: 'BomInsured', label: '被保险人' },
        { value: 'applicant', label: '投保人' },
        { value: 'BomPol', label: '险种' },
        { value: 'principalRisks', label: '主险' },
        { value: 'personProfits', label: '受益人' },
        { value: 'anotherAdditionInsurance', label: '另一附加险' },
        { value: 'additionInsurance', label: '附加险' },
    ],
    DE_DATA: [
        { value: 'issueCode', label: '的问题件代码是否为简单' },
        { value: 'reAccRiskAmnt',label:'的再保意外险风险保额'},
        { value : 'kindCode',label:'的险种类别'},
        { value : 'riskCode',label:'的险种编码'},
        { value: 'isSelfInsuring', label: '的自保互保标记' },
    ],
    OPERATOR_DATA: [
        { value: '>', label: '大于' },
        { value: 'in', label: '是以下之一' },
        { value: 'unin', label: '不是以下之一' },
        { value: 'yes', label: '是' },
        { value: 'no', label: '不是' },
        { value: 'endyes', label: '的结尾是' },
        { value: 'startyes', label: '的开头是' },
        { value: 'length', label: '的长度是' },
    ],
    LIST_DATA: [
        { value: '(', label: "增加'('" },
        { value: ')', label: "增加')'" },
        { value: 'andOr', label: "增加'并且'或'或者'" }
    ]
}
export default SelectData;
