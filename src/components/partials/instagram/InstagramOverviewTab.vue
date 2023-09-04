<script setup lang="ts">
import { onceImageErrored } from '/@src/utils/via-placeholder'
import ApexChart from "vue3-apexcharts";

import {
  valueSingle,
  optionsSingle,
} from "/@src/data/dashboards/lifestyle-v1/dashboardData";
import {
  creativityRadialOptions,
  engagmentRadialOptions,
  popularityRadialOptions,
} from "/@src/data/dashboards/lifestyle-v1/groupedSocialCharts";
import { reputationChartOptions } from "/@src/data/dashboards/lifestyle-v1/reputationChart";
import { influenceChartOptions } from "/@src/data/dashboards/lifestyle-v1/influenceChart";
import {
  widgetRadialGroup1Options,
  widgetRadialGroup2Options,
  widgetRadialGroup3Options,
} from "/@src/data/widgets/charts/groupedCircleCharts";
import {useI18n} from "vue-i18n";
import {useStorage} from "@vueuse/core";
import {watch} from "vue";

const props = defineProps<{
  customerData: any;
  insightsData: any;
  wordcloudData: any;
}>();

const abbrNumber = function (num: number) {
  if (String(num).length < 4) {
    return num;
  } else if (String(num).length < 7) {
    return Math.floor(num / 1000) + "K";
  } else {
    return Math.floor(num / 1000000) + "M";
  }
};

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
</script>

