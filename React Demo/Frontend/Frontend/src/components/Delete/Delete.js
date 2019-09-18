import React, {Component} from 'react';
import cookie from 'react-cookies';
import {Redirect} from 'react-router'
import axios from 'axios';
class Delete extends Component{
    constructor(){
        super();
        this.state={
            bookId:"",
            message:""
        }
        this.deleteIdHandler=this.deleteIdHandler.bind(this);
    }
    
    deleteBook = (e)=>{
        e.preventDefault();
        axios.defaults.withCredentials=true;
        const data={
            bookId:this.state.bookId
        }
        axios.post('http://localhost:3001/deleteBook',data)
        .then((response)=>{
            this.setState({
                message:response.data
            })
        })
        

    }
    deleteIdHandler = (e)=>{
        this.setState({
            bookId:e.target.value
        })
    }
    render(){
        let checkSession = null;
        if (!cookie.load('cookie')) {
            checkSession = <Redirect to="/login" />;
        }
        let message = null;
        message=this.state.message;   
        return(
            
            <div class="container">
                {checkSession}

                <form>
                    <div style={{width: "50%",float: "left"}} class="form-group">
                        <input  type="text" onChange={this.deleteIdHandler} class="form-control" name="BookID" placeholder="Search a Book by Book ID"/>
                    </div>
                    <div style={{width: "50%", float: "right"}}>
                            <button onClick={this.deleteBook} class="btn btn-success" type="submit">Delete</button>
                    </div> 
                </form>
                <h1>{message}</h1>
            </div>
        )
    }
}

export default Delete;