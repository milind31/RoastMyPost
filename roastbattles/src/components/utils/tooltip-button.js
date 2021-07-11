//React
import React from 'react';

//React Bootstrap
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

//Material UI
import Button from '@material-ui/core/Button';

const TooltipButton = ({children, message, tipLocation, color, onClick, classes, buttonClassName}) =>  (
    <OverlayTrigger
            placement={tipLocation}
            overlay={
            <div style={{fontSize: "12px", padding: '4px', marginTop: "10px", borderRadius: "5px", backgroundColor:'black'}}>
                <p style={{marginBottom:'0px'}}>{message}</p>
            </div>
            }>
        <Button color={color} className={buttonClassName} onClick={onClick}>
            {children}
        </Button>
    </OverlayTrigger>
    )
export default TooltipButton;