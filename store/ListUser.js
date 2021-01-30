import uniqid from 'uniqid'
import Cookies from 'js-cookie'
const state = () => {
    return {
        getListUsers: {
            url: '/user/list',
            method: 'GET'
        }
    }
}
const actions = {
    getListUsers(vueContext, payload) {
        const response = this.$axios({
            url: vueContext.state.getListUsers.url,
            method: vueContext.state.getListUsers.method,
            headers: {
                Authorization: `Bearer ${Cookies.get('token')}`
            },
            params: {
                channel: "CMS",
                transid: uniqid(),
                ...payload
            }
        })
        return response
    }
}

export default {
    state,
    actions
}