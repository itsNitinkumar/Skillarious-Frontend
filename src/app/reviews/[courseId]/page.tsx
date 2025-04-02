'use client';
import { useState, useEffect } from 'react';
import { Review } from '@/types';
import reviewService from '@/services/review.service';
import { Star, Edit2, Trash2, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

export default function ReviewPage({ params }: { params: { courseId: string } }) {
    const { user } = useAuth();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedReview, setSelectedReview] = useState<Review | null>(null);
    const [formData, setFormData] = useState({
        rating: 0,
        message: '',
    });
    const [isPurchased, setIsPurchased] = useState(true);

    const isReviewOwner = (review: Review) => {
        return user?.id === review.userId;
    };

    useEffect(() => {
        fetchReviews();
    }, [params.courseId]);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await reviewService.getCourseReviews(params.courseId);
            // The backend returns { success: true, reviews: [...] }
            setReviews(response.reviews);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            setError('Failed to fetch reviews');
            toast.error('Failed to fetch reviews');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateReview = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await reviewService.createReview(
                params.courseId,
                formData.rating,
                formData.message
            );
            setReviews([...reviews, response.review]);
            resetReview();
            toast.success('Review submitted successfully');
        } catch (error: any) {
            if (error.response?.data?.message?.includes('already reviewed')) {
                toast.error('You have already reviewed this course. Please delete your existing review first.');
            } else if (error.response?.data?.message?.includes('must purchase')) {
                setIsPurchased(false);
                toast.error('Please purchase this course to leave a review');
            } else {
                toast.error('Failed to create review. Please try again.');
            }
        }
    };

    const handleUpdateReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedReview) return;
        
        try {
            const response = await reviewService.updateReview(
                params.courseId,
                formData.rating,
                formData.message
            );
            setReviews(prevReviews =>
                prevReviews.map(review =>
                    review.id === selectedReview.id ? response.review : review
                )
            );
            resetReview();
            toast.success('Review updated successfully');
        } catch (error) {
            toast.error('Failed to update review');
        }
    };

    const handleDeleteReview = async (review: Review) => {
        if (!confirm('Are you sure you want to delete this review?')) return;
        
        try {
            await reviewService.deleteReview(review.courseId);
            setReviews(prevReviews => prevReviews.filter(r => r.id !== review.id));
            toast.success('Review deleted successfully');
        } catch (error) {
            console.error('Error deleting review:', error);
            toast.error('Failed to delete review');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'rating' ? parseInt(value) : value
        }));
    };

    const selectReviewForEdit = (review: Review) => {
        setSelectedReview(review);
        setFormData({
            rating: review.rating,
            message: review.message as string,
        });
    };

    const resetReview = () => {
        setFormData({ rating: 0, message: '' });
        setSelectedReview(null);
    };

    const StarRating = ({ rating, onRatingChange }: { rating: number, onRatingChange?: (rating: number) => void }) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-5 h-5 cursor-pointer ${
                            star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }`}
                        onClick={() => onRatingChange?.(star)}
                    />
                ))}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-8">
            <h1 className="text-3xl font-bold text-gray-800">Course Reviews</h1>
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                    {error}
                    <button
                        className="absolute top-0 right-0 p-2"
                        onClick={() => setError(null)}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            )}

            {!isPurchased ? (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
                    <p>You need to purchase this course before leaving a review.</p>
                    <a 
                        href={`/courses/${params.courseId}`} 
                        className="text-blue-500 hover:text-blue-700 underline"
                    >
                        Go to course page
                    </a>
                </div>
            ) : (
                <form
                    onSubmit={selectedReview ? handleUpdateReview : handleCreateReview}
                    className="bg-white shadow-md rounded-lg p-6 space-y-4"
                >
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Rating</label>
                        <StarRating
                            rating={formData.rating}
                            onRatingChange={(rating) => setFormData(prev => ({ ...prev, rating }))}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Review</label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={4}
                            required
                        />
                    </div>

                    <div className="flex gap-2">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                        >
                            {selectedReview ? 'Update Review' : 'Submit Review'}
                        </button>
                        {selectedReview && (
                            <button
                                type="button"
                                onClick={resetReview}
                                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
                {reviews.map((review) => (
                    <div
                        key={review.id}
                        className="bg-white shadow-md rounded-lg p-6 transition-all hover:shadow-lg"
                    >
                        <div className="flex justify-between items-start">
                            <div className="space-y-2">
                                <StarRating rating={review.rating} />
                                <p className="text-gray-700">{review.message}</p>
                                <p className="text-sm text-gray-500">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            {isReviewOwner(review) && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => selectReviewForEdit(review)}
                                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-full"
                                    >
                                        <Edit2 className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteReview(review)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
