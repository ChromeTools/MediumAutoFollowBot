ga('send', 'pageview', '/popup.html');
const submitButton = document.getElementById('whitelistSubmit')
const facebookButton = document.getElementsByClassName('fa-facebook')[0]
const twitterButton = document.getElementsByClassName('fa-twitter')[0]
const emailButton = document.getElementsByClassName('fa-envelope')[0]

document.body.onload = async () => {
  whitelist = await getLocalObj(UNFOLLOW_WHITELIST) || []
  document.getElementById('whitelist').innerText = whitelist
}

submitButton.onclick = async () => {
  let whitelist = document.getElementById('whitelist')
  //split the whitelist by comma and remove unnecessary whitespace
  whitelist = whitelist.value.split(',').map(username => username.trim())
  //remove any whitespace at the beginning or end of the list.
  whitelist = whitelist.filter(username => username != "")
  //check for usernames without '@' at the beginning.
  malformedUsernames = whitelist.filter(username => !username.startsWith('@'))
  if (malformedUsernames.length != 0) {
    ga('popupTracker.send', 'exception', {
      'exDescription': `Malformed usernames ${malformedUsernames}`,
      'exFatal': false
    });
    message = document.getElementById('message')
    message.style.color = "red"
    message.innerText = "All usernames must begin with @."
  } else {
    await setLocalObj(UNFOLLOW_WHITELIST, whitelist)
    message = document.getElementById('message')
    message.innerText = "whitelist successfully submitted and in use."
  }
}

emailButton.onclick = async () => {
  chrome.tabs.update({
        url: "mailto:mediumtooldev@gmail.com"
    });
}

facebookButton.onclick = async () => {
  chrome.tabs.update({
    url: "https://www.facebook.com/medium.tool.3"
  });
}

twitterButton.onclick = async () => {
  chrome.tabs.update({
    url: "https://twitter.com/ToolsChrome"
  });
}
