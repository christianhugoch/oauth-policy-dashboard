import { GETOidcCfgs } from '../../../../util/http_utils';
import { doLogin, initUserManagerFromStorage } from '../../../../util/auth_module';
import InfoBox from '../../../common/info_box/info_box';

import React, { useEffect, useState } from 'react';
import { FaQuestionCircle, } from 'react-icons/fa';
import ReactLoadingOverlay from 'react-loading-overlay';
import { LoadingOverlay, Loader } from 'react-overlay-loader';
import {
    Form,
    FormGroup,
    Input,
    Label,
    Button,
    Container,
    Row,
    Col,
    Card,
    CardBody,
    Tooltip
} from 'reactstrap';

import 'react-overlay-loader/styles.css';
import oauthLogo from './oauth-logo-square.png';
import './login_page.css'


const LoginPage = () => {
    const [oidcCfgs, setOidcCfgs] = useState(null);
    const [showHelp, setShowHelp] = useState(false);

    const [showButtonOverlay, setShowButtonOverlay] = useState(false);
    const [showLoadingOVerlay, setShowLoadingOverlay] = useState(true);
    const [alertText, setAlertText] = useState(null);


    useEffect(() => {
        init();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps


    async function init() {
        try {
            let cfgsFromServer = await GETOidcCfgs();
            if (cfgsFromServer && cfgsFromServer.length > 0) {
                setOidcCfgs(cfgsFromServer);
                localStorage.setItem("selectedIdP", JSON.stringify(cfgsFromServer[0]));
            }
            else {
                setAlertText("the identity provider list is empty, please check your server configuration.");
            }
        }
        catch (error) {
            setAlertText(error.message);
        }
        setShowLoadingOverlay(false);
    }


    function handleLogin() {
        if (!localStorage.getItem("selectedIdP")) {
            setAlertText("Unable to login, no identity provider was selected.")
        }
        else {
            setShowButtonOverlay(true);
            try {
                initUserManagerFromStorage();
                doLogin();
            }
            catch (error) {
                setShowLoadingOverlay(false);
                console.trace(error);
            }
        }
    }


    function handleIssuerChanged(event) {
        let cfgIndex = event.target.options.selectedIndex;
        let selectedIdP = oidcCfgs[cfgIndex];
        localStorage.setItem('selectedIdP', JSON.stringify(selectedIdP));
    }


    return (
        <ReactLoadingOverlay
            active={showLoadingOVerlay}
            spinner
            text="Loading your content..."
        >
            <div className="min-vh-100 min-vw-100 bg-primary" >
                <Container className="d-flex justify-content-center" >
                    <Row>
                        <Col>
                            <Card className="card-width bg-primary border-0" >
                                {   // Error messages
                                    alertText &&
                                    <InfoBox
                                        alertText={alertText}
                                        setAlertText={setAlertText} />
                                }
                                <CardBody className="card-body-size bg-light border-0 my-5">
                                    <ul className="head-bar-grid list-unstyled mb-n1" >
                                        <li className="heading-start-column d-flex flex-column align-items-center">
                                            <img
                                                src={oauthLogo}
                                                className="large-logo-negativ-margin"
                                                width="72"
                                                alt=""
                                            />
                                            <div className="policies-headline">
                                                Policies
                                        </div>
                                        </li>
                                        <li className="ml-auto">
                                            <FaQuestionCircle
                                                size="32"
                                                id="help-tooltip"
                                                onMouseEnter={() => { setShowHelp(true) }}
                                                onMouseLeave={() => { setShowHelp(false) }}
                                            />
                                            <Tooltip
                                                placement="under"
                                                isOpen={showHelp}
                                                target="help-tooltip"
                                            >
                                                <div>Welcome to the OAuth Policy Dashboard.</div>
                                                <div>&nbsp;</div>
                                                <div>Please select your identity provider and login.</div>
                                            </Tooltip>
                                        </li>
                                    </ul>
                                    <div className="p-5 mt-n4">
                                        <div className="text-center">
                                            <h1 className="h4 text-gray-400 mb-4">Welcome Back!</h1>
                                        </div>
                                        <div className="text-center">
                                            <h5 className="h4 text-gray-400 mb-4">Please select your Identity Provider</h5>
                                        </div>
                                        <Form>
                                            <FormGroup>
                                                <Label
                                                    className="idp-label"
                                                    for="issuerSelect"
                                                >
                                                    Identity Provider:
                                                </Label>
                                                <Input
                                                    type="select"
                                                    name="issuerSelect"
                                                    id="issuerSelect"
                                                    onChange={handleIssuerChanged}
                                                >
                                                    {oidcCfgs && oidcCfgs.map(({ name, issuer }, index) => {
                                                        return (
                                                            <option>{name} - {issuer}</option>
                                                        )
                                                    })}
                                                </Input>
                                            </FormGroup>
                                            <LoadingOverlay>
                                                <Loader loading={showButtonOverlay} />
                                                <Button
                                                    autoFocus
                                                    onClick={handleLogin}
                                                    onKeyPress={event => {
                                                        if (event.key === 'Enter') {
                                                            handleLogin();
                                                        }
                                                    }}
                                                >
                                                    login
                                                </Button>
                                            </LoadingOverlay>
                                        </Form>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </ReactLoadingOverlay>
    )
}
export default LoginPage;