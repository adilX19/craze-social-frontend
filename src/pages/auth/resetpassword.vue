<script setup lang="ts">
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useHead } from "@vueuse/head";
import { useDarkmode } from "/@src/stores/darkmode";
import { useUserSession } from "/@src/stores/userSession";
import { useNotyf } from "/@src/composable/useNotyf";
import SecurityService from "/@src/services/SecurityService";

const isLoading = ref(false);
const darkmode = useDarkmode();
const router = useRouter();
const route = useRoute();
const notif = useNotyf();
const userSession = useUserSession();
const redirect = route.query.redirect as string;
const email = ref('')
const errorMessage = ref('');
const alertType = ref('danger');

const handleReset = async () => {
  if (!isLoading.value) {
    isLoading.value = true;

    SecurityService.resetPassword({
      email: email.value,
    }).then(function (response: { data: any }) {
      isLoading.value = false;
      alertType.value = 'success'
      errorMessage.value = 'A mail has been sent to ' + email.value
    })
        .catch(function (error: any) {
          isLoading.value = false;
          alertType.value = 'danger'
          errorMessage.value = error.response.data.email
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
                  <h2>Reset Your Password.</h2>
                  <p>Please enter your email</p>
                </div>
                <div class="auth-form-wrapper">
                  <div v-if="errorMessage" class="notification" :class="alertType === 'success' ? 'is-success' : 'is-danger'">
                    <button @click="errorMessage = ''" class="delete"></button>
                    {{ errorMessage }}
                  </div>
                  <!-- Login Form -->
                  <form @submit.prevent="handleReset">
                    <div class="login-form">
                      <!-- email -->
                      <VField>
                        <VControl icon="feather:mail">
                          <input
                              v-model="email"
                            class="input"
                            type="email"
                            placeholder="Email Address"
                          />
                        </VControl>
                      </VField>

                      <!-- Submit -->
                      <VButton
                        :loading="isLoading"
                        color="primary"
                        type="submit"
                        bold
                        fullwidth
                        raised
                      >
                        Reset
                      </VButton>

                      <div class="forgot-link has-text-centered">
                        <router-link :to="{ name: 'auth-login' }">
                          <a>back</a>
                        </router-link>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
