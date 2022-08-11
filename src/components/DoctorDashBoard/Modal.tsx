import React  from "react";
import Modal from "@mui/material/Modal";


interface ModalChild {
    children?:React.ReactNode;
    open:boolean;
    handleClose:()=>void;
}



export default function BasicModal({children, open, handleClose}:ModalChild)
{

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <>
                    <div style={{display:"flex", justifyContent: "center", alignItems: "center", height: "80vh"}}>
                        {children}
                    </div>
                </>
            </Modal>
        </div>  
    );
}
