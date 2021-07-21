import { initUserManagerFromStorage, loginCallback, setLinkedUser } from '../../../../util/auth_module';
import { POSTLinkedUser, PUTLoginStats } from '../../../../util/http_utils';
import InfoBox from '../../../common/info_box/info_box';

import { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';


function LoginCallback() {
    const location = useLocation();
    const history = useHistory();

    const [alertText, setAlertText] = useState(null);

    useEffect(() => {
        init();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps


    async function init() {
        initUserManagerFromStorage();
        try {
            await initUserData();
            openPolicyPage();
        }
        catch (error) {
            setAlertText(error.message);
        }
    }


    async function initUserData() {
        let oidcUser = await loginCallback(location.hash);
        await POSTLinkedUser(oidcUser.id_token);
        setLinkedUser(await PUTLoginStats(oidcUser.id_token));
    }


    function openPolicyPage() {
        let locationDescriptor = {
            pathname: "policies"
        }
        history.push(locationDescriptor);
    }


    return (
        <div>
            {
                alertText &&
                <InfoBox alertText={alertText} setAlertText={setAlertText} />
            }
        </div>
    );
}
export default LoginCallback;