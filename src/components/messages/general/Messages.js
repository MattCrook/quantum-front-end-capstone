import React, { useState, useEffect, useCallback } from "react";
// import userManager from "../../modules/users/userManager";
import messageManager from "../../../modules/messages/messageManager";
import MessageCard from "./pages/MessageCard";
import MessageForm from "./MessageForm";
import { useAuth0 } from "../../../contexts/react-auth0-context";
import { useAuthUser } from "../../../contexts/AuthUserContext";
import { useErrorLog } from "../../../contexts/ErrorLogContext";
import "../Messages.css";

const MessageList = (props) => {
  const { user, loading, logout, clearStorage, djangoRestAuthLogout } = useAuth0();
  const { authUser, userProfile } = useAuthUser();
  const { postNewErrorLog } = useErrorLog();
  const [allMessages, setAllMessages] = useState([]);
  const [paginatedMessages, setPaginatedMessages] = useState([]);

  const [messageToEdit, setMessageToEdit] = useState({
    user_id: "",
    text: "",
    timestamp: "",
  });
  const userProfileId = userProfile.id;
  const defaultProfilePicture = "https://aesusdesign.com/wp-content/uploads/2019/06/mans-blank-profile-768x768.png";

  const getMessages = async () => {
    try {
      const messages = await messageManager.getAllMessages();
      setAllMessages(messages);
      // const sortedMessages = sortByDate(messages);
      // const messagesNewestToOldest = sortedMessages.reverse();
      // const messagesToShow = messagesNewestToOldest.slice(0, 7);
      // const sortBackToOldestToNewest = messagesToShow.reverse()
      // setPaginatedMessages(sortBackToOldestToNewest);
    } catch (error) {
      postNewErrorLog(error, "Messages.js", "getMessages");
    }
  };

  useEffect(() => {
    getMessages();
  }, []);

  // function sortByDate(messages) {
  //   console.log(messages)
  //   const sorted = messages.sort((a, b) => {
  //     const dateA = new Date(a.timestamp);
  //     const dateB = new Date(b.timestamp);
  //     return dateA - dateB;
  //   });
  //   return sorted;
  // }


  return (
    <>
      <nav id="nav_forum_container" className="navbar is-dark">
        <div className="forum_container_1">
          <div className="navbar-brand">
            <button id="quantum_logo_forum" className="navbar-item">
              Quantum Coasters
            </button>
          </div>
        </div>

        <div className="forum_container_2">
          {!loading && user && (
            <>
              <button className="navbar-item-name">
                {authUser.first_name} {authUser.last_name}
              </button>
              {userProfile.image ? (
                <img id="profile-pic" src={userProfile.image.image} alt="My Avatar" />
              ) : (
                <img id="profile-pic" src={defaultProfilePicture} alt="My Avatar" />
              )}
              <button
                onClick={() => djangoRestAuthLogout(logout, clearStorage, authUser)}
                className="navbar-item-logout-btn"
              >
                Logout
              </button>
              <hr />
            </>
          )}
        </div>
      </nav>

      <div className="chat-wrapper">
        <div className="chat-fixed-height-container">
          <div id="chat-headerContainer">
            <div className="forum-header">
              <h1>Forum</h1>
            </div>
          </div>
          <div className="chat-ScrollToBottom">
            <div className="message-container-cards">
              {allMessages
                .sort(function (a, b) {
                  return new Date(a.timestamp) - new Date(b.timestamp);
                })
                .map((message) => (
                  <MessageCard
                    key={message.id}
                    message={message}
                    setMessageToEdit={setMessageToEdit}
                    userProfile={userProfile}
                    authUser={authUser}
                    defaultProfilePicture={defaultProfilePicture}
                    loading={loading}
                    {...props}
                  />
                ))}
            </div>
          </div>
          <div className="container-form">
            <MessageForm
              userProfile={userProfile}
              userProfileId={userProfileId}
              paginatedMessages={paginatedMessages}
              messageToEdit={messageToEdit}
              setMessageToEdit={setMessageToEdit}
              setAllMessages={setAllMessages}
              getMessages={getMessages}
              {...props}
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default MessageList;
