import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface PaymentModalProps {
  course: {
    id: string;
    title: string;
    price: number;
  };
  onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ course, onClose }) => {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    setLoading(true);
    try {
      // Create order
      const response = await fetch('/api/v1/payments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId: course.id,
          amount: course.price,
          userId: user.id
        }),
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.message);

      // Initialize Razorpay
      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: "INR",
        name: "Learn Sphere",
        description: `Purchase ${course.title}`,
        order_id: data.order.id,
        handler: async function (response: any) {
          try {
            // Verify payment
            const verifyResponse = await fetch('/api/v1/payments/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            const verifyData = await verifyResponse.json();
            if (verifyData.success) {
              router.push(`/courses/${course.id}/watch`);
            }
          } catch (error) {
            console.error('Payment verification failed:', error);
          }
        },
        prefill: {
          email: user.email,
          name: user.name
        },
        theme: {
          color: "#dc2626"
        }
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment initiation failed:', error);
    } finally {
      setLoading(false);
    }
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
          <p className="text-red-500 font-bold">₹{course.price}</p>
        </div>
        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center justify-center"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            'Proceed to Payment'
          )}
        </button>
      </div>
    </div>
  );
};

export default PaymentModal;
