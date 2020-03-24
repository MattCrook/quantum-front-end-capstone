import React, { useState, useEffect } from "react";
import ApiManager from "../../modules/ApiManager";
import { isEditCheck, handleSubmitHelperFunction } from "../../modules/Helpers";
import { useAuth0 } from "../../contexts/react-auth0-context";

const MessageForm = props => {
  const { loading, setLoading, user } = useAuth0();

  const [message, setMessage] = useState({ message: "" });

  const handleFieldChange = e => {
    const stateToChange = { ...message };
    stateToChange[e.target.id] = e.target.value;
    setMessage(stateToChange);
  };

  const constructNewMessage = () => {
    if (message === "") {
      window.alert("Please input a post");
    } else {
      // setLoading(true);

      const messageToPost = {
        userId: parseInt(user.id),
        message: message.message,
        timestamp: new Date().toLocaleString()
      };
      // If this is an edit, we need the id
      // and the timestamp should be what it was.
      // userId doesn't need to change because users
      // will not have a button to edit other users' messages

      
      // this function was extracted to module scope (in helpers directory)
      return isEditCheck(props, messageToPost);
    }
  };

  const postEditedMessage = message => {
    // If the object has an id, it is an edit
    // so we put/update
    if (message.hasOwnProperty("id")) {
      return ApiManager.updateMessagesPut(message);
    } else {
      // Otherwise, it is new, so we post
      return ApiManager.postMessage(message);
    }
  };


  const handleSubmit = handleSubmitHelperFunction(
    setLoading,
    constructNewMessage,
    props,
    postEditedMessage
  );


  useEffect(() => {
    if (props.messageToEdit.message) {
      setMessage(props.messageToEdit);
      // A "one-time" setting of the message field's value
      // when there's a new props.messageToEdit containing a message string
      // (which happens when the edit button is clicked)
      document.getElementById("message").value = props.messageToEdit.message;
    }
    // setLoading(false);
  }, [props.messageToEdit]); // not sure about the [setLoading]

  return (
    <>
      {/*
      https://stackoverflow.com/a/33212911
      Form Submit allows the Enter key to work 
      instead of just clicking the send button
      */}
      <div className="message-container, darker, chat-input-container">
        <form className="chat-form" onSubmit={handleSubmit}>
          <fieldset className="chat-fieldset">
            <div className="chat-input-inner-container">
              <input
                className="chat-input"
                name="message"
                type="message"
                required
                onChange={handleFieldChange}
                id="message"
                placeholder="Chat message"
              />
              <button className="chat-send-button" data-tooltip="SEND">
                <i
                  className="paper plane outline icon"
                  type="submit"
                  disabled={loading}
                ></i>
              </button>
            </div>
          </fieldset>
        </form>
      </div>
    </>
  );
};

export default MessageForm;
