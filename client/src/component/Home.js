import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import {BEIGE, BROWNISH, MUD_BROWN} from '../constants';
import TextInput from './shared/TextInput';
import ReactArcText from 'react-arc-text-fix';
import {Responsive} from './shared/responsive';

function Home() {
  const style = {
    container: {
      height: '100%',
      backgroundColor: BEIGE,
      display: 'flex',
      justifyContent: 'center',
    },
    content: {
      width: 800,
      alignSelf:'center',
      textAlign: 'center',
    },
    by: {
      color: MUD_BROWN,
      fontSize: 20,
      fontWeight: 500,
      textAlign: 'center',
      marginBottom: 40,
      letterSpacing: 2,
    },
    title: {
      color: MUD_BROWN,
      fontSize: 62,
      fontWeight: 900,
      marginBottom: 20,
      textAlign: 'center',
      letterSpacing: 4,
    },
    button: {
      width: 120,
      height: 50,
      border: 'none',
      fontSize: 18,
      fontWeight: 900,
      letterSpacing: 2,
      marginTop: 20,
      backgroundColor: BROWNISH,
      color: MUD_BROWN,
      cursor: 'pointer',
    }
  };

  const mobileStyle = {
    content: {
      width: '100%',
      alignSelf:'center',
      textAlign: 'center',
    },
    title: {
      color: MUD_BROWN,
      fontSize: 48,
      fontWeight: 900,
      marginBottom: 20,
      textAlign: 'center',
      letterSpacing: 4,
    }
  };

  const [username, setUsername] = useState('');
  const [roomName, setRoomName] = useState('');
  const history = useHistory();
  const { isMobile } = Responsive();
  const handleUsernameChange = (event)  => setUsername(event.target.value);
  const handleRoomNameChange = (event)  => setRoomName(event.target.value);
  const createRoom = () => {
    axios.post('/create-room', {username, roomName}).then(
      res => {
        history.push(res.data.redirectUrl, {userID: username});
      });
  };

  return (
    <div style={style.container}>
      <div className='content' style={isMobile ? mobileStyle.content : style.content}>
        <div style={{marginBottom: '40px'}}>
          <div style={style.by}>
            <div style={{marginBottom: '4px'}}>
            A
            </div>
            <div style={{fontWeight: 900}}>
              <ReactArcText
                text={'CODENAME INSPIRED'}
                direction={1}
                arc={360}
                class={''}
              />
            </div>
            <div style={{marginTop: '-10px'}}>
            CARD GAME
            </div>
          </div>
          <div style={isMobile ? mobileStyle.title : style.title}>
            CROSSED KEYS
          </div>
        </div>
        <div>
          <TextInput
            name='username'
            value={username}
            placeholder={'Username'}
            onChange={handleUsernameChange}
            style={isMobile ? {width: '90%'} : {}}
          />
        </div>
        <div>
          <TextInput name="roomName"
            value={roomName}
            placeholder={'Room Name'}
            onChange={handleRoomNameChange}
            style={isMobile ? {width: '90%'} : {}}
          />
        </div>
        <button style={style.button} onClick={createRoom}>SUBMIT</button>
      </div>
    </div>
  );
}

export default Home;