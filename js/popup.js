ga('send', 'pageview', '/popup.html');
let submit = document.getElementById('whitelistSubmit')
let contact = document.getElementById('contact')

document.body.onload = async () => {
  whitelist = await getLocalObj(UNFOLLOW_WHITELIST)
  document.getElementById('whitelist').innerText = whitelist
}

submit.onclick = async () => {
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
    errorMessage = document.getElementById('errorMessage')
    errorMessage.style.color = "red"
    errorMessage.innerText = "All usernames must begin with @."
  } else {
    errorMessage = document.getElementById('errorMessage')
    errorMessage.innerText = ""
    await setLocalObj(UNFOLLOW_WHITELIST, whitelist)
  }
}