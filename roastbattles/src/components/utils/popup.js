//React
import React from 'react';

//React Bootstrap
import Form from 'react-bootstrap/Form';
import SubmitButton from 'react-bootstrap/Button';

//Material UI
import Backdrop from '@material-ui/core/Backdrop';

const Popup = ({children, open, classes, onSubmit, onCancel}) =>  (
        <Backdrop open={open} className={classes.backdrop}>
            <Form className={classes.form} style={{ borderRadius: '5px', width: "25%", padding: '10px'}}
                >{children}
                <SubmitButton variant="primary" className={classes.popupButton} onClick={onSubmit}>Yes</SubmitButton>
                <SubmitButton variant="secondary" className={classes.popupButton} onClick={onCancel}>Cancel</SubmitButton>
            </Form>
        </Backdrop>
    )

export default Popup;