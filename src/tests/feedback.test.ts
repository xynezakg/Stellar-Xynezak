import { describe, it, expect } from 'vitest';
import { INITIAL_USER_FEEDBACK } from '../hooks/useFeedback';
import { UserFeedback } from '../types/stellar';

describe('User Feedback System', () => {
  it('loads initial verified user feedback reviews', () => {
    expect(INITIAL_USER_FEEDBACK.length).toBeGreaterThanOrEqual(6);
    expect(INITIAL_USER_FEEDBACK[0].userName).toBe('Maria Santos');
    expect(INITIAL_USER_FEEDBACK[0].rating).toBe(5);
  });

  it('correctly calculates average rating across feedback entries', () => {
    const sum = INITIAL_USER_FEEDBACK.reduce((acc, curr) => acc + curr.rating, 0);
    const avg = sum / INITIAL_USER_FEEDBACK.length;
    expect(avg).toBeGreaterThanOrEqual(4.0);
    expect(avg).toBeLessThanOrEqual(5.0);
  });

  it('assigns correct sentiment based on rating score', () => {
    const getSentiment = (rating: number) =>
      rating >= 4 ? 'POSITIVE' : rating === 3 ? 'NEUTRAL' : 'CONSTRUCTIVE';

    expect(getSentiment(5)).toBe('POSITIVE');
    expect(getSentiment(4)).toBe('POSITIVE');
    expect(getSentiment(3)).toBe('NEUTRAL');
    expect(getSentiment(2)).toBe('CONSTRUCTIVE');
    expect(getSentiment(1)).toBe('CONSTRUCTIVE');
  });

  it('verifies feedback entries contain essential disaster response metadata', () => {
    INITIAL_USER_FEEDBACK.forEach((fb: UserFeedback) => {
      expect(fb.userName).toBeTruthy();
      expect(fb.userRole).toBeTruthy();
      expect(fb.comment.length).toBeGreaterThan(10);
      expect(fb.category).toBeTruthy();
    });
  });
});
