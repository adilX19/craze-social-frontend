<script setup lang="ts">
import {computed, onMounted, ref, watch} from 'vue'

import { onceImageErrored } from '/@src/utils/via-placeholder'
import {useI18n} from "vue-i18n";
import {useStorage} from "@vueuse/core";
import {useUserSession} from "/@src/stores/userSession";
import SecurityService from "/@src/services/SecurityService";


// OBJECT FOR TEAMS
const teams = ref([{
  id: '1',
  name: 'Microsoft Teams',
  image: '/images/integrations/ms-teams.png',
  status: 'NOT_CONNECTED'
}])

// OBJECT FOR GOOGLE SHEETS
const gSheets = ref([{
  id: '2',
  name: 'Google Drive',
  image: '/images/integrations/gsheets.png',
  status: 'NOT_CONNECTED'
}])

// OBJECT FOR SlACK
const slacks = ref([{
  id: '3',
  name: 'Slack',
  image: '/images/integrations/slack2.png',
  status: 'NOT_CONNECTED'
}])

// OBJECT FOR MAILS
const mails = ref([{
  id: '4',
  name: 'Emails',
  image: '/images/integrations/mails.png',
  status: 'NOT_CONNECTED'
}])

// OBJECT FOR CLICKUP
const clickups = ref([{
  id: '5',
  name: 'ClickUp',
  image: '/images/integrations/clickup.png',
  status: 'NOT_CONNECTED'
}])

// OBJECT FOR ONE-DRIVE
const onedrives = ref([{
  id: '6',
  name: 'One Drive',
  image: '/images/integrations/onedrive.png',
  status: 'NOT_CONNECTED'
}])

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



const userSession = useUserSession()
const isLoading = ref(false)

const isReadOnly = true

// TEAMS VARIABLES
const teamLink = ref('')
const isTeamsConnected = ref(false)
const teamConnectOpen = ref(false)
const teamDescription = ref('')
const team = ref({})

// GOOGLE SHEETS VARIABLES
const googleLink = ref('')
const isGoogleSheetConnected = ref(false)
const googleSheetConnectOpen = ref(false)
const googleDescription = ref('')
const gsheet = ref({})

// SLACK VARIABLES
const slackLink = ref('')
const slackChannel = ref('')
const isSlackConnected = ref(false)
const slackDescription = ref('')
const slackConnectOpen = ref(false)
const slack = ref({})


// MAILS VARIABLES
const mailConnectOpen = ref(false)
const emailAddress1 = ref('')
const emailAddress2 = ref('')
const emailAddress3 = ref('')
const emailAddress4 = ref('')
const mail = ref({})

// CLICKUP VARIABLES
const clickUpConnectOpen = ref(false)
const clickup = ref({})


// ONE DRIVE VARIABLES
const oneDriveEmail = ref('')
const oneDriveFolderName = ref('')
const isOneDriveConnected = ref(false)
const oneDriveDescription = ref('')
const oneDriveConnectOpen = ref(false)
const onedrive = ref({})

// const userSession = useUserSession()
// const isLoading = ref(false)

// TEAMS FUNCTIONS
const getTeam = () => {
  isLoading.value = true
  SecurityService.refreshAccessToken().then(function (res: { data: { access: string; }; }) {
    if (res.data.access) {
      useUserSession().setToken(res.data.access)
    }
    SecurityService.getDashboard({}).then(function (response: { data: any }) {
      // console.log(response.data)
      teamLink.value = response.data.teams_link
      isTeamsConnected.value = response.data.is_teams_connected
      teamDescription.value = response.data.teams_desc
      isLoading.value = false
    }).catch(function (error: any) {
      console.log(error)
      isLoading.value = false
    });
  }).catch(function () {
    isLoading.value = false
  })
}

const setTeam = () => {
  isLoading.value = true
  SecurityService.refreshAccessToken().then(function (res: { data: { access: string; }; }) {
    if (res.data.access) {
      useUserSession().setToken(res.data.access)
    }
    SecurityService.getDashboard({}).then(function (response: { data: any }) {
      // console.log(response.data)
      SecurityService.setTeam({
        user_id: response.data.user_id,
        t_url: teamLink.value
      }).then(function (responseTeam: { data: any }) {
        console.log(responseTeam.data)
        teamConnectOpen.value = false
        getTeam()
        isLoading.value = false
      }).catch(function (error: any) {
        console.log(error)
        isLoading.value = false
      });
    }).catch(function (error: any) {
      console.log(error)
      isLoading.value = false
    });
  })
}


