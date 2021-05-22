import React, { Component, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Carousel from 'react-bootstrap/Carousel';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css';



import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";
import "firebase/auth";

const styles = {
    signOutButton: {
        position: "absolute",
        top: "20px",
        right: "20px"
    },
    homeButton: {
        position: "absolute",
        top: "20px",
        left: "20px",
        width: "3%",
        height: "auto"
    },
    container: {
        background: "#333131"
    },
    username: {
        fontSize: '150%',
        marginTop: '5%',
        marginLeft: '0',
    },
    bio: {
        backgroundColor: "#333131",
    },
    media: {
        height: '95%',
        width: '95%'
    },
    profileImg: {
        marginRight: '0',
        height: '55%',
        width: '55%'
    }
}

const Image = (props) => (
    <Carousel.Item>
        <img
          className={props.imageURL}
          src={props.imageURL}
          alt="profileimage"
          style={{width: '100%', height: '100%'}}
        />
    </Carousel.Item>
)

//homepage
class ViewPost extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '', 
            music: '',
            age: '',
            dayAsOtherPerson: '',
            hobbies: '',
            peeves: '',
            selfRating: '',
            guiltyPleasure: '',
            otherInfo: '',
            files: [],
            profileImage: null,
            usersPost: true
        
        }

        this.handleAuthChange = this.handleAuthChange.bind(this);
        this.Images = this.Images.bind(this);
    }

    componentDidMount = () => {
        firebase.auth().onAuthStateChanged(this.handleAuthChange);
    }

    Images() {
        return this.state.files.map(imageURL => {
          return <Image imageURL={imageURL}/>;
        })
    }

    handleAuthChange(user) {
        if (user) {
            this.setState({photoImage: user.photoURL})
            if (this.props.match.params.id === user.uid) {
                firebase.firestore().collection('posts').doc(user.uid).get()
                .then((docData) => {
                    console.log(docData.data().post.fileURLS);
                    this.setState({
                        username: user.displayName,
                        music: docData.data().post.music,
                        age: docData.data().post.age,
                        dayAsOtherPerson: docData.data().post.dayAsOtherPerson,
                        hobbies: docData.data().post.hobbies,
                        peeves: docData.data().post.peeves,
                        selfRating: docData.data().post.selfRating,
                        guiltyPleasure: docData.data().post.guiltyPleasure,
                        otherInfo: docData.data().post.otherInfo,
                        files: docData.data().post.fileURLS,
                    })
                })
            }
            else {
                firebase.firestore().collection('posts').doc(this.props.match.params.id).get()
                .then((docData) => {
                    console.log(docData.data().post.fileURLS);
                    this.setState({
                        username: this.props.match.params.id,
                        music: docData.data().post.music,
                        age: docData.data().post.age,
                        dayAsOtherPerson: docData.data().post.dayAsOtherPerson,
                        hobbies: docData.data().post.hobbies,
                        peeves: docData.data().post.peeves,
                        selfRating: docData.data().post.selfRating,
                        guiltyPleasure: docData.data().post.guiltyPleasure,
                        otherInfo: docData.data().post.otherInfo,
                        files: docData.data().post.fileURLS,
                        usersPost: false
                    })
                })
            }
        } else {
            //user is not logged in
            window.location = '/signin';
        }
    }

    render () {
        const { classes } = this.props;
        return (
            <div>
                <Button className={classes.signOutButton} color="secondary" onClick={() => firebase.auth().signOut()}>Sign Out</Button>
                <a href='/'><img className={classes.homeButton} src="https://firebasestorage.googleapis.com/v0/b/roastbattles-85b35.appspot.com/o/roastlogo.png?alt=media&token=90d7f233-e25c-48c0-968a-e9cfa4597a6f"/></a>
                <Paper className={classes.container}>
                    {/*<p>User ID : {this.props.match.params.id}</p>*/}
                    <Grid className={classes.container} container direction="row" alignItems="center">
                        <Grid className={classes.container} item>
                            <Avatar className={classes.profileImg} alt={this.state.username} src={this.state.photoImage} />
                        </Grid>
                        <Grid className={classes.container} item>
                            <p className={classes.username}>{this.state.username}</p>
                        </Grid>
                    </Grid>
                    <br></br>
                    <Carousel>
                        <this.Images/>
                    </Carousel>
                    {/*<img className={classes.media} src={this.state.files[0]}></img>*/}
                    <div className={classes.bio}>
                        { this.state.music !== '' && <p>Music currently on rotation: <strong>{this.state.music}</strong></p>}
                        { this.state.age !== '' && <p>Age: <strong>{this.state.age}</strong></p>}
                        { this.state.dayAsOtherPerson !== '' && <p>If I could spend a day as another person, I would be: <strong>{this.state.dayAsOtherPerson}</strong></p>}
                        { this.state.hobbies !== '' && <p>When I'm bored, I like to: <strong>{this.state.hobbies}</strong></p>}
                        { this.state.peeves !== '' && <p>It really pisses me off when: <strong>{this.state.peeves}</strong></p>}
                        { this.state.selfRating !== '' && <p>Out of 10, I would rate myself as: <strong>{this.state.selfRating}</strong></p>}
                        { this.state.guiltyPleasure !== '' && <p>My guilty pleasure is: <strong>{this.state.guiltyPleasure}</strong></p>}
                        { this.state.otherInfo !== '' && <p>Bio: <strong>{this.state.otherInfo}</strong></p>}
                    </div>
                    { this.state.usersPost ? <Button color="primary" onClick={() => window.location = '/editpost/'}>Edit</Button> : <Button color="primary" onClick={() => window.location = '/posts/YG5BKC9Q8xa78drGJsYMc9d5QBq1'}>Find New Post</Button>}
                </Paper>
            </div>
        )
  }
}
ViewPost.propTypes = {
    classes: PropTypes.object.isRequired
}


export default (withStyles(styles)(ViewPost));
