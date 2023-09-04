<script setup lang="ts">
import {computed, onBeforeUnmount, onMounted, ref, watch} from "vue";
import {useI18n} from "vue-i18n";
import {useStorage} from "@vueuse/core";
import InstagramCloudContainer from "/@src/components/partials/instagram/InstagramCloudContainer.vue";

const filters = ref("");
const isHashtagModalOpen = ref(false);
const isWordCloudModalOpen = ref(false);

const props = defineProps<{
  customerData: any;
  insightsData: any;
  wordcloudData: any;
  competitorsData: any;
}>();


console.log("Props in Comparisons", props.competitorsData);

const currentCompetitor = ref(props.competitorsData[0])

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

const updateCurrentCompetitor = function (index: number) {
  currentCompetitor.value = props.competitorsData[index];
};

const valueSingle = ref(0);
const optionsSingle = [
  "All",
  "UI/UX Design",
  "Web Development",
  "Software Eng.",
  "Business",
];

const handleOnScroll  = () => {
  var mainElement = document.getElementById('mainCard')

  var colWrap = document.getElementById('colWrap')
  var item0 = document.getElementById('item0')
  var cardPerRow = Math.round(colWrap!.offsetWidth / item0!.offsetWidth)
  var total = props.competitorsData.length || 0

  for (var i = 0; i < total; i+=cardPerRow) {
    var item = document.getElementById('item' + i)
    if (item && (i / cardPerRow) !== Math.ceil(total / cardPerRow) - 1) {
      var itemTop = item!.getBoundingClientRect().top // + window.scrollY
      if (itemTop <= 0) {
        mainElement!.style.marginTop = item!.offsetHeight * ((i / cardPerRow) + 1) + 'px'
      } else {
        mainElement!.style.marginTop = item!.offsetHeight * ((i / cardPerRow)) + 'px'
        break
      }
    }
  }
}

onMounted(() => {
  window.addEventListener("scroll", handleOnScroll)
  let BootstrapScript = document.createElement('link')
  BootstrapScript.setAttribute('href', 'https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css');
  document.head.appendChild(BootstrapScript)
})

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleOnScroll)
})

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

</script>

