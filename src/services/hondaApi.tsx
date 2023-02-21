import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IBookingRequest } from 'src/createNewBooking/bookingTypes';
import { myLocalStorage } from 'src/services/localStorage';

export const hondaApi = createApi({
  reducerPath: 'hondaApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL,
    // credentials: 'include',
    prepareHeaders: (headers, { getState, endpoint }) => {
      const refreshToken = myLocalStorage.getItem('RefreshToken');
      const accessToken = sessionStorage.getItem('AccessToken');
      // const idToken = sessionStorage.getItem('IdToken');
      headers.set('origin', window.origin);
      if (refreshToken && endpoint === 'getIdAccessToken') {
        headers.set('x-refresh-token', refreshToken);
        // headers.set('origin', window.origin);
        headers.set('content-type', 'application/json');
      } else if (endpoint === 'logOut') {
        headers.delete('accessToken');
      } else {
        if (accessToken) {
          headers.set('Authorization', `Bearer ${accessToken}`);
          // headers.set('x-id-token', accessToken);
        }
      }

      return headers;
    },
  }),

  tagTypes: ['Login', 'Me', 'Bookings'],
  endpoints: (builder) => ({
    signUp: builder.query({
      query: ({
        firstName,
        username,
        password,
        providedCarIds,
        availableCarIds,
      }) => ({
        url: '/signup',
        method: 'POST',
        body: {
          firstName,
          username,
          password,
          providedCarIds,
          availableCarIds,
        },
      }),
    }),
    getIdAccessToken: builder.query({
      query: () => ({
        url: '/token/refresh',
        method: 'POST',
      }),
    }),
    statusLogin: builder.query({
      query: ({ password, username }) => ({
        url: '/login',
        method: 'POST',
        body: { password, username },
      }),
    }),
    logOut: builder.query({
      query: (accessToken) => ({
        url: '/logout',
        method: 'POST',
        body: accessToken,
      }),
    }),
    getUser: builder.query({
      query: (username: string) => `/users/${username}`,
    }),
    getMe: builder.query<{ username: string }, object>({
      query: () => '/me',
      providesTags: ['Me'],
    }),
    getBookings: builder.query({
      query: ({ carId, username }) =>
        `/bookings?carId=${carId}&username=${username}`,
      providesTags: ['Bookings'],
    }),
    getBookingsId: builder.query({
      query: ({ username, carId, startTime }) => ({
        url: `/bookings/id?username=${username}&carId=${carId}&startTime=${startTime}`,
      }),
    }),
    bookings: builder.query({
      query: (bookingRequest: IBookingRequest) => ({
        url: '/bookings',
        method: 'POST',
        body: bookingRequest,
      }),
    }),
    finishRide: builder.query({
      query: ({
        username,
        carId,
        startTimeSec,
        rideCompletionText,
        endDateTime,
      }) => ({
        url: `/bookings/finish/id?username=${username}&carId=${carId}&startTime=${startTimeSec}`,
        method: 'POST',
        body: { rideCompletionText, endDateTime },
        invalidatesTags: ['Bookings'],
      }),
    }),
    deleteBooking: builder.mutation({
      query: ({ username, carId, startTimeSec }) => ({
        url: `/bookings/id?username=${username}&carId=${carId}&startTime=${startTimeSec}`,
        method: 'DELETE',
      }),

      invalidatesTags: ['Bookings'],
    }),
    editBooking: builder.mutation({
      query: ({
        username,
        carId,
        startTime,
        startDateTime,
        endDateTime,
        description,
      }) => ({
        url: `/bookings?username=${username}&carId=${carId}&startTime=${startTime}`,
        method: 'PATCH',
        body: { startDateTime, endDateTime, description },
      }),

      invalidatesTags: ['Bookings'],
    }),
    updateUserData: builder.query({
      query: ({ username, settings }) => ({
        url: `/users/${username}`,
        method: 'PATCH',
        body: settings,
      }),
    }),
  }),
});

export const {
  useLazyStatusLoginQuery,
  useLazyLogOutQuery,
  useLazyGetUserQuery,
  useGetMeQuery,
  useLazyGetBookingsQuery,
  useLazyGetBookingsIdQuery,
  useLazyBookingsQuery,
  useLazySignUpQuery,
  useLazyGetIdAccessTokenQuery,
  useLazyFinishRideQuery,
  useDeleteBookingMutation,
  useEditBookingMutation,
  useLazyUpdateUserDataQuery,
} = hondaApi;
