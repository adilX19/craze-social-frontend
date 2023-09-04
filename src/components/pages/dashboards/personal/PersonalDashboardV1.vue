<script setup lang="ts">
import ApexChart from 'vue3-apexcharts'
import {onMounted, ref, watch} from 'vue'
import SecurityService from "/@src/services/SecurityService";
import {useUserSession} from "/@src/stores/userSession";
import {useI18n} from "vue-i18n";
import {useStorage} from "@vueuse/core";

const changePasswordOpen = ref(false);
const instagramFormOpen = ref(false);
const tikTokFormOpen = ref(false);
const connectToProfileFormOpen = ref(false);
const instagramComparisonsFormOpen = ref(false);
const tiktokComparisonsFormOpen = ref(false);

const engagementDescription = "The graph tells the joint engagement of Tiktok & Instagram according to the months.The engagement is percentage of likes & comments on a post in relation with followers."

const isPasswordChangeLoading = ref(false);
const oldPassword = ref('');
const newPassword = ref('');
const changePasswordErrorMessage = ref('')
const changePasswordSuccessMessage = ref('')

const changePassword = () => {
  isPasswordChangeLoading.value = true;
  SecurityService.refreshAccessToken().then(function (res: { data: { access: string; }; }) {
    if (res.data.access) {
      useUserSession().setToken(res.data.access)
    }
    SecurityService.changePassword({
      old_password: oldPassword.value,
      new_password: newPassword.value,
    }).then(function (response: { data: any }) {
      // console.log(response)
      changePasswordErrorMessage.value = ''
      changePasswordSuccessMessage.value = response.data.message
      isPasswordChangeLoading.value = false;
    }).catch(function (error: any) {
          changePasswordErrorMessage.value = error.response.data
          isPasswordChangeLoading.value = false;
        });
  })
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

const dashboard = ref({
  user_monthly_engagement: {
    categories: []
  },
  social_evolution: {
    categories: []
  },
  account_usage: 0,
  profile_image: '',
  loggedin_user: ''
})
const userSession = useUserSession()

const isLoading = ref(false)
const usageKey = ref(Math.random())
const userPlan = ref('')
const usersCount = ref('')

onMounted(() => {
  isLoading.value = true
  SecurityService.refreshAccessToken().then(function (res: { data: { access: string; }; }) {
    if (res.data.access) {
      useUserSession().setToken(res.data.access)
    }
    SecurityService.getDashboard({}).then(function (response: { data: any }) {
      // console.log(response.data)
      dashboard.value = response.data
      userPlan.value = response.data.user_plan
      usersCount.value = response.data.current_users
      userSession.setProfileImage(dashboard.value.profile_image)
      userSession.setUserFullName(dashboard.value.loggedin_user)
      usageKey.value = Math.random()
      isLoading.value = false
    }).catch(function (error: any) {
      isLoading.value = false
      changePasswordErrorMessage.value = error.response.data
    });
  })

})

import { useThemeColors } from '/@src/composable/useThemeColors'
const themeColors = useThemeColors()

const customersOptions = {
  series: [
    {
      name: 'Instagram',
      data: [31, 40, 28, 51, 42, 109, 100],
    },
    {
      name: 'Tiktok',
      data: [11, 32, 45, 32, 34, 52, 41],
    }
  ],
  chart: {
    height: 325,
    type: 'area',
    toolbar: {
      show: false,
    },
  },
  colors: [themeColors.accent, themeColors.info, themeColors.green],
  title: {
    text: 'Engagement',
    align: 'left',
  },
  legend: {
    position: 'top',
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    width: [2, 2, 2],
    curve: 'smooth',
  },
  xaxis: {
    type: 'text',
    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"] //dashboard.value.user_monthly_engagement.categories || [],
  },
  tooltip: {
    // x: {
    //   format: 'dd/MM/yy HH:mm',
    // }
    custom: function({ series, seriesIndex, dataPointIndex, w }) {
      return (
        `
        <div>
          <p style="margin-left: 10px; margin-top: 10px; font-size: 17px;">${w.globals.categoryLabels[dataPointIndex]}</p>
          <p style="margin-top: -8px;">_____________</p>
          <ul style="margin-left: 10px; margin-top: 5px;">
            <li>
              <span>
                <strong>Instagram</strong> : ${series[0][dataPointIndex]}%
              </span>
            </li>
            <li>
              <span>
                <strong>Tiktok</strong> : ${series[1][dataPointIndex]}%
              </span>
            </li>
          </ul>
        </div>
        `
      );
    }
  },
}
const profitChartOptions = {
  series: [
    {
      name: 'Ratio',
      data: [2.3, 3.1, 4.0, 10.1, 4.0],
    },
  ],
  chart: {
    height: 265,
    type: 'bar',
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    bar: {
      dataLabels: {
        position: 'top', // top, center, bottom
      },
    },
  },
  dataLabels: {
    enabled: true,
    formatter: function (val: string) {
      return val + '%'
    },
    offsetY: -20,
    style: {
      fontSize: '12px',
      colors: ['#304758'],
    },
  },
  xaxis: {
    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"], // dashboard.value.social_evolution.categories || [],
    position: 'top',
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    crosshairs: {
      fill: {
        type: 'gradient',
        gradient: {
          colorFrom: '#D8E3F0',
          colorTo: '#BED1E6',
          stops: [0, 100],
          opacityFrom: 0.4,
          opacityTo: 0.5,
        },
      },
    },
    tooltip: {
      enabled: true,
    },
  },
  yaxis: {
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    labels: {
      show: false,
      formatter: function (val: string) {
        return val + '%'
      },
    },
  },
  colors: [themeColors.primary, themeColors.secondary, themeColors.orange],
  title: {
    text: 'Social Evolution',
    align: 'left',
  },
}
const teamGaugeOptions = {
  series: [76],
  title: {
    text: t('accountUsage')
  },
  chart: {
    height: 410,
    type: 'radialBar',
    sparkline: {
      enabled: true,
    },
    toolbar: {
      show: false,
    },
  },
  colors: [
    themeColors.accent,
    themeColors.secondary,
    themeColors.orange,
    themeColors.purple,
    themeColors.info,
  ],
  plotOptions: {
    radialBar: {
      startAngle: -90,
      endAngle: 90,
      track: {
        background: '#e7e7e7',
        strokeWidth: '97%',
        margin: 5, // margin is in pixels
        dropShadow: {
          enabled: false,
          top: 2,
          left: 0,
          color: '#999',
          opacity: 1,
          blur: 2,
        },
      },
      dataLabels: {
        name: {
          show: false,
        },
        value: {
          offsetY: -2,
          fontSize: '22px',
        },
      },
    },
  },
  grid: {
    padding: {
      top: 80,
    },
  },
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'light',
      shadeIntensity: 0.1,
      inverseColors: false,
      opacityFrom: 1,
      opacityTo: 1,
      stops: [0, 50, 53, 91],
    },
  },
  labels: [t('averageResults')],
}
</script>

