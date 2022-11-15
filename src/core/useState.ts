import { ref } from 'vue'

const paused = ref(false)
const animationSkipped = ref(false)

export default function () {
  return {
    paused,
    animationSkipped
  }
}
