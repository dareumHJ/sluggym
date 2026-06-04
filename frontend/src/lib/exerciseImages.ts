const EXERCISE_IMAGE_BASE_URL =
  'https://raw.githubusercontent.com/dareumHJ/sluggym/dev/backend/db/img/exercises';

export function getExerciseImageSlug(exerciseName: string) {
  return exerciseName
    .trim()
    .replace(/[’']/g, '')
    .replace(/[()]/g, '')
    .replace(/[/:]+/g, '_')
    .replace(/\s+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

export function getExerciseImageUrl(exerciseName: string) {
  const slug = getExerciseImageSlug(exerciseName);
  if (!slug) return null;

  return `${EXERCISE_IMAGE_BASE_URL}/${encodeURIComponent(slug)}/0.jpg`;
}

export function getExerciseImageFrameUrls(exerciseName: string) {
  const slug = getExerciseImageSlug(exerciseName);
  if (!slug) return [];

  const encodedSlug = encodeURIComponent(slug);
  return [0, 1].map((frame) => `${EXERCISE_IMAGE_BASE_URL}/${encodedSlug}/${frame}.jpg`);
}