<template>
  <div
      v-if="isLoading"
      class="is-flex is-justify-content-center h-100 loader-wrap"
  >
    <button class="button loader is-large is-loading">Loading</button>
  </div>
  <div class="personal-dashboard personal-dashboard-v1">
    <!--Personal Dashboard V1-->
    <!--Header-->
    <div class="dashboard-header">
      <VAvatar
          :picture="`/images/avatars/profile/${userSession.profileImage}`"
          size="large" />
      <div class="start">
        <h3>{{ t('welcomeBack') }}, {{ userSession.userFullName }}</h3>
        <p>
          You are using <b>{{ userPlan == 'pro' ? 'PRO': 'BASIC' }}</b> Plan. Currenly {{ usersCount }} {{ usersCount > 1 ? 'people are' : 'person is' }} logged-in to your account.
        </p>
      </div>
      <div class="end">
      </div>
    </div>

    <!--Body-->
    <div class="dashboard-body">
      <div class="columns is-multiline">
        <!--Card-->
        <div class="column is-6">
          <div class="dashboard-card has-fullheight">
            <div class="is-flex is-justify-content-space-between is-align-items-center mb-2">
              <h4 class="dark-inverted">{{ t('accountSettings')}}</h4>
              <VButton
                  v-if="dashboard.is_new_user"
                  color="primary"
                  bold elevated
                  icon="feather:plus-circle"
                  @click="connectToProfileFormOpen = true"
              >
                {{ t('connectProfiles')}}
              </VButton>
            </div>
<!--            <p>Connect to your profiles to start</p>-->

            <div class="quick-stats">
              <div class="quick-stats-inner">
                <!--Instagram profile-->
                <div v-if="dashboard.is_instagram_connected" class="quick-stat">
                  <VBlock
                      :title="dashboard.customer_insta_handle"
                      :subtitle="t('instagramProfile')"
                      center
                      m-responsive
                      t-responsive
                  >
                    <template #icon>
                      <VIconBox color="red" rounded>
                        <i aria-hidden="true" class="lnil lnil-Instagram"></i>
                      </VIconBox>
                    </template>
                  </VBlock>
                </div>
                <!-- Tiktok profile-->
                <div v-if="dashboard.is_tiktok_connected" class="quick-stat">
                  <VBlock
                      :title="dashboard.customer_tiktok_handle"
                      :subtitle="t('tiktokProfile')"
                      center
                      m-responsive
                      t-responsive
                  >
                    <template #icon>
                      <VIconBox color="primary" rounded>
                        <img
                            :style="{ width: '19.6px'}"
                            src="/images/icons/logos/tiktok-black.svg"
                        />
                      </VIconBox>
                    </template>
                  </VBlock>
                </div>
                <!-- instagram comparisons form open-->
                <div v-if="dashboard.is_instagram_connected" class="quick-stat">
                  <div
                      class="is-flex is-align-items-center is-flex-direction-column is-justify-content-space-between has-fullheight"
                  >
                    <VBlock
                        :title="`${dashboard.insta_active} active`"
                        :subtitle="t('instagramComparisons')"
                        center
                        m-responsive
                        t-responsive
                        class="mb-1"
                    >
                      <template #icon>
                        <VIconBox color="red" rounded>
                          <i aria-hidden="true" class="lnil lnil-Instagram"></i>
                        </VIconBox>
                      </template>
                    </VBlock>
                    <VButton
                        size="small"
                        color="default"
                        icon="feather:eye"
                        class="is-ghost"
                        @click="instagramComparisonsFormOpen = true"
                    >
                      {{ t('viewComparisons') }}
                    </VButton>
                  </div>
                </div>
                <!-- tiktok comparisons form open-->
                <div v-if="dashboard.is_tiktok_connected" class="quick-stat">
                  <div
                      class="is-flex is-align-items-center is-flex-direction-column is-justify-content-space-between has-fullheight"
                  >
                    <VBlock
                        :title="`${dashboard.tiktok_active} active`"
                        :subtitle="t('tiktokComparisons')"
                        center
                        m-responsive
                        t-responsive
                        class="mb-1"
                    >
                      <template #icon>
                        <VIconBox color="primary" rounded>
                          <img
                              :style="{ width: '19.6px'}"
                              src="/images/icons/logos/tiktok-black.svg"
                          />
                        </VIconBox>
                      </template>
                    </VBlock>
                    <VButton
                        size="small"
                        color="default"
                        icon="feather:eye"
                        class="is-ghost"
                        @click="tiktokComparisonsFormOpen = true"
                    >
                      {{ t('viewComparisons') }}
                    </VButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--Card-->
        <div class="column is-6">
          
          <div class="tooltip" v-if="isLoading !== true">
            <i class="iconify" data-icon="feather:alert-circle" aria-hidden="true"></i>
            <span class="tooltiptext">{{ engagementDescription }}</span>
          </div>

          <div class="dashboard-card has-fullheight">
            <ApexChart
                v-if="dashboard.user_monthly_engagement.categories.length > 0"
              :height="customersOptions.chart.height"
              :type="customersOptions.chart.type"
              :series="dashboard.user_monthly_engagement.data"
              :options="customersOptions"
            >
            </ApexChart>
          </div>
        </div>

        <!--Card-->
        <div class="column is-4">
          <div class="dashboard-card is-upgrade has-fullheight">
            <i aria-hidden="true" class="lnil lnil-crown-alt-1"></i>
            <div class="cta-content">
              <h4>{{ userSession.userFullName }}, you're doing great.</h4>
              <p v-if="userPlan == 'individual'" class="white-text">upgrade now to a professional plan and enjoy integration with Teams, Slack, Google Drive, One Drive and many other Apps.</p>
              <p v-if="userPlan == 'pro'" class="white-text">Hope you are enjoying the Pro version</p>
              <router-link :to="{ name: 'app-plan' }" class="link inverted-text">Learn More</router-link>
            </div>
          </div>
        </div>

        <!--Card-->
        <div class="column is-4">
          <div class="dashboard-card is-gauge has-fullheight">
            <div class="is-flex is-align-items-center">
              <h4 class="mr-2">{{ t('lastLogin') }}:</h4>
              <small>{{ dashboard.last_login_date }}</small>
            </div>
            <ApexChart
                v-if="dashboard"
                :key="usageKey"
                :height="teamGaugeOptions.chart.height"
                :type="teamGaugeOptions.chart.type"
                :series="[dashboard.account_usage]"
                :options="teamGaugeOptions"
            >
            </ApexChart>
          </div>
        </div>

        <!--Card-->
        <div class="column is-4">
          <div class="dashboard-card has-fullheight">

            <div class="tooltip2" v-if="isLoading !== true">
              <i class="iconify" data-icon="feather:alert-circle" aria-hidden="true"></i>
              <span class="tooltiptext">This tells you the average of tiktok & instagram engagements from previous month to the next month.</span>
            </div>

            <ApexChart
                v-if="dashboard.social_evolution.categories.length > 0"
              :height="profitChartOptions.chart.height"
              :type="profitChartOptions.chart.type"
              :series="dashboard.social_evolution.data"
              :options="profitChartOptions"
            >
            </ApexChart>
          </div>
        </div>
      </div>
    </div>
  </div>


  <VModal
      :open="connectToProfileFormOpen"
      :title="t('connectProfiles')"
      size="large"
      actions="right"
      hideFooter
      :cancel-label="t('cancel')"
      @close="(connectToProfileFormOpen = false)"
  >
    <template #content>
      <form class="modal-form">
        <div class="columns is-mobile has-background-primary-light">
          <div class="column">
            <VCard radius="small" class="vcard-style">
              <div
                  class="is-flex is-flex-direction-column is-align-items-center"
              >
                <div class="inst-icon mt-1">
                  <i
                      aria-hidden="true"
                      class="iconify"
                      style="width: 20px; height: 20px;"
                      data-icon="feather:instagram"
                  ></i>
                </div>
                <p class="mb-3 is-uppercase">{{ t('instagram')}}</p>
                <VButton
                    class="has-background-primary-light"
                    bold
                    @click="(instagramFormOpen = true), (connectToProfileFormOpen = false)"
                >
                  {{ t('connect')}}
                </VButton>
              </div>
            </VCard>
          </div>
          <div class="column">
            <VCard radius="small" class="vcard-style">
              <div
                  class="is-flex is-flex-direction-column is-align-items-center"
              >
                <div>
                  <img
                      :style="{width: '20px'}"
                      src="/images/icons/logos/tiktok-black.svg"
                  />
                </div>
                <p class="mb-3 is-uppercase">{{ t('tiktok')}}</p>
                <VButton
                    class="has-background-primary-light"
                    bold
                    @click="(tikTokFormOpen = true), (connectToProfileFormOpen = false)"
                >
                  {{ t('connect')}}
                </VButton>
              </div>
            </VCard>
          </div>
        </div>
      </form>
    </template>
  </VModal>

  <VModal
      :open="instagramFormOpen"
      :title="t('connectToInstagram')"
      size="small"
      actions="right"
      :cancel-label="t('cancel')"
      @close="(instagramFormOpen = false), (connectToProfileFormOpen = true)"
  >
    <template #content>
      <form class="modal-form">
        <div class="mb-2"><p>{{ t('connectToYourProfile') }}</p></div>
        <!-- username -->
        <VField>
          <VControl icon="feather:user">
            <input
                class="input"
                type="text"
                :placeholder="t('username')"
                autocomplete="username"
            />
          </VControl>
        </VField>

        <!-- Password -->
        <VField>
          <VControl icon="feather:lock">
            <input
                class="input"
                type="password"
                :placeholder="t('password')"
                autocomplete="current-password"
            />
          </VControl>
        </VField>
        <div class="mb-2 mt-5"><p>{{ t('comparisonProfiles')}}</p></div>
        <VField>
          <VControl icon="feather:user-plus">
            <input
                class="input"
                type="text"
                :placeholder="t('firstComparison')"
            />
          </VControl>
        </VField>
        <VField>
          <VControl icon="feather:user-plus">
            <input
                class="input"
                type="text"
                :placeholder="t('secondComparison')"
            />
          </VControl>
        </VField>
        <VField>
          <VControl icon="feather:user-plus">
            <input
                class="input"
                type="text"
                :placeholder="t('thirdComparison')"
            />
          </VControl>
        </VField>
        <VField>
          <VControl icon="feather:user-plus">
            <input
                class="input"
                type="text"
                :placeholder="t('fourthComparison')"
            />
          </VControl>
        </VField>
      </form>
    </template>
    <template #action>
      <VButton color="primary" raised>{{ t('connect') }}</VButton>
    </template>
  </VModal>

  <VModal
      :open="tikTokFormOpen"
      :title="t('connectToTiktok')"
      size="small"
      actions="right"
      :cancel-label="t('cancel')"
      @close="(tikTokFormOpen = false), (connectToProfileFormOpen = true)"
  >
    <template #content>
      <form class="modal-form">
        <div class="mb-2"><p>{{ t('connectToYourProfile') }}</p></div>
        <!-- username -->
        <VField>
          <VControl icon="feather:user">
            <input
                class="input"
                type="text"
                :placeholder="t('username')"
                autocomplete="username"
            />
          </VControl>
        </VField>

        <!-- Password -->
        <VField>
          <VControl icon="feather:lock">
            <input
                class="input"
                type="password"
                :placeholder="t('password')"
                autocomplete="current-password"
            />
          </VControl>
        </VField>
        <div class="mb-2 mt-5"><p>{{ t('comparisonProfiles')}}</p></div>
        <VField>
          <VControl icon="feather:user-plus">
            <input
                class="input"
                type="text"
                :placeholder="t('firstComparison')"
            />
          </VControl>
        </VField>
        <VField>
          <VControl icon="feather:user-plus">
            <input
                class="input"
                type="text"
                :placeholder="t('secondComparison')"
            />
          </VControl>
        </VField>
        <VField>
          <VControl icon="feather:user-plus">
            <input
                class="input"
                type="text"
                :placeholder="t('thirdComparison')"
            />
          </VControl>
        </VField>
        <VField>
          <VControl icon="feather:user-plus">
            <input
                class="input"
                type="text"
                :placeholder="t('fourthComparison')"
            />
          </VControl>
        </VField>
      </form>
    </template>
    <template #action>
      <VButton color="primary" raised>Connect</VButton>
    </template>
  </VModal>

  <VModal
      :open="changePasswordOpen"
      :title="t('changePassword')"
      size="small"
      actions="right"
      :cancel-label="t('cancel')"
      @close="(changePasswordOpen = false)"
  >
    <template #content>
      <form class="modal-form">
        <div v-if="changePasswordErrorMessage" class="notification is-danger">
          <button @click="changePasswordErrorMessage = ''" class="delete"></button>
          {{ changePasswordErrorMessage }}
        </div>
        <div v-if="changePasswordSuccessMessage" class="notification is-success">
          <button @click="changePasswordSuccessMessage = ''" class="delete"></button>
          {{ changePasswordSuccessMessage }}
        </div>
        <!-- old password -->
        <VField>
          <VControl icon="feather:lock" :loading="isPasswordChangeLoading">
            <input
                v-model="oldPassword"
                :disabled="isPasswordChangeLoading"
                class="input"
                type="password"
                :placeholder="t('oldPassword')"
            />
          </VControl>
        </VField>

        <!-- New Password -->
        <VField>
          <VControl icon="feather:lock" :loading="isPasswordChangeLoading">
            <input
                v-model="newPassword"
                :disabled="isPasswordChangeLoading"
                class="input"
                type="password"
                :placeholder="t('newPassword')"
            />
          </VControl>
        </VField>
      </form>
    </template>
    <template #action>
      <VButton color="primary" raised :disabled="isPasswordChangeLoading" :loading="isPasswordChangeLoading" @click="changePassword">{{ t('submit') }}</VButton>
    </template>
  </VModal>

  <VModal
      :open="tiktokComparisonsFormOpen"
      :title="t('tiktokComparisons')"
      size="small"
      actions="right"
      hideFooter
      :cancel-label="t('cancel')"
      @close="tiktokComparisonsFormOpen = false"
  >
    <template #content>
      <form class="modal-form">
        <div class="columns is-mobile has-background-primary-light">
          <div class="column">
            <VCard radius="small" class="vcard-style">
              <div class="quick-stat">
                <div class="dashboard-card">
                  <div>
                    <ul class="user-list">
                      <li v-for="(comparison, compIndex) in dashboard.tiktok_competitors" :key="`tiktok-comparison-${compIndex}`">
                        <div class="user-list-info">
                          <div class="name dark-inverted">
                            {{ comparison }}
                          </div>
                          <div class="position">{{ comparison }}</div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </VCard>
          </div>
        </div>
      </form>
    </template>
  </VModal>
  <VModal
      :open="instagramComparisonsFormOpen"
      :title="t('instagramComparisons')"
      size="small"
      actions="right"
      hideFooter
      :cancel-label="t('cancel')"
      @close="instagramComparisonsFormOpen = false"
  >
    <template #content>
      <form class="modal-form">
        <div class="columns is-mobile has-background-primary-light">
          <div class="column">
            <VCard radius="small" class="vcard-style">
              <div class="quick-stat">
                <div class="dashboard-card">
                  <div>
                    <ul class="user-list">
                      <li v-for="(comparison, compIndex) in dashboard.insta_competitors" :key="`insta-comparison-${compIndex}`">
                        <div class="user-list-info">
                          <div class="name dark-inverted">
                            {{ comparison }}
                          </div>
                          <div class="position">{{ comparison }}</div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </VCard>
          </div>
        </div>
      </form>
    </template>
  </VModal>
