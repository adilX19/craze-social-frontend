<script setup lang="ts">

import {computed, ref, onMounted, watch} from 'vue'
import { useApi } from '/@src/composable/useApi'
import InfluencersService from "/@src/services/InfluencersService";
import SecurityService from "/@src/services/SecurityService";
import type { VAvatarProps } from "/@src/components/base/avatar/VAvatar.vue";
import {useUserSession} from "/@src/stores/userSession";
import {useI18n} from "vue-i18n";
import {useStorage} from "@vueuse/core";
import { useRoute } from 'vue-router';
import { useDarkmode } from "/@src/stores/darkmode";

import type {
  VFlexTableWrapperSortFunction,
  VFlexTableWrapperFilterFunction,
} from '/@src/components/base/table/VFlexTableWrapper.vue'

const darkmode = useDarkmode();
const route = useRoute()
const datasets = ref<DataSet>()
const isLoading = ref(false);
const isDataLoading = ref(false);
const isDataUpdating = ref(true);
const followerLength = ref(0);
const dataLastUpdated = ref('');

const moreDetailsModalOpen = ref(false);
const trackedListModalOpen = ref(false);

const followers_table = ref([]);
const tracked_followers_table = ref([]);

const tiktok_followers_table = ref([]);
const tiktok_tracked_followers_table = ref([]);

// contact modal temp variables
const userPhone = ref('');
const userEmail = ref('');
const userWebLink = ref('');

const isDataLoaded = ref(false);
const isTiktokDataLoaded = ref(false);

type TabId = 'results' | 'tracked influencers'
const activeTab = ref<TabId>('tracked influencers')

type FlowTabId = 'Instagram' | 'Tiktok'
const activeFlowTab = ref<FlowTabId>('Instagram')

type TableItem = object

const followersSorter: VFlexTableWrapperSortFunction<TableItem> = ({ order, a, b }) => {
  if (order === 'asc') {
    if (a.followers > b.followers)
      return 1
    return -1
  } 
  else if (order === 'desc') {
    if (b.followers > a.followers)
      return 1
    return -1
  }
  return 0
}

const followingsSorter: VFlexTableWrapperSortFunction<TableItem> = ({ order, a, b }) => {
  if (order === 'asc') {
    if (a.following > b.following)
      return 1
    return -1
  } 
  else if (order === 'desc') {
    if (b.following > a.following)
      return 1
    return -1
  }
  return 0
}

const postsSorter: VFlexTableWrapperSortFunction<TableItem> = ({ order, a, b }) => {
  if (order === 'asc') {
    if (a.posts > b.posts)
      return 1
    return -1
  } 
  else if (order === 'desc') {
    if (b.posts > a.posts)
      return 1
    return -1
  }
  return 0
}

var regions = ref([])
var categories = ref([])

const influencerRegion = ref('');
const influencerCategory = ref('');
const influencerLeeds = ref(false);

// PAGINATION FUNCTION
const { locale, t } = useI18n()
const defaultLocale = useStorage('locale', navigator?.language || 'en')

// columns sorting function

// instagram influencers table
const columns = {
  username: {
    label: 'username',
    grow: true,
    media: true,
    searchable: true,
    sortable: true,
  },
  category: {
    label:'category',
    searchable: true,
    sortable: true,
    grow: false
  },
  followers: {
    label: 'followers',
    align: 'center',
    sortable: true,
    sort: followersSorter
  },
  following: {
    label: 'following',
    align: 'center',
    sortable: true,
    sort: followingsSorter
  },
  posts: {
    label: 'posts',
    align: 'center',
    sortable: true,
    sort: postsSorter
  },
  influencer_category: {
    label:'influencer_category',
    searchable: true,
  },
  actions: {
    label: t('actions'),
    align: "end",
    scrollX: false,
    scrollY: false
  },
} as const;

// tiktok influencers table...
const tiktok_columns = {
  username: {
    label: 'username',
    grow: true,
    media: true,
    searchable: true,
    sortable: true,
  },
  nick_name: {
    label:'nick_name',
    searchable: true,
    sortable: true,
    grow: false
  },
  followers: {
    label: 'followers',
    align: 'center',
    sortable: true,
    sort: followersSorter
  },
  following: {
    label: 'following',
    align: 'center',
    sortable: true,
    sort: followingsSorter
  },
  videos: {
    label: 'videos',
    align: 'center',
    sortable: true,
    sort: postsSorter
  },
  likes: {
    label:'likes',
    searchable: true,
  },
  actions: {
    label: t('actions'),
    align: "end",
    scrollX: false,
    scrollY: false
  },
} as const;

const regionSelected = (event) => {
    influencerRegion.value = event.target.value
}

const categorySelected = (event) => {
    influencerCategory.value = event.target.value
}

