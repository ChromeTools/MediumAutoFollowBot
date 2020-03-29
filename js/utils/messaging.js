// note that this is append, meaning multiple messages can be added here.
const appendButterBarMessage = (message) => {
	const butterBarErrorSelector = $(BUTTER_BAR_ERROR_SELECTOR)
	const butterBarMessage = document.createElement("div"); 
	butterBarMessage.innerText = message
	butterBarMessage.className = BUTTER_BAR_MESSAGE_CLASSNAME
	// to show a message, first turn add 'is-active' to the '.butterBar--error' div class.
	butterBarErrorSelector[0].className = butterBarErrorSelector[0].className.concat(BUTTER_BAR_ACTIVATE_STRING)
	// then insert the newly created 'butterBar-message' div inside the '.butterBar--error' div.
	butterBarErrorSelector[0].append(butterBarMessage)
}

// this function clears all appended messages.
const clearButterBarMessages = () => {
	const butterBarErrorSelector = $(BUTTER_BAR_ERROR_SELECTOR)
	const butterBarMessageSelector = $(BUTTER_BAR_MESSAGE_SELECTOR)
	butterBarErrorSelector[0].className = butterBarErrorSelector[0].className.replace(BUTTER_BAR_ACTIVATE_STRING, '')
	butterBarMessageSelector.remove()
}

const showInlineMessage = (user, message) => {
	const messageParagraph = document.createElement("p")
	messageParagraph.innerText = message
	messageParagraph.className = BIO_TEXT_CLASS
	$(user).closest('div').after(messageParagraph)
}