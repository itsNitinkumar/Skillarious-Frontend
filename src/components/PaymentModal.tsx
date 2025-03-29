import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

interface PaymentModalProps {
  course: {
    id: string;
    title: string;
    price: number;
  };
  onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ course, onClose }) => {
  const navigate = useNavigate();

  const handlePayment = () => {
    navigate(`/payment/${course.id}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Complete Purchase</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="mb-6">
          <h3 className="text-white mb-2">{course.title}</h3>
          <p className="text-red-500 font-bold">${course.price}</p>
        </div>
        <button
          onClick={handlePayment}
          className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700"
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
};

export default PaymentModal;