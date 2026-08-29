import './CheckBox.css'

function CheckBox({status = false, handler, id}) {

    function handleClick() {
        handler(!status, id);
    }

    function displayCheck() {
        if(status) {
            return "check"
        }
        return "check invisible";
    }

    return(
        <div className="checkbox-container" onClick={handleClick}>
            <div className={displayCheck()}>✔</div>
            <div className="check-back"></div>
        </div>
    );
}

export default CheckBox;