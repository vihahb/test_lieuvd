import Cookies from 'js-cookie'
import ULT from '~/plugins/ult'
import APIs from '~/assets/configurations/API_Config'
export const state = () => ({
  ip: '',
  roles: [],
  pageSizes: [10, 20, 50, 100, 150, 200, 300],
  getRoles: false
})

export const mutations = {
  ClientPrivateIP(state, ip) {
    state.ip = ip
  },
  setRole(state, payload) {
    // console.log(payload)
    state.roles = payload
    state.getRoles = true
  }
}

export const actions = {
  async GetRole(vueContext, payload) {
    this.$getRoleByUser(payload).then(response => {
      // console.log(response.data)
      let errorCode = response.data.error.code
      if (errorCode === APIs.responses.OK.code) {
        vueContext.commit('setRole', response.data.data.lsPageInfos)
      } else if (APIs.responses[errorCode] != undefined) {
        this.$showError(this.$router.app, APIs.responses[errorCode].message)
      } else {
        let errorMsg = response.data.error.message
        this.$showError(
          this.$router.app,
          'Đã xảy ra lỗi khi lấy thông tin quyền truy cập. ' + errorMsg
        )
      }
    })
  }
}

export const getters = {}
