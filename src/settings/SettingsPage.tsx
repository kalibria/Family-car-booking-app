import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useCheckIsLoggedIn } from 'src/auth/authenticationManager';
import { IUsersSettings } from 'src/createNewBooking/bookingTypes';
import {
  useGetMeQuery,
  useLazyGetUserQuery,
  useLazyUpdateUserDataQuery,
} from 'src/services/hondaApi';

import { carProvider } from 'src/settings/constants';
import { debounce } from 'lodash';

export const SettingsPage = () => {
  const { isSuccess: meSuccess, currentData: meCurrentData } = useGetMeQuery(
    {},
  );
  const [getUserTrigger, userResult] = useLazyGetUserQuery();
  const [myRoles, setMyRoles] = useState<string[]>([]);

  const { isSuccess } = useCheckIsLoggedIn();

  const isCarProvider = myRoles.includes(carProvider);

  const [initNotifiedWhenCreated, setInitNotifiedWhenCreated] = useState(false);
  const [initNotifiedWhenChanged, setNotifiedWhenChanged] = useState(false);
  const [rideCompletionText, setRideCompletionText] = useState('');

  useEffect(() => {
    if (meSuccess && meCurrentData) {
      getUserTrigger(meCurrentData.username);
    }
  }, [meSuccess, meCurrentData, getUserTrigger]);

  useEffect(() => {
    if (userResult.isSuccess && userResult.currentData) {
      setMyRoles(userResult.currentData.user.roles);
      setRideCompletionText(
        userResult.currentData.user.settings.rideCompletionText,
      );
      setInitNotifiedWhenCreated(
        userResult.currentData.user.settings.notifications
          .getNotifiedAboutNewBookings,
      );

      setNotifiedWhenChanged(
        userResult.currentData.user.settings.notifications
          .getNotifiedAboutBookingChanges,
      );
    }
  }, [userResult.isSuccess, userResult.currentData]);

  const [triggerUpdate, resultAfterUpdate] = useLazyUpdateUserDataQuery();

  useEffect(() => {
    if (resultAfterUpdate.isSuccess && meCurrentData) {
      getUserTrigger(meCurrentData.username);
    }

    if (userResult.isSuccess) {
      console.log('newData', userResult.currentData);
    }
  }, [resultAfterUpdate.isSuccess, meCurrentData, userResult.isSuccess]);

  const formik = useFormik({
    initialValues: {
      isCreated: initNotifiedWhenCreated,
      isChanged: initNotifiedWhenChanged,
      textField: rideCompletionText,
    },
    onSubmit: (values) => {},
    enableReinitialize: true,
  });

  const debounceUpdate = debounce(async (newSettings: IUsersSettings) => {
    const settings: IUsersSettings = {
      settings: {
        rideCompletionText: newSettings.settings.rideCompletionText,
        notifications: {
          getNotifiedWhenBookingChanged:
            newSettings.settings.notifications.getNotifiedWhenBookingChanged,
          getNotifiedWhenBookingCreated:
            newSettings.settings.notifications.getNotifiedWhenBookingCreated,
        },
      },
    };

    triggerUpdate({ username: meCurrentData?.username, settings });
  }, 2000);

  useEffect(() => {
    const newSettings: IUsersSettings = {
      settings: {
        rideCompletionText: formik.values.textField,
        notifications: {
          getNotifiedWhenBookingChanged: formik.values.isChanged,
          getNotifiedWhenBookingCreated: formik.values.isCreated,
        },
      },
    };
    debounceUpdate(newSettings);
  }, [
    formik.values.isChanged,
    formik.values.isCreated,
    formik.values.textField,
  ]);

  return (
    <div className={'sm:w-60 mainContainer'}>
      {isSuccess && (
        <form
          className={'flex flex-col space-y-3.5 formWrapper'}
          onChange={formik.handleChange}>
          {isCarProvider && (
            <div className={'widthFormItem'}>
              <FormControl component="fieldset" variant="standard">
                <FormLabel component="legend">
                  {'Get notifications when ...'}
                </FormLabel>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        name={'isCreated'}
                        checked={formik.values.isCreated}
                        onChange={formik.handleChange}
                        value={formik.values.isCreated}
                      />
                    }
                    label={'booking is created'}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        name={'isChanged'}
                        checked={formik.values.isChanged}
                        onChange={formik.handleChange}
                        value={formik.values.isChanged}
                      />
                    }
                    label={'booking is changed'}
                  />
                </FormGroup>
              </FormControl>
            </div>
          )}
          <div className={'widthFormItem'}>
            <TextField
              fullWidth
              id="fullWidth"
              label={'Где оставлен автомобиль?'}
              variant="standard"
              name={'textField'}
              value={formik.values.textField}
            />
          </div>
        </form>
      )}
    </div>
  );
};
