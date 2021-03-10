import React,{useState,useEffect,useRef} from "react";
import socketIOClient from "socket.io-client";
import "./ChatRoom.css";

const SOCKET_SERVER_URL = "http://localhost:5000";

const ChatRoom = (props) => {
  const { roomId } = props.match.params;
  const [newMessage, setNewMessage] = React.useState("");
  const [messages, setMessages] = useState([]);
  const socketRef = useRef();

  useEffect(() => {
      socketRef.current = socketIOClient(SOCKET_SERVER_URL, {query: { roomId },});

      socketRef.current.on('message', (message) => {
        const incomingMessage = {
          ...message,
          ownedByCurrentUser: message.senderId === socketRef.current.id,
        };
        setMessages((messages) => [...messages, incomingMessage]);
      });

      return () => {
        socketRef.current.disconnect();
      };
    }, [roomId]);

  const handleNewMessageChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleSendMessage = () => {
    socketRef.current.emit('message', {
      body: newMessage,
      senderId: socketRef.current.id,
    });
    setNewMessage("");
  };

  return (
    <div className="chat-room-container">
      <h1 className="room-name">Room: {roomId}</h1>
      <div className="messages-container">
        <ol className="messages-list">
          {messages.map((message, i) => (
            <li
              key={i}
              className={`message-item ${
                message.ownedByCurrentUser ? "my-message" : "received-message"
              }`}
            >
              {message.body}
            </li>
          ))}
        </ol>
      </div>
      <textarea
        value={newMessage}
        onChange={handleNewMessageChange}
        placeholder="Write message..."
        className="new-message-input-field"
      />
      <button onClick={handleSendMessage} className="send-message-button">Send</button>
    </div>
  );
};

export default ChatRoom;
