import { useEffect, useState } from "react";

export default ({ type, message,onClose }) => {

    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            if (onClose) {
                onClose();
            }
        }, 5000); 

        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        if (onClose) {
            onClose();
        }
    }

    return (<>
        {
            isVisible &&
            <div className="InfoBox">
                {type === 'warning' &&
                    <p className={"warning"}>
                        {`Warning: ${message}`}
                    </p>
                }
                {type === 'feedback' &&
                    <p className={"feedback"}>
                        {`${message}`}
                    </p>
                }
                <button className="infobox-btn" onClick={handleClose}>X</button>
            </div>
        }
    </>)
}