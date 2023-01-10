import React from "react";

function FriendList({ user }) {
  const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER;

  return (
    <li className="siderbarFriend">
      <img src={PUBLIC_FOLDER + user.profilePicture} alt="" className="sidebarFriendImg" />
      <span className="siderbarFriendName">{user.username}</span>
    </li>
  );
}

export default FriendList;
