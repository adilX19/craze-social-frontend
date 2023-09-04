<template>
  <VDropdown right spaced class="user-dropdown profile-dropdown has-tooltip-arrow has-tooltip-right" :data-tooltip="t('profile')">
    <template #button="{ toggle }">
      <a
        tabindex="0"
        class="is-trigger dropdown-trigger is-block"
        aria-haspopup="true"
        @keydown.space.prevent="toggle"
        @click="toggle"
      >
        <div class="mb-2">
          Profile
        </div>
        <VAvatar :picture="`/images/avatars/profile/${userSession.profileImage}`"/>
      </a>
    </template>

    <template #content="{ toggle }">
      <div class="dropdown-head">
        <VAvatar size="large" :picture="`/images/avatars/profile/${userSession.profileImage}`"/>

        <div class="meta">
          <span>{{ userSession.userFullName }}</span>
          <span>Product Manager</span>
        </div>
      </div>

      <router-link :to="{name: 'app-account'}" role="menuitem" class="dropdown-item is-media" @click="toggle">
        <div class="icon">
          <i aria-hidden="true" class="lnil lnil-cog"></i>
        </div>
        <div class="meta">
          <span>{{ t('accountProfile')}}</span>
          <span>{{ t('accountProfile')}}</span>
        </div>
      </router-link>

      <hr class="dropdown-divider" />

      <router-link :to="{name: 'app-plan'}" role="menuitem" class="dropdown-item is-media" @click="toggle">
        <div class="icon">
          <i aria-hidden="true" class="lnil lnil-users-alt"></i>
        </div>
        <div class="meta">
          <span>{{ t('plans') }}</span>
          <span>{{ t('manageYourPlans')}}</span>
        </div>
      </router-link>

      <hr class="dropdown-divider" />

      <router-link :to="{name: 'app-integration'}"  role="menuitem" class="dropdown-item is-media" @click="toggle">
        <div class="icon">
          <i aria-hidden="true" class="lnil lnil-briefcase"></i>
        </div>
        <div class="meta">
          <span>{{ t('integrations') }}</span>
          <span>{{ t('allMyIntegrations') }}</span>
        </div>
      </router-link>

      <hr class="dropdown-divider" />

      <router-link :to="{name: 'app-personal'}" role="menuitem" class="dropdown-item is-media" @click="toggle">
        <div class="icon">
          <i aria-hidden="true" class="lnil lnil-cog"></i>
        </div>
        <div class="meta">
          <span>{{ t('personalSettings')}}</span>
          <span>{{ t('personalSettings')}}</span>
        </div>
      </router-link>

      <hr class="dropdown-divider" />

      <div class="dropdown-item is-button">
        <VButton
          class="logout-button"
          icon="feather:log-out"
          color="primary"
          role="menuitem"
          raised
          fullwidth
          @click="logout"
        >
          {{ t('logout')}}
        </VButton>
      </div>
    </template>
  </VDropdown>
</template>

<script setup lang="ts">
import {useI18n} from "vue-i18n";
import {useStorage} from "@vueuse/core";
import {watch} from "vue";
import SecurityService from "/@src/services/SecurityService";
import { useUserSession } from "/@src/stores/userSession";
import {useRouter} from "vue-router";

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

const userSession = useUserSession();
const router = useRouter();

const logout = () => {
  SecurityService.logout()
      .then(function (response: { data: any }) {
        // userSession.logoutUser();
        router.push({ name: "auth-login" });
        console.log("logged out successfully...")
      })
      .catch(function (error: string) {
        userSession.setToken("");
        router.push({ name: "auth-login" });
        console.log(error + "Can't logout");
      });
};
</script>
