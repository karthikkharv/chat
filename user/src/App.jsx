// this is created through the react vite



import { useState } from 'react'
import './App.css'
import io from 'socket.io-client';
import { useEffect } from 'react';
const socket = io.connect("http://localhost:3001");
//when we removed strict mode rendering twice stoppped
function App() {
  const [user,setuser] = useState('');
  const [message,setmessage] = useState([
  ]);
  const [ivalue,setvalue] = useState('');
  const call =()=>{
    let d = new Date();
    d = d.getHours()+' '+d.getMinutes();
    console.log(d);
    const obj = {
      message:ivalue,
      user:user,
      time:d,
    }
    console.log("obj",obj);
    socket.emit("message",obj);
  }
  useEffect(()=>{
    socket.on("comm",(data)=>{
      setmessage((message)=>[...message,data])
    })
  },[socket])
  
  return (
    <div>
      <input className='in' placeholder='name' type='text' value={user} onChange={(e)=>setuser(e.target.value)} required ></input>
      <div className='container'>
       { message?(  message.map((each,y)=>(
            <div key={y} className={each.user==user?'sent':'notsent'}>
              <p className='user'>{each.time}</p>
              <p className='message'>{each.message}</p>
              <p className='time'>{each.user}</p>
            </div>
         ))
      ):('')
      }
     </div>
      <div style={{display:"inline-block"}}>
      <input className='in' type='text' value={ivalue} onChange={(e)=>setvalue(e.target.value)}></input>
      <button style={{backgroundColor:"red",marginLeft:"20px"}} onClick={call} >send</button>
      </div>
    </div>
  )
}

export default App
