<template>
  <div>
    <v-card>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="itemsDanhSach"
          :items-per-page="pageSize"
          hide-default-footer
          :loading="this.$wait.is('loading')"
          loading-text="Xin chờ..."
          no-results-text="Không có kết quả phù hợp"
          no-data-text="Không có dữ liệu"
          class="custom_header_table elevation-07"
          fixed-header
          :page.sync="page"
          mobile-breakpoint="0"
          @page-count="pageCount = $event"
          light
        >
          <template v-slot:top>
            <v-app-bar flat color="white">
              <v-toolbar-title>Danh sách người dùng</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn depressed color="primary" @click="openDialog =true" class="text-none"
                >Tìm kiếm</v-btn
              >
            </v-app-bar>
          </template>
          <template v-slot:item="data">
            <tr>
              <!-- cái chỗ td này sẽ tưng ứng với số header khai báo dưới computed, bao nhiêu OBJ thì từng đó  <td></td> -->
              <td class="text-center" style="font-size: 14px !important">
                {{ data.index + 1 }}
              </td>
              <td class="text-center" style="font-size: 14px !important">
                {{data.item.user_name}}
              </td>
              <td class="text-center" style="font-size: 14px !important">
                {{data.item.password}}
              </td>
              <td class="text-center px-0">
                {{data.item.full_name}}
              </td>
              <td class="text-center">
                <v-chip outlined small color="success" v-if="data.item.status ==1">active</v-chip>
                <v-chip outlined small color="warning" v-else>inactive</v-chip>
              </td>
            
              <td class="text-center" style="font-size: 14px !important">
                <div
                  v-if="data.item.prizes !== null"
                  class="d-flex justify-center"
                >
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        v-ripple
                        color="primary"
                        depressed
                        v-on="on"
                        class="text-none mx-1"
                        small
                      >
                        Cập nhật
                      </v-btn>
                    </template>
                    <span>Cập nhật</span>
                  </v-tooltip>

                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        v-ripple
                        color="primary"
                        depressed
                        v-on="on"
                        class="text-none"
                        small
                      >
                        Xóa
                      </v-btn>
                    </template>
                    <span> Thêm kết quả</span>
                  </v-tooltip>
                </div>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card-text>
      <pagination
        class="mt-1"
        ref="dskqPagination"
        :pageCount="pageCount"
        :page="page"
        :pageSize="pageSize"
        @changePage="changePage"
        @changePageSize="changePageSize"
        depressed="true"
      ></pagination>
    </v-card>
    <dialog :open="openDialog"></dialog>
  </div>
</template>

<script>
import moment from 'moment'
import dialog from '~/components/aa/dialog.vue'
export default {
  components: {
    dialog
  },
  computed: {
    headers() {
      return [
        //   cái text sẽ là tên header của cột, sortable là cái chặn cho không sort được,width là min width của từng cột(cái witdh này nó sẽ tự ăn theo các cột khác nữa nên chỉnh cẩn thận)
        {
          text: 'STT',
          sortable: false,
          width: 40,
        },
        {
          text: 'User',
          sortable: false,
          width: 150,
        },
        {
          text: 'Pasword',
          sortable: false,
          width: 100,
        },
        {
          text: 'Full Name',
          sortable: false,
          width: 60,
        },
        {
          text: 'Created time',
          sortable: false,
          width: 100,
        },

        {
          text: 'Chức năng',
          sortable: false,
          width: 100,
        },
      ]
    },
  },
  //   cái data này dùng để khai báo cáo state để lưu dữ liệu nhé
  data() {
    return {
      openDialog:false,
      // cái mảng này dùng để chứa dữ liệu api trả về
      itemsDanhSach: [],
      //   cái aa này bỏ anh nhé, em chỉ để đây để chứa đống string kia thôi
      // aa: `{{data.item.tên field}}`,
    }
  },
  mounted() {
    this.fetchUser()
    //   chỗ này viết tên hàm gọi API hoặc các hàm, state cần khởi tạo đầu tiên khi vào web
  },

  methods: {
    fetchUser(){
      this.$store.dispatch('ListUser/getListUsers',).then(value=>{
        if(value.data.error.code == 0){
            this.itemsDanhSach=value.data.data
        } 
      }).catch(e=>{
        this.$showErrorNotify(this, "e")
        console.log(e);
      })
    },
    //   Chỗ này dùng để viết các functions
    // 3 hàm dư

    // 2 hàm dưới đây để gọi lại list danh sách item khi phân trang nhe, bổ sung cho em 1 hàm gọi list ở cuối mỗi hàm ví dụ :this.GoiAPI()
    changePageSize(pageSizes) {
      if (pageSizes !== this.pageSize) {
        this.pageSize = pageSizes
        this.page = 1
        this.$refs.dskqPagination.reset()
        //  sẽ viết ở đây: this.GoiAPI()
      }
    },
    changePage(value) {
      this.page = value
      //  sẽ viết ở đây: this.GoiAPI()
    },
  },
}
</script>
<style lang="scss">
.StyleImage {
  width: 52px;
  height: 61px;
  display: inline-block;
  text-align: center;
  color: #000;
  font-size: 22px;
  font-weight: bold;
  line-height: 54px;
  margin-left: 1px;
  margin-right: 1px;
}

.v-data-table--fixed-header .v-data-table__wrapper {
  max-height: calc(100vh - 285px);
}
</style>