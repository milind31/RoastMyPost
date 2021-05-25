//React
import React, { Component } from 'react';

//React Bootstrap
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

//Material UI
import { withStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';

//Firebase
import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

const styles = {
    form: {
        backgroundColor: '#242323',
        alignItems: 'center'
    },
    button: {
        backgroundColor: '#ed6c09'
    },
    fileUpload: {
        alignItems: 'center',
    }
}

//create post page
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
        this.handleFileChange = this.handleFileChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.uploadImage = this.uploadImage.bind(this);

        this.state = {
            music: '',
            age: '',
            dayAsOtherPerson: '',
            hobbies: '',
            peeves: '',
            selfRating: '',
            guiltyPleasure: '',
            otherInfo: '',
            files: null,
            numberOfFiles: 0,
        }
    }

    componentDidMount = () => {
        firebase.auth().onAuthStateChanged(this.handleAuthChange);
    }

    handleFileChange(e) {
        this.setState({files: e.target.files, numberOfFiles: e.target.files.length});
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

    onSubmit = async (e) =>{
        e.preventDefault();

        var fileURLS = [];
        if (this.state.files !== null) {
            // 3. Loop over all the files
            for (var i = 0; i < this.state.numberOfFiles; i++) {
                // 3A. Get a file to upload
                const imageFile = this.state.files[i];

                // 3B. handleFileUploadOnFirebaseStorage function is in above section
                const downloadFileResponse = await this.uploadImage(imageFile);
                
                // 3C. Push the download url to URLs array
                fileURLS.push(downloadFileResponse);
            }
            console.log(fileURLS);          
        }

        const post = {
            music: this.state.music,
            age: this.state.age,
            dayAsOtherPerson: this.state.dayAsOtherPerson,
            hobbies: this.state.hobbies,
            peeves: this.state.peeves,
            selfRating: this.state.selfRating,
            guiltyPleasure: this.state.guiltyPleasure,
            otherInfo: this.state.otherInfo,
            fileURLS: fileURLS
        }

        var user = firebase.auth().currentUser;

        //add post in firestore
        firebase.firestore().collection("posts").doc(user.uid.toString()).set({post})
        .then(() => {
            //change user's created post attribute to true
            firebase.firestore().collection("users").doc(user.uid.toString()).update({
                createdPost: true
            })
            .then(() => {window.location = '/'})
        })
        .catch((err) => {console.log(err)})
    }

    uploadImage = async (imageFile) => {
        // 1. If no file, return
        if (imageFile === "") return "";

        // 2. Put the file into bucketName
        const uploadTask = await firebase.storage().ref().child('images/' + imageFile.name).put(imageFile);
        
        // 3. Get download URL and return it as 
        return uploadTask.ref.getDownloadURL().then((fileURL) => fileURL);
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
                    <Form.File 
                        onChange={this.handleFileChange} 
                        className={classes.fileUpload} 
                        id="exampleFormControlFile1" 
                        multiple/>
                    <Form.Text className="text-muted">
                            Required: please upload 1-5 images
                    </Form.Text>
                </Form.Group>

                    { /*optional fields*/ }
                    <Form.Label>
                            The following are optional; feel free to answer as many or as few as you would like
                    </Form.Label>

                    { /*music*/ }
                    <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Control 
                        onChange={this.onChangeMusic} 
                        value={this.state.music} 
                        as="textarea" 
                        rows={1} 
                        placeholder="What music do you currently have on rotation?" />
                    </Form.Group>

                    { /*age*/ }
                    <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Control 
                        onChange={this.onChangeAge} 
                        value={this.state.age} 
                        as="textarea" rows={1} 
                        placeholder="How old are you?" />
                    </Form.Group>

                    { /*day as other person*/ }
                    <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Control 
                        onChange={this.onChangeDayAsOtherPerson} 
                        value={this.state.dayAsOtherPerson} 
                        as="textarea" rows={1} 
                        placeholder="If you could spend a day as anyone, dead or alive, who would it be?" />
                    </Form.Group>

                    { /*hobbies*/ }
                    <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Control 
                        onChange={this.onChangeHobbies} 
                        value={this.state.hobbies} 
                        as="textarea" 
                        rows={1} 
                        placeholder="What do you enjoy doing in your spare time?" />
                    </Form.Group>

                    { /*peeves*/ }
                    <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Control 
                        onChange={this.onChangePeeves}
                        value={this.state.peeves} 
                        as="textarea" 
                        rows={1} 
                        placeholder="What pisses you off the most?" />
                    </Form.Group>

                    { /*self rating*/ }
                    <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Control 
                        onChange={this.onChangeSelfRating} 
                        value={this.state.selfRating} 
                        as="textarea" 
                        rows={1} 
                        placeholder="Rate your looks on a scale from 1-10" />
                    </Form.Group>

                    { /*guilty pleasure*/ }
                    <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Control 
                        onChange={this.onChangeGuiltyPleasure} 
                        value={this.state.guiltyPleasure} 
                        as="textarea" 
                        rows={1} 
                        placeholder="What is you guilty pleasure?" />
                    </Form.Group>

                    { /*additional info*/ }
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
