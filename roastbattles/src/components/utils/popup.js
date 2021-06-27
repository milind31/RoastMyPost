//React
import React from 'react';

//React Bootstrap
import Form from 'react-bootstrap/Form';

//Material UI
import Backdrop from '@material-ui/core/Backdrop';

const Popup = ({children, open, classes}) =>  (
        <Backdrop open={open} className={classes.backdrop}>
            <Form className={classes.form} style={{ borderRadius: '5px', width: "25%", padding: '10px'}}
                >{children}
            </Form>
        </Backdrop>
    )

export default Popup;