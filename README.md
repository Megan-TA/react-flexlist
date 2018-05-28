# react-flexlist

一个通用的下拉上滑刷新组件

```shell
npm install react-flexlist --save-dev
```

配置如下：

所有配置项写在 `options` 属性上，

- toDownTmpl 自定义下拉显示的背景 样式自己维护
- childrenClassName 被包裹住的子元素的最外层ClassName
- url 刷新请求的接口路径
- fetchMoreAction 上滑加载更多的action
- refreshAction 下拉刷新的action

示例如下：

```javasctipt
import ReactFlexList from 'react-flexlist'
<ReactFlexList
    options = {{
        toDownTmpl: `<div>这是自定义下拉背景的html<div>`,
        childrenClassName: 'test',
        url: '/react-flexlist.json',
        fetchMoreAction: '',
        refreshAction: ''
    }}
>
    <ul className= 'test'>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
    </ul>
</ReactFlexList>
```