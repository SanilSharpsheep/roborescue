export const QUIZZES = {
  'clear-the-flood': {
    topic: 'THE MANTA RAY',
    questions: [
      { q: 'How does a manta ray move through water?', a: ['It rolls on wheels', 'It flaps its fins like wings', 'It hops on springy legs'], right: 1, why: 'Fins push water back, so the manta glides forward.' },
      { q: 'Why did your robot use an echo sensor?', a: ['Sound bounces off things, even in murky water', 'It makes the robot faster', 'It keeps the robot warm'], right: 0, why: 'Echoes bounce back from logs, like a bat or a dolphin finding things in the dark.' },
    ],
  },
  'inspect-the-bridge': {
    topic: 'THE GECKO',
    questions: [
      { q: 'How does a gecko stick to walls?', a: ['Tiny sticky hairs on its toes', 'It uses glue', 'It has suction cups'], right: 0, why: 'Millions of tiny hairs on a gecko\'s toes cling to surfaces, so your robot\'s feet can grip wet stone.' },
      { q: 'Why did your robot need a water sensor?', a: ['To play music', 'To feel the water rising and warn the robot', 'To find cracks'], right: 1, why: 'A sensor can trigger a rule. Water rising means: climb higher and stay safe!' },
    ],
  },
  'deep-water-rescue': {
    topic: 'THE OCTOPUS',
    questions: [
      { q: 'How can an octopus hold things without hurting them?', a: ['Hard metal claws', 'Soft arms with gentle suckers', 'Sharp teeth'], right: 1, why: 'An octopus has soft, bendy arms. Your robot copied that idea to free the turtle gently.' },
      { q: 'Why is it better to free the animal gently?', a: ['Pulling hard could hurt it', 'Gentle is always faster', 'Nets are fun to keep'], right: 0, why: 'Good engineers think about safety. A soft touch keeps the animal safe.' },
    ],
  },
};
