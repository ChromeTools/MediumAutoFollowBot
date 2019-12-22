// inefficient, but this should only be done during testing when you've added a user to the previouslyFollowedList
// and not actually followed them.
const removeUsers = async (usernames) => {
	usernames.forEach(async username => {
		var previouslyFollowedList = await getLocalObj(PREVIOUSLY_FOLLOWED_LIST)
		previouslyFollowedList = previouslyFollowedList.filter(followed => followed !== username)
		await setLocalObj(PREVIOUSLY_FOLLOWED_LIST, previouslyFollowedList)
	})
}

runFunctionInPageContext(function () {
  ga('create', 'UA-154200398-1', 'auto', {'name': 'followersTracker'});
  ga('followersTracker.send', 'pageview');
});
var numberOfScrolls = DEFAULT_SCROLL_NUMBER //if for some reason the number of scrolls isn't calculated properly.

const followAction = async (user, previouslyFollowedList) => {
	const userAlias = $(user).attr('href').split('/')[USER_NAME_HREF_INDEX]
	const dataUserId = $(user).attr('data-user-id')
	// see if we've previously followed this user or not.
	if (previouslyFollowedList.includes(userAlias)) {
		console.log(`not following user ${userAlias} since we've previously followed them.`)
		const alreadyFollowedParagraph = document.createElement("p"); 
		alreadyFollowedParagraph.innerText = `You've already followed ${userAlias} once before.`;
		alreadyFollowedParagraph.className = BIO_TEXT_CLASS
		$(user).closest('div').find(BIO_TEXT_SELECTOR).after(alreadyFollowedParagraph)
	// otherwise we can follow this user.
	} else {
		console.log(`attempting to follow user ${userAlias}...`)
		clickFollowButton(dataUserId)
		await sleep(SLEEP_TIME_IN_MS)
		if ($(FOLLOW_LIMIT_ERROR_SELECTOR).length == 0) {
			console.log(`followed user ${userAlias}`)
			console.log(`adding user ${userAlias} to previously followed list.`)
			//add this user to the previously followed user list so we don't follow them twice.
			previouslyFollowedList.push(userAlias)
			await setLocalObj(PREVIOUSLY_FOLLOWED_LIST, previouslyFollowedList)
		} else {
			runFunctionInPageContext(function () {
				ga('create', 'UA-154200398-1', 'auto', {'name': 'followersTracker'});
				ga('followersTracker.send', 'exception', {
					'exDescription': 'Too many follows in one day',
					'exFatal': false
				});
			});
			console.log(`Followed too many people today.`)
		}
	}
}

const clickFollowButton = (userDataId) => {
	const constructedSelector = FOLLOW_BUTTON_SELECTOR.format(userDataId)
	const followButton = $(constructedSelector)
	if (followButton.length == 0) {
		console.log(`Cannot follow yourself...`)
		return
	}
	console.log(`clicking follow button ${userDataId}`)
	followButton.get(1).click()
}

const followAllButton = document.createElement("button"); 
followAllButton.innerText="Follow All";
followAllButton.className = "button button--chromeless u-baseColor--buttonNormal"

followAllButton.onclick = async () => {
	console.log(`follow all button clicked, scrolling to bottom of the page with ${numberOfScrolls} scrolls...`)
	for (var i = 0; i < numberOfScrolls; i++) {
		await sleep(SLEEP_TIME_IN_MS - 2000);
		window.scrollTo(0, document.body.scrollHeight)
	}
	await sleep(SLEEP_TIME_IN_MS - 2000);
	console.log(`finished scrolling`)
	const users = $(USER_PROFILE_SELECTOR)
	console.log(`following ${users.length} users`)
	// get sync storage for all user's we've previously followed.
	var previouslyFollowedList = await getLocalObj(PREVIOUSLY_FOLLOWED_LIST) || []
	console.log(`previously followed ${previouslyFollowedList.length} users`)
	await slowIterate(() => { iterateUsers(users, followAction, previouslyFollowedList) })
}

var followerCountButton = $(FOLLOWER_COUNT_SELECTOR)
numberOfScrolls = Math.ceil((followerCountButton[0].getAttribute('title').split(/\s+/)[1].replace(/,/g, '') - 18) / 16)
followerCountButton[0].after(followAllButton)