// FUNCTIONS FOR GOOGLE SHEETS...
const getGoogleSheets = () => {
  isLoading.value = true
  SecurityService.refreshAccessToken().then(function (res: { data: { access: string; }; }) {
    if (res.data.access) {
      useUserSession().setToken(res.data.access)
    }
    SecurityService.getDashboard({}).then(function (response: { data: any }) {
      googleLink.value = response.data.google_link
      isGoogleSheetConnected.value = response.data.is_google_connected
      googleDescription.value = response.data.google_desc
      isLoading.value = false
    }).catch(function (error: any) {
      console.log(error)
      isLoading.value = false
    });
  }).catch(function () {
    isLoading.value = false
  })
}

const setGoogleSheets = () => {
  isLoading.value = true
  SecurityService.refreshAccessToken().then(function (res: { data: { access: string; }; }) {

    if (res.data.access) {
      useUserSession().setToken(res.data.access)
    }

    SecurityService.getDashboard({}).then(function (response: { data: any }) {

      SecurityService.setGoogleSheets({
        g_url: googleLink.value
      }).then(function (responseGoogle: { data: any }) {
        console.log(responseGoogle.data)
        googleSheetConnectOpen.value = false
        getGoogleSheets()
        isLoading.value = false
      }).catch(function (error: any) {
        console.log(error)
        isLoading.value = false
      });

    }).catch(function (error: any) {
      console.log(error)
      isLoading.value = false
    });

  }).catch(function () {
    isLoading.value = false
  })
}

// FUNCTIONS FOR SLACK...
const getSlack = () => {
  isLoading.value = true
  SecurityService.refreshAccessToken().then(function (res: { data: { access: string; }; }) {
    if (res.data.access) {
      useUserSession().setToken(res.data.access)
    }
    SecurityService.getDashboard({}).then(function (response: { data: any }) {
      slackLink.value = response.data.slack_link
      slackChannel.value = response.data.slack_channel
      isSlackConnected.value = response.data.is_slack_connected
      slackDescription.value = response.data.slack_desc
      isLoading.value = false
    }).catch(function (error: any) {
      console.log(error)
      isLoading.value = false
    });
  }).catch(function () {
    isLoading.value = false
  })
}

const setSlack = () => {
  isLoading.value = true
  SecurityService.refreshAccessToken().then(function (res: { data: { access: string; }; }) {

    if (res.data.access) {
      useUserSession().setToken(res.data.access)
    }

    SecurityService.getDashboard({}).then(function (response: { data: any }) {

      SecurityService.setSlack({
        s_channel:slackChannel.value,
        s_url: slackLink.value
      }).then(function (responseSlack: { data: any }) {
        // console.log(responseSlack.data)
        slackConnectOpen.value = false
        getSlack()
        isLoading.value = false
      }).catch(function (error: any) {
        console.log(error)
        isLoading.value = false
      });

    }).catch(function (error: any) {
      console.log(error)
      isLoading.value = false
    });

  }).catch(function () {
    isLoading.value = false
  })
}

// FUNCTIONS FOR MAILS
const getMail = () => {
  isLoading.value = true
  SecurityService.refreshAccessToken().then(function (res: { data: { access: string; }; }) {
    if (res.data.access) {
      useUserSession().setToken(res.data.access)
    }
    SecurityService.getDashboard({}).then(function (response: { data: any }) {
      emailAddress1.value = response.data.mails.email_1
      emailAddress2.value = response.data.mails.email_2
      emailAddress3.value = response.data.mails.email_3
      emailAddress4.value = response.data.mails.email_4
      isLoading.value = false
    }).catch(function (error: any) {
      console.log(error)
      isLoading.value = false
    });
  }).catch(function () {
    isLoading.value = false
  })
}

