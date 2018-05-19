// @flow
import React, { Component } from 'react'
import Post from './Post'

class List extends Component {
	render() {
		const posts = this.props.posts;
		let postList = []
		for (let i in posts) {
			postList.push(<li key={i}><Post post={posts[i]} /></li>)
		}
		return (<ul>{postList}</ul>);
	}
}

export default List