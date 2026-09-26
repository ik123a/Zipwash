import React, { useState } from 'react';
import { isAxiosError } from 'axios';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star, MessageSquare, Loader2 } from 'lucide-react';
import api from '@/services/api';
import { toast } from 'sonner';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
}

export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comments, setComments] = useState('');
  const [category, setCategory] = useState('service');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.post('/feedback', {
        rating,
        comments,
        category
      });

      toast.success(response.data.message || 'Thank you for your feedback!');

      // Reset form
      setRating(0);
      setComments('');
      setCategory('service');
      onClose(false);
    } catch (error) {
      const message = (isAxiosError<{ message?: string }>(error) ? error.response?.data?.message : undefined) || 'Failed to submit feedback';
      toast.error(message);
      console.error('Feedback submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    { value: 'service', label: 'Service' },
    { value: 'quality', label: 'Quality' },
    { value: 'timeliness', label: 'Timeliness' },
    { value: 'staff', label: 'Staff' },
    { value: 'app', label: 'App Experience' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary mb-2">
            <MessageSquare className="h-5 w-5" />
            <DialogTitle>Share your Feedback</DialogTitle>
          </div>
          <DialogDescription>
            How was your experience with ZIPPWASH today? Your feedback helps us improve.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="flex flex-col items-center justify-center gap-3">
            <Label className="text-sm font-medium text-muted-foreground">Overall Rating</Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="transition-all hover:scale-110"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  aria-label={`Rate ${star} stars`}
                  disabled={isSubmitting}
                >
                  <Star
                    className={`h-8 w-8 transition-colors ${
                      star <= (hover || rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-muted-foreground/30'
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs font-semibold px-3 py-1 bg-muted rounded-full text-foreground uppercase tracking-wider">
              {rating === 1 ? 'Poor' : rating === 2 ? 'Fair' : rating === 3 ? 'Good' : rating === 4 ? 'Great' : rating === 5 ? 'Excellent' : 'Select a rating'}
            </span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback-category">Category</Label>
            <select
              id="feedback-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
              disabled={isSubmitting}
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback-comment">Tell us more</Label>
            <Textarea
              id="feedback-comment"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="What can we do to make your experience even better?"
              className="min-h-[100px] resize-none focus-visible:ring-primary"
              disabled={isSubmitting}
            />
          </div>

          <DialogFooter>
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-11"
              disabled={rating === 0 || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Feedback'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
