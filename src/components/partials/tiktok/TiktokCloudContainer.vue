<script setup lang="ts">

interface WordCloud {
  frequency: number
  words: Array<String>
}

const props = defineProps<{
  wordcloudData: Array<WordCloud>
}>()

const wordClouds = function () {
  let words: Array<Object> = []
  props.wordcloudData?.forEach(function(value : WordCloud) {
    value.words.forEach(function(word : String ) {
      let size = Math.floor(value.frequency * 10)
      words.push({ word: word, size: size })
    })
  })
  return words.map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value)
}
</script>
<template>
  <div class="cloud-container">
    <ul>
      <li v-for="word in wordClouds()"><a :class="`size${word.size}`" href="#">{{ word.word }}</a></li>
    </ul>
  </div>
</template>

<styles lang="scss">
.cloud-container {
  position: relative;
  text-align: center;

  ul {
    margin-top: 1.5rem;
    list-style-type: none;

    li {
      display: inline-block;

      a {
        text-decoration: none;
        line-height: 1.8em;
        font-family: var(--font);
        color: var(--dark-text);
        transition: background-color 0.3s, box-shadow 0.3s;

        &.size0 {
          font-size: 0.75rem;
          color: var(--light-text);
          padding: 3px;
          border-radius: 0.5rem;

          &:hover,
          &:focus {
            background-color: var(--purple);
            box-shadow: var(--purple-box-shadow);
            color: var(--white);
          }
        }

        &.size1 {
          color: var(--light-text);
          padding: 6px;
          border-radius: 0.5rem;

          &:hover,
          &:focus {
            background-color: var(--primary);
            box-shadow: var(--primary-box-shadow);
            color: var(--white);
          }
        }

        &.size2 {
          font-size: 1.25rem;
          padding: 12px;
          border-radius: 0.5rem;

          &:hover,
          &:focus {
            background-color: var(--danger);
            box-shadow: var(--danger-box-shadow);
            color: var(--white);
          }
        }

        &.size3 {
          font-size: 1.5rem;
          padding: 18px;
          border-radius: 0.75rem;
          color: var(--dark-text-light-18);

          &:hover,
          &:focus {
            background-color: var(--yellow);
            box-shadow: var(--yellow-box-shadow);
            color: var(--white);
          }
        }

        &.size4 {
          padding: 10px 16px;
          font-size: 1.75rem;
          border-radius: 0.75rem;

          &:hover,
          &:focus {
            background-color: var(--green);
            box-shadow: var(--green-box-shadow);
            color: var(--white);
          }
        }

        &.size5 {
          padding: 8px 14px;
          font-size: 2rem;
          border-radius: 0.75rem;

          &:hover,
          &:focus {
            background-color: var(--info);
            box-shadow: var(--info-box-shadow);
            color: var(--white);
          }
        }

        &.size6 {
          padding: 24px;
          font-size: 2.25rem;
          border-radius: 0.75rem;

          &:hover,
          &:focus {
            background-color: var(--purple);
            box-shadow: var(--purple-box-shadow);
            color: var(--white);
          }
        }

        &.size7 {
          padding: 6px 12px;
          font-size: 2.5rem;
          border-radius: 0.75rem;
          color: var(--dark-text-light-18);

        &:hover,
          &:focus {
            background-color: var(--danger);
            box-shadow: var(--danger-box-shadow);
            color: var(--white);
          }
        }

        &.size8 {
          padding: 22px;
          font-size: 2.75rem;
          border-radius: 0.75rem;
          color: var(--dark-text-light-18);

          &:hover,
          &:focus {
            background-color: var(--green);
            box-shadow: var(--green-box-shadow);
            color: var(--white);
          }
        }

        &.size9 {
          padding: 4px 10px;
          font-size: 3rem;
          border-radius: 0.75rem;
          color: var(--dark-text-light-18);

          &:hover,
          &:focus {
            background-color: var(--yellow);
            box-shadow: var(--yellow-box-shadow);
            color: var(--white);
          }
        }

        &.size10 {
          padding: 20px;
          font-size: 3.5rem;
          border-radius: 0.75rem;
          color: var(--dark-text-light-18);

          &:hover,
          &:focus {
            background-color: var(--primary);
            box-shadow: var(--primary-box-shadow);
            color: var(--white);
          }
        }
      }
    }
  }
}
.is-dark {
  .cloud-container {
    ul li a {
      color: var(--white);

      &.size-1 {
        color: var(--light-text) !important;
      }

      &.size-3 {
        color: var(--dark-text-light-25) !important;
      }

      &.size-4 {
        color: var(--dark-dark-text) !important;
      }
    }
  }
}
@media only screen and (min-width: 768px) and (max-width: 1024px) and (orientation: landscape) {
  .cloud-container {
    width: 400px !important;

    .cloud {
      width: 400px !important;
    }

    .cloud-element {
      font-size: 1.5em !important;

      &.size-2 {
        font-size: 2rem !important;
      }

      &.size-3 {
        font-size: 3rem !important;
      }
    }
  }
}
</styles>