<template>
  <div id="overview-tab" class="tab-content is-active">
    <div class="body-title">
      <h3>{{ t('instagramStats')}}</h3>
    </div>

    <div class="columns is-multiline is-flex-tablet-p">
      <!--Card-->
      <div class="column is-4 is-half-tablet-p">
        <OverviewCard>
          <div class="card-head">
            <h4>{{ t('contentPosts')}}</h4>
            <VIconBox color="purple" rounded>
              <i aria-hidden="true" class="fab fa-instagram"></i>
            </VIconBox>
          </div>
          <div class="card-metric">
            <span>{{
              abbrNumber(props.customerData?.profile_data.postsCount)
            }}</span>
          </div>
          <div class="card-foot" :class="props.customerData?.insights_data.posting_growth < 0 ? 'is-down' : 'is-up'">
            <span>
              <span>
                <i
                  aria-hidden="true"
                  class="iconify"
                  data-icon="feather:arrow-right"
                ></i>{{ props.customerData?.insights_data.posting_growth }}%</span
              >
              {{ t('less')}} {{ t('thanUsual')}}.
            </span>
          </div>
        </OverviewCard>
      </div>

      <!--Card-->
      <div class="column is-4 is-half-tablet-p">
        <OverviewCard>
          <div class="card-head">
            <h4>{{ t('followers')}}</h4>
            <VIconBox color="primary" rounded>
              <i aria-hidden="true" class="fas fa-users"></i>
            </VIconBox>
          </div>
          <div class="card-metric">
            <span>{{
              abbrNumber(props.customerData?.profile_data.followersCount)
            }}</span>
          </div>
          <div class="card-foot" :class="props.customerData?.insights_data.followers_growth < 0 ? 'is-down' : 'is-up'">
            <span>
              <span>
                <i
                  aria-hidden="true"
                  class="iconify"
                  data-icon="feather:arrow-right"
                ></i>{{ props.customerData?.insights_data.posting_growth }}%</span>
              {{ t('followerGrowth')}}.
            </span>
          </div>
        </OverviewCard>
      </div>

      <!--Card-->
      <div class="column is-4 is-half-tablet-p">
        <OverviewCard>
          <div class="card-head">
            <h4>{{ t('following')}}</h4>
            <VIconBox color="yellow" rounded>
              <i aria-hidden="true" class="fas fa-user-plus"></i>
            </VIconBox>
          </div>
          <div class="card-metric">
            <span>{{
              abbrNumber(props.customerData?.profile_data.followCount)
            }}</span>
          </div>
          <div class="card-foot" :class="props.customerData?.insights_data.following_growth < 0 ? 'is-down' : 'is-up'">
            <span>
              <span>
                <i
                  aria-hidden="true"
                  class="iconify"
                  data-icon="feather:arrow-right"
                ></i>{{ props.customerData?.insights_data.following_growth }}%</span>
              {{ t('followerGrowth')}}.
            </span>
          </div>
        </OverviewCard>
      </div>

      <!--Card-->
      <!--      <div class="column is-4 is-half-tablet-p">-->
      <!--        <OverviewCard>-->
      <!--          <div class="card-head">-->
      <!--            <h4>Likes (30 days)</h4>-->
      <!--            <VIconBox color="red" rounded>-->
      <!--              <i aria-hidden="true" class="fas fa-heart"></i>-->
      <!--            </VIconBox>-->
      <!--          </div>-->
      <!--          <div class="card-metric">-->
      <!--            <span>140.8K</span>-->
      <!--          </div>-->
      <!--          <div class="card-foot is-up">-->
      <!--            <span>-->
      <!--              <span>-->
      <!--                <i aria-hidden="true" class="iconify" data-icon="feather:arrow-right"></i>-->
      <!--                3.6%</span-->
      <!--              >-->
      <!--              likes growth.-->
      <!--            </span>-->
      <!--          </div>-->
      <!--        </OverviewCard>-->
      <!--      </div>-->

      <!--Card-->
      <!--      <div class="column is-4 is-half-tablet-p">-->
      <!--        <OverviewCard>-->
      <!--          <div class="card-head">-->
      <!--            <h4>Comments (30 days)</h4>-->
      <!--            <VIconBox color="yellow" rounded>-->
      <!--              <i aria-hidden="true" class="fas fa-comment"></i>-->
      <!--            </VIconBox>-->
      <!--          </div>-->
      <!--          <div class="card-metric">-->
      <!--            <span>9.3K</span>-->
      <!--          </div>-->
      <!--          <div class="card-foot is-down">-->
      <!--            <span>-->
      <!--              <span>-->
      <!--                <i aria-hidden="true" class="iconify" data-icon="feather:arrow-right"></i>-->
      <!--                -1.1%</span-->
      <!--              >-->
      <!--              less than usual.-->
      <!--            </span>-->
      <!--          </div>-->
      <!--        </OverviewCard>-->
      <!--      </div>-->

      <!--Card-->
      <!--      <div class="column is-4 is-half-tablet-p">-->
      <!--        <OverviewCard>-->
      <!--          <div class="card-head">-->
      <!--            <h4>Profile Views (30 days)</h4>-->
      <!--            <VIconBox color="success" rounded>-->
      <!--              <i aria-hidden="true" class="fas fa-glasses"></i>-->
      <!--            </VIconBox>-->
      <!--          </div>-->
      <!--          <div class="card-metric">-->
      <!--            <span>12.1k</span>-->
      <!--          </div>-->
      <!--          <div class="card-foot is-up">-->
      <!--            <span>-->
      <!--              <span>-->
      <!--                <i aria-hidden="true" class="iconify" data-icon="feather:arrow-right"></i>-->
      <!--                22.7%</span-->
      <!--              >-->
      <!--              more profile views.-->
      <!--            </span>-->
      <!--          </div>-->
      <!--        </OverviewCard>-->
      <!--      </div>-->

      <!--Card-->
      <div class="column is-12 is-full-tablet-p">
        <!--        <div class="stat-widget flex-stat-widget is-straight">-->
        <!--          <div class="chart-media">-->
        <!--            <div class="meta">-->
        <!--              <h4 class="dark-inverted">Reputation Growth</h4>-->
        <!--              <span class="is-dark-primary">+ 2,654</span>-->
        <!--              <p>-->
        <!--                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Bonum integritas-->
        <!--                corporis: misera debilitas. Ita ne hoc quidem modo paria.-->
        <!--              </p>-->
        <!--            </div>-->
        <!--            <div class="chart-container">-->
        <!--              <ApexChart-->
        <!--                id="flex-stat-circle"-->
        <!--                :height="reputationChartOptions.chart.height"-->
        <!--                :type="reputationChartOptions.chart.type"-->
        <!--                :series="reputationChartOptions.series"-->
        <!--                :options="reputationChartOptions"-->
        <!--              >-->
        <!--              </ApexChart>-->
        <!--            </div>-->
        <!--          </div>-->
        <!--        </div>-->

        <!--Grouped Stat Widget-->
        <GroupedStatWidget
          :title="t('socialMetrics')"
          :values="[
            props.customerData?.insights_data.posts_engagement + '%',
            props.customerData?.insights_data.paid_posts_engagement + '%',
            props.customerData?.insights_data.reels_engagement + '%',
          ]"
          :labels="[
            t('postsEngagement'),
            t('paidPostsEngagement'),
            t('reelsEngagement'),
          ]"
        >
          <template #chart1>
            <ApexChart
              id="group-radial-1"
              :height="widgetRadialGroup1Options.chart.height"
              :type="widgetRadialGroup1Options.chart.type"
              :series="
                props.customerData?.insights_data.posts_engagement
                  ? [props.customerData?.insights_data.posts_engagement * 20]
                  : [0]
              "
              :options="widgetRadialGroup1Options"
            >
            </ApexChart>
          </template>
          <template #chart2>
            <ApexChart
              id="group-radial-2"
              :height="widgetRadialGroup2Options.chart.height"
              :type="widgetRadialGroup2Options.chart.type"
              :series="
                props.customerData?.insights_data.paid_posts_engagement
                  ? [
                      props.customerData?.insights_data.paid_posts_engagement *
                        20,
                    ]
                  : [0]
              "
              :options="widgetRadialGroup2Options"
            >
            </ApexChart>
          </template>
          <template #chart3>
            <ApexChart
              id="group-radial-3"
              :height="widgetRadialGroup3Options.chart.height"
              :type="widgetRadialGroup3Options.chart.type"
              :series="
                props.customerData?.insights_data.reels_engagement
                  ? [props.customerData?.insights_data.reels_engagement * 10]
                  : [0]
              "
              :options="widgetRadialGroup3Options"
            >
            </ApexChart>
          </template>
        </GroupedStatWidget>

        <!--Posting hours-->
        <OverviewCard heatmap>
          <div class="card-head">
            <h3 class="dark-inverted">{{ t('postingHabits') }}</h3>
          </div>
          <Heatmap :profile-data="props.customerData?.profile_data" :posting-habit="props.customerData?.insights_data.posting_habits"/>
        </OverviewCard>

        <div class="columns is-multiline mt-3">
          <!--Posts-->
          <div class="column is-4">
            <div class="card v-card">
              <header class="card-header">
                <div class="post-stats">
                  <span>{{ "Most Liked Post" }}</span>
                  <div class="tooltip2" v-if="isLoading !== true">
                    <i class="iconify" data-icon="feather:alert-circle" aria-hidden="true"></i>
                    <span class="tooltiptext">A post from user's post list that has highest likes count.</span>
                  </div>

                  <div class="post-stat">
                    <i aria-hidden="true" class="fas fa-heart text-h-red"></i>
                    <span class="count dark-inverted">
                      {{ abbrNumber(props.customerData?.insights_data.most_liked_post.likes) }}</span>
                  </div>
                </div>
              </header>
              <div class="card-image">
                <figure v-if="props.customerData?.insights_data.most_liked_post.image_url" class="image is-4by3">
