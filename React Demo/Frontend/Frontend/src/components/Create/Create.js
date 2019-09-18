import React, {Component} from 'react';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import axios from 'axios';
class Create extends Component{
    
    constructor(props){
        super(props);
        this.state={
            bookID : "",
            title : "",
            author : "",
            errMsg : "",
            successMsg : ""
        };    
        this.bookIdHandler = this.bookIdHandler.bind(this);
        this.titleHandler = this.titleHandler.bind(this);
        this.authorHandler = this.authorHandler.bind(this);
        //this.idHandler = this.bookIdHandler.bind(this);
        this.addBook = this.addBook.bind(this)
    }
    bookIdHandler = (e)=>{
        this.setState({
            bookID : e.target.value,
            errMsg : "",
            successMsg : ""
        })
    }
    titleHandler = (e)=>{
        this.setState({
            title : e.target.value
        })
    }
    authorHandler = (e)=>{
        this.setState({
            author : e.target.value
        })
    }
    addBook(e){
        console.log("hello i am adding");
        e.preventDefault();
        const data = {
            BookID : this.state.bookID,
            Author : this.state.author,
            Title : this.state.title
        }
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        console.log("before adding"+data.bookID)
        axios.post('http://localhost:3001/createBook',data)
            .then(response => {
                console.log("Status Code : ",response.status);
                if(response.status === 200){
                    this.setState({
                        authFlag : true,
                        errMsg : response.data.errMsg,
                        successMsg : response.data.data
                    })
                }

            });
    }
    render(){
        let checkSession = null;
        if (!cookie.load('cookie')) {
            checkSession = <Redirect to="/login" />;
        }
        let message=null;
        if(this.state.errMsg!=""){
            message = this.state.errMsg;
        }
        else{
            message = this.state.successMsg;
        }
        return(
            <div>
                {checkSession}
                <br/>
                <div class="container">
                    <form  method="post">
                        <div style={{width: '30%'}} class="form-group">
                            <input  type="text" class="form-control" onChange={this.bookIdHandler} name="BookID" placeholder="Book ID"/>
                        </div>
                        <br/>
                        <div style={{width: '30%'}} class="form-group">
                                <input  type="text" class="form-control" onChange={this.titleHandler} name="Title" placeholder="Book Title"/>
                        </div>
                        <br/>
                        <div style={{width: '30%'}} class="form-group">
                                <input  type="text" class="form-control" onChange={this.authorHandler} name="Author" placeholder="Book Author"/>
                        </div>
                        <br/>
                        <div style={{width: '30%'}}>
                            <button class="btn btn-success" onClick = {this.addBook} >Create</button>
                        </div> 
                    </form>
                    <h1>{message}</h1>
                </div>
            </div>
        )
    }
}

export default Create;