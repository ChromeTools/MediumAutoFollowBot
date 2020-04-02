ga('send', 'pageview', '/popup.html');
const submitButton = document.getElementById('whitelistSubmit')
const mediumMembersCheckBox = document.getElementById('mediumMembersOnly')
const followFromBottomCheckBox = document.getElementById('followFromBottom')
const unFollowFromBottomCheckBox = document.getElementById('unFollowFromBottom')
const unFollowLookbackEnabledCheckBox = document.getElementById('unFollowLookbackEnabled')
const unFollowLookbackPeriodInputBox = document.getElementById('unFollowLookbackPeriod')
const facebookButton = document.getElementsByClassName('fa-facebook')[0]
const twitterButton = document.getElementsByClassName('fa-twitter')[0]
const emailButton = document.getElementsByClassName('fa-envelope')[0]

document.body.onload = async () => {
  whitelist = await getLocalObj(UNFOLLOW_WHITELIST) || []
  mediumMembersOnly = await getLocalObj(MEDIUM_MEMBERS_ONLY) || false
  followFromBottom = await getLocalObj(FOLLOW_FROM_BOTTOM) || false
  unfollowFromBottom = await getLocalObj(UNFOLLOW_FROM_BOTTOM) || false
  unFollowLookbackEnabled = await getLocalObj(UNFOLLOW_LOOKBACK_ENABLED) || false
  unfollowLookbackPeriod = await getLocalObj(UNFOLLOW_LOOKBACK_PERIOD) || 1
  document.getElementById('whitelist').innerText = whitelist
  document.getElementById('mediumMembersOnly').checked = mediumMembersOnly
  document.getElementById('followFromBottom').checked = followFromBottom
  document.getElementById('unFollowFromBottom').checked = unfollowFromBottom
  document.getElementById('unFollowLookbackEnabled').checked = unFollowLookbackEnabled
  document.getElementById('unFollowLookbackPeriod').value = unfollowLookbackPeriod //if this is undefined it just shows as an empty string
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
    showMessage("All usernames must begin with @.", true)
  } else {
    await setLocalObj(UNFOLLOW_WHITELIST, whitelist)
    showMessage("whitelist successfully submitted and in use.", false)
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


unFollowFromBottomCheckBox.onclick = async () => {
  const currentBoxValue = unFollowFromBottomCheckBox.checked
  await setLocalObj(UNFOLLOW_FROM_BOTTOM, currentBoxValue)
  unFollowFromBottomCheckBox.checked = currentBoxValue ? true : false
}


unFollowLookbackEnabledCheckBox.onclick = async () => {
  const currentBoxValue = unFollowLookbackEnabledCheckBox.checked
  await setLocalObj(UNFOLLOW_LOOKBACK_ENABLED, currentBoxValue)
  unFollowLookbackEnabledCheckBox.checked = currentBoxValue ? true : false
}


unFollowLookbackPeriodInputBox.addEventListener('input', async () => {
  const unFollowLookbackPeriod = unFollowLookbackPeriodInputBox.value
  if (validateDayValue(unFollowLookbackPeriod)) {
    clearMessage()
    await setLocalObj(UNFOLLOW_LOOKBACK_PERIOD, unFollowLookbackPeriod)
  }
})

const validateDayValue = (unFollowLookbackPeriod) => {
  if (unFollowLookbackPeriod > 365) {
    showMessage('Please enter a day range less than 365 days.', true)
    return false
  }
  if (isNaN(unFollowLookbackPeriod)) {
    showMessage('Please enter a number for the day range.', true)
    return false    
  }
  if (+unFollowLookbackPeriod <= 0) { //neat little js hack to convert a string to number lol...
    showMessage('Please enter a positive day range.', true)
    return false    
  }
  return true
}

const showMessage = (messageText, isWarning) => {
    const message = document.getElementById('message')
    message.innerText = messageText
    message.style.color = isWarning ? 'red' : ''
}

const clearMessage = () => {
    const message = document.getElementById('message')
    message.innerText = ''
    message.style.color = ''
}

