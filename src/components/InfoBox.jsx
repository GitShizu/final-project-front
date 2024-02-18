export default ({ type, message }) => {
    return (
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
        </div>
    )
}