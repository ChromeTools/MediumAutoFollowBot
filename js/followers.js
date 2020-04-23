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

const followAction = async (userDiv, config) => {
	const user = $(userDiv).find(USER_PROFILE_SELECTOR)
	const followButtonClass = $(userDiv).find(USER_FOLLOW_BUTTON_SELECTOR).attr('class')
	const userAlias = $(user).attr('href').split('/')[USER_NAME_HREF_INDEX]
	const dataUserId = $(user).attr('data-user-id')


	// this was a bug where first time installers would unfollow their previous follows as the bot would click them even if the button
	// already said "Following"
	if (followButtonClass.includes('is-active')){
		console.log('this user has been followed before the installation of the bot, we do not want to unfollow them.')
		return
	}

	//for now we're going to hard code this "requirement" in, if there end up being more "requirements" one idea I had
	//was to pass these requirements in as a list of functions to be iterated through.  If any of them fail then we skip
	//trying to follow the user.  I don't want to prematurely abstract though if it isn't necessary.
	if (config.onlyFollowMediumMembers && !isAMediumMember(user)) {
		console.log('only following medium members, this is not a medium member.')
		showInlineMessage(user, `Only following Medium members and ${userAlias} is not a Medium member.`)
		return
	}

	// see if we've previously followed this user or not.
	if (config.previouslyFollowedList.includes(userAlias)) {
		console.log(`not following user ${userAlias} since we've previously followed them.`)
		showInlineMessage(user, `You've already followed ${userAlias} once before.`)
	// otherwise we can follow this user.
	} else {
		console.log(`attempting to follow user ${userAlias}...`)
		clickFollowButton(dataUserId)
		await sleep(SLEEP_TIME_IN_MS)
		if ($(BUTTER_BAR_MESSAGE_SELECTOR)[0].innerText != FOLLOW_LIMIT_BUTTER_BAR_ERROR_MESSAGE) {
			console.log(`followed user ${userAlias}`)
			console.log(`adding user ${userAlias} to previously followed list.`)
			//add this user to the previously followed user list so we don't follow them twice.
			config.previouslyFollowedList.push(userAlias)
			//mark the date we followed this user in case the lookback unfollow feature is enabled.
			await setLocalObj(userAlias, (new Date()).toJSON())
			await setLocalObj(PREVIOUSLY_FOLLOWED_LIST, config.previouslyFollowedList)
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

const isAMediumMember = (user) => {
	// a medium member has their child element as a div for the green halo, whereas a non-member just has their profile image element (an img element) as the child element
	return $(user).children().is('div')
}

const followAllButton = document.createElement("button"); 
followAllButton.innerText="Follow All";
followAllButton.className = "button button--chromeless u-baseColor--buttonNormal"

followAllButton.onclick = async () => {
	const followFromBottomOfList = await getLocalObj(FOLLOW_FROM_BOTTOM) || false
	const onlyFollowMediumMembers = await getLocalObj(MEDIUM_MEMBERS_ONLY) || false
	const bottomTopSwitch = followFromBottomOfList ? 'bottom' : 'top'
	appendButterBarMessage(`Scrolling to the bottom of the page with ${numberOfScrolls} scrolls to get the full list of users to follow...`)
	console.log(`follow all button clicked, scrolling to bottom of the page with ${numberOfScrolls} scrolls...`)


	//TODO: abstract this so it can be re-used between the two pages.
	console.log(numberOfScrolls)
	for (var i = 0; i < numberOfScrolls; i++) {
		await sleep(SLEEP_TIME_IN_MS - 2000);
		window.scrollTo(0, document.body.scrollHeight)
		clearButterBarMessages()
		appendButterBarMessage(`Scroll ${i + 1} of ${numberOfScrolls}...`)
	}
	clearButterBarMessages()
	appendButterBarMessage(`Finished scrolling...`)
	await sleep(SLEEP_TIME_IN_MS - 2000);


	const users = followFromBottomOfList ? $(USERS_PROFILE_SELECTOR).get().reverse() : $(USERS_PROFILE_SELECTOR)
	console.log(`following ${users.length} users`)
	clearButterBarMessages()
	appendButterBarMessage(`Following ${users.length} users starting from the ${bottomTopSwitch} of the page.  Scroll to the ${bottomTopSwitch} of the page to view the progress of the following.`)
	// // get sync storage for all user's we've previously followed.
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
numberOfScrolls = Math.ceil((followerCountButton[0].getAttribute('title').split(/\s+/)[1].replace(/,/g, '') - 18) / 10)
followerCountButton[0].after(followAllButton)
//we had to add this hack to ensure the page is reloaded when the following count button is clicked, 
// otherwise the following.js script doesn't get matched against the URL since chrome doesn't know that a URL change has actually occurred.
followingCountButton.click(() => {
	location.href = 'following';
});