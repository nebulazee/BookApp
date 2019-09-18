import React, { Component } from 'react';
import './App.css';
import Main from './components/Main';
import {BrowserRouter} from 'react-router-dom';

//App Component
class App extends Component {
  constructor(props){
    super(props);
    this.state = {apiResponse: ""};
  }
  callAPI=()=>{
    fetch("http://localhost:3001/")
    .then(res => res.text())
    .then(res => this.setState({apiResponse: res}))
  }
  componentDidMount(){
    this.callAPI(); 
  }
  render() {
    return (
      //Use Browser Router to route to different pages
       <BrowserRouter>
        <div>
          
          <Main/>
         {/*  <p className="App-intro">{this.state.apiResponse}</p> */}
        </div>
      </BrowserRouter> 
      
    );
  }
}
//Export the App component so that it can be used in index.js
export default App;
