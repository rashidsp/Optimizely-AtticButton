// Copyright 2018, Optimizely
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
// http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

function communicationLayer()
{
    var that = this;
    this.urlPrefix = '';
    this.requests = {
        activate: { type: 'POST', url: '/activate' },
        track: { type: 'POST', url: '/track' },
        checkout: { type: 'POST', url: '/checkout' },
        messagesList: { type: 'GET', url: '/messages' },
        clearMessages: { type: 'DELETE', url: '/messages' }
    };
    this.sendRequest = function (requestName, requestData, successCallback, errorCallback) {
        var request = that.requests[requestName];
        var requestUrl = that.urlPrefix + request.url;
        var user = new User
        var user = user.currentUser();
        $.ajax({
            type: request.type,
            url: requestUrl,
            headers: {
                userId: user.userId
            },
            data: requestData,
            dataType: "json",
            success: successCallback,
            error: errorCallback
        });
    }
};