</template>

<style lang="scss">
@import '../../../../scss/abstracts/mixins';

.is-navbar {
  .personal-dashboard {
    margin-top: 30px;
  }
}

.tooltip {
  position: absolute;
  display: inline-block;
  top: 132px;
  right: 2%;
  z-index: 2;
}

.tooltip2 {
  position: absolute;
  display: inline-block;
  top: 560px;
  right: 2%;
  z-index: 2;
}

.tooltip .tooltiptext, .tooltip2 .tooltiptext {
  visibility: hidden;
  width: 190px;
  background-color: #F8F8F8;
  color: #B0B0B0;
  text-align: center;
  font-size: 13px;
  border-radius: 3px;
  padding: 15px;
  position: absolute;
  right: 35%;
  z-index: 1;
  border: 1px solid #ddd;
}

.tooltip:hover .tooltiptext, .tooltip2:hover .tooltiptext {
  visibility: visible;
}

/* .engagement_graph_details {
  position: absolute;
  top: 125px;
  right: 10px;
  color: #ddd;
  white-space: pre-line;
} */

.personal-dashboard-v1 {
  .dashboard-header {
    display: flex;
    align-items: center;
    font-family: var(--font);
    margin-bottom: 30px;

    .start {
      margin-left: 12px;

      h3 {
        font-family: var(--font-alt);
        font-weight: 600;
        font-size: 1.3rem;
        color: var(--dark-text);
      }
    }

    .end {
      margin-left: auto;
      display: flex;
      justify-content: flex-end;

      .button {
        margin-left: 10px;
      }
    }
  }

  .dashboard-body {
    .dashboard-card {
      @include vuero-s-card;

      font-family: var(--font);

      > h4,
      .ApexCharts-title-text {
        font-family: var(--font-alt);
        font-size: 1rem;
        font-weight: 600;
        color: var(--dark-text);
        margin-bottom: 12px;
      }

      .quick-stats {
        .quick-stats-inner {
          display: flex;
          flex-wrap: wrap;
          margin-left: -8px;
          margin-right: -8px;

          .quick-stat {
            width: calc(50% - 16px);
            padding: 40px 20px;
            background: var(--widget-grey);
            margin: 8px;
            border-radius: var(--radius-large);
            transition: all 0.3s; // transition-all test

            ::v-deep(.media-flex-center) {
              .flex-meta {
                span {
                  &:first-child {
                    font-size: 1.4rem;
                    font-weight: 600;
                    color: var(--dark-text);
                  }
                }
              }
            }
          }
        }
      }
    }

    .dashboard-card {
      &.is-upgrade {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        background: var(--primary-light-8);
        border-color: var(--primary-light-8);
        padding: 20px 40px;
        min-height: 320px;
        border-radius: var(--radius-large);
        box-shadow: var(--primary-box-shadow);

        .lnil,
        .lnir {
          position: absolute;
          bottom: 1rem;
          right: 1rem;
          font-size: 4rem;
          opacity: 0.3;
        }

        .cta-content {
          text-align: center;

          h4 {
            font-family: var(--font-alt);
            font-weight: 600;
            font-size: 1.2rem;
            color: var(--smoke-white);
            margin-bottom: 8px;
          }
        }

        .link {
          display: block;
          font-family: var(--font-alt);
          font-weight: 500;
          margin-top: 0.5rem;

          &:hover,
          &:focus {
            color: var(--smoke-white);
            opacity: 0.6;
          }
        }
      }

      &.is-gauge {
        position: relative;

        .people {
          position: absolute;
          top: 80px;
          left: 0;
          right: 0;
          margin: 0 auto;
          display: flex;
          justify-content: center;
          z-index: 5;

          .v-avatar {
            margin: 0 4px;
          }
        }
      }
    }
  }
}

