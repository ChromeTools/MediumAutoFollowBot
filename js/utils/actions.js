const MsToDays = (milliseconds) => {
	return Math.floor(milliseconds / (1000 * 60 * 60 * 24))
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


// inefficient, but this should only be done during testing when you've added a user to the previouslyFollowedList
// and not actually followed them.
const removeUsers = async (usernames) => {
	usernames.forEach(async username => {
		var previouslyFollowedList = await getLocalObj(PREVIOUSLY_FOLLOWED_LIST)
		previouslyFollowedList = previouslyFollowedList.filter(followed => followed !== username)
		await setLocalObj(PREVIOUSLY_FOLLOWED_LIST, previouslyFollowedList)
	})
}

