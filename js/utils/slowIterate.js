function sleep(ms) { return new Promise((resolve) => setTimeout(resolve, ms)) }

async function slowIterate(func) {
	return new Promise(async resolve => {
		func()
		resolve()
	})
}

const iterateUsers = async (users, func, filter) => {
	for (user of users) {
		await sleep(SLEEP_TIME_IN_MS);
		func(user, filter)
	}
}