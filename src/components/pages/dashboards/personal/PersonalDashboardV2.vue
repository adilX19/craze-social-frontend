<script setup lang="ts">
import ApexChart from 'vue3-apexcharts'
import {onMounted, ref, watch} from 'vue'
import SecurityService from "/@src/services/SecurityService";
import {useUserSession} from "/@src/stores/userSession";
import {useI18n} from "vue-i18n";
import {useStorage} from "@vueuse/core";
import { useThemeColors } from '/@src/composable/useThemeColors'
import axios from 'axios';

const { locale, t } = useI18n()

const defaultLocale = useStorage('locale', navigator?.language || 'en')
watch(locale, () => {
  defaultLocale.value = locale.value
})

const userSession = useUserSession()
const themeColors = useThemeColors()
const isLoading = ref(false)

const tiktok_trends = ref({});
const insta_score_class = ref('');
const tiktok_score_class = ref('');

const greetings = ref('');
const username = ref('');
const score_message = ref('');

const search_engine = ref('tiktok');

const profiles = ref({});
const tiktok_comparisons = ref([]);
const instagram_comparisons = ref([]);
const tracked_list = ref([]);


const score_class_identifier = (score) => {
    if (score == 'Excellent')
        return "purple"
    else if (score == 'Very Good')
        return "green"
    else if (score == 'Good')
        return "green"
    else if (score == 'Average')
        return "orange"
    else
        return "danger"
}

