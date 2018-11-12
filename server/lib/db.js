const {mongoose, userModel} = require('../lib/dbinit')

module.exports = {
    async saveUserData (data) {

        let saved = await this.searchUserData(data)
        if (saved) {
            console.log('this data has saved.'.magenta)
            return
        }
        
        let content = {
            openid: data.openid || 'no-openid',
            access_token: data.access_token || 'no-accessToken',
            refresh_token: data.refresh_token || 'no-refreshToken',
            scope: data.scope || 'no-scope'
        }
        console.log('will save this data:\n'.magenta, JSON.stringify(content, null, 4).grey)

        let userInsert = new userModel(content)
        userInsert.save((err) => {
            if (err) {
              console.log(`save user data error: ${err}`.red)
            }else {
              console.log('save user data success...'.magenta)
            }
            // mongoose.close()
        })
    },

    searchUserData (data) {
        // search condition
        var condit = {openid: data.openid}

        return new Promise((resolve, reject) => {
            userModel.findOne(condit, (err, data) => {
                if (err) {
                    console.log(`search user data err: ${err}`.red)
                    reject(err)
                } else {
                    console.log('search data success:\n'.magenta, `${data}`.grey)
                    resolve(data)
                }
                // db.close()
            })
        })
    },

    modifyUserData (data) {
        let condit = {openid: data.openid}

        // change the data
        let content = {
            name: data.name || 'changed name'
        }
        let userInsert = new userModel(content)
        userInsert.update(condit, content, err => {
            if (err) {
                console.log(`modify user data err: ${err}`.red)
            } else {
                console.log('modify user data success'.magenta)
            }
            db.close()
        })
    },

    deleteUserData (data) {
        let condit = {openid: data.openid}
        let userInsert = new userModel(condit)
        userInsert.update(condit, err => {
            if (err) {
                console.log(`delete user data err: ${err}`.red)
            } else {
                console.log('delete user data success'.magenta)
            }
        })
    }
}