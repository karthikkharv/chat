import { useState, useEffect } from 'react';
import './App.css';
import io from 'socket.io-client';

const socket = io.connect("http://localhost:3001");

function App() {
  const [user, setuser] = useState('');
  const [uname, setuname] = useState('');
  const [message, setmessage] = useState([]);
  const [ivalue, setvalue] = useState('');

  const call = () => {
    let d = new Date();
    d = `${d.getHours()} : ${d.getMinutes()}`;
    const obj = {
      message: ivalue,
      room: user,
      person: uname,
      time: d,
    };
    socket.emit("private", obj);
  };

  const join = () => {
    socket.emit("room", user);
  };

  useEffect(() => {
    socket.on("send", (roomdata) => {
      setmessage((prevMessage) => [...prevMessage, roomdata]);
    });
  }, [socket]);

  return (
    <div className="app-container">
      <div className="input-section">
        <input
          className="in"
          placeholder="Enter your name"
          type="text"
          value={uname}
          onChange={(e) => setuname(e.target.value)}
          required
        />
        <input
          className="in"
          placeholder="Enter room name"
          type="text"
          value={user}
          onChange={(e) => setuser(e.target.value)}
          required
        />
        <button className="btn" onClick={join}>
          Join Room
        </button>
      </div>

      <div className="container">
        {message &&
          message.map((each, y) => (
            <div key={y} className={each.person === uname ? 'sent' : 'notsent'}>
              <p className="user">{each.time}</p>
              <p className="message">{each.message}</p>
              <p className="time">{each.person}</p>
            </div>
          ))}
      </div>

      <div className="input-section">
        <input
          className="in"
          type="text"
          value={ivalue}
          onChange={(e) => setvalue(e.target.value)}
        />
        <button className="btn" onClick={call}>
          Send Message
        </button>
      </div>
    </div>
  );
}

export default App;
