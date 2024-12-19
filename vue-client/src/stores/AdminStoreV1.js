import { createStore } from 'vuex';

//First attempt at adminMode store, has been deprecated.
const store = createStore({
    state: {
        IsAdminMode: true, // Initial value for the toggle switch
      },
      mutations: {
        setIsAdminMode(state, value) {
          state.IsAdminMode = value; // Mutation to update the value
        },
      },
      actions: {
        updateIsAdminMode({ commit }, value) {
          commit('setIsAdminMode', value); // Action to commit the mutation
        },
      },
      getters: {
        IsAdminMode: (state) => state.IsAdminMode, // Getter to access the value
      },
});


export default store;