<template>
  <div class="card-grid card-grid-v1">
    <div class="columns">
      <div class="column is-one-third-tablet is-one-quarter-desktop">
        <div id="mainCard" class="card-grid-item is-sticky my-card margin-top-0">
          <div class="card-grid-item-body">
            <div class="item">
              <VAvatar
                size="big"
                :picture="formatLink(props.customerData?.profile_data.profilePicture)"
                :badge="props.customerData?.profile_data.badge_icon"
              />
              <div class="meta">
                <span class="dark-inverted">{{
                  props.customerData?.profile_data.fullName
                }}</span>
                <a
                  target="_blank"
                  :href="props.customerData?.profile_data.userInstaLink"
                  >@{{ props.customerData?.profile_data.insta_userhandle }}</a
                >
              </div>
            </div>
          </div>
          <div class="card-grid-item-footer">

            <div class="item">
              <div class="left">
                <div class="account-stats">
                  <span class="dark-inverted">{{ 'Category' }}</span>
                </div>
              </div>
              <div class="right">
                <span v-if="props.customerData?.profile_data.is_business_account">{{
                  props.customerData?.profile_data.business_category
                }}</span>
                <span v-else>{{
                  props.customerData?.profile_data.category
                }}</span>
              </div>
            </div>

            <div class="item">
              <div class="left">
                <div class="account-stats">
                  <span class="dark-inverted">{{ 'Profile Score' }}</span>
                </div>
              </div>
              <div class="right">
                <span>{{
                  props.customerData?.profile_data.profile_score
                }}</span>
              </div>
            </div>

            <div class="item">
              <div class="left">
                <div class="account-stats">
                  <span class="dark-inverted">{{ 'Engagement Rate' }}</span>
                </div>
              </div>
              <div class="right">
                <span
                  >{{
                    props.customerData?.insights_data.posts_engagement
                  }}%</span
                >
              </div>
            </div>

            <div class="item">
              <div class="left">
                <div class="account-stats">
                  <span class="dark-inverted">{{ t('followers') }}</span>
                </div>
              </div>
              <div class="right">
                <span>{{
                  abbrNumber(props.customerData?.profile_data.followersCount)
                }}</span>
              </div>
            </div>

            <div class="item">
              <div class="left">
                <div class="account-stats">
                  <span class="dark-inverted">{{ t('followings') }}</span>
                </div>
              </div>
              <div class="right">
                <span>{{
                  abbrNumber(props.customerData?.profile_data.followCount)
                }}</span>
              </div>
            </div>
            <div class="item">
              <div class="left">
                <div class="account-stats">
                  <span class="dark-inverted">{{ t('posts') }}</span>
                </div>
              </div>
              <div class="right">
                <span>{{ props.customerData?.profile_data.postsCount }}</span>
              </div>
            </div>
            <!-- <div class="item">
              <div class="left">
                <div class="account-stats">
                  <span class="dark-inverted">{{ t('paidPostsEngagement') }}</span>
                </div>
              </div>
              <div class="right">
                <span
                  >{{
                    props.customerData?.insights_data.paid_posts_engagement
                  }}%</span
                >
              </div>
            </div> -->
            <div class="item">
              <div class="left">
                <div class="account-stats">
                  <span class="dark-inverted">{{ t('reelsEngagement') }}</span>
                </div>
              </div>
              <div class="right">
                <span
                  >{{
                    props.customerData?.insights_data.reels_engagement
                  }}%</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="column is-two-thirds-tablet is-three-quarters-desktop">
        <!--Card Grid v1-->
        <TransitionGroup name="list" tag="div" id="colWrap" class="columns is-multiline col-wrap">
          <!--Grid item-->
          <div
            v-for="(item, index) in props.competitorsData"
            :key="index"
            class="column is-half-tablet is-one-third-desktop"
            :id="`item${index}`"
          >
            <div class="card-grid-item">
              <div class="card-grid-item-body">
                <div class="item">
                  <VAvatar
                    size="big"
                    :picture="formatLink(item.profile_data.profilePicture)"
                    :badge="props.customerData?.profile_data.badge_icon"
                  />
                  <div class="meta">
                    <span class="dark-inverted">{{
                      item.profile_data.fullName
                    }}</span>
                    <a
                      target="_blank"
                      :href="item.profile_data.userInstaLink"
                      >@{{ item.profile_data.insta_userhandle }}</a
                    >
                  </div>
                </div>
              </div>
              <div class="card-grid-item-footer">

                <div class="item">
                  <div class="left">
                    <div class="account-stats">
                      <span class="dark-inverted">{{ 'Category' }}</span>
                    </div>
                  </div>
                  <div class="right">
                    <span v-if="item.profile_data.is_business_account">{{
                      item.profile_data.business_category
                    }}</span>
                    <span v-else>{{
                      item.profile_data.category
                    }}</span>
                  </div>
                </div>

                <div class="item">
                  <div class="left">
                    <div class="account-stats">
                      <span class="dark-inverted">{{ 'Profile Score' }}</span>
                    </div>
                  </div>
                  <div class="right">
                    <span>{{
                      item.profile_data.profile_score
                    }}</span>
                  </div>
                </div>

                <div class="item">
                  <div class="left">
                    <div class="account-stats">
                      <span class="dark-inverted">{{ 'Engagement Rate' }}</span>
                    </div>
                  </div>
                  <div class="right">
                    <span>{{ item.insights_data.posts_engagement }}%</span>
                  </div>
                </div>

                <div class="item">
                  <div class="left">
                    <div class="account-stats">
                      <span class="dark-inverted">{{ t('followers') }}</span>
                    </div>
                  </div>
                  <div class="right">
                    <span>{{
                      abbrNumber(item.profile_data.followersCount)
                    }}</span>
                  </div>
                </div>
                <div class="item">
                  <div class="left">
                    <div class="account-stats">
                      <span class="dark-inverted">{{ t('followings') }}</span>
                    </div>
                  </div>
                  <div class="right">
                    <span>{{ abbrNumber(item.profile_data.followCount) }}</span>
                  </div>
                </div>
                <div class="item">
                  <div class="left">
                    <div class="account-stats">
                      <span class="dark-inverted">{{ t('posts') }}</span>
                    </div>
                  </div>
                  <div class="right">
                    <span>{{ item.profile_data.postsCount }}</span>
                  </div>
                </div>

                <!-- <div class="item">
                  <div class="left">
                    <div class="account-stats">
                      <span class="dark-inverted">{{ t('paidPostsEngagement') }}</span>
                    </div>
                  </div>
                  <div class="right">
                    <span>{{ item.insights_data.paid_posts_engagement }}%</span>
                  </div>
                </div>
                 -->
                <div class="item">
                  <div class="left">
                    <div class="account-stats">
                      <span class="dark-inverted">{{ t('reelsEngagement') }}</span>
                    </div>
                  </div>
                  <div class="right">
                    <span>{{ item.insights_data.reels_engagement }}%</span>
                  </div>
                </div>
              </div>
              <div class="card-grid-item-actions">
                <div class="item">
                  <div class="left">
                    <span class="dark-inverted">{{ t('hashtags') }}</span>
                  </div>
                  <div class="right">
                    <a
                        type="button"
                        @click="[updateCurrentCompetitor(index), (isWordCloudModalOpen = false), isHashtagModalOpen = true]"
                    >Compare</a
                    >
                  </div>
                </div>
                <div class="item">
                  <div class="left">
                    <span class="dark-inverted">{{ t('wordClouds') }}</span>
                  </div>
                  <div class="right">
                    <a
                        type="button"
                        @click="[updateCurrentCompetitor(index), (isWordCloudModalOpen = true), isHashtagModalOpen = false]"
                    >Compare</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TransitionGroup>
      </div>
    </div>
  </div>
  <VModal
      :open="isHashtagModalOpen"
      :title="t('hashtags')"
      size="big"
      actions="right"
      noscroll
      @close="isHashtagModalOpen = false"
  >
    <template #content>
      <div class="columns">
        <div class="column is-6 border-right">
          <h3 class="title">{{ props.customerData?.profile_data.fullName }}</h3>
          <table class="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Hashtag</th>
                <th>Posts</th>
              </tr>
            </thead>
            <tbody>
              <tr :key="index" v-for="(hashtag, index) in props.customerData?.top_hashtags">
                <td style="width: 100px;">{{ index + 1 }}</td>
                <td style="width: 200px;">#{{ hashtag.hashtag_name }}</td>
                <td style="width: 200px;">{{ hashtag.item_count }}</td>
              </tr>
            </tbody>
          </table>
          <!-- <template v-for="(item, index) in props.customerData?.top_hashtags" :key="index">
            <div class="item">
              <div class="left">
                <span class="dark-inverted" >#{{ item.hashtag_name }}</span>
              </div>
              <div class="right">
                <span>{{ abbrNumber(item.item_count) }} {{ t('posts') }}</span>
              </div>
            </div>
            <progress
                class="progress is-tiny is-success"
                max="100"
                :value="(item.item_count  / (item.item_count + (item.item_count * 5)/100)) * 100"
            ></progress>
          </template> -->
        </div>

        <div class="column is-6">
          <h3 class="title">{{ currentCompetitor.profile_data.fullName }}</h3>

          <table class="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Hashtag</th>
                <th>Posts</th>
              </tr>
            </thead>
            <tbody>
              <tr :key="index" v-for="(hashtag, index) in currentCompetitor.top_hashtags">
                <td style="width: 100px;">{{ index + 1 }}</td>
                <td style="width: 200px;">#{{ hashtag.hashtag_name }}</td>
                <td style="width: 200px;">{{ hashtag.item_count }}</td>
              </tr>
            </tbody>
          </table>
          <!-- <template v-for="(item, index) in currentCompetitor.top_hashtags" :key="index">
            <div class="item">
              <div class="left">
                <span class="dark-inverted" >#{{ item.hashtag_name }}</span>
              </div>
              <div class="right">
                <span>{{ abbrNumber(item.item_count) }} {{ t('posts') }}</span>
              </div>
            </div>
            <progress
                class="progress is-tiny is-info"
                max="100"
                :value="(item.item_count / currentCompetitor.total_hashtag_posts) * 100"
            ></progress>
          </template> -->
        </div>

      </div>
    </template>
  </VModal>
  <VModal
      :custom-class="'wordcloud-modal'"
      :open="isWordCloudModalOpen"
      :title="t('wordClouds')"
      size="big"
      actions="right"
      noscroll
      @close="isWordCloudModalOpen = false"
  >
    <template #content>
      <div class="columns">
        <div class="column is-6">
          <h3 class="title">{{ props.customerData?.profile_data.fullName }}</h3>
          <OverviewCard>
            <InstagramCloudContainer
                :wordcloud-data="props.customerData?.wordcloud_data"
            />
          </OverviewCard>
        </div>
        <div class="column is-6">
          <h3 class="title">{{ currentCompetitor.profile_data.fullName }}</h3>
          <OverviewCard>
            <InstagramCloudContainer
                :wordcloud-data="currentCompetitor.wordcloud_data"
            />
          </OverviewCard>
        </div>
      </div>
    </template>
  </VModal>
