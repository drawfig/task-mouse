import './Tasks.css';
import {useEffect, useRef, useState} from "react";
import CheckBox from "../CheckBox/CheckBox.jsx";
import Modal from "../Modal/Modal.jsx";
import {send_request} from "colby-jack";
import {useNavigate} from "react-router";

function Tasks({userLoading, logoutSig}) {
    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false);
    const [addTask, setAddTask] = useState(false);

    const [activeTasks, setActiveTasks] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([]);

    useEffect(() => {
        if(logoutSig) {
            navigate("/");
        }
    }, [logoutSig])

    useEffect(() => {
        async function getTasks() {
            let resp = await send_request("/api/get_tasks", {}, true);
            if(resp.status && resp.status === "success") {
                let tasks = resp.data;
                let active = tasks.filter((task) => task.status === "active");
                active.sort((a, b) => a.rank - b.rank);
                let completed = tasks.filter((task) => task.status === "completed");
                completed.sort((a, b) => a.rank - b.rank);
                setActiveTasks(active);
                setCompletedTasks(completed);
            }
            else {
                console.log(resp.data);
            }
        }

        if(!userLoading) {
            getTasks();
        }
    }, [userLoading]);

    useEffect(() => {
        function handleKeyDown(e) {
            if(e.key === "Enter" && !addTask && !modalOpen) {
                e.preventDefault();
                setAddTask(true);
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [addTask, modalOpen]);

    async function handleCheck(status, id) {
        let data;
        if(status) {
            let task = activeTasks.find((task) => task.id === id);
            task.status = "completed";
            task.rank = completedTasks.length + 1;
            setActiveTasks(activeTasks.filter((task) => task.id !== id));
            setCompletedTasks([...completedTasks, task]);

            data = {
                task_id: id,
                status: "completed",
                rank: task.rank,
            };
        }
        else {
            let task = completedTasks.find((task) => task.id === id);
            task.status = "active";
            task.rank = activeTasks.length + 1;
            setCompletedTasks(completedTasks.filter((task) => task.id !== id));
            setActiveTasks([...activeTasks, task]);

            data = {
                task_id: id,
                status: "active",
                rank: task.rank,
            };
        }

        let resp = await send_request("/api/update_status", data, true);
        if(!resp.status && resp.status === "error") {
            console.log(resp.data);
        }
    }

    async function handleDelete(status, id) {
        if(status === "active") {
            setActiveTasks(activeTasks.filter((task) => task.id !== id));
        }
        else {
            setCompletedTasks(completedTasks.filter((task) => task.id !== id));
        }
        setModalOpen(false);

        let resp = await send_request("/api/delete_task", {task_id: id}, true);
        if(!resp.status && resp.status === "error") {
            console.log(resp.data);
        }
    }

    async function handleAddTask(priority, taskName) {
        let newTask = {
            id: activeTasks.length + completedTasks.length + 1,
            rank: activeTasks.length + 1,
            title: taskName,
            status: "active",
            priority: priority,
            date: Date.now(),
        };
        const oldTasks = activeTasks;
        setActiveTasks([...activeTasks, newTask]);
        setAddTask(false);

        const data = {
            title: taskName,
            priority: priority,
            rank: oldTasks.length + 1,
        };

        let resp = await send_request("/api/create_task", data, true);
        if(resp.status && resp.status === "success") {
            newTask.id = resp.data.id;
            setActiveTasks([...oldTasks, newTask]);
        }
        if(!resp.status && resp.status === "error") {
            setActiveTasks(oldTasks);
            console.log(resp.data);
        }
    }

    async function handleLogout() {
        await send_request("/api/logout", {}, true);
    }

    return(
        <>
            <Modal
                title="Task Removal"
                body="Do you want to delete the task?"
                handler={handleDelete}
                open={modalOpen}
                setOpen={setModalOpen}
                type="delete"
            ></Modal>
            <Modal
                title="Add New Task"
                body="Enter the task name and priority"
                handler={handleAddTask}
                open={addTask}
                setOpen={setAddTask}
                type="add"
            ></Modal>
            <div className="container">
                <div className="navbar">
                    <div className="app-name" style={{cursor:"pointer"}} onClick={() => navigate("/")}>Task Mouse 🐭</div>
                    <button className="logout-btn" style={{fontSize:15, marginLeft:"auto", marginRight:20}} onClick={handleLogout}>Logout</button>
                </div>
                <div className="list-container" style={{cursor: "pointer"}} onClick={() => setAddTask(true)}>
                    <div className="card">
                        <div className="add-task-box">
                            <div className="task-list-title" style={{marginBottom: 0}}>+ Add New Task...</div>
                            <div style={{marginLeft:"auto"}}>(Press Enter)</div>
                        </div>
                    </div>
                </div>
                <ListContainer
                    title="Active Tasks"
                    list={activeTasks}
                    setList={setActiveTasks}
                    checkHandler={handleCheck}
                    setModalOpen={setModalOpen}
                ></ListContainer>
                <ListContainer
                    title="Completed Tasks"
                    list={completedTasks}
                    setList={setCompletedTasks}
                    checkHandler={handleCheck}
                    setModalOpen={setModalOpen}
                ></ListContainer>
            </div>
        </>
    );
}

function TaskItem({title, status, priority, date, id, checkHandler, setModalOpen, index, dragStart, handleDrop, isDragging}) {
    function pillMake() {
        switch (priority.toLowerCase()) {
            case "high":
                return <Pill color="var(--alert)" text="High"/>;
            case "medium":
                return <Pill color="var(--warning)" text="Medium"/>;
            case "low":
            default:
                return <Pill color="var(--success)" text="Low"/>;
        }
    }

    function checkboxActive() {
        return status === "completed";
    }

    function handleDragOver(e) {
        e.preventDefault();
    }

    function itemStyle() {
        if(isDragging) {
            return "task-item dragging";
        }
        return "task-item";
    }

    function textStyle() {
        if(checkboxActive()) {
            return "list-item-text strikethrough";
        }
        return "list-item-text";
    }

    return(
        <div className={itemStyle()} draggable="true" onDragStart={() => dragStart(index)} onDragOver={handleDragOver} onDrop={() => handleDrop(index)}>
            <CheckBox status={checkboxActive()} handler={checkHandler} id={id}></CheckBox>
            <div className={textStyle()}>{title}</div>
            {pillMake()}
            <CloseBtn setModalOpen={setModalOpen} data={{status: status, id: id}}></CloseBtn>
        </div>
    );
}

function Pill({color, text}) {
    return(
        <div className="pill" style={{backgroundColor:color}}>{text}</div>
    );
}

function ListContainer({title, list, setList, checkHandler, setModalOpen}) {
    const [sort, setSort] = useState("none");
    const [isDragging, setIsDragging] = useState(false);
    const dragItemIndex = useRef(null);

    function sortList(filterIn) {
        let _list = [...list];
        let desc = true;

        if(sort === "desc") {
            desc = false;
        }

        if(filterIn === "Date" && desc) {
            _list.sort((a, b) => b.date - a.date);
        }
        else if(filterIn === "Date" && !desc) {
            _list.sort((a, b) => a.date - b.date);
        }
        else if( filterIn === "Alphabetical" && desc) {
            _list.sort((a, b) => a.title.localeCompare(b.title));
        }
        else if(filterIn === "Alphabetical" && !desc) {
            _list.sort((a, b) => b.title.localeCompare(a.title));
        }
        else if(filterIn === "Priority" && desc) {
            let top = _list.filter((task) => task.priority === "high");
            top.sort((a, b) => b.date - a.date);
            let mid = _list.filter((task) => task.priority === "medium");
            mid.sort((a, b) => b.date - a.date);
            let low = _list.filter((task) => task.priority === "low");
            low.sort((a, b) => b.date - a.date);
            _list = [...top, ...mid, ...low];
        }
        else if(filterIn === "Priority" && !desc) {
            let top = _list.filter((task) => task.priority === "high");
            top.sort((a, b) => a.date - b.date);
            let mid = _list.filter((task) => task.priority === "medium");
            mid.sort((a, b) => a.date - b.date);
            let low = _list.filter((task) => task.priority === "low");
            low.sort((a, b) => a.date - b.date);
            _list = [...low, ...mid, ...top];
        }

        _list.forEach((task, index) => {
            task.rank = index + 1;
        });

        if(sort === "none" || sort === "asc") {
            setSort("desc");
        }
        else {
            setSort("none");
        }

        setList(_list);

        let data = {};
        _list.forEach((task) => {
            data[task.id] = task.rank;
        });

        let resp = send_request("/api/update_ranks", {tasks: data}, true);

        if(!resp.status && resp.status === "error") {
            console.log(resp.data);
        }
    }

    function handleDragStart(index) {
        setIsDragging(true);
        dragItemIndex.current = index;
    }

    function handleDrop(targetIndex) {
        let _list = [...list];
        let [draggedItem] = _list.splice(dragItemIndex.current, 1);

        _list.splice(targetIndex, 0, draggedItem);
        _list.forEach((task, index) => {
            task.rank = index + 1;
        });

        dragItemIndex.current = null;
        setList(_list);
        setIsDragging(false);

        let data = {};
        _list.forEach((task) => {
            data[task.id] = task.rank;
        });

        let resp = send_request("/api/update_ranks", {tasks: data}, true);
        if(!resp.status && resp.status === "error") {
            console.log(resp.data);
        }
    }

    list.sort((a, b) => a.rank - b.rank);

    let taskItems = list.map((task, index) => <TaskItem
        title={task.title}
        status={task.status}
        priority={task.priority}
        date={task.date}
        checkHandler={checkHandler}
        id={task.id}
        setModalOpen={setModalOpen}
        index={index}
        dragStart={handleDragStart}
        handleDrop={handleDrop}
        isDragging={isDragging}
    />);

    return(
        <div className="list-container">
            <div className="card" style={{width:"100%"}}>
                <div style={{display:"flex", width:"100%"}}>
                    <div className="task-list-title">{title}</div>
                    <Filter handler={sortList}></Filter>
                </div>
                <div className="task-list">
                    {taskItems}
                </div>
            </div>
        </div>
    );
}

function CloseBtn({setModalOpen, data}) {
    return(
        <>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="close-btn" onClick={() => setModalOpen(data)}>
                <path fill-rule="evenodd"
                      d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                      clip-rule="evenodd"/>
            </svg>
        </>
    );
}

function Filter({handler}) {
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);

    function useClickOutside(ref, handler) {
        useEffect(()=> {
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

    useClickOutside(menuRef, () => setOpen(false));

    return(
        <div style={{marginLeft:"auto"}} ref={menuRef}>
            <div className="filter-btn" onClick={() => setOpen(!open)}>
                <div>Filter</div>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                     className="lucide lucide-list-filter-icon lucide-list-filter">
                    <path d="M2 5h20"/>
                    <path d="M6 12h12"/>
                    <path d="M9 19h6"/>
                </svg>
            </div>
            <FilterMenu open={open} items={["Date", "Alphabetical", "Priority"]} handler={handler}></FilterMenu>
        </div>
    );
}

function FilterMenu({open, items, handler}) {
    let out = items.map((item) => <div className="filter-item" onClick={() => handler(item)}>{item}</div>);

    if(open) {
        return(
            <div className="filter-menu">{out}</div>
        );
    }
}

export default Tasks;