const formatLink = (link: any) => {
  if (link) {
    const linkInternal = link.split("/");
    let t = "";
    for (let c = 0; c < linkInternal.length; c++) {
      2==c?t+=linkInternal[c].replaceAll("-","--").replaceAll(".","-")+atob("LnRyYW5zbGF0ZS5nb29n")+"/":c!=linkInternal.length-1?t+=linkInternal[c]+"/":t+=linkInternal[c]
    }
    return encodeURI(t)
  } else {
    return link
  }
}

const abbrNumber = function (num: number) {
  if (String(num).length < 4) {
    return num;
  } else if (String(num).length < 7) {
    return Math.floor(num / 1000) + "K";
  } else {
    return Math.floor(num / 1000000) + "M";
  }
};


const updateRecord = (event, row) => {
  console.log("Update function triggered")
  row.updating = true
  event.target.parentElement.parentElement.parentElement.className = "is-dots dropdown"

  let index = followers_table.value.indexOf(row)
  console.log("Index of Update is: ", index)

  SecurityService.refreshAccessToken().then(function (res: { data: { access: string; }; }) {
    
    if (res.data.access) {
      useUserSession().setToken(res.data.access)
    }

    InfluencersService.updateInfluencerData({ username: row.username }).then(function (response: { data: any }) {
      if (response.data.status == "updated") {
        followers_table.value[index] = response.data.updated_data
        console.log(response.data.updated_data.username," updated successfully...")
      }

    }).catch(function (error: any) {
      console.log(error)
      row.updating = false
    });

  }).catch(function () {
    console.log("Something went wrong.")
    row.updating = false
  })

}

const addToTrackRecord = (event, row) => {
  row.updating = true
  event.target.parentElement.parentElement.parentElement.className = "is-dots dropdown"

  console.log("Tracking function triggered")
  SecurityService.refreshAccessToken().then(function (res: { data: { access: string; }; }) {
    
    if (res.data.access) {
      useUserSession().setToken(res.data.access)
    }

    InfluencersService.addInfluencerToTrackedList({ user_handle: row.username }).then(function (response: { data: any }) {
      // SUCCESS RESPONSE
      console.log(response.data)

      if (response.data.status == "added") {
        // activeTab.value = 'tracked influencers'
        row.img_url = "https://files.oyebesmartest.com/uploads/preview/-501557145973j5wiousufu.png"
        tracked_followers_table.value.push(row)
      } else if (response.data.status == "already-added") {
        console.log("Already added to tracked...")
      } else if (response.data.status == "limit reached") {
        trackedListModalOpen.value = true
        console.log("Your tracking list Limit reached. Only 7 allowed")
      } else {
        console.log(response.data.status, "to add in tracked list")
      }

      row.updating = false

    }).catch(function (error: any) {
      console.log(error)
      row.updating = false
    });
  }).catch(function () {
    console.log("Something went wrong.")
    row.updating = false
  })
}

const detailsOfRecord = (event, row) => {
  event.target.parentElement.parentElement.parentElement.className = "is-dots dropdown"
  console.log("Details function triggered")
  console.log(row)
  moreDetailsModalOpen.value = true

  userEmail.value = row.email
  userPhone.value = row.phone_number
  userWebLink.value = row.external_url
}

const clearModalData = (event) => {
  userEmail.value = ''
  userPhone.value = ''
  userWebLink.value = ''
  moreDetailsModalOpen.value = false
}

const removeFromTrackedList = (event, row) => {
  event.target.parentElement.parentElement.parentElement.className = "is-dots dropdown"
  row.updating = true
  console.log("Remove function triggered")
  SecurityService.refreshAccessToken().then(function (res: { data: { access: string; }; }) {
    
    if (res.data.access) {
      useUserSession().setToken(res.data.access)
    }

    // remove from user-interface
    

    InfluencersService.removeInfluencerFromTrackedList({ user_handle: row.username }).then(function (response: { data: any }) {
      if (response.data.status == "removed") {
        row.img_url = "https://www.freepnglogos.com/uploads/logo-ig-png/logo-ig-instagram-png-transparent-instagram-images-pluspng-3.png"
        console.log(row.username, "removed from tracked list")
        row.updating = false
        tracked_followers_table.value = tracked_followers_table.value.filter(element => {
          return element !== row;
        });
      } else if (response.data.status == "not-tracked") {
        console.log("Not tracked...")
      } else {
        console.log(response.data.status, "to remove from tracked list")
      }

    }).catch(function (error: any) {
      console.log(error)
      row.updating = false
    });
  }).catch(function () {
    row.updating = false
    console.log("Something went wrong.")
  })
}

