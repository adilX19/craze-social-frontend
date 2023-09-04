<script setup lang="ts">
import { onceImageErrored } from "/@src/utils/via-placeholder";
import * as chartOptions from "/@src/data/dashboards/apex-demo/chartOptions";
import ApexChart from "vue3-apexcharts";
import {useI18n} from "vue-i18n";
import {useStorage} from "@vueuse/core";
import {watch} from "vue";
import {useThemeColors} from "/@src/composable/useThemeColors";
const props = defineProps<{
  customerData: any;
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

const themeColors = useThemeColors()

// const totalChartOptions = {
//   series: [52, 12, 30],
//   chart: {
//     height: 300,
//     type: 'radialBar',
//     toolbar: {
//       show: false,
//     },
//   },
//   colors: [
//     themeColors.primary,
//     themeColors.accent,
//     themeColors.accentLight,
//   ],
//   plotOptions: {
//     radialBar: {
//       dataLabels: {
//         name: {
//           fontSize: '12px'
//         },
//         value: {
//           fontSize: '14px'
//         },
//         total: {
//           show: true,
//           label: 'Craze',
//           formatter: function (/* value: string */) {
//             // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
//             return 'Analytics'
//           },
//         },
//       },
//     },
//   },
//   legend: {
//     show: true,
//     position: 'bottom',
//     horizontalAlignment: 'center'
//   },
//   labels: [t('followers'), t('engagement'), t('postingFreq')],
// }

</script>

<template>
  <div class="dashboard-header-wrapper">
    <div class="dashboard-header">
      <div class="avatar-and-meta">
        <div>
          <VAvatar
            size="xl"
            :picture="formatLink(props.customerData?.profile_data.profilePicture)"
            :badge="props.customerData?.profile_data.badge_icon"
          />
          <!-- <img
            :src="props.customerData?.profile_data.profilePicture"
            alt=""
            @error.once="(event) => onceImageErrored(event, '150x150')"
          />
          <button class="button is-circle">
            <span class="icon is-small">
              <i
                aria-hidden="true"
                class="iconify"
                data-icon="feather:plus"
              ></i>
            </span>
          </button> -->
        </div>
        <div class="header-meta">
          <div class="username-wrap">
            <div class="username">
              <h3>
                <span>{{ props.customerData?.profile_data.fullName }}</span>
                <i aria-hidden="true" class="fas fa-star"></i>
              </h3>
              <a
                :href="props.customerData?.profile_data.userprofileLink"
                target="_blank"
                >@{{ props.customerData?.profile_data.tiktok_userhandle }}</a
              >
            </div>
            <div class="badges">
              <VTag
                rounded
                color="info"
                :label="props.customerData?.profile_data.business_category"
              />
              <!--<VTag rounded color="primary" label="Lifestyle" />-->
            </div>
          </div>
          <div class="meta-stats">
            <div class="meta-stat">
              <span>{{
                abbrNumber(props.customerData?.profile_data.videos_count)
              }}</span>
              <span>Videos</span>
            </div>
            <div class="meta-stat">
              <span>{{
                abbrNumber(props.customerData?.profile_data.followers)
              }}</span>
              <span>Followers</span>
            </div>
            <div class="meta-stat">
              <span>{{
                abbrNumber(props.customerData?.profile_data.followings)
              }}</span>
              <span>Following</span>
            </div>
          </div>
          <div class="meta-description">
            <p>
              {{ props.customerData?.profile_data.biography }}
            </p>
          </div>
          <div class="mt-4">
            <h4>Class: &nbsp; <span style="color: #989898">{{ props.customerData?.profile_data.profile_class }}</span></h4>
          </div>
          <div class="mt-2">
            <h4>
              Account: &nbsp;
              <span style="color: #989898" v-if="props.customerData?.profile_data.is_business_account">Business</span>
              <span style="color: #989898" v-if="!props.customerData?.profile_data.is_business_account">Personal</span>
            </h4>
          </div>
        </div>
      </div>
      <!-- <div class="total-chart">
        <ApexChart
          id="radar-chart"
          :height="totalChartOptions.chart.height"
          :type="totalChartOptions.chart.type"
          :series="totalChartOptions.series"
          :options="totalChartOptions"
        >
        </ApexChart>
      </div> -->
    </div>
  </div>
</template>

<style lang="scss">
.dashboard-header-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  height: 220px;
  margin-bottom: 20px;
  z-index: 1;

  .dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    .avatar-and-meta {
      display: flex;
      .avatar-container {
        position: relative;
        height: 140px;
        width: 140px;
        min-width: 140px;

        img {
          display: block;
          height: 140px;
          width: 140px;
          min-width: 140px;
          border-radius: var(--radius-rounded);
        }

        .button {
          position: absolute;
          bottom: 5px;
          right: 5px;
        }
      }

      .header-meta {
        font-family: var(--font);
        margin-left: 16px;

        .username-wrap {
          display: flex;

          .username {
            h3 {
              font-family: var(--font-alt);
              color: var(--dark-text);
              font-size: 1.2rem;
              font-weight: 700;

              i {
                font-size: 1.2rem;
                margin-left: 5px;
                color: var(--yellow);
              }
            }

            > span {
              color: var(--light-text-dark-5);
            }
          }

          .badges {
            margin-left: 16px;

            .tag {
              margin-right: 0.5rem;
            }
          }
        }

        .meta-stats {
          display: flex;
          padding: 16px 0;

          .meta-stat {
            margin-right: 30px;

            span {
              &:first-child {
                color: var(--dark-text);
                font-size: 1.3rem;
                font-weight: 600;
                margin-right: 0.25rem;
              }

              &:nth-child(2) {
                color: var(--light-text);
              }
            }
          }
        }

        .meta-description {
          max-width: 640px;

          p {
            color: var(--light-text-dark-5);
          }
        }

        .meta-achievements {
          display: flex;
          padding-top: 16px;

          .meta-achievement {
            height: 36px;
            width: 36px;
            min-width: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 3px solid var(--white);
            background: var(--fade-grey);
            border-radius: var(--radius-rounded);
            margin-right: 10px;
            box-shadow: var(--light-box-shadow);

            &.is-primary {
              color: var(--primary);
              background: var(--primary-light-45);
            }

            &.is-yellow {
              color: var(--yellow);
              background: var(--yellow-light-22);
            }

            &.is-danger {
              color: var(--danger);
              background: var(--danger-light-40);
            }
          }
        }
      }
    }

    .total-chart {
      // height: 229px;
      height: 300px;
    }

    .end {
      margin-left: auto;
    }
  }
}

.is-dark {
  .dashboard-header-wrapper {
    .dashboard-header {
      .avatar-and-meta {
        .header-meta {
          .username-wrap {
            .username {
              h3 {
                color: var(--dark-dark-text);
              }
            }
          }

          .meta-stats {
            .meta-stat {
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
@media only screen and (max-width: 991px) {
  .dashboard-header-wrapper {
    height: auto;
    .dashboard-header {
      flex-direction: column;
    }
  }
}

@media only screen and (max-width: 767px) {
  .dashboard-header-wrapper {
    .dashboard-header {
      .avatar-and-meta {
        flex-direction: column;
        .avatar-container {
          margin: 0 auto 10px;
        }

        .header-meta {
          margin-left: 0;
          text-align: center;

          .username-wrap {
            flex-direction: column;

            .badges {
              margin: 10px auto;
            }
          }

          .meta-stats {
            justify-content: center;

            .meta-stat {
              margin: 0 10px;
            }
          }

          .meta-achievements {
            justify-content: center;
            padding-bottom: 16px;
          }
        }
      }

      .end {
        position: absolute;
        right: 0;
      }
    }
  }
}

@media only screen and (min-width: 768px) and (max-width: 991px) {
  .dashboard-header-wrapper {
    .dashboard-header {
      .avatar-and-meta {
        justify-content: center;
      }
    }
  }
}
</style>
