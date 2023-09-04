<script setup lang="ts">
import {onMounted, ref, watch} from "vue";

import {useUserSession} from "/@src/stores/userSession";
import SecurityService from "/@src/services/SecurityService";
import {useI18n} from "vue-i18n";
import {useStorage} from "@vueuse/core";
import {useViewWrapper} from "/@src/stores/viewWrapper";
import {useHead} from "@vueuse/head";
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Personal Settings')

useHead({
  title: 'Personal Settings',
})

const addInstagramComparisonFormOpen = ref(false);
const addtikTokComparisonFormOpen = ref(false);

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

const changePasswordOpen = ref(false);
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
const userSession = useUserSession()

const instaComparison1 = ref('')
const instaComparison2 = ref('')
const instaComparison3 = ref('')
const instaComparison4 = ref('')
const tiktokComparison1 = ref('')
const tiktokComparison2 = ref('')
const tiktokComparison3 = ref('')
const tiktokComparison4 = ref('')

onMounted(() => {

  SecurityService.refreshAccessToken().then(function (res: { data: { access: string; }; }) {
    if (res.data.access) {
      useUserSession().setToken(res.data.access)
    }
    SecurityService.getCompatitor('Instagram', {}).then(function (response: { data: any }) {
      // console.log(response)
      instaComparison1.value = response.data.competitors.competitor_1
      instaComparison2.value = response.data.competitors.competitor_2
      instaComparison3.value = response.data.competitors.competitor_3
      instaComparison4.value = response.data.competitors.competitor_4
    }).catch(function (error: any) {

    });
    SecurityService.getCompatitor('Tiktok', {}).then(function (response: { data: any }) {
      // console.log(response)
      tiktokComparison1.value = response.data.competitors.competitor_1
      tiktokComparison2.value = response.data.competitors.competitor_2
      tiktokComparison3.value = response.data.competitors.competitor_3
      tiktokComparison4.value = response.data.competitors.competitor_4
    }).catch(function (error: any) {

    });
  })
})

const updateCompatitors = (type: string) => {
  SecurityService.refreshAccessToken().then(function (res: { data: { access: string; }; }) {
    if (res.data.access) {
      useUserSession().setToken(res.data.access)
    }
    SecurityService.updateCompatitor(type, {
      competitor_1: type === 'Instagram' ? instaComparison1.value : tiktokComparison1.value,
      competitor_2: type === 'Instagram' ? instaComparison2.value : tiktokComparison2.value,
      competitor_3: type === 'Instagram' ? instaComparison3.value : tiktokComparison3.value,
      competitor_4: type === 'Instagram' ? instaComparison4.value : tiktokComparison4.value,
    }).then(function (response: { data: any }) {
      addInstagramComparisonFormOpen.value = false
      addtikTokComparisonFormOpen.value = false
    }).catch(function (error: any) {

    });
  })
}
</script>

<template>
  <div class="personal-dashboard personal-dashboard-v1">
    <!--Personal Dashboard V1-->
    <!--Header-->
    <div class="dashboard-header">
      <VAvatar :picture="`/images/avatars/profile/${userSession.profileImage}`" size="large" />
      <div class="start">
        <h3>Hello, {{ userSession.userFullName }}</h3>
        <p>Here you can manage your account settings.</p>
      </div>
      <div class="end">
        <VButton color="primary" icon="feather:edit" elevated @click="changePasswordOpen = true">{{ t('changePassword') }}</VButton>
      </div>
    </div>

    <!--Body-->
    <div class="dashboard-body">
      <div class="columns is-multiline">
        <!--Card-->
        <div class="column is-6 is-fullheight">
          <div class="dashboard-card">
            <h4 class="dark-inverted">Instagram Settings</h4>

            <div class="quick-stats">
              <div class="quick-stats-inner">
                <!--Instagram profile-->
                <div class="quick-stat">
                  <div class="columns">
                    <div
                      class="column is-flex is-justify-content-space-between is-align-items-center"
                    >
                      <div>
                        <VBlock
                          title="@The_Rock"
                          subtitle="Instagram Profile"
                          center
                          m-responsive
                          t-responsive
                        >
                          <template #icon>
                            <VIconBox color="red" rounded>
                              <i
                                aria-hidden="true"
                                class="lnil lnil-Instagram"
                              ></i>
                            </VIconBox>
                          </template>
                        </VBlock>
                      </div>
                      <div class="user-list-icons">
                        <a><i aria-hidden="true" class="fa fa-edit"></i></a>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- instagram Comparison form open-->
                <div class="quick-stat">
                  <div
                    class="is-flex mb-3 is-justify-content-space-between is-align-items-center"
                  >
                    <p>Instagram Comparison</p>
                    <VButton
                      icon="feather:edit"
                      @click="addInstagramComparisonFormOpen = true"
                      color="primary"
                      elevated
                      >Edit Profiles</VButton
                    >
                  </div>

                  <div class="dashboard-card">
                    <div>
                      <ul class="user-list">
                        <li>
