import { configureStore } from '@reduxjs/toolkit'
import logger from 'redux-logger';
import accountReducer from './account/accountSlice'
import venuesReducer from './venues/venuesSlice'

export const store = configureStore({
  reducer: {
    account: accountReducer,
    venues: venuesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(logger), // Add logger middleware
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch