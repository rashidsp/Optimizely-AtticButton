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

function User()
{
    var that = this;
    var dataStorageKey = "currentUser";

    var saveGuestUser = function () {
        function guid() {
              function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                  .toString(16)
                  .substring(1);
              }
              return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
        }

        var guestUser = {
            userId: guid(),
            name: null,
            domain: null
        }
        that.save(guestUser);
        return localStorage.getItem(dataStorageKey);
    };

    this.currentUser = function () {
        var currentUser = localStorage.getItem(dataStorageKey);
        if (currentUser == null) {
            var currentUser = saveGuestUser();
        }
        return JSON.parse(currentUser);
    }
    this.login = function (email) {
        var name = email.split('@')[0]
        var currentUser = {
            userId: email,
            firstName: name.split('.')[0],
            lastName: name.split('.')[1],
            domain: email.split('@')[1]
        }
        that.save(currentUser);
    }

    this.save = function (data) {
        localStorage.setItem(dataStorageKey, JSON.stringify(data));
    };
}