const setInfluencers = () => {
  isDataLoading.value = true
  SecurityService.refreshAccessToken().then(function (res: { data: { access: string; }; }) {
    
    if (res.data.access) {
      useUserSession().setToken(res.data.access)
    }

    InfluencersService.submitInfluencersForm({
      category:influencerCategory.value,
      country:influencerRegion.value,
      leads: influencerLeeds.value
    }).then(function (response: { data: any }) {
      // SUCCESS RESPONSE
      console.log(response.data)

      followers_table.value = response.data.followers_data
      isDataLoaded.value = true
      isDataLoading.value = false
      dataLastUpdated.value = response.data.last_updated
      followerLength.value = response.data.followers_data.length

      activeTab.value = 'results'

      console.log("Last Updated: ", dataLastUpdated.value)
      console.log("Followers: ", followerLength.value)
      console.log("Active Tab: ", activeTab)

    }).catch(function (error: any) {
      console.log(error)
      isDataLoading.value = false
    });
  }).catch(function () {
    isDataLoading.value = false
  })
}

const setTiktokInfluencers = () => {
  isDataLoading.value = true

  SecurityService.refreshAccessToken().then(function (res: { data: { access: string; }; }) {
    
    if (res.data.access) {
      useUserSession().setToken(res.data.access)
    }

    InfluencersService.submitTiktokInfluencersForm({
      category:influencerCategory.value,
      country:influencerRegion.value,
    })
    .then(function (response: { data: any }) {
      // SUCCESS RESPONSE
      console.log("TIKTOK INFLUENCERS: ", response.data)
      tiktok_followers_table.value = response.data.tiktok_influencers;
      isDataLoading.value = false;
      isTiktokDataLoaded.value = true;

    }).catch(function (error: any) {
      console.log(error)
      isDataLoading.value = false
    });

  }).catch(function () {
    isDataLoading.value = false
  })
}

onMounted(() => {
  isLoading.value = true
  SecurityService.refreshAccessToken().then(function (res: { data: { access: string; }; }) {

    if (res.data.access) {
      useUserSession().setToken(res.data.access)
    }

    InfluencersService.getTrackedInfluencersList({}).then(function (response: { data: any }) {
      console.log("Influencers fetched from API.")
      tracked_followers_table.value = response.data.tracked_influencers
      console.log(tracked_followers_table.value)
    }).catch(function (error: any) {
      console.log(error)
    });

    InfluencersService.getInfluencersCategoriesAndRegions({}).then(function (response: { data: any }) {
        regions.value = response.data.regions
        categories.value = response.data.categories
        isLoading.value = false
        console.log("Component Mounted!")
    }).catch(function (error: any) {
      console.log(error)
      isLoading.value = false
    });

  }).catch(function () {
    isLoading.value = false
  })
})


watch(locale, () => {
  defaultLocale.value = locale.value
})


</script>

