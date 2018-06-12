# react-flexlist

一个通用的下拉上滑刷新组件

```shell
npm install react-flexlist --save-dev
```

> 配置如下

建议配合`redux`编写 每次触发refresh或者loadMore事件的时候 需要外部改变data的值 redux这方面做的不错

所有配置项写在 `options` 属性上，

- toDownTmpl 自定义下拉显示的背景 样式由用户维护
- height 默认列表外层盒子高度 默认500px
- tabName 如果有多个下拉刷新列表 需要传入每次切换对应的列表name 默认'' （单个列表无需传值）
- refresh  下拉刷新事件（必须是一个promise） 由用户自己维护
- loadMore 上滑加载更多的事件（必须返回是一个promise）由用户自己维护
- toDownDistance 向下拖动的距离（单位：Number） 默认100px

> 小提示

refresh/loadMore 采用new Promise最好 async/await需要额外引入babel-polyfill

> 特别说明

1. 如果初始列表数据/刷新数据 小于设置的外层盒子高度 默认不会触发上滑，只有下拉刷新事件

2. 需要在项目下自行引入react、react-dom、babel等react运行环境所需的库

示例如下：

```javasctipt
import ReactFlexList from 'react-flexlist'

refresh () {
    let _data = this.state.data
    return Ajax('/getOrderList.json')
        .then((resolved, rejected) => {
            let a = resolved.data
            this.setState({
                data: a
            })
            return a
        })
}

loadMore () {
    let _data = this.state.data
    return Ajax('/getOrderList.json')
        .then((resolved, rejected) => {
            let a = _data.concat(resolved.data)
            this.setState({
                data: a
            })
            return a
        })
}

<ReactFlexList
    options = {{
        toDownTmpl: `<div>这是自定义下拉背景的html<div>`,
        childrenClassName: 'test',
        height: '200px',
        refresh: refresh,
        loadMore: loadMore,
        toDownDistance: 300
    }}
>
    <ul className= 'test'>
        {
            data.list.map((item, index) => {
                return (
                    <li key = {index}>{item}</li>
                )
            })
        }
    </ul>
</ReactFlexList>
```