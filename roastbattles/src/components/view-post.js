//React
import React, { Component } from 'react';
import Nav from './navbar';
import Loading from './loading';
import PostNotFound from './post-not-found';
import Comments from './comments';
import Profile from './profile';

//Firebase
import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";
import "firebase/auth";

class ViewPost extends Component {
    constructor(props) {
        super(props);

        this.state = {contentLoading: true, postNotFound: false, docSnapshot: null}

        this.handleAuthChange = this.handleAuthChange.bind(this);
    };

    componentDidMount = () => {
        firebase.auth().onAuthStateChanged(this.handleAuthChange);
    }

    handleAuthChange(user) {
        if (user) {
            if (this.props.username === '') {
                window.location = '/set-username';
            }
            firebase.firestore().collection('posts').doc(this.props.match.params.id).get()
            .then((docSnapshot) => {
                if (!docSnapshot.exists) {
                    this.setState({postNotFound: true})
                }
                else {
                    this.setState({docSnapshot: docSnapshot})
                }
            })
            setTimeout(this.setState({contentLoading: false}), 1000);
        } else {
            //user is not logged in
            window.location = '/signin';
        }
    }

    render () {
        return (
           <div ref={this.wrapper}>
                {this.state.postNotFound ? (<PostNotFound/>) : (this.state.contentLoading ? (<Loading/>) : (
                <div>
                    <Nav/>

                    {this.state.docSnapshot && 
                    <div>
                        <Profile url={this.props.match.params.id} docData={this.state.docSnapshot}/>

                        <Comments url={this.props.match.params.id}/>
                    </div>}
                </div>
            ))}
        </div>
        )
  }
}

export default (ViewPost);