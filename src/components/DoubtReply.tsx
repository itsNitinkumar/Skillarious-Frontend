import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { doubtService } from '@/services/doubt.service';
import { Message } from '@/types';

interface DoubtReplyProps {
  doubtId: string;
  onReplyAdded?: (reply: Message) => void;
}

export default function DoubtReply({ doubtId, onReplyAdded }: DoubtReplyProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error('Please enter a reply');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await doubtService.replyToDoubt(doubtId, content);
      toast.success('Reply posted successfully');
      setContent('');
      onReplyAdded?.(response.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to post reply');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        rows={3}
        placeholder="Write your reply..."
        required
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
      >
        {isSubmitting ? 'Posting...' : 'Post Reply'}
      </button>
    </form>
  );
}