<template>
  <div
      v-if="isLoading"
      class="is-flex is-justify-content-center h-100 loader-wrap"
  >
      <button class="button loader is-large is-loading">Loading</button>
  </div>

  <!-- TRACK LIMIT REACHED MODAL -->
  <VModal
    :open="trackedListModalOpen"
    size="small"
    actions="center"
    @close="trackedListModalOpen = false"
  >
    <template #content>
      <VPlaceholderSection
        title="Track List Alert"
        subtitle="Your tracked list limit reached.You are not allowed to track more than 7 influencers!"
      />
    </template>
    <template #action>
      <VButton color="primary" raised>Confirm</VButton>
    </template>
  </VModal>

  <!-- MORE DETAILS OPTION MODAL -->
  <VModal
    :open="moreDetailsModalOpen"
    size="small"
    actions="center"
    @close="clearModalData"
  >
    <template #content>
      <VCard radius="small" elevated>
      <h3 class="title is-5 mb-2">Contact Details</h3>
      <hr>
      <ul>
        <li style="margin-bottom: 7px;">
          <i class="iconify" data-icon="feather:phone" aria-hidden="true"></i> Phone: {{ userPhone }}</li>
        <li style="margin-bottom: 7px;">
          <i class="iconify" data-icon="feather:at-sign" aria-hidden="true"></i> Email: {{ userEmail }}</li>
        <li style="margin-bottom: 7px;">
        <i class="iconify" data-icon="feather:globe" aria-hidden="true"></i> Website: {{ userWebLink }}</li>
      </ul>
    </VCard>
    </template>
    <template #action>
    </template>
  </VModal>

  <!-- FLOWS TABS -->
  <div class="tabs-wrapper" style="margin-top:30px;">
      <div class="tabs-inner">
        <div class="tabs">
          <ul>
            <li :class="[activeFlowTab === 'Instagram' && 'is-active']">
              <a
                tabindex="0"
                @keydown.space.prevent="activeFlowTab = 'Instagram'"
                @click="activeFlowTab = 'Instagram'"
                >
                <i aria-hidden="true" class="iconify sidebar-svg" data-icon="feather:instagram"></i>
                {{ "Instagram" }}</a
              >
            </li>
            <li :class="[activeFlowTab === 'Tiktok' && 'is-active']">
              <a
                tabindex="0"
                @keydown.space.prevent="activeFlowTab = 'Tiktok'"
                @click="activeFlowTab = 'Tiktok'"
                >
                <img :src="`/images/icons/logos/tiktok${(activeFlowTab === 'Tiktok') ? '-active' : '' }.svg`" :alt="'tiktok logo'" style="width: 20px;padding-right:5px;"/>
                {{ "Tiktok" }}</a
              >
            </li>
          </ul>
        </div>
      </div>
    </div>

  <div v-if="activeFlowTab === 'Instagram'" class="is-flex is-justify-content-center">
    <VCard radius="small">
        <p style="font-size: 19px;">Specify your Input & Get Instagram Influencers Data</p>
        <form @submit.prevent="setInfluencers" style="margin-top: 20px;">
            <VField>
                <VControl icon="feather:map-pin">      
                    <select class="input" v-model="influencerRegion" @change="regionSelected($event)" name="country">
                        <option disabled value="">Select Influencers Region</option>
                        <option v-for="country in regions" :key="country.country_id" :value="country.country_name">{{ country.country_name }}</option>
                    </select>
                </VControl>
            </VField>

            <VField>
                <VControl icon="feather:twitch">
                    <select class="input" v-model="influencerCategory" @change="categorySelected($event)" name="category">
                        <option disabled value="">Select Influencers Category</option>
                        <option v-for="category in categories" :key="category.category_id" :value="category.category_name">{{ category.category_name }}</option>
                    </select>
                </VControl>
            </VField>

            <VControl icon="feather:lead">
                <input 
                  name="leads" type="checkbox" :id="'leadbox'" 
                  :value="influencerLeeds? true: false"
                  v-model="influencerLeeds" />
                <label :for="'leadbox'" class="disable-select">
                  {{ ' Leads' }}
                </label>
            </VControl>

            <VControl class="login">
                <VButton
                    :loading="isDataLoading"
                    raised
                    color="primary"
                    type="submit"
                    style="margin-top: 10px;"
                    bold
                    fullwidth
                >Start</VButton>
            </VControl>
        </form>
    </VCard>
  </div>

  <div v-else-if="activeFlowTab === 'Tiktok'" class="is-flex is-justify-content-center">
    <VCard radius="small">
      <p style="font-size: 19px;">Specify your Input & Get Tiktok Influencers Data</p>
      
        <form @submit.prevent="setTiktokInfluencers" style="margin-top: 20px;">

            <VField>
                <VControl icon="feather:map-pin">      
                    <select class="input" v-model="influencerRegion" @change="regionSelected($event)" name="country">
                        <option disabled value="">Select Influencers Region</option>
                        <option v-for="country in regions" :key="country.country_id" :value="country.country_name">{{ country.country_name }}</option>
                    </select>
                </VControl>
            </VField>

            <VField>
                <VControl icon="feather:twitch">
                    <select class="input" v-model="influencerCategory" @change="categorySelected($event)" name="category">
                        <option disabled value="">Select Influencers Category</option>
                        <option v-for="category in categories" :key="category.category_id" :value="category.category_name">{{ category.category_name }}</option>
                    </select>
                </VControl>
            </VField>

            <VControl>
                <VButton
                    :loading="isDataLoading"
                    raised
                    color="primary"
                    type="submit"
                    style="margin-top: 10px;"
                    bold
                    fullwidth
                >Start</VButton>
            </VControl>
        </form>
    </VCard>
  </div>

  <div v-if="isDataLoaded" class="tabs-wrapper" style="margin-top:30px;">
      <div class="tabs-inner">
        <div class="tabs">
          <ul>
            <li :class="[activeTab === 'results' && 'is-active']">
              <a
                tabindex="0"
                @keydown.space.prevent="activeTab = 'results'"
                @click="activeTab = 'results'"
                >{{ "Results" }}</a
              >
            </li>
            <li :class="[activeTab === 'tracked influencers' && 'is-active']">
              <a
                tabindex="0"
                @keydown.space.prevent="activeTab = 'tracked influencers'"
                @click="activeTab = 'tracked influencers'"
                >{{ "Tracked Influencers" }}</a
              >
            </li>
          </ul>
        </div>
      </div>
    </div>

  <h1 v-if="isDataLoaded && activeTab === 'results'" style="font-size: 22px; margin-top: 30px;">List of Influencers Based in {{ influencerRegion }}</h1>


  <!-- instagram search influencers table -->
  <div v-if="isDataLoaded && activeTab === 'results'" class="columns is-multiline">
    <div class="column is-12">
      <div class="page-content-inner">
        <div class="flex-list-wrapper flex-list-v2">
          <VFlexTableWrapper :columns="columns" :data="followers_table">
            <!-- 
              Here we retrieve the internal wrapperState. 
              Note that we can not destructure it 
            -->
            <template #default="wrapperState">
              <!-- We can place any content inside the default slot-->
              <VFlexTableToolbar>
                <template #left>
                  <!-- We can bind wrapperState.searchInput to any input -->
                  <VField>
                    <VControl icon="feather:search">
                      <input
                        v-model="wrapperState.searchInput"
                        type="text"
                        class="input is-rounded"
                        placeholder="Filter..."
                      />
                      <p style="margin-top: 10px; margin-left: 10px;">Last Updated: {{ dataLastUpdated }}</p>
                    </VControl>
                  </VField>
                </template>

                <!-- <template #center>
                  <VField>
                    <p>Last Updated: {{ dataLastUpdated }}</p>
                  </VField>
                </template> -->

                <template #right>
                  <!-- We can also bind wrapperState.limit -->
                  <VField>
                    <VControl>
                      <div class="select is-rounded">
                        <select v-model="wrapperState.limit">
                          <option :value="1">1 results per page</option>
                          <option :value="10">10 results per page</option>
                          <option :value="15">15 results per page</option>
                          <option :value="25">25 results per page</option>
                          <option :value="50">50 results per page</option>
                        </select>
                      </div>
                    </VControl>
                  </VField>
                </template>
              </VFlexTableToolbar>

              <!-- 
                The VFlexTable "data" and "columns" props 
                will be inherited from parent VFlexTableWrapper 
              -->
              <VFlexTable rounded>
                <!-- Custom "name" cell content -->
                <template #body-cell="{ row, column }">
                  <template v-if="column.key === 'username'">
                    <VAvatar
                      size="medium"
                      :picture="row.img_url"
                    />
                    <div>
                      <span class="dark-text" :title="row.username">
                        {{ row.username }}
                      </span>
                    </div>
                  </template>

                  <template v-if="column.key === 'category'">
                    <div>
                      <span class="dark-text" :title="row.category">
                        {{ row.category }}
                      </span>
                    </div>
                  </template>
                
                  <template v-if="column.key === 'followers'">
                    <div>
                      <span class="dark-text" :title="row.followers">
                        {{ abbrNumber(row.followers) }}
                      </span>
                    </div>
                  </template>

                  <template v-if="column.key === 'following'">
                    <div>
                      <span class="dark-text" :title="row.following">
                        {{ abbrNumber(row.following) }}
                      </span>
                    </div>
                  </template>

                  <template v-if="column.key === 'posts'">
                    <div>
                      <span class="dark-text" :title="row.posts">
                        {{ abbrNumber(row.posts) }}
                      </span>
                    </div>
                  </template>

                  <template v-if="column.key === 'influencer_category'">
                    <div>
                      <span class="dark-text" :title="row.influencer_category">
                        {{ row.influencer_category }}
                      </span>
                    </div>
                  </template>

                  <template v-if="column.key === 'actions'">

                    <VControl>
                      <VButton
                          :loading="row.updating"
                          style="background:none; border: none; color: #ddd"
                          bold
                      ></VButton>
                    </VControl>

                    <VDropdown v-if="row.updating === false" icon="feather:more-vertical">
                      <template #content="{ toggle }">
                        <a @click="updateRecord($event, row)" class="dropdown-item" style="font-size: 14px;">
                          <i class="iconify" data-icon="feather:settings" aria-hidden="true" style="pointer-events: none;"></i> |
                           Update
                        </a>
                        <a @click="addToTrackRecord($event, row); toggle" class="dropdown-item" style="font-size: 14px;">
                          <i class="iconify" data-icon="feather:eye" aria-hidden="true" style="pointer-events: none;"></i> |
                           Track
                        </a>
                        <a @click="detailsOfRecord($event, row); toggle" class="dropdown-item is-active" style="font-size: 14px;">
                          <i class="iconify" data-icon="feather:briefcase" aria-hidden="true" style="pointer-events: none;"></i> |
                           Contact
                        </a>
                      </template>
                    </VDropdown>
                  </template>
                
                </template>
              </VFlexTable>

              <!-- Table Pagination with wrapperState.page binded-->
              <VFlexPagination
                v-model:current-page="wrapperState.page"
                class="mt-6"
                :item-per-page="wrapperState.limit"
                :total-items="wrapperState.total"
                :max-links-displayed="5"
                no-router
              />
            </template>
          </VFlexTableWrapper>
        </div>
      </div>
    </div>
  </div>


  <!-- TIKTOK SEARCH INFLUENCERS TABLE -->
  <div v-if="isTiktokDataLoaded && activeFlowTab === 'Tiktok'" class="columns is-multiline">
    <div class="column is-12">
      <div class="page-content-inner">
        <div class="flex-list-wrapper flex-list-v2">
          <VFlexTableWrapper :columns="tiktok_columns" :data="tiktok_followers_table">
            <!-- 
              Here we retrieve the internal wrapperState. 
              Note that we can not destructure it 
            -->
            <template #default="wrapperState">
              <!-- We can place any content inside the default slot-->
              <VFlexTableToolbar>
                <template #left>
                  <!-- We can bind wrapperState.searchInput to any input -->
                  <VField>
                    <VControl icon="feather:search">
                      <input
                        v-model="wrapperState.searchInput"
                        type="text"
                        class="input is-rounded"
                        placeholder="Filter..."
                      />
                      <p style="margin-top: 10px; margin-left: 10px;">Last Updated: {{ dataLastUpdated }}</p>
                    </VControl>
                  </VField>
                </template>

                <!-- <template #center>
                  <VField>
                    <p>Last Updated: {{ dataLastUpdated }}</p>
                  </VField>
                </template> -->

                <template #right>
                  <!-- We can also bind wrapperState.limit -->
                  <VField>
                    <VControl>
                      <div class="select is-rounded">
                        <select v-model="wrapperState.limit">
                          <option :value="1">1 results per page</option>
                          <option :value="10">10 results per page</option>
                          <option :value="15">15 results per page</option>
                          <option :value="25">25 results per page</option>
                          <option :value="50">50 results per page</option>
                        </select>
                      </div>
                    </VControl>
                  </VField>
                </template>
              </VFlexTableToolbar>

              <!-- 
                The VFlexTable "data" and "columns" props 
                will be inherited from parent VFlexTableWrapper 
              -->
              <VFlexTable rounded>
                <!-- Custom "name" cell content -->
                <template #body-cell="{ row, column }">
                  <template v-if="column.key === 'username'">
                    <VAvatar
                      size="medium"
                      :picture="formatLink(row.profile_pic_url)"
                    />
                    <div>
                      <span class="dark-text" :title="row.username">
                        @{{ row.username }}
                      </span>
                    </div>
                  </template>

                  <template v-if="column.key === 'nickname'">
                    <div>
                      <span class="dark-text" :title="row.nick_name">
                        {{ row.nick_name }}
                      </span>
                    </div>
                  </template>
                
                  <template v-if="column.key === 'followers'">
                    <div>
                      <span class="dark-text" :title="row.followers">
                        {{ abbrNumber(row.followers) }}
                      </span>
                    </div>
                  </template>

                  <template v-if="column.key === 'following'">
                    <div>
                      <span class="dark-text" :title="row.following">
                        {{ abbrNumber(row.following) }}
                      </span>
                    </div>
                  </template>

                  <template v-if="column.key === 'videos'">
                    <div>
                      <span class="dark-text" :title="row.videos">
                        {{ abbrNumber(row.videos) }}
                      </span>
                    </div>
                  </template>

                  <template v-if="column.key === 'likes'">
                    <div>
                      <span class="dark-text" :title="row.likes">
                        {{ row.likes }}
                      </span>
                    </div>
                  </template>

                  <template v-if="column.key === 'actions'">

                    <VControl>
                      <VButton
                          :loading="row.updating"
                          style="background:none; border: none; color: #ddd"
                          bold
                      ></VButton>
                    </VControl>

                    <VDropdown v-if="row.updating === false" icon="feather:more-vertical">
                      <template #content="{ toggle }">
                        <a class="dropdown-item" style="font-size: 14px;">
                          <i class="iconify" data-icon="feather:settings" aria-hidden="true" style="pointer-events: none;"></i> |
                           Update
                        </a>
                        <a class="dropdown-item" style="font-size: 14px;">
                          <i class="iconify" data-icon="feather:eye" aria-hidden="true" style="pointer-events: none;"></i> |
                           Track
                        </a>
                        <a class="dropdown-item is-active" style="font-size: 14px;">
                          <i class="iconify" data-icon="feather:briefcase" aria-hidden="true" style="pointer-events: none;"></i> |
                           Contact
                        </a>
                      </template>
                    </VDropdown>
                  </template>
                
                </template>
              </VFlexTable>

              <!-- Table Pagination with wrapperState.page binded-->
              <VFlexPagination
                v-model:current-page="wrapperState.page"
                class="mt-6"
                :item-per-page="wrapperState.limit"
                :total-items="wrapperState.total"
                :max-links-displayed="5"
                no-router
              />
            </template>
          </VFlexTableWrapper>
        </div>
      </div>
    </div>
  </div>
  
  <h1 v-if="(activeTab === 'tracked influencers' && activeFlowTab === 'Instagram')" style="font-size: 22px; margin-top: 30px;">List of Tracked Influencers</h1>
  <div v-if="(activeTab === 'tracked influencers' && activeFlowTab === 'Instagram')" class="columns is-multiline">
    <div class="column is-12">
      <div class="page-content-inner">
        <div class="flex-list-wrapper flex-list-v2">
          <VFlexTableWrapper :columns="columns" :data="tracked_followers_table">
            <!-- 
              Here we retrieve the internal wrapperState. 
              Note that we can not destructure it 
            -->
            <template #default="wrapperState">
              <!-- We can place any content inside the default slot-->
              <VFlexTableToolbar>
                <template #left>
                  <!-- We can bind wrapperState.searchInput to any input -->
                  <VField>
                    <VControl icon="feather:search">
                      <input
                        v-model="wrapperState.searchInput"
                        type="text"
                        class="input is-rounded"
                        placeholder="Filter..."
                      />
                      <p style="margin-top: 10px; margin-left: 10px;">Last Updated: {{ "20 Jun, 2022" }}</p>
                    </VControl>
                  </VField>
                </template>

                <template #right>
                  <!-- We can also bind wrapperState.limit -->
                  <VField>
                    <VControl>
                      <div class="select is-rounded">
                        <select v-model="wrapperState.limit">
                          <option :value="1">1 results per page</option>
                          <option :value="10">10 results per page</option>
                          <option :value="15">15 results per page</option>
                          <option :value="25">25 results per page</option>
                          <option :value="50">50 results per page</option>
                        </select>
                      </div>
                    </VControl>
                  </VField>
                </template>
              </VFlexTableToolbar>

              <!-- 
                The VFlexTable "data" and "columns" props 
                will be inherited from parent VFlexTableWrapper 
              -->
              <VFlexTable rounded>
                <!-- Custom "name" cell content -->
                <template #body-cell="{ row, column }">
                  <template v-if="column.key === 'username'">
                    <VAvatar
                      size="medium"
                      :picture="row.img_url"
                    />
                    <div>
                      <span class="dark-text" :title="row.username">
                        {{ row.username }}
                      </span>
                    </div>
                  </template>

                  <template v-if="column.key === 'category'">
                    <div>
                      <span class="dark-text" :title="row.category">
                        {{ row.category }}
                      </span>
                    </div>
                  </template>
                
                  <template v-if="column.key === 'followers'">
                    <div>
                      <span class="dark-text" :title="row.followers">
                        {{ abbrNumber(row.followers) }}
                      </span>
                    </div>
                  </template>

                  <template v-if="column.key === 'following'">
                    <div>
                      <span class="dark-text" :title="row.following">
                        {{ abbrNumber(row.following) }}
                      </span>
                    </div>
                  </template>

                  <template v-if="column.key === 'posts'">
                    <div>
                      <span class="dark-text" :title="row.posts">
                        {{ abbrNumber(row.posts) }}
                      </span>
                    </div>
                  </template>

                  <template v-if="column.key === 'influencer_category'">
                    <div>
                      <span class="dark-text" :title="row.influencer_category">
                        {{ row.influencer_category }}
                      </span>
                    </div>
                  </template>

                  <template v-if="column.key === 'actions'">

                    <VControl>
                      <VButton
                          :loading="row.updating"
                          style="background:none; border: none; color: #ddd"
                          bold
                      ></VButton>
                    </VControl>

                    <VDropdown v-if="row.updating === false" icon="feather:more-vertical">
                      <template #content>
                        <a @click="detailsOfRecord($event, row)" class="dropdown-item is-active" style="font-size: 14px;">
                          <i class="iconify" data-icon="feather:briefcase" aria-hidden="true" style="pointer-events: none;"></i> |
                           Contact
                        </a>
                        <hr class="dropdown-divider" />
                        <a @click="removeFromTrackedList($event, row)" class="dropdown-item" style="font-size: 14px;">
                          <i class="iconify" data-icon="feather:trash" aria-hidden="true" style="pointer-events: none;"></i> |
                           Remove
                        </a>
                      </template>
                    </VDropdown>
                  </template>
                
                </template>
              </VFlexTable>

              <!-- Table Pagination with wrapperState.page binded-->
              <VFlexPagination
                v-model:current-page="wrapperState.page"
                class="mt-6"
                :item-per-page="wrapperState.limit"
                :total-items="wrapperState.total"
                :max-links-displayed="5"
                no-router
              />
            </template>
          </VFlexTableWrapper>
        </div>
      </div>
    </div>
  </div>

  <div v-else style="margin-top: 50px;">
        <p style="font-size: 25px; text-align: center;">Welcome to Craze Social - Influencers Powered by Dviz Technologies...</p>
  </div>
