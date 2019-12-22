const USER_PROFILE_SELECTOR = 'a.link.u-baseColor--link.avatar.u-width60.u-marginRight20.u-flex0'
const FOLLOW_BUTTON_SELECTOR = 'button[data-action-value="{0}"]'
const FOLLOW_BUTTONS_COUNT_SELECTOR = "span:contains('Follow')"
const FOLLOWER_COUNT_SELECTOR = "a.button.button--chromeless.u-baseColor--buttonNormal:contains(' Followers')"
const FOLLOWING_COUNT_SELECTOR = "a.button.button--chromeless.u-baseColor--buttonNormal:contains(' Following')"
const BIO_TEXT_CLASS = 'link link--darken u-accentColor--textDarken u-baseColor--link u-textColorNormal u-block u-fontSize14'
const FOLLOW_LIMIT_ERROR_SELECTOR = '.butterBar-message'
const BIO_TEXT_SELECTOR = 'a.' + BIO_TEXT_CLASS.replace(/\s/g, '.');
const SLEEP_TIME_IN_MS = 4000 //4 seconds for now until we get customer feedback.
const USER_NAME_HREF_INDEX = 3
const DEFAULT_SCROLL_NUMBER = 5
const PREVIOUSLY_FOLLOWED_LIST = 'previouslyFollowedList'
const UNFOLLOW_WHITELIST = 'unfollowWhitelist'
const ANALYTICS_PROPERTY_ID = 'UA-154200398-1'