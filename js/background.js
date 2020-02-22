// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

//This file is used to interact with the chrome APIs from the extension.  The types of APIs
//you can access and how to do it can be found here: https://developer.chrome.com/extensions/api_index
//to access these from an extension, message passing is used between this file and the extension javascript.

//See this documentation for more information on message passing: https://developer.chrome.com/extensions/messaging
//Currently we've add the functionality to retrieve the user's email if they have sync turned on in Chrome, but we're
//console logging it for now.

chrome.extension.onMessage.addListener((request, sender, sendResponse) => {
	chrome.identity.getProfileUserInfo((info) => {
		sendResponse({email: info.email})
	});
    return true //this forces the call to be syncronous
});