import { useEffect } from 'react';

import './about_page.css'

const AboutPage = ({ setTobbarLabel, label }) => {

    useEffect(() => {
        setTobbarLabel(label)
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="about-box">
            <div className="inner-box text-center">
                <h1 className="text-center">
                    Policy Dashboard
                </h1>
                <h5 className="mt-2">
                    A dahboard for your OAuth Policies
                </h5>
                <p class="mt-4 text-center">
                    This is a web based dashboard to administrate and test your OAuth policies. 
                    OAuth-Policies are designed to permit or deny OAuth 2.0 requests without user interaction. A resource owner writes policies in a self-developed language, and decisions can be queried via a REST Interface.
                </p>
                <p class="mt-4 text-center">
                    Open the <b>Policies</b> view to write new polices and
                    take a look at <b>Tests</b> to test the behavior. 
                    A more in depth documentation can be found under <a href="https://github.com/christianhugoch/oauth-policies">oauth-policies</a>.
                </p>
            </div>
        </div>
    )
}

export default AboutPage;