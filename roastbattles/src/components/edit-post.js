//React
import React, { Component } from 'react';
import Nav from './navbar';

//React Bootstrap
import SubmitButton from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';

//Material UI
import { withStyles } from '@material-ui/styles';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Button from '@material-ui/core/Button';
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
    },
    container: {
        background: "#333131"
    }
}

//create post page
class EditPost extends Component {
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
        this.onDeleteImage = this.onDeleteImage.bind(this);
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
            files: [],
            filesUploaded: false,
            numberOfFiles: 0,
        }
    }

    componentDidMount = () => {
        firebase.auth().onAuthStateChanged(this.handleAuthChange);
    }

    handleFileChange(e) {
        this.setState({files: e.target.files, filesUploaded: true, numberOfFiles: e.target.files.length});
    }

    handleAuthChange(user) {
        if (user) {
            //user is logged in
            if (user.uid !== this.props.match.params.id) {
                window.location = '/';
            }
            else {
                firebase.firestore().collection('posts').doc(user.uid).get()
                .then((docData) => {
                    this.setState({
                        music: docData.data().music,
                        age: docData.data().age,
                        dayAsOtherPerson: docData.data().dayAsOtherPerson,
                        hobbies: docData.data().hobbies,
                        peeves: docData.data().peeves,
                        selfRating: docData.data().selfRating,
                        guiltyPleasure: docData.data().guiltyPleasure,
                        otherInfo: docData.data().otherInfo,
                        files: docData.data().fileURLS,
                    })
                })
            }
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
            for (var i = 0; i < this.state.files.length; i++) {
                // 3A. Get a file to upload
                const imageFile = this.state.files[i];

                // 3B. handleFileUploadOnFirebaseStorage function is in above section
                const downloadFileResponse = await this.uploadImage(imageFile);
                
                // 3C. Push the download url to URLs array
                fileURLS.push(downloadFileResponse);
            }
            console.log(fileURLS);          
        }

        var user = firebase.auth().currentUser;

        //add post in firestore
        firebase.firestore().collection("posts").doc(user.uid.toString()).set({
            music: this.state.music,
            age: this.state.age,
            dayAsOtherPerson: this.state.dayAsOtherPerson,
            hobbies: this.state.hobbies,
            peeves: this.state.peeves,
            selfRating: this.state.selfRating,
            guiltyPleasure: this.state.guiltyPleasure,
            otherInfo: this.state.otherInfo,
            fileURLS: fileURLS})
        .then(() => {window.location = '/'})
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
    
    imageThumbnails = props => (
        <div style={{marginTop:'-75px'}}>
                    <Container>
                    <Row>
                        {this.state.files.length !== 0 && this.state.files.map((url, index) => (
                            <Col xs={6} md={4}>
                                <Image thumbnail src={url}></Image>
                                <Button color="primary"onClick={(e) => {this.onDeleteImage(e, url)}}><DeleteForeverIcon/></Button>
                            </Col>
                        ))}
                    </Row>
                    </Container>
                </div>
    )

    onDeleteImage(e, url) {
        let files = this.state.files;
        files = files.filter(function(item) {
            return item !== url
        })

        var user = firebase.auth().currentUser;

        //update post in firestore
        firebase.firestore().collection("posts").doc(user.uid.toString()).update({fileURLS: files})
        .then(() => {window.location = '/'})
        .catch((err) => {console.log(err)})
    
        //save to state
        this.setState({files: files});
    }


    render () {
        const { classes } = this.props;
        return (
            <div>
                <Nav/>
                <h1>Edit post...</h1>
                <Form className={classes.form}  onSubmit={this.onSubmit}>

                { /*file upload*/ }
                <Form.Group>
                    <Form.Label>Upload new images of yourself</Form.Label>
                    <Form.File 
                        onChange={this.handleFileChange} 
                        className={classes.fileUpload} 
                        id="exampleFormControlFile1" 
                        multiple/>
                    <Form.Text className="text-muted">
                            Required: please upload 1-5 images
                    </Form.Text>
                </Form.Group>
                
                {!this.state.filesUploaded && (
                    <div>
                        <Form.Label>
                                Currently uploaded images:
                        </Form.Label>
                        <this.imageThumbnails/>
                    </div>
                    )
                }

                <br/>

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
                    <SubmitButton variant="primary" type="submit">
                        Submit
                    </SubmitButton>

                    </Form>
            </div>
        )
  }
}

EditPost.propTypes = {
    classes: PropTypes.object.isRequired
}


export default withStyles(styles)(EditPost);
