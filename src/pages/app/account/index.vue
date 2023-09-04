<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import {useUserSession} from "/@src/stores/userSession";
import SecurityService from "/@src/services/SecurityService";
import {useI18n} from "vue-i18n";
import {useStorage} from "@vueuse/core";
import {useViewWrapper} from "/@src/stores/viewWrapper";
import {useHead} from "@vueuse/head";

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('General Settings')


useHead({
  title: 'General Settings',
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

const firstName = ref('')
const lastName = ref('')
const gender = ref('')
const bio = ref('')
let profile = ref('')
let uploadProfile = ref()
// const avatars = ref(['profile-1.png', 'profile-2.png', 'profile-3.png', 'profile-4.png', 'profile-5.png'])
const avatars = ref(['profile-1.jpg', 'profile-2.jpg', 'profile-3.jpg', 'profile-4.jpg', 'profile-5.jpg'])
const activeProfileImage = ref(userSession.profileImage)
const hoverProfileImage = ref('')

const updateAccount = () => {
  SecurityService.refreshAccessToken().then(function (res: { data: { access: string; }; }) {
    if (res.data.access) {
      useUserSession().setToken(res.data.access)
    }
    const formData = new FormData()
    formData.append('first_name', firstName.value)
    formData.append('last_name', lastName.value)
    formData.append('gender', gender.value)
    formData.append('bio', bio.value)
    formData.append('profile_image', activeProfileImage.value)
    SecurityService.updateAccountSettings(formData).then(function (response: { data: any }) {
      getAccount()
    }).catch(function (error: any) {
      console.log(error)
    });
  })
};

const getAccount = () => {
  SecurityService.refreshAccessToken().then(function (res: { data: { access: string; }; }) {
    if (res.data.access) {
      useUserSession().setToken(res.data.access)
    }
    SecurityService.getAccountSettings({}).then(function (response: { data: any }) {
      firstName.value = response.data.first_name
      lastName.value = response.data.last_name
      gender.value = response.data.gender
      bio.value = response.data.bio
      profile.value = response.data.profile_image
      useUserSession().setProfileImage(response.data.profile_image)
    }).catch(function (error: any) {
      console.log(error)
    });
  })
}

onMounted(() => {
  getAccount()
})

const profileRef = ref()
const setProfile = () => {
  uploadProfile.value = profileRef.value.files[0] || null
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
        <div class="column is-6">
          <div class="dashboard-card">
            <h4 class="dark-inverted mb-4">{{ t('accountSettings')}}</h4>
            <div class="columns">
              <div class="column is-12">
                <form class="modal-form p-md-5 has-background-primary-light p-5">
                  <!--  avatar-->
                  <div class="control mb-4">
                    <div class="is-flex is-justify-content-space-evenly is-align-items-center is-flex-wrapped">
                      <VAvatar
                          v-for="(avatar, avatarIndex) in avatars"
                          size="medium" :key="`avarat-${avatarIndex}`"
                          class="cursor-pointer my-1"
                          :class="[activeProfileImage === avatar ? 'active' : '', hoverProfileImage === avatar ? 'hover' : '']"
                          :picture="`/images/avatars/profile/${avatar}`"
                          @click="activeProfileImage = avatar"
                          @mouseenter="hoverProfileImage = avatar"
                          @mouseleave="hoverProfileImage = ''"
                          :title="avatar"
                      />
                      </div>
                  </div>
                  <!-- first name -->
                  <VField>
                    <VControl icon="feather:user">
                      <input
                          v-model="firstName"
                        class="input"
                        type="text"
                        :placeholder="t('firstName')"
                        autocomplete="firstName"
                      />
                    </VControl>
                  </VField>

                  <!-- Last Name -->
                  <VField>
                    <VControl icon="feather:user">
                      <input
                          v-model="lastName"
                        class="input"
                        type="text"
                        :placeholder="t('lastName')"
                        autocomplete="lastName"
                      />
                    </VControl>
                  </VField>

                  <VField>
                    <VControl>
                      <span class="select">
                        <select v-model="gender">
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="others">Others</option>
                        </select>
                      </span>
                    </VControl>
                  </VField>

<!--                  <VField grouped>-->
<!--                    <div class="control has-fullwidth">-->
<!--                      <div class="file has-name is-right has-fullwidth">-->
<!--                        <label class="file-label">-->
<!--                          <input @change="setProfile" ref="profileRef" class="file-input" type="file" name="resume" />-->
<!--                          <span class="file-cta">-->
<!--                            <span class="file-icon">-->
<!--                              <i class="fas fa-cloud-upload-alt"></i>-->
<!--                            </span>-->
<!--                            <span class="file-label"></span>-->
<!--                          </span>-->
<!--                          <span class="file-name light-text has-background-white">Choose a file...</span>-->
<!--                        </label>-->
<!--                      </div>-->
<!--                    </div>-->
<!--                  </VField>-->

                  <!-- Bio -->
                  <div class="control mb-3">
                    <textarea
                        v-model="bio"
                      class="textarea"
                      rows="3"
                      :placeholder="`${t('bio')}...`"
                    ></textarea>
                  </div>

                  <VButton @click="updateAccount" class="is-fullwidth" color="primary" elevated
                    >{{ t('saveChanges') }}</VButton
                  >
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

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
}
.dashboard-body {
  .dashboard-card {
    @include vuero-s-card;
  }

  .account-setting {
    font-family: var(--font-alt);
    font-weight: 600;
    font-size: 1.3rem;
    color: var(--dark-text);
  }
}
.file.has-fullwidth {
  .file-label {
    width: 100%;
    .file-input {
      width: 100%;
    }
    .file-cta {
      width: 3rem;
    }

    .file-name {
      width: calc(100% - 0rem);
      max-width: 100%;
    }
  }
}

.v-avatar {
  &.active, &.hover {
    border: 3px solid var(--primary);
    border-radius: 50%;

    &.is-medium {
      .avatar {
        min-width: 44px;
        width: 44px;
        height: 44px;
      }
    }
  }
}
.cursor-pointer {
  cursor: pointer;
}
</style>