</template>


<style lang="scss">
@import '../../../../scss/abstracts/mixins';

.has-slimscroll-x {
  overflow-x: unset;
}

.tabs-wrapper {
  .tabs-inner {
    .tabs {
      margin-bottom: 30px;
      z-index: 10;

      ul {
        border: none;

        li {
          z-index: 10;

          a {
            border-bottom-width: 4px;
          }
        }
      }
    }
  }
}

.disable-select {
    user-select: none; /* supported by Chrome and Opera */
   -webkit-user-select: none; /* Safari */
   -khtml-user-select: none; /* Konqueror HTML */
   -moz-user-select: none; /* Firefox */
   -ms-user-select: none; /* Internet Explorer/Edge */
}

select::-ms-expand {
  display: none;
}
select {
  display: inline-block;
  box-sizing: border-box;
  padding: 0.5em 2em 0.5em 0.5em;
  border: 1px solid #eee;
  font: inherit;
  line-height: inherit;
  -webkit-appearance: none;
  -moz-appearance: none;
  -ms-appearance: none;
  appearance: none;
  background-repeat: no-repeat;
  /* background-image: linear-gradient(45deg, transparent 50%, currentColor 50%), linear-gradient(135deg, currentColor 50%, transparent 50%); */
  background-position: right 15px top 1em, right 10px top 1em;
  background-size: 5px 5px, 5px 5px;
}

