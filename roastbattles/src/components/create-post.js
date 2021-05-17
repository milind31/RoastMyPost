import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { withStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';


import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";
import "firebase/auth";

const styles = {
    form: {
        backgroundColor: '#242323',
        alignItems: 'center'
    },
    button: {
        backgroundColor: '#ed6c09'
    },
    fileUpload: {
        alignItems: 'center'
    }
}

//create post page
//TODO:
//REDIRECT BACK IF POST ALREADY EXISTS
//FIGURE OUT FILE UPLOAD WITH BACKEND
class CreatePost extends Component {
    constructor(props) {
        super(props);

        this.handleAuthChange = this.handleAuthChange.bind(this);
        this.onChangeMusic = this.onChangeMusic.bind(this);
        this.onChangeAge = this.onChangeAge.bind(this);
        this.onChangeDayAsOtherPerson = this.onChangeDayAsOtherPerson.bind(this);
        this.onChangeHobbies = this.onChangeHobbies.bind(this);
        this.onChangePeeves = this.onChangePeeves.bind(this);
        this.onChangeSelfRating = this.onChangeSelfRating.bind(this);
        this.onChangeGuiltyPleasure = this.onChangeGuiltyPleasure.bind(this);
        this.onChangeOtherInfo = this.onChangeOtherInfo.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            music: '',
            age: '',
            dayAsOtherPerson: '',
            hobbies: '',
            peeves: '',
            selfRating: '',
            guiltyPleasure: '',
            otherInfo: '',
        }
    }

    componentDidMount = () => {
        firebase.auth().onAuthStateChanged(this.handleAuthChange);
    }

    handleAuthChange(user) {
        if (user) {
            //user is logged in
        } else {
            //user is not logged in
            window.location = '/signin';
        }
    }

    onChangeMusic(e) {
        this.setState({
            music: e.target.value
        });
    }

    onChangeAge(e) {
        this.setState({
            age: e.target.value
        });
    }

    onChangeDayAsOtherPerson(e) {
        this.setState({
            dayAsOtherPerson: e.target.value
        });
    }

    onChangeHobbies(e) {
        this.setState({
            hobbies: e.target.value
        });
    }

    onChangePeeves(e) {
        this.setState({
            peeves: e.target.value
        });
    }

    onChangeSelfRating(e) {
        this.setState({
            selfRating: e.target.value
        });
    }

    onChangeGuiltyPleasure(e) {
        this.setState({
            guiltyPleasure: e.target.value
        });
    }

    onChangeOtherInfo(e) {
        this.setState({
            otherInfo: e.target.value
        });
    }

    onSubmit(e) {
        e.preventDefault();
        
        const post = {
            music: this.state.music,
            age: this.state.age,
            dayAsOtherPerson: this.state.dayAsOtherPerson,
            hobbies: this.state.hobbies,
            peeves: this.state.peeves,
            selfRating: this.state.selfRating,
            guiltyPleasure: this.state.guiltyPleasure,
            otherInfo: this.state.otherInfo,
        }
        
        var user = firebase.auth().currentUser;

        //add post in firestore
        firebase.firestore().collection("posts").doc(user.uid.toString()).set({post})
        .then(() => {
            //change user's created post attribute to true
            firebase.firestore().collection("users").doc(user.uid.toString()).set({
                createdPost: true
              })
            .then(() => {window.location = '/'})
        })
        .catch((err) => {console.log(err)})
    }


    render () {
        const { classes } = this.props;
        return (
            <div>
                <h1>Create post...</h1>
                <Form className={classes.form}  onSubmit={this.onSubmit}>

                { /*file upload*/ }
                <Form.Group>
                    <Form.Label>Upload images of yourself</Form.Label>
                    <Form.File className={classes.fileUpload} id="exampleFormControlFile1" multiple/>
                    <Form.Text className="text-muted">
                            Required: please upload 1-5 images
                    </Form.Text>
                </Form.Group>

                    { /*optional fields*/ }
                    <Form.Label>
                            The following are optional; feel free to answer as many or as few as you would like
                    </Form.Label>

                    <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Control 
                        onChange={this.onChangeMusic} 
                        value={this.state.music} 
                        as="textarea" 
                        rows={1} 
                        placeholder="What music do you currently have on rotation?" />
                    </Form.Group>

                    <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Control 
                        onChange={this.onChangeAge} 
                        value={this.state.age} 
                        as="textarea" rows={1} 
                        placeholder="How old are you?" />
                    </Form.Group>

                    <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Control 
                        onChange={this.onChangeDayAsOtherPerson} 
                        value={this.state.dayAsOtherPerson} 
                        as="textarea" rows={1} 
                        placeholder="If you could spend a day as anyone, dead or alive, who would it be?" />
                    </Form.Group>

                    <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Control 
                        onChange={this.onChangeHobbies} 
                        value={this.state.hobbies} 
                        as="textarea" 
                        rows={1} 
                        placeholder="What do you enjoy doing in your spare time?" />
                    </Form.Group>

                    <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Control 
                        onChange={this.onChangePeeves}
                        value={this.state.peeves} 
                        as="textarea" 
                        rows={1} 
                        placeholder="What pisses you off the most?" />
                    </Form.Group>

                    <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Control 
                        onChange={this.onChangeSelfRating} 
                        value={this.state.selfRating} 
                        as="textarea" 
                        rows={1} 
                        placeholder="Rate your looks on a scale from 1-10" />
                    </Form.Group>

                    <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Control 
                        onChange={this.onChangeGuiltyPleasure} 
                        value={this.state.guiltyPleasure} 
                        as="textarea" 
                        rows={1} 
                        placeholder="What is you guilty pleasure?" />
                    </Form.Group>

                    <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Control 
                        onChange={this.onChangeOtherInfo}
                        value={this.state.otherInfo}  
                        as="textarea" 
                        rows={3} 
                        placeholder="Anything else you want to let people know..." />
                    </Form.Group>
                    
                    { /*submit*/ }
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>

                    </Form>
            </div>
        )
  }
}

CreatePost.propTypes = {
    classes: PropTypes.object.isRequired
}


export default withStyles(styles)(CreatePost);
