runFunctionInPageContext(function () {
  ga('create', 'UA-154200398-1', 'auto', {'name': 'followersTracker'});
  ga('followersTracker.send', 'pageview');
});
var numberOfScrolls = DEFAULT_SCROLL_NUMBER //if for some reason the number of scrolls isn't calculated properly.

const followAllButton = document.createElement("button"); 
followAllButton.innerText="Follow All";
followAllButton.className = "button button--chromeless u-baseColor--buttonNormal"

followAllButton.onclick = async () => {
	await scroll(numberOfScrolls, 2000) // 2 seconds between scrolls

	const followFromBottomOfList = await getLocalObj(FOLLOW_FROM_BOTTOM) || false
	const onlyFollowMediumMembers = await getLocalObj(MEDIUM_MEMBERS_ONLY) || false
	const bottomTopSwitch = followFromBottomOfList ? 'bottom' : 'top'

	const users = followFromBottomOfList ? $(USERS_PROFILE_SELECTOR).get().reverse() : $(USERS_PROFILE_SELECTOR)

	clearButterBarMessages()
	appendButterBarMessage(`Following ${users.length} users starting from the ${bottomTopSwitch} of the page.  Scroll to the ${bottomTopSwitch} of the page to view the progress of the following.`)
	// get sync storage for all users we've previously followed.
	var previouslyFollowedList = await getLocalObj(PREVIOUSLY_FOLLOWED_LIST) || []
	console.log(`previously followed ${previouslyFollowedList.length} users`)
	await slowIterate(() => { 
		iterateUsers(users, followAction, {
			'previouslyFollowedList': previouslyFollowedList, 
			'onlyFollowMediumMembers': onlyFollowMediumMembers
		}) 
	})
}

var followerCountButton = $(FOLLOWER_COUNT_SELECTOR)
var followingCountButton = $(FOLLOWING_COUNT_SELECTOR)
numberOfScrolls = Math.ceil((followerCountButton[0].getAttribute('title').split(/\s+/)[1].replace(/,/g, '') - 18) / 11)
followerCountButton[0].after(followAllButton)
//we had to add this hack to ensure the page is reloaded when the following count button is clicked, 
// otherwise the following.js script doesn't get matched against the URL since chrome doesn't know that a URL change has actually occurred.
followingCountButton.click(() => {
	location.href = 'following';
});