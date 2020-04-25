runFunctionInPageContext(function () {
  ga('create', 'UA-154200398-1', 'auto', {'name': 'followingTracker'});
  ga('followingTracker.send', 'pageview'); // note the prefix
});

var numberOfScrolls = DEFAULT_SCROLL_NUMBER

const unfollowAllButton = document.createElement("button"); 
unfollowAllButton.innerText="Unfollow All";
unfollowAllButton.className = "button button--chromeless u-baseColor--buttonNormal"

const populateWhitelistButton = document.createElement("button"); 
populateWhitelistButton.innerText="Add All To Whitelist";
populateWhitelistButton.className = "button button--chromeless u-baseColor--buttonNormal"

populateWhitelistButton.onclick = async () => {
	await scroll(numberOfScrolls, 1000) // 1 second between scrolls

	const userAliases = $.map($(USER_PROFILE_SELECTOR), user => {
		return $(user).attr('href').split('/')[USER_NAME_HREF_INDEX]
	})
    
    whitelist = new Set(await getLocalObj(UNFOLLOW_WHITELIST) || [])

	diff = userAliases.filter(alias => !whitelist.has(alias))

	clearButterBarMessages()
	appendButterBarMessage(`Adding ${diff.length} new users to your whitelist.`)

    whitelist = [...whitelist].concat(diff)
    await setLocalObj(UNFOLLOW_WHITELIST, whitelist)
}


unfollowAllButton.onclick = async () => {
	await scroll(numberOfScrolls, 2000) // 2 seconds between scrolls

	const lookbackConfig = { 
		UNFOLLOW_LOOKBACK_PERIOD: await getLocalObj(UNFOLLOW_LOOKBACK_PERIOD) || 0, 
		UNFOLLOW_LOOKBACK_ENABLED: await getLocalObj(UNFOLLOW_LOOKBACK_ENABLED) || false 
	}
	const unfollowFromBottomOfList = await getLocalObj(UNFOLLOW_FROM_BOTTOM) || false
	const bottomTopSwitch = unfollowFromBottomOfList ? 'bottom' : 'top'

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
numberOfScrolls = Math.ceil((followingCountButton[0].getAttribute('title').split(/\s+/)[1].replace(/,/g, '') - 18) / 11)
var followerCountButton = $(FOLLOWER_COUNT_SELECTOR)
followerCountButton[0].after(unfollowAllButton)
//all this just to insert the "populate white list" button after the "unfollow all" button...
unfollowAllButton.parentNode.insertBefore(populateWhitelistButton, unfollowAllButton.nextSibling)

//we had to add this hack to ensure the page is reloaded when the follower count button is clicked, 
// otherwise the followers.js script doesn't get matched against the URL since chrome doesn't know that a URL change has occurred.
// This is because Medium doesn't actually request the new page when the button is clicked.
followerCountButton.click(() => {
	location.href = 'followers';
});
