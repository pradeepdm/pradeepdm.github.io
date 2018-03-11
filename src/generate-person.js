/*
*  Used to fetch random person data to display it in the chat box.
*  Reference: This file is copied from pubNub Chat Engine tutorial.
* */

var generatePerson = function(online) {

    var myChatUser = JSON.parse(localStorage.getItem("myChatUser"));
    if (myChatUser) {
        return myChatUser;
    }

    var person = {};

    var names = "Benjamin Madison".split(" ");

    var avatars = [
        'https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_01.jpg',
        'https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_02.jpg',
        'https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_03.jpg',
        'https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_04.jpg'
    ];

    person.first = names[Math.floor(Math.random() * names.length)];
    person.last = names[Math.floor(Math.random() * names.length)];
    person.full = [person.first, person.last].join(" ");
    person.uuid = String(new Date().getTime());

    person.avatar = avatars[Math.floor(Math.random() * avatars.length)];

    person.online = online || false;

    person.lastSeen = Math.floor(Math.random() * 60);


    localStorage.setItem('myChatUser', JSON.stringify(person));
    return person;

};