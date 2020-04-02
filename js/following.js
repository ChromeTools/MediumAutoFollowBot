runFunctionInPageContext(function () {
  ga('create', 'UA-154200398-1', 'auto', {'name': 'followingTracker'});
  ga('followingTracker.send', 'pageview'); // note the prefix
});

var numberOfScrolls = DEFAULT_SCROLL_NUMBER

const MsToDays = (milliseconds) => {
	return Math.floor(milliseconds / (1000 * 60 * 60 * 24))
}

const unfollowAction = async (user, config) => {
	const userAlias = $(user).attr('href').split('/')[USER_NAME_HREF_INDEX]
	const dataUserId = $(user).attr('data-user-id')
	// first check the users configured whitelist to see if we should unfollow this user or not.
	if (!config.whitelist.includes(userAlias)) {
		//if they're not in the whitelist, check the lookback setting
		if (config.lookbackConfig.UNFOLLOW_LOOKBACK_ENABLED) {
			//if we followed this user before enabling the lookback unfollow feature, 
			//assume it happened far in the past so we default back to the original behavior of the bot.
			const userFollowDateString =  await getLocalObj(userAlias) || '1972'
			const userFollowDate = new Date(userFollowDateString)
			//if there is a follow date in the future we've got real bad problems, so let's not do an abs value here.
			//if it happens I'd prefer the bot break and not inadvertantly unfollow someone it shouldn't.
			const followedDaysAgo = MsToDays(new Date() - userFollowDate)
			if (followedDaysAgo >= config.lookbackConfig.UNFOLLOW_LOOKBACK_PERIOD) {
				clickUnfollowButton(dataUserId, userAlias)
			} else {
				console.log(`not unfollowing ${userAlias} it hasn't been ${config.lookbackConfig.UNFOLLOW_LOOKBACK_PERIOD} days since following them.`)
				showInlineMessage(user, `not unfollowing ${userAlias} it hasn't been more than ${config.lookbackConfig.UNFOLLOW_LOOKBACK_PERIOD} days since following them.`)
			}
		} else { //if lookback isn't enabled, simply unfollow the user.
			clickUnfollowButton(dataUserId, userAlias)
		}
	} else {
		console.log(`not unfollowing ${userAlias} as they're on the unfollow whitelist.`)
		showInlineMessage(user, `not unfollowing ${userAlias} as they're on the unfollow whitelist.`)
	}
}

const clickUnfollowButton = async (userDataId, userAlias) => {
	const constructedSelector = FOLLOW_BUTTON_SELECTOR.format(userDataId)
	const unfollowButton = $(constructedSelector)
	if (unfollowButton.length == 0) {
		console.log(`No unfollow elements found...`)
		fail
	}
	console.log(`clicking unfollowing button ${userDataId}`)
	unfollowButton.get(1).click()
	console.log(`removing ${userAlias} from local storage`)
	await removeLocalObj(userAlias) //conveniently, this doesn't break if the userAlias doesn't exist.
}

const unfollowAllButton = document.createElement("button"); 
unfollowAllButton.innerText="Unfollow All";
unfollowAllButton.className = "button button--chromeless u-baseColor--buttonNormal"

unfollowAllButton.onclick = async () => {
	const lookbackConfig = { 
		UNFOLLOW_LOOKBACK_PERIOD: await getLocalObj(UNFOLLOW_LOOKBACK_PERIOD) || 0, 
		UNFOLLOW_LOOKBACK_ENABLED: await getLocalObj(UNFOLLOW_LOOKBACK_ENABLED) || false 
	}
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
    await slowIterate(() => { 
    	iterateUsers(users, unfollowAction, {
    		'whitelist': whitelist,
    		'lookbackConfig': lookbackConfig
    	}) 
    })
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

