/* start the external action and say hello */
console.log("App is alive");


/** #7 Create global variable */
var currentChannel;

/** #7 We simply initialize it with the channel selected by default - sevencontinents */
currentChannel = sevencontinents;

/** Store my current (sender) location
 */
var currentLocation = {
    latitude: 48.249586,
    longitude: 11.634431,
    what3words: "shelf.jetted.purple"
};

/**
 * Switch channels name in the right app bar
 * @param channelObject
 */
function switchChannel(channelObject) {
    //Log the channel switch
    console.log("Tuning in to channel", channelObject);

    // call abort() only in case of clicking on change channel during create new channel
    if (editingMode == true) {
        abort();
    }

    // #7  Write the new channel to the right app bar using object property
    document.getElementById('channel-name').innerHTML = channelObject.name;

    //#7  change the channel location using object property
    document.getElementById('channel-location').innerHTML = ' by <a href="http://w3w.co/'
        + channelObject.createdBy
        + '" target="_blank"><strong>'
        + channelObject.createdBy
        + '</strong></a>';

    /* #7 remove either class */
    $('#chat h1 i').removeClass('far fas');

    /* #7 set class according to object property */
    $('#chat h1 i').addClass(channelObject.starred ? 'fas' : 'far');


    /* highlight the selected #channel.
       This is inefficient (jQuery has to search all channel list items), but we'll change it later on */
    $('#channels li').removeClass('selected');
    $('#channels li:contains(' + channelObject.name + ')').addClass('selected');

    /* #7 store selected channel in global variable */
    currentChannel = channelObject;
}

/* liking a channel on #click */
function star() {
    // Toggling star
    // #7 replace image with icon
    $('#chat h1 i').toggleClass('fas');
    $('#chat h1 i').toggleClass('far');

    // #7 toggle star also in data model
    currentChannel.starred = !currentChannel.starred;

    // #7 toggle star also in list
    $('#channels li:contains(' + currentChannel.name + ') .fa').removeClass('fas far');
    $('#channels li:contains(' + currentChannel.name + ') .fa').addClass(currentChannel.starred ? 'fas' : 'far');
}

/**
 * Function to select the given tab
 * @param tabId #id of the tab
 */
function selectTab(tabId) {
    $('#tab-bar button').removeClass('selected');
    console.log('Changing to tab', tabId);
    $(tabId).addClass('selected');
}

/**
 * toggle (show/hide) the emojis menu
 */
var emojis = require('emojis-list');
console.log(emojis[0]);
function toggleEmojis() {
    $('#emojis').toggle(); // #toggle
    if ($('#emojis').is(":visible")) {
        document.getElementById('emojis').innerHTML = emojis;
    }
}

/**
 * #8 This #constructor function creates a new chat #message.
 * @param text `String` a message text
 * @constructor
 */
function Message(text) {
    // copy my location
    this.createdBy = currentLocation.what3words;
    this.latitude = currentLocation.latitude;
    this.longitude = currentLocation.longitude;
    // set dates
    this.createdOn = new Date(); //now
    this.expiresOn = new Date(Date.now() + 15 * 60 * 1000); // mins * secs * msecs
    // set text
    this.text = text;
    // own message
    this.own = true;
}

function sendMessage() {
    // #8 Create a new message to send and log it.
    //var message = new Message("Hello chatter");

    // #8 let's now use the real message #input
    var message = new Message($('#message').val());

    if (message.text.length == 0) {
        console.log("New message is empty." + message.text.length);
        return;
    }
    console.log("New message:", message);

    currentChannel.messages.push(message.text);
    currentChannel.messageCount += 1;

    // #8 convenient message append with jQuery:
    $('#messages').append(createMessageElement(message));

    // #8 messages will scroll to a certain point if we apply a certain height, in this case the overall scrollHeight of the messages-div that increases with every message;
    // it would also scroll to the bottom when using a very high number (e.g. 1000000000);
    $('#messages').scrollTop($('#messages').prop('scrollHeight'));

    // #8 clear the message input
    $('#message').val('');
}

/**
 * #8 This function makes an html #element out of message objects' #properties.
 * @param messageObject a chat message object
 * @returns html element
 */
function createMessageElement(messageObject) {
    // #8 message properties
    var expiresIn = Math.round((messageObject.expiresOn - Date.now()) / 1000 / 60);

    // #8 message element
    return '<div class="message'+
        //this dynamically adds the class 'own' (#own) to the #message, based on the
        //ternary operator. We need () in order to not disrupt the return.
        (messageObject.own ? ' own' : '') +
        '">' +
        '<h3><a href="http://w3w.co/' + messageObject.createdBy + '" target="_blank">'+
        '<strong>' + messageObject.createdBy + '</strong></a>' +
        messageObject.createdOn.toLocaleString() +
        '<em>' + expiresIn+ ' min. left</em></h3>' +
        '<p>' + messageObject.text + '</p>' +
        '<button class="accent">+5 min.</button>' +
        '</div>';
}


