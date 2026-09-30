import type { Copy } from './en';

export const de = {
  nav: { studio: 'Das Studio', downloads: 'Downloads', guide: 'Anleitung', source: 'Quellcode' },
  skip: 'Zum Inhalt springen',
  home: 'garret Startseite',
  theme: 'Darstellung',
  themes: { auto: 'Automatisch', light: 'Hell', dark: 'Dunkel' },
  close: 'Bild schließen',
  enlarge: 'Bild in voller Größe ansehen',
  footer: {
    about: 'Über garret & Datenschutz', credits: 'Bildnachweise', issues: 'Problem melden',
    support: 'garret unterstützen', license: 'Freie Software. GPL-3.0-or-later.',
  },
  hero: {
    title: 'Ein Schreibstudio für das ganze Buch.',
    description: 'Manuskript, Figuren, Recherche und Überarbeitung an einem Ort. Funktioniert offline. Ohne Konto. Alle Funktionen sind kostenlos.',
    download: 'garret herunterladen', explore: 'Das Studio entdecken',
    caption: 'Dein Manuskript und der Rest deines Buches in Reichweite.',
    alt: 'garret-Editor mit einem Manuskript von Stolz und Vorurteil, Kapitelnavigation und Schreibwerkzeugen',
    darkAlt: 'garret-Editor im dunklen Modus mit einem Dracula-Manuskript und Kapitelnavigation',
  },
  studio: {
    title: 'Ein Roman besteht aus mehr als seinem Manuskript.',
    description: 'Figuren im Blick behalten. Ereignisse ordnen. Notizen wiederfinden. Alles bleibt bei deinem Text.',
    write: { title: 'Platz für deine Worte.', description: 'Schreibe in Szenen und Kapiteln. Suche im ganzen Buch, hinterlasse Kommentare oder kehre zu einer früheren Szenenfassung zurück. Im Fokusmodus gehört der Platz dem Manuskript.' },
    organize: { title: 'Behalte deine Geschichte im Blick.', description: 'Baue deine Figurenkartei und Story-Bibel auf. Halte Zusammenfassungen und Recherche griffbereit. Ordne Ereignisse auf der Zeitleiste und springe von dort zurück zur Szene.', alt: 'Dracula-Ereignisse auf Figuren- und Handlungssträngen in der garret-Zeitleiste', caption: 'Eine Zeitleiste, die mit dem Manuskript verbunden bleibt.' },
    revise: { title: 'Arbeite an der nächsten Fassung.', description: 'Tausche DOCX-Dokumente mit deinem Lektorat aus. Sieh, von wem ein Änderungsvorschlag stammt, und nimm ihn an oder lehne ihn ab. Kommentare, Überarbeitungsrunden und Aufgaben bleiben beim Buch.', alt: 'Zugeordnete Änderungsvorschläge neben dem Manuskript in garret', caption: 'Änderungsvorschläge mit Urheber und Kontext.' },
    prepare: { title: 'Vom Manuskript zum Buch.', description: 'Exportiere Markdown, DOCX oder EPUB. Lege Cover, Pseudonyme, Vor- und Nachspann sowie das Buchdesign fest. Unter Linux kannst du auch PDF-Korrekturabzüge erstellen.', alt: 'Buchdesign und EPUB-Export in garret', caption: 'Bereite ein EPUB direkt in deinem Schreibstudio vor.' },
  },
  ownership: {
    title: 'Dein Buch bleibt bei dir.',
    description: 'Bücher liegen auf deinem eigenen Datenträger. Schreibe ohne Internetverbindung und ohne Konto. Alle Funktionen sind kostenlos, der Quellcode ist offen.',
    backup: 'Speichere Arbeitsbücher außerhalb von Cloud-Ordnern. Erstelle verschlüsselte Archive manuell, bewahre den Wiederherstellungsschlüssel getrennt auf und prüfe dein gespeichertes Archiv.',
    link: 'Eine sichere Kopie behalten',
  },
  android: {
    title: 'Ein kleineres Studio für dein Smartphone.',
    description: 'Android bietet eine Bibliothek und einen Szeneneditor für unterwegs. Die App hat weniger Funktionen als garret auf dem Desktop. Bücher werden nicht automatisch synchronisiert.',
    alt: 'Android-Szeneneditor von garret mit einem Manuskript von Stolz und Vorurteil',
    caption: 'Der Android-Szeneneditor.',
  },
} satisfies Copy;
