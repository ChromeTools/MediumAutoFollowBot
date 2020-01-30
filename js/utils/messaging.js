const appendButterBarMessage = (message) => {
	const butterBarErrorSelector = $(BUTTER_BAR_ERROR_SELECTOR)
	const butterBarMessage = document.createElement("div"); 
	butterBarMessage.innerText = message
	butterBarMessage.className = BUTTER_BAR_MESSAGE_CLASSNAME
	butterBarErrorSelector[0].className = butterBarErrorSelector[0].className.concat(BUTTER_BAR_ACTIVATE_STRING)
	butterBarErrorSelector[0].append(butterBarMessage)
}

const clearButterBarMessages = () => {
	const butterBarErrorSelector = $(BUTTER_BAR_ERROR_SELECTOR)
	const butterBarMessageSelector = $(BUTTER_BAR_MESSAGE_SELECTOR)
	butterBarErrorSelector[0].className = butterBarErrorSelector[0].className.replace(BUTTER_BAR_ACTIVATE_STRING, '')
	butterBarMessageSelector.remove()
}