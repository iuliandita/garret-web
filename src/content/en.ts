export const en = {
  nav: { studio: 'The studio', downloads: 'Downloads', guide: 'Guide', source: 'Source' },
  skip: 'Skip to content',
  home: 'garret home',
  theme: 'Appearance',
  themes: { auto: 'Automatic', light: 'Light', dark: 'Dark' },
  close: 'Close image',
  enlarge: 'View full-size image',
  footer: {
    about: 'About & privacy', credits: 'Image credits', issues: 'Report a problem',
    support: 'Support garret', license: 'Free software. GPL-3.0-or-later.',
  },
  hero: {
    title: 'A writing studio for the whole book.',
    description: 'Manuscript, characters, research, and revisions together. Works offline. No account. Every feature is free.',
    download: 'Get garret', explore: 'Explore the studio',
    caption: 'Your manuscript, with the rest of your book within reach.',
    alt: 'garret editor with a Pride and Prejudice manuscript, chapter navigation, and writing tools',
    darkAlt: 'garret editor in dark mode with a Dracula manuscript and chapter navigation',
  },
  studio: {
    title: "There's more to a novel than the manuscript.",
    description: 'People to remember. Events to line up. Notes that need a home. Keep them alongside the writing.',
    write: { title: 'Make room for the words.', description: 'Write in scenes and chapters. Find a passage across the book, leave a comment, or return to an earlier scene version. Focus mode makes space for the manuscript.' },
    organize: { title: 'Keep the story straight.', description: 'Build your cast and story bible. Keep synopses and research close. Lay out events on a timeline, then follow them back to the scene.', alt: 'Dracula events arranged across character and story tracks in the garret timeline', caption: 'A timeline that stays connected to the manuscript.' },
    revise: { title: 'Bring the next draft into focus.', description: 'Exchange DOCX review documents with your editor. See who proposed a change, accept or reject it, and keep comments, revision passes, and tasks with the book.', alt: 'Attributed editorial proposals beside the manuscript in garret', caption: 'Editorial changes, with their author and context.' },
    prepare: { title: 'From manuscript to book.', description: 'Export Markdown, DOCX, or EPUB. Set up covers, pen names, front and back matter, and book design. Linux also offers PDF proof copies.', alt: 'Book design and EPUB export controls in garret', caption: 'Prepare an EPUB without leaving your writing studio.' },
  },
  ownership: {
    title: 'Your book stays yours.',
    description: 'Books live on your disk. Write without an internet connection or an account. All features are free, and the source is open.',
    backup: 'Keep working books outside cloud-synced folders. Make encrypted archives manually, keep the recovery key separately, and verify your saved archive.',
    link: 'Keep a safe copy',
  },
  android: {
    title: 'A smaller studio for your phone.',
    description: 'Android has a library and scene editor for writing on the go. It has fewer features than desktop garret, and books do not sync automatically.',
    alt: 'Android garret scene editor showing a Pride and Prejudice manuscript',
    caption: 'The Android scene editor.',
  },
} as const;

export type Copy = {
  [K in keyof typeof en]: typeof en[K] extends string ? string : {
    [P in keyof typeof en[K]]: typeof en[K][P] extends string ? string : {
      [Q in keyof typeof en[K][P]]: string
    }
  }
};
