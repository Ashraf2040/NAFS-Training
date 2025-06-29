export default function emojiIconScore(score, totalQuestions) {
  const emojiFaces = [
    'confused-emoji.png', // Less than 60%
    'happy-emoji.png',    // 60% to 80%
    'very-happy-emoji.png' // 80% and above
  ];
  const percentage = (score / (totalQuestions * 10)) * 100;
  if (percentage < 60) return emojiFaces[0];
  else if (percentage >= 60 && percentage < 80) return emojiFaces[1];
  else return emojiFaces[2];
}