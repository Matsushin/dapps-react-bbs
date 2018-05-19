// @flow
import React, { Component } from 'react'
import Moment from 'react-moment'

class Post extends Component {
	render() {
        return (
            <div className="kakikomi">
                <div>{this.props.post.title}</div>
                <p className="name">{this.props.post.content}</p>
                <Moment unix format="YYYY/MM/DD HH:mm:ss">{this.props.post.mintedAt}</Moment>
            </div>
        );
    }
}

export default Post