runFunctionInPageContext(function () {
  ga('create', 'UA-154200398-1', 'auto', {'name': 'followingTracker'});
  ga('followingTracker.send', 'pageview'); // note the prefix
});

var numberOfScrolls = DEFAULT_SCROLL_NUMBER

const unfollowAction = (user, whitelist) => {
	const userAlias = $(user).attr('href').split('/')[USER_NAME_HREF_INDEX]
	// first check the users configured whitelist to see if we should unfollow this user or not.
	if (!whitelist.includes(userAlias)) {
		const dataUserId = $(user).attr('data-user-id')
		clickUnfollowButton(dataUserId)
	} else {
		console.log(`not unfollowing ${userAlias} as they're in the unfollow whitelist.`)
	}
}

const clickUnfollowButton = (userDataId) => {
	const constructedSelector = FOLLOW_BUTTON_SELECTOR.format(userDataId)
	const unfollowButton = $(constructedSelector)
	if (unfollowButton.length == 0) {
		console.log(`No unfollow elements found...`)
		fail
	}
	console.log(`clicking unfollowing button ${userDataId}`)
	unfollowButton.get(1).click()
}

const unfollowAllButton = document.createElement("button"); 
unfollowAllButton.innerText="Unfollow All";
unfollowAllButton.className = "button button--chromeless u-baseColor--buttonNormal"

unfollowAllButton.onclick = async () => {
	console.log(`unfollow button clicked, scrolling to bottom of the page...`)
	console.log(numberOfScrolls)
	for (var i = 0; i < numberOfScrolls; i++) {
		await sleep(SLEEP_TIME_IN_MS - 2000);
		window.scrollTo(0, document.body.scrollHeight)
	}
	console.log(`finished scrolling`)
	const users = $(USER_PROFILE_SELECTOR)
	console.log(`unfollowing ${users.length} users`)
	whitelist = await getLocalObj(UNFOLLOW_WHITELIST) || []
    await slowIterate(() => { iterateUsers(users, unfollowAction, whitelist) })
}

var followingCountButton = $(FOLLOWING_COUNT_SELECTOR)
numberOfScrolls = Math.ceil((followingCountButton[0].getAttribute('title').split(/\s+/)[1].replace(/,/g, '') - 18) / 16)
var followerCountButton = $(FOLLOWER_COUNT_SELECTOR)
followerCountButton[0].after(unfollowAllButton)