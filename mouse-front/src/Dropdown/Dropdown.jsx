import './Dropdown.css'
import {useEffect, useState} from "react";

function Dropdown({title, options, selected, handler}) {
    const [open, setOpen] = useState(false);
    const menuRef = useState(null);

    function selectionDisplay() {
        if(!selected) {
            return title;
        }
        return selected;
    }

    function useClickOutside(ref, handler) {
        useEffect(() => {
            const listener = (event) => {
                if(!ref.current || ref.current.contains(event.target)) {
                    return;
                }
                handler(event);
            };
            document.addEventListener("mousedown", listener);
            document.addEventListener("touchstart", listener);

            return () => {
                document.removeEventListener("mousedown", listener);
                document.removeEventListener("touchstart", listener);
            };
        }, [ref, handler]);
    }

    function handleSelection(option) {
        handler(option);
        setOpen(false);
    }

    useClickOutside(menuRef, () => setOpen(false));

    return(
        <div style={{width:"max-content"}} ref={menuRef}>
            <div className={"dropdown" + (open ? " selected" : "")} onClick={() => setOpen(!open)}>{selectionDisplay()} <div>▼</div></div>
            <DropdownMenu handler={handleSelection} open={open} options={options}></DropdownMenu>
        </div>
    );
}

function DropdownMenu({open, options, handler}) {
    let selections = options.map((item) => <div className="dropdown-item" onClick={() => handler(item)}>{item}</div>);

    if(open) {
        return(
            <div className="dropdown-menu">{selections}</div>
        );
    }
}

export default Dropdown;