export const styles = ((theme) => ({
    container: {
        background: "#333131",
        padding: '15px 30px 15px 30px'
    },
    commentHeader: {
        float: 'left',
        fontSize: '200%',
        marginTop: '5%',
        paddingLeft: '20px',
    },
    form: {
        backgroundColor: '#333131',
        borderRadius: '5px',
        width: "25%",
        padding: '10px'
    },
    commentSection: {
        textAlign: 'left',
        backgroundColor: '#333131',
        color: 'white'
    },
    comments: {
        paddingTop: '50px',
        backgroundColor: '#333131',
    },
    textBody: {
        fontSize: '125%', 
        wordWrap:'break-word'
    },
    scoringButtons: {
        float:'right', 
        marginTop: '-5px'
    },
    commentFilterBox: {
        float:'left', 
        marginTop:'-10px', 
        marginLeft:'10px'
    },
    flagPostButton: {
        float:'right', 
        padding:'0px', 
        marginLeft:'-35px', 
        marginRight:'-25px'
    },
    flagPostIcon: {
        color:'#525252', 
        height:'90%', 
        float:'right'
    },
    scoreDisplay: {
        float:'right',
        paddingRight: '20px'
    },
    belowCommentBar: {
        marginTop:'0px', 
        paddingTop:'15px', 
        paddingBottom:'25px'
    },
    belowCommentButton: {
        backgroundColor:'transparent', 
        marginLeft:'-15px', 
        marginRight:'-5px'
    },
    belowReplyButton: {
        backgroundColor:'transparent', 
        marginLeft:'-5px', 
        marginTop:'-5px'
    },
    belowCommentButtons: {
        float:'left', 
        marginTop:'-10px', 
        paddingTop:'0px'
    },
    belowCommentTimestamp: {
        paddingRight: '10px', 
        float:'left', 
        textAlign:'left'
    },
    popupMainText: {
        marginTop: '10px'
    },
    popupSubText: {
        fontSize:'90%', 
        marginBottom:'20px'
    },
    popupButton: {
        float: "right", 
        margin: "5px"
    },
    lineBreak: {
        color: '#5c5c5c', 
        backgroundColor:'#5c5c5c'
    },
    characterCounter: {
        marginTop: '-20px', 
        paddingRight: '35px', 
        float:'right', 
        color: 'white'
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1, 
        color: '#fff',
        marginTop: '-50px'
    },
}));