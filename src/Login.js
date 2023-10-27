import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ModalDialog from './ModalDialog';
import './ModalDialog.css';

const Login = () => {
  const navigate = useNavigate();
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [username, setUsername] = useState('');
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const guestLogin = () => {
    const localNickname = localStorage.getItem("userNickname");
    axios
      .post(
        'http://localhost:8081/api/users/guest-login',{}, {
          withCredentials: true
          , headers : {
            "X-Guest-ID" : (localNickname === null) ? "" : localNickname
            }
          }, // 옵션 객체에 withCredentials를 설정합니다.
        )
      .then((response) => {
        const nickname = response.data;
        if ( nickname !== localNickname) { localStorage.setItem("userNickname", nickname); }
        navigate(`/wstest/${nickname}`);
      })
      .catch((error) => {
        alert(error, 'Login failed. Please check your credentials.');
      });
  };

  const handleSignin = () => {
    navigate(`/sign_in/${username}`);
  };

  const handleJoin = () => {
    if (!username) {
      guestLogin();
      return;
    }
    const apiUrl = 'http://localhost:8081/api/users/exists/' + username;
    axios
      .get(apiUrl)
      .then((response) => {
        if (response.data) {
          navigate(`/password_input/${username}`);
        } else {
          openModal();
        }
      })
      .catch((error) => {
        const errorMessage = error.response && error.response.data ? error.response.data.message : 'Something went wrong!';
        alert(errorMessage);
      });
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh', // 화면 높이를 최소화하여 화면 정중앙에 배치
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
        <input
          type="text"
          placeholder="username"
          value={username}
          onChange={handleUsernameChange}
        />
        <button onClick={handleJoin} style={{ width: '100%' }}>
          JOIN
        </button>
      </div>

      {isModalOpen && (
        <div className="modal">
          <ModalDialog
            isOpen={isModalOpen}
            closeModal={closeModal}
            handleSignin={handleSignin}
            guestLogin={guestLogin}
          />
        </div>
      )}
    </div>
  );
};

export default Login;
