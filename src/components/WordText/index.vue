<template>
  <pre id="work-text" :class="workCls" v-show="show" ref="el">
    <div v-if="preview" v-html="text"></div>
    <div v-else>
      <div class="text" v-html="workText"></div>
      <div class="md" v-html="mdText"></div>
    </div>
  </pre>
</template>

<script setup lang="ts">
import rawText from './word.txt?raw'
// @ts-ignore
import Markdown from 'markdown'
// @ts-ignore
import wheel from 'mouse-wheel'
import { ref, computed, nextTick, unref } from 'vue'
import { delay } from '@/core/util'
import useWrite from '@/core/useWrite'

const toHTML = Markdown.markdown.toHTML

const flipped = ref(false)
const preview = ref(true)
const show = ref(false)
const workText = rawText
const mdText = toHTML(workText)
const el = ref<HTMLDivElement>()

const workCls = computed(() => (flipped.value ? 'flipped' : ''))

const { writeTo, speed, text } = useWrite()

async function write() {
  show.value = true
  await writeTo(el.value!, workText, 0, speed.value, false, 1)
}

function showWorkBox() {
  show.value = true
  preview.value = false
  flipped.value = true

  nextTick(() => {
    const $el = unref(el)!
    $el.scrollTop = 9999
    let flipping = false
    wheel(
      $el,
      async function (dx: number, dy: number) {
        if (flipping) {
          return
        }
        let half = ($el.scrollHeight - $el.clientHeight) / 2
        let pastHalf = flipped.value
          ? $el.scrollTop < half
          : $el.scrollTop > half

        if (pastHalf) {
          flipped.value = !flipped.value
          flipping = true
          await delay(500)
          $el.scrollTop = flipped.value ? 9999 : 0
          flipping = false
        }

        $el.scrollTop += dy * (flipped.value ? -1 : 1)
      },
      true
    )
  })
}

defineExpose({ write, showWorkBox })
</script>