function listChannels(criterion) {
    // #8 channel onload
    //$('#channels ul').append("<li>New Channel</li>")

    // #8 five new channels
    //$('#channels ul').append(createChannelElement(yummy));
    //$('#channels ul').append(createChannelElement(sevencontinents));
    //$('#channels ul').append(createChannelElement(killerapp));
    //$('#channels ul').append(createChannelElement(firstpersononmars));
    //$('#channels ul').append(createChannelElement(octoberfest));

    //Channels are appended to the channels list with one loop
    if (criterion == "new") {
        channels.sort(compareNew);
    } else if (criterion == "trending") {
        channels.sort(compareTrending);
    } else if (criterion == "favorites") {
        channels.sort(compareFavorites);
    } else {
        console.log('You fucked it up, the criterion is: [' + criterion+ ']');
    }
    $('#channels ul').empty();
    var i;
    for (i = 0; i < channels.length; i++) {
        $('#channels ul').append(createChannelElement(channels[i]));
    }
}

/**
 * #8 This function makes a new jQuery #channel <li> element out of a given object
 * @param channelObject a channel object
 * @returns {HTMLElement}
 */
function createChannelElement(channelObject) {
    /* this HTML is build in jQuery below:
     <li>
     {{ name }}
        <span class="channel-meta">
            <i class="far fa-star"></i>
            <i class="fas fa-chevron-right"></i>
        </span>
     </li>
     */

    // create a channel
    var channel = $('<li>').text(channelObject.name);

    // create and append channel meta
    var meta = $('<span>').addClass('channel-meta').appendTo(channel);

    // The star including star functionality.
    // Since we don't want to append child elements to this element, we don't need to 'wrap' it into a variable as the elements above.
    $('<i>').addClass('fa-star').addClass(channelObject.starred ? 'fas' : 'far').appendTo(meta);

    // #8 channel boxes for some additional meta data
    $('<span>').text(channelObject.expiresIn + ' min').appendTo(meta);
    $('<span>').text(channelObject.messageCount + ' new').appendTo(meta);

    // The chevron
    $('<i>').addClass('fas').addClass('fa-chevron-right').appendTo(meta);

    // return the complete channel
    return channel;
}

// compare base on creation time
function compareNew (channel1, channel2) {
    if (channel1.createdOn < channel2.createdOn) {
        return 1;
    } else {
        return -1;
    }
}
// compare base on number of messages
function compareTrending (channel1, channel2) {
    if (channel1.messageCount < channel2.messageCount) {
        return 1;
    } else {
        return -1;
    }
}
// compare base on starred mode
function compareFavorites (channel1, channel2) {
    if (channel1.starred < channel2.starred) {
        return 1;
    } else {
        return -1;
    }
}

// change the interface to editing mode for adding new channel
var editingMode = false;
function createNewChannel () {
    console.log("createNewChannel");
    editingMode = true;
    document.getElementById('rightAppBar').innerHTML = '<input type="text" placeholder="Enter a #ChannelName" maxlength="60" id="newChannelName"><button class="primary-blue" id="abort" onclick="abort()">X ABORT</button>';
    $('button.sendButton').replaceWith('<button class="accent sendButton" onclick="createChannel()">CREATE</button>');
    //$('#chat h1').html = '<p>hello world!!!</p>';
    //<input type="submit" class="primary-blue" id="abort" value="X ABORT">
}

// create new channel in case of valid fields
function createChannel() {
    console.log("createChannel");

    // check if the message field is empty
    var theMessage = new Message($('#message').val());
    var theChannelName = document.getElementById("newChannelName").value;
    console.log("message="+theMessage.text);
    console.log("theChannelName="+theChannelName);

    // check if any of the fields are empty
    if (theMessage.text.length == 0 || theChannelName.length == 0) {
        console.log("New message ("+theMessage.text.length+") or channel name ("+theChannelName.length+")is empty.");
        abort();
        return;
    }
    // check for spaces in the channel name
    if (theChannelName.indexOf(' ') !== -1) {
        console.log("channel name contain spaces ["+theChannelName+"]");
        abort();
        return;
    }
    // check if channel name start with #
    if (theChannelName.charAt(0) != '#' ) {
        console.log("channel name not start with # ["+theChannelName+"]");
        abort();
        return;
    }

    // creat new channel and add it to the channels array
    var newChaneel = new Channel(theChannelName);
    newChaneel.message.push(theMessage.text);
    channels.push(newChaneel);

    // set the new channel as the current channel
    switchChannel(newChaneel);
    //sendMessage();
    // clear the message input
    $('#message').val('');
}

// exit from editing mode - create new channel 
function abort() {
    console.log("abort");
    editingMode = false;
    document.getElementById('rightAppBar').innerHTML = '<span id="channel-name">' + currentChannel.name + '</span><small id="channel-location"> by <strong>' + currentChannel.createdBy + '</strong></small><i class="' + (currentChannel.starred ?'fas':'far') + ' fa-star" onclick="star()"></i>';
    $('button.sendButton').replaceWith('<button class="accent sendButton" onclick="sendMessage()"><i class="fas fa-arrow-right"></i></button>');
    // clear the message input
    $('#message').val('');

    /*switchChannel(currentChannel);      this line will bring the channle back to life but it not needed, when ever they will fix the issue of the channels it will be fixed*/
}

/**
 * This #constructor function creates a new chat channel.
 * @param text `String` a chaneel name
 * @constructor
 */
function Channel(text) {
    // channel name
    this.name = text;
    // set dates
    this.createdOn = new Date(); //now
    this.createdBy = "cheeses.yard.applies";
    this.starred = true;
    this.expiresIn = 60;
    this.messageCount = 0;
    this.message = [];
}
