import { AiFillCloseCircle } from 'react-icons/ai';
import {
    Alert
} from 'reactstrap';

import './info_box.css'


const InfoBox = ({ alertText, setAlertText }) => {
    return (
        <Alert
            color='primary'
            className="alert-font-size h-50 flex-grow-1 d-flex justify-content-start align-items-center mb-0"
        >
            <AiFillCloseCircle
                className="mr-2"
                size={15}
                onClick={() => { setAlertText(null) }}
            />
            {alertText}
        </Alert>

    )
}
export default InfoBox;