import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { doubtService } from '@/services/doubt.service';
import { Doubt, Message } from '@/types';
import DoubtReply from './DoubtReply';

interface DoubtDetailsProps {
  doubtId: string;
}

export default function DoubtDetails({ doubtId }: DoubtDetailsProps) {
  const [doubt, setDoubt] = useState<Doubt | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoubtDetails();
  }, [doubtId]);

  const fetchDoubtDetails = async () => {
    try {
      const response = await doubtService.getDoubtDetails(doubtId);
      setDoubt(response.doubt);
      setMessages(response.doubt.messages || []);
    } catch (error) {
      toast.error('Failed to fetch doubt details');
    } finally {
      setLoading(false);
    }
  };

  const handleReplyAdded = (newMessage: Message) => {
    setMessages(prev => [...prev, newMessage]);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!doubt) {
    return <div className="text-white">Doubt not found</div>;
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-bold text-white mb-2">{doubt.title}</h2>
      <p className="text-gray-300 mb-4">{doubt.description}</p>
      
      <div className="space-y-4 mt-6">
        <h3 className="text-lg font-semibold text-white">Responses</h3>
        {messages.map((message) => (
          <div key={message.id} className="bg-gray-700 p-4 rounded-lg">
            <p className="text-white">{message.text}</p>
            <p className="text-sm text-gray-400 mt-2">
              {message.isResponse ? 'Educator' : 'Student'}
            </p>
          </div>
        ))}
      </div>

      <DoubtReply doubtId={doubtId} onReplyAdded={handleReplyAdded} />
    </div>
  );
}