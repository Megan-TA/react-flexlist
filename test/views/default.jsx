let React = require('react')

module.exports = class Layout extends React.Component {
    render () {
        return (
            <html style={{fontSize: '20px'}}>
                <head>
                    <title>{this.props.title}</title>
                </head>
                <body>
                        {
                            this.props.children
                        }
                    </body>
            </html>
        )
    }
}