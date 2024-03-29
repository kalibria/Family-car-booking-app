import Button from '@mui/material/Button';
import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingListPath, errorPath } from 'src/router/rootConstants';
import {
  useGetMeQuery,
  useLazyFinishRideQuery,
  useLazyGetUserQuery,
} from 'src/services/hondaApi';
import * as Yup from 'yup';
import dayjs from 'dayjs';

export interface ICompleteRideWindow {
  startTimeSec: string;
  setIsOpenCompleteRideWindow: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface IFinishRide {
  username: string;
  carId: string;
  startTimeSec: string;
}

export const CompleteRideWindow = ({
  startTimeSec,
  setIsOpenCompleteRideWindow,
}: ICompleteRideWindow) => {
  const navigate = useNavigate();
  const { data, isSuccess } = useGetMeQuery({});
  const [triggerUser, resultUser] = useLazyGetUserQuery();
  const [carLocationResult, setCarLocationResult] = useState('');

  const [triggerFinish, finishResult] = useLazyFinishRideQuery();

  const currentTime = dayjs(new Date().toString()).format('YYYY-MM-DDTHH:mm');

  const initParamsForFinish = {
    username: '',
    carId: '',
    startTimeSec: startTimeSec,
    rideCompletionText: '',
    endDateTime: 0,
  };

  const [queryParams, setQueryParams] =
    useState<IFinishRide>(initParamsForFinish);

  useEffect(() => {
    if (isSuccess) {
      triggerUser(data.username);
    }
  }, [isSuccess, triggerUser]);

  useEffect(() => {
    if (resultUser.isSuccess) {
      setCarLocationResult(resultUser.data.user.settings.rideCompletionText);
      setQueryParams({
        ...initParamsForFinish,
        username: resultUser.data.user.username,
        carId: resultUser.data.user.availableCars[0],
      });
    }

    if (resultUser.error) {
      navigate(errorPath);
    }
  }, [resultUser.isSuccess, resultUser.data, resultUser.error, navigate]);

  useEffect(() => {
    if (finishResult.isSuccess) {
      setIsOpenCompleteRideWindow(false);
      navigate(bookingListPath);
    }

    if (finishResult.error) {
      navigate(errorPath);
    }
  }, [
    finishResult.isSuccess,
    finishResult.error,
    navigate,
    setIsOpenCompleteRideWindow,
  ]);

  return (
    <div className={'completeRideWindow'}>
      <Formik
        initialValues={{
          carLocation: carLocationResult,
          completeTime: currentTime,
        }}
        validationSchema={Yup.object({
          carLocation: Yup.string().required('Required'),
        })}
        onSubmit={(values, { setSubmitting }) => {
          const fromISOtoDate = new Date(values.completeTime);
          const dateInSec = fromISOtoDate.getTime() / 1000;

          const updateRideCompletionText = values.carLocation;

          triggerFinish({
            ...queryParams,
            rideCompletionText: updateRideCompletionText,
            endDateTime: dateInSec,
          });

          setSubmitting(false);
        }}
        enableReinitialize={true}>
        {(props) => {
          return (
            <Form className={'completeRideForm'}>
              <div>
                <label htmlFor={'carLocation'}>Где оставлен автомобиль?</label>
                <input
                  name={'carLocation'}
                  id={'carLocation'}
                  type={'text'}
                  defaultValue={carLocationResult}
                />
              </div>

              <div className={'completedTime'}>
                <label htmlFor={'completeTime'}>Время завершения</label>
                <input
                  name={'completeTime'}
                  id={'completeTime'}
                  type={'datetime-local'}
                  defaultValue={currentTime}
                  onChange={props.handleChange}
                />
              </div>
              <div className={'button completeButtons'}>
                <Button
                  className={'place-self-center '}
                  variant="contained"
                  type="submit"
                  size={'small'}>
                  {'Подтвердить'}
                </Button>
                <Button
                  className={'place-self-center '}
                  variant="contained"
                  type="reset"
                  size={'small'}
                  onClick={() => {
                    setIsOpenCompleteRideWindow(false);
                  }}>
                  {'Отмена'}
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};
