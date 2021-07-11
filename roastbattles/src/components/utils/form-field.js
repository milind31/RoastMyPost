//React
import React from 'react';

//React Bootstrap
import Form from 'react-bootstrap/Form';

const FormField = ({label, onChange, value, rows, classes}) =>  (
        <Form.Group controlId="exampleForm.ControlTextarea1">
            <Form.Label className={classes.formLabel}>
                {label}
            </Form.Label>
            <Form.Control 
                onChange={onChange} 
                value={value} 
                as="textarea" 
                rows={rows} />
        </Form.Group>
    )

export default FormField;