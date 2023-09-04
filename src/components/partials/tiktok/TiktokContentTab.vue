<script setup lang="ts">
import * as chartOptions from "/@src/data/dashboards/apex-demo/chartOptions";
import ApexChart from "vue3-apexcharts";
import {computed, ref, onMounted, watch} from "vue";
import type { VAvatarProps } from "/@src/components/base/avatar/VAvatar.vue";
import {useI18n} from "vue-i18n";
import {useStorage} from "@vueuse/core";
import {useThemeColors} from "/@src/composable/useThemeColors";
import * as formatters from "/@src/utils/apex-formatters";
// import * as listData from "/@src/data/layouts/flex-list-v1";

const props = defineProps<{
  customerData: any;
  insightsData: any;
  competitorsData: any;
  dataset: any;
}>();

const page = ref(1);
const filters = ref("");

// const users = props.competitorsData;

const { locale, t } = useI18n()

/**
 * We use the same storage key as we use in the /src/i18n.ts file
 * so if user reload the page, the selected language will be the same
 */
const defaultLocale = useStorage('locale', navigator?.language || 'en')

/**
 * Each time we change the locale, we persit it in the storage
 */
watch(locale, () => {
  defaultLocale.value = locale.value
})
const columns = {
  username: {
    label: t('username'),
    grow: true,
    media: true,
  },
  followers: t('followers'),
  engagement: t('engagement'),
  postingFrequency: t('postingFrequency'),
  total: t('total'),
  actions: {
    label: t('actions'),
    align: "end",
  },
} as const;

const themeColors = useThemeColors()
const followersFreq = ref('week')
const followersSeries = ref(followersFreq.value === 'month' ? props.dataset.followers_gained_monthly?.data : props.dataset.followers_gained_weekly?.data);
const followersChartOptions = ref({
  series: [],
  chart: {
    height: 500,
    type: 'line',
    zoom: {
      enabled: false,
    },
    toolbar: {
      show: false,
    },
  },
  colors: [themeColors.primary, themeColors.info, themeColors.green, themeColors.orange, themeColors.accent, themeColors.warning, themeColors.purple],
  dataLabels: {
    enabled: false,
  },
  stroke: {
    width:[3,3,3,3,3,3,3],
    curve: 'smooth',
    dashArray: [0,5, 5, 5, 5, 5, 5],
  },
  title: {
    text: 'Followers Growth',
    align: 'left',
  },
  legend: {
    position: 'top',
  },
  markers: {
    size: 0,
    hover: {
      sizeOffset: 6,
    },
  },
  xaxis: {
    categories: followersFreq.value === 'month' ? props.dataset.followers_gained_monthly?.labels : props.dataset.followers_gained_weekly?.labels,
  },
  tooltip: {
    y: [
      {
        title: {
          formatter: formatters.toString,
        },
      },
    ],
  },
  grid: {
    borderColor: '#f1f1f1',
  },
})
const followersKey = ref(Math.random())
const updateFollowersTime = () => {
  followersSeries.value = followersFreq.value === 'month' ? props.dataset.followers_gained_monthly?.data : props.dataset.followers_gained_weekly?.data
  followersChartOptions.value.xaxis.categories = followersFreq.value === 'month' ? props.dataset.followers_gained_monthly?.labels : props.dataset.followers_gained_weekly?.labels
  followersKey.value = Math.random()
};

const postingFreq = ref('month')
const postingType = ref('normal')

const videoPostingSeries = ref([]);
const normalPostingSeries = ref([]);

