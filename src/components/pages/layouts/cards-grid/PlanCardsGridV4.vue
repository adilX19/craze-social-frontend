<script setup lang="ts">
import {computed, onMounted, ref, watch} from 'vue'
import {useUserSession} from "/@src/stores/userSession";
import SecurityService from "/@src/services/SecurityService";
import { onceImageErrored } from '/@src/utils/via-placeholder'
import {useI18n} from "vue-i18n";
import {useStorage} from "@vueuse/core";


// OBJECT FOR INDIVIDUAL PLAN
const individualPlans = ref([{
  id: '1',
  name: 'Individual Plan',
  image: '/images/plans/single_plan_v2.png',
  status: 'NOT_CONNECTED'
}])

// OBJECT FOR PROFESSIONAL PLAN
const professionalPlans = ref([{
  id: '2',
  name: 'Professional Plan',
  image: '/images/plans/teams_plan.png',
  status: 'NOT_CONNECTED'
}])


const userSession = useUserSession()
const isLoading = ref(false)

const currentPlan = ref('')

// INDIVIDUAL PLAN VARIABLES
const individualPlanConnectOpen = ref(false)
const individual = ref({})

// PROFESSIONAL PLAN VARIABLES
const professionalPlanConnectOpen = ref(false)
const professional = ref({})

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


onMounted(() => {
  isLoading.value = true
  SecurityService.refreshAccessToken().then(function (res: { data: { access: string; }; }) {
    if (res.data.access) {
      useUserSession().setToken(res.data.access)
    }
    SecurityService.getDashboard({}).then(function (response: { data: any }) {
      currentPlan.value = response.data.user_plan
      isLoading.value = false
    }).catch(function (error: any) {
      console.log(error)
      isLoading.value = false
    });
  }).catch(function () {
    isLoading.value = false
  })
})

</script>

<template>
  <div
      v-if="isLoading"
      class="is-flex is-justify-content-center h-100 loader-wrap"
  >
    <button class="button loader is-large is-loading">Loading</button>
  </div>
  <div>
    <div class="card-grid card-grid-v4">
      <TransitionGroup name="list" tag="div" class="columns is-multiline">
        <!--Grid item-->
        <div v-for="item in individualPlans" :key="item.id" class="column is-3">
          <div class="card-grid-item cursor-pointer" @click="[individualPlanConnectOpen = true, individual = item]">
            <img
              :src="item.image"
              :alt="item.name"
              @error.once="(event) => onceImageErrored(event, '400x300')"
            />
            <hr class="my-2" />
            <div class="card-grid-item-content">
              <h3 class="dark-inverted">
                {{ item.name }}
                <span v-if="currentPlan == 'individual'" class="dark-inverted" :class="'has-text-success'">
                  (Current Plan)
                </span>
              </h3>
            </div>
            <div class="card-grid-item-footer">
              <div class="meta">
                <span class="dark-inverted">
                  100.$ / Month <br>
                  1 session per account
                </span>
              </div>
            </div>
          </div>
        </div>

        <!--Grid item: GOOGLE DRIVE CARD-->
        <div v-for="item in professionalPlans" :key="item.id" class="column is-3">
          <div class="card-grid-item cursor-pointer" @click="[professionalPlanConnectOpen = true, professional = item]">
            <img
              :src="item.image"
              :alt="item.name"
              @error.once="(event) => onceImageErrored(event, '400x300')"
            />
            <hr class="my-2" />
            <div class="card-grid-item-content">
              <h3 class="dark-inverted">
                {{ item.name }}
                <span v-if="currentPlan == 'pro'" class="dark-inverted" :class="'has-text-success'">
                  (Current Plan)
                </span>
              </h3>
            </div>
            <div class="card-grid-item-footer">
              <div class="meta">
                <span class="dark-inverted">
                  250.$ / Month <br>
                  5 sessions per account
                </span>
              </div>
            </div>
          </div>
        </div>

      </TransitionGroup>
    </div>
  </div>
</template>

<style lang="scss">
@import '../../../../scss/abstracts/mixins';

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

.card-grid-v4 {
  .card-grid-item {
    @include vuero-s-card;

    display: flex;
    flex-direction: column;
    padding: 10px;
    border-radius: 16px;
    min-height: 200px;

    &:hover,
    &:focus {
      box-shadow: var(--light-box-shadow);
    }

    > img {
      display: block;
      border-radius: 12px;
      width: 100%;
      height: auto;
      object-fit: cover;
    }

    .card-grid-item-content {
      padding: 12px 5px;

      h3 {
        font-family: var(--font-alt);
        font-size: 1rem;
        font-weight: 600;
        color: var(--dark-text);
        line-height: 1.3;
      }
    }

    .card-grid-item-footer {
      display: flex;
      align-items: center;
      margin-top: auto;
      padding: 0 5px 10px;

      .meta {
        margin-left: 8px;
        line-height: 1.2;

        span {
          display: block;
          font-weight: 400;

          &:first-child {
            font-family: var(--font-alt);
            font-size: 0.9rem;
            color: var(--dark-text);
            font-weight: 600;
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
}

.is-dark {
  .card-grid-v4 {
    .card-grid-item {
      @include vuero-card--dark;
    }
  }
}

@media only screen and (min-width: 768px) and (max-width: 1024px) and (orientation: portrait) {
  .card-grid-v4 {
    .columns {
      display: flex;
    }

    .column {
      width: 33.3%;
      min-width: 33.3%;
    }
  }
}

.cursor-pointer {
  cursor: pointer;
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
</style>
