// @flow
import React, { Component } from 'react'
import moment from 'moment'
import PostTokenContract from '../build/contracts/PostToken.json'
import List from './components/List'
import getWeb3 from './utils/getWeb3'

type Props = {
	message: string;
};

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      web3: null,
  	  title: '',
  	  content: '',
  	  posts: []
    }
    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.onTextAreaChange = this.onTextAreaChange.bind(this)
  }

  componentWillMount() {
    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      this.updatePosts()
    })
    .catch((e) => {
	  console.log(e)
      console.log('Error finding web3.')
    })
  }

  onChange(event) {
    this.setState({ title: event.target.value })
  }

  onTextAreaChange(event) {
	this.setState({ content: event.target.value })
  }

  onSubmit() {
  	const contract = require('truffle-contract')
    const postToken = contract(PostTokenContract)
    postToken.setProvider(this.state.web3.currentProvider)

    let postTokenInstance
    this.state.web3.eth.getAccounts((error, accounts) => {
      postToken.deployed().then((instance) => {
      	postTokenInstance = instance
        return postTokenInstance.mint(this.state.title, this.state.content, {from: accounts[0], gas: 1000000})
	  }).then((result) => {
	  	let posts = this.state.posts
		const post = {
	      "title": this.state.title,
	      "content": this.state.content,
	      "mintedBy": accounts[0],
	      "mintedAt": moment().unix()
	    }
		posts.push(post)
		this.setState({ posts: posts })
	  }).catch((e) => {
	  	console.log('Error mint')
        console.error(e)
	  })
	})
  }

  updatePosts() {
  	const contract = require('truffle-contract')
    const postToken = contract(PostTokenContract)
    postToken.setProvider(this.state.web3.currentProvider)

    let postTokenInstance
    this.state.web3.eth.getAccounts((error, accounts) => {
      postToken.deployed().then((instance) => {
        postTokenInstance = instance
        return postTokenInstance.getAllPosts({from: accounts[0]})
	  }).then((response) => {
	  	for (let i = 0; i < response.length; i++) {
	  		console.log(response[i])
  			postTokenInstance.getPost(response[i], {from: accounts[0]})
  			.then((response) => {
  				let posts = this.state.posts
  				const post = {
		          "title": response[0].toString(),
		          "content": response[1].toString(),
		          "mintedBy": response[2].toString(),
		          "mintedAt": response[3].toString()
		        }
  				posts.push(post)
  				this.setState({ posts: posts })
  			}).catch((e) => {
			  console.log('Error getPost')
	          console.error(e)
		    })
		}
	  }).catch((e) => {
	  	console.log('Error getAllPosts')
        console.error(e)
	  })
  	})
  }

  render() {
  	return (
  		<div>
	  		<div class="hero is-info is-bold">
	  			<div class="hero-body">
	  				<div class="container">
			 			<h1 class="title">Decentralized BBS</h1>
			 			<h2 class="subtitle">{this.props.message}</h2>
		 			</div>
	 			</div>
	 		</div>
	 		<div>
	 			<form action="javascript:void(0)" onSubmit={this.onSubmit}>
		 			<input class="input" type="text" placeholder="タイトル" value={this.state.title} onChange={this.onChange}  />
		 			<textarea class="textarea" placeholder="内容" onChange={this.onTextAreaChange}>{this.state.content}</textarea>
		 			<input class="button" type="submit" value="投稿する" />
	 			</form>
	 		</div>
	 		<List posts={this.state.posts} />
 		</div>
	);
  }
}

export default App;