const postingSeries = ref(postingType.value === 'video' ? props.dataset.videos_posting_monthly?.data : props.dataset.normal_posting_monthly?.data);
const postingKey = ref(Math.random())
const postingOptions = ref({
  series: [],
  chart: {
    type: 'bar',
    height: 500,
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '55%',
      endingShape: 'rounded',
    },
  },
  colors: [themeColors.primary, themeColors.info, themeColors.green, themeColors.orange, themeColors.danger, themeColors.warning, themeColors.purple],
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: [1],
    colors: ['transparent'],
  },
  xaxis: {
    categories: postingType.value === 'video' ? props.dataset.videos_posting_monthly?.labels : props.dataset.normal_posting_monthly?.labels,
  },
  fill: {
    opacity: 1,
  },
  legend: {
    position: 'top',
    horizontalAlign: 'center',
  },
  title: {
    text: t('videoPostingAndNormalPosting'),
    align: 'left',
  },
  tooltip: {
    y: {
      formatter: formatters.asKDollar,
    },
  },
})
const updatePostingSeries = () => {
  postingSeries.value = postingType.value === 'video' ? props.dataset.videos_posting_monthly?.data : props.dataset.normal_posting_monthly?.data
  postingOptions.value.xaxis.categories = postingType.value === 'video' ? props.dataset.videos_posting_monthly?.labels : props.dataset.normal_posting_monthly?.labels
  postingKey.value = Math.random()
};


const updatePostingTime = () => {
  postingSeries.value === videoPostingSeries.value
    ? (postingSeries.value = normalPostingSeries.value)
    : (postingSeries.value = videoPostingSeries.value);
};

const interactionFreq = ref('week')
const interactionSeries = ref(interactionFreq.value === 'month' ? props.dataset.monthly_interactions_data.data : props.dataset.weekly_interactions_data.data);
const interactionKey = ref(Math.random())
const interactionChartOptions = ref({
  series: [],
  chart: {
    type: 'bar',
    height: 500,
    stacked: true,
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: true,
    },
  },
  colors: [themeColors.primary, themeColors.info, themeColors.green, themeColors.orange, themeColors.danger, themeColors.warning, themeColors.purple],
  responsive: [
    {
      breakpoint: 480,
      options: {
        legend: {
          position: 'top',
        },
      },
    },
  ],
  plotOptions: {
    bar: {
      horizontal: true,
    },
  },
  xaxis: {
    categories: interactionFreq.value === 'month' ? props.dataset.monthly_interactions_data.labels : props.dataset.weekly_interactions_data.labels,
  },
  title: {
    text: 'Posting Interactions',
    align: 'left',
  },
  legend: {
    position: 'top',
    horizontalAlign: 'center',
  },
  fill: {
    opacity: 1,
  },
})

const updateInteractionTime = () => {
  interactionSeries.value = interactionFreq.value === 'month' ? props.dataset.monthly_interactions_data.data : props.dataset.weekly_interactions_data.data
  interactionChartOptions.value.xaxis.categories = interactionFreq.value === 'month' ? props.dataset.monthly_interactions_data.labels : props.dataset.weekly_interactions_data.labels
  interactionKey.value = Math.random()
};

const engagementFreq = ref('week')
const engagementSeries = ref(engagementFreq.value === 'month' ? props.dataset.best_monthly_engagement_data.data : props.dataset.best_weekly_engagement_data.data);
const engagementKey = ref(Math.random())
const engagementChartOptions = ref({
  series: [
    {
      name: 'Klylie Jenner',
      data: [120, 50, 30, 40, 100, 20],
    },
    {
      name: 'Selena Gomez',
      data: [30, 45, 60, 30, 85, 10],
    },
    {
      name: 'Selena Gomez',
      data: [115, 45, 50, 20, 60, 10],
    },
    {
      name: 'Selena Gomez',
      data: [45, 115, 75, 35, 90, 10],
    },
    {
      name: 'Selena Gomez',
      data: [20, 45, 80, 85, 70, 100],
    },
    {
      name: 'Selena Gomez',
      data: [120, 45, 35, 75, 90, 70],
    },
    {
      name: 'Selena Gomez',
      data: [15, 70, 60, 15, 80, 10],
    }
  ],
  chart: {
    height: 500,
    type: 'radar',
    toolbar: {
      show: false,
    },
  },
  colors: [themeColors.primary, themeColors.info, themeColors.green, themeColors.orange, themeColors.danger, themeColors.warning, themeColors.purple],
  title: {
    text: 'Best Engagement',
  },
  legend: {
    position: 'top',
    horizontalAlign: 'center',
  },
  xaxis: {
    categories: engagementFreq.value === 'month' ? props.dataset.best_monthly_engagement_data.labels : props.dataset.best_weekly_engagement_data.labels,
  },
})