const refineComparisons = (comparisons) => {
    for(var i = 0; i < comparisons.length; i++) {
        comparisons[i]["picture"] = formatLink(comparisons[i]["picture"]);
    }
    return comparisons
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

onMounted(() => {
    isLoading.value = true
    SecurityService.refreshAccessToken().then(function (res: { data: { access: string; }; }) {
        if (res.data.access) {
            useUserSession().setToken(res.data.access)
        }

        SecurityService.getDashboard({}).then(function (response: { data: any }) {
            greetings.value = response.data.greetings;
            username.value = response.data.username;
            score_message.value = response.data.score_message;

            profiles.value = response.data.profile;

            tiktok_comparisons.value = refineComparisons(response.data.comparisons.tiktok);
            instagram_comparisons.value = refineComparisons(response.data.comparisons.instagram);

            tracked_list.value = response.data.tracked_list;
            tiktok_trends.value = response.data.tiktok_trends;

            insta_score_class.value = score_class_identifier(response.data.profile.instagram.score)
            tiktok_score_class.value = score_class_identifier(response.data.profile.tiktok.score)

            console.log("Trends : ", tiktok_trends.value)
            // console.log("Comparisons : ", comparisons.value)
            // console.log("Tracked List : ", tracked_list.value)

            isLoading.value = false

        }).catch(function (error: any) {
            console.log(error)
            isLoading.value = false
        });
    })
    .catch(function (error: any) {
        isLoading.value = false
    });
})
</script>

<template>
    <div
      v-if="isLoading"
      class="is-flex is-justify-content-center h-100 loader-wrap"
    >
        <button class="button loader is-large is-loading">Loading</button>
    </div>
    <div class="personal-dashboard personal-dashboard-v1">

        <div class="dashboard-header">
            <VAvatar
                :picture="`/images/avatars/profile/${userSession.profileImage}`"
                size="big" />
            <div class="start">
                <h3>{{ greetings }}, {{ username }}</h3>
                <p>{{ score_message }}</p>
            </div>
            <div class="end">
            </div>
        </div>

        <div class="dashboard-body">
            <VCard radius="small" elevated style="border-radius: 3px;">
                <h3 class="title is-5 mb-5">Overview</h3>
                <div class="card-grid card-grid-v4 mb-5">
                    <TransitionGroup name="list" tag="div" class="columns is-multiline">

                        <div class="column is-3 insight-card">
                            <a href="#" class="card-grid-item">
                                <VCard radius="small" elevated>
                                    <h3 class="title is-6 mb-4">
                                        <i class="iconify" style="font-size: 16px;" data-icon="feather:user" aria-hidden="true"></i>
                                        Profile Analytics
                                    </h3>
                                    <table class="profile">
                                        <tr>
                                            <td>
                                                <VAvatar
                                                size="small"
                                                :picture="'https://pngfolio.com/images/all_img/copy/1645074099tiktok%20rgb.png'"
                                                />
                                            </td>
                                            <td style="font-size: 12px; line-height: 2rem;">&emsp14; 
                                                <VTag :color="tiktok_score_class" :label="profiles.tiktok.score" curved outlined />
                                            </td>
                                            <td style="font-size: 12px; line-height: 2rem;">&emsp14; ER {{ profiles.tiktok.engagement }}%</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <VAvatar
                                                size="small"
                                                :picture="'https://i.pinimg.com/736x/5e/ff/6c/5eff6c25d920f6a78fda288e6589bf8b.jpg'"
                                                />
                                            </td>
                                            <td style="font-size: 12px; line-height: 2rem;">&emsp14; 
                                                <VTag :color="insta_score_class" :label="profiles.instagram.score" curved outlined />
                                            </td>
                                            <td style="font-size: 12px; line-height: 2rem;">&emsp14; ER {{ profiles.instagram.engagement }}%</td>
                                        </tr>
                                    </table>
                                </VCard>
                            </a>
                        </div>

                        <div class="column is-3 insight-card">
                            <a href="#" class="card-grid-item">
                                <VCard radius="small" elevated>
                                    <h3 class="title is-6 mb-4">
                                        <i class="iconify sidebar-svg" style="font-size: 16px;" data-icon="feather:users" aria-hidden="true"></i>
                                        Comparisons
                                    </h3>
                                    <table class="profile">
                                        <tr>
                                            <td>
                                                <VAvatar
                                                size="small"
                                                :picture="'https://pngfolio.com/images/all_img/copy/1645074099tiktok%20rgb.png'"
                                                />
                                            </td>
                                            <td style="font-size: 12px;">&emsp14; 
                                                <VAvatarStack :avatars="tiktok_comparisons" size="small" />
                                            </td>
                                            <td style="font-size: 12px; line-height: 2rem;">&emsp14; 4/4</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <VAvatar
                                                size="small"
                                                :picture="'https://i.pinimg.com/736x/5e/ff/6c/5eff6c25d920f6a78fda288e6589bf8b.jpg'"
                                                />
                                            </td>
                                            <td style="font-size: 12px;">&emsp14; 
                                                <VAvatarStack :avatars="instagram_comparisons" size="small" />
                                            </td>
                                            <td style="font-size: 12px; line-height: 2rem;">&emsp14; 4/4</td>
                                        </tr>
                                    </table>
                                </VCard>
                            </a>
                        </div>

                        <div class="column is-3 insight-card">
                            <a href="#" class="card-grid-item">
                                <VCard radius="small" elevated>
                                    <h3 class="title is-6 mb-4">
                                        <i class="fas fa-star" aria-hidden="true"></i>
                                        Tracked Influencers
                                    </h3>
                                    <table class="profile">
                                        <tr>
                                            <td>
                                                <VAvatar :picture="formatLink(tracked_list[0].img_url)" size="small" />
                                                &nbsp;
                                                <!-- <span>
                                                    <a style="font-size: 11px;"
                                                        :href="`https://www.instagram.com/${tracked_list[0].username}`"
                                                        target="_blank"
                                                    >
                                                        @{{ tracked_list[0].username }}
                                                    </a> 
                                                </span> -->
                                            </td>
                                            <td>
                                                <VAvatar :picture="formatLink(tracked_list[1].img_url)" size="small" />
                                                &nbsp;
                                                <!-- <span>
                                                    <a style="font-size: 11px;margin-top: -5px;"
                                                        :href="`https://www.instagram.com/${tracked_list[1].username}`"
                                                        target="_blank"
                                                    >
                                                        @{{ tracked_list[1].username }}
                                                    </a> 
                                                </span> -->
                                            </td>
                                            <td>
                                                <VAvatar :picture="formatLink(tracked_list[2].img_url)" size="small" />
                                                &nbsp;
                                                <!-- <span>
                                                    <a style="font-size: 11px;margin-top: -5px;"
                                                        :href="`https://www.instagram.com/${tracked_list[1].username}`"
                                                        target="_blank"
                                                    >
                                                        @{{ tracked_list[1].username }}
                                                    </a> 
                                                </span> -->
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <VAvatar :picture="formatLink(tracked_list[3].img_url)" size="small" />
                                                &nbsp;
                                                <!-- <span>
                                                    <a style="font-size: 11px;margin-top: -5px;"
                                                        :href="`https://www.instagram.com/${tracked_list[2].username}`"
                                                        target="_blank"
                                                    >
                                                        @{{ tracked_list[2].username }}
                                                    </a> 
                                                </span> -->
                                            </td>
                                            <td>
                                                <VAvatar :picture="formatLink(tracked_list[4].img_url)" size="small" />
                                                &nbsp;
                                                <!-- <span>
                                                    <a style="font-size: 11px;margin-top: -5px;"
                                                        :href="`https://www.instagram.com/${tracked_list[3].username}`"
                                                        target="_blank"
                                                    >
                                                        @{{ tracked_list[3].username }}
                                                    </a> 
                                                </span> -->
                                            </td>
                                            <td>
                                                <VAvatar :picture="formatLink(tracked_list[5].img_url)" size="small" />
                                                &nbsp;
                                                <!-- <span>
                                                    <a style="font-size: 11px;margin-top: -5px;"
                                                        :href="`https://www.instagram.com/${tracked_list[3].username}`"
                                                        target="_blank"
                                                    >
                                                        @{{ tracked_list[3].username }}
                                                    </a> 
                                                </span> -->
                                            </td>
                                        </tr>
                                    </table>
                                </VCard>
                            </a>
                        </div>

                        <div class="column is-3 insight-card">
                            <a href="#" class="card-grid-item">
                                <VCard radius="small" elevated>
                                    <h3 class="title is-6 mb-4">
                                        <i class="lnir lnir-idea-alt sidebar-svg" style="font-size: 17px;" aria-hidden="true"></i>
                                        Predictive Analytics
                                    </h3>
                                    <p style="height: 80px;">Comming Soon...</p>
                                </VCard>
                            </a>
                        </div>
                    </TransitionGroup>
                </div>
            </VCard>
            

            <VCard radius="small" elevated style="border-radius: 3px;" class="mt-4">
                <h3 class="title is-5 mb-5">Search</h3>
                <div class="card-grid card-grid-v4 mb-5">
                    <TransitionGroup name="list" tag="div" class="columns is-multiline">
                        <div class="column is-12 insight-card">
                            <div class="card-grid-item">
                                <VCard radius="small" elevated>
                                    <!-- <h3 class="title is-6 mb-4">
                                        <i class="lnir lnir-search sidebar-svg" style="font-size: 16px;" aria-hidden="true"></i>
                                        Search
                                    </h3> -->

                                    <VField addons>
                                        <!-- currency selector with subcontrol -->
                                        <VControl subcontrol>
                                            <div class="select">
                                                <select class="input" v-model="search_engine" name="engine">
                                                    <option value="tiktok">
                                                        Tiktok
                                                    </option>
                                                    <option value="google">
                                                        Google
                                                    </option>
                                                    <option value="bing">
                                                        Bing
                                                    </option>
                                                </select>
                                            </div>
                                        </VControl>

                                        <!-- amount input -->
                                        <VControl expanded>
                                            <input
                                                type="text"
                                                class="input"
                                                placeholder="Search for hashtag, profile, post etc..."
                                            />
                                        </VControl>

                                        <!-- submit -->
                                        <VControl>
                                            <VButton color="primary">Search</VButton>
                                        </VControl>
                                    </VField>
                                </VCard>
                            </div>
                        </div>
                    </TransitionGroup>
                </div>
            </VCard>


            <VCard radius="small" elevated style="border-radius: 3px;" class="mt-4">
                <h3 class="title is-5 mb-5">Trending</h3>
                <div class="card-grid card-grid-v4 mb-5">
                    <TransitionGroup name="list" tag="div" class="columns is-multiline">
                        <div class="column is-6 insight-card">
                            <a href="#" class="card-grid-item">
                                <VCard radius="small" elevated>
                                    <h3 class="title is-6 mb-4">
                                        <i class="iconify" data-icon="feather:trending-up" aria-hidden="true"></i>
                                        Tiktok Trends
                                    </h3>
                                    
                                    <VCard radius="small" elevated v-for="(item, index) in tiktok_trends.trends" :key="index">
                                        <table>
                                            <tr>
                                                <td><VAvatar :picture="formatLink(item.author_image)" size="small"/></td>
                                                <td><a :href="`https://www.tiktok.com/@${item.author_handle}`">@{{ item.author_handle }}</a></td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td></td>
                                                <td>{{ item.caption }}</td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                        </table>
                                        <span>
                                            <i class="iconify" data-icon="feather:thumbs-up" aria-hidden="true"></i>
                                            {{ item.likes_count }}
                                            <i class="iconify" data-icon="feather:message-circle" aria-hidden="true"></i>
                                            {{ item.comments_count }}
                                            <i class="iconify" data-icon="feather:share-2" aria-hidden="true"></i>
                                            {{ item.share_count }}
                                            <i class="iconify" data-icon="feather:download" aria-hidden="true"></i>
                                            {{ item.download_count }}
                                        </span>
                                    </VCard>
                                </VCard>
                            </a>
                        </div>

                        <div class="column is-6 insight-card">
                            <a href="#" class="card-grid-item">
                                <VCard radius="small" elevated>
                                    <h3 class="title is-6 mb-4">
                                        <i class="iconify" data-icon="feather:cloud-snow" aria-hidden="true"></i>
                                        Trends Cloud
                                    </h3>
                                    <p>
                                        <InstagramCloudContainer
                                            :wordcloud-data="tiktok_trends.wordcloud_data"
                                        />
                                    </p>
                                </VCard>
                            </a>
                        </div>
                    </TransitionGroup>
                </div>
            </VCard>
        </div>
    </div>
</template>


<style lang="scss">
@import '../../../../scss/abstracts/mixins';

img.avatar {
    border: 1px solid #ccc;
}

.avatar-stack {
    margin-top: -19px;
    margin-right: 4%;
}

table.profile td {
  padding: 5px;
}

.is-navbar {
  .personal-dashboard {
    margin-top: 30px;
  }
}

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

.card-grid {
  .columns {
    margin-left: -0.5rem !important;
    margin-right: -0.5rem !important;
    margin-top: -0.5rem !important;
  }

  .column {
    padding: 0.5rem !important;
  }
}

.card-grid-v1 {
  .card-grid-item {
    flex: 1;
    display: inline-block;
    width: 100%;
    background-color: var(--white);
    border-radius: 6px;
    border: 1px solid var(--fade-grey-dark-3);
    transition: all 0.3s; // transition-all test

    .card-grid-item-body {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px;
      border-bottom: 1px solid var(--fade-grey-dark-3);

      .left {
        display: flex;
        align-items: center;

        .meta {
          margin-left: 12px;
          line-height: 1.3;

          span {
            display: block;

            &:first-child {
              font-size: 1.1rem;
              font-weight: 600;
              font-family: var(--font-alt);
              color: var(--dark-text);
            }

            &:nth-child(2) {
              font-family: var(--font);
              font-size: 0.85rem;
              color: var(--light-text);
            }
          }
        }
      }

      .right {
        .social-links {
          display: flex;
          align-items: center;
          justify-content: flex-end;

          .social-link {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 32px;
            width: 32px;
            min-width: 32px;
            border-radius: 50%;
            border: 1px solid var(--fade-grey-dark-3);
            margin: 0 4px;
            color: var(--primary);
            box-shadow: var(--light-box-shadow);
            transition: all 0.3s; // transition-all test

            &:hover {
              color: var(--white);
              background: var(--primary);
              border-color: var(--primary);
              box-shadow: var(--primary-box-shadow);
            }

            i {
              font-size: 12px;
            }
          }
        }
      }
    }

    .card-grid-item-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px;

      .left {
        flex-grow: 2;
        max-width: 50%;

        .progress-stats {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;

          span {
            display: block;

            &:first-child {
              font-family: var(--font-alt);
              font-size: 0.9rem;
              font-weight: 600;
              color: var(--dark-text);
            }

            &:nth-child(2) {
              font-size: 0.9rem;
              color: var(--light-text);
            }
          }
        }

        .progress {
          margin-bottom: 0;
        }
      }

      .right {
        .v-button {
          color: var(--light-text);

          &:hover,
          &:focus {
            border-color: var(--primary);
            background: var(--primary);
            color: var(--smoke-white);
            box-shadow: var(--primary-box-shadow);
          }
        }
      }
    }
  }
}

.is-dark {
  .card-grid-v1 {
    .card-grid-item {
      background: var(--dark-sidebar-light-6);
      border-color: var(--dark-sidebar-light-12);

      .card-grid-item-body {
        border-color: var(--dark-sidebar-light-12);

        .left {
          .v-avatar {
            .badge {
              border-color: var(--dark-sidebar-light-6);
            }
          }
        }

        .right {
          .social-links {
            .social-link {
              background: var(--dark-sidebar-light-2);
              border-color: var(--dark-sidebar-light-12);
              color: var(--dark-dark-text);

              &:hover,
              &:focus {
                border-color: var(--primary) !important;
                color: var(--primary) !important;
              }
            }
          }
        }
      }

      .card-grid-item-footer {
        .right {
          .v-button {
            box-shadow: none !important;
          }
        }
      }
    }
  }
}

@media only screen and (max-width: 767px) {
  .card-grid-v1 {
    .card-grid-item {
      .card-grid-item-body {
        flex-direction: column;

        .left {
          flex-direction: column;
          text-align: center;

          .meta {
            margin: 5px 0 20px;
          }
        }
      }
    }
  }
}
</style>