</template>

<style lang="scss">
@import "../../../scss/abstracts/mixins";

img.avatar {
  border: 1px solid #ccc;
}

.modal {
  &.wordcloud-modal {
    .modal-content {
      max-width: 90%;
    }
  }
}

.v-modal {
  .modal-content {
    .modal-card {
      .modal-card-head {
        h3 {
          font-size: 1.2rem;
        }
      }
    }
  }
}

h3 {
  &.title {
    font-family: var(--font-alt);
    color: var(--dark-text);
    font-size: 1rem;
  }
}

.tag {
  cursor: pointer;
  margin-bottom: 5px;
}

.modal-card {
  .modal-card-body {
    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
      &:last-child {
        margin-bottom: 0;
      }
      .left {
        flex-grow: 2;
        max-width: 50%;
        span {
          display: block;
          font-family: var(--font-alt);
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--dark-text);
        }
        .progress {
          margin-bottom: 0;
        }
      }

      .right {
        font-family: var(--font);
        font-size: 0.85rem;
        color: var(--light-text);
      }
    }
    .size10 {
      padding: 8px 14px;
      font-size: 2rem;
      border-radius: 0.75rem;
    }
  }
}

.border-right {
  border-right: solid 1px var(--border);
}

.is-sticky {
  position: -webkit-sticky !important;
  position: sticky !important;
  top: 0;
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
    &.my-card {
      background-color: var(--light-blue);
    }

    .card-grid-item-body {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px;
      border-bottom: 1px solid var(--fade-grey-dark-3);

      .item {
        display: flex;
        align-items: center;

        .meta {
          margin-left: 12px;
          line-height: 1.3;
          a {
            color: var(--success);
          }

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
    }

    .card-grid-item-footer,
    .card-grid-item-actions {
      padding: 20px;

      .item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8px;
        &:last-child {
          margin-bottom: 0;
        }
        .left {
          flex-grow: 2;
          max-width: 50%;
          span {
            display: block;
            font-family: var(--font-alt);
            font-size: 0.9rem;
            font-weight: 600;
            color: var(--dark-text);
          }
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
          font-family: var(--font);
          font-size: 0.85rem;
          color: var(--light-text);
        }
      }
    }

    .card-grid-item-actions {
      border-top: 1px solid var(--fade-grey-dark-3);
      padding: 10px 20px;
      .item {
        &:first-child {
          margin-bottom: 5px;
        }
        &:last-child {
          margin-bottom: 0;
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
    }
  }
}

.col-wrap {
  //padding-bottom: calc(100vh - 489px);
}

.margin-top-0 {
  margin-top: 0;
  transition: all ease 0.3s;
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