const updateEngagementTime = () => {
  engagementSeries.value = engagementFreq.value === 'month' ? props.dataset.best_monthly_engagement_data.data : props.dataset.best_weekly_engagement_data.data
  engagementChartOptions.value.xaxis.categories = engagementFreq.value === 'month' ? props.dataset.best_monthly_engagement_data.labels : props.dataset.best_weekly_engagement_data.labels
  engagementKey.value = Math.random()
};

const abbrNumber = function (num: number) {
  if (String(num).length < 4) {
    return num;
  } else if (String(num).length < 7) {
    return Math.floor(num / 1000) + "K";
  } else if (String(num).length < 10) {
    return Math.floor(num / 1000000) + "M";
  } else {
    return Math.floor(num / 1000000000) + "B";
  }
};
</script>

<template>
  <div class="columns is-multiline">
    <div class="column is-12">
      <div class="page-content-inner">
        <div class="flex-list-wrapper flex-list-v2">
          <div class="summary-title">{{ t('summary') }}</div>
          <VFlexTable
            v-if="props.competitorsData.length"
            :data="props.competitorsData"
            :columns="columns"
            rounded
          >
            <template #body>
              <TransitionGroup name="list" tag="div" class="flex-list-inner">
                <!--Table item-->
                <div
                    v-for="(item, index) in props.dataset.followers_table"
                    :key="index"
                    class="flex-table-item"
                    :class="index === 0 ? 'main-item' : ''"
                >
                  <VFlexTableCell :column="{ media: true, grow: true }">
                    <VAvatar
                        :picture="item.img_url"
                        size="medium"
                    />
                    <div>
                      <span class="item-name dark-inverted">{{
                          item.user_handle
                        }}</span>
                    </div>
                  </VFlexTableCell>
                  <VFlexTableCell>
                    <span class="light-text">{{
                        item.following_growth
                      }}</span>
                  </VFlexTableCell>
                  <VFlexTableCell>
                    <span class="light-text"
                    >{{ item.post_engagement }}%</span
                    >
                  </VFlexTableCell>
                  <VFlexTableCell>
                    <span class="light-text"
                    >{{ item.posting_growth }}%</span
                    >
                  </VFlexTableCell>
                  <VFlexTableCell>
                    <span class="light-text">{{
                        abbrNumber(item.total_hashtag_posts)
                      }}</span>
                  </VFlexTableCell>
                  <VFlexTableCell :column="{ align: 'end' }">
                    <FlexTableDropdown />
                  </VFlexTableCell>
                </div>
              </TransitionGroup>
            </template>
          </VFlexTable>
          <!--Table Pagination-->
          <!-- <VFlexPagination
            v-if="filteredData.length > 4"
            v-model:current-page="page"
            :item-per-page="3"
            :total-items="filteredData.length + 1"
            :max-links-displayed="2"
            no-router
          /> -->
        </div>
      </div>
    </div>
    <!-- Followers Chart -->
    <div v-if="followersSeries" class="column is-12">
      <div class="dashboard-card has-filter">
        <VField>
          <VControl>
            <span class="select time-select">
              <select v-model="followersFreq" @change="updateFollowersTime()">
                <option value="week">{{ t('week') }}</option>
                <option value="month">{{ t('month') }}</option>
              </select>
            </span>
          </VControl>
        </VField>
        <ApexChart
            :key="followersKey"
            id="multiple-lines"
            :height="followersChartOptions.chart.height"
            :type="followersChartOptions.chart.type"
            :series="followersSeries"
            :options="followersChartOptions"
        >
        </ApexChart>
      </div>
    </div>
    <!-- Posting Chart -->
    <div v-if="postingSeries" class="column is-12">
      <div class="dashboard-card has-filter">
        <VField>
          <VControl>
            <span class="select time-select">
              <select v-model="postingFreq" @change="updatePostingTime()">
                <option value="month">{{ t('month') }}</option>
                <option value="week">{{ t('week') }}</option>
                <option value="day">{{ t('day') }}</option>
              </select>
            </span>
            <span class="select type-select">
              <select v-model="postingType" @change="updatePostingSeries()">
                <option value="video">{{ t('videoPosting') }}</option>
                <option value="normal">{{ t('normalPosting') }}</option>
              </select>
            </span>
          </VControl>
        </VField>
        <ApexChart
            :key="postingKey"
            id="posting-chart"
            :height="postingOptions.chart.height"
            :type="postingOptions.chart.type"
            :series="postingSeries"
            :options="postingOptions"
        >
        </ApexChart>
      </div>
    </div>
    <!-- Interaction Chart -->
    <div class="column is-12">
      <div class="dashboard-card has-filter">
        <VField>
          <VControl>
            <span class="select time-select">
              <select v-model="interactionFreq" @click="updateInteractionTime">
                <option value="week">{{ t('week') }}</option>
                <option value="month">{{ t('month') }}</option>
              </select>
            </span>
          </VControl>
        </VField>
        <ApexChart
            :key="interactionKey"
            id="multiple-bars"
            :height="interactionChartOptions.chart.height"
            :type="interactionChartOptions.chart.type"
            :series="interactionSeries"
            :options="interactionChartOptions"
        >
        </ApexChart>
      </div>
    </div>
    <!-- Best Engagement Chart -->
    <div class="column is-12">
      <div class="dashboard-card has-filter">
        <VField>
          <VControl>
            <span class="select time-select">
              <select v-model="engagementFreq" @click="updateEngagementTime">
                <option value="week">{{ t('week') }}</option>
                <option value="month">{{ t('month') }}</option>
              </select>
            </span>
          </VControl>
        </VField>
        <ApexChart
            :key="engagementKey"
            id="radar-chart"
            :height="engagementChartOptions.chart.height"
            :type="engagementChartOptions.chart.type"
            :series="engagementSeries"
            :options="engagementChartOptions"
        >
        </ApexChart>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import "../../../scss/abstracts/mixins";
