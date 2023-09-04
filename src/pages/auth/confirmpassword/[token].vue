<script setup lang="ts">
import {onMounted, ref} from "vue";
import { useRouter, useRoute } from "vue-router";
import { useHead } from "@vueuse/head";
import { useDarkmode } from "/@src/stores/darkmode";
import { useUserSession } from "/@src/stores/userSession";
import { useNotyf } from "/@src/composable/useNotyf";
import sleep from "/@src/utils/sleep";
import SecurityService from "/@src/services/SecurityService";

const forgotPassword = ref(false);
const isLoading = ref(false);
const isPageLoading = ref(false);
const darkmode = useDarkmode();
const router = useRouter();
const route = useRoute();
const notif = useNotyf();
const userSession = useUserSession();
const redirect = route.query.redirect as string;
const isValidToken = ref(false)
const newPassword = ref('')
const errorMessage = ref('')
const errorType = ref('danger')

const resetPassword = async () => {
  isLoading.value = true;
  SecurityService.confirmResetPassword({
    token: route.params.token,
    password: newPassword.value,
  })
      .then(function (response: { data: any }) {
        errorType.value = 'success'
        errorMessage.value = 'Password changed successfully'
        isLoading.value = false;
      })
      .catch(function (error: any) {
        errorType.value = 'danger'
        errorMessage.value = error.response.data
        isLoading.value = false;
      });
};

onMounted(() => {
  isPageLoading.value = true
  SecurityService.validateToken(route.params.token, {}).then((res: { data: { status: string; }; }) => {
    console.log(res.data)
    if (res.data.status === 'OK') {
      isValidToken.value = true
    } else {
      isValidToken.value = false
    }
    isPageLoading.value = false
  }).catch(() => {
    isValidToken.value = false
    isPageLoading.value = false
  })
})

const handleForgotPassword = async () => {
  if (forgotPassword) {
    router.push({
      name: "resetpassword",
    });
  }
};
useHead({
  title: "Auth Login - Vuero",
});
</script>

<template>
  <div class="auth-wrapper-inner columns is-gapless">
    <!-- Image section (hidden on mobile) -->
    <div
      class="column login-column is-8 h-hidden-mobile h-hidden-tablet-p hero-banner"
    >
      <div class="hero login-hero is-fullheight is-app-grey">
        <div class="hero-body">
          <div class="columns">
            <div class="column is-10 is-offset-1">
              <img
                class="light-image has-light-shadow has-light-border"
                src="/@src/assets/illustrations/apps/vuero-banking-light.png?format=webp"
                alt=""
              />
              <img
                class="dark-image has-light-shadow"
                src="/@src/assets/illustrations/apps/vuero-banking-dark.png?format=webp"
                alt=""
              />
            </div>
          </div>
        </div>
        <div class="hero-footer">
          <p class="has-text-centered"></p>
        </div>
      </div>
    </div>

    <!-- Form section -->
    <div class="column is-4">
      <div class="hero is-fullheight is-white">
        <div class="hero-heading">
          <label
            class="dark-mode ml-auto"
            tabindex="0"
            @keydown.space.prevent="(e) => (e.target as HTMLLabelElement).click()"
          >
            <input
              type="checkbox"
              :checked="!darkmode.isDark"
              @change="darkmode.onChange"
            />
            <span></span>
          </label>
          <div class="auth-logo">
            <RouterLink :to="{ name: 'index' }">
              <AnimatedLogo width="36px" height="36px" />
            </RouterLink>
          </div>
        </div>
        <div class="hero-body">
          <div class="container">
            <div class="columns">
              <div class="column is-12">
                <div class="auth-content">
                  <h2>Confirm Your Password.</h2>
                  <p>Please enter a new password</p>
                </div>
                <div v-if="errorMessage" class="notification" :class="errorType === 'success' ? 'is-primary' : 'is-danger'">
                  <button @click="errorMessage = ''" class="delete"></button>
                  {{ errorMessage }}
                </div>
                <div
                    v-if="isPageLoading"
                    class="is-flex is-justify-content-center h-100 loader-wrap"
                >
                  <button class="button loader is-large is-loading">Loading</button>
                </div>
                <div v-else-if="isValidToken" class="auth-form-wrapper">
                  <!-- Confirm password Form -->
                  <form @submit.prevent="resetPassword">
                    <div class="login-form">
                      <!-- New Password -->
                      <VField>
                        <VControl icon="feather:lock">
                          <input
                              v-model="newPassword"
                            class="input"
                            type="text"
                            placeholder="New Password"
                          />
                        </VControl>
                      </VField>

                      <!-- Submit -->
                      <VControl class="login">
                        <VButton
                          :loading="isLoading"
                          color="primary"
                          type="submit"
                          bold
                          fullwidth
                          raised
                        >
                          Confirm
                        </VButton>
                      </VControl>
                      <div class="forgot-link has-text-centered">
                        <router-link :to="{ name: 'auth-login' }">
                          <a>Login</a>
                        </router-link>
                      </div>
                    </div>
                  </form>
                </div>
                <div v-else class="has-text-centered">Invalid token</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">

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
  top: 50px;
  left: 0;
  border-radius: 5px;
}
.loader {
  background-color: transparent;
  border: 0px;
//margin-top: 300px;
  position: absolute;
  top: 40%;
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
