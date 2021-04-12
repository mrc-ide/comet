import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
  state: {
    count: 0,
  },
  mutations: {
    increment(state, amount) {
      state.count += amount;
    },
  },
  actions: {
    async increment({ commit }) {
      const { data } = await axios.get('/random', { params: { min: 1, max: 10 } });
      const { data: randomAmount } = data;
      commit('increment', randomAmount);
    },
  },
  modules: {
  },
});
