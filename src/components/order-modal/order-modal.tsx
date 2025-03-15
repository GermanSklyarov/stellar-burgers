import { Modal, OrderInfo } from '@components';
import { FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export const OrderModal: FC = () => {
  const navigate = useNavigate();
  const { number } = useParams();

  return (
    <Modal title={`#${number || ''}`} onClose={() => navigate(-1)}>
      <OrderInfo />
    </Modal>
  );
};
