//React
import React from 'react';

//React Bootstrap
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

export default ({children, message, location}) =>  (
            <OverlayTrigger
                placement={location}
                overlay={
                <div style={{fontSize: "12px", padding: '4px', marginTop: "10px", borderRadius: "5px", backgroundColor:'black'}}>
                    <p style={{marginBottom:'0px'}}>{message}</p>
                </div>
                }
            >{children}
          </OverlayTrigger>
    )
