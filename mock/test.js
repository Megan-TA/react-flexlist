/*
 * 列表页数据
 * @Author: chen_huang
 * @Date: 2018-05-22 17:13:46
 * @Last Modified by: chen_huang
 * @Last Modified time: 2018-06-11 19:17:47
 */
import Mock from 'mockjs'

const Random = Mock.Random

const INIT = {
    orderStatus: 0,
    personNum: 0
}

const getOrderList = Mock.mock(/getOrderList\.json/, {
    'data|6-10': [{
        'orderId': '@increment',
        'uid|1': '@guid'
    }]
})

module.exports = getOrderList
