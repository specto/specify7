"use strict";

import _ from 'underscore';
import * as initialContext from './initialcontext';

    var userInfo = {};
    initialContext.load('user.json', function(data) {
        _.extend(userInfo, data, {
            isReadOnly:  !_(['Manager', 'FullAccess']).contains(data.usertype)
        });
    });

export default userInfo;
