import Vue from 'vue'
import Vuex from 'vuex'
import jQuery from 'jquery'

// NOTE: jQuery is used only for Bootstrap events
const $ = jQuery

Vue.use(Vuex)

let store = new Vuex.Store({
  state: {
    notificationsFadeTime: 5000, // milliseconds
    color: 'rgb(72, 92, 212)',
    currentCube: '333',
    loadingPage: true,
    notifications: [],
    timesList: []
  },
  mutations: {
    deleteTime (state, index) {
      state.timesList.splice(index, 1)
    },
    pushTime (state, time) {
      state.timesList.unshift(time)
    },
    updateCube (state, cube) {
      state.currentCube = cube
    },
    updateLoadingPage (state, value) {
      state.loadingPage = value
    },
    setTimes (state, times) {
      state.timesList = times
    },
    addNotification (state, notification) {
      // NOTE: The notification structure is:
      //       {
      //         type: String // Bootstrap classes,
      //         message: String // Any, will be rendered as html
      //       }
      state.notifications.push(notification)
      setTimeout(() => {
        state.notifications.shift()
      }, state.notificationsFadeTime)
    }
  },
  actions: {
    onPushTime ({commit, state}, time) {
      commit('pushTime', time)
      window.localStorage.setItem(
        'times',
        JSON.stringify(state.timesList)
      )
    },
    onDeleteTime ({commit, state}, id) {
      let notification = {
        type: 'danger',
        message: `<strong>${id}<strong> Invalid id`
      }
      if (id) {
        let index = state.timesList.findIndex(time => time.id === id)
        if (index !== -1) {
          commit('deleteTime', index)
          notification.type = 'success'
          notification.message = `<strong>${id}<strong> Time was deleted`
          $('#edit-time-modal').modal('hide')
          window.localStorage.setItem(
            'times',
            JSON.stringify(state.timesList)
          )
        } else {
          notification.message = `<strong>${id}</strong> Time was not founded`
        }
      }
      commit('addNotification', notification)
    }
  }
})

export default store