<!--                          <VAvatar picture="/demo/avatars/18.jpg" />-->
                          <div class="user-list-info">
                            <div
                              class="name dark-inverted "
                            >
                              {{ instaComparison1 }}
                            </div>
                            <div class="position">{{instaComparison1}}</div>
                          </div>
                        </li>
                        <li>
<!--                          <VAvatar initials="SC" color="h-orange" />-->
                          <div class="user-list-info">
                            <div class="name dark-inverted ">
                              {{ instaComparison2 }}
                            </div>
                            <div class="position">{{ instaComparison2 }}</div>
                          </div>
                        </li>
                        <li>
<!--                          <VAvatar picture="/demo/avatars/13.jpg" />-->
                          <div class="user-list-info">
                            <div
                              class="name dark-inverted "
                            >
                              {{ instaComparison3 }}
                            </div>
                            <div class="position">{{ instaComparison3 }}</div>
                          </div>
                        </li>
                        <li>
<!--                          <VAvatar initials="NL" color="success" />-->
                          <div class="user-list-info">
                            <div class="name dark-inverted ">
                              {{ instaComparison4 }}
                            </div>
                            <div class="position">{{ instaComparison4 }}</div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--Card-->
        <div class="column is-6 is-fullheight">
          <div class="dashboard-card">
            <h4 class="dark-inverted">TikTok Settings</h4>

            <div class="quick-stats">
              <div class="quick-stats-inner">
                <!-- TikTok profile-->
                <div class="quick-stat">
                  <div class="columns">
                    <div
                      class="column is-flex is-justify-content-space-between is-align-items-center"
                    >
                      <div>
                        <VBlock
                          title="@The_Rock"
                          subtitle="TikTok Profile"
                          center
                          m-responsive
                          t-responsive
                        >
                          <template #icon>
                            <VIconBox color="primary" rounded>
                              <img alt="tiktok"
                                class="tiktok-profile"
                                src="/images/icons/logos/tiktok-black.svg"
                              />
                            </VIconBox>
                          </template>
                        </VBlock>
                      </div>
                      <div class="user-list-icons">
                        <a><i aria-hidden="true" class="fa fa-edit"></i></a>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- tiktok Comparison form open-->
                <div class="quick-stat">
                  <div
                    class="is-flex mb-3 is-justify-content-space-between is-align-items-center"
                  >
                    <p>TikTok Comparison</p>
                    <VButton
                      icon="feather:edit"
                      @click="addtikTokComparisonFormOpen = true"
                      color="primary"
                      elevated
                      >Edit Profiles</VButton
                    >
                  </div>
                  <div class="dashboard-card">
                    <div>
                      <ul class="user-list">
                        <li>
<!--                          <VAvatar picture="/demo/avatars/18.jpg" />-->
                          <div class="user-list-info">
                            <div
                              class="name dark-inverted "
                            >
                              {{ tiktokComparison1 }}
                            </div>
                            <div class="position">{{ tiktokComparison1 }}</div>
                          </div>
                        </li>
                        <li>
