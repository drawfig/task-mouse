import './Modal.css';
import Dropdown from "../Dropdown/Dropdown.jsx";
import {useEffect, useState} from "react";

function Modal({open, setOpen, handler, title, body, type}) {

    function modalType() {
        switch (type) {
            case "add":
                return <AddTaskModal
                    setOpen={setOpen}
                    handler={handler}
                    title={title}
                />;
            case "delete":
            default:
                return <DeleteModal
                setOpen={setOpen}
                handler={handler}
                title={title}
                body={body}
                open={open}
                />;
        }
    }

    if(open) {
        return (
            <>
                <div className="modal">
                    {modalType()}
                </div>
                <div className="modal-background" onClick={() => setOpen(false)}></div>
            </>
        );
    }
}

function DeleteModal({setOpen, handler, title, body, open}) {
    return(
        <>
            <div className="modal-title">{title}</div>
            <div>{body}</div>
            <div className="btn-group">
                <button className="alert-btn" onClick={() => handler(open.status, open.id)}>Delete</button>
                <button className="secondary-btn" onClick={() => setOpen(false)}>No</button>
            </div>
        </>
    );
}

function AddTaskModal({setOpen, handler, title}) {
    const max = 128;
    const [priority, setPriority] = useState(null);
    const [taskName, setTaskName] = useState("");
    const [error, setError] = useState(0);

    useEffect(() => {
        function handleKeyDown(e) {
            if(e.key === "Enter") {
                e.preventDefault();
                handleSubmit();
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [priority, taskName]);

    async function handleSubmit() {
        if(taskName.length > max) {
            setError(1);
            return;
        }
        if(taskName.length < 1) {
            setError(2);
            return;
        }
        if(!priority) {
            setError(3);
            return;
        }

        await handler(priority.toLowerCase(), taskName);
    }

    function errorDisplay() {
        switch (error) {
            case 1:
                return <div className="error-text">Task name must be less that {max} characters</div>
            case 2:
                return <div className="error-text">Task name must be at least 1 character long</div>
            case 3:
                return <div className="error-text">Please select a priority</div>
            default:
                return <div className="error-text" style={{color:"transparent", userSelect:"none"}}>fill</div>
        }
    }

    return(
        <>
            <div className="modal-title">{title}</div>
            <div className="form-body">
                <div className="form-label" style={{width:"90%"}}>Enter the Name of the task</div>
                <input
                    autoFocus={true}
                    type="text"
                    placeholder="Task Name"
                    className="form-input"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                />
                <Counter text={taskName} max={max}></Counter>
                <div className="form-label">Select the Priority</div>
                <Dropdown title="Priority" options={["Low", "Medium", "High"]} handler={setPriority} selected={priority}></Dropdown>
                {errorDisplay()}
            </div>
            <div className="btn-group" style={{gap: "150px"}}>
                <button className="success-btn" onClick={handleSubmit}>Add Task</button>
                <button className="secondary-btn" onClick={() => setOpen(false)}>Cancel</button>
            </div>
        </>
    );
}

function Counter({text, max}) {
    return(
        <div className="counter" style={{color: text.length > max ? "var(--alert)" : "var(--secondary)"}}>{text.length}/{max}</div>
    );
}

export default Modal;