import { useEffect, useState } from "react";
import { getUsers } from "../api/api";

function UserSelector({ onSelect }) {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    getUsers().then((res) => {
      setUsers(res.data);
      if (res.data.length > 0) {
        setSelected(res.data[0]._id);
        onSelect(res.data[0]._id);
      }
    });
  }, []);

  const handleChange = (e) => {
    setSelected(e.target.value);
    onSelect(e.target.value);
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <label>Select User: </label>
      <select value={selected} onChange={handleChange}>
        {users.map((user) => (
          <option key={user._id} value={user._id}>
            {user.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default UserSelector;
