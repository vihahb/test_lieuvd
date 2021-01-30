<template>
  <div>
    <v-row v-if="checkRole(Rules.System.User.actions.view_list)">
      <v-col cols="12" class="pt-0">
        <v-card class="w-100">
          <client-only>
            <v-data-table
              :headers="headers"
              :items="items"
              :items-per-page="itemsPerPage"
              hide-default-footer
              :loading="$wait.is('loadingUser')"
              loading-text="Xin chờ..."
              sort-by="stt"
              no-results-text="Không có kết quả phù hợp"
              no-data-text="Không có dữ liệu"
              class="elevation-1 custom_header_table"
              :search="search"
              fixed-header
              light
            >
              <template v-slot:top>
                <v-app-bar flat color="white">
                  <v-toolbar-title>Quản lý người dùng</v-toolbar-title>
                  <v-divider class="mx-4" inset vertical></v-divider>
                  <v-text-field v-model="search" label="Tìm kiếm" single-line hide-details></v-text-field>
                  <div class="flex-grow-1"></div>
                  <v-btn
                    color="primary"
                    v-if="checkRole(Rules.System.User.actions.add)"
                    @click="setActionUpdate($event, 0)"
                  >Thêm mới</v-btn>
                </v-app-bar>
              </template>
              <template v-slot:item.stt="{ item }">
                <div class="d-flex align-center justify-center">{{getItemIndex(item)}}</div>
              </template>
              <template v-slot:item.status="{ item }">
                <RenDerStatus :status="item.status"></RenDerStatus>
              </template>
              <template v-slot:item.action="{ item }">
                <div class="d-flex align-center justify-center">
                  <v-tooltip bottom v-if="checkRole(Rules.System.User.actions.edit)">
                    <template v-slot:activator="{ on }">
                      <v-icon
                        class="mr-2"
                        @click="setActionUpdate(item, 1)"
                        v-on="on"
                      >mdi-pencil-box-multiple-outline</v-icon>
                    </template>
                    <span>Cập nhật</span>
                  </v-tooltip>
                  <v-tooltip bottom v-if="checkRole(Rules.System.User.actions.reset_pass)">
                    <template v-slot:activator="{ on }">
                      <v-icon medium @click="setResetUserPass(item)" v-on="on">mdi-account-convert</v-icon>
                    </template>
                    <span>Reset mật khẩu</span>
                  </v-tooltip>
                  <v-tooltip bottom v-if="checkRole(Rules.System.User.actions.delete)">
                    <template v-slot:activator="{ on }">
                      <v-icon medium @click="askForDeleteItem(item)" v-on="on">mdi-delete</v-icon>
                    </template>
                    <span>Xóa</span>
                  </v-tooltip>
                </div>
              </template>
            </v-data-table>
          </client-only>
        </v-card>
      </v-col>

      <pagination
        ref="pagination"
        :pageCount="pageCount"
        :page="page"
        :pageSize="itemsPerPage"
        @changePage="changePage"
        @changePageSize="changePageSize"
        depressed="true"
      ></pagination>
    </v-row>
    <Dialog
      :open="openEditDialog"
      :dialogName="formTitle"
      :CRUD="allowAccess"
      @toggle="toggleEditDialog"
      @actionsUser="updateItem"
      max_width="900px"
    >
      <v-form :key="openEditDialog">
        <v-container>
          <v-row>
            <v-col>
              <v-text-field
                v-if="selectedIndex === -1"
                ref="user_name"
                :value="selectedItem.user_name.value"
                @input="change($event, 'user_name')"
                label="Tên đăng nhập *"
                outlined
                dense
                :error-messages="selectedItem.user_name.invalidMsg"
                :error="selectedItem.user_name.invalid"
                cols="6"
              ></v-text-field>
              <v-text-field
                v-if="selectedIndex === -1"
                ref="password"
                :type="showPassword ? 'text' : 'password'"
                :value="selectedItem.password.value"
                @input="change($event, 'password')"
                label="Mật khẩu *"
                outlined
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword = !showPassword"
                dense
                :error-messages="selectedItem.password.invalidMsg"
                :error="selectedItem.password.invalid"
                cols="6"
              ></v-text-field>
              <v-text-field
                ref="Họ tên"
                :value="selectedItem.full_name.value"
                @input="change($event, 'full_name')"
                :error-messages="selectedItem.full_name.invalidMsg"
                :error="selectedItem.full_name.invalid"
                label="Họ tên *"
                outlined
                dense
              ></v-text-field>
              <v-text-field
                ref="email"
                :value="selectedItem.email.value"
                @input="change($event, 'email')"
                :error-messages="selectedItem.email.invalidMsg"
                :error="selectedItem.email.invalid"
                label="Email *"
                type="email"
                outlined
                dense
              ></v-text-field>
              <v-text-field
                ref="mobile_phone"
                :value="selectedItem.mobile_number.value"
                @input="change($event, 'mobile_number')"
                :error-messages="selectedItem.mobile_number.invalidMsg"
                :error="selectedItem.mobile_number.invalid"
                label="Số điện thoại *"
                outlined
                type="number"
                dense
              ></v-text-field>

              <v-text-field
                ref="address"
                :value="selectedItem.address.value"
                @input="change($event, 'address')"
                :error-messages="selectedItem.address.invalidMsg"
                :error="selectedItem.address.invalid"
                label="Địa chỉ *"
                outlined
                dense
              ></v-text-field>

              <v-data-table
                v-if="selectedIndex !== -1"
                :items="currentIP"
                :headers="headerIP"
                hide-default-footer
                class="custom_header_table elevation-1"
                no-data-text="Không có địa chỉ IP"
              >
                <template v-slot:top>
                  <v-toolbar flat dense>
                    <v-toolbar-title class="body-1">Địa chỉ IP</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn icon v-on="on" @click="setActionForIP($event, 0)">
                          <v-icon color="primary">mdi-plus-circle</v-icon>
                        </v-btn>
                      </template>
                      <span>Thêm IP</span>
                    </v-tooltip>
                  </v-toolbar>
                </template>
                <template v-slot:item.ip_address="{ item }">
                  <div class="d-flex align-center justify-center">{{ item.ip_address }}</div>
                </template>
                <template v-slot:item.action="{ item }">
                  <div class="d-flex align-center justify-center">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-icon medium @click="removeIP(item)" v-on="on">mdi-delete</v-icon>
                      </template>
                      <span>Xóa</span>
                    </v-tooltip>
                  </div>
                </template>
              </v-data-table>
            </v-col>
            <v-col>
              <v-text-field
                ref="home_phone"
                :value="selectedItem.phone_number.value"
                @input="change($event, 'phone_number')"
                :error-messages="selectedItem.phone_number.invalidMsg"
                :error="selectedItem.phone_number.invalid"
                label="Số máy bàn"
                type="number"
                outlined
                dense
              ></v-text-field>
              <v-text-field
                ref="unit"
                :value="selectedItem.unit.value"
                @input="change($event, 'unit')"
                :error-messages="selectedItem.unit.invalidMsg"
                :error="selectedItem.unit.invalid"
                label="Đơn vị phòng ban *"
                outlined
                dense
                light
              ></v-text-field>
              <v-autocomplete
                ref="sex"
                :value="selectedItem.sex.value"
                :items="sexs"
                item-text="text"
                item-value="value"
                label="Giới tính *"
                :error-messages="selectedItem.sex.invalidMsg"
                :error="selectedItem.sex.invalid"
                outlined
                dense
                @input="change($event, 'sex')"
                no-data-text="Chọn giới tính"
                light
              ></v-autocomplete>
              <SingeDatePicker
                :visible="openDateDialog"
                label="Ngày sinh"
                @onCancel="cancelBirthday"
                @onChange="changeBirthday($event)"
                @onSave="change($event, 'birthday')"
                :error_messages="selectedItem.birthday.invalidMsg"
                :error="selectedItem.birthday.invalid"
                :value="birthday"
              ></SingeDatePicker>
              <!-- <v-text-field
									ref="birthday"
									:value="selectedItem.birthday.value"
									@input="change($event, 'address')"
									:error-messages="selectedItem.address.invalidMsg"
									:error="selectedItem.address.invalid"
									label="Ngày sinh"
									outlined
									dense
              ></v-text-field>-->
              <v-select
                @change="change($event, 'list_group')"
                :value="lst_group.value"
                outlined
                dense
                label="Thuộc nhóm *"
                multiple
                small-chips
                deletable-chips
                clearable
                :items="groups"
                item-text="group_name"
                item-value="group_id"
                :error-messages="lst_group.invalidMsg"
                :error="lst_group.invalid"
                return-object
              ></v-select>
              <v-autocomplete
                ref="schedule_id"
                :items="schedules"
                :value="selectedItem.schedule_id.value"
                @input="change($event, 'schedule_id')"
                :error-messages="selectedItem.schedule_id.invalidMsg"
                :error="selectedItem.schedule_id.invalid"
                label="Lịch truy cập *"
                item-text="schedule_name"
                item-value="schedule_id"
                outlined
                clearable
                dense
                no-data-text="Chưa có lịch truy cập"
                light
              ></v-autocomplete>
              <v-switch
                color="info"
                :input-value="selectedItem.status"
                :true-value="1"
                :false-value="0"
                @change="setNewStatus($event)"
              >
                <template #prepend>
                  <v-label>
                    <div style="margin-top: 2px;min-width:75px;">Trạng thái</div>
                  </v-label>
                </template>
              </v-switch>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
      <div class="flex-grow-1"></div>
    </Dialog>
    <!--		detail user-->
    <v-dialog v-model="openDetailDialog" scrollable max-width="900">
      <v-card>
        <v-card-title class="primary" primary-title>
          <div style="color: white">Chi tiết người dùng:</div>
          <div class="flex-grow-1"></div>
          <v-btn icon dark @click="openDetailDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text style="height: 420px">
          <v-row style="font-size: 16px">
            <v-col sm="10" md="10" offset="1">
              <v-row style="border-bottom: 1.2px solid">
                <div class="mt-2 mb-2 ml-2">
                  Tên đăng nhập:
                  <span style="color: #00aced; font-weight: bold">
                    {{
                    detailUser.user_name
                    }}
                  </span>
                </div>
              </v-row>
              <v-row style="border-bottom: 1.2px solid">
                <div class="mt-2 mb-2 ml-2">
                  Họ tên:
                  <span style="color: #00aced; font-weight: bold">
                    {{
                    detailUser.full_name
                    }}
                  </span>
                </div>
              </v-row>
              <v-row style="border-bottom: 1.2px solid">
                <div class="mt-2 mb-2 ml-2">
                  Số máy bàn:
                  <span style="color: #00aced; font-weight: bold">
                    {{
                    detailUser.phone_number
                    }}
                  </span>
                </div>
              </v-row>
              <v-row style="border-bottom: 1.2px solid">
                <div class="mt-2 mb-2 ml-2">
                  Số di động:
                  <span style="color: #00aced; font-weight: bold">
                    {{
                    detailUser.mobile_number
                    }}
                  </span>
                </div>
              </v-row>
              <v-row style="border-bottom: 1.2px solid">
                <div class="mt-2 mb-2 ml-2">
                  Địa chỉ:
                  <span style="color: #00aced; font-weight: bold">
                    {{
                    detailUser.address
                    }}
                  </span>
                </div>
              </v-row>
              <v-row style="border-bottom: 1.2px solid">
                <div class="mt-2 mb-2 ml-2">
                  Địa chỉ IP:
                  <span style="color: #00aced; font-weight: bold">
                    {{
                    addressIpOfUser.join(', ')
                    }}
                  </span>
                </div>
              </v-row>
              <v-row style="border-bottom: 1.2px solid">
                <div class="mt-2 mb-2 ml-2">
                  Email:
                  <span style="color: #00aced; font-weight: bold">
                    {{
                    detailUser.email
                    }}
                  </span>
                </div>
              </v-row>
              <v-row style="border-bottom: 1.2px solid">
                <div class="mt-2 mb-2 ml-2">
                  Đơn vị:
                  <span style="color: #00aced; font-weight: bold">
                    {{
                    detailUser.unit
                    }}
                  </span>
                </div>
              </v-row>
              <v-row style="border-bottom: 1.2px solid">
                <div class="mt-2 mb-2 ml-2">Giới tính:</div>
                <div class="d-flex align-center justify-center pl-1">
                  <v-chip
                    small
                    text-color="white"
                    :color="detailUser.sex === 1 ? 'primary' : 'green'"
                  >{{ detailUser.sex === 1 ? 'Nam' : 'Nữ' }}</v-chip>
                </div>
              </v-row>
              <v-row style="border-bottom: 1.2px solid">
                <div class="mt-2 ml-2">
                  Thuộc nhóm:
                  <span style="color: #00aced; font-weight: bold">
                    {{
                    groupUser.join()
                    }}
                  </span>
                </div>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog :value="openIPDialog" @click:outside="toggleIPDialog" max-width="350px">
      <v-card>
        <v-card-title>Thêm mới IP</v-card-title>
        <v-card-text class="pb-0">
          <v-container fluid>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="Địa chỉ IP"
                  v-model="editIP"
                  dense
                  outlined
                  :error="errorIP"
                  :error-messages="getIPError"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" @click="toggleIPDialog">Đóng</v-btn>
          <v-btn color="primary" @click="saveIP">Lưu</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- <DeleteDialog
				:open="openDeleteDialog"
				@toggle="toggleDeleteDialog"
				:message="deleteMessage"
				@deleteAction="deleteItem"
    />-->
    <yes-no-alert
      :open="openDeleteDialog"
      alertMsg="Bạn có chắc chắn muốn xóa?"
      @toggle="toggleDeleteDialog"
      @OK="deleteItem"
    ></yes-no-alert>

    <yes-no-alert
      :open="openConfirm"
      :alertMsg="confirmMessage"
      @toggle="toggleConfirm"
      @OK="confirmAction"
    ></yes-no-alert>
  </div>
