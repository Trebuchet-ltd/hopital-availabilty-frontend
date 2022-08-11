import React from "react";
import { PatientObject } from "../../../api/model";
import "./med.css";
import { toast } from "react-toastify";
import "./card.css";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { useHistory, useLocation } from "react-router";import { Button } from "@mui/material";
export interface Pat {
    user: PatientObject;
    view?:boolean
}
const getType = (type: string) => {
    if (type === "M")
        return "Medical";
    else if (type === "FI")
        return "Financial";
    else if (type === "B")
        return "Blood";
    else if (type === "O")
        return "Other";

}

const Medical = ({ user, view }: Pat) => {
    const history = useHistory();
    if (!user) {
        history.replace("/help");
        return <></>
    }

    const givehelp = async (obj: PatientObject) => {
        try {
            await obj.modify("help/");
            toast.success("Thank you for helping out", {
                position: "bottom-center",
            });
            history.push("/help");
        }
        catch (error) {
            console.error(error);
            toast.error((error as { details: string }).details, {
                position: "bottom-center",
            });
        }
    };
    const image =
        "https://s3-alpha-sig.figma.com/img/b239/cd59/a18c70b877211a4e109c17fa9dc080b9?Expires=1659916800&Signature=cRUWUOQzQyqWKnReFYoDwTqZh6elr-nNWsU0jlDBGXv2g81xLcKv6NSVq~1DEPD7pngn58rW3etQR3iGs92z~lQMGKpHg5Abc6BpsdwwvdFoMHDyT-9OLNkSTKGNm0rB5yMmhAriDCzxW0HTGoZUbLpR7uLgbb1L61iqiYV-jtqgJ9ofwTWUNR7LjiHykgwwZxKGPfUNXUzIzrvY0WJOyqULajZwkdnQsoAwtp56NXKWwGeRNINlVzd-P~RwFxCI-xZd6mijx8NKcG0x7OrCMU~oWMY0sTlPZf~uKcilrXT32NsjT-CNaUdwE22hPcoL-psx9jZM8JLn2mv9VR0opQ__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA";
    return (
        <><div className="center mt-5 coldir">
            <div className="box-card  sha">
                <div className="main-line">
                    <h3 className="med-h">{getType(user.request_type ?? "") + " Request"}</h3>
                    <hr />
                </div>
                <h3 className="h2">{user.Name}</h3>
                <div className="infopt">
                    <div className="col">
                        <div className="inpt">
                            <p>Age:</p>
                            <span className="result">{user.age}</span>
                        </div>
                        <div className="inpt">
                            <p>Gender:</p>
                            <span className="result">{user.gender_name}</span>
                        </div>
                        <div className="inpt">
                            <p>Location:</p>
                            <span className="result">{user.address}</span>
                        </div>
                        <div className="inpt">
                            <p>Reason:</p>
                            <span className="result">{user.reason}</span>
                        </div>
                    </div>
                    {user.attachment && <a href={user.attachment} target="_blank" rel="noreferrer">
                        <div className="bill">
                            <img src={image} alt="bill pic" className="imgbill" />
                            <div className="stack-bill">
                                <span className="textbill pdf">
                                    <PictureAsPdfIcon />
                                </span>
                                <span className="textbill">medical_bill.pdf</span>
                            </div>
                        </div>
                    </a>
                    }
                </div>
                {user.request_type as any === "FI" && <div className="col cen">
                    <div className="inpt">
                        <p>Account holder name:</p>
                        <span className="result">{user.account_holder}</span>
                    </div>
                    <div className="inpt">
                        <p>Account Bank</p>
                        <span className="result">{user.bank_name}</span>
                    </div>
                    <div className="inpt">
                        <p>Account no.</p>
                        <span className="result">{"XXXXXXXXX" + user.account_no}</span>
                    </div>
                    <div className="inpt">
                        <p>IFSC</p>
                        <span className="result">{user.ifsc}</span>
                    </div>
                </div>}
                {
                    user.request_type as any === "M" && <div className="col cen">
                        <div className="inpt">
                            <p>Syptoms:</p>
                            <span className="result">{user.symptoms}</span>
                        </div>
                        <div className="inpt">
                            <p>Bed type:</p>
                            <span className="result">{user.bedtype_name}</span>
                        </div>
                    </div>

                }
                {
                    user.request_type as any === "M" || user.request_type as any === "B" && <div className="col cen">

                        <div className="inpt">
                            <p>Blood group:</p>
                            <span className="result">{user.blood}</span>
                        </div>
                    </div>

                }
                {
                    !view &&
                    <div className="btns">
                        <Button className="sub subbt" variant="contained">
                            Decline
                        </Button>
                        <Button className="sub subbt" onClick={() => givehelp(user)} variant="contained">
                            Accept
                        </Button>
                    </div>
                }

            </div>
        </div>
        </>
    );
};

export default Medical;