const setMail = () => {
  isLoading.value = true
  SecurityService.refreshAccessToken().then(function (res: { data: { access: string; }; }) {

    if (res.data.access) {
      useUserSession().setToken(res.data.access)
    }

    SecurityService.getDashboard({}).then(function (response: { data: any }) {
      SecurityService.getMail({
        e_1:emailAddress1.value,
        e_2:emailAddress2.value,
        e_3:emailAddress3.value,
        e_4:emailAddress4.value,
      }).then(function (responseMail: { data: any }) {
        // console.log(responseSlack.data)
        mailConnectOpen.value = false
        getMail()
        isLoading.value = false
      }).catch(function (error: any) {
        console.log(error)
        isLoading.value = false
      });

    }).catch(function (error: any) {
      console.log(error)
      isLoading.value = false
    });

  }).catch(function () {
    isLoading.value = false
  })
}

// ONE DRIVE FUNCTIONS
const getOneDrive = () => {
  isLoading.value = true
  SecurityService.refreshAccessToken().then(function (res: { data: { access: string; }; }) {
    if (res.data.access) {
      useUserSession().setToken(res.data.access)
    }
    SecurityService.getDashboard({}).then(function (response: { data: any }) {
      oneDriveEmail.value = response.data.onedrive_shared_email
      oneDriveDescription.value = response.data.onedrive_desc
      oneDriveFolderName.value = response.data.onedrive_shared_folder_name
      isOneDriveConnected.value = response.data.onedrive_connected
      isLoading.value = false
    }).catch(function (error: any) {
      console.log(error)
      isLoading.value = false
    });
  }).catch(function () {
    isLoading.value = false
  })
}

const setOneDrive = () => {
  isLoading.value = true
  SecurityService.refreshAccessToken().then(function (res: { data: { access: string; }; }) {

    if (res.data.access) {
      useUserSession().setToken(res.data.access)
    }

    SecurityService.getDashboard({}).then(function (response: { data: any }) {
      SecurityService.getOneDrive({
        e_1:oneDriveEmail.value,
        folder:oneDriveFolderName.value,
      }).then(function (responseOneDrive: { data: any }) {
        // console.log(responseSlack.data)
        oneDriveConnectOpen.value = false
        getOneDrive()
        isLoading.value = false
      }).catch(function (error: any) {
        console.log(error)
        isLoading.value = false
      });

    }).catch(function (error: any) {
      console.log(error)
      isLoading.value = false
    });

  }).catch(function () {
    isLoading.value = false
  })
}


