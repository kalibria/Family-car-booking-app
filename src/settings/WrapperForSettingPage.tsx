import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { unauthorized } from 'src/auth/constants';
import { Loading } from 'src/commonComponents/Loading';
import { setUserRole } from 'src/redux/userDataSlice';
import { initPath } from 'src/router/rootConstants';
import { useGetMeQuery, useLazyGetUserQuery } from 'src/services/hondaApi';
import { SettingsPage } from 'src/settings/SettingsPage';
import { myRtkQueryResultProcessor } from 'src/redux/rtkQueryResultProcessor';

export const WrapperForSettingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data, currentData, isSuccess } = useGetMeQuery({});

  const [trigger, result] = useLazyGetUserQuery();

  useEffect(() => {
    const fetchedUsername = currentData?.username;

    if (isSuccess && fetchedUsername) {
      trigger(fetchedUsername);
    }
  }, [currentData, data, dispatch, isSuccess, navigate, trigger]);

  useEffect(() => {
    if (result.isSuccess && result.currentData) {
      const userRoles = result.currentData.user.roles;
      dispatch(setUserRole(userRoles));
    }
    if (result.isError) {
      const errorCode = myRtkQueryResultProcessor.handleErrorCode(
        result,
        dispatch,
      );
      if (errorCode === unauthorized) {
        // navigate(initPath);
      }
    }
  }, [dispatch, navigate, result]);

  return <div>{result.isLoading ? <Loading /> : <SettingsPage />}</div>;
};
