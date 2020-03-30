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
	const unfollowFromBottomOfList = await getLocalObj(UNFOLLOW_FROM_BOTTOM) || false
	const bottomTopSwitch = unfollowFromBottomOfList ? 'bottom' : 'top'
	console.log(`unfollow button clicked, scrolling to bottom of the page...`)
	appendButterBarMessage(`Scrolling to the bottom of the page with ${numberOfScrolls} scrolls to get the full list of users to unfollow...`)
	console.log(numberOfScrolls)
	for (var i = 0; i < numberOfScrolls; i++) {
		await sleep(SLEEP_TIME_IN_MS - 2000);
		window.scrollTo(0, document.body.scrollHeight)
	}
	console.log(`finished scrolling`)
	const users = unfollowFromBottomOfList ? $(USER_PROFILE_SELECTOR).get().reverse() : $(USER_PROFILE_SELECTOR)
	console.log(`unfollowing ${users.length} users`)
	clearButterBarMessages()
	appendButterBarMessage(`Unfollowing ${users.length} users starting from the ${bottomTopSwitch} of the page.  Scroll to the ${bottomTopSwitch} of the page to view the progress of the unfollowing.`)
	whitelist = await getLocalObj(UNFOLLOW_WHITELIST) || []
    await slowIterate(() => { iterateUsers(users, unfollowAction, whitelist) })
}

var followingCountButton = $(FOLLOWING_COUNT_SELECTOR)
numberOfScrolls = Math.ceil((followingCountButton[0].getAttribute('title').split(/\s+/)[1].replace(/,/g, '') - 18) / 10)
var followerCountButton = $(FOLLOWER_COUNT_SELECTOR)
followerCountButton[0].after(unfollowAllButton)

//we had to add this hack to ensure the page is reloaded when the follower count button is clicked, 
// otherwise the followers.js script doesn't get matched against the URL since chrome doesn't know that a URL change has occurred.
// This is because Medium doesn't actually request the new page when the button is clicked.
followerCountButton.click(() => {
	location.href = 'followers';
});

