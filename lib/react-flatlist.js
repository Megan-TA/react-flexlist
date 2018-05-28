/*
 * 基于滚动条实现的上滑下拉刷新
 * @Author: chen_huang 
 * @Date: 2018-05-25 18:57:10 
 * @Last Modified by: chen_huang
 * @Last Modified time: 2018-05-28 15:04:32
 */
import React from 'react'

import { Ajax } from '../mock'

export default class Flatlist extends React.Component {

    constructor (props) {
        super(props)
        this.config = {
            // 滚动开关
            flag: true,
            appendToDownDOM: null,
            appendToDownDOMHeight: 0,
            wrapDOM: null,
            // 下拉刷新提示文字dom
            toUpRefreshTxtDOM: null
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
            options: {
                childrenClassName,
            }
        } = this.props
       
        _wrapDOM = document.querySelectorAll(`.${childrenClassName}`)[0]
        _appendToDownDOM = document.querySelectorAll('.toDownTmpl')[0]

        _appendToDownDOMHeight = -_appendToDownDOM.offsetHeight

        _appendToDownDOM.style.top = `${_appendToDownDOMHeight}px`

        Object.assign(this.config, {
            wrapDOM: _wrapDOM,
            appendToDownDOM: _appendToDownDOM,
            appendToDownDOMHeight: _appendToDownDOMHeight,
            toUpRefreshTxtDOM: document.querySelectorAll('.toUpRefreshTxt')[0]
        })

        window.addEventListener('scroll', _this.resize.bind(_this), false)
        
        window.addEventListener('touchstart', (e) => {
            _startY = e.touches[0].pageY
            // 每次点击时重置为0
            _tempY = 0
        }, false)
        
        window.addEventListener('touchmove', (e) => {
            _tempY = e.touches[0].pageY - _startY
            if (_tempY > 0) {
                if (window.scrollY == 0) {
                    // 处理一些设备默认的事件 导致无法下拉的bug
                    e.preventDefault()
                    _tempToResize = _tempY + _this.config.appendToDownDOMHeight
                    _appendToDownDOM.style['top'] = `${_tempToResize}px`
                    _this.fixCompatibility(_wrapDOM, _tempY)
                }
            }
        }, false)

        window.addEventListener('touchend', (e) => {
            _this.loosen(_tempY)
        })
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
        dom.style['transform'] =  `translateY(${distance}px)`
        dom.style['-moz-transform'] =  `translateY(${distance}px)`
        dom.style['-webkit-transform'] =  `translateY(${distance}px)`
        dom.style['-o-transform'] =  `translateY(${distance}px)`

        dom.style['transition'] =  `transform ${speed}s ease`
        dom.style['-moz-transition'] =  `transform ${speed}s ease`
        dom.style['-webkit-transition'] =  `transform ${speed}s ease`
        dom.style['-o-transition'] =  `transform ${speed}s ease`
    }

    /**
     * 手松开复原逻辑
     * 
     * @param {any} distance 
     * @memberof Flatlist
     */
    loosen (distance) {
        let _this = this
        if (distance > 30) {
            this.fixed()
            setTimeout(function () {
                _this.refresh()
                .then((resolved, rejected) => {
                    _this.recover()
                })
            }, 1000)
        } else {
            this.recover()
        }
    }

    /**
     * 恢复原状逻辑
     * 
     * @memberof Flatlist
     */
    recover () {
        let {
            appendToDownDOM,
            wrapDOM,
            appendToDownDOMHeight
        } = this.config
        appendToDownDOM.style['transition'] =  `transform 1s`
        appendToDownDOM.style['top'] =  `${appendToDownDOMHeight}px`
        this.fixCompatibility(wrapDOM, 0, 0.5)
    }

    _requestAnimationFrame () {
        let {
            appendToDownDOM,
            appendToDownDOMHeight
        } = this.config
        let i = 0

        function step () {
            i -= 5
            if (i >= appendToDownDOMHeight) {
                appendToDownDOM.style['top'] = `${i}px`
                requestAnimationFrame(step)
            } else {
                appendToDownDOM.style['top'] = `${appendToDownDOMHeight}px`
            }
        }

        return requestAnimationFrame(step)
    }

    fixed () {
        let {
            appendToDownDOM,
            wrapDOM,
            appendToDownDOMHeight
        } = this.config
        let _temp = Math.abs(appendToDownDOMHeight)
        appendToDownDOM.style['transition'] =  `transform 0.5s ease`
        appendToDownDOM.style['top'] = `0px`
        this.fixCompatibility(wrapDOM, _temp)
        // wrapDOM.style['transform'] = `translateY(${_temp}px)`
    }

    resize () {
        // 当前滚动条位置
        let _scrollY = window.scrollY
        // 设备物理高度
        let _innerH = window.innerHeight
        // 整个页面总高度
        let _scrollH = document.body.scrollHeight
        if (this.config.flag) {
            if (_scrollY + _innerH >= _scrollH) {
                this.config.flag = false
                return this.loadMore()
            }
        }
        return
    }

    async refresh () {
        let {
            options: {
                url,
                refreshAction
            }
        } = this.props
        let res = await Ajax(url)
        return refreshAction(res)
    }

    async loadMore () {
        let {
            options: {
                url,
                fetchMoreAction
            }
        } = this.props

        let {
            toUpRefreshTxtDOM
        } = this.config
        toUpRefreshTxtDOM.style['display'] = 'block'
        let res = await Ajax(url)
        if (!res) {
            toUpRefreshTxtDOM.style['display'] = 'none'
            console.log('上滑未加载到新数据')
        }
        this.config.flag = true
        toUpRefreshTxtDOM.style['display'] = 'none'
        return fetchMoreAction(res)
    }

    render () {
        let {
            options: {
                toDownTmpl
            }
        } = this.props
        toDownTmpl
        ? toDownTmpl += `
                    <div 
                        class="fresh_text" 
                        style='padding: 10px 12px;text-align: center;font-size: 12px;color: #666;'
                        >松开刷新...</div>
                    `
        : toDownTmpl = `
        <div class="fresh_text" 
            style='padding: 10px 12px;text-align: center;font-size: 12px;color: #666;
            >松开刷新...</div>`
        return (
            <div 
                    className='pullLoad__Wrap'
                    style = {{
                        position: 'relative'
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