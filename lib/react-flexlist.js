/*
 * 基于滚动条实现的上滑下拉刷新
 * @Author: chen_huang
 * @Date: 2018-05-25 18:57:10
 * @Last Modified by: chen_huang
 * @Last Modified time: 2018-06-12 12:21:02
 */
import React from 'react'

class ReactFlexList extends React.Component {
    constructor (props) {
        super(props)
        this.config = {
            // 滚动开关
            flag: true,
            appendToDownDOM: null,
            appendToDownDOMHeight: 0,
            wrapDOM: null,
            // 组件最外层BOX的DOM
            globalBoxDOM: null,
            // 下拉刷新提示文字dom
            toUpRefreshTxtDOM: null,
            pageNo: 1,
            timeout: null,
            init: true,
            // 用来记录列表切换tabName 用来判断当前列表数据源是否被切换过
            tabName: props.options.tabName || null,
            height: props.options.height || '500px'
        }
    }

    componentDidMount () {
        let _this = this
        let _startY = 0
        let _tempY = 0
        let _wrapDOM = null
        let _appendToDownDOM = null
        let _appendToDownDOMHeight = 0
        let _tempToResize = 0

        let {
            toDownTmplDOM
        } = this.config

        let {
            className
        } = this.props.children.props

        let globalBoxDOM = document.querySelectorAll('#react-flatlist')[0]
        this.config.globalBoxDOM = globalBoxDOM

        document.getElementsByTagName('body')[0].style.overflow = 'hidden'

        _wrapDOM = document.querySelectorAll(`.${className}`)[0]
        _appendToDownDOM = document.querySelectorAll('.toDownTmpl')[0]

        _appendToDownDOMHeight = -_appendToDownDOM.offsetHeight

        _appendToDownDOM.style.top = `${_appendToDownDOMHeight}px`

        Object.assign(this.config, {
            wrapDOM: _wrapDOM,
            appendToDownDOM: _appendToDownDOM,
            appendToDownDOMHeight: _appendToDownDOMHeight,
            toUpRefreshTxtDOM: document.querySelectorAll('.toUpRefreshTxt')[0]
        })

        // 初始化时滚动条在最顶端
        document.documentElement.scrollTop = 0

        globalBoxDOM.addEventListener('scroll', _this.resize.bind(_this), false)

        globalBoxDOM.addEventListener('touchstart', (e) => {
            if (!_this.allowMove()) return
            _startY = e.touches[0].pageY
            // 每次点击时重置为0
            _tempY = 0
        }, false)

        globalBoxDOM.addEventListener('touchmove', (e) => {
            // 防止下拉固定加载数据时再对页面进行滑动
            if (!_this.allowMove()) return
            _tempY = e.touches[0].pageY - _startY
            if (_tempY > 0) {
                if (globalBoxDOM.scrollTop == 0) {
                    _tempY /= 3
                    // 处理一些设备默认的事件 导致无法下拉的bug
                    e.preventDefault()
                    // 默认下拉有阻力
                    _tempToResize = _tempY + _this.config.appendToDownDOMHeight
                    _appendToDownDOM.style['top'] = `${_tempToResize}px`
                    _this.fixCompatibility(_wrapDOM, _tempY)
                }
            }
        }, false)

        globalBoxDOM.addEventListener('touchend', (e) => {
            if (!_this.allowMove()) return
            _this.loosen(_tempY)
        })
    }

    componentWillUnmount () {
        let _this = this
        document.getElementsByTagName('body')[0].style.overflow = ''
        console.log('组件已经被销毁')
    }

    resize () {
        if (!this.allowMove()) return
        let {
            globalBoxDOM,
            wrapDOM,
            moving
        } = this.config
        let _scrollY = 0
        // 组件外部盒子高度
        let _innerH = globalBoxDOM.offsetHeight

        // 子页面总高度
        let _scrollH = wrapDOM.offsetHeight
        if (!this.config.init) {
        // 当前滚动条位置
            _scrollY = globalBoxDOM.scrollTop
        } else {
            this.config.init = false
        }
        // console.log(_scrollY)

        if (
            this.config.flag &&
            _scrollY + _innerH >= _scrollH
        ) {
            this.config.flag = false
            return this._loadMore()
        }
        return false
    }

    /**
     * 处理css3动画兼容问题
     *
     * @param {any} dom
     * @param {any} distance
     * @param {number} [speend=0]
     * @memberof Flatlist
     */
    fixCompatibility (dom, distance, speed = 0) {
        dom.style['transform'] = `translateY(${distance}px)`
        dom.style['-moz-transform'] = `translateY(${distance}px)`
        dom.style['-webkit-transform'] = `translateY(${distance}px)`
        dom.style['-o-transform'] = `translateY(${distance}px)`

        dom.style['transition'] = `transform ${speed}s ease`
        dom.style['-moz-transition'] = `transform ${speed}s ease`
        dom.style['-webkit-transition'] = `transform ${speed}s ease`
        dom.style['-o-transition'] = `transform ${speed}s ease`
    }

