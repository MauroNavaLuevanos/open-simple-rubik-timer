<template lang="pug">
  div.h-100.d-flex.flex-column#timer
    div.d-flex.py-3.container.flex-wrap.flex-md-nowrap#scramble(v-if="scramble")
      div.col-md-2.pr-3.pl-0.mb-3
          cube-selector(@update-cube="generateScramble")/
      p.w-100.px-3.text-center {{ scramble[0] }}
      div.pl-3.pr-0
        button.btn.p-1#generate-scramble(@click="generateScramble()")
          refresh-ccw-icon/
    div.h-100.d-flex.align-items-center.justify-content-center.flex-column#clock
      p.py-3.mb-0.time#last-time(
        @click="switchTimer"
        v-html="lastTime"
      )
      div.py-3.mb-0.time#timing(
        :class="runningTime ? 'active' : null"
        v-show="runningTime"
        @click="switchTimer"
        v-html="transformedTime"
      )
      div.btn-group
        button.btn.px-3(@click="deleteTime(0)")
          trash-icon/
        button.btn.px-3
          message-circle-icon/
        button.btn.px-3 &plus;2
        button.btn.px-3 DNF
</template>

<script>
import Scrambo from 'scrambo'
import {
  mapMutations,
  mapActions,
  mapState
} from 'vuex'
import {
  MessageCircleIcon,
  RefreshCcwIcon,
  TrashIcon
} from 'vue-feather-icons'

import CubeSelector from '@/components/shared/CubeSelector'

class Time {
  constructor (time, cube, scramble) {
    const now = new Date()
    const timeTransformed = new Date(time)
    // NOTE: The time tke the timestamp as the id 'cause is unique
    this.id = now.getTime()
    this.time = time
    this.cube = cube
    this.scramble = scramble
    this.getDate = () => `${now.getFullYear()}/${now.getMonth() + 1}`
    this.getTime = function () {
      return `
        ${timeTransformed.getMinutes() ? `${timeTransformed.getMinutes()}:` : ''}
        ${timeTransformed.getSeconds()}
        .${timeTransformed.getMilliseconds() / 100}<small>s</small>
      `.trim()
    }
    this.dnf = false
    this.plus2 = false
  }
}

export default {
  name: 'Timer',
  components: {
    MessageCircleIcon,
    RefreshCcwIcon,
    CubeSelector,
    TrashIcon
  },
  data: () => (
    {
      lastTime: '0<small>s<small>',
      runningTime: false,
      scramble: null,
      time: 0
    }
  ),
  methods: {
    ...mapMutations([
      'deleteTime'
    ]),
    ...mapActions(['onPushTime']),
    generateScramble () {
      this.scramble = new Scrambo().type(this.currentCube).get()
      this.time = 0
    },
    switchTimer () {
      if (this.runningTime) {
        this.runningTime = false
        this.lastTime = this.transformedTime
        this.onPushTime(new Time(
          this.time * 100,
          this.currentCube,
          this.scramble[0]
        ))
        this.time = 0
        this.generateScramble()
      } else if (!this.runningTime) {
        this.runningTime = true
        this.time = 0
      }
    }
  },
  mounted () {
    setInterval(() => this.time++, 100)
    this.generateScramble()
    document.body.onkeyup = function (event) {
      if (event.keyCode === 32) {
        alert('putos')
      }
    }
  },
  computed: {
    ...mapState([
      'currentCube'
    ]),
    transformedTime () {
      let transformed = ''
      let current = new Date(this.time * 100)
      // eslint-disable-next-line
      current.getMinutes() ? transformed += `${current.getMinutes()}:` : null
      transformed += current.getSeconds()
      transformed += `.${current.getMilliseconds() / 100}<small>s</small>`
      return transformed
    }
  }
}
</script>

<style lang="scss" scoped>
#timer {
  transform: translate(0);
  #scramble {
    word-spacing: .5rem;
    font-size: 1.5rem;
  }
  #clock {
    .time {
      text-align: center;
      font-size: 5rem;
      cursor: pointer;
      width: 100%;
      &#timing {
        justify-content: center;
        align-items: center;
        position: absolute;
        background: #fff;
        display: flex;
        z-index: 1000;
        height: 100%;
        left: 0;
        top: 0;
      }
    }
  }
}
</style>
