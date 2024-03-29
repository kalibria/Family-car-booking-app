import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { errorPath } from 'src/router/rootConstants';
import {
  hondaApi,
  useGetMeQuery,
  useLazyGetUserQuery,
} from 'src/services/hondaApi';
import { ISettings } from 'src/settings/types';
import { IUser } from 'src/user/types';

export const useQueryUserInfo = () => {
  const { data: meData, isSuccess, error } = useGetMeQuery({});
  const [getUserTrigger, result] = useLazyGetUserQuery();
  const [resultUserInfoIsSuccess, setResultUserInfoIsSuccess] = useState(false);
  const [resultUserInfo, setResultUserInfo] = useState<IUser>({
    username: '',
    firstName: '',
    roles: [],
    availableCars: [''],
    providedCars: [''],
    settings: <ISettings>{},
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      getUserTrigger(meData.username);
    }
    if (error) {
      navigate(errorPath);
    }
  }, [isSuccess, meData, getUserTrigger]);

  useEffect(() => {
    if (result.isLoading) {
      setIsLoading(true);
    }
  }, [result.isLoading]);

  useEffect(() => {
    if (result.isSuccess) {
      setResultUserInfoIsSuccess(true);
      setResultUserInfo(result.data.user);
      setIsLoading(false);
    }

    if (result.error) {
      navigate(errorPath);
    }
  }, [result.isSuccess, result.data]);

  return { resultUserInfoIsSuccess, resultUserInfo, isLoading };
};
