import { useEffect } from 'react';

const LogsPage = ({ setTobbarLabel, label }) => {

    useEffect(() => {
        setTobbarLabel(label)
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div>
            <h1>Work in progress</h1>
        </div>
    )
}

export default LogsPage;