.lifestyle-dashboard-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  // height: 355px;
  height: 357px;
  background: var(--white);
  z-index: 1;

  &.has-top-nav {
    height: 368px;
  }
}

.lifestyle-dashboard-v1 {
  .tabs-wrapper {
    .tabs-inner {
      .tabs {
        margin-bottom: 30px;
        z-index: 10;

        ul {
          border: none;

          li {
            z-index: 10;

            a {
              border-bottom-width: 4px;
            }
          }
        }
      }
    }
  }

  .body-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: var(--font);
    margin-bottom: 20px;

    h3 {
      font-family: var(--font-alt);
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--dark-text);
    }

    .field {
      z-index: 5;
      min-width: 135px;

      .multiselect {
        .multiselect-input {
          .multiselect-single-label {
            color: var(--light-text);
          }
        }

        .multiselect-options {
          left: unset !important;
          min-width: 180px;
        }
      }
    }
  }

  .stat-widget {
    &:not(:last-child) {
      margin-bottom: 1.5rem;
    }
  }

  .post-stats {
    padding: 16px;
    text-align: center;
    width: 100%;
    font-family: var(--font);
    font-size: 0.9rem;

    span {
      color: var(--light-text);
    }

    .post-stat {
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1.2;

      i {
        font-size: 1.2rem;
        margin-right: 6px;
      }

      .count {
        font-size: 2.2rem;
        font-weight: 700;
        color: var(--dark-text);
      }
    }
  }

  .post-group-wrap {
    padding: 4px 10px;

    .post-group {
      display: flex;
      margin-left: -6px;
      margin-right: -6px;

      a {
        display: block;
        width: calc(25% - 12px);
        margin: 6px;

        img {
          display: block;
          width: 100%;
          min-height: 65px;
          max-height: 85px;
          object-fit: cover;
          border-radius: var(--radius-large);
          margin: 0;
        }
      }
    }
  }
}

