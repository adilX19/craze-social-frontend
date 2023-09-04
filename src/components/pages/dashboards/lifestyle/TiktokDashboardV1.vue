<script setup lang="ts">
import { ref, onMounted } from 'vue'

// we import our useApi helper
import { useApi } from '/@src/composable/useApi'
import TiktokService from "/@src/services/TiktokService";
import SecurityService from "/@src/services/SecurityService";
import TiktokOverviewTab from "/@src/components/partials/tiktok/TiktokOverviewTab.vue";
import TiktokContentTab from "/@src/components/partials/tiktok/TiktokContentTab.vue";
import TiktokBrandsTab from "/@src/components/partials/tiktok/TiktokBrandsTab.vue";
import {useUserSession} from "/@src/stores/userSession";

// We may want to retrieve the posts from an API
// as we are using typescript, it is a good practice to always define our types
interface DataSet {
  customer_dataset: Object
  competitors_dataset: Object
}

// recentSearches variable can be provided by a composable function
const datasets = ref<DataSet>()
const isLoading = ref(false);

async function fetchDataSets() {
  const api = useApi()

  try {
    // const { data } = await api.get<DataSet>('/datasets')
    isLoading.value = true;
    SecurityService.refreshAccessToken().then(function (res: { data: { access: string; }; }) {
      if (res.data.access) {
        useUserSession().setToken(res.data.access)
      }
      TiktokService.getTiktok({})
          .then(function (response: { data: any }) {
            isLoading.value = false;
            datasets.value = response.data.dataset
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

// We trigger the fetchArticles function when the component is mounted
onMounted(fetchDataSets)

type TabId = 'overview' | 'analytics' | 'compare'
const activeTab = ref<TabId>('overview')
</script>

<template>
  <div
      v-if="isLoading"
      class="is-flex is-justify-content-center h-100 loader-wrap"
  >
    <button class="button loader is-large is-loading">Loading</button>
  </div>
  <div class="lifestyle-dashboard lifestyle-dashboard-v1">
    <TiktokHeaderWrapper :customer-data="datasets?.customer_dataset" />

    <div class="tabs-wrapper">
      <div class="tabs-inner">
        <div class="tabs">
          <ul>
            <li :class="[activeTab === 'overview' && 'is-active']">
              <a
                tabindex="0"
                @keydown.space.prevent="activeTab = 'overview'"
                @click="activeTab = 'overview'"
                >Overview</a
              >
            </li>
            <li :class="[activeTab === 'compare' && 'is-active']">
              <a
                tabindex="0"
                @keydown.space.prevent="activeTab = 'compare'"
                @click="activeTab = 'compare'"
                >Compare</a
              >
            </li>
            <li :class="[activeTab === 'analytics' && 'is-active']">
              <a
                tabindex="0"
                @keydown.space.prevent="activeTab = 'analytics'"
                @click="activeTab = 'analytics'"
                >Analytics</a
              >
            </li>
          </ul>
        </div>
      </div>
      <TiktokOverviewTab v-if="activeTab === 'overview'" :customer-data="datasets?.customer_dataset"
                            :insights-data="datasets?.insights_data"/>
      <TiktokContentTab v-else-if="activeTab === 'analytics'" :customer-data="datasets?.customer_dataset"
                          :competitors-data="datasets?.competitors_dataset" :dataset="datasets"/>
      <TiktokBrandsTab v-else-if="activeTab === 'compare'" :customer-data="datasets?.customer_dataset"
                          :wordcloud-data="datasets?.wordcloud_dataset"  :competitors-data="datasets?.competitors_dataset"/>
    </div>
  </div>
</template>

<style lang="scss">
@import '../../../../scss/abstracts/mixins';

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
