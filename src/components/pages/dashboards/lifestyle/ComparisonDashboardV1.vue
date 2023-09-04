<script setup lang="ts">
import {ref, onMounted, watch} from 'vue';
import { useRouter, useRoute } from "vue-router";
import { useApi } from '/@src/composable/useApi';
import SecurityService from "/@src/services/SecurityService";
import InstagramService from "/@src/services/InstagramService";
import TiktokService from "/@src/services/TiktokService";

import InstagramBrandsTab from "/@src/components/partials/instagram/InstagramBrandsTab.vue";
import TiktokBrandsTab from "/@src/components/partials/tiktok/TiktokBrandsTab.vue";

import tooltip from "/@src/directives/tooltip"
import {useUserSession} from "/@src/stores/userSession";
import {useI18n} from "vue-i18n";
import {useStorage} from "@vueuse/core";

const { locale, t } = useI18n()
const route = useRoute();

const isLoading = ref(false);

type FlowTabId = 'Instagram' | 'Tiktok'
const activeFlowTab = ref<FlowTabId>('Tiktok')


// We may want to retrieve the posts from an API
// as we are using typescript, it is a good practice to always define our types
interface DataSet {
  customer_dataset: Object
  competitors_dataset: Object
}

// recentSearches variable can be provided by a composable function
const instagram_datasets = ref<DataSet>()
const tiktok_datasets = ref<DataSet>()


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

async function fetchDataSets() {
  const api = useApi()

  try {
    // const { data } = await api.get<DataSet>('/datasets')
    isLoading.value = true;
    SecurityService.refreshAccessToken().then(function (res: { data: { access: string; }; }) {
        if (res.data.access) {
            useUserSession().setToken(res.data.access)
        }

        // FETCHING INSTAGRAM COMPARISONS DATA
        InstagramService.getInstagramComparisons({})
        .then(function (response: { data: any }) {
            instagram_datasets.value = response.data.dataset
        })
        .catch(function (error: any) {
            console.log(error);
        });

        // FETCHING TIKTOK COMPARISONS DATA
        TiktokService.getTiktokComparisons({})
        .then(function (response: { data: any }) {
            tiktok_datasets.value = response.data.dataset
            isLoading.value = false
        })
        .catch(function (error: any) {
            isLoading.value = false;
            console.log(error);
        });
    })
  } catch (error) {
    // here we can handle the error
    console.error(error)
  }
}

onMounted(() => {
    console.log("Comparisons Component Mounted...");
    fetchDataSets()
})

const defaultLocale = useStorage('locale', navigator?.language || 'en')
watch(locale, () => {
  defaultLocale.value = locale.value
})

</script>

<template>
    <div v-if="isLoading" class="is-flex is-justify-content-center h-100 loader-wrap">
        <button class="button loader is-large is-loading">Loading</button>
    </div>

    <!-- FLOWS TABS FOR NAVIGATION VIA PLATFORMS -->

    <div class="lifestyle-dashboard lifestyle-dashboard-v1">
        <InstagramHeaderWrapper v-if="activeFlowTab == 'Instagram'" :customer-data="instagram_datasets?.customer_dataset" />
        <TiktokHeaderWrapper v-if="activeFlowTab == 'Tiktok'" :customer-data="tiktok_datasets?.customer_dataset" />

        <div class="tabs-wrapper">
            <div class="tabs-inner">
                <div class="tabs">
                    <ul>
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
                        <li :class="[activeFlowTab === 'Instagram' && 'is-active']" style="margin-left: 25px;">
                        <a
                            tabindex="0"
                            @keydown.space.prevent="activeFlowTab = 'Instagram'"
                            @click="activeFlowTab = 'Instagram'"
                            >
                            <i aria-hidden="true" class="iconify sidebar-svg" data-icon="feather:instagram"></i>
                            {{ "Instagram" }}</a
                        >
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- TIKTOK COMPARISONS GRID -->
        <TiktokBrandsTab v-if="activeFlowTab === 'Tiktok' && isLoading === false" :customer-data="tiktok_datasets?.customer_dataset"
                          :wordcloud-data="tiktok_datasets?.wordcloud_dataset"  :competitors-data="tiktok_datasets?.competitors_dataset"/>

        <!-- INSTAGRAM COMPARISONS GRID -->
        <InstagramBrandsTab v-else-if="activeFlowTab === 'Instagram' && isLoading === false" :customer-data="instagram_datasets?.customer_dataset"
                          :wordcloud-data="instagram_datasets?.wordcloud_dataset"  :competitors-data="instagram_datasets?.competitors_dataset"/>

    </div>

</template>

<style lang="scss">
/*@import '../../../../scss/abstracts/mixins';*/

.tooltip {
    display:inline-block;
    position:relative;
    text-align:left;
}

#tooltip-short {
	top: -7px;
	left: -5%;
}

.tooltip .top {
    min-width:200px; 
    top:-20px;
    left:50%;
    transform:translate(-50%, -100%);
    padding:10px 20px;
    color:#444444;
    background-color:#EEEEEE;
    font-weight:normal;
    font-size:11px;
    border-radius:8px;
    position:absolute;
    z-index:99999999;
    box-sizing:border-box;
    box-shadow:0 1px 8px rgba(0,0,0,0.5);
    visibility:hidden; opacity:0; transition:opacity 0.8s;
}

.tooltip:hover .top {
    visibility:visible; opacity:1;
}

.tooltip .top i {
    position:absolute;
    top:100%;
    left:50%;
    margin-left:-12px;
    width:24px;
    height:12px;
    overflow:hidden;
}

.tooltip .top i::after {
    content:'';
    position:absolute;
    width:12px;
    height:12px;
    left:50%;
    transform:translate(-50%,-50%) rotate(45deg);
    background-color:#EEEEEE;
    box-shadow:0 1px 8px rgba(0,0,0,0.5);
}

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