    /**
     * 手松开复原逻辑
     *
     * @param {any} distance
     * @memberof Flatlist
     */
    loosen (distance) {
        let _this = this
        let TimeEntity = null
        let {
            options: {
                toDownDistance
            }
        } = this.props
        let {
            globalBoxDOM
        } = this.config
        toDownDistance = toDownDistance || 20
        // 必须是在列表盒子最顶层触发 其他位置滑动的时候不触发
        if (globalBoxDOM.scrollTop == 0 && distance > toDownDistance) {
            this.fixed()
            this.config.flag = false
            // document.getElementsByTagName('body')[0].style.overflowY = 'hidden'
            // 防止请求接口过快 还未固定就复原
            clearTimeout(TimeEntity)
            TimeEntity = setTimeout(function () {
                _this.refresh()
                    .then((resolved, rejected) => {
                        _this.config.flag = true
                        // document.getElementsByTagName('body')[0].style.overflowY = 'auto'
                        _this.recover()
                    })
            }, 1e3)
        } else {
            this.recover()
        }
    }

    allowMove () {
        return this.config.flag
    }

    /**
     * 恢复原状逻辑
     *
     * @memberof Flatlist
     */
    recover () {
        if (!this.allowMove()) return
        let {
            appendToDownDOM,
            wrapDOM,
            appendToDownDOMHeight
        } = this.config
        appendToDownDOM.style['transition'] = `transform 1s`
        appendToDownDOM.style['top'] = `${appendToDownDOMHeight}px`
        this.fixCompatibility(wrapDOM, 0, 0.5)
    }

    fixed () {
        let {
            appendToDownDOM,
            wrapDOM,
            appendToDownDOMHeight
        } = this.config
        let _temp = Math.abs(appendToDownDOMHeight)
        appendToDownDOM.style['transition'] = `transform 2s ease`
        appendToDownDOM.style['top'] = `0px`
        this.fixCompatibility(wrapDOM, _temp)
    }

    // 节流函数
    throttle (fn, waitTime, mustRunTime) {
        let timeout = null
        let _context = this
        let _arg = arguments
        let _startTime = new Date()
        let _extend = function () {
            return fn.apply(_context, _arg)
        }
        return function () {
            // _context.config.prevScrollLocation = window.scrollY
            if (!_context.config.flag) return
            let _curTime = new Date()
            clearTimeout(timeout)
            timeout = setTimeout(_extend, waitTime)
            // 到达设定的阈值，必须触发handler
            // if (_curTime - _startTime >= mustRunTime) {
            //     _extend()
            //     _startTime = _curTime
            // } else {
            //     // 未达到阈值 重新设定定时器
            //     timeout = setTimeout(_extend, waitTime)
            // }
            return false
        }
    }

    refresh () {
        let _refresh = this.props.options.refresh
        this.config.pageNo = 1
        return new Promise((resolve, reject) => {
            _refresh({
                pageNo: this.config.pageNo
            })
            console.log('已刷新新数据')
            resolve(true)
        })
    }

    _loadMore () {
        let _this = this
        let {
            options: {
                loadMore,
                tabName
            }
        } = this.props
        let {
            toUpRefreshTxtDOM
        } = this.config
        toUpRefreshTxtDOM.style['display'] = 'block'
        if (tabName == this.config.tabName) {
            this.config.pageNo += 1
        } else {
            this.config.pageNo = 2
            this.config.tabName = tabName
        }
        loadMore({
            pageNo: this.config.pageNo
        }).then((resolved, rejected) => {
            if (!resolved) {
                toUpRefreshTxtDOM.style['display'] = 'none'
                this.config.pageNo = this.config.pageNo - 1
                console.log('上滑未加载到新数据')
            }
            _this.config.flag = true
            toUpRefreshTxtDOM.style['display'] = 'none'
            console.log('已加载到新数据')
        })
        return false
    }

    render () {
        let {
            options: {
                toDownTmpl
            }
        } = this.props
        let {
            height
        } = this.config
        toDownTmpl
            ? toDownTmpl += `
                    <div 
                        class="fresh_text" 
                        style='padding: 10px 12px;text-align: center;font-size: 12px;color: #666;'
                        >松开刷新...</div>
                    `
            : toDownTmpl = `
        <div class="fresh_text" 
            style='padding: 10px 12px;text-align: center;font-size: 12px;color: #666;'
            >松开刷新...</div>`
        return (
            <div
                className='pullLoad__Wrap'
                id = 'react-flatlist'
                style = {{
                    position: 'relative',
                    overflowX: 'hidden',
                    overflowY: 'scroll',
                    height: height
                }}
            >
                <div
                    className = 'toDownTmpl'
                    style = {{
                        position: 'absolute',
                        width: '100%'
                    }}
                    dangerouslySetInnerHTML = {{__html: toDownTmpl}}
                >
                </div>
                {
                    this.props.children
                }
                <div
                    className = 'toUpRefreshTxt'
                    style = {{
                        textAlign: 'center',
                        height: '20px',
                        lineHeight: '20px',
                        display: 'none'
                    }}
                >
                        加载中...
                </div>
            </div>
        )
    }
}


export default ReactFlexList