onMounted(() => {
  getTeam()
  getGoogleSheets()
  getSlack()
  getMail()
  getOneDrive()
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
        <!--Grid item: TEAMS CARD-->
        <div v-for="item in teams" :key="item.id" class="column is-3">
          <div class="card-grid-item cursor-pointer" @click="[teamConnectOpen = true, team = item]">
            <img
              :src="item.image"
              :alt="item.name"
              @error.once="(event) => onceImageErrored(event, '400x300')"
            />
            <hr class="my-2" />
            <div class="card-grid-item-content">
              <h3 class="dark-inverted">
                {{ item.name }}
              </h3>
            </div>
            <div class="card-grid-item-footer">
              <div class="meta">
                <span class="dark-inverted" :class="isTeamsConnected ? 'has-text-success' : 'has-text-danger'">{{ isTeamsConnected ? 'Connected' : 'Not Connected' }} {{ teamDescription }}</span>
              </div>
            </div>
          </div>
        </div>

        <!--Grid item: GOOGLE DRIVE CARD-->
        <div v-for="item in gSheets" :key="item.id" class="column is-3">
          <div class="card-grid-item cursor-pointer" @click="[googleSheetConnectOpen = true, gsheet = item]">
            <img
              :src="item.image"
              :alt="item.name"
              @error.once="(event) => onceImageErrored(event, '400x300')"
            />
            <hr class="my-2" />
            <div class="card-grid-item-content">
              <h3 class="dark-inverted">
                {{ item.name }}
              </h3>
            </div>
            <div class="card-grid-item-footer">
              <div class="meta">
                <span class="dark-inverted" :class="isGoogleSheetConnected ? 'has-text-success' : 'has-text-danger'">{{ isGoogleSheetConnected ? 'Connected' : 'Not Connected' }} {{ googleDescription }}</span>
              </div>
            </div>
          </div>
        </div>

        <!--Grid item: SLACK CARD-->
        <div v-for="item in slacks" :key="item.id" class="column is-3">
          <div class="card-grid-item cursor-pointer" @click="[slackConnectOpen = true, slack = item]">
            <img
              :src="item.image"
              :alt="item.name"
              @error.once="(event) => onceImageErrored(event, '400x300')"
            />
            <hr class="my-2" />
            <div class="card-grid-item-content">
              <h3 class="dark-inverted">
                {{ item.name }}
              </h3>
            </div>
            <div class="card-grid-item-footer">
              <div class="meta">
                <span class="dark-inverted" :class="isSlackConnected ? 'has-text-success' : 'has-text-danger'">{{ isSlackConnected ? 'Connected' : 'Not Connected' }} {{ slackDescription }}</span>
              </div>
            </div>
          </div>
        </div>

        <!--Grid item: MAIL CARD-->
        <div v-for="item in mails" :key="item.id" class="column is-3">
          <div class="card-grid-item cursor-pointer" @click="[mailConnectOpen = true, mail = item]">
            <img
              :src="item.image"
              :alt="item.name"
              @error.once="(event) => onceImageErrored(event, '400x300')"
            />
            <hr class="my-2" />
            <div class="card-grid-item-content">
              <h3 class="dark-inverted">
                {{ item.name }}
              </h3>
            </div>
            <div class="card-grid-item-footer">
              <div class="meta">
                <span class="dark-inverted" :class="'has-text-success'">Active</span>             
              </div>
            </div>
          </div>
        </div>

        <!--Grid item: CLICKUP CARD-->
        <div v-for="item in clickups" :key="item.id" class="column is-3">
          <div class="card-grid-item cursor-pointer" @click="[clickUpConnectOpen = true, clickup = item]">
            <img
              :src="item.image"
              :alt="item.name"
              @error.once="(event) => onceImageErrored(event, '400x300')"
            />
            <hr class="my-2" />
            <div class="card-grid-item-content">
              <h3 class="dark-inverted">
                {{ item.name }}
              </h3>
            </div>
            <div class="card-grid-item-footer">
              <div class="meta">
                <span class="dark-inverted" :class="'has-text-success'">Coming Soon...</span>             
              </div>
            </div>
          </div>
        </div>

        <!--Grid item: ONE DRIVE CARD-->
        <div v-for="item in onedrives" :key="item.id" class="column is-3">
          <div class="card-grid-item cursor-pointer" @click="[oneDriveConnectOpen = true, onedrive = item]">
            <img
              :src="item.image"
              :alt="item.name"
              @error.once="(event) => onceImageErrored(event, '400x300')"
            />
            <hr class="my-2" />
            <div class="card-grid-item-content">
              <h3 class="dark-inverted">
                {{ item.name }}
              </h3>
            </div>
            <div class="card-grid-item-footer">
              <div class="meta">
                <span class="dark-inverted" :class="isOneDriveConnected ? 'has-text-success' : 'has-text-danger'">{{ isOneDriveConnected ? 'Connected' : 'Not Connected' }} {{ oneDriveDescription }}</span>             
              </div>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </div>

  <!-- TEAMS MODEL POPUP -->
  <VModal
      :open="teamConnectOpen"
      :title="`${t('connect')} to ${team.name}`"
      size="small"
      actions="right"
      :cancel-label="t('cancel')"
      @close="(teamConnectOpen = false)"
  >
    <template #content>
      <form class="modal-form" @submit.prevent="setTeam">
        <VField>
          <VControl icon="feather:link">
            <input
                v-model="teamLink"
                name="t_url"
                class="input"
                type="text"
                :placeholder="t('link')"
            />
          </VControl>
        </VField>
      </form>
    </template>
    <template #action>
      <VButton color="primary" raised @click="setTeam">{{ t('connect') }}</VButton>
    </template>
  </VModal>

  <!-- GOOGLE DRIVE MODEL POPUP -->
  <VModal
      :open="googleSheetConnectOpen"
      :title="`${t('connect')} to ${gsheet.name}`"
      actions="right"
      :cancel-label="t('cancel')"
      @close="(googleSheetConnectOpen = false)"
  >
    <template #content>
      <form class="modal-form" @submit.prevent="setGoogleSheets">
        <VField>
          <VControl icon="feather:link">
            <input
                v-model="googleLink"
                name="g_url"
                class="input"
                type="text"
                :placeholder="'Google Drive Folder Link'"
            />
          </VControl>
        </VField>

        <VField>
          <VControl icon="feather:clipboard">
            <input
                name="email"
                class="input"
                type="text"
                :value="'craze-social@leafy-tenure-352208.iam.gserviceaccount.com'"
                v-bind:readonly="isReadOnly"
            />
          </VControl>
        </VField>

        <small><b>NOTE</b>: Allow this email to access your Google Drive folder.</small>

      </form>
    </template>
    <template #action>
      <VButton color="primary" raised @click="setGoogleSheets">{{ t('connect') }}</VButton>
    </template>
  </VModal>


  <!-- SLACK MODEL POPUP -->
  <VModal
      :open="slackConnectOpen"
      :title="`${t('connect')} to ${slack.name}`"
      actions="right"
      :cancel-label="t('cancel')"
      @close="(slackConnectOpen = false)"
  >
    <template #content>
      <form class="modal-form" @submit.prevent="setSlack">
        <VField>
          <VControl icon="feather:user">
            <input
                v-model="slackChannel"
                name="s_channel"
                class="input"
                type="text"
                :placeholder="'Slack Channel Name'"
            />
          </VControl>
        </VField>

        <VField>
          <VControl icon="feather:link">
            <input
                v-model="slackLink"
                name="s_url"
                class="input"
                type="text"
                :placeholder="'Slack Channel Link'"
            />
          </VControl>
        </VField>

      </form>
    </template>
    <template #action>
      <VButton color="primary" raised @click="setSlack">{{ t('connect') }}</VButton>
    </template>
  </VModal>

  <!-- MAIL MODEL POPUP -->
  <VModal
      :open="mailConnectOpen"
      :title="`${t('connect')} to ${mail.name}`"
      actions="right"
      :cancel-label="t('cancel')"
      @close="(mailConnectOpen = false)"
  >
    <template #content>
      <form class="modal-form" @submit.prevent="setMail">
        <VField>
          <VControl icon="feather:mail">
            <input
                v-model="emailAddress1"
                name="e_1"
                class="input"
                type="text"
                :placeholder="'Email address 1'"
            />
          </VControl>
        </VField>

        <VField>
          <VControl icon="feather:mail">
            <input
                v-model="emailAddress2"
                name="e_2"
                class="input"
                type="text"
                :placeholder="'Email address 2'"
            />
          </VControl>
        </VField>

        <VField>
          <VControl icon="feather:mail">
            <input
                v-model="emailAddress3"
                name="e_3"
                class="input"
                type="text"
                :placeholder="'Email address 3'"
            />
          </VControl>
        </VField>

        <VField>
          <VControl icon="feather:mail">
            <input
                v-model="emailAddress4"
                name="e_4"
                class="input"
                type="text"
                :placeholder="'Email address 4'"
            />
          </VControl>
        </VField>

      </form>
    </template>
    <template #action>
      <VButton color="primary" raised @click="setMail">{{ t('connect') }}</VButton>
    </template>
  </VModal>

  <!-- ONE DRIVE MODEL POPUP -->
  <VModal
      :open="oneDriveConnectOpen"
      :title="`${t('connect')} to ${onedrive.name}`"
      actions="right"
      :cancel-label="t('cancel')"
      @close="(oneDriveConnectOpen = false)"
  >
    <template #content>
      <form class="modal-form" @submit.prevent="setOneDrive">
        <VField>
          <VControl icon="feather:mail">
            <input
                v-model="oneDriveEmail"
                name="e_1"
                class="input"
                type="text"
                :placeholder="'One Drive Email'"
            />
          </VControl>
        </VField>

        <VField>
          <VControl icon="feather:folder">
            <input
                v-model="oneDriveFolderName"
                name="folder"
                class="input"
                type="text"
                :placeholder="'One Drive Folder Name'"
            />
          </VControl>
        </VField>

        <VField>
          <VControl icon="feather:clipboard">
            <input
                name="onedrive_email"
                class="input"
                type="text"
                :value="'t.tariq@dviz.tech'"
                v-bind:readonly="isReadOnly"
            />
          </VControl>
        </VField>

        <small><b>NOTE</b>: Allow this email to access your One Drive folder.</small>

      </form>
    </template>
    <template #action>
      <VButton color="primary" raised @click="setOneDrive">{{ t('connect') }}</VButton>
    </template>
  </VModal>

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
      height: 200px;
      object-fit: scale-down;
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
