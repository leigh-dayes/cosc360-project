import { createStore } from 'vuex'
export default createStore({
  state: {
    restaurants: null, 
    reservations: null,
    currentRestaurant: null,
    currentReservation: null
  },
  mutations: {
    setRestaurants(state, restaurants) {
      state.restaurants = restaurants
    },
    setReservations(state, reservations) {
      state.reservations = reservations
    },
    setCurrentRestaurant(state, payload) {
      state.currentRestaurant = payload
    },
    setCurrentReservation(state, payload) {
      state.currentReservation = payload
    }  
  },
  actions: {
    initRestaurants ({ commit }) {
      fetch('http://localhost:3000/restaurants')
      .then(res => res.json())
      .then(data => commit('setRestaurants', data))
      .catch(err => console.error(err))
    },
    initReservations ({ commit }) {
      fetch('http://localhost:3000/bookings')
      .then(res => res.json())
      .then(data => commit('setReservations', data))
      .catch(err => console.error(err))
    },
    updateCurrentRestaurant ({ commit }, payload) {
      commit('setCurrentRestaurant', payload)
    },
    updateCurrentReservation ({ commit }, payload) {
      commit('setCurrentReservation', payload)
    },
    updateReservation ({ commit }, payload) {
      let id = this.state.currentReservation.booking_id
      fetch(`http://localhost:3000/bookings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      .then(response => {
        if(!response.ok){
          throw new Error(response.errors[0].msg)
        }
        commit('setCurrentReservation', payload)
      })
      .catch(error => {
        console.error("something wrong", error)
      })
    },
    createReservation ({ commit }, payload) {
      fetch('http://localhost:3000/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      .then(response => {
        if(!response.ok){
          throw Error(response.msg)
        }
        commit('setCurrentReservation', payload)
      })
      .catch(error => {
        error = JSON.stringify(error)
        console.error("something wrong", error)
      })
    },
    deleteReservation ({ commit }) {
      let id = this.state.currentReservation.booking_id
      fetch(`http://localhost:3000/bookings/${id}`, {
        method: 'DELETE' })
      .then(response => {
        if(!response.ok){
          throw new Error(response.msg)
        }
        commit('setCurrentReservation', null)
      })
      .catch(error => {
        console.error("something wrong", error)
      })
    }
  },
  getters: {
    getCurrent: (state) => {
      return state.currentRestaurant
    },
    getReservation: (state) => {
      return state.currentReservation
    },
    reservationData: (state) => {
      if (!state.reservations)
        return 0
      let results = []
      // see how many bookings for each restaurant
      function howManyBookings(reserv, restaur) {
        return reserv.filter((r) => (r.restaurant.restaurant_name === restaur)).length
      }
      for(let i = 0; i < state.reservations.length; i++) {
        let resName = state.reservations[i].restaurant.restaurant_name
        let numResrv = howManyBookings(state.reservations, resName)
        results.push({r_name: resName, r_num: numResrv})
      }
      const noDups = results.filter((restaurant, index) => {
        const rest = JSON.stringify(restaurant);
        return index === results.findIndex(obj => {
          return JSON.stringify(obj) === rest;
        });
      });

      return noDups
    }
  },
  modules: {
  }
})
