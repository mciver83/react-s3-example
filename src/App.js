import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios'

import  ReactS3Uploader from 'react-s3-uploader';

class App extends Component {
  constructor() {
    super()
    this.state = {
      images: []
    }
  }

  componentDidMount() {
    axios.get('/api/images').then(response => {
      this.setState({
        images: response.data
      })
    }) 
  }

  onFinish = (response, anything, third) => {
    let imageUrl = response.signedUrl.split('?').shift()
    axios.post('/api/images', { imageUrl }).then(response => {
      this.setState({
        images: [ ...this.state.images, response.data ]
      })
    }) 
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <ReactS3Uploader 
          signingUrl="/s3/sign" 
          accept="image/*" 
          onFinish={this.onFinish}
          uploadRequestHeaders={{ 'x-amz-acl': 'public-read' }}/>
        <div style={{display: 'flex', flexWrap: 'wrap'}}>
          {this.state.images.map(image => {
            return (
              <div key={image.id} style={{margin: 10}}>
                <img src={image.image_url} alt="" height='200'/>
              </div>
            )
          })}
        </div>
      </div>
    );
  }
}

export default App;
