import {messagesEn} from '@/locale/en';

export const messagesDe = {
  auth: {
    login: 'Einloggen',
    loginInProgress: 'Logge ein ...',
    register: 'Registrieren',
    logout: 'Ausloggen',
  },
  dashboard: {
    actions: {
      newLabel: 'Neues Label',
      newReport: 'Neuer Bereicht',
    },
    hello: 'Hallo {displayName}!',
    recentReports: 'Letzte Berichte',
  },
  design: 'Design',
  error: {
    badRequest: 'Ungültige Anforderung',
    conflict: 'Konflikt',
    error: 'Fehler',
    failedToLoad: 'Fehler beim Laden',
    internalServerError: 'Interner Serverfehler',
    notFound: 'Nicht gefunden',
    unauthorized: 'Nicht autorisiert',
    unknownReason: 'Unbekannter Grund',
  },
  general: {
    cancel: 'Abbrechen',
    confirm: 'Bestätigen',
    confirmation: 'Bestätigung',
    copyToClipboard: {
      copyToClipboard: 'In die Zwischenablage kopieren',
      fail: 'In die Zwischenablage kopieren fehlgeschlagen',
      success: 'In die Zwischenablage kopiert',
    },
    delete: 'Löschen',
    deleted: 'Gelöscht',
    deleting: 'Lösche ...',
    name: 'Name',
    reload: 'Neu laden',
    save: 'Speichern',
    saved: 'Gespeichert',
    saving: 'Wird gespeichert ...',
    search: 'Suche',
  },
  label: {
    create: {
      button: 'Erstellen',
      modalTitle: 'Label erstellen',
    },
    edit: {
      button: 'Speichern',
      modalTitle: 'Label bearbeiten',
    },
    delete: {
      associatedValues: 'Dieses Label hat 1 assoziierten Wert. Dieser Wert wird auch gelöscht! ' +
        '| Dieses Label hat {count} assoziierte Werte. Diese Werte werden auch gelöscht!',
      reallyDelete: 'Dieses Label wirklich löschen?',
    },
    label: 'Label',
    list: {
      actions: 'Aktionen',
      createdAt: 'Erstellt am',
      updatedAt: 'Letztes Update',
    },
    missingInformation: 'Fehlende Informationen',
    model: {
      color: 'Farbe',
      description: 'Beschreibung',
      maxReference: 'Maximum Referenz',
      minReference: 'Minimum Referenz',
      name: 'Name',
      unit: 'Einheit',
    },
    reference: 'Referenz',
  },
  locale: 'Sprache',
  locales: messagesEn.locales,
  menu: {
    about: 'Über',
    labels: 'Labels',
    main: 'Dashboard',
    reports: 'Berichte',
    values: 'Werte',
  },
  report: {
    delete: {
      associatedValues: 'Dieser Bericht hat 1 assoziierten Wert. Dieser Wert wird auch gelöscht! ' +
        '| Dieser Bericht hat {count} assoziierte Werte. Diese Werte werden auch gelöscht!',
      reallyDelete: 'Diesen Bericht wirklich löschen?',
    },
    list: {
      actions: 'Aktionen',
      createdAt: 'Erstellt am',
      updatedAt: 'Letztes Update',
    },
    model: {
      comment: 'Kommentar',
      date: 'Datum',
      lab: 'Labor',
      name: 'Name',
    },
    report: 'Bericht',
    valueCount: '#Werte',
    valueCountShort: '#',
  },
  settings: {
    settings: 'Einstellungen',
    currentlyNoSettings: 'Aktuell gibt es keine Einstellungen.',
  },
  validation: {
    patternMismatch: 'Eingabe entspricht nicht dem Muster! "{pattern}".',
    rangeOverflow: 'Eingabe ist zu groß! Maximaler Wert: {max}.',
    rangeUnderflow: 'Eingabe ist zu klein! Minimaler Wert: {min}.',
    tooLong: 'Eingabe ist zu lang! Maximale Länge: {maxLength}.',
    tooShort: 'Eingabe ist zu kurz! Minimale Länge: {minLength}.',
    typeMismatch: {
      email: 'Bitte gebe eine gültige Emailadresse ein!',
      unknown: 'Ungültige Eingabe für Type {type}!'
    },
    unknown: 'Unbekannter Validierungsfehler!',
    valueMissing: 'Dieses Feld ist notwendig!',
  },
  value: {
    delete: {
      reallyDelete: 'Diesen Wert wirklich löschen?',
    },
    edit: {
      button: 'Speichern',
      modalTitle: 'Wert bearbeiten',
    },
    list: {
      actions: 'Aktionen',
      createdAt: 'Erstellt am',
      updatedAt: 'Letztes Update',
    },
    model: {
      labelId: 'Label',
      value: 'Wert',
    },
  },
  userinfo: {
    model: {
      displayName: 'Anzeigename',
      email: 'Email',
      name: 'Name',
    },
    password: 'Passwort',
    passwordRepeat: 'Passwort (wiederholen)',
    passwordsDoNotMatch: 'Passwörter stimmen nicht überein',
  },
};

export const datetimeFormatsDe = {
  date: {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  },
  datetime: {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  },
  datetimeSeconds: {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    seconds: '2-digit',
  },
};