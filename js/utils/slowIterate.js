function sleep(ms) { return new Promise((resolve) => setTimeout(resolve, ms)) }

async function slowIterate(func) {
	return new Promise(async resolve => {
		func()
		resolve()
	})
}

const iterateUsers = async (users, func, config) => {
	for (user of users) {
		await sleep(SLEEP_TIME_IN_MS);
		func(user, config)
	}
}


const scroll = async (numberOfScrolls, sleepTime) => {
	appendButterBarMessage(`Scrolling to the bottom of the page with ${numberOfScrolls} scrolls to get the full list of users...`)

	for (var i = 0; i < numberOfScrolls; i++) {
		await sleep(sleepTime);
		window.scrollTo(0, document.body.scrollHeight)
		clearButterBarMessages()
		appendButterBarMessage(`Scroll ${i + 1} of ${numberOfScrolls}...`)
	}
	clearButterBarMessages()
	appendButterBarMessage(`Finished scrolling...`)
	await sleep(sleepTime);
}