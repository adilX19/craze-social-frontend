<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useDarkmode } from "/@src/stores/darkmode";
import { usePanels } from "/@src/stores/panels";
import { useUserSession } from "/@src/stores/userSession";
import { useRouter, useRoute } from "vue-router";
import SecurityService from "/@src/services/SecurityService";

import axios from 'axios';

import { useStorage } from '@vueuse/core'

const darkmode = useDarkmode();
const { locale } = useI18n();
const panels = usePanels();
const userSession = useUserSession();
const route = useRoute();
const router = useRouter();
const redirect = route.query.redirect as string;

const user_country = ref('');
const country_code = ref('');
const plan = ref('');
const users = ref(0);

const localFlagSrc = computed(() => {
  switch (locale.value) {
    case "fr":
      return "/images/icons/flags/france.svg";
    case "es":
      return "/images/icons/flags/spain.svg";
    case "es-MX":
      return "/images/icons/flags/mexico.svg";
    case "de":
      return "/images/icons/flags/germany.svg";
    case "zh-CN":
      return "/images/icons/flags/china.svg";
    case "en":
    default:
      return "/images/icons/flags/united-states-of-america.svg";
  }
});

const logout = () => {
  SecurityService.logout({session_time: localStorage.getItem('sessionTimestamp', '')}) // adding payload
    .then(function (response: { data: any }) {
        userSession.logoutUser();
        router.push({ name: "auth-login" });
    })
    .catch(function (error: string) {
      userSession.setToken("");
      router.push({ name: "auth-login" });
      console.log(error + "Can't logout");
    });
};

onMounted(() => {
  SecurityService.refreshAccessToken().then(function (res: { data: { access: string; }; }) {
    if (res.data.access) {
      useUserSession().setToken(res.data.access)
    }

    SecurityService.getUserLocationData({}).then(function (response: { data: any }) {
      console.log("User Location data fetched from API.")
      let ip = response.data.ip
      plan.value = response.data.plan
      users.value = response.data.users

      axios.get(`http://ip-api.com/json/${ip}`)
      .then(response => {
        user_country.value = response.data.country
        country_code.value = response.data.countryCode
      })
      // user_country.value = response.data.location.country
      // country_code.value = response.data.location.country_code
    }).catch(function (error: any) {
      console.log(error)
    });

  }).catch(function () {
    console.log("something went wrong with Token.")
  })
})

</script>

<template>
  <div class="toolbar ml-auto">
    <div v-if="user_country !== ''" style="margin-right: 25px; color: #A9A9A9;">
      <i aria-hidden="true" class="iconify" data-icon="feather:map-pin"></i>
      {{ user_country }} ({{ country_code }})
    </div>

    <div style="margin-right: 20px;">
      <VTags addons>
        <VTag :label="plan" color="primary" />
        <VTag :label="users" />
      </VTags>
    </div>

    <div class="toolbar-link">
      <label
        tabindex="0"
        class="dark-mode ml-auto"
        @keydown.space.prevent="(e) => (e.target as HTMLLabelElement).click()"
      >
        <input
          type="checkbox"
          :checked="!darkmode.isDark"
          @change="darkmode.onChange"
        />
        <span></span>
      </label>
    </div>

    <a
      tabindex="0"
      class="toolbar-link right-panel-trigger"
      @keydown.space.prevent="panels.setActive('languages')"
      @click="panels.setActive('languages')"
    >
      <img :src="localFlagSrc" alt="" />
    </a>

    <div @click="logout" class="toolbar-link is-clickable">
      <i aria-hidden="true" class="iconify" data-icon="feather:log-out"></i>
    </div>
    <slot></slot>
  </div>
</template>