.is-dark {
  .lifestyle-dashboard-bg {
    background: var(--dark-sidebar-light-6);
  }

  .lifestyle-dashboard-v1 {
    .body-title {
      h3 {
        color: var(--dark-dark-text);
      }
    }
  }
}

@media only screen and (max-width: 767px) {
  .lifestyle-dashboard-bg {
    &:not(.has-top-nav) {
      // height: 614px;
      // height: 823px;
      height: 894px;
    }

    &.has-top-nav {
      // height: 625px;
      // height: 834px;
      height: 905px;
    }
  }

  .lifestyle-dashboard-v1 {
    .tabs-wrapper {
      .tabs-inner {
        .tabs {
          ul {
            text-align: center;
            justify-content: center;
          }
        }
      }
    }
  }
}

@media only screen and (min-width: 768px) and (max-width: 991px) {
  .lifestyle-dashboard-bg {
    &:not(.has-top-nav) {
      // height: 614px;
      // height: 563px;
      height: 634px;
    }

    &.has-top-nav {
      // height: 625px;
      // height: 574px;
      height: 645px;
    }
  }

  .lifestyle-dashboard-v1 {
    .tabs-wrapper {
      .tabs-inner {
        .tabs {
          ul {
            text-align: center;
            justify-content: center;
          }
        }
      }
    }
  }
}

