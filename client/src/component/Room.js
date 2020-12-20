import React, { useState, useEffect, useRef } from "react";
import socketIOClient from "socket.io-client";
import axios from 'axios';
import { useHistory } from 'react-router-dom';
const ENDPOINT = "http://127.0.0.1:3001";
export const socket = socketIOClient(ENDPOINT);


function Room(props) {
  const [roomID, setRoomID] = useState('');
  const [user, setUser] = useState({});
  const [redTeam, setRedTeam] = useState([]);
  const [blueTeam, setBlueTeam] = useState([]);
  const [nullTeam, setNullTeam] = useState([]);
  const [onTeam, setOnTeam] = useState(false);
  const [roomData, setRoomData] = useState({});

  const history = useHistory();

  const organizeUsers = users => {
    const emptyRedTeam = [];
    const emptyBlueTeam = [];
    const emptyNullTeam = [];
    console.log('organize', users);
    Object.keys(users).forEach((userID) => {
        if(users[userID].team === "RED") {
          emptyRedTeam.push(userID);
        } else if (users[userID].team === "BLUE") {
          emptyBlueTeam.push(userID);
        } else {
          emptyNullTeam.push(userID);
        }
    });
    setRedTeam(emptyRedTeam);
    setBlueTeam(emptyBlueTeam);
    setNullTeam(emptyNullTeam);
  };

  const handleSetRedTeamClick = event => {
    setOnTeam(true);
    socket.emit('setRedTeam', {roomID, userID: props.location.state.userID});
  };

  const handleSetBlueTeamClick = event => {
    setOnTeam(true);
    socket.emit('setBlueTeam', {roomID, userID: props.location.state.userID});
  };

  const handleClaimSpyMasterClick = event => {
    socket.emit('claimSpyMaster', {roomID, userID: props.location.state.userID});
  };

  const startGame = () => {
    socket.emit('hostStartGame', {roomID});
  };

  const style = {
    columnStyle:{
      margin:"50px",
      height:"auto",
      width:"200px"
    },
    containerStyle:{
      display:"grid",
      position: "absolute",
      left:"20%",
      top:"15%",
      gridGap: "25px",
      gridTemplateColumns:"1fr 1fr 1fr"
    },
    teamButton:{
      display:"grid",
      position: "absolute",
      left:"25%",
      bottom:"10%",
      gridGap: "250px",
      gridTemplateColumns:"1fr 1fr 1fr"
    }
  }

  useEffect(() => {
    setRoomID(props.match.params.roomID);
    socket.emit('joinRoom', {roomID: props.match.params.roomID, userID: props.location.state.userID });

    socket.on('startGame', (data) => {
      history.push(`/${data.roomID}/game`, {data, userID:props.location.state.userID });
    });

    return () => {
      socket.disconnect();
    };
  }, "");

  useEffect(() => {
    socket.on('updateTeams', (data) => {
      organizeUsers(data.users);
      setUser(data.users[props.location.state.userID]);
      setRoomData(data);
    });
  }, []);

  const showClaimSpyMaster = () => {
    if(user.team === "RED" && roomData.redSpy) {
      return false;
    } else if (user.team === "BLUE" && roomData.blueSpy) {
      return false;
    }
    return true;
  };

  return (
    <>
      <h1>Current Room: {roomID}</h1>
      <div className="teamChooseContainer" style={style.containerStyle}>
        <div className="redColumn" style={style.columnStyle}>
          <h1>Red Team</h1>
          {redTeam.map((user, i) => {
            return (
            <li key={i}>
              {user}
              {roomData.redSpy === user && <div>spymaster</div>}
            </li>);
          })}
        </div>
      <div className="mainColumn" style={style.columnStyle}>
        <h1>Pick Team</h1>
        {nullTeam.map((user, i) => {
          return (
          <li key={i}>
            {user}
          </li>
          );
        })}
      </div>
      <div className="blueColumn" style={style.columnStyle}>
        <h1>Blue Team</h1>
        {blueTeam.map((user, i) => {
          return (
            <li key={i}>
              {user}
              {roomData.blueSpy === user && <div>spymaster</div>}
            </li>);
          })}
      </div>
      </div>
      <div className="pickTeamButtons" style={style.teamButton}>
      <button value="red" onClick={handleSetRedTeamClick}>Red Team</button>
      {user.host ?
        <button onClick={startGame}>Start Game</button>
        : null
      }
      <button value="blue" onClick={handleSetBlueTeamClick}>Blue Team</button>
      {showClaimSpyMaster() ?
        <button onClick={handleClaimSpyMasterClick}>Claim Spy</button>
        : null
      }
      </div>
    </>
  );
}

export default Room;