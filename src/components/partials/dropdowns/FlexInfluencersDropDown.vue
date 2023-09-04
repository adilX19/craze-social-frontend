<script setup lang="ts">
const emits = defineEmits<{
  (e: 'update'): void
  (e: 'track'): void
  (e: 'details'): void
  (e: 'remove'): void
}>()
</script>

<template>
  <VDropdown icon="feather:more-vertical" class="is-pushed-mobile" spaced right>
    <template #content="{ close }">
      <a
        role="menuitem"
        href="#"
        class="dropdown-item is-media"
        @click.prevent="
          () => {
            emits('update')
            close()
          }
        "
      >
        <div class="icon">
          <i class="iconify" data-icon="feather:settings" aria-hidden="true"></i>
        </div>
        <div class="meta">
          <span>Update</span>
          <span>Update influencer details</span>
        </div>
      </a>

      <a
        role="menuitem"
        href="#"
        class="dropdown-item is-media"
        @click.prevent="
          () => {
            emits('track')
            close()
          }
        "
      >
        <div class="icon">
          <i class="iconify" data-icon="feather:eye" aria-hidden="true"></i>
        </div>
        <div class="meta">
          <span>Track</span>
          <span>Track this influencer</span>
        </div>
      </a>

      <a
        role="menuitem"
        href="#"
        class="dropdown-item is-media"
        @click.prevent="
          () => {
            emits('details')
            close()
          }
        "
      >
        <div class="icon">
          <i class="iconify" data-icon="feather:briefcase" aria-hidden="true"></i>
        </div>
        <div class="meta">
          <span>Details</span>
          <span>Get contact info</span>
        </div>
      </a>

      <hr class="dropdown-divider" />

      <a
        role="menuitem"
        href="#"
        class="dropdown-item is-media"
        @click.prevent="
          () => {
            emits('remove')
            close()
          }
        "
      >
        <div class="icon">
          <i class="iconify" data-icon="feather:trash" aria-hidden="true"></i>
        </div>
        <div class="meta">
          <span>Remove</span>
          <span>Remove from list</span>
        </div>
      </a>
    </template>
  </VDropdown>
</template>