</template>
<script>
import SingeDatePicker from '~/components/SingeDatePicker'
import RenDerStatus from '../../components/Status'
import { mapState } from 'vuex'
import { state } from '../../store/login'
import ULT from '~/plugins/ult'
import Rules from '~/assets/configurations/Rules'
import Dialog from '~/components/Dialog'
// 2 loai item : item tu database va item tu class mac dinh

export default {
  transition: 'slide-x-transition',
  components: {
    SingeDatePicker,
    RenDerStatus,
    Dialog
  },
  head() {
    return {
      title: 'Quản lý người dùng'
    }
  },
  data: () => ({
    Rules,
    headers: [
      {
        text: 'STT',
        sortable: false,
        value: 'stt'
      },
      {
        text: 'Tên đăng nhập',
        sortable: false,
        value: 'user_name'
      },
      { text: 'Họ tên', value: 'full_name' },
      { text: 'Email', value: 'email' },
      { text: 'SĐT', value: 'mobile_number' },
      { text: 'Đơn vị', value: 'unit' },
      { text: 'Trạng thái', value: 'status', align: 'center' },
      { text: 'Chức năng', value: 'action', sortable: false, align: 'center' }
    ],
    headerIP: [
      { text: 'Địa chỉ IP', value: 'ip_address', align: 'left' },
      { text: 'Chức năng', value: 'action', align: 'right' }
    ],
    openIPDialog: false,
    openDateDialog: false,
    currentIP: [],
    deleteIP: [],
    editIP: '',
    errorIP: false,
    idxIP: -1,
    showPassword: false,
    units: ['admin', 'employee'],
    sexs: [
      { value: 0, text: 'Chọn giới tính' },
      { value: 1, text: 'Nam' },
      { value: 2, text: 'Nữ' }
    ],
    openConfirm: false,
    birthday: '',
    updateWhat: '',
    confirmMessage: '',
    openDeleteDialog: false,
    deleteMessage: '',
    openEditDialog: false,
    allowAccess: true,
    search: '',
    startIndex: 1,
    page: 1,
    pageCount: 10,
    itemsPerPage: 50,
    customPage: 1,
    pageSizes: [10, 20, 50, 100, 150, 200, 300],
    openDetailDialog: false,
    rules: {
      required: value => !!value || 'Không được để trống',
      checkIP: value => {
        return this.$isIPAddress(value) || 'Địa chỉ IP sai định dạng.'
      }
    }
  }),

  computed: {
    ...mapState({
      items: state => state.users.items,
      selectedItem: state => state.users.selectedItem,
      selectedIndex: state => state.users.selectedIndex,
      groups: state => state.users.groups,
      detailUser: state => state.users.detailUser,
      addressIpOfUser: state => state.users.addressIpOfUser,
      groupUser: state => state.users.groupUser,
      schedules: state => state.users.schedules
    }),
    isSelectGroup() {
      return true
    },
    formTitle() {
      return this.selectedIndex === -1
        ? 'Thêm mới người dùng'
        : 'Cập nhật người dùng'
    },
    lst_group: {
      set(value) {
        this.$store.dispatch('users/changeComplexStateSeletedValue', {
          field: 'list_group',
          value: value
        })
      },
      get() {
        return this.selectedItem.list_group
      }
    },
    getIPError() {
      return this.errorIP === true
        ? 'Địa chỉ IP không hợp lệ hoặc đã tồn tại.'
        : ''
    }
  },

  watch: {},

  mounted() {
    if (!this.$isServer && this.checkRole(Rules.System.User.actions.view_list))
      this.initialize()
  },

  methods: {
    checkRole(actionId) {
      let isAllowed = this.$isAccessAction(
        this.$store.state.app.roles,
        Rules.System.User.id,
        actionId
      )
      return isAllowed
    },
    getItemIndex(item) {
      return (this.page - 1) * this.itemsPerPage + this.items.indexOf(item) + 1
    },
    changePageSize(value) {
      this.page = 1
      this.itemsPerPage = value
      this.$refs.pagination.reset()
      this.getListItems()
    },
    changePage(value) {
      this.page = value
      this.getListItems()
    },
    getListItems() {
      let pageIndex = this.page
      let pageSize = this.itemsPerPage
      this.$store
        .dispatch('users/getListItems', { pageIndex, pageSize })
        .then(res => {
          this.pageCount = res.total_page
          this.startIndex = res.start_idx
        })
    },
    initialize() {
      this.$wait.start('loadingUser')
      this.$store.dispatch('users/setGroups')
      // this.$store.dispatch('users/getListSchedule')
      this.getListItems()
    },
    //set selected item
    setSelectedItem(item) {
      this.$store.dispatch('users/setSelectedItem', item)
    },
    //lua chon hem moi hay edit
    setActionUpdate(item, action) {
      //set selectedItem la doi tuong moi hay doi tuong co san
      this.errorIP = false

      this.toggleEditDialog()
      this.$store
        .dispatch('users/setActionUpdate', { item, action })
        .then(res => {
          this.deleteIP = []
          this.birthday = this.selectedItem.birthday.value
          this.currentIP = []
          this.selectedItem.ip.value.forEach(p => {
            this.currentIP.push(p)
          })
          //this.currentIP=lst
          //load lai group va lich
        })
      //mo dialog
    },

    //event input change
    change(value, field) {
      this.$store.dispatch('users/changeComplexStateSeletedValue', {
        value,
        field
      })
    },
    changeBirthday(value) {
      this.birthday = value
    },
    changeBirthdayTest(value) {
      console.log(value, 'AAAAA')
      //this.birthday=value
    },
    cancelBirthday() {
      this.birthday = this.selectedItem.birthday.value
    },
    //update event to save add add new
    updateItem() {
      //update ip
      //console.log(this.currentIP,'updateItem');
      this.$store.dispatch('users/changeComplexStateSeletedValue', {
        field: 'ip',
        value: this.currentIP
      })
      //update in there
      this.$store.dispatch('users/saveItem', this.deleteIP).then(res => {
        if (res == 1) {
          this.toggleEditDialog()
        }
      })
      //remove IP
    },

    changeStatus(value, item) {
      //console.log(value)
      this.updateWhat = 'STATUS'
      //this.setSelectedItem(item)
      this.$store
        .dispatch('users/setSelectedItemWithDetailInfor', { item })
        .then(res => {
          this.$store.dispatch('users/changeSimpleStateSeletedValue', {
            field: 'status',
            value: value,
            inItem: true
          })
          this.toggleConfirm()
        })
    },

    // detail user
    setActionDetail(item) {
      this.$store.dispatch('users/setSelectedItemWithDetailInfor', { item })
      this.toggleDetailDialog()
    },

    setNewStatus(value) {
      //console.log(value)
      this.$store.dispatch('users/changeSimpleStateSeletedValue', {
        field: 'status',
        value
      })
    },
    //ask to delete
    askForDeleteItem(item) {
      this.setSelectedItem(item)
      this.deleteMessage =
        'Bạn có muốn xóa người dùng ' + item.user_name + ' này không?'
      this.toggleDeleteDialog()
    },
    deleteItem(item) {
      this.$store.dispatch('users/deleteItem', item)
      //this.toggleDeleteDialog()
    },

    setResetUserPass(item) {
      this.updateWhat = 'RESET'
      this.setSelectedItem(item)
      this.toggleConfirm()
    },

    resetUserPass() {
      this.$store.dispatch('users/resetPass')
    },

    confirmAction() {
      if (this.openConfirm) {
        if (this.updateWhat == 'RESET') {
          this.resetUserPass()
        } else {
          this.$store.dispatch('users/setStatus')
        }
        //this.toggleConfirm()
      }
    },
    toggleConfirm() {
      this.openConfirm = !this.openConfirm
      if (this.openConfirm) {
        if (this.updateWhat == 'RESET')
          this.confirmMessage =
            'Bạn có muốn reset mật khẩu của người dùng này không?'
        else
          this.confirmMessage =
            'Bạn có muốn thay đổi trạng thái của người dùng này không?'
      } else {
        if (this.updateWhat !== 'RESET') {
          //console.log(this.updateWhat)
          this.$store.dispatch('users/undoChangeStatus')
        }

        this.updateWhat = ''
        this.confirmMessage = ''
      }
    },
    setActionForIP(item, action) {
      //console.log(item,'IP');
      if (action === 0) {
        //them moi
        this.editIP = ''
        this.idxIP = -1
      }
      this.toggleIPDialog()
    },
    saveIP() {
      let ip = this.editIP
      if (this.$isIPAddress(ip) === false) {
        this.errorIP = true
        return
      }
      let hasExist = false
      this.currentIP.forEach(p => {
        if (p.ip_address === ip) hasExist = true
      })
      if (hasExist) {
        this.errorIP = true
        return
      }
      if (this.idx == undefined || this.idxIP < 0) {
        let lst = []
        this.currentIP.forEach(p => {
          lst.push({ ip_address: p.ip_address, id: p.id })
        })
        lst.push({ ip_address: ip, id: 0 })
        this.currentIP = lst
      }

      this.$store.dispatch('users/changeComplexStateSeletedValue', {
        field: 'ip',
        value: this.currentIP
      })
      this.toggleIPDialog()
    },
    removeIP(item) {
      let obj = this.currentIP.find(i => i.ip_address === item.ip_address)
      let idx = this.currentIP.indexOf(obj)
      if (idx >= 0) {
        let lst = []
        this.currentIP.forEach(p => {
          if (p.ip_address !== item.ip_address) lst.push(p)
        })
        this.currentIP = lst
        if (item.id > 0)
          //this.$store.dispatch('users/deleteIP', item.id)
          this.deleteIP.push(item.id)
      }
    },

    toggleEditDialog() {
      this.openEditDialog = !this.openEditDialog
      if (!this.openEditDialog) {
        this.$store.dispatch('users/unsetItem')
      }
    },
    toggleDeleteDialog() {
      this.openDeleteDialog = !this.openDeleteDialog
    },
    toggleDetailDialog() {
      this.openDetailDialog = !this.openDetailDialog
    },
    toggleIPDialog() {
      this.openIPDialog = !this.openIPDialog
      if (this.openIPDialog === false) this.errorIP = false
    }
    //-----------toogle dialog---
  }
}
</script>
