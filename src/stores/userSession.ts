import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useStorage } from '@vueuse/core'

export type UserData = Record<string, any> | null

export const useUserSession = defineStore('userSession', () => {
  // token will be synced with local storage
  // @see https://vueuse.org/core/usestorage/
  const token = useStorage('token', '')
  const refreshToken = useStorage('refreshToken', '')
  const profileImage = useStorage('profileImage', '')
  const userFullName = useStorage('userFullName', '')

  // session timestame
  const sessionTimestamp = useStorage('sessionTimestamp', '')

  const user = ref<Partial<UserData>>()
  const loading = ref(true)

  const isLoggedIn = computed(() => token.value !== undefined && token.value !== '')

  function setUser(newUser: Partial<UserData>) {
    user.value = newUser
  }

  function setToken(newToken: string) {
    token.value = newToken
  }

  function setRefreshToken(newRefreshToken: string) {
    refreshToken.value = newRefreshToken
  }

  function setProfileImage(newProfileImage: string) {
    profileImage.value = newProfileImage
  }

  function setUserFullName(newUserFullName: string) {
    userFullName.value = newUserFullName
  }

  function setLoading(newLoading: boolean) {
    loading.value = newLoading
  }

  // user session timestamp from backend
  function setSessionTimestamp(newSessionTimeStamp: string) {
    sessionTimestamp.value = newSessionTimeStamp
  }

  async function logoutUser() {
    token.value = undefined
    refreshToken.value = undefined
    localStorage.setItem('refreshToken', '')
    profileImage.value = undefined
    localStorage.setItem('profileImage', '')
    userFullName.value = undefined
    localStorage.setItem('userFullName', '')
    user.value = undefined

    // empty session value
    sessionTimestamp.value = undefined
    localStorage.setItem('sessionTimestamp', '')
  }

  return {
    user,
    token,
    refreshToken,
    profileImage,
    userFullName,
    isLoggedIn,
    loading,
    logoutUser,
    setSessionTimestamp, // exporting sessionTimeout funcion
    setUser,
    setToken,
    setRefreshToken,
    setProfileImage,
    setUserFullName,
    setLoading,
  } as const
})

/**
 * Pinia supports Hot Module replacement so you can edit your stores and
 * interact with them directly in your app without reloading the page.
 *
 * @see https://pinia.esm.dev/cookbook/hot-module-replacement.html
 * @see https://vitejs.dev/guide/api-hmr.html
 */
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserSession, import.meta.hot))
}
