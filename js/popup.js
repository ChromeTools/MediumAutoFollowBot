ga('send', 'pageview', '/popup.html');
const submitButton = document.getElementById('whitelistSubmit')
const mediumMembersCheckBox = document.getElementById('mediumMembersOnly')
const followFromBottomCheckBox = document.getElementById('followFromBottom')
const facebookButton = document.getElementsByClassName('fa-facebook')[0]
const twitterButton = document.getElementsByClassName('fa-twitter')[0]
const emailButton = document.getElementsByClassName('fa-envelope')[0]

document.body.onload = async () => {
  whitelist = await getLocalObj(UNFOLLOW_WHITELIST) || []
  mediumMembersOnly = await getLocalObj(MEDIUM_MEMBERS_ONLY) || false
  followFromBottom = await getLocalObj(FOLLOW_FROM_BOTTOM) || false
  document.getElementById('whitelist').innerText = whitelist
  document.getElementById('mediumMembersOnly').checked = mediumMembersOnly
  document.getElementById('followFromBottom').checked = followFromBottom
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

emailButton.onclick = () => {
  chrome.tabs.update({
        url: "mailto:mediumtooldev@gmail.com"
    });
}

facebookButton.onclick = () => {
  chrome.tabs.update({
    url: "https://www.facebook.com/chrome.tools.3"
  });
}

twitterButton.onclick = () => {
  chrome.tabs.update({
    url: "https://twitter.com/ToolsChrome"
  });
}

mediumMembersCheckBox.onclick = async () => {
  const currentBoxValue = mediumMembersCheckBox.checked
  await setLocalObj(MEDIUM_MEMBERS_ONLY, currentBoxValue)
  mediumMembersCheckBox.checked = currentBoxValue ? true : false
}


followFromBottomCheckBox.onclick = async () => {
  const currentBoxValue = followFromBottomCheckBox.checked
  await setLocalObj(FOLLOW_FROM_BOTTOM, currentBoxValue)
  followFromBottomCheckBox.checked = currentBoxValue ? true : false
}

