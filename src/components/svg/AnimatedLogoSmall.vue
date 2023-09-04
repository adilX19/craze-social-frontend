<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{
  light?: boolean
}>()

const router = useRouter()
const isLoading = ref(false)

router.beforeEach(() => {
  isLoading.value = true
})
router.afterEach(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 200)
})
</script>

<template>
  <svg width="70" height="64" viewBox="0 0 70 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.61227 21.016C7.61227 24.586 10.0943 27.085 13.6133 27.085C16.4523 27.085 18.5943 25.504 19.2743 22.92H16.0783C15.5853 23.94 14.6843 24.45 13.5793 24.45C11.7943 24.45 10.5703 23.124 10.5703 21.016C10.5703 18.908 11.7943 17.582 13.5793 17.582C14.6843 17.582 15.5853 18.092 16.0783 19.112H19.2743C18.5943 16.528 16.4523 14.93 13.6133 14.93C10.0943 14.93 7.61227 17.446 7.61227 21.016ZM27.3615 18.942C27.3615 19.877 26.8515 20.438 25.7635 20.438H23.9615V17.48H25.7635C26.8515 17.48 27.3615 18.058 27.3615 18.942ZM21.0545 15.066V27H23.9615V22.495H24.6585L27.1405 27H30.4215L27.6675 22.274C29.5035 21.73 30.3195 20.319 30.3195 18.823C30.3195 16.749 28.8575 15.066 25.9335 15.066H21.0545ZM40.2873 27H43.3643L39.0463 15.066H35.6803L31.3623 27H34.4053L35.1193 24.892H39.5733L40.2873 27ZM38.8253 22.648H35.8843L37.3463 18.279L38.8253 22.648ZM52.9065 15.066H44.4745V17.446H49.5745L44.4745 24.79V27H52.9065V24.62H47.7725L52.9065 17.276V15.066ZM62.1155 15.066H54.8055V27H62.1155V24.671H57.7125V22.053H61.6055V19.809H57.7125V17.395H62.1155V15.066ZM13.5131 43.447C13.5131 39.452 7.61406 40.387 7.61406 38.313C7.61406 37.565 8.14106 37.208 8.83806 37.225C9.62006 37.242 10.1641 37.701 10.2151 38.466H13.3601C13.2411 36.188 11.4901 34.896 8.88906 34.896C6.39006 34.896 4.53706 36.154 4.53706 38.415C4.50306 42.648 10.4701 41.458 10.4701 43.668C10.4701 44.365 9.92606 44.79 9.07606 44.79C8.26006 44.79 7.68206 44.348 7.59706 43.43H4.50306C4.58806 45.844 6.59406 47.119 9.16106 47.119C11.9491 47.119 13.5131 45.453 13.5131 43.447ZM27.049 40.999C27.049 37.412 24.346 34.896 20.946 34.896C17.563 34.896 14.809 37.412 14.809 40.999C14.809 44.586 17.563 47.119 20.946 47.119C24.329 47.119 27.049 44.586 27.049 40.999ZM17.784 40.999C17.784 38.874 19.008 37.531 20.946 37.531C22.85 37.531 24.091 38.874 24.091 40.999C24.091 43.09 22.85 44.467 20.946 44.467C19.008 44.467 17.784 43.09 17.784 40.999ZM28.1733 41.016C28.1733 44.586 30.6553 47.085 34.1743 47.085C37.0133 47.085 39.1553 45.504 39.8353 42.92H36.6393C36.1463 43.94 35.2453 44.45 34.1403 44.45C32.3553 44.45 31.1313 43.124 31.1313 41.016C31.1313 38.908 32.3553 37.582 34.1403 37.582C35.2453 37.582 36.1463 38.092 36.6393 39.112H39.8353C39.1553 36.528 37.0133 34.93 34.1743 34.93C30.6553 34.93 28.1733 37.446 28.1733 41.016ZM41.6155 47H44.5225V35.066H41.6155V47ZM54.7722 47H57.8492L53.5312 35.066H50.1652L45.8472 47H48.8902L49.6042 44.892H54.0582L54.7722 47ZM53.3102 42.648H50.3692L51.8312 38.279L53.3102 42.648ZM59.1634 35.066V47H65.8784V44.756H62.0704V35.066H59.1634Z" fill="#65c0f1"/>
  </svg>
</template>

<style lang="scss" scoped>
.right {
  fill: var(--primary-dark-7);
}

.bottom {
  fill: var(--primary);
}

.left {
  fill: var(--primary-light-15);
}

.is-roll,
svg:hover {
  .right {
    animation: is-roll-right 8s ease infinite;
    animation-fill-mode: forwards;
    animation-delay: 0s;
  }

  .left {
    animation: is-roll-left 8s ease infinite;
    animation-fill-mode: forwards;
    animation-delay: 0s;
  }

  .bottom {
    animation: is-roll-bottom 8s ease infinite;
    animation-fill-mode: forwards;
    animation-delay: 0s;
  }
}

.is-light {
  .right {
    fill: var(--white);
    animation: none;
  }

  .bottom {
    fill: #fffc;
    animation: none;
  }

  .left {
    fill: #fffa;
    animation: none;
  }
}

@keyframes is-roll-right {
  0% {
    fill: var(--primary-dark-7);
  }

  33% {
    fill: var(--primary-light-8);
  }

  66% {
    fill: var(--primary-light-40);
  }

  100% {
    fill: var(--primary-dark-7);
  }
}

@keyframes is-roll-bottom {
  0% {
    fill: var(--primary);
  }

  33% {
    fill: var(--primary-light-24); // darken(#1ee8c0, 7%);
  }

  66% {
    fill: var(--primary-light-20);
  }

  100% {
    fill: var(--primary);
  }
}

@keyframes is-roll-left {
  0% {
    fill: var(--primary-light-15);
  }

  33% {
    fill: var(--primary-light-12); // lighten(#1ee8c0, 15%);
  }

  66% {
    fill: var(--primary-light-15);
  }

  100% {
    fill: var(--primary-light-15);
  }
}
</style>