<!--                  {{ formatLink(props.customerData?.insights_data.most_liked_post.image_url) }}-->
                  <img
                    :src="formatLink(props.customerData?.insights_data.most_liked_post.image_url)"
                    alt=""
                    @error.once="(event) => onceImageErrored(event, '1280x960')"
                  />
                </figure>
              </div>
            </div>
          </div>
          <!-- src="/demo/photos/30.jpg" -->

          <!--Posts-->
          <div class="column is-4">
            <div class="card v-card">
              <header class="card-header">
                <div class="post-stats">
                  <span>{{ "Most Commented Post" }}</span>
                  <div class="tooltip2" v-if="isLoading !== true">
                    <i class="iconify" data-icon="feather:alert-circle" aria-hidden="true"></i>
                    <span class="tooltiptext">A post from user's post list that has highest comments count.</span>
                  </div>

                  <div class="post-stat">
                    <i
                      aria-hidden="true"
                      class="fas fa-comment text-h-yellow"
                    ></i>
                    <span class="count dark-inverted">{{ abbrNumber(props.customerData?.insights_data.most_commented_post.comments) }}</span>
                  </div>
                </div>
              </header>
              <div class="card-image">
                <figure class="image is-4by3" v-if="formatLink(props.customerData?.insights_data.most_commented_post.link)">
                  <img
                    :src="formatLink(props.customerData?.insights_data.most_commented_post.link)"
                    alt=""
                    @error.once="(event) => onceImageErrored(event, '1280x960')"
                  />
                </figure>
              </div>
            </div>
          </div>

          <!--Posts-->
          <div class="column is-4">
            <div class="card v-card">
              <header class="card-header">
                <div class="post-stats">
                  <span>{{ 'Most Engaging Post' }}</span>
                  <div class="tooltip2" v-if="isLoading !== true">
                    <i class="iconify" data-icon="feather:alert-circle" aria-hidden="true"></i>
                    <span class="tooltiptext">A post from user's post list that has highest engaging rate (percentage).</span>
                  </div>
                  <div class="post-stat">
                    <i
                      aria-hidden="true"
                      class="fas fa-hand-paper text-h-green"
                    ></i>
                    <span class="count dark-inverted">{{ abbrNumber(props.customerData?.insights_data.best_engagement_post.engagement) }}</span>
                  </div>
                </div>
              </header>
              <div class="card-image">
                <figure class="image is-4by3" v-if="formatLink(props.customerData?.insights_data.best_engagement_post.link)">
                  <img
                    :src="formatLink(props.customerData?.insights_data.best_engagement_post.link)"
                    alt=""
                    @error.once="(event) => onceImageErrored(event, '1280x960')"
                  />
                </figure>
              </div>
            </div>
          </div>
        </div>
        <!--Flex Stat Widget-->
        <!--        <FlexStatWidget title="Influence Growth" straight>-->
        <!--          <ApexChart-->
        <!--            id="flex-stat-radial"-->
        <!--            :height="influenceChartOptions.chart.height"-->
        <!--            :type="influenceChartOptions.chart.type"-->
        <!--            :series="influenceChartOptions.series"-->
        <!--            :options="influenceChartOptions"-->
        <!--          >-->
        <!--          </ApexChart>-->
        <!--        </FlexStatWidget>-->
      </div>

      <!--Card-->
      <div class="column is-6 h-hidden-mobile h-hidden-tablet-p">
        <OverviewCard>
          <div class="card-head">
            <h3 class="dark-inverted">{{ t('wordClouds') }}</h3>
          </div>

          <InstagramCloudContainer
            :wordcloud-data="props.customerData?.wordcloud_data"
          />
        </OverviewCard>
      </div>

      <div class="column is-6 h-hidden-mobile h-hidden-tablet-p">
        <OverviewCard>
          <div class="card-head">
            <h3 class="dark-inverted">{{ t('hashtags') }}</h3>
          </div>
          <div class="mt-5">
            <div class="mb-4" :key="index" v-for="(hashtag, index) in props.customerData?.top_hashtags">
              <div class="progress-stats">
                <span class="dark-inverted">#{{ hashtag.hashtag_name }}</span
                >&nbsp;
                <span>{{ hashtag.item_count }}</span>
              </div>
              <div class="progress-bar mt-2">
                <VProgress
                  size="tiny"
                  :value="
                    (hashtag.item_count /
                      props.customerData?.total_hashtag_posts) *
                    100
                  "
                />
              </div>

            </div>
          </div>
          
        </OverviewCard>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.tooltip2 {
  display: inline-block;
  z-index: 2;
  margin-left: 3px;
}

.tooltip2 .tooltiptext {
  visibility: hidden;
  width: 190px;
  background-color: #F8F8F8;
  color: #B0B0B0;
  text-align: center;
  font-size: 13px;
  border-radius: 3px;
  padding: 15px;
  position: absolute;
  left: 50%;
  top: 25px;
  z-index: 1;
  border: 1px solid #ddd;
}

.tooltip2:hover .tooltiptext {
  visibility: visible;
}
</style>