import { getAuthenticatedUser, getLinkedUser } from '../../../../util/auth_module';

import { useState, useEffect } from 'react';
import { Form, FormGroup, Input, Label } from 'reactstrap';
import moment from 'moment';

import './user_page.css';


const UserPage = ({ setTobbarLabel, label, setIsLoading }) => {
    const [oidcUser, setOidcUser] = useState({
        profile: { sub: "" }
    });
    const [linkedUser, setLinkedUser] = useState({
        lastLogin: null, lastLogout: null
    });
    const [issuer, setIssuer] = useState(" - ");
    const [clientId, setClientId] = useState(" - ");


    useEffect(() => {
        init();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps


    async function init() {
        setIsLoading(true);
        setTobbarLabel(label);
        await setUserStates();
        setIdPStates();
        setIsLoading(false);
    }


    async function setUserStates() {
        let oidc = await getAuthenticatedUser();
        if (oidc !== null) {
            setOidcUser(oidc);
        }
        let linked = await getLinkedUser();
        if (linked !== null) {
            setLinkedUser(linked);
        }
    }


    function setIdPStates() {
        let idPStr = localStorage.getItem("selectedIdP");
        if (idPStr) {
            try {
                let providerCfg = JSON.parse(idPStr);
                setIssuer(providerCfg.issuer);
                setClientId(providerCfg.clientId);
            }
            catch (error) {
                console.log("Unable to parse the identity provider cfg");
            }
        }
        else {
            console.log("Unable to read the identity provider cfg.")
        }
    }


    function getUserInitials(userName) {
        if (!userName || userName.length === 0) {
            return "?";
        }
        return userName.substring(0, 1);
    }


    function getFormattedDate(dateString) {
        if (dateString === null || dateString === undefined) {
            return " - "
        }
        return moment(dateString).format("YYYY/MM/DD hh:mm:ss");
    }


    return (
        <div>
            <div className="info-box">
                <div className="d-flex justify-content-center mb-0">
                    <div className="big-dot d-flex justify-content-center align-items-center">
                        {getUserInitials(oidcUser.profile.sub)}
                    </div>
                </div>

                <Form className="px-4 pb-2">

                    <FormGroup>
                        <Label className="m-0" for="sub">Subject</Label>
                        <Input
                            type="text"
                            id="sub"
                            readOnly={true}
                            value={oidcUser.profile.sub}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label className="m-0" for="sub">Last login:</Label>
                        <Input
                            type="text"
                            id="sub"
                            readOnly={true}
                            value={getFormattedDate(linkedUser.lastLogin)}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label className="m-0" for="sub">Last logout:</Label>
                        <Input
                            type="text"
                            id="sub"
                            readOnly={true}
                            value={getFormattedDate(linkedUser.lastLogout)}
                        />
                    </FormGroup>

                    <hr />

                    <FormGroup>
                        <Label className="m-0" for="exampleEmail">OIDC-Issuer</Label>
                        <Input
                            type="text"
                            id="iss"
                            readOnly={true}
                            value={issuer}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label className="m-0" for="sub">Client-Id</Label>
                        <Input
                            type="text"
                            id="sub"
                            readOnly={true}
                            value={clientId}
                        />
                    </FormGroup>
                </Form>
            </div>
        </div>
    )
}
export default UserPage;