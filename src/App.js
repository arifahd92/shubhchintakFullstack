import React, { useEffect, useState } from "react";
import("./app.css");
export default function App() {
  const [filter, setFilter] = useState("allTask");
  const [search, setSearch] = useState("");
  const [backendRequest, setBackendRequest] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editId, setEditId] = useState("");
  const [task, setTask] = useState([]);
  const [inptVal, setInptVal] = useState({
    title: "",
    desc: "",
    date: "",
  });
  const [status, setstatus] = useState("not completed");

  useEffect(() => {
    let timer = setTimeout(async () => {
      try {
        setBackendRequest(true);
        const response = await fetch("http://localhost:4000/filter", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ filter, search }),
        });
        const data = await response.json();
        setBackendRequest(false);
        if (!response.ok) {
          alert("try again");
          setBackendRequest(false);
          return;
        }
        console.log(data);
        setTask(data);
      } catch (error) {
        alert("try again");
        setBackendRequest(false);
      }
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [filter, search]);

  //input state handeling

  const handleChange = (e) => {
    let name = e.target.id;
    setInptVal({ ...inptVal, [name]: e.target.value });
  };
  const handleStatus = (e) => {
    setstatus(e.target.value);
  };

  //*****************************submitting form add/update *****************

  const handleSubmit = async (e) => {
    e.preventDefault();

    let enteredDate = inptVal.date;
    if (enteredDate === "") {
      alert("please select a due date");
      return;
    }
    const date = new Date(enteredDate);
    let enteredTime = date.getTime();
    const currentDate = new Date();
    let currentTime = currentDate.getTime();
    if (currentTime > enteredTime) {
      alert("can not selecte past time ");
      return;
    }
    //console.log({ enteredTime, currentTime })

    if (inptVal.title.length < 3) {
      alert("enter title");
      return;
    }
    console.log(inptVal);
    console.log({ status });
    const currentTask = { ...inptVal, status };
    console.log(currentTask);
    if (!edit) {
      setBackendRequest(true);
      const response = await fetch("http://localhost:4000/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentTask),
      });
      const data = await response.json();
      setBackendRequest(false);
      setTask(data);
      setInptVal({ title: "", desc: "", date: "" });
      setstatus("not completed");
    }
    // update request
    if (edit == true) {
      setBackendRequest(true);
      const response = await fetch("http://localhost:4000/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...currentTask, _id: editId }),
      });
      const data = await response.json();
      setBackendRequest(false);
      setTask(data);
      setTask(data);
      setInptVal({ title: "", desc: "", date: "" });
      setstatus("not completed");
      setEdit(false);
    }
  };
  // find by id
  const findSpecificData = async (_id) => {
    setBackendRequest(true);
    const response = await fetch("http://localhost:4000/findById", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ _id }),
    });
    const data = await response.json();
    if (!response.ok) {
      alert("try again");
      setBackendRequest(false);
      return;
    }
    console.log(data);
    return data; //promise
  };
  //edit frontend
  const editFontend = async (_id) => {
    // setInptVal(findSpecificData(_id));
    const data = await findSpecificData(_id);
    console.log(data);
    const { title, desc, date, status } = data;
    setInptVal({ title, desc, date: date });
    setstatus(status);
    setEdit(true);
    setEditId(_id);
    setBackendRequest(false);
  };
  //delete data
  const deleteData = async (_id) => {
    try {
      var confirmation = window.confirm(
        "Are you sure data will be deleted permanent?"
      );

      // If the user clicks "Cancel" in the confirmation dialog, return from the function
      if (!confirmation) {
        return;
      }
      setBackendRequest(true);
      const response = await fetch("http://localhost:4000/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id }),
      });
      const data = await response.json();
      setBackendRequest(false);
      if (!response.ok) {
        alert("try again");
        setBackendRequest(false);
        return;
      }
      setTask(data);
    } catch (err) {
      console.log(err.message);
      setBackendRequest(false);
    }
  };
  //filtering
  const handleFilter = (e) => {
    setFilter(e.target.value);
  };
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };
  return (
    <div className="wrapper">
      {backendRequest && (
        <div className="containerLoader">
          <div className="loader"></div>
        </div>
      )}
      {backendRequest == false && (
        <>
          <div>
            <div className="filter">
              <select
                className="input"
                id="filter"
                name=""
                value={filter}
                onChange={handleFilter}
              >
                <option value="allTask">all task</option>
                <option value="not completed">not completed</option>
                <option value="completed">completed</option>
              </select>
            </div>
            <div className="search" id="search">
              <input
                className="input"
                placeholder="search by title..."
                type="text"
                name=""
                id="search"
                onChange={handleSearch}
                value={search}
              />
            </div>

            <form action="">
              <div className="container">
                <div className="innerInputContainer">
                  <div className="input">
                    <label htmlFor="title" className="lableTitle">
                      {" "}
                      enter title*{" "}
                    </label>
                    <input
                      placeholder="title"
                      className="input"
                      type="text"
                      id="title"
                      onChange={handleChange}
                      value={inptVal.title}
                      required
                    />
                  </div>

                  <div className="input">
                    <label htmlFor="desc" className="lableTitle">
                      {" "}
                      description{" "}
                    </label>
                    <input
                      placeholder="description"
                      className="input"
                      type="text"
                      name=""
                      id="desc"
                      value={inptVal.desc}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="innerInputContainer">
                  <div className="input">
                    <label htmlFor="date"> due date</label>

                    <input
                      className="input"
                      type="date"
                      name=""
                      id="date"
                      onChange={handleChange}
                      value={inptVal.date}
                    />
                  </div>
                  <div className="input">
                    <label htmlFor="status">select status </label>
                    <select
                      className="input"
                      name=""
                      id="status"
                      value={status}
                      onChange={handleStatus}
                    >
                      <option value="not completed">not completed</option>
                      <option value="completed">completed</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="container">
                <button onClick={handleSubmit} id="submitbtn">
                  {!edit && <>submit</>} {edit && <>save</>}
                </button>
              </div>
            </form>
          </div>
          <div className="container">
            <div className="heading">title</div>
            <div className="heading">description</div>
            <div className="heading">due date</div>
            <div className="heading">status</div>
            <div className="heading">delete task</div>
            <div className="heading">edit task</div>
          </div>
          <hr />
          <div className="listContainer">
            {task.length > 0 &&
              task.map((task, ind) => {
                return (
                  <>
                    <li key={task._id} className="listitem">
                      <div className="innerContainer1">
                        <span>{task.title}</span>
                        <span>{task.desc}</span>

                        <span>{task.date}</span>
                        <div>
                          {task.status == "completed" && (
                            <>
                              <div className="complete"></div>
                            </>
                          )}{" "}
                          {task.status == "not completed" && (
                            <>
                              <div className="left"></div>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="innerContainer2">
                        <button
                          className="btn"
                          id="deletebtn"
                          onClick={(t) => deleteData(task._id)}
                        >
                          delete
                        </button>
                        <button
                          className="btn"
                          id="editbtn"
                          onClick={(t) => editFontend(task._id)}
                        >
                          edit
                        </button>
                      </div>
                    </li>
                    <hr />
                  </>
                );
              })}
            {task.length == 0 && (
              <>
                <div className="alertcontainer">
                  <div className="alert">nothing to show add some task </div>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
