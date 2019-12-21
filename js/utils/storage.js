const getLocalObj = (key) => {
	return new Promise(resolve => {
		chrome.storage.local.get([key], (result) => {
			resolve(result[key])
        });
	})
}

const setLocalObj = (key, val) => {
	return new Promise(resolve => {
		chrome.storage.local.set({ [ key ]: val}, () => {
            resolve();
        });
	})
}

const getSyncObj = (key) => {
	return new Promise(resolve => {
		chrome.storage.sync.get([key], (result) => {
			resolve(result[key])
        });
	})
}

const setSyncObj = (key, val) => {
	return new Promise(resolve => {
		chrome.storage.sync.set({ [ key ]: val}, () => {
            resolve();
        });
	})
}
