<script setup lang="ts">
import { Ref, ref} from "vue";
import {useI18n} from "vue-i18n";
import {useRouter} from "vue-router";
import {useHead} from "@vueuse/head";
import {Field, useForm} from "vee-validate";
import * as yup from "yup";

import {useDarkmode} from "/@src/stores/darkmode";
import {useNotyf} from "/@src/composable/useNotyf";
import sleep from "/@src/utils/sleep";
import {useUserSession} from "/@src/stores/userSession";
import SecurityService from "/@src/services/SecurityService";

const darkmode = useDarkmode();
const router = useRouter();
const notif = useNotyf();

const errorMessage = ref('');
const isLoading = ref(false);
const username = ref("");
const password = ref("");
const confirmPassword = ref("");
const firstName = ref("");
const lastName = ref("");
const email = ref("");
const {t} = useI18n();

// Define a validation schema
const schema = yup.object({
  promotional: yup.mixed(),
  name: yup.string().required(t("auth.errors.name.required")),
  email: yup
      .string()
      .required(t("auth.errors.email.required"))
      .email(t("auth.errors.email.format")),
  password: yup
      .string()
      .required(t("auth.errors.password.required"))
      .min(8, t("auth.errors.password.length")),
  passwordCheck: yup
      .string()
      .required(t("auth.errors.passwordCheck.required"))
      .oneOf([yup.ref("password")], t("auth.errors.passwordCheck.match")),
});

const {handleSubmit} = useForm({
  validationSchema: schema,
});
const usernameValidation = ref(null)
const usernameValidationTimer = ref(0)
const isAvailable = ref(false)
const validationMessage = ref('')

const validateUsernameWithDelay = (filter: any) => {
  if (usernameValidation !== filter) {
    clearTimeout(usernameValidationTimer.value)
    usernameValidationTimer.value = setTimeout(() => {
      usernameValidation.value = filter
      validateUsername()
    }, 750)
  } else {
    clearTimeout(usernameValidationTimer.value)
  }
}

const validateUsername = () => {
  SecurityService.validateUsername(username.value)
    .then(function (response: { data: any }) {
      isAvailable.value = response.data.available
      validationMessage.value = response.data.message
    })
    .catch(function (error: any) {
      console.log(error);
      isAvailable.value = false
      validationMessage.value = 'Username not available'
    });
};

const register = () => {
  if (!isAvailable.value) {
    errorMessage.value = 'Choose available username'
  } else {
    isLoading.value = true;
    SecurityService.registerUser({
      username: username.value,
      password: password.value,
      confirm_password: confirmPassword.value,
      first_name: firstName.value,
      last_name: lastName.value,
      email: email.value,
    })
        .then(function (response: { data: any }) {
          isLoading.value = false;
          router.push({ name: 'auth-login'})
        })
        .catch(function (error: any) {
          isLoading.value = false;
          console.log(error);
          errorMessage.value = error.response.data
        });
  }
};

useHead({
  title: "Auth Signup 2 - Vuero",
});
</script>

