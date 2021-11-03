<template>
  <div>
    <v-container fluid>
      <v-card>
        <v-form v-model="valid" ref="form">
          <v-data-table
            :headers="headers"
            :items="books"
            :options.sync="options"
            :server-items-length="totalBooks"
            :footer-props="{
              itemsPerPageOptions: [5, 10, 15],
            }"
            :loading="loading"
            loading-text="Loading... Please wait"
            :single-expand="singleExpand"
            :expanded.sync="expanded"
            show-expand
            item-key="_id"
            disable-sort
            class="elevation-1"
          >
            <template v-slot:[`item.coverPrice`]="{ item }">
              $ {{ item.coverPrice.$numberDecimal }}
            </template>
            <template v-slot:[`item.publishYear`]="{ item }">
              <v-row v-if="item.publishYear">
                <v-col cols="12" class="px-0">
                  {{ new Date(`${item.publishYear}`).toLocaleString() }}
                </v-col>
              </v-row>
            </template>
            <template v-slot:[`item.status`]="{ item }">
              <v-chip v-if="item.status" :color="getColor(item.status)" dark>
                {{ item.status }}
              </v-chip>
              <v-chip v-if="!item.status" :color="getColor(item.status)" dark>
                {{ item.status }}
              </v-chip>
            </template>

            <template v-slot:[`item.Action`]="{ item }">
              <v-row v-if="item.status === 'checkedOut'">
                <v-col cols="12" class="py-1 justify-end">
                  <v-btn
                    depressed
                    class="error"
                    small
                    @click="handleCheckIn(item)"
                  >
                    Check In
                  </v-btn>
                </v-col>
              </v-row>
              <v-row v-if="item.status === 'checkedIn'">
                <v-col cols="12" class="py-1 justify-end">
                  <v-btn
                    color="success"
                    dark
                    small
                    @click="handleCheckOut(item)"
                  >
                    Check Out
                  </v-btn>
                </v-col>
              </v-row>
            </template>

            <template v-slot:expanded-item="{ headers, item }">
              <td :colspan="headers.length">
                <v-row>
                  <v-col cols="12">
                    <v-row>
                      <v-subheader>History Detail</v-subheader>
                    </v-row>
                    <v-row>
                      <v-col class="justify-center" cols="12">
                        <v-simple-table fixed-header dense class="elevation-1">
                          <template v-slot:default>
                            <thead>
                              <tr>
                                <th class="grey lighten-5 grey--text text-left">
                                  Name
                                </th>
                                <th class="grey lighten-5 grey--text text-left">
                                  ID
                                </th>
                                <th class="grey lighten-5 grey--text text-left">
                                  Mobile
                                </th>
                                <th class="grey lighten-5 grey--text text-left">
                                  Checked Out
                                </th>
                                <th class="grey lighten-5 grey--text text-left">
                                  Required Return
                                </th>
                                <th class="grey lighten-5 grey--text text-left">
                                  Actual Return
                                </th>
                                <th class="grey lighten-5 grey--text text-left">
                                  Status
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-for="i in item.history" :key="i._id">
                                <td>{{ i.personName }}</td>
                                <td>
                                  {{ i.personNationalId }}
                                </td>
                                <td>{{ i.personMobileNumber }}</td>
                                <td>
                                  {{
                                    i.checkoutTimeStamp &&
                                    new Date(
                                      `${i.checkoutTimeStamp}`,
                                    ).toLocaleString()
                                  }}
                                </td>
                                <td>
                                  {{
                                    i.requiredReturnTimeStamp &&
                                    new Date(
                                      `${i.requiredReturnTimeStamp}`,
                                    ).toLocaleString()
                                  }}
                                </td>
                                <td>
                                  {{
                                    i.actualReturnTimeStamp &&
                                    new Date(
                                      `${i.actualReturnTimeStamp}`,
                                    ).toLocaleString()
                                  }}
                                </td>
                                <td>{{ i.checkoutStatus }}</td>
                              </tr>
                            </tbody>
                          </template>
                        </v-simple-table>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>

                <v-divider />
              </td>
            </template>
          </v-data-table>
        </v-form>
      </v-card>
    </v-container>

    <v-snackbar
      v-model="snackbar"
      absolute
      centered
      color="blue-grey darken-2"
      elevation="24"
    >
      {{ text }}
      <v-btn color="pink" text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import instance from '../../config/axios/instance';

export default {
  data: () => ({
    bread_crumb_items: [
      {
        text: 'Admin',
      },
      {
        text: 'Books',
      },
    ],

    snackbar: false,
    text: '',
    expanded: [],
    singleExpand: true,
    row_expanded: false,
    expandedLoading: false,
    loading: true,
    options: {},
    form: '',
    valid: '',
    headers: [
      {
        text: 'Title',
        value: 'bookTitle',
        align: 'center',
        sortable: false,
      },
      {
        text: 'ISBN',
        value: 'isbn',
        align: 'center',
      },
      {
        text: 'Published',
        value: 'publishYear',
        align: 'center',
      },
      {
        text: 'Price',
        value: 'coverPrice',
        align: 'center',
      },
      {
        text: 'Status',
        value: 'status',
        align: 'center',
      },
      {
        text: 'Action',
        align: 'center',
        value: 'Action',
        sortable: false,
      },
      {
        text: '',
        value: 'data-table-expand',
      },
    ],
    books: [],
    totalBooks: 0,
  }),
  created() {
    this.headers.map((item) => {
      item['class'] = this.globalBackgroundColor + ' ' + this.globalFontColor;
    });
    this.getBooks();
  },
  watch: {
    options: {
      handler() {
        this.getBooks();
      },
      deep: true,
    },
  },
  methods: {
    getBooks() {
      const { page, itemsPerPage } = this.options;
      console.log(page, 'page');
      console.log(itemsPerPage, 'pageper');
      let url = `/book?page=${page}&perPage=${itemsPerPage}`;

      if (page) {
        instance.get(url).then(
          (res) => {
            console.log(res.data?.body?.books?.docs);
            this.books = res.data?.body?.books?.docs;
            this.totalBooks = res.data?.body?.books?.docs?.length;
            this.loading = false;
          },
          () => {
            this.snackbar = true;
            this.text = 'Error fetching books, please refresh';
          },
        );
      }
    },
    handleCheckOut(item) {
      this.$router.replace({
        name: 'admin.dashboard.books.checkout',
        params: { id: item._id },
      });
    },
    handleCheckIn(item) {
      this.$router.replace({
        name: 'admin.dashboard.books.checkin',
        params: { id: item._id },
      });
    },
    getColor(status) {
      if (status === 'checkedOut' || status === false) return 'red';
      else if (status === 'checkedIn' || status === true) return 'green';
    },
  },
};
</script>
<style scoped lang="scss">
.v-list-item {
  min-height: 1px !important;
}
</style>
