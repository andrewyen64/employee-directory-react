import React, {useState, useEffect} from "react";
import DataTable from "../DataTable";
import Nav from "../Nav";
import API from "../../utils/API";
import DataAreaContext from "../../utils/DataAreaContext"
import "./DataArea.css";


const DataArea = () => {
  const [developerState, setDeveloperState] = useState({
    users: [],
    order: "ascend",
    filteredUsers: [],
    headings: [
      { name: "Image", width: "8%" },
      { name: "Name", width: "10%" },
      { name: "Phone", width: "10%" },
      { name: "Email", width: "15%" },
      { name: "DOB", width: "8%" }
    ]
  });

  const handleSort = heading => {
    if (developerState.order === "descend") {
      setDeveloperState({
        order:"ascend"
      });
    } else {
      setDeveloperState({
        order:"descend"
      });
    }

    const compareFnc = (a, b) => {
      if (developerState.order === "ascend") {
        if (a[heading] === undefined) {
          return 1;
        } else if (b[heading] === undefined) {
          return -1;
        } else if (heading === "name") {
          return a[heading].first.localeCompare(b[heading].first);
        } else {
          return b[heading] - a[heading];
        } 
      } else {
        if (a[heading] === undefined){
                return 1;
        } else if (b[heading] === undefined){
                return -1;
        } else if (heading ==="name"){
                return b[heading].first.localeCompare(a[heading].first);
        } else {
                return b[heading]-  a[heading];
            }
        }
    }

    const sortedUsers = developerState.filteredUsers.sort(compareFnc);

    setDeveloperState({
      ...developerState,
      filteredUsers: sortedUsers
    });

  };
    
  useEffect(() => {
    API.getEmployees().then(results => {
      setDeveloperState({
        ...developerState,
        users: results.data.results,
        filteredUsers: results.data.results
      });
    });
  }, []);
   
  const handleSearchChange = event => {
    const filter = event.target.value;
    const filteredList = developerState.users.filter(item => {
      let values = item.name.first.toLowerCase();
      return values.indexOf(filter.toLowerCase()) !== -1;
    });
  
    setDeveloperState({ 
      ...developerState, 
      filteredUsers: filteredList 
    });
  };
  
  return (
    <DataAreaContext.Provider
      value={{ developerState, handleSearchChange, handleSort }}
    >
    <Nav />
    <div className="data-area">
      {developerState.filteredUsers.length > 0 ? <DataTable />: 
        <div></div>
      }
    </div>
    </DataAreaContext.Provider>
  );
}
    
export default DataArea;