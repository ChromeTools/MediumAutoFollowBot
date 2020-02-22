const getEmail = () => {
	chrome.runtime.sendMessage({}, function(response) {
		console.log('user\'s email is...')
		console.log(response.email)
	});
}