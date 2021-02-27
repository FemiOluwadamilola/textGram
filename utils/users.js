const users = [];

// create users
function userJoin(id,username,room){
  const user = {
    id,
    username,
    room
  };
  users.push(user);

  return user;
}

// get users
function getCurrentUsers(id){
  return users.find(user => user.id === id);
}

// user logout
function userLogOut(id){
  const index = users.findIndex(user => user.id === id);

  if(index !== -1){
    return users.splice(index,1)[0];
  }
}

// get room users
function getAllRoomUsers(room){
  return users.filter(user => user.room === room);
}

module.exports = {userJoin, getCurrentUsers, userLogOut, getAllRoomUsers}