<template>
  <div class="auth-wrapper-inner columns is-gapless">
    <!-- Form section -->
    <div class="column is-5">
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
              <AnimatedLogo class="top-logo" width="36px" height="36px" />
            </RouterLink>
          </div>
        </div>
        <div class="hero-body">
          <div class="container">
            <div class="columns">
              <div class="column is-12">
                <div class="auth-content">
                  <h2>{{ t("auth.title") }}</h2>
                  <p>{{ t("auth.subtitle") }}</p>
                  <RouterLink :to="{ name: 'auth-login' }">
                    {{ t("auth.action.login") }}
                  </RouterLink>
                </div>
                <div class="auth-form-wrapper">
                  <div v-if="errorMessage" class="notification is-danger">
                    <button @click="errorMessage = ''" class="delete"></button>
                    {{ errorMessage }}
                  </div>
                  <!-- Login Form -->
                  <form @submit.prevent="register">
                    <div id="signin-form" class="login-form">
                      <!-- Input -->
                      <Field v-slot="{ field, errorMessage }" name="username">
                        <VField>
                          <VControl
                            icon="feather:user"
                            :has-error="Boolean(errorMessage)"
                          >
                            <input
                              v-model="username"
                              v-bind="field"
                              class="input"
                              type="text"
                              placeholder="Username"
                              @input="validateUsernameWithDelay"
                            />
                            <p v-if="errorMessage" class="help is-danger">
                              {{ errorMessage }}
                            </p>
                            <p v-if="validationMessage && !isAvailable" class="help is-danger">
                              {{ validationMessage }}
                            </p>
                            <p v-else class="help is-green">
                              {{ validationMessage }}
                            </p>
                          </VControl>
                        </VField>
                      </Field>

                      <!-- Input -->
                      <Field v-slot="{ field, errorMessage }" name="firstName">
                        <VField>
                          <VControl
                            icon="feather:type"
                            :has-error="Boolean(errorMessage)"
                          >
                            <input
                              v-model="firstName"
                              v-bind="field"
                              class="input"
                              type="text"
                              placeholder="First Name"
                              autocomplete="name"
                            />
                            <p v-if="errorMessage" class="help is-danger">
                              {{ errorMessage }}
                            </p>
                          </VControl>
                        </VField>
                      </Field>

                      <!-- Input -->
                      <Field v-slot="{ field, errorMessage }" name="lastName">
                        <VField>
                          <VControl
                            icon="feather:type"
                            :has-error="Boolean(errorMessage)"
                          >
                            <input
                              v-model="lastName"
                              v-bind="field"
                              class="input"
                              type="text"
                              placeholder="Last Name"
                              autocomplete="name"
                            />
                            <p v-if="errorMessage" class="help is-danger">
                              {{ errorMessage }}
                            </p>
                          </VControl>
                        </VField>
                      </Field>

                      <!-- Input -->
                      <Field v-slot="{ field, errorMessage }" name="email">
                        <VField>
                          <VControl
                            icon="feather:mail"
                            :has-error="Boolean(errorMessage)"
                          >
                            <input
                              v-model="email"
                              v-bind="field"
                              class="input"
                              type="text"
                              :placeholder="t('auth.placeholder.email')"
                            />
                            <p v-if="errorMessage" class="help is-danger">
                              {{ errorMessage }}
                            </p>
                          </VControl>
                        </VField>
                      </Field>

                      <!-- Input -->
                      <Field v-slot="{ field, errorMessage }" name="password">
                        <VField>
                          <VControl
                            icon="feather:lock"
                            :has-error="Boolean(errorMessage)"
                          >
                            <input
                              v-model="password"
                              v-bind="field"
                              class="input"
                              type="password"
                              :placeholder="t('auth.placeholder.password')"
                            />
                            <p v-if="errorMessage" class="help is-danger">
                              {{ errorMessage }}
                            </p>
                          </VControl>
                        </VField>
                      </Field>


                      <!-- Input -->
                      <Field
                          v-slot="{ field, errorMessage }"
                          name="confirmPassword"
                      >
                        <VField>
                          <VControl
                              icon="feather:lock"
                              :has-error="Boolean(errorMessage)"
                          >
                            <input
                                v-model="confirmPassword"
                                v-bind="field"
                                class="input"
                                type="password"
                                placeholder="Confirm Password"
                            />
                            <p v-if="errorMessage" class="help is-danger">
                              {{ errorMessage }}
                            </p>
                          </VControl>
                        </VField>
                      </Field>

                      <!-- Submit -->

                      <VField>
                        <VControl class="login">
                          <VButton
                            type="submit"
                            color="primary"
                            bold
                            fullwidth
                            raised
                          >
                            {{ t("auth.action.signup") }}
                          </VButton>
                        </VControl>
                      </VField>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Image section (hidden on mobile) -->
    <div class="column login-column is-7 is-hidden-mobile hero-banner">
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
  </div>
</template>
