import React, { useEffect } from 'react';
import Button from '@mui/material/Button';
import { Formik, Form } from 'formik';
import { useDispatch } from 'react-redux';
import {
  MyCheckbox,
  MyTextInput,
} from 'src/components/loginForm/inputsForLoginForm';
import { isAuth } from 'src/redux/authSlice';
import { hondaApi } from 'src/services/hondaApi';

import * as Yup from 'yup';
import '../../App.css';

export const LoginForm = () => {
  const [trigger, result] = hondaApi.useLazyStatusLoginQuery();
  const dispatch = useDispatch();

  useEffect(() => {
    if (result.isSuccess) {
      dispatch(isAuth(result.currentData.status));
    }
  }, [result.isSuccess, dispatch, result.currentData]);
  return (
    <div className="loginForm ">
      <main className="flex flex-col justify-center items-center ">
        <div className="w-24 mb-4">
          <img
            src="https://www.nicepng.com/png/detail/138-1388174_login-account-icon.png"
            alt="logIn"
          />
          <h1 className="text-center">Sigh in</h1>
        </div>
        <Formik
          initialValues={{
            login: '',
            password: '',
            rememberMe: false,
          }}
          validationSchema={Yup.object({
            login: Yup.string()
              .max(15, 'Must be 15 characters or less')
              .required('Required'),
            password: Yup.string()
              .max(20, 'Must be 20 characters or less')
              .required('Required'),
          })}
          onSubmit={(values, { setSubmitting }) => {
            let password = values.password;
            let username = values.login;
            trigger({ password, username });
          }}>
          <Form className="flex flex-col sm:w-96 space-y-3.5">
            <MyTextInput
              id={'outlined-login-input'}
              label={'Login'}
              type={'login'}
              autoComplete={'current-login'}
              name={'login'}
            />
            <MyTextInput
              id={'outlined-password-input'}
              label={'Password'}
              type={'password'}
              autoComplete={'current-password'}
              name={'password'}
            />
            <MyCheckbox name={'rememberMe'}>Remember me</MyCheckbox>
            <Button variant="contained" type="submit">
              Sigh in
            </Button>
          </Form>
        </Formik>
      </main>
    </div>
  );
};
