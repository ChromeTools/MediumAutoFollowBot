// jquery related constants
const USER_PROFILE_SELECTOR = 'a.link.u-baseColor--link.avatar.u-width60.u-marginRight20.u-flex0'
const USERS_PROFILE_SELECTOR = 'div.streamItem--userPreview'
const USER_FOLLOW_BUTTON_SELECTOR = 'button.js-followButton'
const FOLLOW_BUTTON_SELECTOR = 'button[data-action-value="{0}"]'
const FOLLOW_BUTTONS_COUNT_SELECTOR = "span:contains('Follow')"
const FOLLOWER_COUNT_SELECTOR = "a.button.button--chromeless.u-baseColor--buttonNormal:contains(' Follower')"
const FOLLOWING_COUNT_SELECTOR = "a.button.button--chromeless.u-baseColor--buttonNormal:contains(' Following')"
const BIO_TEXT_CLASS = 'link link--darken u-accentColor--textDarken u-baseColor--link u-textColorNormal u-block u-fontSize14'
const BUTTER_BAR_MESSAGE_SELECTOR = '.butterBar-message'
const BUTTER_BAR_MESSAGE_CLASSNAME = 'butterBar-message'
const BUTTER_BAR_ERROR_SELECTOR = '.butterBar--error'
const BUTTER_BAR_ACTIVATE_STRING = ' is-active'
const FOLLOW_LIMIT_BUTTER_BAR_ERROR_MESSAGE = 'You’ve reached your daily follow limit.'

const SLEEP_TIME_IN_MS = 4000 //4 seconds for now until we get customer feedback.
const USER_NAME_HREF_INDEX = 3
const DEFAULT_SCROLL_NUMBER = 5

// constants related to chrome storage.
const PREVIOUSLY_FOLLOWED_LIST = 'previouslyFollowedList'
const UNFOLLOW_WHITELIST = 'unfollowWhitelist'
const MEDIUM_MEMBERS_ONLY = 'mediumMembersOnly'
const FOLLOW_FROM_BOTTOM = 'followFromBottom'
const UNFOLLOW_FROM_BOTTOM = 'unfollowFromBottom'
const UNFOLLOW_LOOKBACK_ENABLED = 'unfollowLookbackEnabled'
const UNFOLLOW_LOOKBACK_PERIOD = 'unfollowLookbackPeriod'
const ALIAS_TO_FOLLOW_DATE = 'aliasToFollowDate'

// analytics constants
const ANALYTICS_PROPERTY_ID = 'UA-154200398-1'