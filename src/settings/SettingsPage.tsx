import Button from '@mui/material/Button';
import { Form, Formik } from 'formik';
import React, { useEffect } from 'react';
import { BasicTextFields, SwitchesGroup } from 'src/settings/components';

export const SettingsPage = () => {
  // const { data, error, isLoading } = useEffect(() => {});

  return (
    <main className={'sm:w-60 mainContainer'}>
      <Formik
        initialValues={{
          isCreated: false,
          isChanged: false,
          textField: '',
        }}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(false);
        }}>
        <Form className={'flex flex-col space-y-3.5'}>
          <SwitchesGroup
            note1={'booking is created'}
            note2={'booking is changed'}
            title={'Get notifications when ...'}
            isCreatedFieldName={'isCreated'}
            isChangedFieldName={'isChanged'}
          />
          <BasicTextFields
            label={'Where the car was left?'}
            name={'textField'}
          />
          <Button
            className={'place-self-center'}
            variant="contained"
            type="submit"
            size={'small'}>
            {'save'}
          </Button>
        </Form>
      </Formik>
    </main>
  );
};