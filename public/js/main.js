const chatForm = document.querySelector('#chat-form');
const socket = io();
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const usersOnline = document.getElementById('users');
const {username, room} = Qs.parse(location.search,{
  ignoreQueryPrefix:true
});
const sideDrawer = document.querySelector('.sideDrawer');
const backDrop = document.querySelector('.backDrop');
const menu = document.querySelector('.menu');
const DarkModeSwitch = document.querySelector('.darkModeCkb');
const friends = document.querySelector('#friends');
const videoCall = document.querySelector('#videoCall');
const newRoom = document.querySelector('#newRoom');
const groupCall = document.querySelector('#groupCall');
const settings = document.querySelector('#settings');


// join classRoom
socket.emit('joinClassRoom',{
  username,
  room
});

// messages from server
socket.on('message', message => {
  outputMessage(message);

// scroll down 
chatMessages.scrollTop = chatMessages.scrollHeight;
});

// show all users in room;
socket.on('showAllUsersInRoom', ({room,users}) => {
  outputRoomName(room);
  outputUsers(users);

  // mobile view!
  // friendOnline(users);

});

chatForm.addEventListener('submit', (e) => {
  const msg = e.target.elements.msg.value;

// send message to the server.
 socket.emit('chatMessage', msg);
  
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();

  e.preventDefault();
})


function outputMessage(message){
   const msgBox = document.createElement('div');
   msgBox.classList.add('message');
   msgBox.innerHTML = `
<p class="meta">${message.username} <span> ${message.time}</span></p>
   <p class="text">
     ${message.text}
   </p>
   `;
   chatMessages.appendChild(msgBox);
}

function outputRoomName(room){
  roomName.innerHTML = room;
  document.querySelector('#nameOfRoom').innerHTML = room;
}

function outputUsers(users){
  usersOnline.innerHTML = `
   ${users.map(user => `
     ${user.username}
   `).join('<br/>')}
  `;
}
/*
 this two function below handles both the toggling on and off of the sideDrawer and the dark overlay.
*/
function toggleSideMenu(){
  sideDrawer.style.width = '85%';
  backDrop.style.display = 'block';
  document.querySelector('.switch').style.display = 'inline-block';
  document.querySelector('.brandName').style.display = 'inline';
  document.querySelector('.brand').style.padding = '12px 14px';
  document.querySelector('#nav-container').style.display = 'block';
}

function toggleOffSideMenu(){
  sideDrawer.style.width = '0';
  backDrop.style.display = 'none';
  document.querySelector('.switch').style.display = 'none';
  document.querySelector('.brandName').style.display = 'none';
  document.querySelector('#nav-container').style.display = 'none';
}

/*
 this function handles the dark mode functionality.....
*/

if(DarkModeSwitch){
  toggleDarkMode();

  DarkModeSwitch.addEventListener('DOMcontentLoaded', function(){

  })
}

function resetDarkMode(){
    localStorage.setItem('mode',JSON.stringify('dark-mode'));
}

function toggleDarkMode(){
  let darkmode;

  if(localStorage.getItem('mode') === null){
    resetDarkMode();
  }else{
    darkmode = JSON.parse(localStorage.getItem('mode'));
  }

  if(DarkModeSwitch.checked){
    console.log(darkmode);
    document.querySelector('.chat-main').classList.add(`${darkmode}`);
    sideDrawer.classList.add(`${darkmode}`);
   const nav = document.querySelectorAll('.navigation-item');
   const navItem = Array.from(nav);
   navItem.forEach(function(nvItem){
     nvItem.style.color = '#DFE3EE';
   });
  }else{
    document.querySelector('.chat-main').classList.remove('dark-mode');
    sideDrawer.classList.remove('dark-mode');
    const nav = document.querySelectorAll('.navigation-item');
   const navItem = Array.from(nav);
   navItem.forEach(function(nvItem){
     nvItem.style.color = '#111';
   });
   
  //  resetDarkMode();
  }
};

menu.addEventListener('click',toggleSideMenu);

// sideDrawer.addEventListener('click',toggleOffSideMenu);

backDrop.addEventListener('click',toggleOffSideMenu);

DarkModeSwitch.addEventListener('change',toggleDarkMode);

/*
 this section of the script is where all the state event happens
*/

function State(){
  let currentState = new chatState(this);
  
  this.init = function(){
    this.change(new chatState);
  }

  this.change = function(state){
     currentState = state;
  }
}

// function chatState(state){
//   //chatState function
//  console.log('chat state!!!');
// }

function newRoomState(state){
//newRoomState function
 console.log('new room state!!!');
}

function friendsState(){
//friendsState function
friendOnline(user);
}

function videoCallState(state){
// videoCallState function
console.log('video call state');

}

function groupCallState(state){
//groupCallState function
console.log('group call state!!');
}

function settingsState(state){
//settingsState function
console.log('settings state!!');

}

friends.addEventListener('click',friendsState);
videoCall.addEventListener('click', videoCallState);
groupCall.addEventListener('click',groupCallState);
newRoom.addEventListener('click',newRoomState);
settings.addEventListener('click',settingsState);
