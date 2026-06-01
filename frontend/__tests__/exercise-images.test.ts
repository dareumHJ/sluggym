import { getExerciseImageFrameUrls, getExerciseImageSlug, getExerciseImageUrl } from '../src/lib/exerciseImages';

describe('exercise image helpers', () => {
  it('converts exercise names to backend image folder slugs', () => {
    expect(getExerciseImageSlug('Barbell Full Squat')).toBe('Barbell_Full_Squat');
    expect(getExerciseImageSlug('Triceps Pushdown - Rope Attachment')).toBe('Triceps_Pushdown_-_Rope_Attachment');
    expect(getExerciseImageSlug("World's Greatest Stretch")).toBe('Worlds_Greatest_Stretch');
    expect(getExerciseImageSlug('Rocky Pull-Ups/Pulldowns')).toBe('Rocky_Pull-Ups_Pulldowns');
  });

  it('builds the GitHub raw URL for the first exercise image frame', () => {
    expect(getExerciseImageUrl('Barbell Full Squat')).toBe(
      'https://raw.githubusercontent.com/dareumHJ/sluggym/dev/backend/db/img/exercises/Barbell_Full_Squat/0.jpg',
    );
  });

  it('builds frame URLs for gif-like exercise thumbnails', () => {
    expect(getExerciseImageFrameUrls('Barbell Full Squat')).toEqual([
      'https://raw.githubusercontent.com/dareumHJ/sluggym/dev/backend/db/img/exercises/Barbell_Full_Squat/0.jpg',
      'https://raw.githubusercontent.com/dareumHJ/sluggym/dev/backend/db/img/exercises/Barbell_Full_Squat/1.jpg',
    ]);
  });
});