.flex-table-item {
  &.main-item {
    background-color: var(--light-blue);
  }
}
.has-top-nav {
  .flex-list-wrapper,
  .list-flex-toolbar {
    max-width: 880px;
    margin-right: auto;
    margin-left: auto;
  }
}
.dashboard-card {
  @include vuero-s-card;

  &:not(:last-child) {
    margin-bottom: 1.5rem;
  }
  &.has-filter {
    position: relative;

    .field {
      position: absolute;
      top: 20px;
      right: 20px;
      z-index: 5;
      .select {
        width: max-content;
        &:first-child {
          margin-right: 10px;
        }
      }
    }
  }
}
.summary-title {
  margin-bottom: 1rem;
  padding-left: 20px;
}
.apexcharts-title-text,
.summary-title {
  font-weight: 700 !important;
  color: var(--dark-text);
}
.flex-table {
  .flex-table-item {
    padding: 8px 20px;
  }
}
.flex-list-inner {
  .flex-table-cell {
    &:not(:first-child) {
      justify-content: center;
    }
    &.cell-end {
      justify-content: right;
    }
  }
}
.flex-table-header {
  span {
    &:not(:first-child) {
      justify-content: center;
    }
    &.cell-end {
      justify-content: right;
    }
  }
}
@media only screen and (max-width: 600px) {
  .dashboard-card {
    &.has-filter {
      .field {
        position: initial;
      }
    }
  }
}
</style>
