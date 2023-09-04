<script setup lang="ts">
import { onceImageErrored } from '/@src/utils/via-placeholder'
import {useI18n} from "vue-i18n";
import {useStorage} from "@vueuse/core";
import {watch} from "vue";
const props = defineProps<{
  profileData: any;
  postingHabit: any;
}>();

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const times = ['12am', '1am', '2am', '3am', '4am', '5am', '6am', '7am', '8am', '9am', '10am', '11am', '12pm', '1pm',
  '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm', '11pm']

const getDayName =  (day : String) => {
  switch (day) {
    case 'Mon': return 'Monday'
    case 'Tue': return 'Tuesday'
    case 'Wed': return 'Wednesday'
    case 'Thu': return 'Thursday'
    case 'Fri': return 'Friday'
    case 'Sat': return 'Saturday'
    case 'Sun': return 'Sunday'
  }
}

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
</script>

<template>
  <div class="heatmap-wrapper">
    <div class="heatmap-title">
      <div class="title-avatar">
        <img
            :src="props.profileData?.profilePicture"
          alt=""
          @error.once="(event) => onceImageErrored(event, '150x150')"
        />
      </div>
      <div class="title-meta">
        <p>
          {{ props.profileData?.fullName }} {{ t('generallyPostsMediaOn') }}:
          <template v-for="(topDay, topDayIndex) in props.postingHabit?.filter(x => x.frequency >=7 && x.frequency <= 10 )" :key="`topDayIndex-${topDayIndex}`">
            <span>{{ getDayName(topDay.day) }} at {{ topDay.time}}{{ (topDayIndex + 1) !== props.postingHabit?.filter(x => x.frequency >=7 && x.frequency <= 10 ).length ? ', ' : ''}}</span>
          </template>
        </p>
      </div>
    </div>

    <div class="heatmap-inner">
      <div v-for="(day, dayIndex) in days" :key="`day-${dayIndex}`" class="heatmap-row">
        <div class="heatmap-row-label">
          <span>{{ day }}</span>
        </div>
        <div class="heatmap-row-content">
          <template v-for="(time, timeIndex) in times" :key="`time-${dayIndex}-${timeIndex}`">
            <template v-if="props.postingHabit?.find(x => x.day === day && x.time === time)">
              <div v-if="props.postingHabit?.find(x => x.day === day && x.time === time).frequency < 4" class="heatmap-row-item heat-1"></div>
              <div v-else-if="props.postingHabit?.find(x => x.day === day && x.time === time).frequency < 7"  class="heatmap-row-item heat-2"></div>
              <div v-else-if="props.postingHabit?.find(x => x.day === day && x.time === time).frequency <= 10"  class="heatmap-row-item heat-3">
                <i aria-hidden="true" class="fas fa-fire"></i>
              </div>
            </template>
            <template v-else>
              <div class="heatmap-row-item"></div>
            </template>
          </template>
      </div>
      </div>
      <div class="heatmap-row">
        <div class="heatmap-row-label">
          <span></span>
        </div>
        <div class="heatmap-row-content">
          <div v-for="(time, timeIndex) in times" :key="`time-${timeIndex}`" class="heatmap-row-item is-time">
            <span>{{ time }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.heatmap-wrapper {
  .heatmap-title {
    display: flex;
    align-items: center;
    padding: 16px;

    .title-avatar {
      border-radius: var(--radius-rounded);
      border: 1px solid var(--fade-grey-dark-3);
      box-shadow: var(--light-box-shadow);

      img {
        display: block;
        height: 50px;
        width: 50px;
        min-width: 50px;
        border-radius: var(--radius-rounded);
        border: 3px solid var(--white);
      }
    }

    .title-meta {
      margin-left: 16px;

      p {
        span {
          color: var(--dark-text);
          font-weight: 500;
        }
      }
    }
  }

  .heatmap-inner {
    .heatmap-row {
      display: flex;
      align-items: center;

      .heatmap-row-label {
        width: 60px;
        text-align: center;
        color: var(--light-text);
        font-size: 0.95rem;
      }

      .heatmap-row-content {
        display: flex;
        flex-grow: 2;

        .heatmap-row-item {
          margin: 5px;
          flex: 1 1 0;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 34px;
          border-radius: var(--radius-large);
          background: var(--widget-grey-dark-2);

          &.heat-1 {
            background: var(--primary-grey-dark);
          }

          &.heat-2 {
            background: var(--primary-light-30);
          }

          &.heat-3 {
            background: var(--primary);

            i {
              color: var(--smoke-white);
              font-size: 12px;
            }
          }

          &.is-time {
            background: none;
            color: var(--light-text);
            font-size: 0.95rem;
            min-height: 26px;
          }
        }
      }
    }
  }
}

.is-dark {
  .heatmap-wrapper {
    .heatmap-title {
      .title-avatar {
        border-color: var(--dark-sidebar-light-12);

        img {
          border-color: var(--dark-sidebar-dark-2);
        }
      }

      .title-meta {
        p span {
          color: var(--dark-dark-text);
        }
      }
    }

    .heatmap-inner {
      .heatmap-row {
        .heatmap-row-content {
          .heatmap-row-item:not(.is-time) {
            background: var(--dark-sidebar-light-10);

            &.heat-1 {
              background: var(--dark-sidebar-light-2);
            }

            &.heat-2 {
              background: var(--primary-light-10);
            }

            &.heat-3 {
              background: var(--primary);

              i {
                color: var(--smoke-white);
              }
            }
          }
        }
      }
    }
  }
}
@media only screen and (min-width: 768px) and (max-width: 1024px) and (orientation: portrait) {
  .heatmap-wrapper {
    .heatmap-inner {
      .heatmap-row {
        .heatmap-row-label {
          width: 40px;
        }

        .heatmap-row-content {
          .heatmap-row-item {
            &:first-child,
            &:nth-child(2),
            &:nth-child(3),
            &:nth-child(4),
            &:nth-child(5),
            &:nth-child(6),
            &:nth-child(7),
            &:nth-child(8),
            &:nth-child(9) {
              display: none;
            }

            &.is-time {
              font-size: 0.85rem;
            }
          }
        }
      }
    }
  }
}

@media only screen and (min-width: 768px) and (max-width: 1024px) and (orientation: landscape) {
  .heatmap-wrapper {
    .heatmap-inner {
      .heatmap-row {
        .heatmap-row-label {
          width: 40px;
        }

        .heatmap-row-content {
          .heatmap-row-item {
            &:first-child,
            &:nth-child(2),
            &:nth-child(3),
            &:nth-child(4),
            &:nth-child(5),
            &:nth-child(6) {
              display: none;
            }

            &.is-time {
              font-size: 0.85rem;
            }
          }
        }
      }
    }
  }
}
</style>