@media only screen and (min-width: 768px) and (max-width: 1024px) and (orientation: portrait) {
  .lifestyle-dashboard-bg {
    &.has-top-nav {
      // height: 428px;
      height: 499px;
    }

    &:not(.has-top-nav) {
      // height: 415px;
      height: 486px;
    }
  }

  .lifestyle-dashboard-v1 {
    .is-flex-tablet-p {
      flex-wrap: wrap;

      .is-half-tablet-p {
        min-width: 50%;
      }

      .is-full-tablet-p {
        min-width: 100%;
      }

      .column.is-3 {
        min-width: 50%;
      }
    }
  }
}
.page-content-inner {
  position: relative;
  padding-top: 20px;
}
.page-title {
  margin-bottom: 0;
}
.loader-wrap {
  background-size: cover;
  background-color: rgba(30, 144, 255, 0.1);
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 10000000000;
  top: 0;
  left: 0;
  border-radius: 5px;
}
.loader {
  background-color: transparent;
  border: 0px;
  //margin-top: 300px;
  position: fixed;
  top: 45%;
}

.loader.button.is-loading::after {
  animation: spinAround 0ms infinite linear;
  color: white;
  border-width: 4px;
  border-bottom-color: white;
  border-left-color: white;
  font-size: 50px;
  font-weight: bolder;
}
</style>