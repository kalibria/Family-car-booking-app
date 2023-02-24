import React, { useEffect } from 'react';
import { ButtonUI } from '../ui-kit/ButtonUI';
import { useDeleteBookingMutation } from '../services/hondaApi';
import { useNavigate } from 'react-router-dom';
import { bookingListPath } from '../router/rootConstants';

export interface IDeleteButton {
  requestData: { username: string; carId: string; startTimeSec: string };
}

export const DeleteButton = ({ requestData }: IDeleteButton) => {
  const [deleteBookingTrigger, resultDeleteBooking] =
    useDeleteBookingMutation();
  const navigate = useNavigate();
  const deleteRide = () => {
    deleteBookingTrigger(requestData);
  };

  useEffect(() => {
    if (resultDeleteBooking.isSuccess) {
      navigate(bookingListPath);
    }
  });

  return <ButtonUI onClick={deleteRide}>{'Удалить'}</ButtonUI>;
};
