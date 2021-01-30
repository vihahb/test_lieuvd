<template>
  <v-app>
    <client-only>
      <notifications
        group="main"
        :duration="7000"
        position="top right"
        :max="5"
      />
    </client-only>
    <v-navigation-drawer
      v-model="drawer"
      :clipped="clipped"
      fixed
      width="300px"
      app
      light
      style="padding-bottom: 54px"
      class="denser-nav"
    >
      <v-list nav dense expand class="disabled-active">
        <v-list
        dense
        nav
      >
        <v-list-item
          v-for="item in itemsLeft"
          :key="item.title"
          link
          :to="item.path"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app light class="border-bot-mbf">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title class="align-center d-flex">
        <img src="/logo/logo_mbf.png" width="180" />
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon color="primary" size="40">mdi-account-circle</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <nuxt />
      </v-container>
    </v-main>
    <v-navigation-drawer v-model="rightDrawer" :right="right" temporary fixed>
      <template v-slot:prepend>
        <v-list-item two-line>
          <v-list-item-avatar>
            <v-icon color="primary" size="40">mdi-account-circle</v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{ username }}</v-list-item-title>
            <v-list-item-subtitle>Đã đăng nhập</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>

      <v-divider></v-divider>

      <v-list dense nav>
        <v-list-item
          v-for="accountMenuItem in accountMenuItems"
          :key="accountMenuItem.title"
          router
          :to="accountMenuItem.to"
          color="primary"
        >
          <v-list-item-icon>
            <v-icon>{{ accountMenuItem.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ accountMenuItem.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <!-- <v-list-item @click="toggleChangePass" color="primary">
          <v-list-item-icon>
            <v-icon>mdi-lock</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Đổi mật khẩu</v-list-item-title>
          </v-list-item-content>
        </v-list-item>-->

        <v-list-item @click="logout" color="primary">
          <v-list-item-icon>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Đăng xuất</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-app>
</template>

<script>
import '~/assets/table.scss'
// import logoPNG from '@/assets/logo/logo.png'
// import watermark from '~/assets/logo/logo_xam.png'
import Cookies from 'js-cookie'
import ULT from '~/plugins/ult'
import APIs from '~/assets/configurations/API_Config'

export default {
  middleware: 'auth',

  created() {
    // this.$vuetify.theme.dark = false
  },
  mounted() {
    if (!this.$isServer) {
      if (!this.$store.state.app.getRoles) {
        this.$store.dispatch('app/GetRole')
      }
      this.username = Cookies.get('username')
    }
  },
  data() {
    return {
      // logo: logoPNG,
      clipped: true,
      drawer: true,
      fixed: false,
      // watermark,
      itemsLeft: [
          { title: 'Home', icon: 'mdi-view-dashboard', path: '/' },
          { title: 'User', icon: 'mdi-account-details', path: '/list-user' },
          { title: 'Value', icon: 'mdi-cookie', path: '/list-value' },
        ],
      accountMenuItems: [
        // {
        //   icon: 'mdi-account',
        //   title: 'My Account',
        //   to: '/account'
        // }
        // {
        //   icon: 'mdi-logout',
        //   title: 'Logout',
        //   to: '/login'
        // }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'PNE-MBF',
      username: '',
      // data đổi mật khẩu tuan.pham
      openChangePass: false,
      allowAccess: true,
      showPassword: false,
      showNewPassword: false,
      showReNewPassword: false,
      selectedItem: {
        password: {
          value: '',
          invalid: false,
          invalidMsg: ''
        },
        newPass: {
          value: '',
          invalid: false,
          invalidMsg: ''
        },
        reNewPass: {
          value: '',
          invalid: false,
          invalidMsg: ''
        }
      }
    }
  },
  watch: {},

  computed: {
    topmenu() {
      return this.getMenuByParent(0)
    }
  },
  methods: {
    logout() {
      Object.keys(Cookies.get()).forEach(function(cookieName) {
        var neededAttributes = {
          // Here you pass the same attributes that were used when the cookie was created
          // and are required when removing the cookie
        }
        Cookies.remove(cookieName, neededAttributes)
      })
      this.$router.push('/login')
    },
    getMenuByParent(parent_id) {
      if (!this.$isServer) {
        let lstAccessMenu = []
        let pages = this.$store.state.app.roles
        Array.from(pages).forEach(m => {
          if (m.parent_id === parent_id) lstAccessMenu.push(m)
        })
        //console.log(parent_id, pages, lstAccessMenu)
        return lstAccessMenu
        //console.log(parent_id, lstAccessMenu)
      }
    },
    // đổi mật khẩu tuan.pham
    // toggle dialog change pass
    toggleChangePass() {
      this.selectedItem = {
        password: {
          value: '',
          invalid: false,
          invalidMsg: ''
        },
        newPass: {
          value: '',
          invalid: false,
          invalidMsg: ''
        },
        reNewPass: {
          value: '',
          invalid: false,
          invalidMsg: ''
        }
      }
      this.openChangePass = !this.openChangePass
      this.rightDrawer = false
    },
    // hàm validate input
    setInvalid(payload) {
      this.selectedItem[payload.field] = {
        ...this.selectedItem[payload.field],
        invalid: true,
        invalidMsg: payload.message
      }
    },
    // hàm đổi pass
    async changePass() {
      let error = false
      if (this.selectedItem.password.value === '') {
        error = true
        this.setInvalid({
          field: 'password',
          message: 'Không được để trống'
        })
      }
      if (this.selectedItem.newPass.value === '') {
        error = true
        this.setInvalid({
          field: 'newPass',
          message: 'Không được để trống'
        })
      } else if (this.selectedItem.newPass.value.length < 8) {
        error = true
        this.setInvalid({
          field: 'newPass',
          message: 'Không được ít hơn 8 ký tự'
        })
      }
      if (this.selectedItem.reNewPass.value === '') {
        error = true
        this.setInvalid({
          field: 'reNewPass',
          message: 'Không được để trống'
        })
      } else if (
        this.selectedItem.reNewPass.value !== this.selectedItem.newPass.value
      ) {
        error = true
        this.setInvalid({
          field: 'reNewPass',
          message: 'Mật khẩu không khớp'
        })
      }
      if (!error) {
        let data = {
          pass_old: this.selectedItem.password.value,
          pass_new: this.selectedItem.newPass.value
        }
        try {
          let response = await this.$changePassUser(data)
          let errorCode = response.data.error.code
          if (errorCode === APIs.responses.OK.code) {
            this.toggleChangePass()
            this.showSuccess(this.$router.app, 'Thay đổi mật khẩu thành công.')
            return
          } else if (
            APIs.responses.TOKEN_INVALID.code === errorCode ||
            APIs.responses.TOKEN_EXPIRE.code === errorCode
          ) {
            this.$TokenInvalid(uniqid(), response)
            return
          } else {
            this.$showWarnNotify(
              this.$router.app,
              APIs.responses[errorCode].message
            )
          }
        } catch (errors) {
          this.$showErrorNotify(
            this.$router.app,
            errors,
            'Không thể kết nối đến server'
          )
        }
      }
    },
    //event input change
    change(value, field) {
      this.selectedItem[field] = {
        ...this.selectedItem[field],
        value,
        invalid: false,
        invalidMsg: ''
      }
    }
  }
}
</script>

<style lang="scss">
.v-list-item__icon {
  margin-right: 20px !important;
}

.v-application--is-ltr
  .v-list--dense.v-list--nav
  .custom-group.v-list-group--no-action
  > .v-list-group__items
  > div
  > .v-list-item {
  padding-left: 50px !important;
}

.v-application--is-ltr
  .v-list--dense
  .v-list-group--sub-group
  .v-list-group__header {
  padding-left: 6px;
}

// .border-bot-mbf .v-toolbar__content {
//   border-bottom: solid 5px #0063af;
// }

.v-list-item--active {
  background-color: white;
}
</style>