.is-dark {
  .personal-dashboard-v1 {
    .dashboard-header {
      .start {
        h3 {
          color: var(--dark-dark-text);
        }
      }
    }

    .dashboard-body {
      .dashboard-card {
        @include vuero-card--dark;

        &.is-upgrade {
          background: var(--primary);
          border-color: var(--primary);
          box-shadow: var(--primary-box-shadow);
        }

        .quick-stats {
          .quick-stats-inner {
            .quick-stat {
              background: var(--dark-sidebar-light-2);
              border: 1px solid var(--dark-sidebar-light-12);

              .media-flex-center {
                .flex-meta {
                  span {
                    &:first-child {
                      color: var(--dark-dark-text);
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

@media only screen and (max-width: 767px) {
  .personal-dashboard-v1 {
    .dashboard-header {
      text-align: center;
      flex-direction: column;

      .start {
        margin: 10px auto;
      }

      .end {
        margin: 0;
        justify-content: space-between;
      }
    }

    .dashboard-body {
      .dashboard-card {
        .quick-stats {
          .quick-stats-inner {
            .quick-stat {
              padding: 20px;

              .media-flex-center {
                flex-direction: column;

                .flex-meta {
                  margin: 10px 0;
                  text-align: center;
                }
              }
            }
          }
        }
      }
    }
  }
}

@media only screen and (min-width: 768px) and (max-width: 1024px) and (orientation: landscape) {
  .personal-dashboard-v1 {
    .dashboard-body {
      .dashboard-card {
        .quick-stats {
          .quick-stats-inner {
            .quick-stat {
              padding: 20px;

              .media-flex-center {
                flex-direction: column;

                .flex-meta {
                  margin: 2px 0 0;
                  text-align: center;
                }
              }
            }
          }
        }
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
