import { logoutCallback } from '../../../../util/auth_module';

import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
    Button,
    Container,
    Row,
    Col,
    Card,
    CardBody,
} from 'reactstrap';

import 'react-overlay-loader/styles.css';
import oauthLogo from './oauth-logo-square.png';
import './logout_page.css'


const LogoutPage = () => {
    const history = useHistory();

    useEffect(() => {
        init();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps


    async function init() {
        await logoutCallback();
    }


    function backToLogin() {
        let locationDescriptor = {
            pathname: "login",
        }
        history.push(locationDescriptor);

    }


    return (
        <div className="min-vh-100 min-vw-100 bg-primary" >
            <Container className="d-flex justify-content-center" >
                <Row>
                    <Col>
                        <Card className="card-width bg-primary border-0" >
                            <CardBody className="card-body-size bg-light border-0 my-5">
                                <ul className="head-bar-grid list-unstyled mb-n1" >
                                    <li className="heading-start-column d-flex flex-column align-items-center">
                                        <img
                                            src={oauthLogo}
                                            className="large-logo-negativ-margin"
                                            width="72"
                                            alt="" />
                                        <div className="policies-headline">
                                            Policies
                                </div>
                                    </li>

                                </ul>
                                <div className="p-5 mt-n4">
                                    <div className="text-center">
                                        <h5 className="h4 text-gray-400 mb-4">You are now logged out.</h5>
                                    </div>
                                    <div className="text-center">
                                        <Button
                                            onClick={backToLogin}
                                            autoFocus
                                        >
                                            back to login
                                        </Button>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    )
};
export default LogoutPage;