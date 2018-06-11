let React = require('react')
let Layout = require('./default')
let PullLoad = require('./react-flexlist')

const Style = {
    li: {
        lineHeight: 3,
        height: '200px',
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
                        >{item}</li>
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
            data: [1,2,3,4,5,6,7,8,9,10,11,12]
        }
        this.refresh = this.refresh.bind(this)
        this.loadMore = this.loadMore.bind(this)
    }

    refresh () {
        this.setState({
            data: [1,2,3,4,5,6,7,8,9,10,11,12]
        })
    }

    loadMore () {
        
        this.setState({
            data: this.state.data.concat([20])
        })
    }

    render () {
        let {
            data
        } = this.state
        return (
            <Layout
                test = {{
                    name: '张三'
                }}
            >
                <div>
                    <PullLoad
                        options = {{
                            childrenClassName: 'reactFlexList',
                            refresh: this.refresh,
                            loadMoreL: this.loadMore
                        }}
                    >
                        {
                            ListWrap({
                                data: data
                            })
                        }
                    </PullLoad>
                </div>
            </Layout>
        )
    }
}

module.exports = Index