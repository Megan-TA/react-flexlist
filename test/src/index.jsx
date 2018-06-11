import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PullLoad from '../../lib'
import 'babel-polyfill'
import { Ajax, getOrderList } from '../../mock'

let Num = 11

const Style = {
    li: {
        lineHeight: 3,
        height: '100px',
        fontSize: '1rem'
    }
}

const ListWrap = ({data}) => {
    return (
        <ul className = 'reactFlexList'>
            {
                data.map((item, index) => {
                    return (
                        <li 
                            key = {index}
                            style = {Style.li}
                        >{item.uid}</li>
                    )
                })
            }
        </ul>
    )
}

class Index extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            data: []
        }
        this.config = {
            height: 0
        }
        this.refresh = this.refresh.bind(this)
        this.loadMore = this.loadMore.bind(this)
    }

    componentDidMount () {
        let _data = this.state.data
        this.config.height = window.innerHeight - document.getElementById('header').offsetHeight
        Ajax('/getOrderList.json')
            .then((resolved, rejected) => {
                let a = _data.concat(resolved.data)
                this.setState({
                    data: a
                })
            })
    }

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

    render () {
        let {
            data
        } = this.state
        let _height = this.config.height
        return (
            <div>
                <div id='header'>
                    我是头部
                </div>
                {
                    data.length == 0
                        ? null
                        : <PullLoad
                            options = {{
                                childrenClassName: 'reactFlexList',
                                refresh: this.refresh,
                                loadMore: this.loadMore,
                                height:  _height
                            }}
                        >
                            {
                                ListWrap({
                                    data: data
                                })
                            }
                        </PullLoad>
                }

            </div>
        )
    }
}

ReactDOM.render(
    <Index />,
    document.getElementById('root')
)