<!--                          <VAvatar initials="SC" color="h-orange" />-->
                          <div class="user-list-info">
                            <div class="name dark-inverted ">
                              {{ tiktokComparison2 }}
                            </div>
                            <div class="position">{{ tiktokComparison2 }}</div>
                          </div>
                        </li>
                        <li>
<!--                          <VAvatar picture="/demo/avatars/13.jpg" />-->
                          <div class="user-list-info">
                            <div
                              class="name dark-inverted "
                            >
                              {{ tiktokComparison3 }}
                            </div>
                            <div class="position">{{ tiktokComparison3 }}</div>
                          </div>
                        </li>
                        <li>
<!--                          <VAvatar initials="NL" color="success" />-->
                          <div class="user-list-info">
                            <div class="name dark-inverted ">
                              {{ tiktokComparison4 }}
                            </div>
                            <div class="position">{{ tiktokComparison4 }}</div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <VModal
    :open="addInstagramComparisonFormOpen"
    title="Add Instagram Comparison"
    size="small"
    actions="right"
    @close="addInstagramComparisonFormOpen = false"
  >
    <template #content>
      <form class="modal-form">
        <VField>
          <VControl icon="feather:user-plus">
            <input
                v-model="instaComparison1"
                class="input"
                type="text"
                :placeholder="t('firstComparison')"
            />
          </VControl>
        </VField>
        <VField>
          <VControl icon="feather:user-plus">
            <input
                v-model="instaComparison2"
                class="input"
                type="text"
                :placeholder="t('secondComparison')"
            />
          </VControl>
        </VField>
        <VField>
          <VControl icon="feather:user-plus">
            <input
                v-model="instaComparison3"
                class="input"
                type="text"
                :placeholder="t('thirdComparison')"
            />
          </VControl>
        </VField>
        <VField>
          <VControl icon="feather:user-plus">
            <input
                v-model="instaComparison4"
                class="input"
                type="text"
                :placeholder="t('fourthComparison')"
            />
          </VControl>
        </VField>
      </form>
    </template>
    <template #action>
      <VButton color="primary" raised @click="updateCompatitors('Instagram')">Add</VButton>
    </template>
  </VModal>
  <VModal
    :open="addtikTokComparisonFormOpen"
    title="Add TikTok Comparison"
    size="small"
    actions="right"
    @close="addtikTokComparisonFormOpen = false"
  >
    <template #content>
      <form class="modal-form">
        <VField>
          <VControl icon="feather:user-plus">
            <input
                v-model="tiktokComparison1"
                class="input"
                type="text"
                :placeholder="t('firstComparison')"
            />
          </VControl>
        </VField>
        <VField>
          <VControl icon="feather:user-plus">
            <input
                v-model="tiktokComparison2"
                class="input"
                type="text"
                :placeholder="t('secondComparison')"
            />
          </VControl>
        </VField>
        <VField>
          <VControl icon="feather:user-plus">
            <input
                v-model="tiktokComparison3"
                class="input"
                type="text"
                :placeholder="t('thirdComparison')"
            />
          </VControl>
        </VField>
        <VField>
          <VControl icon="feather:user-plus">
            <input
                v-model="tiktokComparison4"
                class="input"
                type="text"
                :placeholder="t('fourthComparison')"
            />
          </VControl>
        </VField>
      </form>
    </template>
    <template #action>
      <VButton color="primary" raised @click="updateCompatitors('Tiktok')">Add</VButton>
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
</template>

<style lang="scss">
@import "../../../scss/abstracts/mixins";

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
            width: 100%;
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
.v-button {
  border: 0;
}
.tiktok-icon {
  height: 13.3px;
  width: 13.3px;
  margin-right: 5px;
}
.inst-icon {
  margin-right: 10px;
}
.vcard-style {
  border: 0;
}

.tiktok-profile {
  width: 19.6px;
}
</style>
