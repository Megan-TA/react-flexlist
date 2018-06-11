/*
 * 自定义mock数据 
 * 
 * @Author: chen_huang 
 * @Date: 2018-05-22 17:11:59 
 * @Last Modified by: chen_huang
 * @Last Modified time: 2018-06-11 18:40:38
 */
import getOrderList from './test'

function Ajax (url, optiopns, method = 'post') {
    return new Promise ((resolve, reject) => {
        let ajax = new XMLHttpRequest()

        ajax.open(method, url)
    
        ajax.setRequestHeader("Content-type","application/x-www-form-urlencoded")
    
        ajax.send(optiopns)
    
        ajax.onreadystatechange = () => {
            if (
                ajax.readyState == 4
                && ajax.status == 200
            ) {
                return resolve(JSON.parse(ajax.responseText))
            }
        }
    })
    .catch(err => {
        console.error(err)
    })
}


module.exports = {
    Ajax,
    getOrderList
}